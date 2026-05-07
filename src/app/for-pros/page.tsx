"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Mail,
  MapPin,
  ShieldCheck,
  User,
  Users,
  Zap,
} from "lucide-react";
import { PublicLaunchNote } from "@/components/public-launch-note";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const MIN_SUBMIT_TIME_MS = 1500;

const heroPoints = [
  "Maryland-first pro network",
  "Electrification-focused project demand",
  "Cleaner homeowner intake",
  "Quality-first marketplace rollout",
];

const networkCards = [
  {
    title: "A focused pro network",
    description:
      "FuseHarbor is not trying to become a crowded general contractor directory. The early network is being shaped around clean home upgrade professionals.",
    icon: Users,
  },
  {
    title: "Better project context",
    description:
      "Homeowner requests are structured around project type, property details, timing, and goals so early review can happen with more useful information.",
    icon: ClipboardCheck,
  },
  {
    title: "Built for trust",
    description:
      "The marketplace is being developed carefully so homeowner experience, professional participation, and operational quality can mature together.",
    icon: ShieldCheck,
  },
];

const processSteps = [
  {
    title: "Submit early interest",
    description:
      "Share your company details, trade category, and service area so FuseHarbor can track early professional demand.",
  },
  {
    title: "Fit and coverage review",
    description:
      "FuseHarbor uses submitted details to understand which trades and Maryland service areas are forming the strongest early network.",
  },
  {
    title: "Future follow-up",
    description:
      "As the marketplace pilot matures, submitted professionals may be contacted for onboarding review, service fit, and launch-readiness conversations.",
  },
];

const fundingReadyPoints = [
  "Supports a cleaner local contractor pipeline",
  "Focuses on EV chargers, panels, heat pumps, and backup power",
  "Creates a more organized homeowner-to-pro workflow",
  "Helps validate Maryland homeowner demand before wider expansion",
  "Builds toward a practical, revenue-capable marketplace model",
  "Keeps early growth honest, measured, and quality-led",
];

const tradeOptions = [
  "Licensed Electrician",
  "EV Charger Installer",
  "Panel Upgrade Specialist",
  "Heat Pump Contractor",
  "Battery / Backup Power Installer",
  "General Electrification Pro",
  "Other",
];

const inputBaseClassName =
  "w-full rounded-[20px] border border-fh-linen bg-fh-warm-white px-4 py-4 text-sm text-fh-graphite outline-none transition placeholder:text-fh-stone/80 focus:border-fh-copper focus:bg-fh-white";

type FormState = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  tradeCategory: string;
  serviceArea: string;
  notes: string;
};

type ProInterestApiResponse =
  | {
      id: string;
      createdAt: string;
    }
  | {
      error: string;
    };

const initialFormState: FormState = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  tradeCategory: tradeOptions[0],
  serviceArea: "",
  notes: "",
};

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ForProsPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialFormState);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [honeypotValue, setHoneypotValue] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setSubmitError("");
  }

  const trimmedForm = useMemo(
    () => ({
      companyName: form.companyName.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/\D/g, "").slice(0, 10),
      tradeCategory: form.tradeCategory.trim(),
      serviceArea: form.serviceArea.trim(),
      notes: form.notes.trim(),
    }),
    [form],
  );

  const emailLooksValid =
    trimmedForm.email.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedForm.email);

  const phoneLooksValid = /^\d{10}$/.test(trimmedForm.phone);

  const requiredFieldErrors = {
    companyName: trimmedForm.companyName.length === 0,
    contactName: trimmedForm.contactName.length === 0,
    email: trimmedForm.email.length === 0 || !emailLooksValid,
    phone: trimmedForm.phone.length === 0 || !phoneLooksValid,
    tradeCategory: trimmedForm.tradeCategory.length === 0,
    serviceArea: trimmedForm.serviceArea.length === 0,
  };

  const isFormValid =
    !requiredFieldErrors.companyName &&
    !requiredFieldErrors.contactName &&
    !requiredFieldErrors.email &&
    !requiredFieldErrors.phone &&
    !requiredFieldErrors.tradeCategory &&
    !requiredFieldErrors.serviceArea;

  const summaryItems = [
    {
      label: "Company",
      value: trimmedForm.companyName || "Not provided yet",
    },
    {
      label: "Primary contact",
      value: trimmedForm.contactName || "Not provided yet",
    },
    {
      label: "Email",
      value: trimmedForm.email || "Not provided yet",
    },
    {
      label: "Phone",
      value: trimmedForm.phone
        ? formatPhoneNumber(trimmedForm.phone)
        : "Not provided yet",
    },
    {
      label: "Trade category",
      value: trimmedForm.tradeCategory || "Not selected yet",
    },
    {
      label: "Service area",
      value: trimmedForm.serviceArea || "Not provided yet",
    },
  ];

  function fieldClassName(hasError: boolean) {
    return `${inputBaseClassName} ${
      showValidation && hasError ? "border-red-500 bg-white" : ""
    }`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setShowValidation(true);
    setSubmitError("");

    if (!isFormValid) {
      return;
    }

    if (honeypotValue.trim().length > 0) {
      setSubmitError("Please review your details and try again.");
      return;
    }

    if (Date.now() - formStartedAt < MIN_SUBMIT_TIME_MS) {
      setSubmitError(
        "Please take a moment to review your details, then submit again.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/pro-interest-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          companyName: trimmedForm.companyName,
          contactName: trimmedForm.contactName,
          email: trimmedForm.email,
          phone: trimmedForm.phone,
          tradeCategory: trimmedForm.tradeCategory,
          serviceArea: trimmedForm.serviceArea,
          notes: trimmedForm.notes,
          honeypot: honeypotValue,
          startedAt: formStartedAt,
        }),
      });

      const result = (await response.json()) as ProInterestApiResponse;

      if (!response.ok || "error" in result) {
        const message =
          "error" in result
            ? result.error
            : "Something went wrong while saving your pro interest request.";

        setSubmitError(message);
        return;
      }

      const params = new URLSearchParams({
        id: result.id,
        submittedAt: result.createdAt,
        tradeCategory: trimmedForm.tradeCategory,
      });

      router.push(`/for-pros/success?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your pro interest request.";

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.14),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />
        <SiteHeader />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Maryland pro network forming
          </p>

          <div className="mt-4 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Help shape a cleaner marketplace for home electrification work
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
                FuseHarbor is building a Maryland-first network for qualified
                professionals serving EV charger installation, panel upgrades,
                heat pump solutions, battery storage, and backup power projects.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroPoints.map((point) => (
                  <div
                    key={point}
                    className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm"
                  >
                    <CheckCircle2 size={16} className="text-fh-moss" />
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/get-a-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
                >
                  View homeowner flow
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
                >
                  Back to home
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Early-stage rollout
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold text-fh-graphite">
                Built carefully before scaling widely
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                FuseHarbor is not presenting itself as a finished national
                contractor directory. The goal is to validate a practical local
                model, improve homeowner intake, and grow a serious professional
                network step by step.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-fh-copper"
                    />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Quality-first positioning
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        The platform is being shaped around trust, project fit,
                        and a better experience for both homeowners and pros.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Zap
                      size={18}
                      className="mt-0.5 shrink-0 text-fh-copper"
                    />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Electrification-specific focus
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        FuseHarbor is focused on modern home upgrade categories,
                        not scattered general-service lead noise.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Users
                      size={18}
                      className="mt-0.5 shrink-0 text-fh-copper"
                    />
                    <div>
                      <p className="text-sm font-semibold text-fh-graphite">
                        Local pro demand signal
                      </p>
                      <p className="mt-1 text-sm leading-6 text-fh-stone">
                        Early submissions help FuseHarbor understand contractor
                        interest, service coverage, and launch-readiness needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {networkCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[32px] border border-fh-linen bg-fh-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <Icon size={22} />
                </div>
                <h2 className="mt-6 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-fh-stone">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <PublicLaunchNote
          title="Early professional interest, measured Maryland rollout"
          description="FuseHarbor is collecting professional interest while the marketplace continues becoming more polished, stable, and operationally ready. Submitting interest does not guarantee placement, but it helps shape the early network and service coverage strategy."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]"
        >
          <div className="space-y-8">
            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Why this matters
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                A stronger local marketplace needs serious professionals
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                Homeowners need a cleaner path to start complex electrification
                projects. Professionals need better project context before
                spending time on leads. FuseHarbor is being built to improve
                that connection from the first intake.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {heroPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[30px] border border-fh-linen bg-fh-warm-white p-6"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={20}
                        className="mt-0.5 text-fh-moss"
                      />
                      <p className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                        {point}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                How this works
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                Early interest first, formal onboarding later
              </h3>

              <div className="mt-8 grid gap-4">
                {processSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fh-graphite text-sm font-semibold text-fh-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-fh-graphite">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-fh-stone">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Funding-ready signal
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
                Pro interest helps prove the marketplace opportunity
              </h3>
              <p className="mt-3 text-sm leading-7 text-fh-stone">
                For a Maryland-first pilot, contractor interest is more than a
                signup form. It helps show that FuseHarbor can create value on
                both sides of the marketplace: homeowners seeking clearer
                project starts and local professionals seeking better-fit work.
              </p>

              <div className="mt-6 grid gap-3">
                {fundingReadyPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-fh-copper"
                    />
                    <p className="text-sm leading-6 text-fh-stone">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                <BriefcaseBusiness size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                  Pro interest form
                </p>
                <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                  Submit your company details
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-fh-stone">
              This form is for early professional interest during FuseHarbor’s
              Maryland-first pilot planning. It helps organize trade coverage,
              service areas, and future onboarding conversations.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Company / professional name{" "}
                  <span className="text-fh-copper">*</span>
                </label>
                <input
                  name="companyName"
                  type="text"
                  autoComplete="organization"
                  required
                  aria-invalid={showValidation && requiredFieldErrors.companyName}
                  value={form.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  placeholder="Enter company or professional name"
                  className={fieldClassName(requiredFieldErrors.companyName)}
                />
                {showValidation && requiredFieldErrors.companyName ? (
                  <p className="mt-2 text-xs text-red-600">
                    Company / professional name is required.
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Primary contact name <span className="text-fh-copper">*</span>
                </label>
                <input
                  name="contactName"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={showValidation && requiredFieldErrors.contactName}
                  value={form.contactName}
                  onChange={(event) =>
                    updateField("contactName", event.target.value)
                  }
                  placeholder="Enter primary contact name"
                  className={fieldClassName(requiredFieldErrors.contactName)}
                />
                {showValidation && requiredFieldErrors.contactName ? (
                  <p className="mt-2 text-xs text-red-600">
                    Primary contact name is required.
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Email <span className="text-fh-copper">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={showValidation && requiredFieldErrors.email}
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Enter email"
                  className={fieldClassName(requiredFieldErrors.email)}
                />
                {showValidation && requiredFieldErrors.email ? (
                  <p className="mt-2 text-xs text-red-600">
                    Enter a valid email address.
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Phone <span className="text-fh-copper">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={14}
                  required
                  aria-invalid={showValidation && requiredFieldErrors.phone}
                  value={formatPhoneNumber(form.phone)}
                  onChange={(event) => {
                    const digitsOnly = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    updateField("phone", digitsOnly);
                  }}
                  placeholder="Enter 10-digit phone number"
                  className={fieldClassName(requiredFieldErrors.phone)}
                />
                {showValidation && requiredFieldErrors.phone ? (
                  <p className="mt-2 text-xs text-red-600">
                    Enter a valid 10-digit phone number.
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Trade category <span className="text-fh-copper">*</span>
                </label>
                <select
                  name="tradeCategory"
                  required
                  aria-invalid={showValidation && requiredFieldErrors.tradeCategory}
                  value={form.tradeCategory}
                  onChange={(event) =>
                    updateField("tradeCategory", event.target.value)
                  }
                  className={fieldClassName(requiredFieldErrors.tradeCategory)}
                >
                  {tradeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Service area <span className="text-fh-copper">*</span>
                </label>
                <input
                  name="serviceArea"
                  type="text"
                  autoComplete="address-level1"
                  required
                  aria-invalid={showValidation && requiredFieldErrors.serviceArea}
                  value={form.serviceArea}
                  onChange={(event) =>
                    updateField("serviceArea", event.target.value)
                  }
                  placeholder="Ex: Prince George's County, Montgomery County"
                  className={fieldClassName(requiredFieldErrors.serviceArea)}
                />
                {showValidation && requiredFieldErrors.serviceArea ? (
                  <p className="mt-2 text-xs text-red-600">
                    Service area is required.
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Tell FuseHarbor about your work, specialties, licenses, certifications, service focus, or ideal project types."
                  rows={6}
                  className={inputBaseClassName}
                />
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute left-[-5000px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor="pro-company-site">Website</label>
              <input
                id="pro-company-site"
                type="text"
                value={honeypotValue}
                onChange={(event) => setHoneypotValue(event.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <div className="mt-8 rounded-[28px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-6">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Submission status
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
                Ready to submit
              </h3>
              <p className="mt-3 text-sm leading-7 text-fh-stone">
                Complete the required fields and submit your pro interest so
                FuseHarbor can track early network demand cleanly.
              </p>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition ${
                  isFormValid && !isSubmitting
                    ? "bg-fh-graphite text-fh-white hover:opacity-95"
                    : "cursor-not-allowed bg-fh-stone/35 text-fh-white/85"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Pro Interest"}
              </button>

              {showValidation && !isFormValid ? (
                <p className="mt-3 text-xs leading-6 text-red-600" role="alert">
                  Please complete all required fields with valid information
                  before submitting.
                </p>
              ) : null}

              {submitError ? (
                <p className="mt-3 text-xs leading-6 text-red-600" role="alert">
                  {submitError}
                </p>
              ) : null}
            </div>

            <div className="mt-8 rounded-[28px] border border-fh-linen bg-fh-warm-white p-6">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Live summary
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {summaryItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-fh-linen bg-fh-white px-5 py-4"
                  >
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-fh-stone">
                      {item.value}
                    </p>
                  </div>
                ))}

                <div className="rounded-[24px] border border-fh-linen bg-fh-white px-5 py-4 sm:col-span-2">
                  <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                    Notes
                  </p>
                  <p className="mt-2 text-sm leading-6 text-fh-stone">
                    {trimmedForm.notes || "No additional notes provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                <div className="flex items-start gap-3">
                  <User
                    size={18}
                    className="mt-0.5 shrink-0 text-fh-copper"
                  />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Primary contact
                    </p>
                    <p className="mt-2 text-sm leading-6 text-fh-stone">
                      A real person for future review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                <div className="flex items-start gap-3">
                  <Mail
                    size={18}
                    className="mt-0.5 shrink-0 text-fh-copper"
                  />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Email
                    </p>
                    <p className="mt-2 text-sm leading-6 text-fh-stone">
                      Used for future marketplace follow-up.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-fh-copper"
                  />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      Service area
                    </p>
                    <p className="mt-2 text-sm leading-6 text-fh-stone">
                      Helps shape Maryland coverage planning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}