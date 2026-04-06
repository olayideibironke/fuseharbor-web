export default function AdminLoading() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-3">
            <div className="h-3 w-28 animate-pulse rounded-full bg-amber-200" />
            <div className="h-8 w-56 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-black/5 bg-white/85 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-8 w-20 animate-pulse rounded-2xl bg-slate-300" />
          <div className="mt-3 h-3 w-32 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="rounded-[24px] border border-black/5 bg-white/85 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-8 w-20 animate-pulse rounded-2xl bg-slate-300" />
          <div className="mt-3 h-3 w-32 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="rounded-[24px] border border-black/5 bg-white/85 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-8 w-20 animate-pulse rounded-2xl bg-slate-300" />
          <div className="mt-3 h-3 w-32 animate-pulse rounded-full bg-slate-100" />
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
          <div className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
          <div className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
        </div>
      </section>
    </div>
  );
}