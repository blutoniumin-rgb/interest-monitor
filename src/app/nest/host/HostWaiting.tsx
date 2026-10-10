"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { leaveEmptyNest } from "@/actions/nest";
import { Couple } from "@/components/Couple";
import { FloatingHearts } from "@/components/FloatingHearts";
import { HeartBurst } from "@/components/HeartBurst";
import { CheckIcon, CopyIcon, ShareIcon } from "@/components/Icons";
import { TapButton } from "@/components/TapButton";
import type { Feed } from "@/lib/types";
import { useFeed } from "@/lib/useFeed";

export function HostWaiting({ initialFeed }: { initialFeed: Feed }) {
  const router = useRouter();
  const { data } = useFeed(initialFeed);
  const code = data?.nest?.code ?? initialFeed.nest!.code;
  const partner = data?.partner;
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const [leaving, startLeaving] = useTransition();

  useEffect(() => {
    if (!partner) return;
    setBurst((b) => b + 1);
    const t = setTimeout(() => router.replace("/home"), 1500);
    return () => clearTimeout(t);
  }, [partner, router]);

  async function copy() {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    const text = `Fly into our Love Nest on Kiss Monitor with code ${code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Kiss Monitor", text, url: window.location.origin });
      } catch {}
    } else {
      copy();
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col bg-sky px-6 pt-safe pb-safe text-white">
      <FloatingHearts />
      <div className="relative mt-12">
        <p className="text-lg font-medium text-white/80">Your Love Nest is ready</p>
        <h1 className="headline mt-2 text-[3rem]">Share this code with your love</h1>
      </div>

      <div className="relative mt-10 flex justify-between gap-2">
        {code.split("").map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: 30, opacity: 0, rotate: -12, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.15 + i * 0.07 }}
            className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-white text-[2rem] font-extrabold text-ink shadow-[0_10px_25px_-12px_rgba(0,0,0,0.4)]"
          >
            {ch}
          </motion.span>
        ))}
      </div>

      <div className="relative mt-5 flex gap-3">
        <TapButton variant="glass" onClick={copy} className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "done" : "copy"}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              className="flex items-center gap-2"
            >
              {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
              {copied ? "Copied" : "Copy"}
            </motion.span>
          </AnimatePresence>
        </TapButton>
        <TapButton variant="tang" onClick={share} className="flex-1">
          <ShareIcon size={18} /> Share
        </TapButton>
      </div>

      <div className="relative mt-auto flex flex-col items-center pt-12 text-center">
        <div className="relative">
          <HeartBurst trigger={burst} />
          <motion.div
            animate={partner ? { scale: [1, 1.2, 1.1] } : { scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Couple size={200} />
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={partner ? "joined" : "waiting"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-8 text-xl font-bold"
          >
            {partner ? `${partner.name} flew in!` : "Waiting for your love to fly in..."}
          </motion.p>
        </AnimatePresence>
        {!partner && (
          <button
            onClick={() =>
              startLeaving(async () => {
                const res = await leaveEmptyNest();
                if ("ok" in res) router.replace(res.redirectTo);
              })
            }
            disabled={leaving}
            className="mt-6 text-sm font-medium text-white/70 underline underline-offset-4"
          >
            {leaving ? "Leaving..." : "Cancel this nest"}
          </button>
        )}
      </div>
    </main>
  );
}
