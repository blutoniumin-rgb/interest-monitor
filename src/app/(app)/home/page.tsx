import { redirect } from "next/navigation";
import { requireFeed } from "@/lib/session";
import { HomeScreen } from "./HomeScreen";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const feed = await requireFeed();
  if (!feed.nest) redirect("/nest");
  if (!feed.partner) redirect("/nest/host");
  return <HomeScreen initialFeed={feed} />;
}
