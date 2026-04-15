import { GetStartedFlow } from "@/components/get-started-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  dholCatalog,
  isFulfillmentMethod,
  isValidDateInputValue,
  type FulfillmentMethod,
} from "@/lib/dhol-checkout";
import { listDholProducts } from "@/lib/dhol-product-store";

type GetStartedPageProps = {
  searchParams?: Promise<{
    fulfillmentMethod?: string | string[];
    path?: string | string[];
    pickupDate?: string | string[];
    returnDate?: string | string[];
  }>;
};

export const runtime = "nodejs";

const getSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function GetStartedPage({
  searchParams,
}: GetStartedPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedPath = getSingleValue(resolvedSearchParams?.path);
  const initialMode =
    requestedPath === "standard" ? "standard" : "customize";
  const fulfillmentMethodValue = getSingleValue(
    resolvedSearchParams?.fulfillmentMethod,
  );
  const pickupDateValue = getSingleValue(resolvedSearchParams?.pickupDate);
  const returnDateValue = getSingleValue(resolvedSearchParams?.returnDate);
  const initialCheckoutContext: {
    fulfillmentMethod?: FulfillmentMethod;
    pickupDate?: string;
    returnDate?: string;
  } = {
    fulfillmentMethod: isFulfillmentMethod(fulfillmentMethodValue)
      ? fulfillmentMethodValue
      : undefined,
    pickupDate: isValidDateInputValue(pickupDateValue ?? "")
      ? pickupDateValue
      : undefined,
    returnDate: isValidDateInputValue(returnDateValue ?? "")
      ? returnDateValue
      : undefined,
  };
  let liveDholCatalog = dholCatalog;

  try {
    const loadedDholCatalog = await listDholProducts();

    if (loadedDholCatalog.length > 0) {
      liveDholCatalog = loadedDholCatalog;
    }
  } catch (error) {
    console.error("Unable to load live dhol catalog for the builder.", error);
  }

  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <GetStartedFlow
            initialMode={initialMode}
            initialCheckoutContext={initialCheckoutContext}
            liveDholCatalog={liveDholCatalog}
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
