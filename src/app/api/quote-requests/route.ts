import { createClient } from "@supabase/supabase-js";
import { isAllowedSameOriginRequest } from "@/lib/request-origin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const notificationEmail = "fuseharbor@gmail.com";
const fromEmail = "FuseHarbor <support@fuseharbor.org>";
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

type NormalizedQuoteRequest = ReturnType<typeof normalizePayload>;

type SavedQuoteRequest = {
  id: string;
  created_at: string;
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
    email: payload.email?.trim().toLowerCase() ?? "",
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPhone(phone: string) {
  if (!/^\d{10}$/.test(phone)) {
    return phone;
  }

  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

function buildPlainTextQuoteSummary(
  quote: NormalizedQuoteRequest,
  savedQuote: SavedQuoteRequest,
) {
  return [
    "New FuseHarbor quote request",
    "",
    `Request ID: ${savedQuote.id}`,
    `Submitted: ${savedQuote.created_at}`,
    "",
    `Name: ${quote.fullName}`,
    `Email: ${quote.email}`,
    `Phone: ${formatPhone(quote.phone)}`,
    `Address: ${quote.address}`,
    `City: ${quote.city}`,
    `ZIP: ${quote.zipCode}`,
    `Property type: ${quote.propertyType || "Not provided"}`,
    "",
    `Project type: ${quote.projectType}`,
    `Project goal: ${quote.projectGoal}`,
    "",
    `Notes: ${quote.notes || "No notes provided"}`,
  ].join("\n");
}

function buildHtmlQuoteSummary(
  quote: NormalizedQuoteRequest,
  savedQuote: SavedQuoteRequest,
) {
  const rows = [
    ["Request ID", savedQuote.id],
    ["Submitted", savedQuote.created_at],
    ["Name", quote.fullName],
    ["Email", quote.email],
    ["Phone", formatPhone(quote.phone)],
    ["Address", quote.address],
    ["City", quote.city],
    ["ZIP", quote.zipCode],
    ["Property type", quote.propertyType || "Not provided"],
    ["Project type", quote.projectType],
    ["Project goal", quote.projectGoal],
    ["Notes", quote.notes || "No notes provided"],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">New FuseHarbor quote request</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; font-weight: 700; background: #f9fafb; width: 180px;">${escapeHtml(label)}</td>
                  <td style="border: 1px solid #e5e7eb; padding: 10px;">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function buildCustomerConfirmationText(
  quote: NormalizedQuoteRequest,
  savedQuote: SavedQuoteRequest,
) {
  return [
    `Hi ${quote.fullName},`,
    "",
    "Thank you for submitting your FuseHarbor quote request. We received your project details and will review them for possible next steps.",
    "",
    `Request ID: ${savedQuote.id}`,
    `Project type: ${quote.projectType}`,
    `Project goal: ${quote.projectGoal}`,
    "",
    "FuseHarbor is not an emergency service. Project requests may require follow-up review before any service, pricing, scheduling, or next step is confirmed.",
    "",
    "Thank you,",
    "FuseHarbor",
  ].join("\n");
}

function buildCustomerConfirmationHtml(
  quote: NormalizedQuoteRequest,
  savedQuote: SavedQuoteRequest,
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 640px;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">We received your FuseHarbor request</h1>
      <p>Hi ${escapeHtml(quote.fullName)},</p>
      <p>Thank you for submitting your FuseHarbor quote request. We received your project details and will review them for possible next steps.</p>
      <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #f9fafb; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Request ID:</strong> ${escapeHtml(savedQuote.id)}</p>
        <p style="margin: 0 0 8px;"><strong>Project type:</strong> ${escapeHtml(quote.projectType)}</p>
        <p style="margin: 0;"><strong>Project goal:</strong> ${escapeHtml(quote.projectGoal)}</p>
      </div>
      <p>FuseHarbor is not an emergency service. Project requests may require follow-up review before any service, pricing, scheduling, or next step is confirmed.</p>
      <p>Thank you,<br />FuseHarbor</p>
    </div>
  `;
}

async function sendResendEmail(input: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is missing. Skipping FuseHarbor email delivery.");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      reply_to: input.replyTo,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend email delivery failed: ${errorBody}`);
  }

  return true;
}

async function sendQuoteRequestEmails(
  quote: NormalizedQuoteRequest,
  savedQuote: SavedQuoteRequest,
) {
  const plainTextSummary = buildPlainTextQuoteSummary(quote, savedQuote);
  const htmlSummary = buildHtmlQuoteSummary(quote, savedQuote);

  await sendResendEmail({
    to: notificationEmail,
    subject: `New FuseHarbor quote request from ${quote.fullName}`,
    text: plainTextSummary,
    html: htmlSummary,
    replyTo: quote.email,
  });

  await sendResendEmail({
    to: quote.email,
    subject: "We received your FuseHarbor quote request",
    text: buildCustomerConfirmationText(quote, savedQuote),
    html: buildCustomerConfirmationHtml(quote, savedQuote),
  });
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

    try {
      await sendQuoteRequestEmails(normalized, data);
    } catch (emailError) {
      console.error("FuseHarbor quote request email failed", emailError);
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
