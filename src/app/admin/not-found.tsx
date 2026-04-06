import Link from "next/link";
import { Compass, Home, SearchX, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f6f2eb] text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[320px] bg-[radial-gradient(circle_at_top,rgba(234,170,74,0.16),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[-120px] top-28 z-0 h-72 w-72 rounded-full bg-[rgba(59,130,246,0.08)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-140px] left-[-120px] z-0 h-80 w-80 rounded-full bg-[rgba(15,118,110,0.08)] blur-3xl"
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full overflow-hidden rounded-[32px] border border-black/5 bg-white/92 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <div className="max-w-3xl space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
                FuseHarbor
              </p>

              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <SearchX className="h-5 w-5" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Page not found
                  </h1>
                  <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                    The page you tried to open does not exist or may have moved. Use one of the routes below to get back into a working FuseHarbor path.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Home className="h-4 w-4" />
                  Back home
                </Link>

                <Link
                  href="/get-a-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Compass className="h-4 w-4" />
                  Get a quote
                </Link>

                <Link
                  href="/for-pros"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Shield className="h-4 w-4" />
                  For pros
                </Link>

                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Shield className="h-4 w-4" />
                  Admin dashboard
                </Link>

                <Link
                  href="/admin/quotes"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Compass className="h-4 w-4" />
                  Quotes queue
                </Link>

                <Link
                  href="/admin/pros"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Shield className="h-4 w-4" />
                  Pros queue
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}