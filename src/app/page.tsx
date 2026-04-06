import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { PublicLaunchNote } from "@/components/public-launch-note";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const services = [
  {
    title: "EV Charger Installation",
    description:
      "Safe, design-conscious home charging setup for modern homeowners.",
    icon: CarFront,
  },
  {
    title: "Panel Upgrades",
    description:
      "Prepare your home for new electrical demand with cleaner planning.",
    icon: Zap,
  },
  {
    title: "Heat Pump Solutions",
    description:
      "Efficient comfort upgrades for homes moving toward all-electric living.",
    icon: Sparkles,
  },
  {
    title: "Battery & Backup Power",
    description:
      "Resilient home energy support for outages, storage, and future readiness.",
    icon: BatteryCharging,
  },
];

const trustPoints = [
  "Vetted pros",
  "Guided quotes",
  "Premium support",
  "Electrification-focused",
];

const steps = [
  {
    number: "01",
    title: "Tell us about your home",
    description:
      "Start with a guided intake designed for homeowners, not contractor chaos.",
  },
  {
    number: "02",
    title: "Get matched thoughtfully",
    description:
      "We connect you with vetted professionals aligned with your home and project type.",
  },
  {
    number: "03",
    title: "Review clear options",
    description:
      "Compare next steps with more clarity around scope, fit, and timing.",
  },
  {
    number: "04",
    title: "Move forward confidently",
    description:
      "Book your upgrade through a cleaner, more premium electrification flow.",
  },
];

const benefits = [
  "Electrification-focused, not generic",
  "Premium homeowner experience",
  "Cleaner project discovery",
  "Built for modern upgrades",
];

const trustLayer = [
  {
    title: "A more guided homeowner experience",
    description:
      "FuseHarbor is built to reduce confusion and give homeowners a calmer starting point for high-value electrical upgrades.",
  },
  {
    title: "Trust-first project intake",
    description:
      "We structure the request process so homeowners can share clean, usable details before the project moves forward.",
  },
  {
    title: "Premium support mindset",
    description:
      "The platform is designed to feel thoughtful, warm, and design-aware instead of rushed or generic.",
  },
  {
    title: "Built around modern home upgrades",
    description:
      "Everything starts with the real categories homeowners are prioritizing now: EV charging, panel capacity, heat pumps, and backup power.",
  },
];

const faqItems = [
  {
    question: "Do I need to know exactly what service I need before starting?",
    answer:
      "No. FuseHarbor is designed to help homeowners begin even if they are still comparing options or need guidance before deciding.",
  },
  {
    question: "Can I request a quote even if I am early in planning?",
    answer:
      "Yes. You can start whether you want to move quickly or you are planning for the next few months.",
  },
  {
    question: "Is FuseHarbor only for one type of upgrade?",
    answer:
      "No. The platform is being built for EV charger installation, panel upgrades, heat pumps, battery storage, and related electrification projects.",
  },
  {
    question: "What makes FuseHarbor different?",
    answer:
      "It is designed to feel more premium, structured, and homeowner-centered than a typical contractor lead marketplace.",
  },
];

const proofStats = [
  {
    label: "Launch focus",
    value: "Maryland",
  },
  {
    label: "Core promise",
    value: "Guided trust",
  },
  {
    label: "Project type",
    value: "Electrification",
  },
];

const premiumSignals = [
  {
    title: "Designed for serious homeowners",
    description:
      "FuseHarbor is for people making meaningful home upgrades, not chasing random low-quality leads.",
  },
  {
    title: "Built for premium pro fit",
    description:
      "The platform is being shaped to attract professionals who value cleaner projects and stronger presentation.",
  },
  {
    title: "Structured before scale",
    description:
      "The goal is to build a stable, polished marketplace foundation before broader rollout and outreach.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.14),_transparent_24%),linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]" />
        <div className="absolute left-[-6rem] top-28 -z-10 h-56 w-56 rounded-full bg-fh-sand/25 blur-3xl" />
        <div className="absolute bottom-0 right-[-5rem] -z-10 h-64 w-64 rounded-full bg-fh-moss/10 blur-3xl" />

        <SiteHeader />

        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl pt-4 lg:pt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm text-fh-stone shadow-sm">
              <ShieldCheck size={16} className="text-fh-copper" />
              Trusted home electrification, done right.
            </div>

            <h1 className="mt-8 font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] text-fh-graphite sm:text-6xl lg:text-7xl">
              Premium home electrification,
              <span className="mt-1 block text-fh-copper">
                guided with trust.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-fh-stone lg:text-xl">
              FuseHarbor helps homeowners move into the future with vetted pros
              for EV chargers, panel upgrades, heat pumps, and clean energy
              improvements through a more thoughtful, premium project journey.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                Get a Quote
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/for-pros"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                Become a Pro
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-fh-linen bg-fh-white px-4 py-3 text-sm text-fh-stone shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {proofStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-fh-linen bg-fh-white px-5 py-4 shadow-sm"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[40px] border border-fh-linen bg-fh-white p-5 shadow-[0_24px_90px_rgba(35,38,43,0.08)]">
              <div className="rounded-[34px] border border-fh-sand bg-[linear-gradient(135deg,_#fffdf9_0%,_#f2ebe1_100%)] p-6 lg:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-sm">
                    <p className="text-sm text-fh-stone">Launch focus</p>
                    <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite lg:text-3xl">
                      Premium electrification services
                    </h2>
                  </div>

                  <div className="w-fit rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-xs font-semibold tracking-[0.18em] text-fh-moss uppercase">
                    Maryland First
                  </div>
                </div>

                <div className="mt-7 grid gap-4">
                  {services.map((service) => {
                    const Icon = service.icon;

                    return (
                      <div
                        key={service.title}
                        className="rounded-[28px] border border-fh-linen bg-fh-white p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                            <Icon size={22} />
                          </div>

                          <div>
                            <h3 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                              {service.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-fh-stone">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-fh-linen bg-fh-white p-5">
                  <p className="text-sm text-fh-stone">Best for</p>
                  <p className="mt-2 font-[family-name:var(--font-manrope)] text-xl font-semibold text-fh-graphite">
                    EV owners and design-aware homeowners
                  </p>
                </div>

                <div className="rounded-[28px] border border-fh-linen bg-fh-sand/50 p-5">
                  <p className="text-sm text-fh-stone">Experience</p>
                  <p className="mt-2 font-[family-name:var(--font-manrope)] text-xl font-semibold text-fh-graphite">
                    Warm, premium, guided
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <PublicLaunchNote />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {premiumSignals.map((item) => (
            <article
              key={item.title}
              className="rounded-[32px] border border-fh-linen bg-fh-white p-8 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                <Star size={20} />
              </div>
              <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
                {item.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
              Services
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight text-fh-graphite sm:text-4xl">
              Built for premium home electrification
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-fh-stone">
              FuseHarbor begins with the highest-value services homeowners need
              when upgrading their homes for modern energy use.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-[30px] border border-fh-linen bg-fh-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(35,38,43,0.08)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-xl font-semibold text-fh-graphite">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-fh-stone">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                How it works
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight text-fh-graphite sm:text-4xl">
                A cleaner, calmer way to begin
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                FuseHarbor is designed for homeowners who want trust, clarity,
                and a more elevated project experience.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[28px] border border-fh-linen bg-fh-warm-white p-6"
                >
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                    {step.number}
                  </p>
                  <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-xl font-semibold text-fh-graphite">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-fh-stone">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="trust-layer"
        className="mx-auto max-w-7xl px-6 py-4 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
              Why homeowners can trust FuseHarbor
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight text-fh-graphite sm:text-4xl">
              Built to feel clear, guided, and homeowner-first
            </h2>
            <p className="mt-4 text-base leading-7 text-fh-stone">
              FuseHarbor is not trying to feel like a noisy contractor listing
              site. It is being built as a more premium marketplace experience
              for homeowners making serious electrification decisions.
            </p>

            <div className="mt-8 rounded-[28px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-6">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Homeowner reassurance
              </p>
              <p className="mt-3 text-sm leading-7 text-fh-stone">
                From the first quote request to the next project step, the goal
                is to reduce confusion and make homeowners feel more informed,
                more supported, and more confident about moving forward.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {trustLayer.map((item) => (
              <article
                key={item.title}
                className="rounded-[30px] border border-fh-linen bg-fh-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-xl font-semibold text-fh-graphite">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-fh-stone">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="why-fuseharbor"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[36px] border border-fh-linen bg-fh-graphite p-8 text-fh-white shadow-sm lg:p-10">
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-sand uppercase">
              Why FuseHarbor
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight sm:text-4xl">
              Built to feel different from the usual contractor marketplace
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-fh-white/72">
              FuseHarbor is designed to feel more premium, more thoughtful, and
              more homeowner-centered than generic lead-gen platforms.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-fh-linen bg-fh-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 text-fh-moss" />
                  <p className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
              Homeowner questions
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight text-fh-graphite sm:text-4xl">
              Simple answers before you get started
            </h2>
            <p className="mt-4 text-base leading-7 text-fh-stone">
              A few quick points to make the first step feel more comfortable.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-[28px] border border-fh-linen bg-fh-warm-white p-6"
              >
                <div className="flex items-start gap-3">
                  <CircleHelp size={20} className="mt-0.5 text-fh-copper" />
                  <div>
                    <h3 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-fh-stone">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[40px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Launching in Maryland
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-tight text-fh-graphite sm:text-4xl">
                Start your home electrification project today
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                Get matched with trusted pros for EV charging, panel upgrades,
                heat pumps, and premium homeowner support built for modern homes.
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
                href="/for-pros"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-fh-graphite/12 bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
              >
                Become a Pro
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}