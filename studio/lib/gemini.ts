import { put } from "@vercel/blob";
import type { AspectRatio, ImageGenerationRequest } from "@/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-2.0-flash-preview-image-generation";
const CHAT_MODEL =
  process.env.GEMINI_CHAT_MODEL?.trim() || "gemini-2.5-flash";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

function requireKey() {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return GEMINI_API_KEY;
}

function aspectToGemini(ratio?: AspectRatio | "4:5") {
  const map: Record<string, string> = {
    "1:1": "1:1",
    "16:9": "16:9",
    "9:16": "9:16",
    "4:3": "4:3",
    "3:4": "3:4",
    "4:5": "3:4",
  };
  return map[ratio || "1:1"] || "1:1";
}

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

async function fetchImageAsBase64(url: string): Promise<{ mimeType: string; data: string }> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch reference image: ${res.status}`);
  const mimeType = res.headers.get("content-type") || "image/png";
  const buffer = Buffer.from(await res.arrayBuffer());
  return { mimeType, data: buffer.toString("base64") };
}

export async function generateImage(
  req: ImageGenerationRequest,
  referenceUrls: string[] = []
): Promise<{ buffer: Buffer; mimeType: string }> {
  const key = requireKey();
  const parts: GeminiPart[] = [];

  for (const url of referenceUrls.slice(0, 10)) {
    const ref = await fetchImageAsBase64(url);
    parts.push({ inlineData: ref });
  }

  parts.push({ text: req.prompt });

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
      imageConfig: {
        aspectRatio: aspectToGemini(req.aspectRatio),
      },
    },
  };

  const res = await fetch(
    `${BASE}/models/${IMAGE_MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini image error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const candidates = data.candidates || [];
  for (const candidate of candidates) {
    const contentParts = candidate.content?.parts || [];
    for (const part of contentParts) {
      const inline = part.inlineData || part.inline_data;
      if (inline?.data) {
        const mimeType = inline.mimeType || inline.mime_type || "image/png";
        return {
          buffer: Buffer.from(inline.data, "base64"),
          mimeType,
        };
      }
    }
  }

  throw new Error("Gemini returned no image data");
}

export async function persistImage(
  buffer: Buffer,
  mimeType: string,
  name: string
): Promise<string> {
  const ext = mimeType.includes("jpeg") ? "jpg" : "png";
  const path = `xethra/assets/${Date.now()}-${name.replace(/[^a-z0-9-]/gi, "-").slice(0, 40)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(path, buffer, {
      access: "public",
      contentType: mimeType,
    });
    return blob.url;
  }

  // Dev fallback: data URL (not durable across deploys)
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export async function chatWithGemini(
  systemPrompt: string,
  userMessage: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const key = requireKey();

  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  };

  const res = await fetch(
    `${BASE}/models/${CHAT_MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini chat error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ||
    "";

  if (!text) throw new Error("Gemini returned empty response");
  return text;
}
