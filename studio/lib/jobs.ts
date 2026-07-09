import { randomUUID } from "crypto";
import { ingestJobToLibrary } from "@/lib/assets";
import { getVideoTask } from "@/lib/byteplus";
import { loadStore, saveStore, sortJobs, trimLogs, withStore } from "@/lib/store";
import type {
  ActivityLog,
  ActivityLevel,
  ActivitySource,
  GenerationJob,
  GenerationRequest,
  TaskStatus,
  XethraStore,
} from "@/types";

function now() {
  return new Date().toISOString();
}

export function createJobId() {
  return `job-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export function createLogId() {
  return `log-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export function appendLog(
  store: XethraStore,
  input: {
    level: ActivityLevel;
    message: string;
    source: ActivitySource;
    jobId?: string;
    meta?: Record<string, unknown>;
  }
) {
  const entry: ActivityLog = {
    id: createLogId(),
    timestamp: now(),
    ...input,
  };
  store.logs = trimLogs([entry, ...store.logs]);
  return entry;
}

export function upsertJob(store: XethraStore, job: GenerationJob) {
  const idx = store.jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) store.jobs[idx] = job;
  else store.jobs.unshift(job);
  store.jobs = sortJobs(store.jobs);
}

export function buildJobFromRequest(
  req: GenerationRequest,
  source: ActivitySource,
  extras?: Partial<GenerationJob>
): GenerationJob {
  return {
    id: createJobId(),
    taskId: "",
    status: "pending",
    prompt: req.prompt,
    model: req.model,
    mode: req.mode,
    ratio: req.ratio,
    resolution: req.resolution,
    duration: req.duration,
    generateAudio: req.generateAudio,
    imageUrl: req.imageUrl,
    source,
    createdAt: now(),
    updatedAt: now(),
    ...extras,
  };
}

export async function mapBytePlusStatus(
  taskId: string
): Promise<Pick<GenerationJob, "status" | "videoUrl" | "error" | "completedAt">> {
  const data = await getVideoTask(taskId);
  const status = data.status?.toLowerCase();

  if (status === "succeeded" || status === "success") {
    return {
      status: "succeeded",
      videoUrl: data.content?.video_url,
      completedAt: now(),
    };
  }

  if (status === "failed" || status === "error") {
    return {
      status: "failed",
      error: data.error?.message || "Generation failed",
      completedAt: now(),
    };
  }

  if (status === "cancelled") {
    return { status: "cancelled", completedAt: now() };
  }

  return { status: "running" };
}

export async function syncRunningJobs(): Promise<{
  updated: number;
  jobs: GenerationJob[];
}> {
  const store = await loadStore();
  let updated = 0;

  for (const job of store.jobs) {
    if (job.status !== "pending" && job.status !== "running") continue;
    if (!job.taskId) continue;

    try {
      const patch = await mapBytePlusStatus(job.taskId);
      const nextStatus = patch.status;
      if (nextStatus === job.status && !patch.videoUrl && !patch.error) continue;

      Object.assign(job, patch, { updatedAt: now() });
      updated += 1;

      if (nextStatus === "succeeded") {
        ingestJobToLibrary(store, job);
        appendLog(store, {
          level: "success",
          source: job.source,
          jobId: job.id,
          message: `Video ready: ${job.prompt.slice(0, 80)}`,
          meta: { taskId: job.taskId },
        });
      } else if (nextStatus === "failed") {
        appendLog(store, {
          level: "error",
          source: job.source,
          jobId: job.id,
          message: `Generation failed: ${patch.error || "Unknown error"}`,
          meta: { taskId: job.taskId },
        });
      }
    } catch (err) {
      appendLog(store, {
        level: "warn",
        source: "system",
        jobId: job.id,
        message: `Poll error for ${job.taskId}: ${
          err instanceof Error ? err.message : "unknown"
        }`,
      });
    }
  }

  await saveStore(store);
  return { updated, jobs: sortJobs(store.jobs) };
}

export async function getJobs() {
  const store = await loadStore();
  return sortJobs(store.jobs);
}

export async function getLogs(limit = 200) {
  const store = await loadStore();
  return store.logs.slice(0, limit);
}

export async function updateJob(
  id: string,
  patch: Partial<GenerationJob>,
  log?: { level: ActivityLevel; message: string; source: ActivitySource }
) {
  return withStore(async (store) => {
    const job = store.jobs.find((j) => j.id === id);
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: now() });
    if (log) appendLog(store, { ...log, jobId: id });
    return job;
  });
}
