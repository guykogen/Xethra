"use client";

import Link from "next/link";
import { LogoMark } from "./LogoMark";
import { analytics } from "@/lib/analytics";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  location?: "nav" | "footer";
}

const sizes = {
  sm: { icon: 44, text: "text-xl", gap: "gap-3" },
  md: { icon: 52, text: "text-2xl", gap: "gap-3.5" },
  lg: { icon: 60, text: "text-3xl", gap: "gap-4" },
};

export function Logo({ size = "md", showWordmark = true, location = "nav" }: LogoProps) {
  const s = sizes[size];
  return (
    <Link
      href="/"
      onClick={() => analytics.logoClick(location)}
      className={`flex items-center ${s.gap} group flex-shrink-0`}
    >
      <div className="relative flex-shrink-0">
        <div className="absolute -inset-2 bg-primary/40 blur-lg rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="relative rounded-2xl shadow-xl shadow-primary/40 ring-2 ring-white/20 group-hover:ring-primary/50 transition-all">
          <LogoMark size={s.icon} className="rounded-2xl" />
        </div>
      </div>
      {showWordmark && (
        <span className={`font-display font-bold tracking-tight ${s.text}`}>
          Xe<span className="text-primary-light">thra</span>
        </span>
      )}
    </Link>
  );
}
