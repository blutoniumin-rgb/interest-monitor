import { NextResponse } from "next/server";
import { loadNotificationPage } from "@/lib/feed";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const raw = Number(new URL(request.url).searchParams.get("offset") ?? 0);
  const offset = Number.isInteger(raw) && raw >= 0 && raw <= 5000 ? raw : 0;
  const page = await loadNotificationPage(userId, offset);
  return NextResponse.json(page, { headers: { "Cache-Control": "no-store" } });
}
