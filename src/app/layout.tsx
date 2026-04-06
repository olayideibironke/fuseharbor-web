import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { getSiteUrl, getSiteUrlObject } from "@/lib/site-url";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const metadataBase = getSiteUrlObject();

export const metadata: Metadata = {
  metadataBase,
  applicationName: "FuseHarbor",
  title: {
    default: "FuseHarbor | Premium Home Electrification Marketplace",
    template: "%s | FuseHarbor",
  },
  description:
    "Trusted home electrification, done right. FuseHarbor connects homeowners with vetted pros for EV chargers, panel upgrades, heat pumps, and modern energy upgrades.",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/icon",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/icon",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FuseHarbor",
    url: "/",
    title: "FuseHarbor | Premium Home Electrification Marketplace",
    description:
      "Trusted home electrification, done right. FuseHarbor connects homeowners with vetted pros for EV chargers, panel upgrades, heat pumps, and modern energy upgrades.",
  },
  twitter: {
    card: "summary",
    title: "FuseHarbor | Premium Home Electrification Marketplace",
    description:
      "Trusted home electrification, done right. FuseHarbor connects homeowners with vetted pros for EV chargers, panel upgrades, heat pumps, and modern energy upgrades.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "FuseHarbor",
      url: siteUrl,
      description:
        "Premium Home Electrification Marketplace connecting homeowners with vetted pros for EV chargers, panel upgrades, heat pumps, and battery backup power.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "FuseHarbor",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      description:
        "Trusted home electrification, done right. FuseHarbor connects homeowners with vetted pros for EV chargers, panel upgrades, heat pumps, and modern energy upgrades.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/get-a-quote`,
        "query-input": "required name=project",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {children}
      </body>
    </html>
  );
}