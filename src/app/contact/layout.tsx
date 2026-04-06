import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Use FuseHarbor’s general contact page for public-facing homeowner and professional inquiries during the platform’s pre-launch and launch-readiness stage.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | FuseHarbor",
    description:
      "Use FuseHarbor’s general contact page for public-facing homeowner and professional inquiries during the platform’s pre-launch and launch-readiness stage.",
    url: "/contact",
  },
  twitter: {
    title: "Contact | FuseHarbor",
    description:
      "Use FuseHarbor’s general contact page for public-facing homeowner and professional inquiries during the platform’s pre-launch and launch-readiness stage.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}