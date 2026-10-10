import Link from "next/link";
import { FloatingHearts } from "@/components/FloatingHearts";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-sky px-6 text-center text-white">
      <FloatingHearts />
      <h1 className="headline text-[3rem]">Lost in love?</h1>
      <p className="mt-3 text-white/80">We couldn&apos;t find that page or deal.</p>
      <Link href="/" className="mt-8 flex h-12 items-center rounded-full bg-tang px-7 font-semibold">
        Fly home
      </Link>
    </main>
  );
}
