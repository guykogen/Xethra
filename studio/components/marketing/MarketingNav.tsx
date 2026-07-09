"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { analytics } from "@/lib/analytics";

const links = [
  { href: "#modes", label: "Modes" },
  { href: "#models", label: "Models" },
  { href: "#pricing", label: "Pricing" },
  { href: "#studio", label: "Studio" },
  { href: "#access", label: "Get Access" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-bg/70 backdrop-blur-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Logo size="sm" />

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => analytics.navClick(l.label, "desktop")}
                className="px-3.5 py-2 text-sm text-text-muted hover:text-text rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => analytics.ctaClick("Sign in", "nav")}
              className="text-sm text-text-muted hover:text-text px-3 py-2 transition-colors"
            >
              Sign in
            </Link>
            <a
              href="#access"
              onClick={() => analytics.ctaClick("Request API Access", "nav")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              Request API Access
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <button
            className="md:hidden p-2 text-text-muted"
            onClick={() => {
              analytics.mobileMenuToggle(open ? "close" : "open");
              setOpen(!open);
            }}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl border border-border bg-surface p-4 animate-fade-in">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  analytics.navClick(l.label, "mobile");
                  setOpen(false);
                }}
                className="block py-3 text-sm text-text-muted hover:text-text border-b border-border/50 last:border-0"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => analytics.ctaClick("Sign in", "nav_mobile")}
                className="text-center py-2.5 text-sm text-text-muted"
              >
                Sign in
              </Link>
              <a
                href="#access"
                onClick={() => {
                  analytics.ctaClick("Request API Access", "nav_mobile");
                  setOpen(false);
                }}
                className="text-center bg-primary text-white text-sm font-semibold py-3 rounded-xl"
              >
                Request API Access
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
