import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { mapBytePlusStatus } from "@/lib/jobs";
import { loadStore, saveStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Backfill a known BytePlus task into the store (one-time recovery) */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { taskId, prompt, model, ratio, resolution, duration, mode, imageUrl } =
    body;

  if (!taskId) {
    return NextResponse.json({ error: "taskId required" }, { status: 400 });
  }

  const store = await loadStore();
  const existing = store.jobs.find((j) => j.taskId === taskId);
  if (existing) {
    return NextResponse.json({ job: existing, existed: true });
  }

  const patch = await mapBytePlusStatus(taskId);
  const now = new Date().toISOString();
  const job = {
    id: `job-backfill-${taskId}`,
    taskId,
    status: patch.status,
    prompt: prompt || "Backfilled generation",
    model: model || "seedance-1-0-pro-fast-251015",
    mode: mode || "image",
    ratio: ratio || "9:16",
    resolution: resolution || "720p",
    duration: duration || 5,
    generateAudio: false,
    imageUrl,
    source: "studio" as const,
    videoUrl: patch.videoUrl,
    error: patch.error,
    createdAt: now,
    updatedAt: now,
    completedAt: patch.completedAt,
  };

  store.jobs.unshift(job);
  await saveStore(store);

  return NextResponse.json({ job, existed: false });
}
