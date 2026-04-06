"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ClipboardList,
  LockKeyhole,
  LogOut,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type AdminUserRow = {
  email: string;
  is_active: boolean;
};

export default function AdminHomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);
  const [proCount, setProCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminHome() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const supabase = getSupabaseBrowserClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/admin/access");
          return;
        }

        const userEmail = session.user.email?.trim().toLowerCase();

        if (!userEmail) {
          await supabase.auth.signOut();
          router.replace("/admin/access");
          return;
        }

        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("email,is_active")
          .eq("email", userEmail)
          .maybeSingle();

        if (adminError) {
          throw adminError;
        }

        const adminUser = adminData as AdminUserRow | null;

        if (!adminUser || !adminUser.is_active) {
          if (isMounted) {
            setAccessDenied(true);
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        const [{ count: quoteRequestCount, error: quoteError }, { count: proRequestCount, error: proError }] =
          await Promise.all([
            supabase
              .from("quote_requests")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("pro_interest_requests")
              .select("id", { count: "exact", head: true }),
          ]);

        if (quoteError) {
          throw quoteError;
        }

        if (proError) {
          throw proError;
        }

        if (isMounted) {
          setIsAuthorized(true);
          setAccessDenied(false);
          setQuoteCount(quoteRequestCount ?? 0);
          setProCount(proRequestCount ?? 0);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Something went wrong while loading the admin dashboard.";

          setErrorMessage(message);
          setIsLoading(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminHome();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const totalIntakeCount = useMemo(() => {
    return quoteCount + proCount;
  }, [proCount, quoteCount]);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);

      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();

      router.replace("/admin/access");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!isAuthorized && !accessDenied && !errorMessage && isLoading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#f7f5f0,_#ece7de)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(35,38,43,0.08),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.10),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-fh-stone transition hover:text-fh-graphite"
            >
              <ChevronLeft size={16} />
              Back to public site
            </Link>

            {isAuthorized ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  isSigningOut
                    ? "cursor-not-allowed bg-fh-stone/35 text-fh-white/85"
                    : "bg-fh-graphite text-fh-white hover:opacity-95"
                }`}
              >
                <LogOut size={16} />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            ) : null}
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-fh-graphite uppercase shadow-sm">
            <LockKeyhole size={14} className="text-fh-copper" />
            Internal operations only
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Admin Control Center
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Manage homeowner demand and pro-side intake
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            This internal FuseHarbor workspace is for reviewing quote demand,
            tracking pro interest, and keeping launch-stage operations organized
            while the public marketplace continues to mature.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {accessDenied ? (
          <div className="rounded-[32px] border border-amber-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <ShieldAlert size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-amber-700 uppercase">
                  Access denied
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
                  Your account is signed in, but not approved for admin access
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-fh-stone">
                  Add this signed-in email address to the <code>admin_users</code>{" "}
                  table and make sure <code>is_active</code> is set to true.
                </p>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isSigningOut
                      ? "cursor-not-allowed bg-fh-stone/35 text-fh-white/85"
                      : "bg-fh-graphite text-fh-white hover:opacity-95"
                  }`}
                >
                  <LogOut size={16} />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {!accessDenied && isLoading ? (
          <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
            <p className="text-base text-fh-stone">Loading admin dashboard...</p>
          </div>
        ) : null}

        {!accessDenied && !isLoading && errorMessage ? (
          <div className="rounded-[32px] border border-red-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold tracking-[0.2em] text-red-600 uppercase">
              Load error
            </p>
            <p className="mt-3 text-base leading-7 text-red-600">
              {errorMessage}
            </p>
          </div>
        ) : null}

        {!accessDenied && !isLoading && !errorMessage ? (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-fh-moss">
                  <Activity size={16} />
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase">
                    Total intake
                  </p>
                </div>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {totalIntakeCount}
                </p>
              </div>

              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                  Homeowner quotes
                </p>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {quoteCount}
                </p>
              </div>

              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                  Pro interest requests
                </p>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {proCount}
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <article className="rounded-[32px] border border-fh-linen bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                      Demand side
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                      Homeowner quote requests
                    </h2>
                    <p className="mt-4 max-w-xl text-base leading-7 text-fh-stone">
                      Review homeowner submissions, update status, assign owners,
                      set follow-up dates, and manage quote workflow in one
                      internal queue.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                    <ClipboardList size={24} />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Current volume
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {quoteCount}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Operational use
                    </p>
                    <p className="mt-2 text-sm leading-7 text-fh-stone">
                      Queue review, detail updates, assignments, follow-ups, and
                      communication tracking.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/admin/quotes"
                    className="inline-flex items-center gap-2 rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
                  >
                    Open quote queue
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>

              <article className="rounded-[32px] border border-fh-linen bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                      Supply side
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                      Pro interest requests
                    </h2>
                    <p className="mt-4 max-w-xl text-base leading-7 text-fh-stone">
                      Review incoming pro interest, track review status, assign
                      internal owners, manage follow-ups, and keep supply-side
                      intake organized before outreach begins.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                    <Users size={24} />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Current volume
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {proCount}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Operational use
                    </p>
                    <p className="mt-2 text-sm leading-7 text-fh-stone">
                      Queue review, detail updates, status checks, assignments,
                      follow-up scheduling, and internal notes.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/admin/pros"
                    className="inline-flex items-center gap-2 rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
                  >
                    Open pro queue
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            </div>

            <div className="mt-8 rounded-[32px] border border-fh-linen bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Internal operating note
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                Admin is now clearly separated from the public marketplace
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-fh-stone">
                FuseHarbor now has a more intentional internal layer for both
                homeowner demand and professional supply intake. This keeps
                operations organized behind the scenes while the public-facing
                experience stays premium, calm, and launch-focused.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin/quotes"
                  className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-warm-white px-5 py-3 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
                >
                  <Briefcase size={16} />
                  Go to quotes
                </Link>

                <Link
                  href="/admin/pros"
                  className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-warm-white px-5 py-3 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
                >
                  <Users size={16} />
                  Go to pros
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </section>

      <SiteFooter />
    </main>
  );
}