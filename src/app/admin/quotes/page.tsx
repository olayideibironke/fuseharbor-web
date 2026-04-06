"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
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
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminFooter } from "@/components/admin-footer";
import { AdminHeader } from "@/components/admin-header";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type QuoteRequestRow = {
  id: string;
  project_type: string;
  project_goal: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
  property_type: string;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  assigned_to: string | null;
  follow_up_date: string | null;
  preferred_contact_method: string | null;
  last_contacted_at: string | null;
  contact_outcome: string | null;
  outreach_log: string | null;
  created_at: string;
};

type AdminUserRow = {
  email: string;
  is_active: boolean;
};

const statusFilterOptions = [
  "all",
  "new",
  "contacted",
  "qualified",
  "closed",
] as const;

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

function formatFollowUpDate(value: string | null) {
  return formatDateOnly(value, "No follow-up set");
}

function formatStatusLabel(status: string) {
  if (!status) {
    return "new";
  }

  return status.replaceAll("_", " ");
}

function formatLabel(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  return value.replaceAll("_", " ");
}

function statusBadgeClassName(status: string) {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "contacted":
      return "bg-fh-sand text-fh-copper";
    case "qualified":
      return "bg-green-100 text-green-700";
    case "closed":
      return "bg-fh-graphite text-fh-white";
    default:
      return "bg-fh-warm-white text-fh-moss border border-fh-linen";
  }
}

function isFollowUpOverdue(value: string | null) {
  if (!value) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const followUp = new Date(`${value}T00:00:00`);

  if (Number.isNaN(followUp.getTime())) {
    return false;
  }

  return followUp < today;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export default function AdminQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilterOptions)[number]>("all");
  const [projectTypeFilter, setProjectTypeFilter] = useState("all");
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

    async function loadQuotes() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const supabase = getSupabaseBrowserClient();

        const { data, error } = await supabase
          .from("quote_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (isMounted) {
          setQuotes((data as QuoteRequestRow[]) ?? []);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while loading quote requests.";

        if (isMounted) {
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadQuotes();

    return () => {
      isMounted = false;
    };
  }, [isAuthorized]);

  const uniqueProjectTypes = useMemo(() => {
    const values = Array.from(
      new Set(quotes.map((quote) => quote.project_type).filter(Boolean)),
    );

    return values.sort((a, b) => a.localeCompare(b));
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesSearch =
        query.length === 0 ||
        [
          quote.full_name,
          quote.email,
          quote.phone,
          quote.project_type,
          quote.project_goal,
          quote.address,
          quote.city,
          quote.zip_code,
          quote.property_type,
          quote.notes ?? "",
          quote.admin_notes ?? "",
          quote.assigned_to ?? "",
          quote.follow_up_date ?? "",
          quote.preferred_contact_method ?? "",
          quote.last_contacted_at ?? "",
          quote.contact_outcome ?? "",
          quote.outreach_log ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" || quote.status.toLowerCase() === statusFilter;

      const matchesProjectType =
        projectTypeFilter === "all" || quote.project_type === projectTypeFilter;

      return matchesSearch && matchesStatus && matchesProjectType;
    });
  }, [projectTypeFilter, quotes, searchTerm, statusFilter]);

  const quoteCountLabel = useMemo(() => {
    if (isLoading) {
      return "Loading quotes...";
    }

    if (filteredQuotes.length === 1) {
      return "1 filtered quote";
    }

    return `${filteredQuotes.length} filtered quotes`;
  }, [filteredQuotes.length, isLoading]);

  const statusCounts = useMemo(() => {
    return {
      new: quotes.filter((quote) => (quote.status || "new") === "new").length,
      contacted: quotes.filter((quote) => quote.status === "contacted").length,
      qualified: quotes.filter((quote) => quote.status === "qualified").length,
      closed: quotes.filter((quote) => quote.status === "closed").length,
    };
  }, [quotes]);

  const overdueCount = useMemo(() => {
    return quotes.filter(
      (quote) =>
        quote.status !== "closed" && isFollowUpOverdue(quote.follow_up_date),
    ).length;
  }, [quotes]);

  const reporting = useMemo(() => {
    const totalQuotes = quotes.length;
    const untouchedCount = quotes.filter(
      (quote) => (quote.status || "new") === "new",
    ).length;
    const contactedCount = quotes.filter(
      (quote) =>
        quote.status === "contacted" ||
        quote.status === "qualified" ||
        quote.status === "closed",
    ).length;
    const qualifiedCount = quotes.filter(
      (quote) => quote.status === "qualified" || quote.status === "closed",
    ).length;
    const closedCount = quotes.filter((quote) => quote.status === "closed").length;
    const assignedCount = quotes.filter(
      (quote) => (quote.assigned_to ?? "").trim().length > 0,
    ).length;
    const activePipelineCount = quotes.filter(
      (quote) => quote.status !== "closed",
    ).length;

    const contactedRate =
      totalQuotes > 0 ? (contactedCount / totalQuotes) * 100 : 0;
    const qualifiedRate =
      totalQuotes > 0 ? (qualifiedCount / totalQuotes) * 100 : 0;
    const closedRate = totalQuotes > 0 ? (closedCount / totalQuotes) * 100 : 0;
    const assignedRate =
      totalQuotes > 0 ? (assignedCount / totalQuotes) * 100 : 0;

    const projectTypeBreakdown = Array.from(
      quotes.reduce<Map<string, number>>((accumulator, quote) => {
        const key = quote.project_type || "Unknown";
        accumulator.set(key, (accumulator.get(key) ?? 0) + 1);
        return accumulator;
      }, new Map()),
    )
      .map(([projectType, count]) => ({
        projectType,
        count,
        percentage: totalQuotes > 0 ? (count / totalQuotes) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalQuotes,
      untouchedCount,
      contactedCount,
      qualifiedCount,
      closedCount,
      assignedCount,
      activePipelineCount,
      contactedRate,
      qualifiedRate,
      closedRate,
      assignedRate,
      projectTypeBreakdown,
    };
  }, [quotes]);

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

        <AdminHeader />

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
            Internal homeowner operations
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Admin / Quote Queue
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Review and manage homeowner quote intake
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            This internal queue is for reviewing homeowner submissions, tracking
            pipeline progress, assigning next steps, and keeping demand-side
            operations organized.
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

              <div className="rounded-[28px] border border-fh-linen bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-graphite uppercase">
                  Closed
                </p>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                  {statusCounts.closed}
                </p>
              </div>

              <div className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle size={16} />
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase">
                    Overdue follow-ups
                  </p>
                </div>
                <p className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold text-fh-graphite">
                  {overdueCount}
                </p>
              </div>
            </div>

            <div className="mb-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[32px] border border-fh-linen bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-fh-moss">
                  <Activity size={16} />
                  <p className="text-sm font-semibold tracking-[0.2em] uppercase">
                    Pipeline reporting
                  </p>
                </div>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Operational snapshot
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Total quotes
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.totalQuotes}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Active pipeline
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.activePipelineCount}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Untouched
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {reporting.untouchedCount}
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

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-fh-linen bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Contacted rate
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {formatPercent(reporting.contactedRate)}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Qualified rate
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {formatPercent(reporting.qualifiedRate)}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Closed rate
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-fh-graphite">
                      {formatPercent(reporting.closedRate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-fh-linen bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                  Project breakdown
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Demand by project type
                </h2>

                <div className="mt-6 grid gap-4">
                  {reporting.projectTypeBreakdown.length > 0 ? (
                    reporting.projectTypeBreakdown.map((item) => (
                      <div
                        key={item.projectType}
                        className="rounded-[24px] border border-fh-linen bg-fh-warm-white p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-fh-graphite">
                            {item.projectType}
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
                        No project data available yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 grid gap-4 rounded-[32px] border border-fh-linen bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.5fr_0.5fr]">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                  Quote queue
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  {quoteCountLabel}
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
                    placeholder="Search name, email, city, project..."
                    className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white py-3 pl-11 pr-4 text-sm text-fh-graphite outline-none transition placeholder:text-fh-stone/80 focus:border-fh-copper focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target
                          .value as (typeof statusFilterOptions)[number],
                      )
                    }
                    className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper"
                  >
                    {statusFilterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === "all"
                          ? "All statuses"
                          : formatStatusLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    Project type
                  </label>
                  <select
                    value={projectTypeFilter}
                    onChange={(event) => setProjectTypeFilter(event.target.value)}
                    className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper"
                  >
                    <option value="all">All project types</option>
                    {uniqueProjectTypes.map((projectType) => (
                      <option key={projectType} value={projectType}>
                        {projectType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
                <p className="text-base text-fh-stone">Loading quote requests...</p>
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

            {!isLoading && !errorMessage && quotes.length === 0 ? (
              <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                  No submissions yet
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Your first quote request will appear here
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-fh-stone">
                  Once a homeowner submits the quote form, the request will show on
                  this page automatically.
                </p>
              </div>
            ) : null}

            {!isLoading &&
            !errorMessage &&
            quotes.length > 0 &&
            filteredQuotes.length === 0 ? (
              <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                  No matching results
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Try adjusting your search or filters
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-fh-stone">
                  No quote requests match the current search term or selected filter
                  combination.
                </p>
              </div>
            ) : null}

            {!isLoading && !errorMessage && filteredQuotes.length > 0 ? (
              <div className="grid gap-6">
                {filteredQuotes.map((quote) => {
                  const overdueFollowUp =
                    quote.status !== "closed" &&
                    isFollowUpOverdue(quote.follow_up_date);

                  return (
                    <article
                      key={quote.id}
                      className={`rounded-[32px] border bg-white p-7 shadow-sm ${
                        overdueFollowUp
                          ? "border-amber-300"
                          : "border-fh-linen"
                      }`}
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-fh-sand px-4 py-2 text-sm font-semibold text-fh-copper">
                              <Zap size={16} />
                              {quote.project_type}
                            </span>

                            <span className="rounded-full border border-fh-linen bg-fh-warm-white px-4 py-2 text-sm text-fh-stone">
                              {quote.property_type}
                            </span>

                            <span
                              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusBadgeClassName(
                                quote.status,
                              )}`}
                            >
                              {formatStatusLabel(quote.status)}
                            </span>

                            {overdueFollowUp ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                                <AlertCircle size={16} />
                                Follow-up overdue
                              </span>
                            ) : null}
                          </div>

                          <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                            {quote.full_name}
                          </h3>

                          <p className="mt-3 text-base leading-7 text-fh-stone">
                            {quote.project_goal}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4 text-sm text-fh-stone">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-fh-copper" />
                            {formatCreatedAt(quote.created_at)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Email
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <Mail
                              size={16}
                              className="mt-1 shrink-0 text-fh-moss"
                            />
                            <span>{quote.email}</span>
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
                            <span>{quote.phone}</span>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4 md:col-span-2">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Location
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <MapPin
                              size={16}
                              className="mt-1 shrink-0 text-fh-moss"
                            />
                            <span>
                              {quote.address}, {quote.city}, {quote.zip_code}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Assigned to
                          </p>
                          <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-fh-stone">
                            <User
                              size={16}
                              className="mt-1 shrink-0 text-fh-moss"
                            />
                            <span>{quote.assigned_to?.trim() || "Unassigned"}</span>
                          </div>
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
                            <span>{formatFollowUpDate(quote.follow_up_date)}</span>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Admin notes
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {quote.admin_notes?.trim() || "No admin notes yet."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Preferred contact
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {formatLabel(
                              quote.preferred_contact_method,
                              "Not set yet.",
                            )}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Last contacted
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {formatDateOnly(
                              quote.last_contacted_at,
                              "No contact logged yet.",
                            )}
                          </p>
                        </div>

                        <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                          <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                            Contact outcome
                          </p>
                          <p className="mt-2 text-sm leading-7 text-fh-stone">
                            {formatLabel(
                              quote.contact_outcome,
                              "No outcome recorded yet.",
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-start lg:justify-end">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="inline-flex items-center justify-center rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
                        >
                          Open quote
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

      <AdminFooter />
    </main>
  );
}