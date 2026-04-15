import { AvailabilityDemo } from "@/components/availability-demo";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AvailabilityPage() {
  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-40 lg:pb-52">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <Reveal className="mx-auto max-w-5xl" delay={120}>
            <AvailabilityDemo />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
