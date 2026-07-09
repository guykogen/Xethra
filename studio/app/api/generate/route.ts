import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { createVideoTask } from "@/lib/byteplus";
import {
  appendLog,
  buildJobFromRequest,
  upsertJob,
} from "@/lib/jobs";
import { loadStore, saveStore } from "@/lib/store";
import type { GenerationRequest } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: GenerationRequest = await req.json();

    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const source = auth.source === "agent" ? "agent" : "studio";
    const store = await loadStore();
    const job = buildJobFromRequest(body, source, {
      campaignLabel: body.campaignLabel,
    });

    appendLog(store, {
      level: "info",
      source,
      jobId: job.id,
      message: `Queued: ${body.prompt.slice(0, 100)}`,
      meta: {
        model: body.model,
        ratio: body.ratio,
        resolution: body.resolution,
        duration: body.duration,
      },
    });

    upsertJob(store, job);
    await saveStore(store);

    try {
      const { taskId } = await createVideoTask(body);

      job.taskId = taskId;
      job.status = "running";
      job.updatedAt = new Date().toISOString();

      appendLog(store, {
        level: "info",
        source,
        jobId: job.id,
        message: `BytePlus task started (${taskId})`,
        meta: { taskId },
      });

      upsertJob(store, job);
      await saveStore(store);

      return NextResponse.json({ jobId: job.id, taskId, job });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      job.status = "failed";
      job.error = message;
      job.updatedAt = new Date().toISOString();
      appendLog(store, {
        level: "error",
        source,
        jobId: job.id,
        message: `Failed to start: ${message}`,
      });
      upsertJob(store, job);
      await saveStore(store);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
