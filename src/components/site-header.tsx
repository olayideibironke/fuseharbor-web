"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/for-pros", label: "For Pros" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  function isActiveLink(href: string) {
    if (href === "/for-pros") {
      return pathname === "/for-pros";
    }

    if (href.startsWith("/#")) {
      return pathname === "/";
    }

    return pathname === href;
  }

  return (
    <header className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
      <div className="rounded-[28px] border border-fh-linen bg-fh-white/90 px-5 py-4 shadow-[0_10px_30px_rgba(35,38,43,0.06)] backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-0">
            <BrandMark size="md" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition ${
                    active
                      ? "text-fh-graphite"
                      : "text-fh-stone hover:text-fh-graphite"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center md:flex">
            <Link
              href="/get-a-quote"
              className="inline-flex items-center gap-2 rounded-full bg-fh-copper px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
            >
              Get a Quote
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-fh-linen bg-fh-white text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper md:hidden"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-4 border-t border-fh-linen pt-4 md:hidden">
            <nav className="grid gap-2">
              {navItems.map((item) => {
                const active = isActiveLink(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-[18px] px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-fh-warm-white text-fh-graphite"
                        : "text-fh-stone hover:bg-fh-warm-white hover:text-fh-graphite"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/get-a-quote"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-fh-copper px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                Get a Quote
                <ArrowRight size={16} />
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}