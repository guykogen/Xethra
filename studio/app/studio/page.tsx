import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { StudioClient } from "@/components/StudioClient";

export default async function StudioPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <StudioClient />;
}
