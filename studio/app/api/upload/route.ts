import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { createAsset } from "@/lib/assets";
import { uploadFile } from "@/lib/byteplus";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const saveToLibrary = formData.get("saveToLibrary") !== "false";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const result = await uploadFile(buffer, file.name, file.type);

    let libraryUrl = result.url;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(
        `xethra/uploads/${Date.now()}-${file.name}`,
        Buffer.from(buffer),
        { access: "public", contentType: file.type }
      );
      libraryUrl = blob.url;
    }

    let asset = null;
    if (saveToLibrary) {
      const source = auth.source === "agent" ? "agent" : "studio";
      asset = await createAsset({
        kind: "upload",
        name: file.name.replace(/\.[^.]+$/, ""),
        url: libraryUrl,
        mimeType: file.type,
        tags: ["upload", "reference"],
        source,
      });
    }

    return NextResponse.json({ ...result, libraryUrl, asset });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
