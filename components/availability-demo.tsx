"use client";

import Image from "next/image";
import { startTransition, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import expandArrowsIcon from "@/expand-arrows.png";
import { DatePillInput } from "@/components/date-pill-input";
import {
  formatDateInputValue,
  formatLongDateValue,
  getExtendedRentalWindowMessage,
  getIncludedReturnDate,
  getRentalBlockCount,
  getRentalWindowLength,
  getStandardRentalWindowMessage,
  type FulfillmentMethod,
} from "@/lib/dhol-checkout";
import { siteConfig } from "@/lib/site-content";

const subscribeToDateWindow = () => () => {};

export function AvailabilityDemo() {
  const router = useRouter();
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [hasSelectedDates, setHasSelectedDates] = useState(false);
  const todayDate = useSyncExternalStore(
    subscribeToDateWindow,
    () => formatDateInputValue(new Date()),
    () => "",
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
  const rentalBlockCount = getRentalBlockCount(rentalWindowLength);
  const continueButtonLabel = "Continue to setup builder";

  const dateLabel = isDelivery ? "Delivery date" : "Pickup date";
  const returnLabel = isDelivery
    ? "Return date (Date you want us to pickup)"
    : "Return date";
  const handleContinue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedStartDate || !selectedReturnDate || isReturnBeforeStart) {
      return;
    }

    const searchParams = new URLSearchParams({
      fulfillmentMethod,
      pickupDate: selectedStartDate,
      returnDate: selectedReturnDate,
    });

    startTransition(() => {
      router.push(`/get-started?${searchParams.toString()}`);
    });
  };

  return (
    <section
      aria-labelledby="availability-title"
      className="rounded-[2.4rem] border border-ink/10 bg-paper/95 p-6 shadow-[0_30px_90px_-55px_rgba(34,30,71,0.55)] backdrop-blur sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-5">
        <div>
          <h2
            id="availability-title"
            className="font-display text-[clamp(2.8rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.05em] text-indigo"
          >
            Pick your dates
          </h2>
        </div>

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
                    setHasSelectedDates(false);
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {isDelivery ? (
          <div className="rounded-[1.5rem] border border-ink/8 bg-cream px-5 py-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
              Delivery
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/78 sm:text-base">
              We deliver within NYC and Long Island for a flat fee of $200.
            </p>
          </div>
        ) : (
          <a
            className="group inline-flex w-full items-center justify-between gap-4 rounded-[1.5rem] border border-ink/8 bg-cream px-5 py-4 text-left transition hover:border-indigo/18 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            href={siteConfig.pickupMapUrl}
            rel="noreferrer"
            target="_blank"
          >
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
                Pickup address
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/78 sm:text-base">
                {siteConfig.pickupArea}
              </p>
            </div>
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-indigo shadow-[0_16px_32px_-24px_rgba(34,30,71,0.3)] transition duration-200 group-hover:-translate-y-0.5 group-hover:border-indigo/18 group-hover:bg-indigo group-hover:text-paper group-hover:shadow-[0_22px_38px_-24px_rgba(34,30,71,0.42)]">
              <Image
                alt=""
                aria-hidden="true"
                className="h-3.5 w-3.5 object-contain opacity-90 transition duration-200 group-hover:brightness-0 group-hover:invert"
                src={expandArrowsIcon}
              />
            </span>
          </a>
        )}
      </div>

      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!selectedStartDate || !selectedReturnDate || isReturnBeforeStart) {
            return;
          }

          setHasSelectedDates(true);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <DatePillInput
            label={dateLabel}
            min={todayDate || undefined}
            name="pickup-date"
            onChange={(nextPickupDate) => {
              setPickupDate(nextPickupDate);
              setHasSelectedDates(false);
            }}
            required
            value={selectedStartDate}
          />
          <DatePillInput
            invalid={showDateWarning}
            label={returnLabel}
            min={selectedStartDate || todayDate || undefined}
            name="return-date"
            onChange={(nextReturnDate) => {
              setReturnDate(
                nextReturnDate === recommendedReturnDate ? "" : nextReturnDate,
              );
              setHasSelectedDates(false);
            }}
            rangeStart={selectedStartDate}
            required
            value={selectedReturnDate}
          />
        </div>

        {showDateWarning ? (
          <div className="rounded-[1.5rem] border border-rose-300/80 bg-rose-50/80 px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-paper text-rose-600">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8.4V13.2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                  <circle cx="12" cy="16.8" fill="currentColor" r="1" />
                  <path
                    d="M10.2 4.6L3.7 15.9A2 2 0 0 0 5.4 19h13.2a2 2 0 0 0 1.7-3.1L13.8 4.6a2 2 0 0 0-3.6 0Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-rose-700">
                  {isReturnBeforeStart
                    ? "Return date must be on or after your pickup or delivery date."
                    : getExtendedRentalWindowMessage(rentalBlockCount)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-ink/8 bg-cream px-4 py-4 text-sm leading-6 text-ink/72">
            {recommendedReturnDate
              ? getStandardRentalWindowMessage(recommendedReturnDate)
              : "The base rental rate covers 1 four-day block. Longer rentals are billed in additional 4-day blocks."}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            type="submit"
          >
            Save dates
          </button>
        </div>
      </form>

      {hasSelectedDates ? (
        <div
          aria-live="polite"
          className="mt-5 rounded-[1.6rem] border border-ink/8 bg-cream p-4"
        >
          <div className="space-y-4">
            <div className="rounded-[1.4rem] border border-mehendi/18 bg-mehendi/10 p-4">
              <p className="text-sm font-semibold text-mehendi">
                Dates saved for {isDelivery ? "delivery" : "pickup"} planning.
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/72">
                Continue into the setup builder. Final dhol availability is
                confirmed when you reach checkout.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-ink/8 bg-paper px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo/45">
                  Fulfillment
                </p>
                <p className="mt-2 text-sm font-semibold text-indigo">
                  {isDelivery ? "Delivery" : "Pickup"}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-ink/8 bg-paper px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo/45">
                  Start date
                </p>
                <p className="mt-2 text-sm font-semibold text-indigo">
                  {formatLongDateValue(selectedStartDate)}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-ink/8 bg-paper px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo/45">
                  Return date
                </p>
                <p className="mt-2 text-sm font-semibold text-indigo">
                  {formatLongDateValue(selectedReturnDate)}
                </p>
              </div>
            </div>

            <form onSubmit={handleContinue}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="pressable inline-flex items-center justify-center rounded-full bg-indigo px-5 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-indigo/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  type="submit"
                >
                  {continueButtonLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
