import { notFound, redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { loadFeedAndDeal } from "@/lib/feed";
import { DealScreen } from "./DealScreen";

export const dynamic = "force-dynamic";

export default async function DealPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, userId] = await Promise.all([params, getSessionUserId()]);
  if (!userId) redirect("/logout");
  const { feed, detail } = await loadFeedAndDeal(userId, id);
  if (!feed) redirect("/logout");
  if (!feed.nest) redirect("/nest");
  if (!detail) notFound();
  return <DealScreen id={id} initialDetail={detail} initialFeed={feed} />;
}
