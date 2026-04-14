import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDholInventoryDashboard } from "@/lib/dhol-inventory";

export const runtime = "nodejs";
export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function DholInventoryAdminPage() {
  const dashboard = await getDholInventoryDashboard();

  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="rounded-[2.4rem] border border-ink/10 bg-paper/95 p-8 shadow-[0_30px_90px_-55px_rgba(34,30,71,0.35)] sm:p-10">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
              Internal Inventory
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.95] tracking-[-0.05em] text-indigo">
              Dhol inventory overview.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/72 sm:text-base">
              This page shows current stock against paid bookings that overlap{" "}
              {dashboard.referenceDate}. It is useful for operations, but note that
              rental availability is date-specific, so future availability still
              depends on the booking window.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {dashboard.items.map((item) => (
                <article
                  className="rounded-[1.8rem] border border-ink/8 bg-cream p-5 shadow-[0_18px_50px_-40px_rgba(34,30,71,0.3)]"
                  key={item.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-indigo">{item.title}</p>
                      <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-indigo/45">
                        {currencyFormatter.format(item.unitAmount)} per event
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                        item.active
                          ? "border border-mehendi/12 bg-mehendi/10 text-mehendi"
                          : "border border-rose-300/70 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <dl className="mt-5 space-y-3 text-sm text-ink/72">
                    <div className="flex items-center justify-between gap-4">
                      <dt>Total owned</dt>
                      <dd className="font-semibold text-indigo">{item.inventoryCount}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt>Booked today</dt>
                      <dd className="font-semibold text-indigo">
                        {item.bookedTodayQuantity}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt>Available today</dt>
                      <dd className="font-semibold text-indigo">
                        {item.availableTodayQuantity}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt>Open checkout sessions</dt>
                      <dd className="font-semibold text-indigo">
                        {item.checkoutCreatedQuantity}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-ink/8 bg-paper p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
                    Recent dhol orders
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/68">
                    `paid` orders are what currently block availability in checkout.
                  </p>
                </div>
                <Link
                  className="pressable inline-flex items-center justify-center rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm font-semibold text-indigo transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  href="/get-started"
                >
                  Return to builder
                </Link>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
                  <thead>
                    <tr className="text-[0.68rem] uppercase tracking-[0.18em] text-indigo/42">
                      <th className="pb-1 pr-4 font-medium">Status</th>
                      <th className="pb-1 pr-4 font-medium">Date range</th>
                      <th className="pb-1 pr-4 font-medium">Customer</th>
                      <th className="pb-1 pr-4 font-medium">Items</th>
                      <th className="pb-1 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentOrders.map((order) => (
                      <tr
                        className="rounded-[1.2rem] bg-cream text-ink/76"
                        key={order.id}
                      >
                        <td className="rounded-l-[1.2rem] px-4 py-3 font-semibold text-indigo">
                          {order.status}
                        </td>
                        <td className="px-4 py-3">{order.dateRange}</td>
                        <td className="px-4 py-3">{order.customerEmail}</td>
                        <td className="px-4 py-3">
                          {order.items
                            .map((item) =>
                              item.quantity > 1
                                ? `${item.title} x${item.quantity}`
                                : item.title,
                            )
                            .join(", ")}
                        </td>
                        <td className="rounded-r-[1.2rem] px-4 py-3 font-semibold text-indigo">
                          {currencyFormatter.format(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
