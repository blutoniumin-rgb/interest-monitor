import { redirect } from "next/navigation";
import { loadNotificationPage } from "@/lib/feed";
import { getSessionUserId } from "@/lib/session";
import { NotesScreen } from "./NotesScreen";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/logout");
  const page = await loadNotificationPage(userId, 0);
  return <NotesScreen initial={page} />;
}
