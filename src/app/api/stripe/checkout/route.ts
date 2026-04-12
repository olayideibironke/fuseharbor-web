import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeServer } from "@/lib/stripe";

type CheckoutRequestBody = {
  id?: string;
  submittedAt?: string;
  projectType?: string;
};

function getBaseUrl(host: string, protocolHeader: string | null) {
  const protocol =
    protocolHeader?.split(",")[0]?.trim() ||
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeServer();

    const priceId = process.env.STRIPE_TEST_PRICE_ID?.trim();

    if (!priceId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing STRIPE_TEST_PRICE_ID environment variable.",
        },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody;

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

    const successParams = new URLSearchParams();

    if (body.id?.trim()) {
      successParams.set("id", body.id.trim());
    }

    if (body.submittedAt?.trim()) {
      successParams.set("submittedAt", body.submittedAt.trim());
    }

    if (body.projectType?.trim()) {
      successParams.set("projectType", body.projectType.trim());
    }

    successParams.set("checkout", "success");
    successParams.set("session_id", "{CHECKOUT_SESSION_ID}");

    const cancelParams = new URLSearchParams();

    if (body.id?.trim()) {
      cancelParams.set("id", body.id.trim());
    }

    if (body.submittedAt?.trim()) {
      cancelParams.set("submittedAt", body.submittedAt.trim());
    }

    if (body.projectType?.trim()) {
      cancelParams.set("projectType", body.projectType.trim());
    }

    cancelParams.set("checkout", "cancelled");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/get-a-quote/success?${successParams.toString()}`,
      cancel_url: `${baseUrl}/get-a-quote/success?${cancelParams.toString()}`,
      metadata: {
        source: "fuseharbor-web",
        flow: "quote-checkout-test",
        requestId: body.id?.trim() || "",
        projectType: body.projectType?.trim() || "",
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