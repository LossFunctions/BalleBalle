import { randomUUID } from "node:crypto";

import {
  createDholQuoteFromCatalog,
  getIncludedReturnDate,
  type DholCatalogItem,
  type DholCheckoutInput,
  type DholQuote,
  type DholResolvedCartItem,
} from "@/lib/dhol-checkout";
import { getDholProductsByIds } from "@/lib/dhol-product-store";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type DholOrderStatus =
  | "checkout_pending"
  | "checkout_created"
  | "checkout_failed"
  | "paid"
  | "canceled"
  | "expired"
  | "refunded";

export type DholOrderRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: DholOrderStatus;
  checkoutScope: "dhol-pilot";
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeEventId: string | null;
  checkoutUrl: string | null;
  stripeErrorMessage: string | null;
  customer: {
    emailAddress: string;
    fullName: string;
    mobileNumber: string;
  };
  fulfillmentMethod: DholCheckoutInput["fulfillmentMethod"];
  pickupDate: string;
  returnDate: string;
  items: DholResolvedCartItem[];
  quote: DholQuote;
  deliveryAddress: {
    apartment: string;
    city: string;
    notes: string;
    stateRegion: string;
    streetAddress: string;
    zipCode: string;
  } | null;
};

type CreateDholOrderDraftArgs = {
  input: DholCheckoutInput;
  orderId?: string;
  quote: DholQuote;
};

type AttachStripeCheckoutSessionArgs = {
  checkoutUrl: string;
  orderId: string;
  stripeSessionId: string;
};

type MarkDholOrderPaidArgs = {
  orderId: string;
  stripeEventId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeSessionId?: string | null;
};

type ProductJoinRow = {
  image_alt: string;
  inventory_count: number;
  selection_summary: string;
} | null;

type OrderItemRow = {
  image_src_snapshot: string;
  line_total_cents: number;
  product_id: string;
  products?: ProductJoinRow;
  quantity: number;
  subtitle_snapshot: string;
  title_snapshot: string;
  unit_amount_cents: number;
};

type OrderRow = {
  additional_rental_block_count: number;
  checkout_scope: string;
  checkout_url: string | null;
  created_at: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  delivery_apartment: string | null;
  delivery_city: string | null;
  delivery_fee_cents: number;
  delivery_notes: string | null;
  delivery_state_region: string | null;
  delivery_street_address: string | null;
  delivery_zip_code: string | null;
  extended_rental_surcharge_cents: number;
  fulfillment_method: DholCheckoutInput["fulfillmentMethod"];
  id: string;
  item_subtotal_cents: number;
  order_items: OrderItemRow[];
  pickup_date: string;
  rental_block_count: number;
  rental_window_length: number;
  return_date: string;
  status: DholOrderStatus;
  stripe_error_message: string | null;
  stripe_event_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  total_cents: number;
  updated_at: string;
};

const CHECKOUT_SCOPE = "dhol-pilot";

const toCents = (amount: number) => Math.round(amount * 100);

const orderSelection = `
  id,
  checkout_scope,
  status,
  stripe_session_id,
  stripe_payment_intent_id,
  stripe_event_id,
  checkout_url,
  stripe_error_message,
  customer_email,
  customer_name,
  customer_phone,
  fulfillment_method,
  pickup_date,
  return_date,
  delivery_street_address,
  delivery_apartment,
  delivery_city,
  delivery_state_region,
  delivery_zip_code,
  delivery_notes,
  item_subtotal_cents,
  delivery_fee_cents,
  extended_rental_surcharge_cents,
  total_cents,
  rental_window_length,
  rental_block_count,
  additional_rental_block_count,
  created_at,
  updated_at,
  order_items(
    product_id,
    title_snapshot,
    subtitle_snapshot,
    image_src_snapshot,
    quantity,
    unit_amount_cents,
    line_total_cents,
    products(
      selection_summary,
      image_alt,
      inventory_count
    )
  )
`;

const mapOrderItemRowToResolvedCartItem = (row: OrderItemRow): DholResolvedCartItem => ({
  active: true,
  id: row.product_id,
  title: row.title_snapshot,
  subtitle: row.subtitle_snapshot,
  selectionSummary: row.products?.selection_summary ?? row.title_snapshot,
  imageSrc: row.image_src_snapshot,
  imageAlt: row.products?.image_alt ?? row.title_snapshot,
  inventoryCount: row.products?.inventory_count ?? 0,
  unitAmount: row.unit_amount_cents / 100,
  quantity: row.quantity,
  lineTotal: row.line_total_cents / 100,
});

const buildQuoteFromOrderRow = (
  row: OrderRow,
  items: DholResolvedCartItem[],
): DholQuote => {
  const lines = items.map((item) => ({
    code: item.id,
    label: `${item.title} dhol rental`,
    quantity: item.quantity,
    unitAmount: item.unitAmount,
    totalAmount: item.lineTotal,
  }));

  if (row.delivery_fee_cents > 0) {
    lines.push({
      code: "delivery-fee",
      label: "Delivery within NYC / Long Island",
      quantity: 1,
      unitAmount: row.delivery_fee_cents / 100,
      totalAmount: row.delivery_fee_cents / 100,
    });
  }

  if (row.extended_rental_surcharge_cents > 0) {
    lines.push({
      code: "extended-rental",
      label:
        row.additional_rental_block_count === 1
          ? "Additional 4-day rental block"
          : "Additional 4-day rental blocks",
      quantity: row.additional_rental_block_count,
      unitAmount: row.item_subtotal_cents / 100,
      totalAmount: row.extended_rental_surcharge_cents / 100,
    });
  }

  return {
    additionalRentalBlockCount: row.additional_rental_block_count,
    cartItems: items,
    lines,
    itemSubtotal: row.item_subtotal_cents / 100,
    deliveryFee: row.delivery_fee_cents / 100,
    extendedRentalSurcharge: row.extended_rental_surcharge_cents / 100,
    includedReturnDate: getIncludedReturnDate(row.pickup_date),
    isExtendedRental: row.additional_rental_block_count > 0,
    rentalBlockCount: row.rental_block_count,
    rentalWindowLength: row.rental_window_length,
    total: row.total_cents / 100,
  };
};

const buildDholOrderRecord = (row: OrderRow): DholOrderRecord => {
  const items = (row.order_items ?? []).map(mapOrderItemRowToResolvedCartItem);
  const quote = buildQuoteFromOrderRow(row, items);

  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    checkoutScope: CHECKOUT_SCOPE,
    stripeSessionId: row.stripe_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    stripeEventId: row.stripe_event_id,
    checkoutUrl: row.checkout_url,
    stripeErrorMessage: row.stripe_error_message,
    customer: {
      emailAddress: row.customer_email,
      fullName: row.customer_name,
      mobileNumber: row.customer_phone,
    },
    fulfillmentMethod: row.fulfillment_method,
    pickupDate: row.pickup_date,
    returnDate: row.return_date,
    items,
    quote,
    deliveryAddress:
      row.fulfillment_method === "delivery"
        ? {
            apartment: row.delivery_apartment ?? "",
            city: row.delivery_city ?? "",
            notes: row.delivery_notes ?? "",
            stateRegion: row.delivery_state_region ?? "",
            streetAddress: row.delivery_street_address ?? "",
            zipCode: row.delivery_zip_code ?? "",
          }
        : null,
  };
};

const getOrderByColumn = async (column: "id" | "stripe_session_id", value: string) => {
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select(orderSelection)
    .eq("checkout_scope", CHECKOUT_SCOPE)
    .eq(column, value)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load dhol order: ${error.message}`);
  }

  return data ? buildDholOrderRecord(data as unknown as OrderRow) : null;
};

export const createDholOrderDraft = async ({
  input,
  orderId,
  quote,
}: CreateDholOrderDraftArgs) => {
  const nextOrderId = orderId ?? randomUUID();
  const deliveryAddress =
    input.fulfillmentMethod === "delivery"
      ? {
          delivery_apartment: input.deliveryApartment?.trim() ?? "",
          delivery_city: input.deliveryCity?.trim() ?? "",
          delivery_notes: input.deliveryNotes?.trim() ?? "",
          delivery_state_region: input.deliveryStateRegion?.trim() ?? "",
          delivery_street_address: input.deliveryStreetAddress?.trim() ?? "",
          delivery_zip_code: input.deliveryZipCode?.trim() ?? "",
        }
      : {
          delivery_apartment: null,
          delivery_city: null,
          delivery_notes: null,
          delivery_state_region: null,
          delivery_street_address: null,
          delivery_zip_code: null,
        };

  const { error: orderInsertError } = await getSupabaseAdmin()
    .from("orders")
    .insert({
      id: nextOrderId,
      checkout_scope: CHECKOUT_SCOPE,
      status: "checkout_pending",
      customer_email: input.emailAddress.trim(),
      customer_name: input.fullName.trim(),
      customer_phone: input.mobileNumber.trim(),
      fulfillment_method: input.fulfillmentMethod,
      pickup_date: input.pickupDate,
      return_date: input.returnDate,
      item_subtotal_cents: toCents(quote.itemSubtotal),
      delivery_fee_cents: toCents(quote.deliveryFee),
      extended_rental_surcharge_cents: toCents(quote.extendedRentalSurcharge),
      total_cents: toCents(quote.total),
      rental_window_length: quote.rentalWindowLength,
      rental_block_count: quote.rentalBlockCount,
      additional_rental_block_count: quote.additionalRentalBlockCount,
      ...deliveryAddress,
    });

  if (orderInsertError) {
    throw new Error(`Unable to create the Supabase order draft: ${orderInsertError.message}`);
  }

  const { error: orderItemsError } = await getSupabaseAdmin()
    .from("order_items")
    .insert(
      quote.cartItems.map((item) => ({
        order_id: nextOrderId,
        product_id: item.id,
        title_snapshot: item.title,
        subtitle_snapshot: item.subtitle,
        image_src_snapshot: item.imageSrc,
        quantity: item.quantity,
        unit_amount_cents: toCents(item.unitAmount),
        line_total_cents: toCents(item.lineTotal),
      })),
    );

  if (orderItemsError) {
    throw new Error(`Unable to create the Supabase order items: ${orderItemsError.message}`);
  }

  const createdOrder = await findDholOrderById(nextOrderId);

  if (!createdOrder) {
    throw new Error("The Supabase order draft was created but could not be reloaded.");
  }

  return createdOrder;
};

export const attachStripeCheckoutSessionToOrder = async ({
  checkoutUrl,
  orderId,
  stripeSessionId,
}: AttachStripeCheckoutSessionArgs) => {
  const { error } = await getSupabaseAdmin()
    .from("orders")
    .update({
      checkout_url: checkoutUrl,
      status: "checkout_created",
      stripe_error_message: null,
      stripe_session_id: stripeSessionId,
    })
    .eq("id", orderId)
    .eq("checkout_scope", CHECKOUT_SCOPE);

  if (error) {
    throw new Error(`Unable to attach Stripe checkout session: ${error.message}`);
  }

  return findDholOrderById(orderId);
};

export const markDholOrderCheckoutFailed = async (
  orderId: string,
  stripeErrorMessage: string,
) => {
  const { error } = await getSupabaseAdmin()
    .from("orders")
    .update({
      status: "checkout_failed",
      stripe_error_message: stripeErrorMessage,
    })
    .eq("id", orderId)
    .eq("checkout_scope", CHECKOUT_SCOPE);

  if (error) {
    throw new Error(`Unable to mark the Supabase order as failed: ${error.message}`);
  }

  return findDholOrderById(orderId);
};

export const listDholOrders = async () => {
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select(orderSelection)
    .eq("checkout_scope", CHECKOUT_SCOPE)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to list dhol orders from Supabase: ${error.message}`);
  }

  return (data as unknown as OrderRow[]).map(buildDholOrderRecord);
};

export const findDholOrderById = async (orderId: string) =>
  getOrderByColumn("id", orderId);

export const findDholOrderByStripeSessionId = async (stripeSessionId: string) =>
  getOrderByColumn("stripe_session_id", stripeSessionId);

export const markDholOrderPaid = async ({
  orderId,
  stripeEventId,
  stripePaymentIntentId,
  stripeSessionId,
}: MarkDholOrderPaidArgs) => {
  if (!orderId) {
    return null;
  }

  const { error } = await getSupabaseAdmin()
    .from("orders")
    .update({
      status: "paid",
      stripe_error_message: null,
      ...(stripeEventId ? { stripe_event_id: stripeEventId } : {}),
      ...(stripePaymentIntentId
        ? { stripe_payment_intent_id: stripePaymentIntentId }
        : {}),
      ...(stripeSessionId ? { stripe_session_id: stripeSessionId } : {}),
    })
    .eq("id", orderId)
    .eq("checkout_scope", CHECKOUT_SCOPE);

  if (error) {
    throw new Error(`Unable to mark the Supabase order as paid: ${error.message}`);
  }

  return findDholOrderById(orderId);
};

export const synchronizePaidDholOrderFromSession = async ({
  orderId,
  stripeEventId,
  stripePaymentIntentId,
  stripeSessionId,
}: MarkDholOrderPaidArgs) => {
  if (!orderId) {
    return null;
  }

  return markDholOrderPaid({
    orderId,
    stripeEventId,
    stripePaymentIntentId,
    stripeSessionId,
  });
};

export type DholAvailabilityConflict = {
  availableQuantity: number;
  itemId: string;
  requestedQuantity: number;
  reservedQuantity: number;
  title: string;
};

export const getDholAvailabilityConflicts = async ({
  items,
  pickupDate,
  returnDate,
}: Pick<DholCheckoutInput, "pickupDate" | "returnDate"> & {
  items: Pick<DholResolvedCartItem, "id" | "quantity" | "title">[];
}) => {
  const requestedProductIds = Array.from(new Set(items.map((item) => item.id)));
  const currentProducts = await getDholProductsByIds(requestedProductIds);
  const productsById = new Map(
    currentProducts.map((product) => [product.id, product] as const),
  );

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("id, order_items(product_id, quantity, title_snapshot)")
    .eq("checkout_scope", CHECKOUT_SCOPE)
    .eq("status", "paid")
    .lte("pickup_date", returnDate)
    .gte("return_date", pickupDate);

  if (error) {
    throw new Error(`Unable to check Supabase availability: ${error.message}`);
  }

  const reservedQuantityByProductId = new Map<string, number>();

  for (const order of (data ?? []) as Array<{
    order_items: Array<{
      product_id: string;
      quantity: number;
      title_snapshot: string;
    }>;
  }>) {
    for (const orderItem of order.order_items ?? []) {
      reservedQuantityByProductId.set(
        orderItem.product_id,
        (reservedQuantityByProductId.get(orderItem.product_id) ?? 0) +
          orderItem.quantity,
      );
    }
  }

  return items.reduce<DholAvailabilityConflict[]>((conflicts, item) => {
    const product = productsById.get(item.id);
    const reservedQuantity = reservedQuantityByProductId.get(item.id) ?? 0;
    const availableQuantity = Math.max(
      0,
      (product?.inventoryCount ?? 0) - reservedQuantity,
    );

    if (item.quantity > availableQuantity) {
      conflicts.push({
        availableQuantity,
        itemId: item.id,
        requestedQuantity: item.quantity,
        reservedQuantity,
        title: item.title,
      });
    }

    return conflicts;
  }, []);
};

export const assertDholAvailability = async ({
  input,
  quote,
}: {
  input: Pick<DholCheckoutInput, "pickupDate" | "returnDate">;
  quote: Pick<DholQuote, "cartItems">;
}) => {
  const conflicts = await getDholAvailabilityConflicts({
    items: quote.cartItems,
    pickupDate: input.pickupDate,
    returnDate: input.returnDate,
  });

  if (conflicts.length === 0) {
    return;
  }

  const message = conflicts
    .map((conflict) => {
      if (conflict.availableQuantity <= 0) {
        return `${conflict.title} is already booked for those dates.`;
      }

      return `${conflict.title} only has ${conflict.availableQuantity} available for those dates.`;
    })
    .join(" ");

  throw new Error(message);
};

export const rebuildStoredDholOrderQuotes = async () => {
  const orders = await listDholOrders();
  const updatedOrders: DholOrderRecord[] = [];

  for (const order of orders) {
    const productIds = order.items.map((item) => item.id);
    const currentCatalog = await getDholProductsByIds(productIds);
    const fallbackCatalog = order.items.map<DholCatalogItem>((item) => ({
      active: true,
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      selectionSummary: item.selectionSummary,
      imageSrc: item.imageSrc,
      imageAlt: item.imageAlt,
      inventoryCount: item.inventoryCount,
      unitAmount: item.unitAmount,
    }));
    const catalogToUse = currentCatalog.length > 0 ? currentCatalog : fallbackCatalog;
    const recalculatedQuote = createDholQuoteFromCatalog({
      catalog: catalogToUse,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      fulfillmentMethod: order.fulfillmentMethod,
      pickupDate: order.pickupDate,
      returnDate: order.returnDate,
    });

    const { error: orderUpdateError } = await getSupabaseAdmin()
      .from("orders")
      .update({
        item_subtotal_cents: toCents(recalculatedQuote.itemSubtotal),
        delivery_fee_cents: toCents(recalculatedQuote.deliveryFee),
        extended_rental_surcharge_cents: toCents(
          recalculatedQuote.extendedRentalSurcharge,
        ),
        total_cents: toCents(recalculatedQuote.total),
        rental_window_length: recalculatedQuote.rentalWindowLength,
        rental_block_count: recalculatedQuote.rentalBlockCount,
        additional_rental_block_count:
          recalculatedQuote.additionalRentalBlockCount,
      })
      .eq("id", order.id)
      .eq("checkout_scope", CHECKOUT_SCOPE);

    if (orderUpdateError) {
      throw new Error(
        `Unable to rebuild Supabase order ${order.id}: ${orderUpdateError.message}`,
      );
    }

    updatedOrders.push((await findDholOrderById(order.id)) ?? order);
  }

  return updatedOrders;
};
