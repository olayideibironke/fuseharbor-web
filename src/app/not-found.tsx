import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Page not found
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            This page does not exist
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            The link may be broken, the page may have moved, or the address may
            have been typed incorrectly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
              <SearchX size={28} />
            </div>

            <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
              Let’s get you back on track
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fh-stone">
              FuseHarbor is focused on a cleaner homeowner and pro experience.
              Use one of the main entry points below to continue.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                <Home size={16} />
                Back home
              </Link>

              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                Get a Quote
              </Link>

              <Link
                href="/for-pros"
                className="inline-flex items-center justify-center rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                For Pros
              </Link>
            </div>
          </div>

          <div className="rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
              Helpful paths
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
              Start from a main public route
            </h3>
            <p className="mt-3 text-sm leading-7 text-fh-stone">
              The best next step is usually returning to the main site, starting
              a quote request, or visiting the pro interest page.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                <p className="text-sm font-semibold text-fh-graphite">
                  Home page
                </p>
                <p className="mt-1 text-sm leading-6 text-fh-stone">
                  Return to the main FuseHarbor experience and explore from the
                  beginning.
                </p>
              </div>

              <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                <p className="text-sm font-semibold text-fh-graphite">
                  Get a Quote
                </p>
                <p className="mt-1 text-sm leading-6 text-fh-stone">
                  Start the homeowner intake flow for EV chargers, panels, heat
                  pumps, and backup power.
                </p>
              </div>

              <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                <p className="text-sm font-semibold text-fh-graphite">
                  For Pros
                </p>
                <p className="mt-1 text-sm leading-6 text-fh-stone">
                  Submit early professional interest while the marketplace keeps
                  becoming more polished and launch-ready.
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-fh-graphite transition hover:text-fh-copper"
            >
              <ArrowLeft size={16} />
              Return to FuseHarbor home
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}