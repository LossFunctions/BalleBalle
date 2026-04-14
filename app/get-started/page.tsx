import { GetStartedFlow } from "@/components/get-started-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dholCatalog } from "@/lib/dhol-checkout";
import { listDholProducts } from "@/lib/dhol-product-store";

type GetStartedPageProps = {
  searchParams?: Promise<{
    path?: string | string[];
  }>;
};

export const runtime = "nodejs";

export default async function GetStartedPage({
  searchParams,
}: GetStartedPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedPath = Array.isArray(resolvedSearchParams?.path)
    ? resolvedSearchParams.path[0]
    : resolvedSearchParams?.path;
  const initialMode =
    requestedPath === "standard" ? "standard" : "customize";
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
            liveDholCatalog={liveDholCatalog}
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
