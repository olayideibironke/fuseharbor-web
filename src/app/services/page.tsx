import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CarFront,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const services = [
  {
    title: "EV Charger Installation",
    href: "/services/ev-charger-installation",
    description:
      "Safe home charging setup with a premium homeowner experience.",
    icon: CarFront,
  },
  {
    title: "Panel Upgrades",
    href: "/services/panel-upgrades",
    description:
      "Electrical capacity planning and upgrades for modern homes.",
    icon: Zap,
  },
  {
    title: "Heat Pump Solutions",
    href: "/services/heat-pump-solutions",
    description:
      "Efficient comfort upgrades for homes moving toward all-electric living.",
    icon: Sparkles,
  },
  {
    title: "Battery & Backup Power",
    href: "/services/battery-backup-power",
    description:
      "Resilience-minded energy storage and backup power solutions.",
    icon: BatteryCharging,
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <SiteHeader />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Services
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Premium electrification services for modern homes
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            FuseHarbor begins with the highest-value upgrades homeowners need
            when preparing their homes for the future.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="rounded-[32px] border border-fh-linen bg-fh-white p-7 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <Icon size={24} />
                </div>

                <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  {service.title}
                </h2>

                <p className="mt-3 text-base leading-7 text-fh-stone">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fh-copper transition hover:opacity-80"
                >
                  Explore service
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}