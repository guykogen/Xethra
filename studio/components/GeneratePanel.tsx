"use client";

import { useState, useRef, useCallback } from "react";
import {
  Wand2,
  Upload,
  X,
  ImageIcon,
  ChevronDown,
  Loader2,
  Sparkles,
  Cpu,
} from "lucide-react";
import { clsx } from "clsx";
import type {
  GenerationRequest,
  VideoModel,
  AspectRatio,
  Resolution,
  GenerationMode,
} from "@/types";
import {
  SEEDANCE_MODELS,
  DEFAULT_MODEL,
  estimateCost,
  formatModelPricing,
  formatCostLabel,
  formatTokens,
  formatUsd,
  getModel,
} from "@/lib/models";

interface GeneratePanelProps {
  onGenerate: (req: GenerationRequest) => Promise<void>;
}

const RATIOS: AspectRatio[] = ["9:16", "16:9", "1:1", "4:3", "3:4"];

export function GeneratePanel({ onGenerate }: GeneratePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<GenerationMode>("text");
  const [model, setModel] = useState<VideoModel>(DEFAULT_MODEL);
  const [ratio, setRatio] = useState<AspectRatio>("9:16");
  const [resolution, setResolution] = useState<Resolution>("720p");
  const [duration, setDuration] = useState<5 | 10>(5);
  const [generateAudio, setGenerateAudio] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageRole, setImageRole] = useState<"first_frame" | "last_frame" | "reference">("first_frame");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedModel = getModel(model);
  const costEstimate = estimateCost(
    model,
    duration,
    ratio,
    resolution,
    mode,
    generateAudio
  );

  async function handleFileUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        alert(`Upload failed: ${err.error}`);
        return;
      }
      const { url } = await res.json();
      setImageUrl(url);
      setImagePreview(URL.createObjectURL(file));
    } finally {
      setUploading(false);
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (mode !== "text" && !imageUrl) {
      alert("Please upload or paste an image URL first.");
      return;
    }
    setGenerating(true);
    try {
      await onGenerate({
        prompt,
        mode,
        model,
        ratio,
        resolution,
        duration,
        generateAudio,
        imageUrl: mode !== "text" ? imageUrl : undefined,
        imageRole: mode === "image" ? imageRole : mode === "reference" ? "reference" : undefined,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
      setPrompt("");
    }
  }

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      {/* Mode tabs */}
      <div className="flex border-b border-border">
        {(["text", "image", "reference"] as GenerationMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={clsx(
              "flex-1 py-3.5 text-sm font-medium transition-colors capitalize",
              mode === m
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-text-muted hover:text-text"
            )}
          >
            {m === "text" && "Text to Video"}
            {m === "image" && "Image to Video"}
            {m === "reference" && "Reference Video"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-muted">
              Prompt
            </label>
            <span className="text-xs text-text-dim">{prompt.length}/1000</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 1000))}
            rows={4}
            required
            placeholder={
              mode === "text"
                ? "Describe your video… e.g. 'A product floating in a minimal white studio, slow drift, soft key light, cinematic depth of field'"
                : mode === "image"
                ? "Describe how the image should animate… e.g. 'Subtle camera push, hair flowing gently in breeze'"
                : "Describe the character motion and scene… e.g. 'Guy walks toward camera confidently, looking into lens'"
            }
            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-text-dim resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors leading-relaxed"
          />
        </div>

        {/* Image upload (modes: image / reference) */}
        {mode !== "text" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-muted">
                {mode === "image" ? "Source Image" : "Reference Image"}
              </label>
              {mode === "image" && (
                <div className="flex gap-2">
                  {(["first_frame", "last_frame", "reference"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setImageRole(r)}
                      className={clsx(
                        "text-xs px-2.5 py-1 rounded-lg border transition-colors",
                        imageRole === r
                          ? "bg-primary/15 text-primary border-primary/40"
                          : "border-border text-text-dim hover:text-text-muted"
                      )}
                    >
                      {r === "first_frame" ? "First frame" : r === "last_frame" ? "Last frame" : "Reference"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {imagePreview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-h-48 rounded-xl object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageUrl(""); }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 cursor-pointer transition-colors flex flex-col items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-elevated group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-text-dim group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-muted">
                    {uploading ? "Uploading…" : "Drop image here or click to upload"}
                  </p>
                  <p className="text-xs text-text-dim mt-0.5">JPEG, PNG, WebP, GIF</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                />
              </div>
            )}

            {/* Or paste URL */}
            {!imagePreview && (
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-1 bg-elevated border border-border rounded-xl px-3">
                  <ImageIcon className="w-4 h-4 text-text-dim flex-shrink-0" />
                  <input
                    type="url"
                    value={imageUrl.startsWith("asset://") ? "" : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste image URL…"
                    className="flex-1 bg-transparent py-2.5 text-sm text-text placeholder-text-dim focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Aspect ratio */}
          <div>
            <label className="block text-xs font-medium text-text-dim mb-1.5">
              Ratio
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RATIOS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRatio(r)}
                  className={clsx(
                    "text-xs px-2.5 py-1.5 rounded-lg border transition-colors font-medium",
                    ratio === r
                      ? "bg-primary text-white border-primary"
                      : "border-border text-text-dim hover:text-text hover:border-border/80"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-xs font-medium text-text-dim mb-1.5">
              Resolution
            </label>
            <div className="flex gap-1.5">
              {(["720p", "1080p"] as Resolution[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResolution(r)}
                  disabled={r === "1080p" && selectedModel.maxResolution === "720p"}
                  className={clsx(
                    "text-xs px-2.5 py-1.5 rounded-lg border transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed",
                    resolution === r
                      ? "bg-primary text-white border-primary"
                      : "border-border text-text-dim hover:text-text"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-text-dim mb-1.5">
              Duration
            </label>
            <div className="flex gap-1.5">
              {([5, 10] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={clsx(
                    "text-xs px-2.5 py-1.5 rounded-lg border transition-colors font-medium",
                    duration === d
                      ? "bg-primary text-white border-primary"
                      : "border-border text-text-dim hover:text-text"
                  )}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Audio */}
          <div>
            <label className="block text-xs font-medium text-text-dim mb-1.5">
              Audio
            </label>
            <button
              type="button"
              onClick={() => selectedModel.supportsAudio && setGenerateAudio(!generateAudio)}
              disabled={!selectedModel.supportsAudio}
              className={clsx(
                "text-xs px-2.5 py-1.5 rounded-lg border transition-colors font-medium",
                !selectedModel.supportsAudio && "opacity-40 cursor-not-allowed",
                generateAudio
                  ? "bg-primary text-white border-primary"
                  : "border-border text-text-dim hover:text-text"
              )}
            >
              {selectedModel.supportsAudio ? (generateAudio ? "On" : "Off") : "N/A"}
            </button>
          </div>
        </div>

        {/* Model selector */}
        <div className="relative">
          <label className="block text-xs font-medium text-text-dim mb-1.5">
            Model
          </label>
          <button
            type="button"
            onClick={() => setModelOpen(!modelOpen)}
            className="w-full flex items-center justify-between gap-3 bg-elevated border border-border hover:border-primary/50 rounded-xl px-4 py-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-text">{selectedModel.label}</p>
                <p className="text-xs text-text-dim">
                  {selectedModel.desc} · {formatCostLabel(costEstimate)}
                </p>
              </div>
            </div>
            <ChevronDown
              className={clsx(
                "w-4 h-4 text-text-dim transition-transform",
                modelOpen && "rotate-180"
              )}
            />
          </button>

          {modelOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl shadow-2xl z-20 overflow-hidden animate-fade-in max-h-80 overflow-y-auto">
              {SEEDANCE_MODELS.map((m) => {
                const sampleCost = estimateCost(
                  m.id,
                  duration,
                  ratio,
                  resolution,
                  mode,
                  generateAudio
                );
                return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setModel(m.id);
                    setModelOpen(false);
                    if (m.maxResolution === "720p") setResolution("720p");
                    if (!m.supportsAudio) setGenerateAudio(false);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-elevated transition-colors text-left border-b border-border/50 last:border-0",
                    model === m.id && "bg-primary/5"
                  )}
                >
                  <Cpu
                    className={clsx(
                      "w-4 h-4 flex-shrink-0",
                      model === m.id ? "text-primary" : "text-text-dim"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-text">{m.label}</span>
                      {m.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/15 text-primary">
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-dim mt-0.5">{m.desc}</p>
                    <p className="text-[11px] text-text-dim mt-1">
                      {formatModelPricing(m)} · {formatCostLabel(sampleCost)} for {duration}s
                    </p>
                  </div>
                  {model === m.id && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </button>
              );
              })}
            </div>
          )}
        </div>

        {/* Cost estimate */}
        <div className="rounded-xl border border-border bg-elevated/50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-text-muted">Estimated cost</p>
              <p className="text-sm font-semibold text-text mt-0.5">
                {formatCostLabel(costEstimate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-text-dim">
                ${costEstimate.rateUsdPerM.toFixed(1)} / 1M tokens
              </p>
              <p className="text-[11px] text-text-dim">
                {costEstimate.coveredByFreeQuota
                  ? "uses free quota"
                  : costEstimate.hasVideoInput
                  ? "with video input"
                  : "text/image input"}
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={generating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 text-sm transition-all duration-150 animate-pulse-glow"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting generation…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Video
            </>
          )}
        </button>

        <p className="text-center text-xs text-text-dim">
          Powered by BytePlus ModelArk · Seedance 2.0
        </p>
      </form>
    </div>
  );
}
