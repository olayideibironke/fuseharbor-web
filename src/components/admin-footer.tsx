export function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-6 pt-2 sm:px-6 sm:pb-8 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
                FuseHarbor
              </p>
              <p className="text-sm font-semibold text-slate-900 sm:text-base">
                Admin workflow console
              </p>
              <p className="text-sm text-slate-600">
                Internal tools for quote review, pro intake, and launch-readiness operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Internal only
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                Maryland-first
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                Trust-first
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                Premium ops
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-slate-200" />

          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} FuseHarbor. Premium Home Electrification Marketplace.</p>
            <p>Built for calm review workflows across desktop and mobile.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}