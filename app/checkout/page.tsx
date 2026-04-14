import Link from "next/link";
import { DholCheckoutForm } from "@/components/dhol-checkout-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  decodeDholCartItems,
  isFulfillmentMethod,
} from "@/lib/dhol-checkout";
import { getDholProductsByIds } from "@/lib/dhol-product-store";

type CheckoutPageProps = {
  searchParams?: Promise<{
    canceled?: string | string[];
    fulfillmentMethod?: string | string[];
    items?: string | string[];
    pickupDate?: string | string[];
    returnDate?: string | string[];
  }>;
};

const getSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const resolvedSearchParams = await searchParams;
  const items = decodeDholCartItems(getSingleValue(resolvedSearchParams?.items));
  const liveCatalog = await getDholProductsByIds(items.map((item) => item.id));
  const pickupDate = getSingleValue(resolvedSearchParams?.pickupDate);
  const returnDate = getSingleValue(resolvedSearchParams?.returnDate);
  const fulfillmentMethodValue = getSingleValue(
    resolvedSearchParams?.fulfillmentMethod,
  );
  const initialFulfillmentMethod = isFulfillmentMethod(fulfillmentMethodValue)
    ? fulfillmentMethodValue
    : "pickup";
  const wasCanceled = getSingleValue(resolvedSearchParams?.canceled) === "1";

  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          {liveCatalog.length > 0 ? (
            <DholCheckoutForm
              catalog={liveCatalog}
              cartItems={items}
              checkoutEnabled={Boolean(process.env.STRIPE_SECRET_KEY)}
              initialFulfillmentMethod={initialFulfillmentMethod}
              initialPickupDate={pickupDate}
              initialReturnDate={returnDate}
              wasCanceled={wasCanceled}
            />
          ) : (
            <div className="mx-auto max-w-3xl rounded-[2.4rem] border border-ink/10 bg-paper/95 p-8 text-center shadow-[0_30px_90px_-55px_rgba(34,30,71,0.35)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-indigo/48">
                Dhol Checkout Pilot
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.95] tracking-[-0.05em] text-indigo">
                No dhol items are loaded for checkout.
              </h1>
              <p className="mt-4 text-sm leading-7 text-ink/72 sm:text-base">
                Return to the builder, select one or more dhol rentals, and use
                the pilot checkout CTA from the sidebar.
              </p>
              <div className="mt-8">
                <Link
                  className="pressable inline-flex items-center justify-center rounded-full bg-marigold px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-18px_rgba(17,17,17,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  href="/get-started"
                >
                  Return to the setup builder
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
