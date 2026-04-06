export default function AdminProDetailLoading() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
          <div className="h-10 w-32 animate-pulse rounded-full bg-slate-100" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="h-3 w-28 animate-pulse rounded-full bg-amber-200" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-7 w-56 animate-pulse rounded-2xl bg-slate-200" />
                  <div className="h-4 w-72 max-w-[80vw] animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-5 w-full animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-5 w-full animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
                <div className="h-24 w-full animate-pulse rounded-[20px] bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="h-5 w-44 animate-pulse rounded-full bg-slate-200" />
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              <div className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
              <div className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
              <div className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="h-5 w-36 animate-pulse rounded-full bg-slate-200" />
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="h-11 w-full animate-pulse rounded-full bg-slate-100" />
              <div className="h-24 w-full animate-pulse rounded-[20px] bg-slate-100" />
              <div className="h-11 w-full animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              <div className="h-14 animate-pulse rounded-[20px] bg-slate-100" />
              <div className="h-14 animate-pulse rounded-[20px] bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}