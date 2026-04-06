import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: "FuseHarbor",
    short_name: "FuseHarbor",
    description:
      "Premium Home Electrification Marketplace connecting homeowners with vetted pros for EV chargers, panel upgrades, heat pumps, and battery backup power.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2eb",
    theme_color: "#111827",
    icons: [
      {
        src: `${siteUrl}/favicon.ico`,
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}