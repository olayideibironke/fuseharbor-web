"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function ForProsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f6f4ef] text-fh-graphite">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-fh-stone transition hover:text-fh-graphite"
          >
            <ArrowLeft size={16} />
            Back home
          </Link>

          <section className="overflow-hidden rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                    FuseHarbor
                  </p>
                  <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight text-fh-graphite sm:text-4xl">
                    Something interrupted the pro application page
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-fh-stone">
                    The page hit an unexpected problem. Please try again, or go
                    back home and restart your pro application.
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit rounded-full border border-fh-linen bg-fh-warm-white px-4 py-2 text-xs font-semibold tracking-[0.18em] text-fh-moss uppercase">
                Pro intake
              </span>
            </div>

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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                <RefreshCw size={16} />
                Try again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-fh-linen bg-fh-white px-5 py-3 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                Back home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}