"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  Image as ImageIcon,
  Loader2,
  Send,
  Sparkles,
  Video,
} from "lucide-react";
import { clsx } from "clsx";
import type { AgentMessage, AgentSession, LibraryAsset } from "@/types";
import { slugifyName } from "@/lib/asset-utils";

interface AgentChatProps {
  assets: LibraryAsset[];
  onRefresh: () => void;
}

const STARTERS = [
  "Create a 1:1 carousel slide for iZop — hook: Stop managing social media",
  "Generate a 9:16 SaaS demo clip with smooth 3D UI motion for izop.ai",
  "Make a cinematic motion design reel intro with purple gradient brand",
];

export function AgentChat({ assets, onRefresh }: AgentChatProps) {
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/agent/chat", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!sessionId) return;
    const session = sessions.find((s) => s.id === sessionId);
    if (session) setMessages(session.messages);
  }, [sessionId, sessions]);

  function insertAssetRef(asset: LibraryAsset) {
    const slug = slugifyName(asset.name) || asset.id.slice(-8);
    setInput((prev) => `${prev}${prev.endsWith(" ") || !prev ? "" : " "}@${slug} `);
    setSelectedAssets((prev) =>
      prev.includes(asset.id) ? prev : [...prev, asset.id]
    );
  }

  async function sendMessage(text?: string) {
    const message = (text ?? input).trim();
    if (!message || sending) return;

    setSending(true);
    setError(null);
    setInput("");

    const optimistic: AgentMessage = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content: message,
      assetIds: selectedAssets.length ? selectedAssets : undefined,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId,
          assetIds: selectedAssets,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Agent failed");

      setSessionId(data.session.id);
      setMessages(data.session.messages);
      setSessions((prev) => {
        const rest = prev.filter((s) => s.id !== data.session.id);
        return [data.session, ...rest];
      });
      setSelectedAssets([]);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
      <div className="bg-surface rounded-2xl border border-border flex flex-col min-h-[70vh]">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text">iZop Content Agent</h2>
            <p className="text-xs text-text-dim">
              Seedance video + Nano Banana Pro images · reference @library assets
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4 opacity-60" />
              <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
                Your Higgsfield-style creative agent for iZop AI. Ask for carousels,
                motion designs, SaaS demos, or extend existing videos.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-2 rounded-full border border-border text-text-dim hover:text-text hover:border-primary/40 transition-colors"
                  >
                    {s.slice(0, 48)}…
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                "max-w-[90%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                msg.role === "user"
                  ? "ml-auto bg-primary text-white"
                  : "bg-elevated border border-border text-text"
              )}
            >
              {msg.content}
              {msg.jobIds && msg.jobIds.length > 0 && (
                <p className="text-xs mt-2 opacity-70">
                  Video jobs: {msg.jobIds.join(", ")}
                </p>
              )}
            </div>
          ))}

          {sending && (
            <div className="flex items-center gap-2 text-text-dim text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Planning and generating…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && <p className="px-5 text-xs text-error">{error}</p>}

        <div className="p-4 border-t border-border">
          {selectedAssets.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedAssets.map((id) => {
                const asset = assets.find((a) => a.id === id);
                return (
                  <span
                    key={id}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    @{slugifyName(asset?.name || id)}
                  </span>
                );
              })}
            </div>
          )}
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Describe what to create… use @asset-name to reference library"
              rows={2}
              className="flex-1 resize-none rounded-xl bg-elevated border border-border px-4 py-3 text-sm text-text placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={() => sendMessage()}
              disabled={sending || !input.trim()}
              className="self-end px-4 py-3 rounded-xl bg-primary text-white disabled:opacity-40 hover:bg-primary-light transition-colors"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="bg-surface rounded-2xl border border-border p-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Quick reference
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {assets.slice(0, 12).map((asset) => (
              <button
                key={asset.id}
                onClick={() => insertAssetRef(asset)}
                className="w-full flex items-center gap-2 text-left p-2 rounded-lg hover:bg-elevated transition-colors"
              >
                {asset.kind === "video" ? (
                  <Video className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                )}
                <span className="text-xs text-text truncate">{asset.name}</span>
              </button>
            ))}
            {assets.length === 0 && (
              <p className="text-xs text-text-dim">Library empty — generate or upload first.</p>
            )}
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border p-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Sessions
            </h3>
            <div className="space-y-1">
              {sessions.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSessionId(s.id)}
                  className={clsx(
                    "w-full text-left text-xs px-2 py-1.5 rounded-lg truncate",
                    sessionId === s.id
                      ? "bg-primary/10 text-primary"
                      : "text-text-dim hover:text-text hover:bg-elevated"
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
