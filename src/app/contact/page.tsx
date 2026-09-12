import {
  BadgeDollarSign,
  Handshake,
  HelpCircle,
  Mail,
  MessageSquareMore,
  ShieldCheck,
  UserRoundSearch,
  Wrench,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const contactCards = [
  {
    title: "Homeowner support",
    description:
      "Questions about a quote request, project intake, or next steps can be sent to the FuseHarbor support team.",
    email: "support@fuseharbor.org",
    icon: MessageSquareMore,
  },
  {
    title: "Service coordination",
    description:
      "Use this path for project service questions, homeowner follow-up, and electrification intake coordination.",
    email: "service@fuseharbor.org",
    icon: Wrench,
  },
  {
    title: "Professional onboarding",
    description:
      "Licensed professionals and service partners can reach the FuseHarbor team about onboarding and marketplace participation.",
    email: "onboarding@fuseharbor.org",
    icon: UserRoundSearch,
  },
];

const contactLinks = [
  {
    label: "General information",
    email: "info@fuseharbor.org",
    icon: Mail,
  },
  {
    label: "Customer support",
    email: "support@fuseharbor.org",
    icon: HelpCircle,
  },
  {
    label: "Service questions",
    email: "service@fuseharbor.org",
    icon: Wrench,
  },
  {
    label: "Professional onboarding",
    email: "onboarding@fuseharbor.org",
    icon: Handshake,
  },
  {
    label: "Payments and billing",
    email: "payments@fuseharbor.org",
    icon: BadgeDollarSign,
  },
  {
    label: "Ask FuseHarbor",
    email: "ask-us@fuseharbor.org",
    icon: MessageSquareMore,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Contact
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Reach the right FuseHarbor team
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            FuseHarbor helps homeowners start trusted home electrification quote
            requests and gives professionals a clear path to connect with the
            marketplace team.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:info@fuseharbor.org"
              className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm transition hover:border-fh-copper"
            >
              <Mail size={16} className="text-fh-copper" />
              info@fuseharbor.org
            </a>
            <a
              href="mailto:support@fuseharbor.org"
              className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm transition hover:border-fh-copper"
            >
              <ShieldCheck size={16} className="text-fh-copper" />
              support@fuseharbor.org
            </a>
            <a
              href="/get-a-quote"
              className="inline-flex items-center gap-2 rounded-full border border-fh-graphite bg-fh-graphite px-4 py-2 text-sm font-semibold text-fh-white shadow-sm transition hover:opacity-95"
            >
              Start a quote request
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {contactCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[32px] border border-fh-linen bg-fh-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <Icon size={20} />
                </div>

                <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  {card.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-fh-stone">
                  {card.description}
                </p>
                <a
                  href={`mailto:${card.email}`}
                  className="mt-6 inline-flex text-sm font-semibold text-fh-copper transition hover:text-fh-graphite"
                >
                  {card.email}
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Contact directory
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold text-fh-graphite">
            Use the email address that best fits your request
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-fh-stone">
            FuseHarbor routes each public email channel to the right internal
            inbox so homeowner questions, service coordination, partner
            onboarding, and payment matters stay organized.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {contactLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.email}
                  href={`mailto:${item.email}`}
                  className="group flex items-center gap-4 rounded-[24px] border border-fh-linen bg-fh-white/80 p-5 shadow-sm transition hover:border-fh-copper hover:bg-fh-white"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper transition group-hover:bg-fh-copper group-hover:text-fh-white">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-fh-graphite">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-fh-stone">{item.email}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-[32px] border border-fh-linen bg-fh-white p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
            Important note
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-fh-stone">
            FuseHarbor is not an emergency service. For urgent electrical,
            safety, fire, or medical issues, contact the appropriate emergency
            service or a qualified local professional directly.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
