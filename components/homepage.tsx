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

            <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1.04fr)_minmax(380px,0.96fr)] xl:items-stretch">
              <div className="hero-sequence relative z-10 max-w-[42rem] xl:flex xl:h-full xl:max-w-none xl:flex-col xl:self-stretch">
                <h1 className="max-w-[8ch] font-display text-[clamp(3.35rem,7.2vw,6.4rem)] leading-[0.95] tracking-[-0.06em] text-indigo">
                  Fully customize your event
                </h1>
                <p className="mt-8 max-w-xl text-base leading-8 text-ink/72 sm:text-lg">
                  Only pay for the pieces you need, from the exact dhol to
                  backdrop styles, props, and many extras. Or simply choose the
                  ready-made package!
                </p>

                <div className="mt-10">
                  <Link
                    className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-8 py-4 text-base font-semibold text-ink shadow-[0_22px_45px_-22px_rgba(17,17,17,0.42)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_52px_-22px_rgba(17,17,17,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                    href="/get-started"
                    prefetch
                  >
                    Get Started
                  </Link>
                </div>

                <div className="mt-8 xl:mt-auto" />
              </div>

              <div className="hero-sequence relative self-start xl:-mt-2">
                <div className="absolute -left-8 top-12 h-28 w-28 rounded-full bg-rose/20 blur-2xl" />
                <div className="image-lift relative aspect-[4/4.15] overflow-hidden rounded-[2.5rem] border border-ink/10 bg-paper shadow-[0_30px_90px_-55px_rgba(34,30,71,0.4)]">
                  <Image
                    alt={siteConfig.heroImage.alt}
                    className="object-cover object-top"
                    fill
                    priority
                    sizes="(min-width: 1280px) 36vw, (min-width: 768px) 42vw, 100vw"
                    src={siteConfig.heroImage.src}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Reveal
          className="reveal-trust-badges mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8"
          delay={80}
        >
          <section
            aria-label="Trust markers"
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            {trustBadges.map((badge) => (
              <article
                key={badge.title}
                className="h-full rounded-[1.9rem] border border-ink/8 bg-paper/80 px-5 py-4 shadow-[0_16px_45px_-30px_rgba(34,30,71,0.28)] backdrop-blur"
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
            <div className="grid gap-8 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-paper/60">
                  How it works
                </p>
                <h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.05em]">
                  Fully customize your Dholki setup to fit your needs.
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {howItWorksSteps.map((item) => (
                  <article
                    key={item.step}
                    className="rounded-[1.8rem] border border-paper/12 bg-paper/6 p-5 backdrop-blur lg:min-h-64"
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
