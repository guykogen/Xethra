import type {
  AspectRatio,
  GenerationMode,
  Resolution,
  VideoModel,
} from "@/types";

export interface ModelPricing {
  /** USD per 1M output tokens when input includes video */
  withVideoInputUsdPerM: number;
  /** USD per 1M output tokens for text/image-only input */
  withoutVideoInputUsdPerM: number;
  /** USD per 1M when generate_audio is on (1.5 Pro only) */
  withAudioUsdPerM?: number;
}

export interface SeedanceModel {
  id: VideoModel;
  label: string;
  shortLabel: string;
  desc: string;
  badge?: string;
  tier: "standard" | "fast";
  face: boolean;
  maxResolution: Resolution;
  supportsAudio: boolean;
  freeQuotaTokens?: number;
  pricing: ModelPricing;
}

export const SEEDANCE_MODELS: SeedanceModel[] = [
  {
    id: "seedance-1-0-pro-fast-251015",
    label: "Seedance 1.0 Pro Fast",
    shortLabel: "1.0 Fast",
    desc: "2M free tokens · fastest · great for testing",
    badge: "Free tier",
    tier: "fast",
    face: false,
    maxResolution: "1080p",
    supportsAudio: false,
    freeQuotaTokens: 2_000_000,
    pricing: {
      withVideoInputUsdPerM: 1.0,
      withoutVideoInputUsdPerM: 1.0,
    },
  },
  {
    id: "seedance-1-5-pro-251215",
    label: "Seedance 1.5 Pro",
    shortLabel: "1.5 Pro",
    desc: "2M free tokens · cinematic + optional audio sync",
    badge: "Free tier",
    tier: "standard",
    face: false,
    maxResolution: "1080p",
    supportsAudio: true,
    freeQuotaTokens: 2_000_000,
    pricing: {
      withVideoInputUsdPerM: 1.2,
      withoutVideoInputUsdPerM: 1.2,
      withAudioUsdPerM: 2.4,
    },
  },
  {
    id: "dreamina-seedance-2-0-fast-260128",
    label: "Seedance 2.0 Fast",
    shortLabel: "2.0 Fast",
    desc: "Paid · 2× faster · 720p max",
    tier: "fast",
    face: false,
    maxResolution: "720p",
    supportsAudio: true,
    pricing: {
      withVideoInputUsdPerM: 3.3,
      withoutVideoInputUsdPerM: 5.6,
    },
  },
  {
    id: "dreamina-seedance-2-0-260128",
    label: "Seedance 2.0",
    shortLabel: "2.0",
    desc: "Paid · best quality · 720p–1080p",
    tier: "standard",
    face: false,
    maxResolution: "1080p",
    supportsAudio: true,
    pricing: {
      withVideoInputUsdPerM: 4.3,
      withoutVideoInputUsdPerM: 7.0,
    },
  },
  {
    id: "dreamina-seedance-2-0-fast-260128-face",
    label: "Seedance 2.0 Fast Face",
    shortLabel: "2.0 Fast Face",
    desc: "Paid · real-person refs · 720p",
    badge: "Face",
    tier: "fast",
    face: true,
    maxResolution: "720p",
    supportsAudio: true,
    pricing: {
      withVideoInputUsdPerM: 3.3,
      withoutVideoInputUsdPerM: 5.6,
    },
  },
  {
    id: "dreamina-seedance-2-0-260128-face",
    label: "Seedance 2.0 Face",
    shortLabel: "2.0 Face",
    desc: "Paid · real-person reference images",
    badge: "Face",
    tier: "standard",
    face: true,
    maxResolution: "1080p",
    supportsAudio: true,
    pricing: {
      withVideoInputUsdPerM: 4.3,
      withoutVideoInputUsdPerM: 7.0,
    },
  },
];

export const DEFAULT_MODEL: VideoModel = "seedance-1-0-pro-fast-251015";

const FRAME_RATE = 24;

const PIXELS: Record<Resolution, Record<AspectRatio, number>> = {
  "720p": {
    "9:16": 720 * 1280,
    "16:9": 1280 * 720,
    "1:1": 720 * 720,
    "4:3": 960 * 720,
    "3:4": 720 * 960,
  },
  "1080p": {
    "9:16": 1080 * 1920,
    "16:9": 1920 * 1080,
    "1:1": 1080 * 1080,
    "4:3": 1440 * 1080,
    "3:4": 1080 * 1440,
  },
};

function rateForModel(
  model: SeedanceModel,
  resolution: Resolution,
  hasVideoInput: boolean,
  generateAudio: boolean
): number {
  if (generateAudio && model.pricing.withAudioUsdPerM) {
    return model.pricing.withAudioUsdPerM;
  }

  const base = hasVideoInput
    ? model.pricing.withVideoInputUsdPerM
    : model.pricing.withoutVideoInputUsdPerM;

  // Seedance 2.0 resource-pack 1080p uplift
  if (model.id.startsWith("dreamina-seedance-2-0") && resolution === "1080p") {
    return hasVideoInput ? 4.7 : 7.7;
  }

  return base;
}

export function getModel(id: VideoModel): SeedanceModel {
  return SEEDANCE_MODELS.find((m) => m.id === id) ?? SEEDANCE_MODELS[0];
}

export function estimateTokens(
  duration: number,
  ratio: AspectRatio,
  resolution: Resolution,
  inputVideoDuration = 0
): number {
  const pixels = PIXELS[resolution][ratio];
  return Math.round(
    ((inputVideoDuration + duration) * pixels * FRAME_RATE) / 1024
  );
}

export interface CostEstimate {
  tokens: number;
  usd: number;
  hasVideoInput: boolean;
  rateUsdPerM: number;
  freeQuotaTokens?: number;
  coveredByFreeQuota: boolean;
}

export function estimateCost(
  modelId: VideoModel,
  duration: number,
  ratio: AspectRatio,
  resolution: Resolution,
  mode: GenerationMode,
  generateAudio = false,
  inputVideoDuration = 0
): CostEstimate {
  const model = getModel(modelId);
  const hasVideoInput = mode === "reference" && inputVideoDuration > 0;
  const tokens = estimateTokens(
    duration,
    ratio,
    resolution,
    hasVideoInput ? inputVideoDuration : 0
  );
  const rateUsdPerM = rateForModel(
    model,
    resolution,
    hasVideoInput,
    generateAudio && model.supportsAudio
  );
  const usd = (tokens / 1_000_000) * rateUsdPerM;

  return {
    tokens,
    usd,
    hasVideoInput,
    rateUsdPerM,
    freeQuotaTokens: model.freeQuotaTokens,
    coveredByFreeQuota: !!model.freeQuotaTokens,
  };
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(2)}M`;
  if (tokens >= 1_000) return `${Math.round(tokens / 1000)}K`;
  return String(tokens);
}

export function formatUsd(usd: number): string {
  if (usd < 0.01) return "<$0.01";
  return `$${usd.toFixed(2)}`;
}

export function formatModelPricing(model: SeedanceModel): string {
  const { withVideoInputUsdPerM, withoutVideoInputUsdPerM, withAudioUsdPerM } =
    model.pricing;
  if (withAudioUsdPerM) {
    return `$${withoutVideoInputUsdPerM}–$${withAudioUsdPerM} / 1M tokens`;
  }
  if (withVideoInputUsdPerM === withoutVideoInputUsdPerM) {
    return `$${withoutVideoInputUsdPerM} / 1M tokens`;
  }
  return `$${withVideoInputUsdPerM}–$${withoutVideoInputUsdPerM} / 1M tokens`;
}

export function formatCostLabel(estimate: CostEstimate): string {
  if (estimate.coveredByFreeQuota) {
    return `~${formatTokens(estimate.tokens)} tokens · FREE (2M quota)`;
  }
  return `~${formatTokens(estimate.tokens)} tokens · ${formatUsd(estimate.usd)}`;
}
