import {
  Mail,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const contactCards = [
  {
    title: "Homeowner questions",
    description:
      "Use this route when you need a simple public-facing contact path outside the main quote intake flow.",
    icon: MessageSquareMore,
  },
  {
    title: "Professional inquiries",
    description:
      "Professionals can still use the For Pros page for structured early interest, but this page adds a more general contact touchpoint.",
    icon: UserRoundSearch,
  },
  {
    title: "Trust-first communication",
    description:
      "FuseHarbor is being built around clarity, trust, and a more premium first impression across the public experience.",
    icon: ShieldCheck,
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
            General contact and inquiries
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
            FuseHarbor is still in its premium buildout stage. This page gives
            the public site a simple, legitimate contact destination outside the
            main intake flows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <Mail size={16} className="text-fh-copper" />
              Public-facing contact path
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <ShieldCheck size={16} className="text-fh-copper" />
              Trust-first experience
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
              <Sparkles size={16} className="text-fh-copper" />
              Launch-readiness polish
            </div>
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
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Current contact note
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold text-fh-graphite">
            Public contact details can be finalized in the next business pass
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-fh-stone">
            This page establishes the public contact destination cleanly. In the
            next pass, FuseHarbor can add the final business email address,
            support workflow, or contact form destination once you are ready to
            lock that in.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}