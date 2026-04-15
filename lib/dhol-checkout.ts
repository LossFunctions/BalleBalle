import { customizeSteps } from "@/lib/site-content";

export const INCLUDED_RENTAL_DAYS = 4;
export const DELIVERY_FEE_AMOUNT = 200;
export const MAX_DHOL_QUANTITY = 10;

export type FulfillmentMethod = "pickup" | "delivery";

export type DholCartItem = {
  id: string;
  quantity: number;
};

export type DholCatalogItem = {
  active: boolean;
  id: string;
  title: string;
  subtitle: string;
  selectionSummary: string;
  imageSrc: string;
  imageAlt: string;
  inventoryCount: number;
  unitAmount: number;
};

export type DholCheckoutInput = {
  items: DholCartItem[];
  fulfillmentMethod: FulfillmentMethod;
  pickupDate: string;
  returnDate: string;
  fullName: string;
  emailAddress: string;
  mobileNumber: string;
  deliveryStreetAddress?: string;
  deliveryApartment?: string;
  deliveryCity?: string;
  deliveryStateRegion?: string;
  deliveryZipCode?: string;
  deliveryNotes?: string;
};

export type DholResolvedCartItem = DholCatalogItem & {
  quantity: number;
  lineTotal: number;
};

export type DholQuoteLine = {
  code: string;
  label: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
};

export type DholQuote = {
  additionalRentalBlockCount: number;
  cartItems: DholResolvedCartItem[];
  lines: DholQuoteLine[];
  itemSubtotal: number;
  deliveryFee: number;
  extendedRentalSurcharge: number;
  rentalBlockCount: number;
  total: number;
  rentalWindowLength: number;
  includedReturnDate: string;
  isExtendedRental: boolean;
};

const dholStep = customizeSteps.find((step) => step.id === "dhol");
const dholInventoryById: Record<string, number> = {
  "single-ivory": 1,
  "double-mixed": 1,
  "mirror-festival": 1,
};

if (!dholStep) {
  throw new Error("Missing dhol step configuration.");
}

export const dholCatalog: DholCatalogItem[] = dholStep.options.map((option) => ({
  active: true,
  id: option.id,
  title: option.title,
  subtitle: option.subtitle,
  selectionSummary: option.selectionSummary,
  imageSrc: option.image.src,
  imageAlt: option.image.alt,
  inventoryCount: dholInventoryById[option.id] ?? 1,
  unitAmount: option.pricePerDay ?? dholStep.pricePerDay,
}));

const createCatalogMap = (catalog: DholCatalogItem[]) =>
  new Map(catalog.map((item) => [item.id, item] as const));

export const isFulfillmentMethod = (
  value: unknown,
): value is FulfillmentMethod => value === "pickup" || value === "delivery";

export const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateInputValue = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export const isValidDateInputValue = (dateValue: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return false;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const parsedDate = parseDateInputValue(dateValue);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() + 1 === month &&
    parsedDate.getDate() === day
  );
};

const addDaysToDateValue = (dateValue: string, days: number) => {
  const nextDate = parseDateInputValue(dateValue);
  nextDate.setDate(nextDate.getDate() + days);

  return formatDateInputValue(nextDate);
};

export const getIncludedReturnDate = (dateValue: string) =>
  addDaysToDateValue(dateValue, INCLUDED_RENTAL_DAYS - 1);

export const formatLongDateValue = (dateValue: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(parseDateInputValue(dateValue));

export const getRentalWindowLength = (startDate: string, endDate: string) => {
  const start = parseDateInputValue(startDate);
  const end = parseDateInputValue(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  return Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
};

export const getRentalBlockCount = (rentalWindowLength: number) => {
  if (!Number.isFinite(rentalWindowLength) || rentalWindowLength < 1) {
    return 0;
  }

  return Math.ceil(rentalWindowLength / INCLUDED_RENTAL_DAYS);
};

export const getExtendedRentalWindowMessage = (rentalBlockCount: number) =>
  `Current return date will be billed as ${rentalBlockCount} ${
    rentalBlockCount === 1 ? "billing block" : "billing blocks"
  }. Every additional 4-day block recharges the base dhol rental rate.`;

export const getStandardRentalWindowMessage = (includedReturnDate: string) =>
  `The base rental rate covers 1 four-day block. The latest you can return to stay within the standard fee is ${formatLongDateValue(
    includedReturnDate,
  )}. Longer rentals are billed in additional 4-day blocks.`;

export const doDateRangesOverlap = (
  firstStartDate: string,
  firstEndDate: string,
  secondStartDate: string,
  secondEndDate: string,
) => {
  const firstStart = parseDateInputValue(firstStartDate).getTime();
  const firstEnd = parseDateInputValue(firstEndDate).getTime();
  const secondStart = parseDateInputValue(secondStartDate).getTime();
  const secondEnd = parseDateInputValue(secondEndDate).getTime();

  if (
    [firstStart, firstEnd, secondStart, secondEnd].some((value) =>
      Number.isNaN(value),
    )
  ) {
    return false;
  }

  return firstStart <= secondEnd && secondStart <= firstEnd;
};

export const encodeDholCartItems = (items: DholCartItem[]) =>
  resolveDholCartItems(items)
    .map((item) => `${item.id}:${item.quantity}`)
    .join(",");

export const decodeDholCartItems = (value?: string | null): DholCartItem[] => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [id, quantityValue] = part.split(":");
      const quantity = Number.parseInt(quantityValue ?? "", 10);

      return {
        id: id?.trim() ?? "",
        quantity: Number.isFinite(quantity) ? quantity : 0,
      };
    })
    .filter((item) => item.id.length > 0 && item.quantity > 0);
};

export const resolveDholCartItemsFromCatalog = (
  items: DholCartItem[],
  catalog: DholCatalogItem[],
) => {
  const quantityById = new Map<string, number>();
  const catalogById = createCatalogMap(catalog);

  for (const item of items) {
    const id = item.id.trim();
    const quantity = Math.trunc(item.quantity);

    if (!id || !Number.isFinite(quantity) || quantity < 1) {
      continue;
    }

    if (!catalogById.has(id)) {
      continue;
    }

    const nextQuantity = Math.min(
      MAX_DHOL_QUANTITY,
      (quantityById.get(id) ?? 0) + quantity,
    );
    quantityById.set(id, nextQuantity);
  }

  return Array.from(quantityById.entries()).map(([id, quantity]) => {
    const item = catalogById.get(id);

    if (!item) {
      throw new Error(`Unknown dhol item: ${id}`);
    }

    return {
      ...item,
      quantity,
      lineTotal: item.unitAmount * quantity,
    };
  });
};

export const resolveDholCartItems = (items: DholCartItem[]) =>
  resolveDholCartItemsFromCatalog(items, dholCatalog);

export const getMissingDholCartItemIds = (
  items: DholCartItem[],
  catalog: DholCatalogItem[],
) => {
  const catalogIds = new Set(catalog.map((item) => item.id));
  const requestedIds = new Set(
    items
      .map((item) => item.id.trim())
      .filter(Boolean),
  );

  return Array.from(requestedIds).filter((id) => !catalogIds.has(id));
};

export const createDholQuoteFromCatalog = ({
  catalog,
  items,
  fulfillmentMethod,
  pickupDate,
  returnDate,
}: Pick<
  DholCheckoutInput,
  "items" | "fulfillmentMethod" | "pickupDate" | "returnDate"
> & {
  catalog: DholCatalogItem[];
}): DholQuote => {
  if (!isValidDateInputValue(pickupDate) || !isValidDateInputValue(returnDate)) {
    throw new Error("Select valid pickup and return dates.");
  }

  const cartItems = resolveDholCartItemsFromCatalog(items, catalog);

  if (cartItems.length === 0) {
    throw new Error("Select at least one dhol item before checkout.");
  }

  const rentalWindowLength = getRentalWindowLength(pickupDate, returnDate);

  if (rentalWindowLength < 1) {
    throw new Error("Return date must be on or after the pickup date.");
  }

  const includedReturnDate = getIncludedReturnDate(pickupDate);
  const itemSubtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = fulfillmentMethod === "delivery" ? DELIVERY_FEE_AMOUNT : 0;
  const rentalBlockCount = getRentalBlockCount(rentalWindowLength);
  const additionalRentalBlockCount = Math.max(0, rentalBlockCount - 1);
  const isExtendedRental = additionalRentalBlockCount > 0;
  const extendedRentalSurcharge = itemSubtotal * additionalRentalBlockCount;
  const lines: DholQuoteLine[] = [
    ...cartItems.map((item) => ({
      code: item.id,
      label: `${item.title} dhol rental`,
      quantity: item.quantity,
      unitAmount: item.unitAmount,
      totalAmount: item.lineTotal,
    })),
  ];

  if (deliveryFee > 0) {
    lines.push({
      code: "delivery-fee",
      label: "Delivery within NYC / Long Island",
      quantity: 1,
      unitAmount: deliveryFee,
      totalAmount: deliveryFee,
    });
  }

  if (extendedRentalSurcharge > 0) {
    lines.push({
      code: "extended-rental",
      label:
        additionalRentalBlockCount === 1
          ? "Additional 4-day rental block"
          : "Additional 4-day rental blocks",
      quantity: additionalRentalBlockCount,
      unitAmount: itemSubtotal,
      totalAmount: extendedRentalSurcharge,
    });
  }

  return {
    additionalRentalBlockCount,
    cartItems,
    lines,
    itemSubtotal,
    deliveryFee,
    extendedRentalSurcharge,
    rentalBlockCount,
    total: itemSubtotal + deliveryFee + extendedRentalSurcharge,
    rentalWindowLength,
    includedReturnDate,
    isExtendedRental,
  };
};

export const createDholQuote = ({
  items,
  fulfillmentMethod,
  pickupDate,
  returnDate,
}: Pick<
  DholCheckoutInput,
  "items" | "fulfillmentMethod" | "pickupDate" | "returnDate"
>) =>
  createDholQuoteFromCatalog({
    catalog: dholCatalog,
    items,
    fulfillmentMethod,
    pickupDate,
    returnDate,
  });

export const validateDholCheckoutInput = (input: DholCheckoutInput) => {
  const errors: string[] = [];

  if (resolveDholCartItems(input.items).length === 0) {
    errors.push("Select at least one dhol item before checkout.");
  }

  if (!isFulfillmentMethod(input.fulfillmentMethod)) {
    errors.push("Choose pickup or delivery.");
  }

  if (!isValidDateInputValue(input.pickupDate)) {
    errors.push("Enter a valid pickup date.");
  }

  if (!isValidDateInputValue(input.returnDate)) {
    errors.push("Enter a valid return date.");
  }

  if (
    isValidDateInputValue(input.pickupDate) &&
    isValidDateInputValue(input.returnDate) &&
    getRentalWindowLength(input.pickupDate, input.returnDate) < 1
  ) {
    errors.push("Return date must be on or after the pickup date.");
  }

  if (input.fullName.trim().length === 0) {
    errors.push("Enter the customer name.");
  }

  if (input.emailAddress.trim().length === 0) {
    errors.push("Enter an email address.");
  }

  if (input.mobileNumber.trim().length === 0) {
    errors.push("Enter a mobile number.");
  }

  if (input.fulfillmentMethod === "delivery") {
    if (!input.deliveryStreetAddress?.trim()) {
      errors.push("Enter the delivery street address.");
    }

    if (!input.deliveryCity?.trim()) {
      errors.push("Enter the delivery city.");
    }

    if (!input.deliveryStateRegion?.trim()) {
      errors.push("Enter the delivery state.");
    }

    if (!input.deliveryZipCode?.trim()) {
      errors.push("Enter the delivery ZIP code.");
    }
  }

  return errors;
};
