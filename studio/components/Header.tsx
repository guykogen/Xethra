"use client";

import { signOut } from "next-auth/react";
import { LogOut, Film, Clock, Terminal, Bot, FolderOpen } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "@/components/marketing/Logo";

export type StudioTab = "studio" | "agent" | "library" | "history" | "activity";

interface HeaderProps {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  activeCount: number;
  logCount?: number;
}

export function Header({
  activeTab,
  onTabChange,
  activeCount,
  logCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo size="sm" />

        <nav className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-border/60 overflow-x-auto max-w-[70vw]">
          <NavButton
            icon={<Film className="w-4 h-4" />}
            label="Studio"
            active={activeTab === "studio"}
            onClick={() => onTabChange("studio")}
            badge={activeCount > 0 ? activeCount : undefined}
          />
          <NavButton
            icon={<Bot className="w-4 h-4" />}
            label="Agent"
            active={activeTab === "agent"}
            onClick={() => onTabChange("agent")}
          />
          <NavButton
            icon={<FolderOpen className="w-4 h-4" />}
            label="Library"
            active={activeTab === "library"}
            onClick={() => onTabChange("library")}
          />
          <NavButton
            icon={<Clock className="w-4 h-4" />}
            label="History"
            active={activeTab === "history"}
            onClick={() => onTabChange("history")}
          />
          <NavButton
            icon={<Terminal className="w-4 h-4" />}
            label="Activity"
            active={activeTab === "activity"}
            onClick={() => onTabChange("activity")}
            badge={logCount && logCount > 0 ? undefined : undefined}
          />
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative whitespace-nowrap",
        active
          ? "bg-primary text-white"
          : "text-text-muted hover:text-text hover:bg-elevated"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warning text-bg text-[10px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
