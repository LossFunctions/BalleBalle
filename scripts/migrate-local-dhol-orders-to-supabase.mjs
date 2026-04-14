import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in the environment.",
  );
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const filePath = path.join(process.cwd(), "data", "dhol-orders.json");
const fileContents = await readFile(filePath, "utf8");
const parsedFile = JSON.parse(fileContents);
const orders = Array.isArray(parsedFile?.orders) ? parsedFile.orders : [];

for (const order of orders) {
  const { error: orderError } = await supabase.from("orders").upsert({
    id: order.id,
    checkout_scope: order.checkoutScope ?? "dhol-pilot",
    status: order.status,
    stripe_session_id: order.stripeSessionId,
    stripe_payment_intent_id: order.stripePaymentIntentId,
    stripe_event_id: order.stripeEventId,
    checkout_url: order.checkoutUrl,
    stripe_error_message: order.stripeErrorMessage,
    customer_email: order.customer?.emailAddress ?? "",
    customer_name: order.customer?.fullName ?? "",
    customer_phone: order.customer?.mobileNumber ?? "",
    fulfillment_method: order.fulfillmentMethod,
    pickup_date: order.pickupDate,
    return_date: order.returnDate,
    delivery_street_address: order.deliveryAddress?.streetAddress ?? null,
    delivery_apartment: order.deliveryAddress?.apartment ?? null,
    delivery_city: order.deliveryAddress?.city ?? null,
    delivery_state_region: order.deliveryAddress?.stateRegion ?? null,
    delivery_zip_code: order.deliveryAddress?.zipCode ?? null,
    delivery_notes: order.deliveryAddress?.notes ?? null,
    item_subtotal_cents: Math.round((order.quote?.itemSubtotal ?? 0) * 100),
    delivery_fee_cents: Math.round((order.quote?.deliveryFee ?? 0) * 100),
    extended_rental_surcharge_cents: Math.round(
      (order.quote?.extendedRentalSurcharge ?? 0) * 100,
    ),
    total_cents: Math.round((order.quote?.total ?? 0) * 100),
    rental_window_length: order.quote?.rentalWindowLength ?? 4,
    rental_block_count: order.quote?.rentalBlockCount ?? 1,
    additional_rental_block_count:
      order.quote?.additionalRentalBlockCount ?? 0,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  });

  if (orderError) {
    throw new Error(
      `Unable to migrate order ${order.id}: ${orderError.message}`,
    );
  }

  const orderItems = Array.isArray(order.items) ? order.items : [];

  if (orderItems.length === 0) {
    continue;
  }

  const { error: orderItemsError } = await supabase.from("order_items").upsert(
    orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      title_snapshot: item.title,
      subtitle_snapshot: item.subtitle,
      image_src_snapshot: item.imageSrc,
      quantity: item.quantity,
      unit_amount_cents: Math.round(item.unitAmount * 100),
      line_total_cents: Math.round(item.lineTotal * 100),
    })),
    {
      onConflict: "order_id,product_id",
    },
  );

  if (orderItemsError) {
    throw new Error(
      `Unable to migrate order items for ${order.id}: ${orderItemsError.message}`,
    );
  }
}

console.log(`Migrated ${orders.length} local dhol order(s) to Supabase.`);
