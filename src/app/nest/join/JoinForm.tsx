"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { flyIntoNest } from "@/actions/nest";
import { CodeInput } from "@/components/CodeInput";
import { Couple } from "@/components/Couple";
import { FloatingHearts } from "@/components/FloatingHearts";
import { HeartBurst } from "@/components/HeartBurst";
import { BackIcon, HeartIcon } from "@/components/Icons";
import { TapButton } from "@/components/TapButton";

export function JoinForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [burst, setBurst] = useState(0);
  const [pending, startTransition] = useTransition();

  function submit(value = code) {
    if (value.length !== 6 || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await flyIntoNest(value);
      if ("error" in res) {
        setError(res.error);
        setShake((s) => s + 1);
        return;
      }
      setBurst((b) => b + 1);
      setTimeout(() => router.replace(res.redirectTo), 1100);
    });
  }

  return (
    <main className="relative flex min-h-dvh flex-col bg-tang px-6 pt-safe pb-safe text-white">
      <FloatingHearts />
      <Link href="/nest" aria-label="Back" className="glass relative flex h-11 w-11 items-center justify-center rounded-full">
        <BackIcon size={20} />
      </Link>

      <div className="relative mt-8">
        <p className="text-lg font-medium text-white/80">Ask your love for their code</p>
        <h1 className="headline mt-2 text-[3rem]">Fly into their Nest</h1>
      </div>

      <form
        className="relative mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <CodeInput
          length={6}
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(null);
          }}
          onComplete={submit}
          mode="alphanumeric"
          tone="glass"
          shakeKey={shake}
          autoFocus
          label="Nest code"
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 rounded-2xl bg-white/20 px-4 py-3 text-sm font-semibold"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="relative mt-8">
          <HeartBurst trigger={burst} />
          <TapButton type="submit" variant="white" size="lg" loading={pending} disabled={code.length !== 6} className="w-full">
            Fly in <HeartIcon size={18} className="text-rose" />
          </TapButton>
        </div>
      </form>

      <div className="relative mt-auto flex justify-center pt-10">
        <Couple size={210} />
      </div>
    </main>
  );
}
