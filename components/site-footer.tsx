import { siteConfig } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/10 bg-indigo text-paper" id="contact">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_240px_260px] lg:px-8">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-paper/58">
            Contact
          </p>
          <h2 className="mt-3 font-display text-4xl leading-none">
            {siteConfig.businessName}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-paper/72">
            We pride ourselves on stellar customer support, here to make your
            event a success!
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {siteConfig.contactLinks.map((link) => (
              (() => {
                const isExternal = "external" in link && link.external;

                return (
                  <a
                    key={link.label}
                    className="rounded-full border border-paper/12 px-4 py-2 text-sm text-paper/82 transition hover:bg-paper/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-indigo"
                    href={link.href}
                    rel={isExternal ? "noreferrer" : undefined}
                    target={isExternal ? "_blank" : undefined}
                  >
                    {link.label}
                  </a>
                );
              })()
            ))}
          </div>
        </div>

        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-paper/58">
            Pickup address
          </p>
          <p className="mt-3 text-sm leading-7 text-paper/80">
            {siteConfig.pickupArea}
          </p>
        </div>

        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-paper/58">
            Delivery
          </p>
          <p className="mt-3 text-sm leading-7 text-paper/80">
            We deliver within NYC and LI for a flat-fee of $200
          </p>
        </div>
      </div>
    </footer>
  );
}
