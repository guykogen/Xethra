import type { GenerationRequest, BytePlusTaskResponse } from "@/types";

const BASE_URL =
  process.env.BYTEPLUS_BASE_URL ||
  "https://ark.ap-southeast.bytepluses.com/api/v3";
const API_KEY = process.env.BYTEPLUS_API_KEY!;

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };
}

export async function createVideoTask(
  req: GenerationRequest
): Promise<{ taskId: string }> {
  const content: object[] = [];

  if (req.mode === "image" && req.imageUrl) {
    content.push({
      type: "image_url",
      image_url: {
        url: req.imageUrl,
        role: req.imageRole || "first_frame",
      },
    });
  }

  if (req.mode === "reference" && req.imageUrl) {
    content.push({
      type: "image_url",
      image_url: {
        url: req.imageUrl,
        role: "reference",
      },
    });
  }

  content.push({ type: "text", text: req.prompt });

  const body = {
    model: req.model,
    content,
    ratio: req.ratio,
    resolution: req.resolution,
    duration: req.duration,
    generate_audio: req.generateAudio,
    return_last_frame: true,
  };

  const res = await fetch(`${BASE_URL}/contents/generations/tasks`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`BytePlus error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return { taskId: data.id };
}

export async function getVideoTask(
  taskId: string
): Promise<BytePlusTaskResponse> {
  const res = await fetch(
    `${BASE_URL}/contents/generations/tasks/${taskId}`,
    { headers: headers() }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`BytePlus error ${res.status}: ${err}`);
  }

  return res.json();
}

export async function uploadFile(
  buffer: ArrayBuffer,
  filename: string,
  mimeType: string
): Promise<{ fileId: string; url: string }> {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([buffer], { type: mimeType }),
    filename
  );
  formData.append("purpose", "user_data");

  const res = await fetch(`${BASE_URL}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`BytePlus upload error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return { fileId: data.id, url: `asset://${data.id}` };
}
