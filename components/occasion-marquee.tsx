import { occasionMarqueeItems } from "@/lib/site-content";

const repeatedOccasions = [...occasionMarqueeItems, ...occasionMarqueeItems];

export function OccasionMarquee() {
  return (
    <section
      aria-label="Ideal for"
      className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8"
    >
      <div className="occasion-banner overflow-hidden rounded-full border border-ink/8 bg-paper/78 px-4 py-3 shadow-[0_24px_70px_-52px_rgba(34,30,71,0.34)] backdrop-blur sm:px-5">
        <div className="flex items-center gap-4">
          <span className="shrink-0 rounded-full bg-indigo px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-paper">
            Ideal for
          </span>

          <div className="occasion-marquee min-w-0 flex-1">
            <div className="occasion-marquee__track">
              {repeatedOccasions.map((occasion, index) => (
                <span
                  className="inline-flex items-center rounded-full border border-ink/8 bg-cream/88 px-4 py-2 text-sm text-indigo/86"
                  key={`${occasion}-${index}`}
                >
                  <span>{occasion}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
