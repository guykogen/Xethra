"use client";

import { clsx } from "clsx";
import {
  Bot,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import type { ActivityLog } from "@/types";

interface ActivityLogPanelProps {
  logs: ActivityLog[];
  loading?: boolean;
}

export function ActivityLogPanel({ logs, loading }: ActivityLogPanelProps) {
  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-8 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-text-muted mt-4">Loading activity…</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
          <Terminal className="w-8 h-8 text-text-dim" />
        </div>
        <p className="text-text-muted font-medium">No activity yet</p>
        <p className="text-sm text-text-dim">
          Generation logs from Studio and the agent will appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text">
          Activity Log
          <span className="ml-2 text-sm font-normal text-text-muted">
            ({logs.length})
          </span>
        </h2>
        <p className="text-xs text-text-dim">Auto-refreshes every 5s</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border divide-y divide-border/60 overflow-hidden">
        {logs.map((log) => (
          <LogRow key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
}

function LogRow({ log }: { log: ActivityLog }) {
  const Icon =
    log.level === "success"
      ? CheckCircle2
      : log.level === "error"
      ? AlertCircle
      : log.level === "warn"
      ? AlertTriangle
      : Info;

  const color =
    log.level === "success"
      ? "text-success"
      : log.level === "error"
      ? "text-error"
      : log.level === "warn"
      ? "text-warning"
      : "text-primary-light";

  return (
    <div className="px-4 py-3 flex items-start gap-3 hover:bg-elevated/40 transition-colors">
      <Icon className={clsx("w-4 h-4 mt-0.5 flex-shrink-0", color)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text leading-relaxed">{log.message}</p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-[11px] text-text-dim">
            {new Date(log.timestamp).toLocaleString()}
          </span>
          <SourceBadge source={log.source} />
          {log.jobId && (
            <span className="text-[11px] text-text-dim font-mono">
              {log.jobId}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: ActivityLog["source"] }) {
  if (source === "agent") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
        <Bot className="w-3 h-3" />
        Agent
      </span>
    );
  }
  if (source === "studio") {
    return (
      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-elevated text-text-muted border border-border">
        Studio
      </span>
    );
  }
  return (
    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-elevated text-text-dim border border-border">
      System
    </span>
  );
}
