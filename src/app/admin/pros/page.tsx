"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronLeft,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type ProInterestRequestRow = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  trade_category: string;
  service_area: string;
  notes: string | null;
  created_at: string;
  status: string;
  admin_notes: string | null;
  assigned_to: string | null;
  follow_up_date: string | null;
};

type AdminUserRow = {
  email: string;
  is_active: boolean;
};

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatStatusLabel(status: string) {
  if (!status) {
    return "new";
  }

  return status.replaceAll("_", " ");
}

function statusBadgeClassName(status: string) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "reviewing":
      return "bg-fh-sand text-fh-copper";
    case "contacted":
      return "bg-blue-100 text-blue-700";
    case "qualified":
      return "bg-green-100 text-green-700";
    case "on_hold":
      return "bg-amber-100 text-amber-700";
    case "closed":
      return "bg-fh-graphite text-fh-white";
    default:
      return "bg-fh-warm-white text-fh-moss border border-fh-linen";
  }
}

function formatDateOnly(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function isFollowUpDue(value: string | null) {
  if (!value) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const followUp = new Date(`${value}T00:00:00`);

  if (Number.isNaN(followUp.getTime())) {
    return false;
  }

  return followUp <= today;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export default function AdminProsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ProInterestRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tradeFilter, setTradeFilter] = useState("all");
  const [serviceAreaFilter, setServiceAreaFilter] = useState("all");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      try {
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

        const { data, error } = await supabase
          .from("admin_users")
          .select("email,is_active")
          .eq("email", userEmail)
          .maybeSingle();

        if (error) {
          throw error;
        }

        const adminUser = data as AdminUserRow | null;

        if (!adminUser || !adminUser.is_active) {
          if (isMounted) {
            setAccessDenied(true);
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setIsAuthorized(true);
          setAccessDenied(false);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Something went wrong while checking admin access.";

          setErrorMessage(message);
          setIsLoading(false);
        }
      }
    }

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    let isMounted = true;

    async function loadRequests() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const supabase = getSupabaseBrowserClient();

        const { data, error } = await supabase
          .from("pro_interest_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (isMounted) {
          setRequests((data as ProInterestRequestRow[]) ?? []);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while loading pro interest requests.";

        if (isMounted) {
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, [isAuthorized]);

  const uniqueTrades = useMemo(() => {
    const values = Array.from(
      new Set(requests.map((request) => request.trade_category).filter(Boolean)),
    );

    return values.sort((a, b) => a.localeCompare(b));
  }, [requests]);

  const uniqueServiceAreas = useMemo(() => {
    const values = Array.from(
      new Set(requests.map((request) => request.service_area).filter(Boolean)),
    );

    return values.sort((a, b) => a.localeCompare(b));
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        query.length === 0 ||
        [
          request.company_name,
          request.contact_name,
          request.email,
          request.phone,
          request.trade_category,
          request.service_area,
          request.notes ?? "",
          request.status ?? "",
          request.assigned_to ?? "",
          request.follow_up_date ?? "",
          request.admin_notes ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesTrade =
        tradeFilter === "all" || request.trade_category === tradeFilter;

      const matchesServiceArea =
        serviceAreaFilter === "all" || request.service_area === serviceAreaFilter;

      return matchesSearch && matchesTrade && matchesServiceArea;
    });
  }, [requests, searchTerm, tradeFilter, serviceAreaFilter]);

  const requestCountLabel = useMemo(() => {
    if (isLoading) {
      return "Loading pro requests...";
    }

    if (filteredRequests.length === 1) {
      return "1 filtered pro request";
    }

    return `${filteredRequests.length} filtered pro requests`;
  }, [filteredRequests.length, isLoading]);

  const statusCounts = useMemo(() => {
    return {
      new: requests.filter((request) => (request.status || "new") === "new")
        .length,
      reviewing: requests.filter((request) => request.status === "reviewing")
        .length,
      contacted: requests.filter((request) => request.status === "contacted")
        .length,
      qualified: requests.filter((request) => request.status === "qualified")
        .length,
      closed: requests.filter((request) => request.status === "closed").length,
    };
  }, [requests]);

  const followUpDueCount = useMemo(() => {
    return requests.filter(
      (request) =>
        request.status !== "closed" && isFollowUpDue(request.follow_up_date),
    ).length;
  }, [requests]);

  const reporting = useMemo(() => {
    const totalRequests = requests.length;
    const uniqueTradeCount = new Set(
      requests.map((request) => request.trade_category).filter(Boolean),
    ).size;
    const uniqueServiceAreaCount = new Set(
      requests.map((request) => request.service_area).filter(Boolean),
    ).size;
    const assignedCount = requests.filter(
      (request) => (request.assigned_to ?? "").trim().length > 0,
    ).length;
    const activeReviewCount = requests.filter(
      (request) => request.status !== "closed",
    ).length;

    const assignedRate =
      totalRequests > 0 ? (assignedCount / totalRequests) * 100 : 0;

    const tradeBreakdown = Array.from(
      requests.reduce<Map<string, number>>((accumulator, request) => {
        const key = request.trade_category || "Unknown";
        accumulator.set(key, (accumulator.get(key) ?? 0) + 1);
        return accumulator;
      }, new Map()),
    )
      .map(([tradeCategory, count]) => ({
        tradeCategory,
        count,
        percentage: totalRequests > 0 ? (count / totalRequests) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const serviceAreaBreakdown = Array.from(
      requests.reduce<Map<string, number>>((accumulator, request) => {
        const key = request.service_area || "Unknown";
        accumulator.set(key, (accumulator.get(key) ?? 0) + 1);
        return accumulator;
      }, new Map()),
    )
      .map(([serviceArea, count]) => ({
        serviceArea,
        count,
        percentage: totalRequests > 0 ? (count / totalRequests) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalRequests,
      uniqueTradeCount,
      uniqueServiceAreaCount,
      assignedCount,
      activeReviewCount,
      assignedRate,
      tradeBreakdown,
      serviceAreaBreakdown,
    };
  }, [requests]);

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

  if (!isAuthorized && !accessDenied && !errorMessage) {
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
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-fh-stone transition hover:text-fh-graphite"
            >
              <ChevronLeft size={16} />
              Back to admin
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
            Internal pro intake operations
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Admin / Pro Queue
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Review and manage professional interest intake
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            This internal queue is for reviewing incoming pro submissions,
            tracking supply-side progress, assigning internal owners, and keeping
            early network operations organized.
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

        {!accessDenied ? (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-moss uppercase">
                  New
                </p>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {statusCounts.new}
                </p>
              </div>

              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                  Reviewing
                </p>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {statusCounts.reviewing}
                </p>
              </div>

              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase">
                  Contacted
                </p>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {statusCounts.contacted}
                </p>
              </div>

              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-green-700 uppercase">
                  Qualified
                </p>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {statusCounts.qualified}
                </p>
              </div>

              <div className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle size={16} />
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase">
                    Follow-up due
                  </p>
                </div>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold text-fh-graphite">
                  {followUpDueCount}
                </p>
              </div>
            </div>

            <div className="mb-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[32px] border border-fh-linen bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-fh-moss">
                  <Activity size={16} />
                  <p className="text-sm font-semibold tracking-[0.2em] uppercase">
                    Supply reporting
                  </p>
                </div>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Operational snapshot
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Total requests
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.totalRequests}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Active review
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.activeReviewCount}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Trade categories
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.uniqueTradeCount}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Assigned
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.assignedCount}
                    </p>
                    <p className="mt-1 text-sm text-fh-stone">
                      {formatPercent(reporting.assignedRate)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-fh-linen bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Service areas
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.uniqueServiceAreaCount}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Follow-up due
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {followUpDueCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[32px] border border-fh-linen bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                    Trade breakdown
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                    Interest by trade
                  </h2>

                  <div className="mt-6 grid gap-4">
                    {reporting.tradeBreakdown.length > 0 ? (
                      reporting.tradeBreakdown.map((item) => (
                        <div
                          key={item.tradeCategory}
                          className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-fh-graphite">
                              {item.tradeCategory}
                            </p>
                            <div className="text-right">
                              <p className="text-base font-semibold text-fh-graphite">
                                {item.count}
                              </p>
                              <p className="text-sm text-fh-stone">
                                {formatPercent(item.percentage)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                        <p className="text-sm text-fh-stone">
                          No trade data available yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[32px] border border-fh-linen bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                    Coverage breakdown
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                    Interest by service area
                  </h2>

                  <div className="mt-6 grid gap-4">
                    {reporting.serviceAreaBreakdown.length > 0 ? (
                      reporting.serviceAreaBreakdown.map((item) => (
                        <div
                          key={item.serviceArea}
                          className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-fh-graphite">
                              {item.serviceArea}
                            </p>
                            <div className="text-right">
                              <p className="text-base font-semibold text-fh-graphite">
                                {item.count}
                              </p>
                              <p className="text-sm text-fh-stone">
                                {formatPercent(item.percentage)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                        <p className="text-sm text-fh-stone">
                          No service area data available yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 grid gap-4 rounded-[32px] border border-fh-linen bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.55fr_0.55fr_0.55fr]">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                  Pro queue
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  {requestCountLabel}
                </h2>
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Search
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fh-stone"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search company, contact, trade..."
                    className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white py-3 pl-11 pr-4 text-sm text-fh-graphite outline-none transition placeholder:text-fh-stone/80 focus:border-fh-copper focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Trade
                </label>
                <select
                  value={tradeFilter}
                  onChange={(event) => setTradeFilter(event.target.value)}
                  className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper"
                >
                  <option value="all">All trades</option>
                  {uniqueTrades.map((trade) => (
                    <option key={trade} value={trade}>
                      {trade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Service area
                </label>
                <select
                  value={serviceAreaFilter}
                  onChange={(event) => setServiceAreaFilter(event.target.value)}
                  className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper"
                >
                  <option value="all">All service areas</option>
                  {uniqueServiceAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
                <p className="text-base text-fh-stone">
                  Loading pro interest requests...
                </p>
              </div>
            ) : null}

            {!isLoading && errorMessage ? (
              <div className="rounded-[32px] border border-red-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-red-600 uppercase">
                  Load error
                </p>
                <p className="mt-3 text-base leading-7 text-red-600">
                  {errorMessage}
                </p>
              </div>
            ) : null}

            {!isLoading && !errorMessage && requests.length === 0 ? (
              <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                  No submissions yet
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Your first pro interest request will appear here
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-fh-stone">
                  Once a professional submits the interest form, the request will
                  show on this page automatically.
                </p>
              </div>
            ) : null}

            {!isLoading &&
            !errorMessage &&
            requests.length > 0 &&
            filteredRequests.length === 0 ? (
              <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                  No matching results
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Try adjusting your search or filters
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-fh-stone">
                  No pro interest requests match the current search term or selected
                  filter combination.
                </p>
              </div>
            ) : null}

            {!isLoading && !errorMessage && filteredRequests.length > 0 ? (
              <div className="grid gap-6">
                {filteredRequests.map((request) => {
                  const followUpDue =
                    request.status !== "closed" &&
                    isFollowUpDue(request.follow_up_date);

                  return (
                    <article
                      key={request.id}
                      className={`rounded-[32px] border bg-white p-7 shadow-sm ${
                        followUpDue ? "border-amber-300" : "border-fh-linen"
                      }`}
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-fh-sand px-4 py-2 text-sm font-semibold text-fh-copper">
                              <Wrench size={16} />
                              {request.trade_category}
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-warm-white px-4 py-2 text-sm text-fh-stone">
                              <MapPin size={15} />
                              {request.service_area}
                            </span>

                            <span
                              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusBadgeClassName(
                                request.status,
                              )}`}
                            >
                              {formatStatusLabel(request.status)}
                            </span>

                            {followUpDue ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                                <AlertCircle size={16} />
                                Follow-up due
                              </span>
                            ) : null}
                          </div>

                          <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                            {request.company_name}
                          </h3>

                          <p className="mt-3 text-base leading-7 text-fh-stone">
                            Submitted by {request.contact_name}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4 text-sm text-fh-stone">
                          <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-fh-copper" />
                            {formatCreatedAt(request.created_at)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Company
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <Building2
                              size={16}
                              className="mt-1 shrink-0 text-fh-moss"
                            />
                            <span>{request.company_name}</span>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Contact
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <User size={16} className="mt-1 shrink-0 text-fh-moss" />
                            <span>{request.contact_name}</span>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Email
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <Mail size={16} className="mt-1 shrink-0 text-fh-moss" />
                            <span>{request.email}</span>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Phone
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <Phone
                              size={16}
                              className="mt-1 shrink-0 text-fh-moss"
                            />
                            <span>{request.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-4">
                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Assigned to
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {request.assigned_to?.trim() || "Unassigned"}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Follow-up date
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <CalendarDays
                              size={16}
                              className="mt-1 shrink-0 text-fh-moss"
                            />
                            <span>
                              {formatDateOnly(
                                request.follow_up_date,
                                "No follow-up date set.",
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4 lg:col-span-2">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Admin notes
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {request.admin_notes?.trim() || "No admin notes yet."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Trade category
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {request.trade_category}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Service area
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {request.service_area}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Notes
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {request.notes?.trim() || "No notes provided."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-start lg:justify-end">
                        <Link
                          href={`/admin/pros/${request.id}`}
                          className="inline-flex items-center justify-center rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
                        >
                          Open request
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      <SiteFooter />
    </main>
  );
}