"use client";

import { useState, useCallback, useEffect } from "react";
import { Header, type StudioTab } from "./Header";
import { GeneratePanel } from "./GeneratePanel";
import { VideoGallery } from "./VideoGallery";
import { ActivityLogPanel } from "./ActivityLogPanel";
import { AgentChat } from "./AgentChat";
import { AssetLibrary } from "./AssetLibrary";
import type { ActivityLog, GenerationJob, GenerationRequest, LibraryAsset } from "@/types";
import { getModel } from "@/lib/models";

type Tab = StudioTab;

export function StudioClient() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("agent");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [jobsRes, logsRes, assetsRes] = await Promise.all([
        fetch("/api/jobs?sync=1", { cache: "no-store" }),
        fetch("/api/logs", { cache: "no-store" }),
        fetch("/api/assets", { cache: "no-store" }),
      ]);

      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data.jobs || []);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      }
      if (assetsRes.ok) {
        const data = await assetsRes.json();
        setAssets(data.assets || []);
      }
    } catch {
      // Transient network errors — keep last known state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function handleGenerate(req: GenerationRequest) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Generation failed");
    }

    const { job } = await res.json();
    if (job) {
      setJobs((prev) => [job, ...prev.filter((j) => j.id !== job.id)]);
    }
    await refresh();
  }

  const activeJobs = jobs.filter(
    (j) => j.status === "pending" || j.status === "running"
  );
  const completedJobs = jobs.filter((j) => j.status === "succeeded");
  const failedJobs = jobs.filter(
    (j) => j.status === "failed" || j.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={activeJobs.length}
        logCount={logs.length}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {activeTab === "studio" ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="space-y-6">
              <GeneratePanel onGenerate={handleGenerate} />

              {activeJobs.length > 0 && (
                <ActiveJobsSection jobs={activeJobs} />
              )}

              {failedJobs.length > 0 && (
                <FailedSection jobs={failedJobs} />
              )}

              {/* Mini activity feed on Studio */}
              {logs.length > 0 && (
                <RecentActivity logs={logs.slice(0, 5)} />
              )}
            </div>

            {completedJobs.length > 0 && (
              <div className="xl:sticky xl:top-24">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                  Latest Video
                </h2>
                <LatestVideoCard job={completedJobs[0]} />
              </div>
            )}
          </div>
        ) : activeTab === "agent" ? (
          <AgentChat assets={assets} onRefresh={refresh} />
        ) : activeTab === "library" ? (
          <AssetLibrary assets={assets} loading={loading} onRefresh={refresh} />
        ) : activeTab === "history" ? (
          <VideoGallery jobs={jobs} loading={loading} />
        ) : (
          <ActivityLogPanel logs={logs} loading={loading} />
        )}
      </main>
    </div>
  );
}

function RecentActivity({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Recent Activity
      </h3>
      <div className="space-y-2">
        {logs.map((log) => (
          <p key={log.id} className="text-xs text-text-dim truncate">
            <span className="text-text-muted">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            {" · "}
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
}

function ActiveJobsSection({ jobs }: { jobs: GenerationJob[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Generating ({jobs.length})
      </h3>
      <div className="space-y-3">
        {jobs.map((job) => (
          <ActiveJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function ActiveJobCard({ job }: { job: GenerationJob }) {
  return (
    <div className="bg-elevated rounded-xl p-4 border border-border/50 flex items-start gap-4">
      <div className="relative mt-1 flex-shrink-0">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text font-medium truncate">{job.prompt}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-xs text-text-dim">
            {job.status === "pending" ? "Queued…" : "Generating…"}
          </span>
          <ModelBadge model={job.model} />
          <span className="text-xs text-text-dim">
            {job.ratio} · {job.resolution} · {job.duration}s
          </span>
          {job.source === "agent" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Agent
            </span>
          )}
          {job.taskId && (
            <span className="text-[10px] text-text-dim font-mono truncate max-w-[140px]">
              {job.taskId}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function FailedSection({ jobs }: { jobs: GenerationJob[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-error/20 p-5">
      <h3 className="text-sm font-semibold text-error/70 uppercase tracking-wider mb-4">
        Failed ({jobs.length})
      </h3>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-elevated rounded-xl p-4 border border-error/20"
          >
            <p className="text-sm text-text font-medium truncate">{job.prompt}</p>
            <p className="text-xs text-error mt-1">{job.error}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestVideoCard({ job }: { job: GenerationJob }) {
  async function handleDownload() {
    if (!job.videoUrl) return;
    const a = document.createElement("a");
    a.href = job.videoUrl;
    a.download = `xethra-${job.id}.mp4`;
    a.click();
  }

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div
        className="relative bg-bg"
        style={{
          aspectRatio:
            job.ratio === "9:16"
              ? "9/16"
              : job.ratio === "1:1"
              ? "1/1"
              : "16/9",
        }}
      >
        {job.videoUrl ? (
          <video
            src={job.videoUrl}
            controls
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-text font-medium line-clamp-2 mb-3">
          {job.prompt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ModelBadge model={job.model} />
            <span className="text-xs text-text-dim">{job.duration}s</span>
          </div>
          {job.videoUrl && (
            <button
              onClick={handleDownload}
              className="text-xs text-primary hover:text-primary-light font-medium"
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ModelBadge({ model }: { model: string }) {
  const config = getModel(model as GenerationJob["model"]);
  const isFast = config.tier === "fast";

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
        config.face
          ? "bg-warning/10 text-warning border-warning/30"
          : isFast
          ? "bg-primary/10 text-primary-light border-primary/20"
          : "bg-primary/15 text-primary border-primary/30"
      }`}
    >
      {config.shortLabel}
    </span>
  );
}
