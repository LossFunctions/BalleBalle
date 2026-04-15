import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createDholQuoteFromCatalog,
  encodeDholCartItems,
  formatLongDateValue,
  getMissingDholCartItemIds,
  isFulfillmentMethod,
  type DholCartItem,
  type DholCheckoutInput,
} from "@/lib/dhol-checkout";
import { getDholProductsByIds } from "@/lib/dhol-product-store";
import {
  assertDholAvailability,
  attachStripeCheckoutSessionToOrder,
  createDholOrderDraft,
  markDholOrderCheckoutFailed,
} from "@/lib/dhol-order-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutSessionCreateParams = NonNullable<
  Parameters<ReturnType<typeof getStripe>["checkout"]["sessions"]["create"]>[0]
>;
type CheckoutSessionLineItem = NonNullable<
  CheckoutSessionCreateParams["line_items"]
>[number];

const getString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const getCartItems = (value: unknown): DholCartItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;

      return {
        id: getString(candidate.id),
        quantity: Number(candidate.quantity),
      };
    })
    .filter((item): item is DholCartItem => item !== null);
};

const createCancelUrl = (
  origin: string,
  input: Pick<
    DholCheckoutInput,
    "items" | "pickupDate" | "returnDate" | "fulfillmentMethod"
  >,
) => {
  const searchParams = new URLSearchParams({
    canceled: "1",
    items: encodeDholCartItems(input.items),
    pickupDate: input.pickupDate,
    returnDate: input.returnDate,
    fulfillmentMethod: input.fulfillmentMethod,
  });

  return `${origin}/checkout?${searchParams.toString()}`;
};

const toMetadataValue = (value?: string) => value?.trim().slice(0, 500) ?? "";

const createLineItems = (
  origin: string,
  quote: ReturnType<typeof createDholQuoteFromCatalog>,
  input: Pick<
    DholCheckoutInput,
    "pickupDate" | "returnDate" | "fulfillmentMethod"
  >,
): CheckoutSessionLineItem[] => {
  const formattedPickupDate = formatLongDateValue(input.pickupDate);
  const formattedReturnDate = formatLongDateValue(input.returnDate);
  const lineItems: CheckoutSessionLineItem[] = quote.cartItems.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: "usd",
      unit_amount: item.unitAmount * 100,
      product_data: {
        name: `${item.title} dhol rental`,
        description: `${item.subtitle} • ${formattedPickupDate} to ${formattedReturnDate} • ${input.fulfillmentMethod}`,
        images: [new URL(item.imageSrc, origin).toString()],
      },
    },
  }));

  if (quote.deliveryFee > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: quote.deliveryFee * 100,
        product_data: {
          name: "Delivery within NYC / Long Island",
        },
      },
    });
  }

  if (quote.extendedRentalSurcharge > 0) {
    lineItems.push({
      quantity: quote.additionalRentalBlockCount,
      price_data: {
        currency: "usd",
        unit_amount: quote.itemSubtotal * 100,
        product_data: {
          name:
            quote.additionalRentalBlockCount === 1
              ? "Additional 4-day rental block"
              : "Additional 4-day rental blocks",
          description: `Rental window exceeds the included ${formatLongDateValue(quote.includedReturnDate)} return date.`,
        },
      },
    });
  }

  return lineItems;
};

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "The checkout request body was invalid." },
      { status: 400 },
    );
  }

  const fulfillmentMethodValue = getString(payload.fulfillmentMethod);
  const input: DholCheckoutInput = {
    items: getCartItems(payload.items),
    fulfillmentMethod: isFulfillmentMethod(fulfillmentMethodValue)
      ? fulfillmentMethodValue
      : "pickup",
    pickupDate: getString(payload.pickupDate),
    returnDate: getString(payload.returnDate),
    fullName: getString(payload.fullName),
    emailAddress: getString(payload.emailAddress),
    mobileNumber: getString(payload.mobileNumber),
    deliveryStreetAddress: getString(payload.deliveryStreetAddress),
    deliveryApartment: getString(payload.deliveryApartment),
    deliveryCity: getString(payload.deliveryCity),
    deliveryStateRegion: getString(payload.deliveryStateRegion),
    deliveryZipCode: getString(payload.deliveryZipCode),
    deliveryNotes: getString(payload.deliveryNotes),
  };

  let quote: ReturnType<typeof createDholQuoteFromCatalog>;

  try {
    const liveCatalog = await getDholProductsByIds(
      input.items.map((item) => item.id),
    );
    const missingItemIds = getMissingDholCartItemIds(input.items, liveCatalog);

    if (missingItemIds.length > 0) {
      return NextResponse.json(
        {
          error:
            missingItemIds.length === 1
              ? "One selected dhol is no longer available in live inventory."
              : "Some selected dhols are no longer available in live inventory.",
        },
        { status: 409 },
      );
    }

    quote = createDholQuoteFromCatalog({
      catalog: liveCatalog,
      ...input,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to price this checkout.";
    const status =
      message.startsWith("Missing ") ||
      message.includes("Supabase") ||
      message.includes("inventory is not configured")
        ? 503
        : 400;

    return NextResponse.json({ error: message }, { status });
  }

  const orderId = randomUUID();

  try {
    await assertDholAvailability({
      input,
      quote,
    });
    await createDholOrderDraft({
      input,
      orderId,
      quote,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create a dhol booking for these dates.";

    return NextResponse.json(
      { error: message },
      { status: message.includes("booked") || message.includes("available") ? 409 : 500 },
    );
  }

  try {
    const stripe = getStripe();
    const origin = new URL(request.url).origin;
    const dholCart = encodeDholCartItems(input.items);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      customer_email: input.emailAddress,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: createCancelUrl(origin, input),
      billing_address_collection: "auto",
      line_items: createLineItems(origin, quote, input),
      metadata: {
        checkout_scope: "dhol-pilot",
        dhol_cart: dholCart,
        order_id: orderId,
        pickup_date: input.pickupDate,
        return_date: input.returnDate,
        fulfillment_method: input.fulfillmentMethod,
        customer_name: toMetadataValue(input.fullName),
        customer_email: toMetadataValue(input.emailAddress),
        customer_phone: toMetadataValue(input.mobileNumber),
        delivery_street_address: toMetadataValue(input.deliveryStreetAddress),
        delivery_apartment: toMetadataValue(input.deliveryApartment),
        delivery_city: toMetadataValue(input.deliveryCity),
        delivery_state: toMetadataValue(input.deliveryStateRegion),
        delivery_zip: toMetadataValue(input.deliveryZipCode),
        delivery_notes: toMetadataValue(input.deliveryNotes),
      },
      payment_intent_data: {
        metadata: {
          checkout_scope: "dhol-pilot",
          dhol_cart: dholCart,
          order_id: orderId,
          pickup_date: input.pickupDate,
          return_date: input.returnDate,
          fulfillment_method: input.fulfillmentMethod,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    await attachStripeCheckoutSessionToOrder({
      checkoutUrl: session.url,
      orderId,
      stripeSessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Stripe could not create a checkout session.";

    await markDholOrderCheckoutFailed(orderId, message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
