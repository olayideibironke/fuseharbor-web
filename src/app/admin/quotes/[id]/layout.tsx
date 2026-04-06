import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function AdminQuoteDetailLayout({
  children,
}: {
  children: ReactNode;
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
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                      Quote request review
                    </h1>
                    <p className="text-sm text-slate-600">
                      Review homeowner details, update workflow status, and keep the intake moving cleanly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Internal only
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                Mobile-ready
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                Workflow review
              </span>
            </div>
          </div>
        </div>
      </section>

      <div>{children}</div>
    </div>
  );
}