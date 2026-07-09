export type VideoModel =
  | "seedance-1-0-pro-fast-251015"
  | "seedance-1-5-pro-251215"
  | "dreamina-seedance-2-0-260128"
  | "dreamina-seedance-2-0-fast-260128"
  | "dreamina-seedance-2-0-260128-face"
  | "dreamina-seedance-2-0-fast-260128-face";

export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:3" | "3:4";
export type Resolution = "720p" | "1080p";
export type GenerationMode = "text" | "image" | "reference";
export type TaskStatus = "pending" | "running" | "succeeded" | "failed" | "cancelled";
export type ActivityLevel = "info" | "success" | "warn" | "error";
export type ActivitySource = "studio" | "agent" | "system";

export interface GenerationRequest {
  prompt: string;
  mode: GenerationMode;
  model: VideoModel;
  ratio: AspectRatio;
  resolution: Resolution;
  duration: 5 | 10;
  generateAudio: boolean;
  imageUrl?: string;
  imageRole?: "first_frame" | "last_frame" | "reference";
  campaignLabel?: string;
}

export interface GenerationTask {
  id: string;
  taskId: string;
  status: TaskStatus;
  prompt: string;
  model: VideoModel;
  ratio: AspectRatio;
  resolution: Resolution;
  duration: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface GenerationJob extends GenerationTask {
  mode: GenerationMode;
  generateAudio: boolean;
  imageUrl?: string;
  source: ActivitySource;
  campaignLabel?: string;
  parentJobId?: string;
  parentAssetId?: string;
  assetId?: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  level: ActivityLevel;
  message: string;
  source: ActivitySource;
  jobId?: string;
  meta?: Record<string, unknown>;
}

export type AssetKind = "image" | "video" | "upload";
export type AssetTag =
  | "carousel"
  | "motion"
  | "demo"
  | "avatar"
  | "brand"
  | "reference"
  | "upload";

export interface LibraryAsset {
  id: string;
  kind: AssetKind;
  name: string;
  url: string;
  thumbnailUrl?: string;
  prompt?: string;
  tags: AssetTag[];
  mimeType?: string;
  width?: number;
  height?: number;
  duration?: number;
  ratio?: AspectRatio;
  jobId?: string;
  parentAssetId?: string;
  source: ActivitySource;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  assetIds?: string[];
  jobIds?: string[];
  imageIds?: string[];
  timestamp: string;
}

export interface AgentSession {
  id: string;
  title: string;
  messages: AgentMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: AspectRatio | "4:5";
  resolution?: "1K" | "2K" | "4K";
  referenceAssetIds?: string[];
  tags?: AssetTag[];
  name?: string;
}

export interface XethraStore {
  version: 2;
  jobs: GenerationJob[];
  logs: ActivityLog[];
  assets: LibraryAsset[];
  agentSessions: AgentSession[];
}

export interface BytePlusTaskResponse {
  id: string;
  status: string;
  content?: {
    video_url?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
