import { randomUUID } from "crypto";
import { createVideoTask } from "@/lib/byteplus";
import {
  getAssets,
  librarySummaryForAgent,
  resolveAssetMentions,
} from "@/lib/assets";
import { chatWithGemini, generateImage, persistImage } from "@/lib/gemini";
import { AGENT_SYSTEM_PROMPT } from "@/lib/izop-brand";
import {
  appendLog,
  buildJobFromRequest,
  createJobId,
  upsertJob,
} from "@/lib/jobs";
import { loadStore, saveStore } from "@/lib/store";
import type {
  AgentMessage,
  AgentSession,
  AspectRatio,
  AssetTag,
  GenerationRequest,
  ImageGenerationRequest,
  LibraryAsset,
  VideoModel,
  XethraStore,
} from "@/types";

function now() {
  return new Date().toISOString();
}

export function createSessionId() {
  return `session-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export function createMessageId() {
  return `msg-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

interface AgentAction {
  type: "generate_image" | "generate_video" | "extend_video" | "list_library";
  prompt?: string;
  name?: string;
  aspectRatio?: AspectRatio | "4:5";
  resolution?: "1K" | "2K" | "4K";
  duration?: 5 | 10;
  model?: VideoModel;
  imageAssetId?: string;
  parentAssetId?: string;
  parentJobId?: string;
  tags?: AssetTag[];
  search?: string;
}

interface AgentPlan {
  reply: string;
  actions: AgentAction[];
}

function parsePlan(raw: string): AgentPlan {
  try {
    const parsed = JSON.parse(raw) as AgentPlan;
    return {
      reply: parsed.reply || "Done.",
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    };
  } catch {
    return { reply: raw, actions: [] };
  }
}

async function executeImageAction(
  store: XethraStore,
  action: AgentAction,
  mentionAssets: LibraryAsset[]
): Promise<{ asset: LibraryAsset; message: string }> {
  const refIds = action.imageAssetId
    ? [action.imageAssetId]
    : mentionAssets.map((a) => a.id);
  const refUrls: string[] = [];
  for (const id of refIds) {
    const asset = store.assets.find((a) => a.id === id);
    if (asset?.url) refUrls.push(asset.url);
  }

  const imageReq: ImageGenerationRequest = {
    prompt: action.prompt || "iZop AI branded social graphic",
    aspectRatio: action.aspectRatio || "1:1",
    resolution: action.resolution || "2K",
    tags: action.tags,
    name: action.name,
  };

  const { buffer, mimeType } = await generateImage(imageReq, refUrls);
  const url = await persistImage(
    buffer,
    mimeType,
    action.name || "izop-image"
  );

  const asset: LibraryAsset = {
    id: `asset-${Date.now()}-${randomUUID().slice(0, 8)}`,
    kind: "image",
    name: action.name || action.prompt?.slice(0, 50) || "Generated image",
    url,
    prompt: action.prompt,
    tags: action.tags || ["brand"],
    mimeType,
    source: "agent",
    createdAt: now(),
    updatedAt: now(),
  };

  const idx = store.assets.findIndex((a) => a.id === asset.id);
  if (idx >= 0) store.assets[idx] = asset;
  else store.assets.unshift(asset);

  appendLog(store, {
    level: "success",
    source: "agent",
    message: `Image created: ${asset.name}`,
    meta: { assetId: asset.id },
  });

  return { asset, message: `Created image "${asset.name}"` };
}

async function executeVideoAction(
  store: XethraStore,
  action: AgentAction,
  opts: { extend?: boolean }
): Promise<{ jobId: string; message: string }> {
  const imageAssetId = action.imageAssetId || action.parentAssetId;
  let imageUrl: string | undefined;
  let parentAssetId: string | undefined;

  if (imageAssetId) {
    const asset = store.assets.find((a) => a.id === imageAssetId);
    if (asset) {
      imageUrl = asset.url;
      parentAssetId = asset.id;
    }
  }

  const req: GenerationRequest = {
    prompt: action.prompt || "Cinematic motion design for iZop AI",
    mode: imageUrl ? "image" : "text",
    model: action.model || "dreamina-seedance-2-0-260128",
    ratio: (action.aspectRatio === "4:5" ? "9:16" : action.aspectRatio) || "9:16",
    resolution: "720p",
    duration: action.duration || (opts.extend ? 10 : 5),
    generateAudio: false,
    imageUrl,
    imageRole: opts.extend ? "first_frame" : "first_frame",
    campaignLabel: action.name,
  };

  const job = buildJobFromRequest(req, "agent", {
    parentJobId: action.parentJobId,
    parentAssetId,
    campaignLabel: action.name,
  });

  upsertJob(store, job);
  appendLog(store, {
    level: "info",
    source: "agent",
    jobId: job.id,
    message: `Agent queued video: ${req.prompt.slice(0, 80)}`,
  });

  const { taskId } = await createVideoTask(req);
  job.taskId = taskId;
  job.status = "running";
  job.updatedAt = now();
  upsertJob(store, job);

  return {
    jobId: job.id,
    message: `Started video generation (${taskId})`,
  };
}

async function executeActions(
  store: XethraStore,
  actions: AgentAction[],
  mentionAssets: LibraryAsset[]
): Promise<{
  results: string[];
  assetIds: string[];
  jobIds: string[];
}> {
  const results: string[] = [];
  const assetIds: string[] = [];
  const jobIds: string[] = [];

  for (const action of actions) {
    if (action.type === "list_library") {
      const assets = await getAssets({ search: action.search });
      results.push(
        `Library (${assets.length}): ${assets
          .slice(0, 8)
          .map((a) => `${a.name} [${a.id}]`)
          .join(", ")}`
      );
      continue;
    }

    if (action.type === "generate_image") {
      const { asset, message } = await executeImageAction(
        store,
        action,
        mentionAssets
      );
      results.push(message);
      assetIds.push(asset.id);
      continue;
    }

    if (action.type === "generate_video") {
      const { jobId, message } = await executeVideoAction(store, action, {
        extend: false,
      });
      results.push(message);
      jobIds.push(jobId);
      continue;
    }

    if (action.type === "extend_video") {
      const { jobId, message } = await executeVideoAction(store, action, {
        extend: true,
      });
      results.push(message);
      jobIds.push(jobId);
      continue;
    }
  }

  return { results, assetIds, jobIds };
}

export async function runAgentChat(input: {
  message: string;
  sessionId?: string;
  assetIds?: string[];
}) {
  const store = await loadStore();
  const allAssets = store.assets;

  const { cleaned, assetIds: mentionedIds } = resolveAssetMentions(
    input.message,
    allAssets
  );
  const combinedAssetIds = [
    ...new Set([...(input.assetIds || []), ...mentionedIds]),
  ];
  const mentionAssets = allAssets.filter((a) =>
    combinedAssetIds.includes(a.id)
  );

  let session: AgentSession | undefined = input.sessionId
    ? store.agentSessions.find((s) => s.id === input.sessionId)
    : undefined;

  if (!session) {
    session = {
      id: createSessionId(),
      title: cleaned.slice(0, 60) || "New session",
      messages: [],
      createdAt: now(),
      updatedAt: now(),
    };
    store.agentSessions.unshift(session);
  }

  const userMsg: AgentMessage = {
    id: createMessageId(),
    role: "user",
    content: input.message,
    assetIds: combinedAssetIds.length ? combinedAssetIds : undefined,
    timestamp: now(),
  };
  session.messages.push(userMsg);

  const libraryCtx = librarySummaryForAgent(allAssets);
  const refBlock =
    mentionAssets.length > 0
      ? `\nReferenced assets:\n${JSON.stringify(
          mentionAssets.map((a) => ({
            id: a.id,
            name: a.name,
            kind: a.kind,
            url: a.url,
            prompt: a.prompt?.slice(0, 200),
          })),
          null,
          2
        )}`
      : "";

  const agentInput = `${cleaned || input.message}

Library (${libraryCtx.length} assets):
${JSON.stringify(libraryCtx, null, 2)}${refBlock}`;

  const history = session.messages
    .slice(-12, -1)
    .map((m) => ({ role: m.role, content: m.content }));

  let plan: AgentPlan;
  try {
    const raw = await chatWithGemini(AGENT_SYSTEM_PROMPT, agentInput, history);
    plan = parsePlan(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent error";
    plan = {
      reply: `I couldn't reach the AI planner (${message}). You can still use Studio and Library manually.`,
      actions: [],
    };
  }

  const { results, assetIds, jobIds } = await executeActions(
    store,
    plan.actions,
    mentionAssets
  );

  const assistantContent = [
    plan.reply,
    results.length ? `\n\n**Actions:**\n${results.map((r) => `• ${r}`).join("\n")}` : "",
  ].join("");

  const assistantMsg: AgentMessage = {
    id: createMessageId(),
    role: "assistant",
    content: assistantContent,
    assetIds: assetIds.length ? assetIds : undefined,
    jobIds: jobIds.length ? jobIds : undefined,
    timestamp: now(),
  };
  session.messages.push(assistantMsg);
  session.updatedAt = now();

  await saveStore(store);

  return {
    session,
    message: assistantMsg,
    assetIds,
    jobIds,
  };
}

export async function generateImageAsset(
  req: ImageGenerationRequest,
  source: "studio" | "agent" = "studio"
) {
  const store = await loadStore();
  const refUrls: string[] = [];

  if (req.referenceAssetIds?.length) {
    for (const id of req.referenceAssetIds) {
      const asset = store.assets.find((a) => a.id === id);
      if (asset?.url) refUrls.push(asset.url);
    }
  }

  const { buffer, mimeType } = await generateImage(req, refUrls);
  const url = await persistImage(buffer, mimeType, req.name || "image");

  const asset: LibraryAsset = {
    id: `asset-${Date.now()}-${randomUUID().slice(0, 8)}`,
    kind: "image",
    name: req.name || req.prompt.slice(0, 50),
    url,
    prompt: req.prompt,
    tags: req.tags || ["brand"],
    mimeType,
    source,
    createdAt: now(),
    updatedAt: now(),
  };

  store.assets.unshift(asset);
  appendLog(store, {
    level: "success",
    source,
    message: `Image saved to library: ${asset.name}`,
    meta: { assetId: asset.id },
  });
  await saveStore(store);

  return asset;
}
