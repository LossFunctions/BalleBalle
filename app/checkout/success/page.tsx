import Link from "next/link";
import Stripe from "stripe";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  findDholOrderById,
  findDholOrderByStripeSessionId,
  synchronizePaidDholOrderFromSession,
} from "@/lib/dhol-order-store";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckoutSuccessPageProps = {
  searchParams?: Promise<{
    session_id?: string | string[];
  }>;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = getSingleValue(resolvedSearchParams?.session_id);

  let checkoutSession = null;
  let lineItems: Stripe.LineItem[] | null = null;
  let localOrder = null;
  let errorMessage: string | null = null;

  if (!sessionId) {
    errorMessage = "Missing Stripe session ID.";
  } else if (!process.env.STRIPE_SECRET_KEY) {
    errorMessage = "Stripe is not configured.";
  } else {
    try {
      const stripe = getStripe();
      checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      const listedLineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
        limit: 20,
      });
      lineItems = listedLineItems.data;
      const paymentIntentId =
        typeof checkoutSession.payment_intent === "string"
          ? checkoutSession.payment_intent
          : checkoutSession.payment_intent?.id;

      if (
        checkoutSession.payment_status === "paid" &&
        checkoutSession.metadata?.order_id
      ) {
        await synchronizePaidDholOrderFromSession({
          orderId: checkoutSession.metadata.order_id,
          stripePaymentIntentId: paymentIntentId,
          stripeSessionId: checkoutSession.id,
        });
      }

      localOrder = checkoutSession.metadata?.order_id
        ? await findDholOrderById(checkoutSession.metadata.order_id)
        : await findDholOrderByStripeSessionId(checkoutSession.id);
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load the Stripe checkout session.";
    }
  }

  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="rounded-[2.4rem] border border-ink/10 bg-paper/95 p-8 shadow-[0_30px_90px_-55px_rgba(34,30,71,0.35)] sm:p-10">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
              Dhol Checkout Pilot
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.05em] text-indigo">
              {checkoutSession?.payment_status === "paid"
                ? "Payment received."
                : "Checkout received."}
            </h1>

            {errorMessage ? (
              <p className="mt-4 text-sm leading-7 text-rose-700 sm:text-base">
                {errorMessage}
              </p>
            ) : (
              <>
                <p className="mt-4 text-sm leading-7 text-ink/72 sm:text-base">
                  Stripe has recorded this order for the dhol checkout pilot.
                  Review the payment in Stripe Dashboard, and follow up with the
                  customer for final handoff details.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-ink/8 bg-cream p-5">
                    <p className="text-[0.72rem] uppercase tracking-[0.2em] text-indigo/48">
                      Order summary
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-ink/74">
                      <div className="flex justify-between gap-4">
                        <span>Booking status</span>
                        <span className="font-semibold text-indigo">
                          {localOrder?.status ?? "stripe-only"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Payment status</span>
                        <span className="font-semibold text-indigo">
                          {checkoutSession?.payment_status ?? "unknown"}
                        </span>
                      </div>
                      {localOrder ? (
                        <div className="flex justify-between gap-4">
                          <span>Order ID</span>
                          <span className="font-semibold text-indigo">
                            {localOrder.id}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex justify-between gap-4">
                        <span>Total</span>
                        <span className="font-semibold text-indigo">
                          {currencyFormatter.format(
                            (checkoutSession?.amount_total ?? 0) / 100,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Email</span>
                        <span className="font-semibold text-indigo">
                          {checkoutSession?.customer_details?.email ?? "Not captured"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Fulfillment</span>
                        <span className="font-semibold text-indigo">
                          {checkoutSession?.metadata?.fulfillment_method ?? "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Pickup date</span>
                        <span className="font-semibold text-indigo">
                          {checkoutSession?.metadata?.pickup_date ?? "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Return date</span>
                        <span className="font-semibold text-indigo">
                          {checkoutSession?.metadata?.return_date ?? "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-ink/8 bg-paper p-5">
                    <p className="text-[0.72rem] uppercase tracking-[0.2em] text-indigo/48">
                      Charged items
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-ink/74">
                      {lineItems?.map((lineItem) => (
                        <div
                          className="flex items-start justify-between gap-4"
                          key={lineItem.id}
                        >
                          <div>
                            <p className="font-medium text-indigo">
                              {lineItem.description}
                            </p>
                            <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/42">
                              Qty {lineItem.quantity ?? 1}
                            </p>
                          </div>
                          <span className="font-semibold text-indigo">
                            {currencyFormatter.format(
                              (lineItem.amount_total ?? 0) / 100,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                href="/get-started"
              >
                Return to the setup builder
              </Link>
              <Link
                className="pressable inline-flex items-center justify-center rounded-full border border-ink/10 bg-paper px-5 py-3 text-sm font-semibold text-indigo transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                href="/"
              >
                Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
