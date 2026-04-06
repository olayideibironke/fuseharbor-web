import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "For Pros",
  description:
    "Join FuseHarbor as a pro for premium home electrification opportunities across EV chargers, panel upgrades, heat pumps, and battery backup projects.",
  alternates: {
    canonical: "/for-pros",
  },
  openGraph: {
    title: "For Pros | FuseHarbor",
    description:
      "Join FuseHarbor as a pro for premium home electrification opportunities across EV chargers, panel upgrades, heat pumps, and battery backup projects.",
    url: "/for-pros",
  },
  twitter: {
    title: "For Pros | FuseHarbor",
    description:
      "Join FuseHarbor as a pro for premium home electrification opportunities across EV chargers, panel upgrades, heat pumps, and battery backup projects.",
  },
};

export default function ForProsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}