import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Read the current terms of website use for FuseHarbor during its pre-launch and launch-readiness stage, including expectations around intake forms, public site use, and platform changes.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms | FuseHarbor",
    description:
      "Read the current terms of website use for FuseHarbor during its pre-launch and launch-readiness stage, including expectations around intake forms, public site use, and platform changes.",
    url: "/terms",
  },
  twitter: {
    title: "Terms | FuseHarbor",
    description:
      "Read the current terms of website use for FuseHarbor during its pre-launch and launch-readiness stage, including expectations around intake forms, public site use, and platform changes.",
  },
};

export default function TermsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}