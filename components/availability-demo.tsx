"use client";

import { useState } from "react";
import type { AvailabilityDemoState } from "@/lib/site-content";

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
      className="rounded-[2rem] border border-ink/10 bg-paper/95 p-5 shadow-[0_30px_90px_-55px_rgba(34,30,71,0.55)] backdrop-blur sm:p-6"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-indigo/55">
              Availability Prototype
            </p>
            <h2
              id="availability-title"
              className="mt-1 font-display text-3xl leading-none text-indigo"
            >
              Check availability
            </h2>
          </div>
          <div className="rounded-full border border-mehendi/15 bg-mehendi/8 px-3 py-1 text-xs text-mehendi">
            Static demo states only
          </div>
        </div>
        <p className="max-w-xl text-sm leading-6 text-ink/70">
          Use the response toggle to preview how the future booking flow should
          behave. No dates are locked and no payment is collected in this phase.
        </p>
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
            Demo Response
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
            Pickup window
            <select className={fieldClassName} defaultValue="after-3" name="pickup-window">
              <option value="morning">10:00 AM to 1:00 PM</option>
              <option value="after-3">3:00 PM to 6:00 PM</option>
              <option value="evening">6:00 PM to 8:00 PM</option>
            </select>
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
          <label className="text-sm text-ink/78">
            Return window
            <select className={fieldClassName} defaultValue="before-noon" name="return-window">
              <option value="before-noon">Before 12:00 PM</option>
              <option value="afternoon">12:00 PM to 3:00 PM</option>
              <option value="late">3:00 PM to 6:00 PM</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-ink/78">
          Notes
          <textarea
            className={`${fieldClassName} min-h-28 resize-y`}
            defaultValue="Mayun at home, intimate guest list, warm florals preferred."
            name="notes"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            type="submit"
          >
            Check availability
          </button>
          <p className="text-xs leading-5 text-ink/58">
            Prototype behavior only. Final reserve logic, payments, and holds
            are intentionally deferred.
          </p>
        </div>

        <div
          aria-live="polite"
          className="rounded-[1.6rem] border border-ink/8 bg-cream p-4"
        >
          {currentState === "idle" && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-indigo">
                Choose a demo response and submit to preview the flow.
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
                  These demo dates are shown as available.
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
                <p className="text-xs leading-5 text-ink/58">
                  Prototype only. No deposit, payment capture, or reservation is
                  created.
                </p>
              </div>
            </div>
          )}

          {currentState === "unavailable" && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-indigo">
                This demo marks the selected range as unavailable.
              </p>
              <p className="text-sm leading-6 text-ink/72">
                Suggested alternate: Friday, June 19 after 3:00 PM pickup with a
                Monday, June 22 before noon return.
              </p>
              <p className="text-sm leading-6 text-ink/72">
                Keep the tone soft and helpful here; the future live system can
                later suggest real nearby inventory windows.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
