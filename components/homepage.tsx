import Link from "next/link";
import Image from "next/image";
import { PackageCarousel } from "@/components/package-carousel";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  bundlePaths,
  customizeAddOns,
  customizeSteps,
  faqItems,
  galleryItems,
  howItWorksSteps,
  siteConfig,
  trustBadges,
} from "@/lib/site-content";

const galleryLayoutClasses = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-3",
  "md:col-span-4",
];

export function Homepage() {
  const customizePath = bundlePaths.find((path) => path.id === "customize");
  const standardPath = bundlePaths.find((path) => path.id === "standard");

  if (!customizePath || !standardPath) {
    return null;
  }

  return (
    <div id="top" className="relative min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-ink/8 bg-cream px-6 py-8 shadow-[0_35px_110px_-70px_rgba(34,30,71,0.52)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,177,183,0.22),transparent_36%),radial-gradient(circle_at_88%_20%,rgba(238,198,10,0.12),transparent_18%)]" />
            <div className="absolute -left-24 top-16 h-56 w-56 rounded-full border border-indigo/8" />
            <div className="absolute right-8 top-10 h-32 w-32 rounded-full bg-marigold/10 blur-3xl" />

            <div className="relative grid gap-12 xl:grid-cols-[minmax(0,1.04fr)_minmax(380px,0.96fr)] xl:items-center">
              <div className="hero-sequence relative z-10 max-w-[42rem]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                  Premium dholki rental for intimate celebrations
                </p>
                <h1 className="max-w-[10ch] font-display text-[clamp(3.35rem,7.2vw,6.4rem)] leading-[0.95] tracking-[-0.06em] text-indigo">
                  A dholki setting with ceremony in its posture.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-8 text-ink/72 sm:text-lg">
                  Floor seating, layered textiles, tray accents, and quiet
                  finishings arranged for mehndi, mayun, and smaller gatherings.
                  The service reads clearly in one glance and still feels
                  composed.
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
                    href="/#rental"
                  >
                    View the setup
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

        <Reveal className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8" delay={80}>
          <section className="grid gap-8 xl:grid-cols-[minmax(320px,0.84fr)_minmax(0,1.16fr)]">
            <div className="rounded-[2.5rem] border border-ink/8 bg-cream px-6 py-7 shadow-[0_30px_90px_-58px_rgba(34,30,71,0.42)] sm:px-8 sm:py-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                Get Started
              </p>
              <h2 className="mt-3 max-w-[11ch] font-display text-[clamp(3.1rem,6vw,5.4rem)] leading-[0.94] tracking-[-0.05em] text-indigo">
                Fully customize your Dholki setup to fit your needs.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-ink/72">
                Only pay for the pieces you need, from the exact dhol to
                backdrop styles, garlands, rugs, props, and finishing extras.
                If you want the simpler route, the ready-made package still
                lives right here on the homepage.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <article className="rounded-[1.7rem] border border-ink/8 bg-paper p-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Tailored setup
                  </p>
                  <p className="mt-3 font-display text-4xl leading-none text-indigo">
                    {customizeSteps.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    core setup categories
                  </p>
                </article>
                <article className="rounded-[1.7rem] border border-ink/8 bg-paper p-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Extras
                  </p>
                  <p className="mt-3 font-display text-4xl leading-none text-indigo">
                    {customizeAddOns.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    finishing extras and details
                  </p>
                </article>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Link
                className="pressable group rounded-[2.3rem] border border-ink/8 bg-paper p-6 text-left shadow-[0_26px_70px_-46px_rgba(34,30,71,0.32)] transition hover:-translate-y-1 hover:border-mehendi/18 hover:shadow-[0_30px_80px_-44px_rgba(11,123,76,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                href="/get-started"
              >
                <div className="rounded-[1.6rem] border border-ink/8 bg-cream p-5">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
                    {customizePath.eyebrow}
                  </p>
                  <h3 className="mt-4 max-w-[10ch] font-display text-5xl leading-none tracking-[-0.05em] text-indigo">
                    Build only what belongs in your package.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70">
                    Go straight into dhol style, then move through each layer
                    of the setup one step at a time.
                  </p>
                </div>

                <ul className="mt-5 grid gap-3 text-sm leading-6 text-ink/72">
                  {customizePath.bullets.map((bullet) => (
                    <li className="flex gap-3" key={bullet}>
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-mehendi" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex rounded-full bg-indigo px-5 py-3 text-sm font-semibold text-paper">
                  Begin tailored setup
                </span>
              </Link>

              <Link
                className="pressable group rounded-[2.3rem] border border-ink/8 bg-paper p-6 text-left shadow-[0_24px_60px_-48px_rgba(34,30,71,0.35)] transition hover:-translate-y-1 hover:border-indigo/18 hover:shadow-[0_28px_70px_-44px_rgba(34,30,71,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                href="/get-started?path=standard"
              >
                <div className="rounded-[1.5rem] border border-ink/8 bg-cream p-5">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
                    {standardPath.eyebrow}
                  </p>
                  <h3 className="mt-4 font-display text-5xl leading-none tracking-[-0.05em] text-indigo">
                    {standardPath.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-ink/70">
                    Review the signature package if you want the quickest route
                    with the styling already framed for you.
                  </p>
                </div>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-ink/72">
                  {standardPath.bullets.map((bullet) => (
                    <li className="flex gap-3" key={bullet}>
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-marigold transition group-hover:bg-mehendi" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex rounded-full border border-ink/10 px-5 py-3 text-sm text-ink/78">
                  Review signature package
                </span>
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
          <section
            className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(330px,0.92fr)] lg:items-start"
            id="rental"
          >
            <div className="grid gap-4">
              <figure className="image-lift relative overflow-hidden rounded-[2rem] border border-ink/8 bg-paper shadow-[0_28px_70px_-48px_rgba(34,30,71,0.42)]">
                <div className="relative aspect-[16/10]">
                  <Image
                    alt={siteConfig.setupImage.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    src={siteConfig.setupImage.src}
                  />
                </div>
              </figure>

              <PackageCarousel slides={siteConfig.packagePreviewSlides} />
            </div>

            <div className="lg:sticky lg:top-28">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                Single product
              </p>
              <h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.05em] text-indigo">
                {siteConfig.productName}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-ink/72">
                One composed rental, explained without clutter. Customers should
                understand the silhouette, the scale, and the pickup rhythm
                before any backend exists.
              </p>

              <div className="mt-6 rounded-[2rem] border border-indigo/10 bg-cream p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                  Pricing placeholder
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="font-display text-5xl leading-none text-indigo">
                    {siteConfig.pricingPlaceholder.amount}
                  </p>
                  <span className="rounded-full bg-marigold/28 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                    Base rate
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/68">
                  {siteConfig.pricingPlaceholder.note}
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.8rem] border border-ink/8 bg-paper p-5">
                  <h3 className="font-display text-2xl leading-none text-indigo">
                    Included
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/72">
                    {siteConfig.includedItems.map((item) => (
                      <li className="flex gap-3" key={item}>
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-marigold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.8rem] border border-ink/8 bg-paper p-5">
                  <h3 className="font-display text-2xl leading-none text-indigo">
                    Fit notes
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/72">
                    {siteConfig.fitNotes.map((note) => (
                      <li className="flex gap-3" key={note}>
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-mehendi" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-[1.8rem] border border-ink/8 bg-paper p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                  Pickup address
                </p>
                <p className="mt-2 text-lg leading-7 text-ink/78">
                  {siteConfig.pickupArea}
                </p>
              </div>
            </div>
          </section>
        </Reveal>

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
          delay={200}
        >
          <section id="gallery">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                  Gallery and proof
                </p>
                <h2 className="mt-3 font-display text-5xl leading-none tracking-[-0.05em] text-indigo">
                  Mixed frames keep the service believable.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-ink/68">
                These placeholder assets are intentionally composed for the
                production ratios you will need later: portrait, wide proof,
                logistics, and close detail.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-12">
              {galleryItems.map((item, index) => (
                <figure
                  key={item.title}
                  className={`image-lift overflow-hidden rounded-[2rem] border border-ink/8 bg-paper shadow-[0_28px_70px_-48px_rgba(34,30,71,0.42)] ${
                    galleryLayoutClasses[index]
                  }`}
                >
                  <div
                    className={`relative ${
                      index === 0
                        ? "aspect-[4/5]"
                        : index === 1
                          ? "aspect-[5/4]"
                          : index === 2
                            ? "aspect-[4/5]"
                            : "aspect-square"
                    }`}
                  >
                    <Image
                      alt={item.image.alt}
                      className="object-cover"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      src={item.image.src}
                    />
                  </div>
                  <figcaption className="p-5">
                    <p className="font-display text-2xl leading-none text-indigo">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ink/68">
                      {item.caption}
                    </p>
                  </figcaption>
                </figure>
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
                Clear now, extensible later.
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink/68">
                The answers stay concise, premium in tone, and honest about what
                is still placeholder territory.
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
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/70">
                    {item.answer}
                  </p>
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
