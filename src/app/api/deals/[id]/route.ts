import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { loadDeal } from "@/lib/feed";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const detail = await loadDeal(userId, (await params).id);
  if (!detail) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(detail, { headers: { "Cache-Control": "no-store" } });
}
