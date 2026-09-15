import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const footerLinks = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/get-a-quote", label: "Get a Quote" },
  { href: "/for-pros", label: "For Pros" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const footerSignals = [
  "Maryland-first homeowner intake",
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
              FuseHarbor helps homeowners start EV charger, panel upgrade, heat
              pump, and backup power quote requests with a cleaner, more
              organized intake experience.
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

            <div className="grid gap-2 rounded-[24px] border border-fh-linen bg-fh-warm-white p-5 text-sm text-fh-stone sm:max-w-xl">
              <div className="inline-flex items-center gap-2 font-semibold text-fh-graphite">
                <Mail size={16} className="text-fh-copper" />
                Contact FuseHarbor
              </div>
              <p>
                Homeowner support: {" "}
                <a
                  href="mailto:support@fuseharbor.org"
                  className="font-semibold text-fh-graphite transition hover:text-fh-copper"
                >
                  support@fuseharbor.org
                </a>
              </p>
              <p>
                General inquiries: {" "}
                <a
                  href="mailto:info@fuseharbor.org"
                  className="font-semibold text-fh-graphite transition hover:text-fh-copper"
                >
                  info@fuseharbor.org
                </a>
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Explore
              </p>

              <nav className="mt-5 grid gap-3" aria-label="Footer navigation">
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
                  Use FuseHarbor's guided intake to submit your project details
                  for homeowner quote review.
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
          <p>
            © 2026 FuseHarbor. All rights reserved. {" "}
            <span className="font-semibold text-fh-graphite">
              A product of Westforge Holdings Inc.
            </span>
          </p>

          <div className="inline-flex items-center gap-2">
            <Sparkles size={15} className="text-fh-copper" />
            <span>Trusted home electrification, done right.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
