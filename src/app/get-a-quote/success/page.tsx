import Link from "next/link";
import {
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

function formatSubmittedDate(value: string | undefined) {
  if (!value) {
    return "Saved just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Saved just now";
  }

  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }

  return `${month}/${day}/${year} ${hours}:${minutes} ${suffix} UTC`;
}

function getProjectIcon(projectType: string) {
  const normalized = projectType.toLowerCase();

  if (normalized.includes("battery") || normalized.includes("backup")) {
    return BatteryCharging;
  }

  return Zap;
}

export default async function GetAQuoteSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
    submittedAt?: string;
    projectType?: string;
  }>;
}) {
  const params = await searchParams;
  const requestId = params.id ?? "";
  const submittedAt = params.submittedAt;
  const projectType = params.projectType ?? "Home electrification project";
  const ProjectIcon = getProjectIcon(projectType);

  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 lg:px-8 lg:pb-20 lg:pt-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Quote request received
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Thanks — your quote request has been submitted
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            FuseHarbor now has your homeowner project details on file for review.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <CheckCircle2 size={16} className="text-fh-copper" />
              Saved successfully
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <Clock3 size={16} className="text-fh-copper" />
              Submitted {formatSubmittedDate(submittedAt)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                <CheckCircle2 size={28} />
              </div>

              <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                What happens next
              </h2>

              <div className="mt-8 grid gap-4">
                <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-fh-copper" />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Your request enters the homeowner review flow
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        Your project type, location, and homeowner details are
                        now organized inside the FuseHarbor workflow.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="mt-0.5 shrink-0 text-fh-copper" />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Follow-up can use your submitted contact details
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        Your homeowner contact information is now saved for
                        future project follow-up.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <ProjectIcon size={18} className="mt-0.5 shrink-0 text-fh-copper" />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Your selected project type has been captured
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        Submitted project: {projectType}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Sparkles size={18} className="mt-0.5 shrink-0 text-fh-copper" />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Premium homeowner intake continues
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        Your request is now inside the launch-ready homeowner
                        flow designed to feel clearer and more thoughtful than a
                        generic contractor form.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Submission receipt
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
                Your quote request reference has been created
              </h2>

              <div className="mt-6 rounded-[24px] border border-fh-linen bg-white/80 p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                  Request reference
                </p>
                <p className="mt-3 break-all font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                  {requestId || "Reference pending"}
                </p>
              </div>

              <div className="mt-6 rounded-[24px] border border-fh-linen bg-white/80 p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                  Project type
                </p>
                <p className="mt-3 text-sm leading-6 text-fh-stone">
                  {projectType}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/get-a-quote"
                  className="inline-flex items-center justify-center rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
                >
                  Submit Another Quote
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
                >
                  Back Home
                </Link>
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Confirmation status
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                Quote request saved
              </h3>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                Quote requests are free. Payment will only belong in the later
                homeowner-to-pro project workflow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}