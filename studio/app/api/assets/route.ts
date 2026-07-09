import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getAssets } from "@/lib/assets";
import { sortAssets, withStore } from "@/lib/store";
import type { AssetKind, AssetTag, LibraryAsset } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") as AssetKind | null;
  const tag = searchParams.get("tag") as AssetTag | null;
  const search = searchParams.get("search") || undefined;

  const assets = await getAssets({
    kind: kind || undefined,
    tag: tag || undefined,
    search,
  });

  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name?.trim() || !body.url?.trim()) {
      return NextResponse.json(
        { error: "name and url are required" },
        { status: 400 }
      );
    }

    const source: "studio" | "agent" =
      auth.source === "agent" ? "agent" : "studio";
    const asset = await withStore(async (store) => {
      const entry: LibraryAsset = {
        id: `asset-${Date.now()}`,
        kind: (body.kind || "upload") as AssetKind,
        name: body.name.trim(),
        url: body.url.trim(),
        thumbnailUrl: body.thumbnailUrl,
        prompt: body.prompt,
        tags: (body.tags || ["upload"]) as AssetTag[],
        mimeType: body.mimeType,
        source,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.assets = sortAssets([entry, ...store.assets]);
      return entry;
    });

    return NextResponse.json({ asset });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save asset";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
