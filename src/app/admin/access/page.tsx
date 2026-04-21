"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { AdminFooter } from "@/components/admin-footer";
import { AdminHeader } from "@/components/admin-header";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminAccessPage() {
  const hasBootedRef = useRef(false);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const trimmedEmail = email.trim();
  const emailLooksValid =
    trimmedEmail.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  useEffect(() => {
    if (hasBootedRef.current) {
      return;
    }

    hasBootedRef.current = true;

    let isMounted = true;

    async function boot() {
      try {
        const supabase = getSupabaseBrowserClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        if (session) {
          setSuccessMessage("Admin session found. Opening workspace...");
          window.location.replace("/admin");
          return;
        }

        setIsCheckingSession(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while preparing admin access.";

        setErrorMessage(message);
        setSuccessMessage("");
        setIsCheckingSession(false);
      }
    }

    boot();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleMagicLink() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!emailLooksValid) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const supabase = getSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/access/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "Magic link sent. Check your email and open the newest link once.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the magic link.";

      setErrorMessage(message);
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#f7f5f0,_#ece7de)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(35,38,43,0.08),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.10),_transparent_24%)]" />

        <AdminHeader />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-fh-stone transition hover:text-fh-graphite"
          >
            <ChevronLeft size={16} />
            Back to public site
          </Link>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-fh-graphite uppercase shadow-sm">
            <LockKeyhole size={14} className="text-fh-copper" />
            Internal admin access
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Admin Access
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Enter the FuseHarbor admin workspace
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            This page is for authorized internal access only. Use your approved
            email to receive a secure magic link for the admin system.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Access rules
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                Internal use only
              </h2>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-fh-copper"
                    />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Approved email required
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        Your signed-in email must exist in the admin_users table
                        with active access enabled.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-fh-copper"
                    />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Magic link sign-in
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        A secure email link is used instead of a public password
                        form for cleaner internal access.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <LockKeyhole
                      size={18}
                      className="mt-0.5 shrink-0 text-fh-copper"
                    />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Admin-only workflow
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        This leads into homeowner quote operations, pro intake
                        review, and the internal FuseHarbor dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
              Secure sign-in
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
              Request your admin magic link
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fh-stone">
              Enter the email address approved for FuseHarbor admin access.
            </p>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                Admin email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                placeholder="Enter your admin email"
                className={`w-full rounded-[20px] border px-4 py-4 text-sm text-fh-graphite outline-none transition placeholder:text-fh-stone/80 ${
                  errorMessage
                    ? "border-red-500 bg-white"
                    : "border-fh-linen bg-fh-warm-white focus:border-fh-copper focus:bg-white"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={!emailLooksValid || isSubmitting || isCheckingSession}
              className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition ${
                emailLooksValid && !isSubmitting && !isCheckingSession
                  ? "bg-fh-graphite text-fh-white hover:opacity-95"
                  : "cursor-not-allowed bg-fh-stone/35 text-fh-white/85"
              }`}
            >
              {isCheckingSession
                ? "Checking access..."
                : isSubmitting
                  ? "Sending link..."
                  : "Send Magic Link"}
              {!isSubmitting && !isCheckingSession ? (
                <ArrowRight size={16} />
              ) : null}
            </button>

            {errorMessage ? (
              <p className="mt-4 text-sm leading-6 text-red-600">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <div className="mt-4 rounded-[20px] border border-green-200 bg-green-50 px-4 py-4">
                <p className="text-sm leading-6 text-green-700">
                  {successMessage}
                </p>
              </div>
            ) : null}

            <div className="mt-8 rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                Redirect target
              </p>
              <p className="mt-2 text-sm leading-6 text-fh-stone">
                After sign-in, approved users are sent into the FuseHarbor admin
                workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdminFooter />
    </main>
  );
}