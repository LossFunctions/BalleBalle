import { NextResponse } from "next/server";
import Stripe from "stripe";
import { synchronizePaidDholOrderFromSession } from "@/lib/dhol-order-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSignature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET." },
      { status: 500 },
    );
  }

  if (!stripeSignature) {
    return NextResponse.json(
      { error: "Missing Stripe signature header." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(
      payload,
      stripeSignature,
      webhookSecret,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Stripe webhook payload.";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    const synchronizedOrder = await synchronizePaidDholOrderFromSession({
      orderId: session.metadata?.order_id ?? "",
      stripeEventId: event.id,
      stripePaymentIntentId: paymentIntentId,
      stripeSessionId: session.id,
    });

    console.log("stripe.checkout.session.completed", {
      checkoutScope: session.metadata?.checkout_scope,
      customerEmail: session.customer_details?.email,
      orderId: synchronizedOrder?.id ?? session.metadata?.order_id,
      orderStatus: synchronizedOrder?.status,
      sessionId: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
