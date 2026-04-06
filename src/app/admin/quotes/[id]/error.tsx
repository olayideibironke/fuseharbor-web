"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function AdminQuoteDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Link
                href="/admin/quotes"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to quotes
              </Link>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
                  FuseHarbor Admin
                </p>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>

                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                      Quote review hit an error
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                      Something unexpected interrupted this quote review screen.
                      Retry the page or return to the quotes queue.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              Internal only
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">
              Recovery options
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Retry this quote review first. If the issue continues, go back to
              the queue and reopen the request from there.
            </p>
          </div>

          {error?.message ? (
            <div className="rounded-[24px] border border-red-100 bg-red-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                Error message
              </p>
              <p className="mt-2 break-words text-sm text-red-800">
                {error.message}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <Link
              href="/admin/quotes"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              Quotes queue
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              Admin dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}