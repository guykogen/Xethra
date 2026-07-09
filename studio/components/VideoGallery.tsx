"use client";

import { useState } from "react";
import { Download, Play, X, Clock, Film, Loader2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import type { GenerationJob } from "@/types";
import { getModel } from "@/lib/models";

interface VideoGalleryProps {
  jobs: GenerationJob[];
  loading?: boolean;
}

type Filter = "all" | "succeeded" | "running" | "failed";

export function VideoGallery({ jobs, loading }: VideoGalleryProps) {
  const [selected, setSelected] = useState<GenerationJob | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = jobs.filter((j) => {
    if (filter === "all") return true;
    if (filter === "succeeded") return j.status === "succeeded";
    if (filter === "running")
      return j.status === "pending" || j.status === "running";
    return j.status === "failed" || j.status === "cancelled";
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-text-muted">Loading history…</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
          <Film className="w-8 h-8 text-text-dim" />
        </div>
        <p className="text-text-muted font-medium">No videos yet</p>
        <p className="text-sm text-text-dim">
          Go to Studio and generate your first video
        </p>
      </div>
    );
  }

  const counts = {
    all: jobs.length,
    succeeded: jobs.filter((j) => j.status === "succeeded").length,
    running: jobs.filter(
      (j) => j.status === "pending" || j.status === "running"
    ).length,
    failed: jobs.filter(
      (j) => j.status === "failed" || j.status === "cancelled"
    ).length,
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-lg font-semibold text-text">
            All Generations
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({filtered.length})
            </span>
          </h2>

          <div className="flex gap-2 flex-wrap">
            {(
              [
                ["all", "All"],
                ["succeeded", "Done"],
                ["running", "In progress"],
                ["failed", "Failed"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={clsx(
                  "text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors",
                  filter === key
                    ? "bg-primary text-white border-primary"
                    : "border-border text-text-dim hover:text-text"
                )}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-text-dim text-center py-12">
            No items in this filter
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((job) => (
              <VideoCard
                key={job.id}
                job={job}
                onSelect={() => setSelected(job)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Lightbox job={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function VideoCard({
  job,
  onSelect,
}: {
  job: GenerationJob;
  onSelect: () => void;
}) {
  const aspectClass =
    job.ratio === "9:16"
      ? "aspect-[9/16]"
      : job.ratio === "1:1"
      ? "aspect-square"
      : "aspect-video";

  const isRunning = job.status === "pending" || job.status === "running";
  const isFailed = job.status === "failed" || job.status === "cancelled";

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer bg-surface rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-150 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className={clsx("relative bg-bg overflow-hidden", aspectClass)}>
        {job.videoUrl ? (
          <>
            <video
              src={job.videoUrl}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </>
        ) : isRunning ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-[10px] text-text-dim">Generating…</span>
          </div>
        ) : isFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-2">
            <AlertCircle className="w-6 h-6 text-error/70" />
            <span className="text-[10px] text-error/80 text-center line-clamp-2">
              {job.error || "Failed"}
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-6 h-6 text-text-dim" />
          </div>
        )}

        {job.source === "agent" && (
          <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/90 text-white">
            Agent
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
          {job.prompt}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <StatusDot status={job.status} />
          <span className="text-[10px] text-text-dim">{job.ratio}</span>
          <span className="text-[10px] text-text-dim">{job.duration}s</span>
          <span className="text-[10px] text-text-dim ml-auto">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: GenerationJob["status"] }) {
  const color =
    status === "succeeded"
      ? "bg-success"
      : status === "failed" || status === "cancelled"
      ? "bg-error"
      : "bg-warning animate-pulse";

  return <span className={clsx("w-1.5 h-1.5 rounded-full", color)} />;
}

function Lightbox({
  job,
  onClose,
}: {
  job: GenerationJob;
  onClose: () => void;
}) {
  const config = getModel(job.model);

  function handleDownload() {
    if (!job.videoUrl) return;
    const a = document.createElement("a");
    a.href = job.videoUrl;
    a.download = `xethra-${job.id}.mp4`;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-surface rounded-2xl border border-border overflow-hidden shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <p className="text-sm font-medium text-text truncate pr-4">
            {job.prompt}
          </p>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-elevated flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className="bg-bg"
          style={{
            aspectRatio:
              job.ratio === "9:16"
                ? "9/16"
                : job.ratio === "1:1"
                ? "1/1"
                : "16/9",
            maxHeight: "70vh",
          }}
        >
          {job.videoUrl ? (
            <video
              src={job.videoUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-xs text-text-dim flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(job.createdAt).toLocaleString()}
            </span>
            <span>{config.shortLabel}</span>
            <span>{job.ratio}</span>
            <span>{job.resolution}</span>
            <span>{job.duration}s</span>
            <span className="capitalize">{job.status}</span>
            {job.taskId && (
              <span className="font-mono text-[10px]">{job.taskId}</span>
            )}
          </div>
          {job.videoUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
