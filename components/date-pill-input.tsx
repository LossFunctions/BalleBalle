"use client";

import { useRef } from "react";
import { formatLongDateValue } from "@/lib/dhol-checkout";

type DatePillInputProps = {
  invalid?: boolean;
  label: string;
  min?: string;
  name?: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
};

export function DatePillInput({
  invalid = false,
  label,
  min,
  name,
  onChange,
  required = false,
  value,
}: DatePillInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    const input = inputRef.current as (HTMLInputElement & {
      showPicker?: () => void;
    }) | null;

    if (!input) {
      return;
    }

    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // Fall through to focus/click for browsers with partial support.
      }
    }

    input.focus({ preventScroll: true });
    input.click();
  };

  return (
    <label className="block cursor-pointer text-sm text-ink/78">
      {label}
      <div
        className={`relative mt-2 cursor-pointer rounded-2xl border bg-paper transition focus-within:ring-2 ${
          invalid
            ? "border-rose-300 bg-rose-50/70 focus-within:border-rose-500 focus-within:ring-rose-500/20"
            : "border-ink/10 focus-within:border-indigo focus-within:ring-indigo/20"
        }`}
        onClick={openPicker}
      >
        <div className="pointer-events-none flex items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-medium text-indigo">
            {value ? formatLongDateValue(value) : "Select date"}
          </span>
          <span className="inline-flex h-5 w-5 items-center justify-center text-ink/72">
            <svg
              aria-hidden="true"
              className="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 3.75V6.25M17 3.75V6.25M4.75 8.5H19.25M6.5 5.5H17.5A1.75 1.75 0 0 1 19.25 7.25V18A1.75 1.75 0 0 1 17.5 19.75H6.5A1.75 1.75 0 0 1 4.75 18V7.25A1.75 1.75 0 0 1 6.5 5.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          </span>
        </div>
        <input
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          min={min}
          name={name}
          onChange={(event) => onChange(event.target.value)}
          ref={inputRef}
          required={required}
          suppressHydrationWarning
          type="date"
          value={value}
        />
      </div>
    </label>
  );
}
