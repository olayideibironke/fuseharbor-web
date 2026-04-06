import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const steps = [
  {
    number: "01",
    title: "Tell us about your home",
    description:
      "Share your project goals, property type, and what kind of upgrade you are considering.",
  },
  {
    number: "02",
    title: "Get matched with vetted pros",
    description:
      "FuseHarbor is designed to connect homeowners with qualified professionals aligned with the work needed.",
  },
  {
    number: "03",
    title: "Review next steps clearly",
    description:
      "Compare direction, scope, and timing in a cleaner homeowner-centered flow.",
  },
  {
    number: "04",
    title: "Move forward with confidence",
    description:
      "Book your project through a warmer, more premium electrification experience.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <SiteHeader />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
            How it works
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            A cleaner, calmer path to home electrification
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            FuseHarbor is built for homeowners who want trust, clarity, and a
            more premium project experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-[30px] border border-fh-linen bg-fh-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                {step.number}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-fh-stone">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}