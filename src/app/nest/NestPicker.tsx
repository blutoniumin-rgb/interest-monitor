"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { logout } from "@/actions/auth";
import { buildNest } from "@/actions/nest";
import { Avatar } from "@/components/Avatar";
import { LoveBuddy } from "@/components/Couple";
import { FloatingHearts } from "@/components/FloatingHearts";
import { LogoutIcon, PlusIcon } from "@/components/Icons";

const card = {
  hidden: { y: 40, opacity: 0 },
  show: (i: number) => ({ y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 260, damping: 24, delay: 0.1 + i * 0.08 } }),
};

export function NestPicker({ name }: { name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onBuild() {
    setError(null);
    startTransition(async () => {
      const res = await buildNest();
      if ("error" in res) setError(res.error);
      else router.replace(res.redirectTo);
    });
  }

  return (
    <main className="relative flex min-h-dvh flex-col bg-tang px-6 pt-safe pb-safe text-white">
      <FloatingHearts />
      <header className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={name} />
          <span className="glass flex h-11 w-11 items-center justify-center rounded-full">
            <PlusIcon size={20} />
          </span>
        </div>
        <form action={logout}>
          <button aria-label="Log out" className="glass flex h-11 w-11 items-center justify-center rounded-full">
            <LogoutIcon size={20} />
          </button>
        </form>
      </header>

      <div className="relative mt-8">
        <p className="text-lg font-medium text-white/80">Hi {name}, every love needs a home</p>
        <h1 className="headline mt-2 text-[3rem]">Where&apos;s your Love Nest?</h1>
      </div>

      <div className="relative mt-auto flex flex-col gap-4 pt-10">
        <motion.button
          custom={0}
          variants={card}
          initial="hidden"
          animate="show"
          whileTap={{ scale: 0.96 }}
          onClick={onBuild}
          disabled={pending}
          className="group relative overflow-hidden rounded-[var(--radius-card)] bg-white p-5 text-left text-ink disabled:opacity-70"
        >
          <div className="mb-3 h-1.5 w-24 rounded-full bg-sky-soft">
            <div className="h-full w-2/3 rounded-full bg-sky" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="headline text-[1.9rem]">
                Build our
                <br />
                Nest
              </h2>
              <p className="mt-2 text-sm text-mute">Get a secret code to share with your love</p>
              <span className="mt-4 inline-flex h-9 items-center rounded-full bg-sky px-5 text-sm font-semibold text-white">
                {pending ? "Building..." : "Host"}
              </span>
            </div>
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-sky-soft">
              <LoveBuddy size={84} tone="orange" />
            </div>
          </div>
        </motion.button>

        <motion.div custom={1} variants={card} initial="hidden" animate="show" whileTap={{ scale: 0.96 }}>
          <Link
            href="/nest/join"
            className="block rounded-[var(--radius-card)] bg-white p-5 text-ink"
          >
            <div className="mb-3 h-1.5 w-24 rounded-full bg-grape-soft">
              <div className="h-full w-1/3 rounded-full bg-grape" />
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="headline text-[1.9rem]">
                  Fly into
                  <br />a Nest
                </h2>
                <p className="mt-2 text-sm text-mute">Your love already has a code? Join them</p>
                <span className="mt-4 inline-flex h-9 items-center rounded-full bg-grape px-5 text-sm font-semibold text-white">
                  Join
                </span>
              </div>
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-grape-soft">
                <LoveBuddy size={84} tone="cream" />
              </div>
            </div>
          </Link>
        </motion.div>

        {error && <p className="text-center text-sm font-semibold text-white">{error}</p>}
        <p className="text-center text-xs text-white/70">One nest per person. Only two lovebirds fit in a nest.</p>
      </div>
    </main>
  );
}
