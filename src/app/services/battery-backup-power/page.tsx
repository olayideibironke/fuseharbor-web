import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const highlights = [
  "Homes planning for resilience and backup support",
  "Homeowners thinking long-term about storage and readiness",
  "Projects pairing batteries with broader electrification goals",
  "People who want cleaner energy confidence at home",
];

const useCases = [
  "Preparing for outages or peak-demand concerns",
  "Adding storage as part of a future-ready home strategy",
  "Exploring backup power with a more modern homeowner experience",
  "Planning resilience alongside EV, panel, or comfort upgrades",
];

const process = [
  "Tell us about your home and resilience goals",
  "Start with a clearer view of your backup power direction",
  "Review next steps around storage and planning fit",
  "Move forward through a premium homeowner-first flow",
];

export default function BatteryBackupPowerPage() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.15),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
              Battery & Backup Power
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Build more resilience into your home energy future
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
              FuseHarbor is building a more premium path for homeowners
              exploring battery storage and backup power as part of a modern
              electrification strategy.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                Start Your Quote
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                View All Services
              </Link>
            </div>
          </div>

          <div className="rounded-[36px] border border-fh-linen bg-fh-white p-6 shadow-sm lg:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
              <BatteryCharging size={26} />
            </div>

            <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
              Best for homeowners who want
            </h2>

            <div className="mt-6 grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[24px] border border-fh-linen bg-fh-warm-white p-4"
                >
                  <CheckCircle2 size={18} className="mt-0.5 text-fh-moss" />
                  <p className="text-sm leading-6 text-fh-stone">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
              Why this service matters
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight sm:text-4xl">
              Home resilience is becoming part of the modern energy conversation
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-fh-stone">
              As more homeowners think about energy confidence, battery and
              backup solutions are becoming part of long-term planning for the
              future-ready home.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-fh-linen bg-fh-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <BadgeCheck size={20} className="mt-0.5 text-fh-copper" />
                  <p className="text-sm leading-6 text-fh-stone">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-2 lg:px-8">
        <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                What the process looks like
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for premium resilience planning
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {process.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-fh-linen bg-fh-warm-white p-6"
                >
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                    0{index + 1}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-fh-stone">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[40px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Ready to begin
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Start your battery and backup planning with confidence
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                FuseHarbor is building a premium homeowner experience for
                resilience-minded energy upgrades.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                Get a Quote
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-fh-graphite/12 bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}