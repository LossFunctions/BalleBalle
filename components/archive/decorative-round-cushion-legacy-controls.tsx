"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import dottedLineImage from "@/Dottedline.png";
import { type CustomizeOption, type CustomizeOptionVariant } from "@/lib/site-content";

type OptionVariantSelectionMap = Record<string, number>;

type DecorativeRoundCushionLegacyControlsProps = {
  activeVariant: CustomizeOptionVariant | null;
  activeVariantId?: string;
  activeVariantQuantity: number;
  offsetPrice: ReactNode;
  onDecrement: () => void;
  onIncrement: () => void;
  onSelectVariant: (variant: CustomizeOptionVariant) => void;
  option: CustomizeOption;
  variantSelections?: OptionVariantSelectionMap;
};

type ArchivedQuantityStepperProps = {
  decrementLabel: string;
  incrementLabel: string;
  onDecrement: () => void;
  onIncrement: () => void;
  quantity: number;
};

function ArchivedQuantityStepper({
  decrementLabel,
  incrementLabel,
  onDecrement,
  onIncrement,
  quantity,
}: ArchivedQuantityStepperProps) {
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
        onClick={onIncrement}
        type="button"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

// Archived swatch-based cushion controls retained for possible future reuse.
export function DecorativeRoundCushionLegacyControls({
  activeVariant,
  activeVariantId,
  activeVariantQuantity,
  offsetPrice,
  onDecrement,
  onIncrement,
  onSelectVariant,
  option,
  variantSelections,
}: DecorativeRoundCushionLegacyControlsProps) {
  return (
    <>
      <div className="mt-5 flex items-start justify-between gap-2">
        {option.variants?.map((variant) => {
          const variantQuantity = variantSelections?.[variant.id] ?? 0;
          const variantSelected = variantQuantity > 0;
          const variantActive = activeVariantId === variant.id;

          return (
            <button
              aria-label={`Select ${variant.label} for ${option.title}`}
              aria-pressed={variantActive}
              className="pressable flex shrink-0 flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              key={variant.id}
              onClick={() => onSelectVariant(variant)}
              type="button"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_12px_22px_-18px_rgba(34,30,71,0.34)] transition ${
                  variantSelected
                    ? "border-mehendi bg-paper shadow-[0_0_0_3px_rgba(11,123,76,0.08)]"
                    : variantActive
                      ? "border-indigo/22 bg-paper shadow-[0_0_0_3px_rgba(34,30,71,0.05)]"
                      : "border-ink/8 bg-paper"
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-paper/80 shadow-[0_0_0_1px_rgba(34,30,71,0.08)]"
                  style={{
                    backgroundColor: variant.swatch,
                  }}
                />
              </span>
              <span className="mt-1 block min-h-[0.95rem] text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-mehendi">
                {variantSelected ? `x${variantQuantity}` : ""}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {activeVariant ? (
          <ArchivedQuantityStepper
            decrementLabel={`Decrease ${activeVariant.label} quantity for ${option.title}`}
            incrementLabel={`Increase ${activeVariant.label} quantity for ${option.title}`}
            onDecrement={onDecrement}
            onIncrement={onIncrement}
            quantity={activeVariantQuantity}
          />
        ) : (
          <div className="min-w-0 flex-1">
            <span className="relative inline-block whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.24em] text-indigo/42">
              <Image
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-[calc(100%-0.2rem)] -top-9 h-auto w-11 select-none opacity-55 mix-blend-multiply"
                src={dottedLineImage}
              />
              Pick a color
            </span>
          </div>
        )}
        {offsetPrice}
      </div>
    </>
  );
}
