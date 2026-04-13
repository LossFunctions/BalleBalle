import Link from "next/link";
import Image from "next/image";
import { OccasionMarquee } from "@/components/occasion-marquee";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  faqItems,
  howItWorksSteps,
  siteConfig,
  trustBadges,
} from "@/lib/site-content";

export function Homepage() {
  return (
    <div id="top" className="relative min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="pb-24">
        <Reveal delay={90}>
          <OccasionMarquee />
        </Reveal>

        <section className="mx-auto mt-5 max-w-7xl px-4 sm:px-6 lg:mt-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-ink/8 bg-cream px-6 py-8 shadow-[0_35px_110px_-70px_rgba(34,30,71,0.52)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,177,183,0.22),transparent_36%),radial-gradient(circle_at_88%_20%,rgba(238,198,10,0.12),transparent_18%)]" />
            <div className="absolute -left-24 top-16 h-56 w-56 rounded-full border border-indigo/8" />
            <div className="absolute right-8 top-10 h-32 w-32 rounded-full bg-marigold/10 blur-3xl" />

            <div className="relative grid gap-12 xl:grid-cols-[minmax(0,1.04fr)_minmax(380px,0.96fr)] xl:items-center">
              <div className="hero-sequence relative z-10 max-w-[42rem]">
                <h1 className="max-w-[9ch] font-display text-[clamp(3.35rem,7.2vw,6.4rem)] leading-[0.95] tracking-[-0.06em] text-indigo">
                  Fully customize your event setup
                </h1>
                <p className="mt-4 max-w-xl text-base leading-8 text-ink/72 sm:text-lg">
                  Only pay for the pieces you need, from the exact dhol to
                  backdrop styles, garlands, rugs, props, and finishing extras.
                  If you want the simpler route, the ready-made package still
                  lives right here on the homepage.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(17,17,17,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                    href="/get-started"
                  >
                    Get Started
                  </Link>
                  <Link
                    className="pressable inline-flex items-center justify-center rounded-full border border-ink/10 px-6 py-3 text-sm text-ink/75 transition hover:border-indigo/18 hover:bg-paper/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                    href="/gallery"
                  >
                    Browse gallery
                  </Link>
                </div>

                <dl className="mt-8 grid gap-4 border-t border-ink/8 pt-6 sm:grid-cols-3">
                  {siteConfig.highlights.map((item) => (
                    <div key={item.label}>
                      <dt className="text-[0.68rem] uppercase tracking-[0.22em] text-indigo/48">
                        {item.label}
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-ink/72">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="hero-sequence relative">
                <div className="absolute -left-8 top-12 h-28 w-28 rounded-full bg-rose/20 blur-2xl" />
                <div className="image-lift relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-ink/10 bg-paper shadow-[0_30px_90px_-55px_rgba(34,30,71,0.4)]">
                  <Image
                    alt={siteConfig.heroImage.alt}
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 1280px) 36vw, (min-width: 768px) 42vw, 100vw"
                    src={siteConfig.heroImage.src}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-indigo/35 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-paper/30 bg-paper/78 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-indigo backdrop-blur">
                    Editorial hero crop
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                    <p className="text-[0.7rem] uppercase tracking-[0.24em] text-paper/72">
                      Placeholder asset
                    </p>
                    <p className="mt-2 max-w-xs font-display text-3xl leading-none">
                      Tall framing preserves the final composition from the
                      start.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="motif-divider mt-10 h-10" />
          </div>
        </section>

        <Reveal
          className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8"
          delay={120}
        >
          <section aria-label="Trust markers" className="flex flex-wrap gap-3">
            {trustBadges.map((badge) => (
              <article
                key={badge.title}
                className="rounded-full border border-ink/8 bg-paper/80 px-5 py-3 shadow-[0_16px_45px_-30px_rgba(34,30,71,0.28)] backdrop-blur"
              >
                <p className="text-sm font-semibold text-indigo">{badge.title}</p>
                <p className="mt-1 text-xs leading-5 text-ink/62">
                  {badge.detail}
                </p>
              </article>
            ))}
          </section>
        </Reveal>

        <Reveal
          className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8"
          delay={160}
        >
          <section
            className="overflow-hidden rounded-[2.5rem] bg-indigo px-6 py-8 text-paper shadow-[0_35px_110px_-70px_rgba(34,30,71,0.82)] sm:px-10 sm:py-10 lg:px-12 lg:py-12"
            id="process"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-paper/60">
                  How it works
                </p>
                <h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.05em]">
                  Fully customize your Dholki setup to fit your needs.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-paper/72">
                Only pay for the pieces you need, from the exact dhol to
                backdrop style, garland count, and more. Start from a standard
                pre-packed package or customize the setup to fit your needs.
              </p>
            </div>

            <div aria-hidden="true" className="motif-divider mt-10 h-10 opacity-60" />

            <div className="grid gap-4 lg:grid-cols-2">
              {howItWorksSteps.map((item) => (
                <article
                  key={item.step}
                  className="rounded-[1.8rem] border border-paper/12 bg-paper/6 p-5 backdrop-blur lg:min-h-72"
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-paper/58">
                    {item.step}
                  </p>
                  <h3 className="mt-4 font-display text-3xl leading-none">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-paper/72">
                    {item.detail}
                  </p>
                  {item.note ? (
                    <p className="mt-3 text-sm leading-7 italic text-paper/62">
                      {item.note}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal
          className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8"
          delay={220}
        >
          <section
            className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]"
            id="faq"
          >
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                FAQ
              </p>
              <h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.05em] text-indigo">
                Questions, answered.
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink/68">
                Pricing, timing, pickup, delivery, and customization policies
                in one place.
              </p>
            </div>

            <div className="space-y-3">
              {faqItems.map((item) => (
                <details
                  className="faq-item rounded-[1.8rem] border border-ink/8 bg-paper/76 px-5 py-4 transition"
                  key={item.question}
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-4 rounded-[1.2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                    <span className="font-display text-2xl leading-none text-indigo">
                      {item.question}
                    </span>
                    <span className="faq-icon mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 text-xl text-indigo transition">
                      +
                    </span>
                  </summary>
                  <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-ink/70">
                    {item.answer.map((paragraph, index) => {
                      const rowLink = item.answerRowLinks?.find(
                        (entry) => entry.answerIndex === index,
                      );

                      if (!rowLink) {
                        return <p key={paragraph}>{paragraph}</p>;
                      }

                      return (
                        <div
                          className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                          key={`${paragraph}-${rowLink.link.href}`}
                        >
                          <p className="min-w-0">{paragraph}</p>
                          <a
                            className="inline-flex shrink-0 items-center rounded-full border border-indigo/12 bg-cream px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo/64 transition hover:border-indigo/20 hover:bg-paper sm:self-start"
                            href={rowLink.link.href}
                            rel={rowLink.link.external ? "noreferrer" : undefined}
                            target={rowLink.link.external ? "_blank" : undefined}
                          >
                            {rowLink.link.label}
                          </a>
                        </div>
                      );
                    })}
                    {item.links?.length ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.links.map((link) => (
                          <a
                            className="inline-flex items-center rounded-full border border-indigo/12 bg-cream px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo/64 transition hover:border-indigo/20 hover:bg-paper"
                            href={link.href}
                            key={link.href}
                            rel={link.external ? "noreferrer" : undefined}
                            target={link.external ? "_blank" : undefined}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
