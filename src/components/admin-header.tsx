"use client";

import { ArrowRight, LayoutDashboard, LockKeyhole, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/pros", label: "Pros" },
];

export function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
      <div className="rounded-[28px] border border-fh-linen bg-white/90 shadow-[0_10px_30px_rgba(35,38,43,0.06)] backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/admin"
            className="flex min-w-0 items-center gap-3"
            onClick={closeMobileMenu}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fh-graphite text-fh-white">
              <LockKeyhole size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-manrope)] text-base font-semibold tracking-tight sm:text-lg">
                FuseHarbor Admin
              </p>
              <p className="truncate text-[11px] text-fh-stone sm:text-xs">
                Internal Operations Workspace
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-fh-stone md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-fh-graphite"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-fh-graphite px-5 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
            >
              <LayoutDashboard size={16} />
              Admin Home
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-fh-linen bg-fh-warm-white text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper md:hidden"
            aria-label={isMobileMenuOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-fh-linen px-5 pb-5 pt-4 md:hidden">
            <div className="grid gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-[18px] border border-fh-linen bg-fh-warm-white px-4 py-3 text-sm font-semibold text-fh-graphite transition hover:border-fh-copper hover:text-fh-copper"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-fh-graphite px-4 py-3 text-sm font-semibold text-fh-white transition hover:opacity-95"
              >
                <LayoutDashboard size={16} />
                Admin Home
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}