import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Learn how FuseHarbor currently handles homeowner quote requests, early pro interest submissions, and related website data during its pre-launch and launch-readiness stage.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy | FuseHarbor",
    description:
      "Learn how FuseHarbor currently handles homeowner quote requests, early pro interest submissions, and related website data during its pre-launch and launch-readiness stage.",
    url: "/privacy",
  },
  twitter: {
    title: "Privacy | FuseHarbor",
    description:
      "Learn how FuseHarbor currently handles homeowner quote requests, early pro interest submissions, and related website data during its pre-launch and launch-readiness stage.",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}