import { redirect } from "next/navigation";
import { requireFeed } from "@/lib/session";
import { HostWaiting } from "./HostWaiting";

export const dynamic = "force-dynamic";

export default async function HostPage() {
  const feed = await requireFeed();
  if (!feed.nest) redirect("/nest");
  if (feed.partner) redirect("/home");
  return <HostWaiting initialFeed={feed} />;
}
