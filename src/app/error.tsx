"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Something went wrong
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            The page hit an unexpected problem
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            FuseHarbor ran into an unexpected issue. Please try the page again
            or return to one of the main public entry points.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={28} />
            </div>

            <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
              Let’s recover cleanly
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fh-stone">
              Try loading the page again first. If the issue continues, return
              home or restart from the main public routes.
            </p>

            {error?.message ? (
              <div className="mt-8 rounded-[24px] border border-red-100 bg-red-50/70 p-4">
                <p className="text-xs font-semibold tracking-[0.18em] text-red-700 uppercase">
                  Error message
                </p>
                <p className="mt-2 break-words text-sm leading-6 text-red-800">
                  {error.message}
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                <RefreshCw size={16} />
                Try again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
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
              Best next steps
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
              Restart from a trusted public route
            </h3>
            <p className="mt-3 text-sm leading-7 text-fh-stone">
              The best recovery path is usually returning home, restarting the
              homeowner quote flow, or reopening the pro interest page.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                <p className="text-sm font-semibold text-fh-graphite">
                  Home page
                </p>
                <p className="mt-1 text-sm leading-6 text-fh-stone">
                  Return to the main FuseHarbor experience and navigate again
                  from the top.
                </p>
              </div>

              <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                <p className="text-sm font-semibold text-fh-graphite">
                  Get a Quote
                </p>
                <p className="mt-1 text-sm leading-6 text-fh-stone">
                  Restart the homeowner intake flow for electrification
                  projects.
                </p>
              </div>

              <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                <p className="text-sm font-semibold text-fh-graphite">
                  For Pros
                </p>
                <p className="mt-1 text-sm leading-6 text-fh-stone">
                  Reopen the pro interest route and continue from a clean state.
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