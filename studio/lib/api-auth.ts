import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) return { ok: true as const, source: "session" as const };

  const agentKey = req.headers.get("x-xethra-agent-key");
  const expected = process.env.XETHRA_AGENT_KEY?.trim();
  if (expected && agentKey === expected) {
    return { ok: true as const, source: "agent" as const };
  }

  return { ok: false as const };
}
