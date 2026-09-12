import {
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    title: "What this page covers",
    icon: ShieldCheck,
    body: [
      "This page explains how FuseHarbor handles information submitted through the website and related public intake flows.",
      "FuseHarbor operates as a Maryland-first home electrification intake platform focused on clearer homeowner requests, professional coordination, and trust-led project review.",
    ],
  },
  {
    title: "Information submitted through the site",
    icon: Mail,
    body: [
      "When a homeowner submits a quote request, FuseHarbor may collect contact details, property details, project type, project timing, and any notes entered into the form.",
      "When a professional submits interest, FuseHarbor may collect company details, contact details, trade category, service area, and any notes entered into the form.",
      "When someone contacts FuseHarbor by email, FuseHarbor may keep the sender's email address, message content, and related communication details so the team can respond and maintain internal records.",
      "The website may also receive limited technical request information needed to operate, secure, and improve the site experience.",
    ],
  },
  {
    title: "How information is used",
    icon: Sparkles,
    body: [
      "Submitted information is used to review requests, organize workflow, respond to homeowners and professionals, and support the platform's intake process.",
      "Information may also be used to reduce spam or abusive activity, improve the website, troubleshoot issues, and support quality-first marketplace operations.",
      "FuseHarbor does not use quote request information to guarantee pricing, scheduling, contractor assignment, or service availability through the website alone.",
    ],
  },
  {
    title: "Storage and operational tools",
    icon: Database,
    body: [
      "FuseHarbor uses modern web, database, email, and operational tools to receive, store, process, and route website submissions and related workflow data.",
      "Information may be retained for as long as reasonably needed to review requests, respond to inquiries, operate the site, improve internal workflows, maintain records, and protect the platform from misuse.",
    ],
  },
  {
    title: "Access, review, and updates",
    icon: LockKeyhole,
    body: [
      "If submitted information needs to be corrected, updated, or deleted, contact FuseHarbor at support@fuseharbor.org or info@fuseharbor.org.",
      "FuseHarbor may need to retain certain records when reasonably required for operational, security, legal, or business recordkeeping purposes.",
      "This page may be updated as FuseHarbor's website, app, intake workflows, email routing, and operating practices continue to evolve.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Privacy
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Privacy and data use
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            FuseHarbor is built around a trust-first homeowner experience. This
            page explains how website submissions, professional interest
            inquiries, and contact messages are handled during active rollout.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <ShieldCheck size={16} className="text-fh-copper" />
              Trust-first platform
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <LockKeyhole size={16} className="text-fh-copper" />
              Responsible intake data
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <Database size={16} className="text-fh-copper" />
              Operational transparency
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
