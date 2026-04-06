import { createClient } from "@supabase/supabase-js";
import { isAllowedSameOriginRequest } from "@/lib/request-origin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const MIN_SUBMIT_TIME_MS = 1500;

type ProInterestPayload = {
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  tradeCategory?: string;
  serviceArea?: string;
  notes?: string;
  honeypot?: string;
  startedAt?: number;
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function normalizePayload(payload: ProInterestPayload) {
  return {
    companyName: payload.companyName?.trim() ?? "",
    contactName: payload.contactName?.trim() ?? "",
    email: payload.email?.trim() ?? "",
    phone: payload.phone?.replace(/\D/g, "").slice(0, 10) ?? "",
    tradeCategory: payload.tradeCategory?.trim() ?? "",
    serviceArea: payload.serviceArea?.trim() ?? "",
    notes: payload.notes?.trim() ?? "",
    honeypot: payload.honeypot?.trim() ?? "",
    startedAt:
      typeof payload.startedAt === "number" ? payload.startedAt : Number.NaN,
  };
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!isAllowedSameOriginRequest(request)) {
    return jsonResponse(
      {
        error: "Request origin is not allowed.",
      },
      403,
    );
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse(
      {
        error:
          "Supabase environment variables are missing. Check your .env.local file and restart the dev server.",
      },
      500,
    );
  }

  let payload: ProInterestPayload;

  try {
    payload = (await request.json()) as ProInterestPayload;
  } catch {
    return jsonResponse({ error: "Invalid request payload." }, 400);
  }

  const normalized = normalizePayload(payload);

  if (normalized.honeypot.length > 0) {
    return jsonResponse(
      { error: "Please review your details and try again." },
      400,
    );
  }

  if (
    !Number.isFinite(normalized.startedAt) ||
    Date.now() - normalized.startedAt < MIN_SUBMIT_TIME_MS
  ) {
    return jsonResponse(
      {
        error: "Please take a moment to review your details, then submit again.",
      },
      400,
    );
  }

  if (
    normalized.companyName.length === 0 ||
    normalized.contactName.length === 0 ||
    normalized.email.length === 0 ||
    normalized.phone.length === 0 ||
    normalized.tradeCategory.length === 0 ||
    normalized.serviceArea.length === 0
  ) {
    return jsonResponse(
      { error: "Please complete all required fields before submitting." },
      400,
    );
  }

  if (!isValidEmail(normalized.email)) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  if (!/^\d{10}$/.test(normalized.phone)) {
    return jsonResponse(
      { error: "Enter a valid 10-digit phone number." },
      400,
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("pro_interest_requests")
      .insert({
        company_name: normalized.companyName,
        contact_name: normalized.contactName,
        email: normalized.email,
        phone: normalized.phone,
        trade_category: normalized.tradeCategory,
        service_area: normalized.serviceArea,
        notes: normalized.notes || null,
      })
      .select("id, created_at")
      .single();

    if (error) {
      throw error;
    }

    return jsonResponse(
      {
        id: data.id,
        createdAt: data.created_at,
      },
      200,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while saving your pro interest request.";

    return jsonResponse({ error: message }, 500);
  }
}