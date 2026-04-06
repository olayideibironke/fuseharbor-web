export default function AdminProsLoading() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded-full bg-amber-200" />
            <div className="h-8 w-56 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-slate-100" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-black/5 bg-slate-50/80 p-4">
              <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-8 w-16 animate-pulse rounded-2xl bg-slate-300" />
            </div>

            <div className="rounded-[22px] border border-black/5 bg-slate-50/80 p-4">
              <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-8 w-16 animate-pulse rounded-2xl bg-slate-300" />
            </div>

            <div className="rounded-[22px] border border-black/5 bg-slate-50/80 p-4">
              <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-8 w-16 animate-pulse rounded-2xl bg-slate-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-5 w-36 animate-pulse rounded-full bg-slate-200" />
            <div className="h-10 w-full max-w-sm animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="hidden items-center gap-4 rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3 md:grid md:grid-cols-[1.1fr_1fr_0.9fr_0.8fr_0.8fr]">
            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
          </div>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-black/5 bg-white/85 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
            >
              <div className="grid gap-4 md:grid-cols-[1.1fr_1fr_0.9fr_0.8fr_0.8fr] md:items-center">
                <div className="space-y-2">
                  <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-44 animate-pulse rounded-full bg-slate-100" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100" />
                </div>

                <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}