import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getVideoTask } from "@/lib/byteplus";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const task = await getVideoTask(params.id);
    return NextResponse.json(task);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
