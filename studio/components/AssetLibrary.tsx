"use client";

import { useCallback, useRef, useState } from "react";
import {
  Copy,
  Film,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { clsx } from "clsx";
import type { AssetKind, LibraryAsset } from "@/types";
import { slugifyName } from "@/lib/asset-utils";

interface AssetLibraryProps {
  assets: LibraryAsset[];
  loading?: boolean;
  onRefresh: () => void;
  onSelect?: (asset: LibraryAsset) => void;
}

const FILTERS: { label: string; kind?: AssetKind }[] = [
  { label: "All" },
  { label: "Images", kind: "image" },
  { label: "Videos", kind: "video" },
  { label: "Uploads", kind: "upload" },
];

export function AssetLibrary({
  assets,
  loading,
  onRefresh,
  onSelect,
}: AssetLibraryProps) {
  const [filter, setFilter] = useState<AssetKind | "all">("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = assets.filter((a) => {
    if (filter !== "all" && a.kind !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.prompt?.toLowerCase().includes(q) ||
      a.tags.some((t) => t.includes(q))
    );
  });

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("saveToLibrary", "true");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerateImage() {
    if (!imagePrompt.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: "1:1",
          resolution: "2K",
          tags: ["brand"],
          name: imagePrompt.slice(0, 40),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      setImagePrompt("");
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove from library?")) return;
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    onRefresh();
  }

  function copyRef(asset: LibraryAsset) {
    const slug = slugifyName(asset.name);
    navigator.clipboard.writeText(`@${slug}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Asset Library</h2>
          <p className="text-sm text-text-dim mt-1">
            All images, videos, and uploads — reference with @name in the Agent
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-elevated border border-border text-sm text-text hover:border-primary/40 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-4">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
          Quick image (Nano Banana Pro)
        </p>
        <div className="flex gap-2">
          <input
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Carousel slide, keyframe, brand graphic…"
            className="flex-1 rounded-xl bg-elevated border border-border px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleGenerateImage}
            disabled={generating || !imagePrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm disabled:opacity-40"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.kind || "all")}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              (f.kind || "all") === filter
                ? "bg-primary text-white border-primary"
                : "bg-elevated text-text-dim border-border hover:text-text"
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search library…"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-elevated border border-border text-sm text-text placeholder:text-text-dim focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-text-dim text-sm">
          No assets yet. Generate videos in Studio, images above, or upload references.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onSelect={onSelect}
              onDelete={() => handleDelete(asset.id)}
              onCopyRef={() => copyRef(asset)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AssetCard({
  asset,
  onSelect,
  onDelete,
  onCopyRef,
}: {
  asset: LibraryAsset;
  onSelect?: (asset: LibraryAsset) => void;
  onDelete: () => void;
  onCopyRef: () => void;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden group">
      <button
        type="button"
        onClick={() => onSelect?.(asset)}
        className="w-full aspect-square bg-bg relative block"
      >
        {asset.kind === "video" ? (
          asset.thumbnailUrl || asset.url ? (
            <video
              src={asset.url}
              className="w-full h-full object-cover"
              muted
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-8 h-8 text-text-dim" />
            </div>
          )
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        )}
        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-bg/80 text-text-dim border border-border">
          {asset.kind}
        </span>
      </button>
      <div className="p-3">
        <p className="text-xs font-medium text-text truncate">{asset.name}</p>
        <p className="text-[10px] text-text-dim mt-0.5 truncate">
          @{slugifyName(asset.name)}
        </p>
        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onCopyRef}
            className="p-1.5 rounded-lg hover:bg-elevated text-text-dim hover:text-text"
            title="Copy @reference"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-elevated text-text-dim hover:text-error"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
