"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type PublicPaymentJobRow = {
  id: string;
  public_access_token: string;
  scope_summary: string | null;
  total_price_cents: number;
  payment_status: string;
  created_at: string;
};

type CheckoutResponse = {
  ok: boolean;
  url?: string;
  id?: string;
  error?: string;
};

function formatCurrencyFromCents(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value / 100);
}

function formatStatusLabel(status: string) {
  if (!status) {
    return "unknown";
  }

  return status.replaceAll("_", " ");
}

function statusBadgeClassName(status: string) {
  switch (status) {
    case "draft":
      return "bg-fh-sand text-fh-copper";
    case "awaiting_homeowner_approval":
      return "bg-amber-100 text-amber-700";
    case "awaiting_payment":
      return "bg-fh-sand text-fh-copper";
    case "paid":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "payout_pending":
      return "bg-blue-100 text-blue-700";
    case "payout_sent":
      return "bg-fh-graphite text-fh-white";
    default:
      return "border border-fh-linen bg-fh-warm-white text-fh-moss";
  }
}

function getPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables for public payment page.",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export default function PublicPaymentPage() {
  const params = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;

  const [paymentJob, setPaymentJob] = useState<PublicPaymentJobRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentJob() {
      if (!token) {
        if (isMounted) {
          setNotFoundState(true);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        setCheckoutError("");
        setNotFoundState(false);

        const supabase = getPublicSupabaseClient();

        const { data, error } = await supabase.rpc("get_public_payment_job", {
          payment_token: token,
        });

        if (error) {
          throw error;
        }

        const rows = (data as PublicPaymentJobRow[] | null) ?? [];

        if (!rows.length) {
          if (isMounted) {
            setPaymentJob(null);
            setNotFoundState(true);
          }
          return;
        }

        if (isMounted) {
          setPaymentJob(rows[0]);
          setNotFoundState(false);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the payment page.";

        if (isMounted) {
          setErrorMessage(message);
          setPaymentJob(null);
          setNotFoundState(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPaymentJob();

    return () => {
      isMounted = false;
    };
  }, [token, searchParams]);

  async function handleStartCheckout() {
    if (!token) {
      setCheckoutError("Missing payment token.");
      return;
    }

    try {
      setIsStartingCheckout(true);
      setCheckoutError("");

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as CheckoutResponse;

      if (!response.ok || !result.ok || !result.url) {
        throw new Error(
          result.error || "Something went wrong while starting checkout.",
        );
      }

      window.location.href = result.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while starting checkout.";

      setCheckoutError(message);
    } finally {
      setIsStartingCheckout(false);
    }
  }

  const checkoutState = searchParams.get("checkout");
  const sessionId = searchParams.get("session_id");

  const successMessage = useMemo(() => {
    if (checkoutState !== "success") {
      return "";
    }

    return sessionId
      ? "Payment completed successfully. Your Stripe session was recorded."
      : "Payment completed successfully.";
  }, [checkoutState, sessionId]);

  const cancelMessage = useMemo(() => {
    if (checkoutState !== "cancelled") {
      return "";
    }

    return "Checkout was cancelled. You can return and complete payment when ready.";
  }, [checkoutState]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
            <p className="text-base text-fh-stone">Loading payment page...</p>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="rounded-[36px] border border-red-200 bg-fh-white p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold tracking-[0.2em] text-red-600 uppercase">
              Payment page error
            </p>
            <p className="mt-4 text-base leading-8 text-red-600">
              {errorMessage}
            </p>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  if (notFoundState || !paymentJob) {
    return (
      <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
              Payment page
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-4xl font-semibold">
              Payment record not found
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-fh-stone">
              This payment link is missing or no longer available.
            </p>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-fh-linen bg-fh-warm-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                Contact FuseHarbor
              </Link>
            </div>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  const normalizedPaymentStatus = (paymentJob.payment_status || "")
    .trim()
    .toLowerCase();

  const canPayNow =
    normalizedPaymentStatus === "draft" ||
    normalizedPaymentStatus === "awaiting_payment";

  const isPaid = normalizedPaymentStatus === "paid";

  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 lg:px-8 lg:pb-20 lg:pt-14">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            FuseHarbor payment
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Review your approved project and payment amount
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            This page is for the later homeowner payment step after quote review,
            matching, and scope definition.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${statusBadgeClassName(
                normalizedPaymentStatus,
              )}`}
            >
              <CheckCircle2 size={16} />
              {formatStatusLabel(normalizedPaymentStatus)}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <ShieldCheck size={16} className="text-fh-copper" />
              Secure homeowner payment flow
            </div>
          </div>

          {successMessage ? (
            <div className="mt-6 rounded-[24px] border border-green-200 bg-green-50 px-5 py-4">
              <p className="text-sm font-semibold text-green-700">
                {successMessage}
              </p>
            </div>
          ) : null}

          {cancelMessage ? (
            <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-700">
                {cancelMessage}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Approved scope
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                Project summary
              </h2>
              <p className="mt-4 text-base leading-8 text-fh-stone">
                {paymentJob.scope_summary?.trim() ||
                  "No project scope summary has been added yet."}
              </p>
            </div>

            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Payment note
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                Quote request stayed free
              </h2>
              <p className="mt-4 text-base leading-8 text-fh-stone">
                FuseHarbor only opens payment after the project has moved beyond
                the free quote stage and an approved payable job has been created.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fh-white text-fh-copper">
                {isPaid ? <BadgeCheck size={28} /> : <CreditCard size={28} />}
              </div>

              <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Payment amount
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-4xl font-semibold text-fh-graphite">
                {formatCurrencyFromCents(paymentJob.total_price_cents)}
              </h2>

              <div className="mt-6 rounded-[24px] border border-fh-linen bg-white/80 p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                  Payment status
                </p>
                <p className="mt-2 text-sm leading-7 text-fh-stone">
                  {formatStatusLabel(normalizedPaymentStatus)}
                </p>
              </div>

              <div className="mt-6 rounded-[24px] border border-fh-linen bg-white/80 p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                  Next step
                </p>
                <p className="mt-2 text-sm leading-7 text-fh-stone">
                  {isPaid
                    ? "Payment has been received successfully. No further payment action is needed."
                    : canPayNow
                      ? "This job is ready for secure checkout."
                      : "This job is not currently open for payment."}
                </p>
              </div>

              {isPaid ? (
                <div className="mt-6 rounded-[24px] border border-green-200 bg-green-50 p-5">
                  <p className="text-sm font-semibold text-green-700">
                    Payment received
                  </p>
                  <p className="mt-2 text-sm leading-7 text-green-700">
                    FuseHarbor has recorded this payment successfully.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleStartCheckout}
                    disabled={!canPayNow || isStartingCheckout}
                    className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition ${
                      canPayNow && !isStartingCheckout
                        ? "bg-fh-graphite text-fh-white hover:opacity-95"
                        : "cursor-not-allowed bg-fh-stone/35 text-fh-white/85"
                    }`}
                  >
                    {isStartingCheckout
                      ? "Starting secure checkout..."
                      : "Continue to secure payment"}
                  </button>

                  {checkoutError ? (
                    <p className="mt-4 text-sm leading-6 text-red-600">
                      {checkoutError}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Need help?
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                Questions before payment
              </h3>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                If something looks off, reach out before paying so the project
                record can be reviewed.
              </p>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-fh-linen bg-fh-warm-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
                >
                  Contact FuseHarbor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}