"use client";

import Image from "next/image";
import { useState } from "react";
import type { PackagePreviewSlide } from "@/lib/site-content";

type PackageCarouselProps = {
  slides: PackagePreviewSlide[];
};

export function PackageCarousel({ slides }: PackageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  const move = (direction: "prev" | "next") => {
    setActiveIndex((currentIndex) => {
      if (direction === "prev") {
        return currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      }

      return currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    });
  };

  return (
    <section className="rounded-[2rem] border border-ink/8 bg-paper p-5 shadow-[0_28px_70px_-48px_rgba(34,30,71,0.42)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
            Package preview
          </p>
          <h3 className="mt-2 font-display text-3xl leading-none text-indigo">
            What comes with the package
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous package detail"
            className="pressable inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-cream text-lg text-indigo transition hover:border-indigo/18 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            onClick={() => move("prev")}
            type="button"
          >
            ←
          </button>
          <button
            aria-label="Next package detail"
            className="pressable inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-cream text-lg text-indigo transition hover:border-indigo/18 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            onClick={() => move("next")}
            type="button"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-center">
        <figure className="image-lift overflow-hidden rounded-[1.8rem] border border-ink/8 bg-cream">
          <div className="relative aspect-[16/11]">
            <Image
              alt={activeSlide.image.alt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              src={activeSlide.image.src}
            />
          </div>
        </figure>

        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
            {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
          <h4 className="mt-3 font-display text-4xl leading-none text-indigo">
            {activeSlide.title}
          </h4>
          <p className="mt-4 text-sm leading-7 text-ink/70">
            {activeSlide.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {activeSlide.chips.map((chip) => (
              <span
                className="rounded-full border border-ink/8 bg-cream px-3 py-2 text-xs uppercase tracking-[0.16em] text-ink/72"
                key={chip}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            {slides.map((slide, index) => {
              const active = index === activeIndex;

              return (
                <button
                  aria-label={`Show ${slide.title}`}
                  aria-pressed={active}
                  className={`pressable h-3 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                    active ? "w-10 bg-indigo" : "w-3 bg-ink/15 hover:bg-ink/28"
                  }`}
                  key={slide.title}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
