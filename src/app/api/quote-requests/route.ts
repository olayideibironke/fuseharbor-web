import { createClient } from "@supabase/supabase-js";
import { isAllowedSameOriginRequest } from "@/lib/request-origin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const MIN_SUBMIT_TIME_MS = 1500;

type QuoteRequestPayload = {
  projectType?: string;
  projectGoal?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  propertyType?: string;
  notes?: string;
  honeypot?: string;
  startedAt?: number;
};

type ZipLookupResponse = {
  "post code": string;
  country: string;
  "country abbreviation": string;
  places: Array<{
    "place name": string;
    longitude: string;
    state: string;
    "state abbreviation": string;
    latitude: string;
  }>;
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function normalizePayload(payload: QuoteRequestPayload) {
  return {
    projectType: payload.projectType?.trim() ?? "",
    projectGoal: payload.projectGoal?.trim() ?? "",
    fullName: payload.fullName?.trim() ?? "",
    email: payload.email?.trim() ?? "",
    phone: payload.phone?.replace(/\D/g, "").slice(0, 10) ?? "",
    address: payload.address?.trim() ?? "",
    city: payload.city?.trim() ?? "",
    zipCode: payload.zipCode?.trim() ?? "",
    propertyType: payload.propertyType?.trim() ?? "",
    notes: payload.notes?.trim() ?? "",
    honeypot: payload.honeypot?.trim() ?? "",
    startedAt:
      typeof payload.startedAt === "number" ? payload.startedAt : Number.NaN,
  };
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function validateUsZip(zipCode: string) {
  const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        isValid: false,
        message: "Enter a valid 5-digit U.S. ZIP code.",
      };
    }

    throw new Error("ZIP validation service is unavailable right now.");
  }

  const data = (await response.json()) as ZipLookupResponse;

  if (!data.places || data.places.length === 0) {
    return {
      isValid: false,
      message: "Enter a valid 5-digit U.S. ZIP code.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
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

  let payload: QuoteRequestPayload;

  try {
    payload = (await request.json()) as QuoteRequestPayload;
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
    normalized.projectType.length === 0 ||
    normalized.projectGoal.length === 0 ||
    normalized.fullName.length === 0 ||
    normalized.email.length === 0 ||
    normalized.phone.length === 0 ||
    normalized.address.length === 0 ||
    normalized.city.length === 0 ||
    normalized.zipCode.length === 0
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
      { error: "Enter a valid 10-digit U.S. phone number." },
      400,
    );
  }

  if (!/^\d{5}$/.test(normalized.zipCode)) {
    return jsonResponse(
      { error: "Enter a valid 5-digit U.S. ZIP code." },
      400,
    );
  }

  try {
    const zipValidation = await validateUsZip(normalized.zipCode);

    if (!zipValidation.isValid) {
      return jsonResponse({ error: zipValidation.message }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        project_type: normalized.projectType,
        project_goal: normalized.projectGoal,
        full_name: normalized.fullName,
        email: normalized.email,
        phone: normalized.phone,
        address: normalized.address,
        city: normalized.city,
        zip_code: normalized.zipCode,
        property_type: normalized.propertyType,
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
        : "Something went wrong while saving your quote request.";

    return jsonResponse({ error: message }, 500);
  }
}