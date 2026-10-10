"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getStarted } from "@/actions/auth";
import { CodeInput } from "@/components/CodeInput";
import { TapButton } from "@/components/TapButton";
import { HeartIcon } from "@/components/Icons";

export function WelcomeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [pending, startTransition] = useTransition();

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await getStarted(name, pin);
      if ("error" in res) {
        setError(res.error);
        setShake((s) => s + 1);
        setPin("");
        return;
      }
      router.replace(res.redirectTo);
    });
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
      className="relative rounded-[var(--radius-card)] bg-white p-5 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)]"
    >
      <label className="block text-sm font-semibold text-mute" htmlFor="name">
        Your name
      </label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Francis"
        maxLength={24}
        autoComplete="nickname"
        className="mt-2 h-14 w-full rounded-2xl bg-cream/70 px-4 text-xl font-bold outline-none transition-colors placeholder:text-mute/60 focus:bg-white focus:ring-[3px] focus:ring-tang"
      />

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-mute">Your secret love code</span>
        <span className="text-xs text-mute/80">4 digits</span>
      </div>
      <div className="mt-2">
        <CodeInput length={4} value={pin} onChange={setPin} masked shakeKey={shake} label="Love code" />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-3 text-sm font-medium text-rose"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <TapButton
        type="submit"
        variant="tang"
        size="lg"
        loading={pending}
        disabled={name.trim().length < 2 || pin.length !== 4}
        className="mt-5 w-full"
      >
        Get Started <HeartIcon size={18} />
      </TapButton>
      <p className="mt-3 text-center text-xs text-mute">New name creates your account. Same name and code logs you back in.</p>
    </motion.form>
  );
}
