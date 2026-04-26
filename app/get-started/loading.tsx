import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const skeletonCards = ["Path", "Dhol", "Backdrop", "Extras"];

export default function Loading() {
  return (
    <div className="min-h-screen">
      <a className="skip-link focus-visible:outline-none" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="pb-24">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="overflow-hidden rounded-[2.5rem] border border-ink/8 bg-cream p-5 shadow-[0_35px_110px_-70px_rgba(34,30,71,0.52)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="h-4 w-32 rounded-full bg-indigo/10" />
                <div className="mt-5 h-14 max-w-xl rounded-[1rem] bg-indigo/10" />
                <div className="mt-4 h-4 max-w-lg rounded-full bg-ink/8" />
                <div className="mt-2 h-4 max-w-md rounded-full bg-ink/8" />

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {skeletonCards.map((card) => (
                    <div
                      aria-label={`Loading ${card}`}
                      className="rounded-[1.8rem] border border-ink/8 bg-paper/80 p-4"
                      key={card}
                    >
                      <div className="aspect-[4/3] rounded-[1.3rem] bg-ink/8" />
                      <div className="mt-4 h-5 w-36 rounded-full bg-indigo/10" />
                      <div className="mt-3 h-3 w-full rounded-full bg-ink/8" />
                      <div className="mt-2 h-3 w-2/3 rounded-full bg-ink/8" />
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[1.8rem] border border-indigo/10 bg-paper p-5">
                <div className="h-4 w-28 rounded-full bg-indigo/10" />
                <div className="mt-5 space-y-3">
                  {skeletonCards.map((card) => (
                    <div
                      className="flex items-center justify-between rounded-[1.1rem] border border-ink/8 px-4 py-3"
                      key={card}
                    >
                      <div className="h-3 w-24 rounded-full bg-ink/8" />
                      <div className="h-6 w-16 rounded-full bg-marigold/20" />
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
