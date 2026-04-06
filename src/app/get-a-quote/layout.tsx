import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Start your FuseHarbor quote request for EV chargers, panel upgrades, heat pumps, and battery backup power with a cleaner, homeowner-first intake experience.",
  alternates: {
    canonical: "/get-a-quote",
  },
  openGraph: {
    title: "Get a Quote | FuseHarbor",
    description:
      "Start your FuseHarbor quote request for EV chargers, panel upgrades, heat pumps, and battery backup power with a cleaner, homeowner-first intake experience.",
    url: "/get-a-quote",
  },
  twitter: {
    title: "Get a Quote | FuseHarbor",
    description:
      "Start your FuseHarbor quote request for EV chargers, panel upgrades, heat pumps, and battery backup power with a cleaner, homeowner-first intake experience.",
  },
};

export default function GetAQuoteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}