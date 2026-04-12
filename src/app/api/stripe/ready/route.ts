import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";

export async function GET() {
  try {
    getStripeServer();

    const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
    const mode = secretKey.startsWith("sk_live_") ? "live" : "test";

    return NextResponse.json(
      {
        ok: true,
        mode,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Stripe is not configured correctly.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}