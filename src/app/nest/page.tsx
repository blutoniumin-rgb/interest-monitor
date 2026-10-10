import { redirect } from "next/navigation";
import { requireFeed } from "@/lib/session";
import { NestPicker } from "./NestPicker";

export const dynamic = "force-dynamic";

export default async function NestPage() {
  const feed = await requireFeed();
  if (feed.nest) redirect(feed.partner ? "/home" : "/nest/host");
  return <NestPicker name={feed.me.name} />;
}
