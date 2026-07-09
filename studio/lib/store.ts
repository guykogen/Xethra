import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { head, put } from "@vercel/blob";
import type { ActivityLog, GenerationJob, LibraryAsset, XethraStore } from "@/types";

const BLOB_PATH = "xethra/store.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "xethra-store.json");

const EMPTY_STORE: XethraStore = {
  version: 2,
  jobs: [],
  logs: [],
  assets: [],
  agentSessions: [],
};

function migrateStore(raw: unknown): XethraStore {
  const data = (raw || {}) as Partial<XethraStore> & { version?: number };
  if (data.version === 2) {
    return {
      version: 2,
      jobs: data.jobs ?? [],
      logs: data.logs ?? [],
      assets: data.assets ?? [],
      agentSessions: data.agentSessions ?? [],
    };
  }
  return {
    version: 2,
    jobs: data.jobs ?? [],
    logs: data.logs ?? [],
    assets: [],
    agentSessions: [],
  };
}

let memoryStore: XethraStore | null = null;

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readLocalStore(): Promise<XethraStore> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    return migrateStore(JSON.parse(raw));
  } catch {
    return structuredClone(EMPTY_STORE);
  }
}

async function writeLocalStore(store: XethraStore) {
  await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await writeFile(LOCAL_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function readBlobStore(): Promise<XethraStore> {
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return structuredClone(EMPTY_STORE);
    return migrateStore(await res.json());
  } catch {
    return structuredClone(EMPTY_STORE);
  }
}

async function writeBlobStore(store: XethraStore) {
  await put(BLOB_PATH, JSON.stringify(store, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function loadStore(): Promise<XethraStore> {
  if (useBlob()) {
    return readBlobStore();
  }

  if (process.env.NODE_ENV === "development") {
    return readLocalStore();
  }

  if (!memoryStore) memoryStore = structuredClone(EMPTY_STORE);
  return memoryStore;
}

export async function saveStore(store: XethraStore) {
  if (useBlob()) {
    await writeBlobStore(store);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    await writeLocalStore(store);
    return;
  }

  memoryStore = store;
}

export async function withStore<T>(
  fn: (store: XethraStore) => T | Promise<T>
): Promise<T> {
  const store = await loadStore();
  const result = await fn(store);
  await saveStore(store);
  return result;
}

export function sortJobs(jobs: GenerationJob[]) {
  return [...jobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function sortLogs(logs: ActivityLog[]) {
  return [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function sortAssets(assets: LibraryAsset[]) {
  return [...assets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function trimLogs(logs: ActivityLog[], max = 500) {
  return sortLogs(logs).slice(0, max);
}
