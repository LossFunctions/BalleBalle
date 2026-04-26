import { GetStartedFlow } from "@/components/get-started-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  dholCatalog,
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

const LIVE_DHOL_CATALOG_TIMEOUT_MS = 1200;

const getSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const withTimeout = async <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};

export default async function GetStartedPage({
  searchParams,
}: GetStartedPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedPath = getSingleValue(resolvedSearchParams?.path);
  const initialMode =
    requestedPath === "standard" ? "standard" : "customize";
  let liveDholCatalog = dholCatalog;

  try {
    const loadedDholCatalog = await withTimeout(
      listDholProducts(),
      LIVE_DHOL_CATALOG_TIMEOUT_MS,
      "Timed out loading live dhol catalog for the builder.",
    );

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
            liveDholCatalog={liveDholCatalog}
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
