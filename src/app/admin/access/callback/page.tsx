"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { type EmailOtpType, type Session } from "@supabase/supabase-js";
import { AdminFooter } from "@/components/admin-footer";
import { AdminHeader } from "@/components/admin-header";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const ADMIN_REDIRECT_PATH = "/admin";
const SESSION_WAIT_TIMEOUT_MS = 8000;
const SESSION_POLL_INTERVAL_MS = 250;

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return [
    "signup",
    "invite",
    "magiclink",
    "recovery",
    "email_change",
    "email",
    "email_change_new",
    "email_change_current",
  ].includes(value ?? "");
}

function clearAuthUrlArtifacts() {
  window.history.replaceState({}, document.title, window.location.pathname);
}

export default function AdminAccessCallbackPage() {
  const hasBootedRef = useRef(false);

  const [statusMessage, setStatusMessage] = useState(
    "Preparing secure admin sign-in...",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (hasBootedRef.current) {
      return;
    }

    hasBootedRef.current = true;

    let isMounted = true;

    async function waitForStableSession() {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session: immediateSession },
      } = await supabase.auth.getSession();

      if (immediateSession) {
        return immediateSession;
      }

      return await new Promise<Session | null>((resolve) => {
        let settled = false;

        const finish = (session: Session | null) => {
          if (settled) {
            return;
          }

          settled = true;
          window.clearInterval(intervalId);
          window.clearTimeout(timeoutId);
          subscription.unsubscribe();
          resolve(session);
        };

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            finish(session);
          }
        });

        const intervalId = window.setInterval(async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            finish(session);
          }
        }, SESSION_POLL_INTERVAL_MS);

        const timeoutId = window.setTimeout(() => {
          finish(null);
        }, SESSION_WAIT_TIMEOUT_MS);
      });
    }

    async function boot() {
      try {
        const supabase = getSupabaseBrowserClient();
        const currentUrl = new URL(window.location.href);
        const hashParams = new URLSearchParams(
          window.location.hash.replace(/^#/, ""),
        );

        const code = currentUrl.searchParams.get("code");
        const tokenHash = currentUrl.searchParams.get("token_hash");
        const rawType = currentUrl.searchParams.get("type");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        const hasCodeFlow = Boolean(code);
        const hasOtpFlow = Boolean(tokenHash && isEmailOtpType(rawType));
        const hasHashSessionFlow = Boolean(accessToken && refreshToken);

        if (!hasCodeFlow && !hasOtpFlow && !hasHashSessionFlow) {
          throw new Error(
            "No sign-in payload was found in this link. Please return to admin access and use the newest magic link once.",
          );
        }

        setStatusMessage("Completing secure sign-in...");

        if (hasCodeFlow && code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
        } else if (hasOtpFlow && tokenHash && isEmailOtpType(rawType)) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: rawType,
          });

          if (error) {
            throw error;
          }
        } else if (hasHashSessionFlow && accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }
        }

        clearAuthUrlArtifacts();

        setStatusMessage("Confirming admin session...");

        const session = await waitForStableSession();

        if (!isMounted) {
          return;
        }

        if (!session) {
          throw new Error(
            "Sign-in returned successfully, but no admin session became active. Please request a fresh magic link only after we inspect this result.",
          );
        }

        setStatusMessage("Admin session found. Opening workspace...");
        window.location.replace(ADMIN_REDIRECT_PATH);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while completing admin sign-in.";

        setErrorMessage(message);
        setStatusMessage("");
      }
    }

    boot();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#f7f5f0,_#ece7de)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(35,38,43,0.08),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.10),_transparent_24%)]" />

        <AdminHeader />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <Link
            href="/admin/access"
            className="inline-flex items-center gap-2 text-sm font-semibold text-fh-stone transition hover:text-fh-graphite"
          >
            <ChevronLeft size={16} />
            Back to admin access
          </Link>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-fh-graphite uppercase shadow-sm">
            <LockKeyhole size={14} className="text-fh-copper" />
            Completing admin sign-in
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Admin Callback
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Finalizing secure access
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            Please wait while FuseHarbor completes your secure admin sign-in.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="rounded-[32px] border border-fh-linen bg-white p-8 shadow-sm lg:p-10">
          {!errorMessage ? (
            <div className="flex items-start gap-4 rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-5">
              <LoaderCircle
                size={22}
                className="mt-0.5 shrink-0 animate-spin text-fh-copper"
              />
              <div>
                <p className="text-base font-semibold text-fh-graphite">
                  {statusMessage}
                </p>
                <p className="mt-2 text-sm leading-6 text-fh-stone">
                  Do not refresh this page or request another magic link unless
                  this step clearly fails.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-5">
              <p className="text-base font-semibold text-red-700">
                Sign-in could not be completed.
              </p>
              <p className="mt-2 text-sm leading-6 text-red-700">
                {errorMessage}
              </p>

              <div className="mt-5">
                <Link
                  href="/admin/access"
                  className="inline-flex items-center gap-2 rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
                >
                  Return to admin access
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <AdminFooter />
    </main>
  );
}