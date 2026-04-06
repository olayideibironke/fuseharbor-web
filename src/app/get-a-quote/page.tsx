"use client";

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
    title: "A guided first step",
    description:
      "FuseHarbor is designed to make homeowner intake feel cleaner and less overwhelming than generic contractor forms.",
  },
  {
    title: "Trust-first project review",
    description:
      "Your details are organized into a clearer internal workflow so the project can be reviewed more thoughtfully.",
  },
  {
    title: "Premium homeowner experience",
    description:
      "The goal is to help serious homeowners feel supported, informed, and confident before moving forward.",
  },
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

export default function GetAQuotePage() {
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

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
            Get a quote
          </p>

          <div className="mt-4 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div>
              <h1 className="max-w-4xl font-[family-name:var(--font-manrope)] text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Start your electrification project with more clarity and trust
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-fh-stone">
                FuseHarbor is designed to make the first homeowner step feel
                cleaner, calmer, and more premium than a generic contractor
                request form.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
                  <ShieldCheck size={16} className="text-fh-copper" />
                  Structured intake
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
                  <CheckCircle2 size={16} className="text-fh-copper" />
                  Premium homeowner flow
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-fh-linen bg-fh-white px-4 py-2 text-sm font-semibold text-fh-graphite shadow-sm">
                  <Zap size={16} className="text-fh-copper" />
                  Electrification-focused
                </div>
              </div>
            </div>

            <div className="rounded-[36px] border border-fh-sand bg-[linear-gradient(135deg,_#f2ebe1_0%,_#e7d9c8_100%)] p-8 shadow-sm lg:p-10">
              <p className="text-sm font-semibold tracking-[0.2em] text-fh-copper uppercase">
                What to expect
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-semibold text-fh-graphite">
                A better first step for serious home upgrades
              </h2>
              <p className="mt-4 text-base leading-7 text-fh-stone">
                FuseHarbor is being built to make homeowner intake feel more
                thoughtful from the beginning, especially for EV charging,
                panels, heat pumps, and backup power projects.
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

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <PublicLaunchNote
          title="Maryland-first quote intake, premium rollout"
          description="FuseHarbor is being launched carefully with a trust-led, quality-first approach. The homeowner quote flow is designed to feel clearer, calmer, and more premium while the marketplace continues becoming more polished and launch-ready."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
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
                Choose the service that best matches what you are planning for
                your home.
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
                The summary updates live as the homeowner fills out the quote
                request.
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
                  request.
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

      <SiteFooter />
    </main>
  );
}