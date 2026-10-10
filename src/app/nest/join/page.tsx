import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { JoinForm } from "./JoinForm";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const user = await requireUser();
  if (user.nestId) redirect("/nest");
  return <JoinForm />;
}
