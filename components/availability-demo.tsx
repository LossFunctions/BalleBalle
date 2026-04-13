"use client";

import { useState } from "react";
import { siteConfig, type AvailabilityDemoState } from "@/lib/site-content";

const responseOptions: Array<{
  label: string;
  value: AvailabilityDemoState;
}> = [
  { label: "Idle", value: "idle" },
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
];

const fieldClassName =
  "mt-2 w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus-visible:border-indigo focus-visible:ring-2 focus-visible:ring-indigo/20";

export function AvailabilityDemo() {
  const [selectedState, setSelectedState] =
    useState<AvailabilityDemoState>("idle");
  const [currentState, setCurrentState] = useState<AvailabilityDemoState>("idle");

  return (
    <section
      aria-labelledby="availability-title"
      className="rounded-[2.4rem] border border-ink/10 bg-paper/95 p-6 shadow-[0_30px_90px_-55px_rgba(34,30,71,0.55)] backdrop-blur sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="availability-title"
              className="font-display text-[clamp(2.8rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.05em] text-indigo"
            >
              Check availability
            </h2>
          </div>
        </div>

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
      </div>

      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          setCurrentState(selectedState);
        }}
      >
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo/55">
            Response preview
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {responseOptions.map((option) => {
              const active = selectedState === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  className={`pressable rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                    active
                      ? "bg-indigo text-paper"
                      : "border border-ink/10 bg-cream text-ink/75 hover:border-indigo/20 hover:bg-paper"
                  }`}
                  onClick={() => setSelectedState(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-ink/78">
            Pickup date
            <input
              className={fieldClassName}
              defaultValue="2026-06-12"
              name="pickup-date"
              type="date"
            />
          </label>
          <label className="text-sm text-ink/78">
            Return date
            <input
              className={fieldClassName}
              defaultValue="2026-06-15"
              name="return-date"
              type="date"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            type="submit"
          >
            Check availability
          </button>
        </div>

        <div
          aria-live="polite"
          className="rounded-[1.6rem] border border-ink/8 bg-cream p-4"
        >
          {currentState === "idle" && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-indigo">
                Choose a response state and submit to preview the flow.
              </p>
              <p className="text-sm leading-6 text-ink/70">
                The idle state keeps the card calm until the customer checks a
                date range.
              </p>
            </div>
          )}

          {currentState === "available" && (
            <div className="space-y-4">
              <div className="rounded-[1.4rem] border border-mehendi/18 bg-mehendi/10 p-4">
                <p className="text-sm font-semibold text-mehendi">
                  These dates are shown as available.
                </p>
                <p className="mt-1 text-sm leading-6 text-ink/72">
                  The next step is a light customer intake before a manual
                  confirmation.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-ink/78">
                  Full name
                  <input
                    className={fieldClassName}
                    defaultValue="Areeba Khan"
                    name="customer-name"
                    type="text"
                  />
                </label>
                <label className="text-sm text-ink/78">
                  Mobile number
                  <input
                    className={fieldClassName}
                    defaultValue="(201) 555-0188"
                    name="customer-mobile"
                    type="tel"
                  />
                </label>
                <label className="text-sm text-ink/78 sm:col-span-2">
                  Event neighborhood
                  <input
                    className={fieldClassName}
                    defaultValue="North Brunswick, NJ"
                    name="event-neighborhood"
                    type="text"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="pressable inline-flex items-center justify-center rounded-full bg-indigo px-5 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-indigo/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  type="button"
                >
                  Reserve this setup
                </button>
              </div>
            </div>
          )}

          {currentState === "unavailable" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-indigo">
                Unfortunately these dates are not available, contact{" "}
                <a
                  className="underline decoration-indigo/30 underline-offset-4 transition hover:text-indigo hover:decoration-indigo"
                  href="mailto:umihuss@gmail.com"
                >
                  umihuss@gmail.com
                </a>{" "}
                for more info.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
