import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getStripeServer } from "@/lib/stripe";

type CheckoutRequestBody = {
  token?: string;
};

type PublicPaymentJobRow = {
  id: string;
  public_access_token: string;
  scope_summary: string | null;
  total_price_cents: number;
  payment_status: string;
  created_at: string;
};

function getBaseUrl(host: string, protocolHeader: string | null) {
  const protocol =
    protocolHeader?.split(",")[0]?.trim() ||
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

function getPublicSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeServer();

    const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody;
    const paymentToken = body.token?.trim();

    if (!paymentToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing payment token.",
        },
        { status: 400 },
      );
    }

    const headerStore = await headers();
    const host = headerStore.get("host");

    if (!host) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing host header.",
        },
        { status: 400 },
      );
    }

    const forwardedProto = headerStore.get("x-forwarded-proto");
    const baseUrl = getBaseUrl(host, forwardedProto);

    const supabase = getPublicSupabaseServer();

    const { data, error } = await supabase.rpc("get_public_payment_job", {
      payment_token: paymentToken,
    });

    if (error) {
      throw error;
    }

    const rows = (data as PublicPaymentJobRow[] | null) ?? [];
    const paymentJob = rows[0] ?? null;

    if (!paymentJob) {
      return NextResponse.json(
        {
          ok: false,
          error: "Payment job not found.",
        },
        { status: 404 },
      );
    }

    if (paymentJob.payment_status !== "awaiting_payment") {
      return NextResponse.json(
        {
          ok: false,
          error: "This payment job is not ready for checkout.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(paymentJob.total_price_cents) ||
      paymentJob.total_price_cents <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "This payment job does not have a valid payable amount.",
        },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "FuseHarbor Project Payment",
              description:
                paymentJob.scope_summary?.trim() ||
                "Approved FuseHarbor homeowner project payment",
            },
            unit_amount: paymentJob.total_price_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pay/${paymentToken}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pay/${paymentToken}?checkout=cancelled`,
      metadata: {
        source: "fuseharbor-web",
        flow: "payment-job-checkout",
        paymentJobId: paymentJob.id,
        paymentToken,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe did not return a checkout URL.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        url: session.url,
        id: session.id,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while creating the Stripe checkout session.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}