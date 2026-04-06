import { createClient } from "@supabase/supabase-js";

function hasValue(value: string | undefined) {
  return Boolean(value?.trim());
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks = {
    supabaseUrlConfigured: hasValue(supabaseUrl),
    supabaseAnonKeyConfigured: hasValue(supabaseAnonKey),
    supabaseClientInitialized: false,
    databaseReachable: false,
  };

  if (checks.supabaseUrlConfigured && checks.supabaseAnonKeyConfigured) {
    try {
      const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
      checks.supabaseClientInitialized = true;

      const { error } = await supabase
        .from("quote_requests")
        .select("id")
        .limit(1);

      checks.databaseReachable = !error;
    } catch {
      checks.supabaseClientInitialized = false;
      checks.databaseReachable = false;
    }
  }

  const ready =
    checks.supabaseUrlConfigured &&
    checks.supabaseAnonKeyConfigured &&
    checks.supabaseClientInitialized &&
    checks.databaseReachable;

  return Response.json(
    {
      ok: ready,
      ready,
      app: "FuseHarbor",
      environment: process.env.NODE_ENV ?? "development",
      checks,
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}