import Link from "next/link";
import { siteConfig } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-end gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          href="/"
        >
          <span className="font-display text-2xl tracking-[-0.04em] text-indigo">
            {siteConfig.businessName}
          </span>
          <span className="pb-1 text-[0.62rem] uppercase tracking-[0.24em] text-indigo/55">
            {siteConfig.serviceLabel}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm text-ink/72 md:flex"
        >
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              className="transition hover:text-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className="pressable inline-flex items-center rounded-full border border-ink/10 px-4 py-2 text-sm text-ink/78 transition hover:border-indigo/18 hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          href="#contact"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
