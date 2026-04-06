import type { Metadata } from "next";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | FuseHarbor Admin",
  },
  description: "Internal FuseHarbor admin interface.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}