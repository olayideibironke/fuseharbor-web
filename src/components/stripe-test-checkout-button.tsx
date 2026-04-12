"use client";

import { useState } from "react";

type CheckoutResponse = {
  ok: boolean;
  url?: string;
  id?: string;
  error?: string;
};

type StripeTestCheckoutButtonProps = {
  requestId?: string;
  submittedAt?: string;
  projectType?: string;
  className?: string;
  label?: string;
};

export function StripeTestCheckoutButton({
  requestId = "",
  submittedAt = "",
  projectType = "",
  className,
  label = "Continue to Test Payment",
}: StripeTestCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCheckout() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: requestId,
          submittedAt,
          projectType,
        }),
      });

      const result = (await response.json()) as CheckoutResponse;

      if (!response.ok || !result.ok || !result.url) {
        throw new Error(
          result.error ||
            "Something went wrong while starting Stripe checkout.",
        );
      }

      window.location.href = result.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while starting Stripe checkout.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className={
          className ||
          `inline-flex items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition ${
            isLoading
              ? "cursor-not-allowed bg-fh-stone/35 text-fh-white/85"
              : "bg-fh-graphite text-fh-white hover:opacity-95"
          }`
        }
      >
        {isLoading ? "Redirecting..." : label}
      </button>

      {errorMessage ? (
        <p className="mt-3 text-xs leading-6 text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}