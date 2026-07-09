import { randomUUID } from "crypto";
import { sortAssets, withStore } from "@/lib/store";
import { slugifyName } from "@/lib/asset-utils";
import type {
  ActivitySource,
  AssetKind,
  AssetTag,
  GenerationJob,
  LibraryAsset,
  XethraStore,
} from "@/types";

function now() {
  return new Date().toISOString();
}

export function createAssetId() {
  return `asset-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

export { slugifyName } from "@/lib/asset-utils";

export function upsertAsset(store: XethraStore, asset: LibraryAsset) {
  const idx = store.assets.findIndex((a) => a.id === asset.id);
  if (idx >= 0) store.assets[idx] = asset;
  else store.assets.unshift(asset);
  store.assets = sortAssets(store.assets);
}

export function assetFromJob(job: GenerationJob): LibraryAsset | null {
  if (job.status !== "succeeded" || !job.videoUrl) return null;
  return {
    id: job.assetId || createAssetId(),
    kind: "video",
    name: job.campaignLabel || job.prompt.slice(0, 60),
    url: job.videoUrl,
    thumbnailUrl: job.thumbnailUrl,
    prompt: job.prompt,
    tags: job.campaignLabel ? ["motion"] : ["motion"],
    duration: job.duration,
    ratio: job.ratio,
    jobId: job.id,
    parentAssetId: job.parentAssetId,
    source: job.source,
    createdAt: job.completedAt || job.createdAt,
    updatedAt: now(),
  };
}

export function ingestJobToLibrary(store: XethraStore, job: GenerationJob) {
  const asset = assetFromJob(job);
  if (!asset) return null;

  const existing = store.assets.find(
    (a) => a.jobId === job.id || (job.assetId && a.id === job.assetId)
  );
  if (existing) {
    Object.assign(existing, asset, { id: existing.id, updatedAt: now() });
    return existing;
  }

  if (!job.assetId) job.assetId = asset.id;
  upsertAsset(store, asset);
  return asset;
}

export async function getAssets(filters?: {
  kind?: AssetKind;
  tag?: AssetTag;
  search?: string;
}) {
  const { loadStore } = await import("@/lib/store");
  const store = await loadStore();
  let assets = sortAssets(store.assets);

  if (filters?.kind) {
    assets = assets.filter((a) => a.kind === filters.kind);
  }
  if (filters?.tag) {
    assets = assets.filter((a) => a.tags.includes(filters.tag!));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    assets = assets.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.prompt?.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q))
    );
  }

  return assets;
}

export async function getAssetById(id: string) {
  return withStore(async (store) => store.assets.find((a) => a.id === id) || null);
}

export async function createAsset(input: {
  kind: AssetKind;
  name: string;
  url: string;
  thumbnailUrl?: string;
  prompt?: string;
  tags?: AssetTag[];
  mimeType?: string;
  jobId?: string;
  parentAssetId?: string;
  source: ActivitySource;
  ratio?: LibraryAsset["ratio"];
  duration?: number;
}) {
  return withStore(async (store) => {
    const asset: LibraryAsset = {
      id: createAssetId(),
      kind: input.kind,
      name: input.name,
      url: input.url,
      thumbnailUrl: input.thumbnailUrl,
      prompt: input.prompt,
      tags: input.tags || [],
      mimeType: input.mimeType,
      jobId: input.jobId,
      parentAssetId: input.parentAssetId,
      source: input.source,
      ratio: input.ratio,
      duration: input.duration,
      createdAt: now(),
      updatedAt: now(),
    };
    upsertAsset(store, asset);
    return asset;
  });
}

export function resolveAssetMentions(
  message: string,
  assets: LibraryAsset[]
): { cleaned: string; assetIds: string[] } {
  const assetIds: string[] = [];
  let cleaned = message;

  const bySlug = new Map(
    assets.map((a) => [slugifyName(a.name), a.id] as const)
  );

  cleaned = cleaned.replace(/@\[([^\]]+)\]/g, (_, id: string) => {
    if (assets.some((a) => a.id === id)) assetIds.push(id);
    return "";
  });

  cleaned = cleaned.replace(/@([a-z0-9][a-z0-9-]*)/gi, (_, slug: string) => {
    const id = bySlug.get(slug.toLowerCase());
    if (id) assetIds.push(id);
    return "";
  });

  return { cleaned: cleaned.trim(), assetIds: [...new Set(assetIds)] };
}

export function librarySummaryForAgent(assets: LibraryAsset[], limit = 40) {
  return assets.slice(0, limit).map((a) => ({
    id: a.id,
    name: a.name,
    kind: a.kind,
    tags: a.tags,
    prompt: a.prompt?.slice(0, 120),
    url: a.url,
    jobId: a.jobId,
  }));
}
