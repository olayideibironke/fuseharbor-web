"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PublicPaymentJobRow = {
  id: string;
  public_access_token: string;
  scope_summary: string | null;
  total_price_cents: number;
  payment_status: string;
  created_at: string;
  paid_at?: string | null;
};

function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((cents || 0) / 100);
}

function normalizePaymentStatus(status: string | null | undefined) {
  return (status ?? "").trim().toLowerCase();
}

export default function PublicPaymentPageClient({
  token,
  checkout,
  sessionId,
  paymentJob,
}: {
  token: string;
  checkout: string;
  sessionId: string;
  paymentJob: PublicPaymentJobRow;
}) {
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const normalizedStatus = normalizePaymentStatus(paymentJob.payment_status);
  const isSuccessfulReturn = checkout === "success";
  const isPaid = normalizedStatus === "paid" || isSuccessfulReturn;
  const isCancelled = checkout === "cancelled" && !isPaid;

  const isCheckoutReady =
    normalizedStatus === "draft" || normalizedStatus === "awaiting_payment";

  const formattedAmount = useMemo(
    () => formatUsdFromCents(paymentJob.total_price_cents),
    [paymentJob.total_price_cents],
  );

  async function handleCheckout() {
    try {
      setIsStartingCheckout(true);
      setCheckoutError(null);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            url?: string;
            error?: string;
          }
        | null;

      if (!response.ok || !result?.ok || !result.url) {
        throw new Error(
          result?.error || "Unable to start secure checkout at this time.",
        );
      }

      window.location.href = result.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start secure checkout at this time.";

      setCheckoutError(message);
      setIsStartingCheckout(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f2eb] text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm leading-7 text-stone-600">
              This page is for the later homeowner payment step after quote review,
              matching, and scope definition.
            </p>
          </div>

          {isPaid ? (
            <section className="mb-10 rounded-[30px] border border-stone-300 bg-white px-8 py-8 shadow-sm md:px-10 md:py-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                    Payment confirmation
                  </p>

                  <h1 className="mt-4 text-4xl font-black tracking-tight text-black md:text-5xl">
                    Payment completed successfully
                  </h1>

                  <p className="mt-4 text-lg leading-8 text-stone-700">
                    Thank you. Your payment has been received successfully.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-800">
                      Amount paid: {formattedAmount}
                    </div>

                    <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-800">
                      Status: Paid
                    </div>

                    {sessionId ? (
                      <div className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-800">
                        Confirmation saved
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          {isCancelled ? (
            <section className="mb-8 rounded-[24px] border border-stone-300 bg-white px-6 py-5 shadow-sm">
              <p className="text-lg font-semibold text-stone-900">
                Payment was not completed
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                No charge was made. You can continue whenever you are ready.
              </p>
            </section>
          ) : null}

          <div
            className={
              isPaid
                ? "grid grid-cols-1 gap-8"
                : "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
            }
          >
            <div className="space-y-8">
              <section className="rounded-[28px] border border-[#ded5c7] bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7e8754]">
                  Approved scope
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                  Project summary
                </h2>

                <p className="mt-6 text-lg leading-8 text-stone-600">
                  {paymentJob.scope_summary?.trim() ||
                    "No project scope summary has been added yet."}
                </p>
              </section>

              <section className="rounded-[28px] border border-[#ded5c7] bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7e8754]">
                  Payment note
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                  Quote request stayed free
                </h2>

                <p className="mt-6 text-lg leading-8 text-stone-600">
                  FuseHarbor only opens payment after the project has moved
                  beyond the free quote stage and an approved payable job has
                  been created.
                </p>
              </section>
            </div>

            {!isPaid ? (
              <div className="space-y-8">
                <section className="rounded-[32px] border border-[#ded5c7] bg-[#efe5d6] p-8 shadow-sm">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-[#cf7c1f] shadow-sm">
                    ▭
                  </div>

                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#cf7c1f]">
                    Payment amount
                  </p>

                  <div className="mt-4 text-6xl font-semibold tracking-tight text-stone-900">
                    {formattedAmount}
                  </div>

                  <div className="mt-8 rounded-[24px] bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#cf7c1f]">
                      Payment status
                    </p>
                    <p className="mt-4 text-2xl text-stone-700">
                      {normalizedStatus || "draft"}
                    </p>
                  </div>

                  <div className="mt-6 rounded-[24px] bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#cf7c1f]">
                      Next step
                    </p>
                    <p className="mt-4 text-xl leading-8 text-stone-700">
                      {isCheckoutReady
                        ? "This job is ready for secure checkout."
                        : "This job is not currently open for payment."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isStartingCheckout || !isCheckoutReady}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-5 text-xl font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isStartingCheckout
                      ? "Opening secure checkout..."
                      : "Continue to secure payment"}
                  </button>

                  {checkoutError ? (
                    <p className="mt-6 text-lg font-medium text-red-600">
                      {checkoutError}
                    </p>
                  ) : null}
                </section>

                <section className="rounded-[28px] border border-[#ded5c7] bg-white p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7e8754]">
                    Need help?
                  </p>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">
                    Questions before payment
                  </h3>

                  <p className="mt-4 text-lg leading-8 text-stone-600">
                    If something looks off, reach out before paying so the
                    project record can be reviewed.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                  >
                    Contact FuseHarbor
                  </Link>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}