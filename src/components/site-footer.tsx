import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const footerLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/for-pros", label: "For Pros" },
  { href: "/get-a-quote", label: "Get a Quote" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const footerSignals = [
  "Premium homeowner experience",
  "Electrification-focused marketplace",
  "Built around trust and clarity",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-fh-linen/80 bg-fh-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <BrandMark size="lg" />

            <p className="max-w-xl text-sm leading-7 text-fh-stone">
              FuseHarbor is being built to give homeowners a cleaner, more
              trusted way to start EV charging, panel upgrades, heat pumps, and
              backup power projects with a more premium experience from the
              first step.
            </p>

            <div className="flex flex-wrap gap-3">
              {footerSignals.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-warm-white px-4 py-2 text-sm font-medium text-fh-graphite"
                >
                  <ShieldCheck size={15} className="text-fh-copper" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Explore
              </p>

              <nav className="mt-5 grid gap-3">
                {footerLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm text-fh-stone transition hover:text-fh-graphite"
                  >
                    <ChevronRight size={15} className="text-fh-copper" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Next step
              </p>

              <div className="mt-5 rounded-[28px] border border-fh-linen bg-fh-warm-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <Zap size={20} />
                </div>

                <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                  Start your project with clarity
                </h3>
                <p className="mt-2 text-sm leading-6 text-fh-stone">
                  Use FuseHarbor’s guided intake to begin your electrification
                  project with a more structured homeowner experience.
                </p>

                <Link
                  href="/get-a-quote"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
                >
                  Get a Quote
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-fh-linen pt-6 text-sm text-fh-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FuseHarbor. All rights reserved.</p>

          <div className="inline-flex items-center gap-2">
            <Sparkles size={15} className="text-fh-copper" />
            <span>Trusted home electrification, done right.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}