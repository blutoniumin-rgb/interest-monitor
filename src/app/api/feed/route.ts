import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { loadFeed } from "@/lib/feed";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSessionUserId();
  const feed = userId ? await loadFeed(userId) : null;
  if (!feed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(feed, { headers: { "Cache-Control": "no-store" } });
}
