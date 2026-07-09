import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getJobs, syncRunningJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sync = req.nextUrl.searchParams.get("sync") === "1";
  if (sync) {
    const result = await syncRunningJobs();
    return NextResponse.json({
      jobs: result.jobs,
      synced: result.updated,
    });
  }

  const jobs = await getJobs();
  return NextResponse.json({ jobs });
}
