import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { galleryItems } from "@/lib/site-content";

const galleryLayoutClasses = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-3",
  "md:col-span-4",
];

export const metadata: Metadata = {
  title: "Gallery | Balle Balle",
  description:
    "Browse the Balle Balle gallery with portrait, wide, logistics, and detail frames.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-ink/8 bg-cream px-6 py-8 shadow-[0_35px_110px_-70px_rgba(34,30,71,0.48)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,177,183,0.22),transparent_34%),radial-gradient(circle_at_88%_22%,rgba(238,198,10,0.12),transparent_18%)]" />
            <div className="absolute -right-10 top-10 h-32 w-32 rounded-full border border-indigo/10" />
            <div className="absolute bottom-0 left-12 h-28 w-28 rounded-full bg-marigold/12 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                  Gallery
                </p>
                <h1 className="mt-3 max-w-[10ch] font-display text-[clamp(3.2rem,7vw,5.8rem)] leading-[0.94] tracking-[-0.05em] text-indigo">
                  Proof that the setup reads clearly in every frame.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72 sm:text-lg">
                  This page keeps the visual proof in one place instead of
                  interrupting the homepage. Wide shots, tighter details, and
                  pickup-ready frames can all live here.
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
                    href="/"
                  >
                    Back home
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[1.8rem] border border-ink/8 bg-paper/82 p-5 shadow-[0_20px_60px_-48px_rgba(34,30,71,0.35)] backdrop-blur">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Coverage
                  </p>
                  <p className="mt-3 font-display text-4xl leading-none text-indigo">
                    {galleryItems.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    core frame types for hero, wide proof, logistics, and
                    detail.
                  </p>
                </article>

                <article className="rounded-[1.8rem] border border-ink/8 bg-paper/82 p-5 shadow-[0_20px_60px_-48px_rgba(34,30,71,0.35)] backdrop-blur">
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-indigo/48">
                    Why separate it
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink/72">
                    The homepage stays tighter and the gallery still has a
                    dedicated place in the top navigation.
                  </p>
                </article>
              </div>
            </div>

            <div aria-hidden="true" className="motif-divider mt-10 h-10" />
          </div>
        </section>

        <Reveal
          className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
          delay={80}
        >
          <section aria-labelledby="gallery-grid-heading">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                  Gallery and proof
                </p>
                <h2
                  className="mt-3 font-display text-5xl leading-none tracking-[-0.05em] text-indigo"
                  id="gallery-grid-heading"
                >
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
          className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
          delay={140}
        >
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.92fr)]">
            <div className="rounded-[2.25rem] border border-ink/8 bg-paper px-6 py-7 shadow-[0_28px_80px_-52px_rgba(34,30,71,0.36)] sm:px-8 sm:py-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-indigo/55">
                Next step
              </p>
              <h2 className="mt-3 max-w-[12ch] font-display text-4xl leading-none tracking-[-0.05em] text-indigo">
                Ready to turn the gallery into your actual package?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
                Use the setup flow when you want to choose a ready-made package
                or build the rental around the pieces you actually need.
              </p>
            </div>

            <div className="rounded-[2.25rem] border border-ink/8 bg-cream p-6 shadow-[0_28px_80px_-56px_rgba(34,30,71,0.32)]">
              <div className="flex flex-col gap-3">
                <Link
                  className="pressable inline-flex items-center justify-center rounded-full bg-indigo px-5 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  href="/get-started"
                >
                  Start your setup
                </Link>
                <a
                  className="pressable inline-flex items-center justify-center rounded-full border border-ink/10 px-5 py-3 text-sm text-ink/78 transition hover:border-indigo/18 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  href="#contact"
                >
                  Contact
                </a>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
