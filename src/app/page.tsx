"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BatteryCharging,
  CarFront,
  CheckCircle2,
  Home,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Zap,
} from "lucide-react";
import { PublicLaunchNote } from "@/components/public-launch-note";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const MIN_SUBMIT_TIME_MS = 1500;

const projectTypes = [
  {
    title: "EV Charger Installation",
    description: "Home charging setup for modern EV ownership.",
    icon: CarFront,
  },
  {
    title: "Panel Upgrade",
    description: "Electrical readiness for higher home energy demand.",
    icon: Zap,
  },
  {
    title: "Heat Pump Solution",
    description: "Efficient comfort upgrades for future-ready homes.",
    icon: Sparkles,
  },
  {
    title: "Battery / Backup Power",
    description: "Resilience-minded storage and backup planning.",
    icon: BatteryCharging,
  },
] as const;

const propertyTypes = [
  "Single-family home",
  "Townhouse",
  "Condo",
  "Multi-family property",
  "Other",
];

const projectGoalOptions = [
  "I want to start as soon as possible",
  "I am comparing options",
  "I am planning for the next few months",
  "I need guidance before deciding",
];

const reassuranceCards = [
  {
    title: "Built for a focused Maryland pilot",
    description:
      "FuseHarbor is starting carefully with a Maryland-first rollout, giving the marketplace room to grow with quality, trust, and real homeowner demand.",
  },
  {
    title: "Cleaner homeowner intake",
    description:
      "Instead of sending homeowners into a generic form, FuseHarbor organizes project details so EV charger, panel, heat pump, and backup power requests can be reviewed more clearly.",
  },
  {
    title: "Local pro network forming",
    description:
      "The platform is being shaped to support qualified local professionals with better project context and a more serious homeowner pipeline.",
  },
];

const pilotFocusCards = [
  {
    title: "Why FuseHarbor exists",
    description:
      "Home electrification projects can feel fragmented, confusing, and difficult to start. FuseHarbor gives homeowners a calmer first step before moving into contractor conversations.",
    icon: Home,
  },
  {
    title: "What the pilot is proving",
    description:
      "The Maryland pilot is focused on validating homeowner demand, improving quote intake, onboarding trusted professionals, and building a repeatable service workflow.",
    icon: ShieldCheck,
  },
  {
    title: "What growth support unlocks",
    description:
      "Funding and business support would help expand homeowner outreach, improve platform operations, support pro onboarding, and strengthen the customer experience.",
    icon: ArrowRight,
  },
];

const growthPriorities = [
  "Maryland homeowner outreach",
  "Qualified pro onboarding",
  "Quote workflow improvements",
  "Customer support operations",
  "CRM and email automation",
  "Trust, compliance, and business infrastructure",
];

const businessModelPoints = [
  "Homeowners submit structured project requests",
  "FuseHarbor organizes project details for review",
  "Qualified local pros can be matched as the network matures",
  "The platform grows through cleaner marketplace operations",
];

const inputBaseClassName =
  "w-full rounded-[20px] border border-fh-linen bg-fh-warm-white px-4 py-4 text-sm text-fh-graphite outline-none transition placeholder:text-fh-stone/80 focus:border-fh-copper focus:bg-fh-white";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  propertyType: string;
  notes: string;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zipCode: "",
  propertyType: propertyTypes[0],
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

type QuoteRequestApiResponse =
  | {
      id: string;
      createdAt: string;
    }
  | {
      error: string;
    };

export default function HomePage() {
  const router = useRouter();

  const [selectedProjectType, setSelectedProjectType] = useState<string>(
    projectTypes[0].title,
  );
  const [selectedGoal, setSelectedGoal] = useState<string>(
    projectGoalOptions[0],
  );
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [zipValidationMessage, setZipValidationMessage] = useState("");
  const [honeypotValue, setHoneypotValue] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  const selectedProject = useMemo(
    () => projectTypes.find((item) => item.title === selectedProjectType),
    [selectedProjectType],
  );

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "zipCode") {
      setZipValidationMessage("");
      setSubmitError("");
    }
  }

  const trimmedForm = {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.replace(/\D/g, "").slice(0, 10),
    address: form.address.trim(),
    city: form.city.trim(),
    zipCode: form.zipCode.trim(),
    propertyType: form.propertyType.trim(),
    notes: form.notes.trim(),
  };

  const emailLooksValid =
    trimmedForm.email.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedForm.email);

  const phoneLooksValid = /^\d{10}$/.test(trimmedForm.phone);

  const zipLooksValid =
    trimmedForm.zipCode.length > 0 && /^\d{5}$/.test(trimmedForm.zipCode);

  const requiredFieldErrors = {
    fullName: trimmedForm.fullName.length === 0,
    email: trimmedForm.email.length === 0 || !emailLooksValid,
    phone: trimmedForm.phone.length === 0 || !phoneLooksValid,
    address: trimmedForm.address.length === 0,
    city: trimmedForm.city.length === 0,
    zipCode: trimmedForm.zipCode.length === 0 || !zipLooksValid,
  };

  const isFormValid =
    !requiredFieldErrors.fullName &&
    !requiredFieldErrors.email &&
    !requiredFieldErrors.phone &&
    !requiredFieldErrors.address &&
    !requiredFieldErrors.city &&
    !requiredFieldErrors.zipCode;

  const summaryItems = [
    {
      label: "Project type",
      value: selectedProjectType,
    },
    {
      label: "Homeowner",
      value: trimmedForm.fullName || "Not provided yet",
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
      label: "Location",
      value:
        trimmedForm.city || trimmedForm.zipCode
          ? `${trimmedForm.city || "City pending"}${
              trimmedForm.city && trimmedForm.zipCode ? ", " : ""
            }${trimmedForm.zipCode || "ZIP pending"}`
          : "Not provided yet",
    },
    {
      label: "Property type",
      value: trimmedForm.propertyType || "Not selected yet",
    },
    {
      label: "Project goal",
      value: selectedGoal,
    },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setShowValidation(true);
    setSubmitError("");
    setZipValidationMessage("");

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

      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          projectType: selectedProjectType,
          projectGoal: selectedGoal,
          fullName: trimmedForm.fullName,
          email: trimmedForm.email,
          phone: trimmedForm.phone,
          address: trimmedForm.address,
          city: trimmedForm.city,
          zipCode: trimmedForm.zipCode,
          propertyType: trimmedForm.propertyType,
          notes: trimmedForm.notes,
          honeypot: honeypotValue,
          startedAt: formStartedAt,
        }),
      });

      const result = (await response.json()) as QuoteRequestApiResponse;

      if (!response.ok || "error" in result) {
        const message =
          "error" in result
            ? result.error
            : "Something went wrong while saving your quote request.";

        if (message.toLowerCase().includes("zip code")) {
          setZipValidationMessage(message);
        } else {
          setSubmitError(message);
        }

        return;
      }

      const params = new URLSearchParams({
        id: result.id,
        submittedAt: result.createdAt,
        projectType: selectedProjectType,
      });

      router.push(`/get-a-quote/success?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your quote request.";

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function fieldClassName(hasError: boolean) {
    return `${inputBaseClassName} ${
      showValidation && hasError ? "border-red-500 bg-white" : ""
    }`;
  }

  return (
    <main className="min-h-screen bg-fh-warm-white text-fh-graphite">
      <section className="relative overflow-hidden border-b border-fh-linen/80 bg-[linear-gradient(to_bottom,_#fffdf9,_#f7f4ee)]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,43,0.15),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(122,139,90,0.12),_transparent_24%)]" />

        <SiteHeader />

        <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 lg:px-8 lg:pb-12">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Maryland-first electrification pilot
          </p>

          <div className="mt-4 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div>
              <h1 className="max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                A cleaner first step for modern home electrification projects
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
                FuseHarbor is an early-stage Maryland marketplace built to help
                homeowners start EV charger, panel upgrade, heat pump, and
                backup power projects with more clarity, structure, and trust.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
                  <MapPin size={16} className="text-fh-copper" />
                  Maryland-first pilot
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
                  <ShieldCheck size={16} className="text-fh-copper" />
                  Trust-led intake
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
                  <Zap size={16} className="text-fh-copper" />
                  Clean home upgrades
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#quote-form"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-fh-graphite px-6 py-4 text-sm font-semibold text-fh-white transition hover:opacity-95"
                >
                  Start a quote request
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/for-pros"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-fh-linen bg-fh-white px-6 py-4 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
                >
                  Join the pro network
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                What FuseHarbor is building
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold text-fh-graphite">
                A more organized path from homeowner interest to qualified pro
                review
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                FuseHarbor is being built to reduce the confusion around
                electrification projects by improving how homeowner needs are
                captured, reviewed, and prepared for local professional support.
              </p>

              <div className="mt-8 grid gap-4">
                {reassuranceCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-[24px] border border-fh-linen bg-white/70 px-5 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <Star
                        size={18}
                        className="mt-0.5 shrink-0 text-fh-copper"
                      />
                      <div>
                        <p className="text-sm font-semibold text-fh-graphite">
                          {card.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-fh-stone">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {pilotFocusCards.map((card) => {
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

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Practical marketplace model
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-[-0.03em] text-fh-graphite sm:text-4xl">
                Clear enough for homeowners, serious enough for funding review
              </h2>
              <p className="mt-4 text-base leading-8 text-fh-stone">
                FuseHarbor is positioned as a focused startup pilot, not a fake
                national directory. The first goal is to prove demand, build
                local professional coverage, and turn clean home upgrade intake
                into a repeatable marketplace workflow.
              </p>
            </div>

            <div className="grid gap-3">
              {businessModelPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-[22px] border border-fh-linen bg-fh-warm-white px-5 py-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-fh-copper"
                  />
                  <p className="text-sm font-semibold leading-6 text-fh-graphite">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="quote-form" className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="space-y-8">
            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <Zap size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                    Step 1
                  </p>
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                    Select your project type
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-base leading-7 text-fh-stone">
                Choose the clean home upgrade that best matches what you are
                planning for your property.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {projectTypes.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedProjectType === option.title;

                  return (
                    <button
                      key={option.title}
                      type="button"
                      onClick={() => setSelectedProjectType(option.title)}
                      className={`rounded-[28px] border p-5 text-left transition ${
                        isSelected
                          ? "border-fh-copper bg-fh-white shadow-sm"
                          : "border-fh-linen bg-fh-warm-white hover:border-fh-copper hover:bg-fh-white"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          isSelected
                            ? "bg-fh-copper text-fh-white"
                            : "bg-fh-sand text-fh-copper"
                        }`}
                      >
                        <Icon size={22} />
                      </div>
                      <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-lg font-semibold text-fh-graphite">
                        {option.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-fh-stone">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <User size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                    Step 2
                  </p>
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                    Homeowner details
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    Full name <span className="text-fh-copper">*</span>
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={showValidation && requiredFieldErrors.fullName}
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Enter your full name"
                    className={fieldClassName(requiredFieldErrors.fullName)}
                  />
                  {showValidation && requiredFieldErrors.fullName ? (
                    <p className="mt-2 text-xs text-red-600">
                      Full name is required.
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    Email address <span className="text-fh-copper">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={showValidation && requiredFieldErrors.email}
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="Enter your email address"
                    className={fieldClassName(requiredFieldErrors.email)}
                  />
                  {showValidation && requiredFieldErrors.email ? (
                    <p className="mt-2 text-xs text-red-600">
                      Enter a valid email address.
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    Phone number <span className="text-fh-copper">*</span>
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
                    placeholder="Enter 10-digit U.S. phone number"
                    className={fieldClassName(requiredFieldErrors.phone)}
                  />
                  {showValidation && requiredFieldErrors.phone ? (
                    <p className="mt-2 text-xs text-red-600">
                      Enter a valid 10-digit U.S. phone number.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <Home size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                    Step 3
                  </p>
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                    Property details
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    Property address <span className="text-fh-copper">*</span>
                  </label>
                  <input
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    required
                    aria-invalid={showValidation && requiredFieldErrors.address}
                    value={form.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    placeholder="Enter the property address"
                    className={fieldClassName(requiredFieldErrors.address)}
                  />
                  {showValidation && requiredFieldErrors.address ? (
                    <p className="mt-2 text-xs text-red-600">
                      Property address is required.
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    City <span className="text-fh-copper">*</span>
                  </label>
                  <input
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    aria-invalid={showValidation && requiredFieldErrors.city}
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="Enter city"
                    className={fieldClassName(requiredFieldErrors.city)}
                  />
                  {showValidation && requiredFieldErrors.city ? (
                    <p className="mt-2 text-xs text-red-600">City is required.</p>
                  ) : null}
                </div>

                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    ZIP code <span className="text-fh-copper">*</span>
                  </label>
                  <input
                    name="zipCode"
                    type="text"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={5}
                    required
                    aria-invalid={showValidation && requiredFieldErrors.zipCode}
                    value={form.zipCode}
                    onChange={(event) => {
                      const digitsOnly = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 5);
                      updateField("zipCode", digitsOnly);
                    }}
                    placeholder="Enter 5-digit ZIP code"
                    className={fieldClassName(requiredFieldErrors.zipCode)}
                  />
                  {showValidation && requiredFieldErrors.zipCode ? (
                    <p className="mt-2 text-xs text-red-600">
                      Enter a valid 5-digit U.S. ZIP code.
                    </p>
                  ) : null}
                  {zipValidationMessage ? (
                    <p className="mt-2 text-xs text-red-600">
                      {zipValidationMessage}
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                    Property type
                  </label>
                  <select
                    name="propertyType"
                    value={form.propertyType}
                    onChange={(event) =>
                      updateField("propertyType", event.target.value)
                    }
                    className={inputBaseClassName}
                  >
                    {propertyTypes.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="relative rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fh-sand text-fh-copper">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                    Step 4
                  </p>
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold">
                    Project timing and goals
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                {projectGoalOptions.map((option) => {
                  const isSelected = selectedGoal === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedGoal(option)}
                      className={`flex items-start gap-3 rounded-[24px] border px-5 py-4 text-left transition ${
                        isSelected
                          ? "border-fh-copper bg-fh-white shadow-sm"
                          : "border-fh-linen bg-fh-warm-white hover:border-fh-copper hover:bg-fh-white"
                      }`}
                    >
                      <CheckCircle2
                        size={18}
                        className={`mt-0.5 ${
                          isSelected ? "text-fh-copper" : "text-fh-moss"
                        }`}
                      />
                      <span className="text-sm leading-6 text-fh-stone">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8">
                <label className="mb-2 block text-sm font-semibold text-fh-graphite">
                  Additional project notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Tell us more about your home, goals, timeline, or anything you want FuseHarbor to know."
                  rows={6}
                  className={inputBaseClassName}
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute left-[-5000px] top-auto h-px w-px overflow-hidden"
              >
                <label htmlFor="project-website">Website</label>
                <input
                  id="project-website"
                  type="text"
                  value={honeypotValue}
                  onChange={(event) => setHoneypotValue(event.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:sticky lg:top-8">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-moss uppercase">
                Quote summary
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold">
                {selectedProject?.title || "A premium intake experience"}
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                The summary updates live as your quote request is completed, so
                your project details stay organized before submission.
              </p>

              <div className="mt-8 grid gap-4">
                {summaryItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-fh-linen bg-fh-warm-white px-5 py-4"
                  >
                    <p className="text-xs font-semibold tracking-[0.18em] text-fh-copper uppercase">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-fh-stone">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                  Submission status
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-fh-graphite">
                  Ready to submit
                </h3>
                <p className="mt-3 text-sm leading-7 text-fh-stone">
                  Complete the required fields and submit your homeowner quote
                  request for review.
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
                  {isSubmitting ? "Submitting..." : "Submit Quote Request"}
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
            </div>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="rounded-[36px] border border-fh-linen bg-fh-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                Pilot growth priorities
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-semibold tracking-[-0.03em] text-fh-graphite sm:text-4xl">
                Built to grow carefully, not loudly
              </h2>
              <p className="mt-4 text-base leading-8 text-fh-stone">
                FuseHarbor is focused on proving a practical Maryland-first
                model before expanding wider: real homeowner demand, serious
                professional participation, and a smoother quote experience for
                clean home upgrades.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {growthPriorities.map((priority) => (
                <div
                  key={priority}
                  className="flex items-start gap-3 rounded-[22px] border border-fh-linen bg-fh-warm-white px-5 py-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-fh-copper"
                  />
                  <p className="text-sm font-semibold leading-6 text-fh-graphite">
                    {priority}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <PublicLaunchNote
          title="Maryland-first quote intake, trust-led rollout"
          description="FuseHarbor is being launched carefully as an early-stage home electrification marketplace. The quote flow is designed to make the first homeowner step clearer while the pro network, support process, and platform operations continue to mature."
        />
      </section>

      <SiteFooter />
    </main>
  );
}