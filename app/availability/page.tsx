import Link from "next/link";
import { AvailabilityDemo } from "@/components/availability-demo";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-content";

export default function AvailabilityPage() {
  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(320px,0.84fr)_minmax(0,1.16fr)] xl:items-start">
            <Reveal className="rounded-[2.5rem] border border-ink/8 bg-cream px-6 py-7 shadow-[0_30px_90px_-58px_rgba(34,30,71,0.45)] sm:px-8 sm:py-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                Availability
              </p>
              <h1 className="mt-3 max-w-[11ch] font-display text-[clamp(3.2rem,7vw,5.4rem)] leading-[0.94] tracking-[-0.05em] text-indigo">
                Choose your date and preview the flow.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-ink/72">
                This page keeps the booking interaction on its own for now so it
                feels calmer, easier to scan, and ready for a future live
                availability layer.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <article className="rounded-[1.8rem] border border-ink/8 bg-paper p-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Pickup address
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink/76">
                    {siteConfig.pickupArea}
                  </p>
                </article>

                <article className="rounded-[1.8rem] border border-ink/8 bg-paper p-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Before you submit
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink/76">
                    Pick your preferred dates, note whether pickup, drop-off, or
                    delivery suits you best, and use the demo response toggle to
                    preview the next state.
                  </p>
                </article>
              </div>

              <div className="mt-8">
                <Link
                  className="pressable inline-flex items-center justify-center rounded-full border border-ink/10 px-5 py-3 text-sm text-ink/78 transition hover:border-indigo/18 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  href="/get-started"
                >
                  Back to Get Started
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <AvailabilityDemo />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
