import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { CoupleHero } from "@/components/Couple";
import { FloatingHearts } from "@/components/FloatingHearts";
import { WelcomeForm } from "./WelcomeForm";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.nestId ? "/home" : "/nest");

  return (
    <main className="relative flex min-h-dvh flex-col bg-sky px-6 pt-safe pb-safe text-white">
      <FloatingHearts />
      <div className="relative mt-10 flex-1">
        <p className="text-lg font-medium text-white/75">With our Love System</p>
        <h1 className="headline mt-3 text-[3.2rem]">
          Count every
          <br />
          kiss you
          <br />
          <span className="text-tang-soft">owe each other</span>
        </h1>
        <CoupleHero />
      </div>
      <WelcomeForm />
    </main>
  );
}
