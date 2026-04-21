import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripeServer } from "@/lib/stripe";

type PaymentJobUpdateRow = {
  id: string;
  payment_status: string;
};

function getSupabaseServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase server environment variables. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeServer();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing STRIPE_WEBHOOK_SECRET environment variable.",
        },
        { status: 500 },
      );
    }

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing Stripe signature header.",
        },
        { status: 400 },
      );
    }

    const rawBody = await request.text();

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const paymentJobId =
        typeof session.metadata?.paymentJobId === "string"
          ? session.metadata.paymentJobId
          : "";

      if (!paymentJobId) {
        return NextResponse.json(
          {
            ok: false,
            error: "Missing payment job metadata on completed checkout session.",
          },
          { status: 400 },
        );
      }

      const supabase = getSupabaseServiceClient();

      const updatePayload = {
        payment_status: "paid",
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        paid_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("payment_jobs")
        .update(updatePayload)
        .eq("id", paymentJobId)
        .select("id,payment_status")
        .maybeSingle();

      if (error) {
        throw error;
      }

      const updatedRow = data as PaymentJobUpdateRow | null;

      if (!updatedRow) {
        return NextResponse.json(
          {
            ok: false,
            error: "Payment job was not found for webhook update.",
          },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe webhook failed.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 },
    );
  }
}