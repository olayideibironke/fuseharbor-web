"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  ChevronLeft,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldAlert,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { AdminFooter } from "@/components/admin-footer";
import { AdminHeader } from "@/components/admin-header";
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

type WorkflowFormState = {
  status: string;
  assigned_to: string;
  follow_up_date: string;
  admin_notes: string;
};

const statusOptions = [
  "new",
  "reviewing",
  "contacted",
  "qualified",
  "on_hold",
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

function toWorkflowState(request: ProInterestRequestRow): WorkflowFormState {
  return {
    status: request.status || "new",
    assigned_to: request.assigned_to ?? "",
    follow_up_date: request.follow_up_date ?? "",
    admin_notes: request.admin_notes ?? "",
  };
}

export default function AdminProDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const requestId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [request, setRequest] = useState<ProInterestRequestRow | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [requestNotFound, setRequestNotFound] = useState(false);

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
    if (!isAuthorized || !requestId) {
      return;
    }

    let isMounted = true;

    async function loadRequest() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setRequestNotFound(false);

        const supabase = getSupabaseBrowserClient();

        const { data, error } = await supabase
          .from("pro_interest_requests")
          .select("*")
          .eq("id", requestId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          if (isMounted) {
            setRequest(null);
            setWorkflow(null);
            setRequestNotFound(true);
          }
          return;
        }

        if (isMounted) {
          const row = data as ProInterestRequestRow;
          setRequest(row);
          setWorkflow(toWorkflowState(row));
          setRequestNotFound(false);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while loading this pro interest request.";

        if (isMounted) {
          setErrorMessage(message);
          setRequest(null);
          setWorkflow(null);
          setRequestNotFound(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRequest();

    return () => {
      isMounted = false;
    };
  }, [isAuthorized, requestId]);

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

  async function handleSaveWorkflow() {
    if (!requestId || !workflow) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage("");
      setSaveError("");

      const supabase = getSupabaseBrowserClient();

      const payload = {
        status: workflow.status || "new",
        assigned_to: workflow.assigned_to.trim() || null,
        follow_up_date: workflow.follow_up_date || null,
        admin_notes: workflow.admin_notes.trim() || null,
      };

      const { data, error } = await supabase
        .from("pro_interest_requests")
        .update(payload)
        .eq("id", requestId)
        .select("*")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        setRequest(null);
        setWorkflow(null);
        setRequestNotFound(true);
        setSaveMessage("");
        setSaveError("");
        return;
      }

      const row = data as ProInterestRequestRow;
      setRequest(row);
      setWorkflow(toWorkflowState(row));
      setRequestNotFound(false);
      setSaveMessage("Workflow saved successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the workflow.";

      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (!isAuthorized && !accessDenied && !errorMessage) {
    return null;
  }

  if (requestNotFound) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#f7f5f0,_#ece7de)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(35,38,43,0.08),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.10),_transparent_24%)]" />

        <AdminHeader />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/pros"
              className="inline-flex items-center gap-2 text-sm font-semibold text-fh-stone transition hover:text-fh-graphite"
            >
              <ChevronLeft size={16} />
              Back to pro queue
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
            Internal pro detail review
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Admin / Pro Detail
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Review and manage one professional interest request
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            This internal detail page supports pro intake review, workflow
            updates, assignment, and follow-up planning in one place.
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
            <p className="text-base text-fh-stone">
              Loading pro interest request...
            </p>
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

            <div className="mt-6">
              <Link
                href="/admin/pros"
                className="inline-flex items-center justify-center rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                Back to pro queue
              </Link>
            </div>
          </div>
        ) : null}

        {!accessDenied && !isLoading && !errorMessage && request && workflow ? (
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[32px] border border-fh-linen bg-white p-7 shadow-sm">
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
                  </div>

                  <h2 className="mt-5 font-[family-name:var(--font-manrope)] text-4xl font-semibold">
                    {request.company_name}
                  </h2>

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

              <div className="mt-8 grid gap-4 md:grid-cols-2">
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
                    <Phone size={16} className="mt-1 shrink-0 text-fh-moss" />
                    <span>{request.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                    Notes
                  </p>
                  <p className="mt-2 text-sm leading-7 text-fh-stone">
                    {request.notes?.trim() || "No notes provided."}
                  </p>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-white px-5 py-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                    Current follow-up
                  </p>
                  <p className="mt-2 text-sm leading-7 text-fh-stone">
                    {formatDateOnly(
                      request.follow_up_date,
                      "No follow-up date set.",
                    )}
                  </p>
                </div>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="rounded-[32px] border border-fh-linen bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                  Workflow controls
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Update internal workflow
                </h3>

                <div className="mt-6 grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                      Status
                    </label>
                    <select
                      value={workflow.status}
                      onChange={(event) =>
                        setWorkflow((current) =>
                          current
                            ? { ...current, status: event.target.value }
                            : current,
                        )
                      }
                      className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {formatStatusLabel(option)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                      Assigned to
                    </label>
                    <input
                      type="text"
                      value={workflow.assigned_to}
                      onChange={(event) =>
                        setWorkflow((current) =>
                          current
                            ? { ...current, assigned_to: event.target.value }
                            : current,
                        )
                      }
                      placeholder="Enter internal owner"
                      className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                      Follow-up date
                    </label>
                    <input
                      type="date"
                      value={workflow.follow_up_date}
                      onChange={(event) =>
                        setWorkflow((current) =>
                          current
                            ? { ...current, follow_up_date: event.target.value }
                            : current,
                        )
                      }
                      className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                      Admin notes
                    </label>
                    <textarea
                      value={workflow.admin_notes}
                      onChange={(event) =>
                        setWorkflow((current) =>
                          current
                            ? { ...current, admin_notes: event.target.value }
                            : current,
                        )
                      }
                      rows={6}
                      placeholder="Enter internal notes"
                      className="w-full rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm text-fh-graphite outline-none transition focus:border-fh-copper focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveWorkflow}
                  disabled={isSaving}
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isSaving
                      ? "cursor-not-allowed bg-fh-stone/35 text-fh-white/85"
                      : "bg-fh-graphite text-fh-white hover:opacity-95"
                  }`}
                >
                  <Save size={16} />
                  {isSaving ? "Saving..." : "Save workflow"}
                </button>

                {saveMessage ? (
                  <p className="mt-4 text-sm text-green-700">{saveMessage}</p>
                ) : null}

                {saveError ? (
                  <p className="mt-4 text-sm text-red-600">{saveError}</p>
                ) : null}
              </div>

              <div className="rounded-[32px] border border-fh-linen bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                  Current workflow snapshot
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Internal reference
                </h3>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Status
                    </p>
                    <p className="mt-2 text-sm leading-7 text-fh-stone">
                      {formatStatusLabel(request.status)}
                    </p>
                  </div>

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
                    <p className="mt-2 text-sm leading-7 text-fh-stone">
                      {formatDateOnly(
                        request.follow_up_date,
                        "No follow-up date set.",
                      )}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Admin notes
                    </p>
                    <p className="mt-2 text-sm leading-7 text-fh-stone">
                      {request.admin_notes?.trim() || "No admin notes yet."}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </section>

      <AdminFooter />
    </main>
  );
}