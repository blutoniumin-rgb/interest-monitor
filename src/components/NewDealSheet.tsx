"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { mutate } from "swr";
import { createDeal } from "@/actions/deals";
import { CATEGORIES, categoryBg } from "@/lib/categories";
import { BottomSheet } from "./BottomSheet";
import { CategoryIcon } from "./CategoryIcon";
import { HeartIcon } from "./Icons";
import { KissStepper } from "./KissStepper";
import { TapButton } from "./TapButton";

export function NewDealSheet({ open, onClose, partnerName }: { open: boolean; onClose: () => void; partnerName: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState<string>(CATEGORIES[0].emoji);
  const [amount, setAmount] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function pick(c: (typeof CATEGORIES)[number]) {
    const wasDefault = !title || CATEGORIES.some((x) => x.label === title);
    setEmoji(c.emoji);
    if (wasDefault && c.label !== "Other") setTitle(c.label);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createDeal({ title, emoji, amount });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      await mutate("/api/feed");
      setTitle("");
      setAmount(10);
      onClose();
      router.push(`/deal/${res.dealId}`);
    });
  }

  return (
    <BottomSheet open={open} onClose={onClose} className="bg-tang text-white" label="New Kiss Deal">
      <form onSubmit={submit} className="px-6 pb-4">
        <p className="text-sm font-medium text-white/80">Propose to {partnerName}</p>
        <h2 className="headline mt-1 text-[2.4rem]">New Kiss Deal</h2>

        <label htmlFor="deal-title" className="mt-5 block text-sm font-semibold text-white/85">
          What&apos;s the deal?
        </label>
        <input
          id="deal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
          placeholder="Snacks from the store"
          className="mt-2 h-14 w-full rounded-2xl bg-white px-4 text-lg font-bold text-ink outline-none placeholder:font-medium placeholder:text-mute/70 focus:ring-[3px] focus:ring-white/60"
        />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {CATEGORIES.map((c) => {
            const active = c.emoji === emoji;
            return (
              <motion.button
                key={c.emoji}
                type="button"
                onClick={() => pick(c)}
                whileTap={{ scale: 0.94 }}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[20px] px-1 py-2 transition-colors ${
                  active ? "bg-white text-ink shadow-lg" : "bg-white/20 text-white"
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[16px]" style={{ background: categoryBg(c.emoji) }}>
                  <CategoryIcon emoji={c.emoji} size={32} />
                </span>
                <span className="w-full text-center text-[10px] font-bold leading-tight">{c.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[var(--radius-card)] bg-white p-5">
          <p className="text-center text-sm font-semibold text-mute">Asking price</p>
          <div className="mt-2">
            <KissStepper value={amount} onChange={setAmount} presets={[5, 10, 20, 30, 50]} />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden text-center text-sm font-semibold"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <TapButton type="submit" variant="ink" size="lg" loading={pending} disabled={title.trim().length < 2} className="mt-5 w-full">
          Send deal <HeartIcon size={18} className="text-rose" />
        </TapButton>
        <p className="mt-3 text-center text-xs text-white/75">
          {partnerName} can accept or bargain. Up to 6 counter-offers between you.
        </p>
      </form>
    </BottomSheet>
  );
}
