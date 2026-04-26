"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { DatePillInput } from "@/components/date-pill-input";
import {
  MAX_DHOL_QUANTITY,
  createDholQuoteFromCatalog,
  dholCatalog,
  formatDateInputValue,
  formatLongDateValue,
  getExtendedRentalWindowMessage,
  getRentalBlockCount,
  getIncludedReturnDate,
  getRentalWindowLength,
  getStandardRentalWindowMessage,
  resolveDholCartItemsFromCatalog,
  type DholCatalogItem,
  type DholCartItem,
  type FulfillmentMethod,
} from "@/lib/dhol-checkout";

type DholCheckoutFormProps = {
  catalog: DholCatalogItem[];
  cartItems: DholCartItem[];
  checkoutEnabled: boolean;
  initialFulfillmentMethod: FulfillmentMethod;
  initialPickupDate?: string;
  initialReturnDate?: string;
  unavailableReason?: string | null;
  wasCanceled?: boolean;
};

const fieldClassName =
  "mt-2 w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus-visible:border-indigo focus-visible:ring-2 focus-visible:ring-indigo/20";
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const subscribeToDateWindow = () => () => {};

type QuantityStepperProps = {
  decrementLabel: string;
  incrementLabel: string;
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
};

function QuantityStepper({
  decrementLabel,
  incrementLabel,
  onDecrement,
  onIncrement,
  quantity,
}: QuantityStepperProps) {
  const buttonClasses =
    "pressable inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo/10 bg-paper text-lg leading-none text-indigo shadow-[0_14px_30px_-20px_rgba(34,30,71,0.26)] transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="inline-flex items-center rounded-full border border-indigo/10 bg-paper p-1 shadow-[0_14px_30px_-22px_rgba(34,30,71,0.22)]">
      <button
        aria-label={decrementLabel}
        className={buttonClasses}
        disabled={quantity <= 0}
        onClick={onDecrement}
        type="button"
      >
        <span aria-hidden="true">−</span>
      </button>
      <span className="min-w-8 text-center text-xs font-semibold tabular-nums text-indigo/70">
        {quantity}
      </span>
      <button
        aria-label={incrementLabel}
        className={buttonClasses}
        disabled={quantity >= MAX_DHOL_QUANTITY}
        onClick={onIncrement}
        type="button"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

export function DholCheckoutForm({
  catalog,
  cartItems,
  checkoutEnabled,
  initialFulfillmentMethod,
  initialPickupDate,
  initialReturnDate,
  unavailableReason = null,
  wasCanceled = false,
}: DholCheckoutFormProps) {
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>(initialFulfillmentMethod);
  const [currentCartItems, setCurrentCartItems] = useState<DholCartItem[]>(cartItems);
  const [pickupDate, setPickupDate] = useState(initialPickupDate ?? "");
  const [returnDate, setReturnDate] = useState(initialReturnDate ?? "");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [deliveryStreetAddress, setDeliveryStreetAddress] = useState("");
  const [deliveryApartment, setDeliveryApartment] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryStateRegion, setDeliveryStateRegion] = useState("");
  const [deliveryZipCode, setDeliveryZipCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const todayDate = useSyncExternalStore(
    subscribeToDateWindow,
    () => formatDateInputValue(new Date()),
    () => "",
  );
  const selectedItems = resolveDholCartItemsFromCatalog(currentCartItems, catalog);
  const selectedItemCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const isDelivery = fulfillmentMethod === "delivery";
  const selectedStartDate = pickupDate || todayDate;
  const recommendedReturnDate = selectedStartDate
    ? getIncludedReturnDate(selectedStartDate)
    : "";
  const selectedReturnDate = returnDate || recommendedReturnDate;
  const rentalWindowLength =
    selectedStartDate && selectedReturnDate
      ? getRentalWindowLength(selectedStartDate, selectedReturnDate)
      : 0;
  const isReturnBeforeStart = rentalWindowLength < 1;
  const isOutsideIncludedWindow = rentalWindowLength > 4;
  const showDateWarning = Boolean(
    selectedStartDate &&
      selectedReturnDate &&
      (isReturnBeforeStart || isOutsideIncludedWindow),
  );

  let quoteError: string | null = null;
  let quote = null;

  try {
    quote = createDholQuoteFromCatalog({
      catalog,
      items: currentCartItems,
      fulfillmentMethod,
      pickupDate: selectedStartDate,
      returnDate: selectedReturnDate,
    });
  } catch (error) {
    quoteError = error instanceof Error ? error.message : "Unable to price this rental.";
  }

  const canSubmit =
    checkoutEnabled &&
    !isSubmitting &&
    !quoteError &&
    selectedItems.length > 0 &&
    fullName.trim().length > 0 &&
    emailAddress.trim().length > 0 &&
    mobileNumber.trim().length > 0 &&
    (!isDelivery ||
      (deliveryStreetAddress.trim().length > 0 &&
        deliveryCity.trim().length > 0 &&
        deliveryStateRegion.trim().length > 0 &&
        deliveryZipCode.trim().length > 0));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: currentCartItems,
          fulfillmentMethod,
          pickupDate: selectedStartDate,
          returnDate: selectedReturnDate,
          fullName,
          emailAddress,
          mobileNumber,
          deliveryStreetAddress,
          deliveryApartment,
          deliveryCity,
          deliveryStateRegion,
          deliveryZipCode,
          deliveryNotes,
        }),
      });
      const data = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !data.url) {
        setSubmitError(data.error ?? "Unable to start Stripe Checkout.");
        setIsSubmitting(false);
        return;
      }

      window.location.assign(data.url);
    } catch {
      setSubmitError("Unable to contact the checkout service right now.");
      setIsSubmitting(false);
    }
  };

  const updateCartItemQuantity = (itemId: string, nextQuantity: number) => {
    const normalizedQuantity = Math.max(0, Math.min(MAX_DHOL_QUANTITY, nextQuantity));

    setCurrentCartItems((currentItems) => {
      const nextItems = currentItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: normalizedQuantity }
            : item,
        )
        .filter((item) => item.quantity > 0);

      return nextItems;
    });
    setSubmitError(null);
  };

  const rentalBlockCount = quote?.rentalBlockCount ?? getRentalBlockCount(rentalWindowLength);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <section className="rounded-[2.4rem] border border-ink/10 bg-paper/95 p-6 shadow-[0_30px_90px_-55px_rgba(34,30,71,0.4)] sm:p-8">
        <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.05em] text-indigo">
            Secure checkout for selected dhol rentals.
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/72 sm:text-base">
            This pilot only bills the dhol items you selected. The broader setup
            flow remains available for planning, but only dhol rentals are wired
            to online payment right now.
          </p>
        </div>

        {!checkoutEnabled ? (
          <div className="mt-6 rounded-[1.6rem] border border-rose-300/70 bg-rose-50/80 p-4 text-sm leading-6 text-rose-900/82">
            {unavailableReason ??
              "Stripe is not configured yet. Add `STRIPE_SECRET_KEY` before using this checkout page."}
          </div>
        ) : null}

        {wasCanceled ? (
          <div className="mt-6 rounded-[1.6rem] border border-amber-300/70 bg-amber-50/80 p-4 text-sm leading-6 text-amber-900/82">
            Checkout was canceled. Your selected dhol items are still loaded
            below if you want to try again.
          </div>
        ) : null}

        <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo/55">
              Fulfillment
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["pickup", "delivery"] as const).map((option) => {
                const active = fulfillmentMethod === option;
                const label = option === "pickup" ? "Pickup" : "Delivery";

                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    className={`pressable rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                      active
                        ? "bg-indigo text-paper"
                        : "border border-ink/10 bg-cream text-ink/75 hover:border-indigo/20 hover:bg-paper"
                    }`}
                    onClick={() => {
                      setFulfillmentMethod(option);
                      setSubmitError(null);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {isDelivery ? (
              <p className="mt-3 text-sm leading-6 text-ink/64">
                Delivery within NYC and Long Island adds{" "}
                {currencyFormatter.format(200)}.
              </p>
            ) : null}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <DatePillInput
              label={isDelivery ? "Delivery date" : "Pickup date"}
              min={todayDate || undefined}
              onChange={(nextPickupDate) => {
                setPickupDate(nextPickupDate);
                setSubmitError(null);
              }}
              required
              value={selectedStartDate}
            />
            <DatePillInput
              label="Return date"
              min={selectedStartDate || todayDate || undefined}
              onChange={(nextReturnDate) => {
                setReturnDate(
                  nextReturnDate === recommendedReturnDate ? "" : nextReturnDate,
                );
                setSubmitError(null);
              }}
              rangeStart={selectedStartDate}
              required
              value={selectedReturnDate}
            />
          </div>

          {showDateWarning ? (
            <div className="rounded-[1.5rem] border border-rose-300/80 bg-rose-50/80 px-4 py-4 text-sm leading-6 text-rose-900/82">
              {isReturnBeforeStart
                ? "Return date must be on or after the pickup date."
                : getExtendedRentalWindowMessage(rentalBlockCount)}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-ink/8 bg-cream px-4 py-4 text-sm leading-6 text-ink/72">
              {recommendedReturnDate
                ? getStandardRentalWindowMessage(recommendedReturnDate)
                : "The base rental rate covers 1 four-day block. Longer rentals are billed in additional 4-day blocks."}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-ink/78">
              Full name
              <input
                className={fieldClassName}
                required
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
            <label className="text-sm text-ink/78">
              Email address
              <input
                autoComplete="email"
                className={fieldClassName}
                required
                type="email"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
              />
            </label>
            <label className="text-sm text-ink/78 sm:col-span-2">
              Mobile number
              <input
                autoComplete="tel"
                className={fieldClassName}
                required
                type="tel"
                value={mobileNumber}
                onChange={(event) => setMobileNumber(event.target.value)}
              />
            </label>

            {isDelivery ? (
              <>
                <label className="text-sm text-ink/78 sm:col-span-2">
                  Street address
                  <input
                    autoComplete="street-address"
                    className={fieldClassName}
                    required
                    type="text"
                    value={deliveryStreetAddress}
                    onChange={(event) => {
                      setDeliveryStreetAddress(event.target.value);
                      setSubmitError(null);
                    }}
                  />
                </label>
                <label className="text-sm text-ink/78">
                  Apartment, suite, etc.
                  <input
                    autoComplete="address-line2"
                    className={fieldClassName}
                    type="text"
                    value={deliveryApartment}
                    onChange={(event) => {
                      setDeliveryApartment(event.target.value);
                      setSubmitError(null);
                    }}
                  />
                </label>
                <label className="text-sm text-ink/78">
                  City
                  <input
                    autoComplete="address-level2"
                    className={fieldClassName}
                    required
                    type="text"
                    value={deliveryCity}
                    onChange={(event) => {
                      setDeliveryCity(event.target.value);
                      setSubmitError(null);
                    }}
                  />
                </label>
                <label className="text-sm text-ink/78">
                  State
                  <input
                    autoComplete="address-level1"
                    className={fieldClassName}
                    required
                    type="text"
                    value={deliveryStateRegion}
                    onChange={(event) => {
                      setDeliveryStateRegion(event.target.value);
                      setSubmitError(null);
                    }}
                  />
                </label>
                <label className="text-sm text-ink/78">
                  ZIP code
                  <input
                    autoComplete="postal-code"
                    className={fieldClassName}
                    required
                    type="text"
                    value={deliveryZipCode}
                    onChange={(event) => {
                      setDeliveryZipCode(event.target.value);
                      setSubmitError(null);
                    }}
                  />
                </label>
                <label className="text-sm text-ink/78 sm:col-span-2">
                  Additional delivery notes
                  <textarea
                    className={`${fieldClassName} min-h-24 resize-y`}
                    value={deliveryNotes}
                    onChange={(event) => {
                      setDeliveryNotes(event.target.value);
                      setSubmitError(null);
                    }}
                  />
                </label>
              </>
            ) : null}
          </div>

          {submitError ? (
            <div className="rounded-[1.5rem] border border-rose-300/80 bg-rose-50/80 px-4 py-4 text-sm leading-6 text-rose-900/82">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              className="text-sm font-medium text-indigo underline-offset-4 transition hover:text-indigo/80 hover:underline"
              href="/get-started"
            >
              Return to the setup builder
            </Link>
            <button
              className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSubmit}
              type="submit"
            >
              {isSubmitting ? "Redirecting..." : "Continue to secure payment"}
            </button>
          </div>
        </form>
      </section>

      <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
        <section className="rounded-[2rem] border border-ink/8 bg-cream p-5 shadow-[0_24px_60px_-44px_rgba(34,30,71,0.3)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-indigo/48">
                Your dhol cart
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                {selectedItemCount} dhol{selectedItemCount === 1 ? "" : "s"} loaded for checkout.
              </p>
            </div>
            <span className="rounded-full border border-indigo/10 bg-paper px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-indigo/58">
              Pilot
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {selectedItems.length === 0 ? (
              <div className="rounded-[1.5rem] border border-ink/8 bg-paper px-4 py-4 text-sm leading-6 text-ink/68">
                Your checkout cart is empty. Add dhol items from the setup builder
                before starting payment.
              </div>
            ) : null}
            {selectedItems.map((item) => {
              const catalogItem = catalog.find((catalogEntry) => catalogEntry.id === item.id)
                ?? dholCatalog.find((catalogEntry) => catalogEntry.id === item.id);

              return (
                <article
                  className="rounded-[1.5rem] border border-ink/8 bg-paper p-3"
                  key={item.id}
                >
                  <div className="flex gap-3">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.1rem] border border-ink/8 bg-white">
                      <Image
                        alt={catalogItem?.imageAlt ?? item.title}
                        className="object-contain p-2"
                        fill
                        sizes="96px"
                        src={catalogItem?.imageSrc ?? "/favicon.ico"}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-indigo">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink/66">
                        {item.subtitle}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-indigo/48">
                          {currencyFormatter.format(item.lineTotal)} per 4-day block
                        </p>
                        <QuantityStepper
                          decrementLabel={`Decrease quantity for ${item.title}`}
                          incrementLabel={`Increase quantity for ${item.title}`}
                          quantity={item.quantity}
                          onDecrement={() =>
                            updateCartItemQuantity(item.id, item.quantity - 1)
                          }
                          onIncrement={() =>
                            updateCartItemQuantity(item.id, item.quantity + 1)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-indigo/10 bg-paper p-5 shadow-[0_24px_60px_-44px_rgba(34,30,71,0.3)]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-indigo/48">
            Live total
          </p>
          {quote ? (
            <>
              <div className="mt-4 space-y-3">
                {quote.lines.map((line) => (
                  <div
                    className="flex items-start justify-between gap-4 text-sm text-ink/76"
                    key={line.code}
                  >
                    <div>
                      <p>{line.label}</p>
                      <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/42">
                        {line.quantity > 1
                          ? `${line.quantity} × ${currencyFormatter.format(line.unitAmount)}`
                          : line.code === "delivery-fee"
                            ? "Applied once"
                            : line.code === "extended-rental"
                              ? `1 × ${currencyFormatter.format(line.unitAmount)}`
                            : currencyFormatter.format(line.unitAmount)}
                      </p>
                    </div>
                    <span className="font-semibold text-indigo">
                      {currencyFormatter.format(line.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-ink/8 pt-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-ink/66">
                      {fulfillmentMethod === "delivery" ? "Delivery" : "Pickup"} •{" "}
                      {quote.rentalWindowLength} day rental window
                    </p>
                    <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/42">
                      Billed as {quote.rentalBlockCount} {quote.rentalBlockCount === 1 ? "4-day block" : "4-day blocks"} • Included return date{" "}
                      {formatLongDateValue(quote.includedReturnDate)}
                    </p>
                  </div>
                  <p className="font-display text-[2.4rem] leading-none tracking-[-0.05em] text-indigo">
                    {currencyFormatter.format(quote.total)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm leading-6 text-rose-700">{quoteError}</p>
          )}
        </section>
      </aside>
    </div>
  );
}
