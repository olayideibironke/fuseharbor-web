import {
  FileText,
  ShieldCheck,
  Sparkles,
  Wrench,
  Scale,
  RefreshCw,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    title: "Website purpose",
    icon: Sparkles,
    body: [
      "FuseHarbor is being built as a premium home electrification marketplace focused on EV chargers, panel upgrades, heat pumps, battery backup power, and related homeowner project intake.",
      "The website currently supports public information, homeowner quote requests, early professional interest submissions, and internal operational workflows.",
    ],
  },
  {
    title: "No contractor engagement created by site visit alone",
    icon: Wrench,
    body: [
      "Using the FuseHarbor website, browsing pages, or submitting an intake form does not by itself create a contractor-client relationship, project agreement, or guarantee of service.",
      "A submitted quote request or pro interest submission is only an intake and review step unless and until a later direct engagement is separately confirmed.",
    ],
  },
  {
    title: "Accuracy and review",
    icon: ShieldCheck,
    body: [
      "FuseHarbor aims to present a cleaner, more trusted experience, but website content, workflows, and availability may continue changing during the pre-launch and launch-readiness period.",
      "Visitors should provide accurate information when using forms so the platform can review requests and follow up more clearly.",
    ],
  },
  {
    title: "Acceptable use",
    icon: Scale,
    body: [
      "The website may not be used for spam, abusive activity, fraudulent submissions, interference with platform operations, or attempts to access internal-only systems without authorization.",
      "FuseHarbor may restrict, remove, or ignore submissions that appear abusive, misleading, automated, or inconsistent with the intended use of the platform.",
    ],
  },
  {
    title: "Platform changes",
    icon: RefreshCw,
    body: [
      "FuseHarbor may update, improve, pause, or restructure parts of the website, intake flows, and internal operations as the marketplace continues becoming more polished and launch-ready.",
      "This Terms page may also be updated as the site evolves.",
    ],
  },
  {
    title: "General website use",
    icon: FileText,
    body: [
      "All website materials, branding, and workflows are provided to support FuseHarbor’s marketplace experience and ongoing platform buildout.",
      "Nothing on this page should be read as a guarantee of project approval, contractor assignment, timing commitment, or platform feature permanence during the current build stage.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Terms
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Terms of website use
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            These terms describe the current use expectations for the FuseHarbor
            website during its pre-launch and launch-readiness stage.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <ShieldCheck size={16} className="text-fh-copper" />
              Trust-first website
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <Scale size={16} className="text-fh-copper" />
              Clear public expectations
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <FileText size={16} className="text-fh-copper" />
              Pre-launch transparency
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                    <Icon size={22} />
                  </div>
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-6 grid gap-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-7 text-fh-stone"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}