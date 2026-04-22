import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import PublicPaymentPageClient from "./PublicPaymentPageClient";

type SearchParamValue = string | string[] | undefined;

type PublicPaymentJobRow = {
  id: string;
  public_access_token: string;
  scope_summary: string | null;
  total_price_cents: number;
  payment_status: string;
  created_at: string;
  paid_at?: string | null;
};

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

function getFirstString(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function PublicPaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{
    checkout?: SearchParamValue;
    session_id?: SearchParamValue;
  }>;
}) {
  const { token } = await params;
  const resolvedSearchParams = await searchParams;

  const checkout = getFirstString(resolvedSearchParams.checkout).trim().toLowerCase();
  const sessionId = getFirstString(resolvedSearchParams.session_id).trim();

  const supabase = getPublicSupabaseServer();

  const { data, error } = await supabase.rpc("get_public_payment_job", {
    payment_token: token,
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data as PublicPaymentJobRow[] | null) ?? [];
  const paymentJob = rows[0] ?? null;

  if (!paymentJob) {
    notFound();
  }

  return (
    <PublicPaymentPageClient
      token={token}
      checkout={checkout}
      sessionId={sessionId}
      paymentJob={paymentJob}
    />
  );
}