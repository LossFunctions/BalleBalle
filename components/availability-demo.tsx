"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site-content";

type FulfillmentMethod = "pickup" | "delivery";

const fieldClassName =
  "mt-2 w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus-visible:border-indigo focus-visible:ring-2 focus-visible:ring-indigo/20";

export function AvailabilityDemo() {
  const router = useRouter();
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>("pickup");
  const [pickupDate, setPickupDate] = useState("2026-06-12");
  const [returnDate, setReturnDate] = useState("2026-06-15");
  const [hasSelectedDates, setHasSelectedDates] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState("");

  const isDelivery = fulfillmentMethod === "delivery";
  const canReserve =
    fullName.trim().length > 0 &&
    mobileNumber.trim().length > 0 &&
    (!isDelivery ||
      (emailAddress.trim().length > 0 && deliveryDetails.trim().length > 0));
  const reserveButtonLabel = isDelivery
    ? "Reserve this setup for delivery"
    : "Reserve this setup for pickup";

  const dateLabel = isDelivery ? "Delivery date" : "Pickup date";
  const returnLabel = isDelivery
    ? "Return date (Date you want us to pickup)"
    : "Return date";

  const handleReserve = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canReserve) {
      return;
    }

    startTransition(() => {
      router.push("/get-started");
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
            Select dates
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

                    if (option === "pickup") {
                      setEmailAddress("");
                      setDeliveryDetails("");
                    }
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
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-indigo transition group-hover:-translate-y-0.5 group-hover:border-indigo/18">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 17L17 7M10 7H17V14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.85"
                />
                <path
                  d="M15 17H8a1 1 0 0 1-1-1V9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.85"
                />
              </svg>
            </span>
          </a>
        )}
      </div>

      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          setHasSelectedDates(true);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-ink/78">
            {dateLabel}
            <input
              className={fieldClassName}
              name="pickup-date"
              type="date"
              value={pickupDate}
              onChange={(event) => setPickupDate(event.target.value)}
            />
          </label>
          <label className="text-sm text-ink/78">
            {returnLabel}
            <input
              className={fieldClassName}
              name="return-date"
              type="date"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            type="submit"
          >
            Select dates
          </button>
        </div>
      </form>

      <div
        aria-live="polite"
        className="mt-5 rounded-[1.6rem] border border-ink/8 bg-cream p-4"
      >
        {!hasSelectedDates ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-indigo">
              Select your dates to continue.
            </p>
            <p className="text-sm leading-6 text-ink/70">
              Choose pickup or delivery first, then lock in the dates you want
              for your rental window.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[1.4rem] border border-mehendi/18 bg-mehendi/10 p-4">
              <p className="text-sm font-semibold text-mehendi">
                These dates are available for{" "}
                {isDelivery ? "delivery" : "pickup"}.
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/72">
                Complete your details below and continue into the setup flow.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleReserve}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-ink/78">
                  Full name
                  <input
                    className={fieldClassName}
                    name="customer-name"
                    required
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>
                <label className="text-sm text-ink/78">
                  Mobile number
                  <input
                    className={fieldClassName}
                    name="customer-mobile"
                    required
                    type="tel"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.target.value)}
                  />
                </label>

                {isDelivery ? (
                  <>
                    <label className="text-sm text-ink/78">
                      Email address
                      <input
                        className={fieldClassName}
                        name="customer-email"
                        required
                        type="email"
                        value={emailAddress}
                        onChange={(event) => setEmailAddress(event.target.value)}
                      />
                    </label>
                    <label className="text-sm text-ink/78 sm:col-span-2">
                      Event address and delivery details
                      <textarea
                        className={`${fieldClassName} min-h-28 resize-y`}
                        name="delivery-details"
                        required
                        value={deliveryDetails}
                        onChange={(event) => setDeliveryDetails(event.target.value)}
                      />
                    </label>
                  </>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="pressable inline-flex items-center justify-center rounded-full bg-indigo px-5 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-indigo/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canReserve}
                  type="submit"
                >
                  {reserveButtonLabel}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
