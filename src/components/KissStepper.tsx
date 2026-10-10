"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { MAX_KISSES, MIN_KISSES } from "@/lib/types";
import { HeartIcon, LipsIcon, MinusIcon, PlusIcon } from "./Icons";

type Props = {
  value: number;
  onChange: (value: number) => void;
  presets?: number[];
  tone?: "light" | "dark";
  step?: number;
};

export function KissStepper({ value, onChange, presets, tone = "light", step = 1 }: Props) {
  const direction = useRef(1);

  function set(next: number) {
    const clamped = Math.max(MIN_KISSES, Math.min(MAX_KISSES, next));
    if (clamped === value) return;
    direction.current = clamped > value ? 1 : -1;
    onChange(clamped);
  }

  const btn =
    tone === "light"
      ? "bg-ink text-white disabled:bg-ink/20"
      : "bg-white text-ink disabled:bg-white/30 disabled:text-ink/40";
  const text = tone === "light" ? "text-ink" : "text-white";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => set(value - step)}
          disabled={value <= MIN_KISSES}
          aria-label="Fewer kisses"
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${btn}`}
        >
          <MinusIcon />
        </motion.button>

        <div className={`relative flex flex-1 flex-col items-center ${text}`}>
          <div className="relative h-[4.5rem] w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction.current} mode="popLayout">
              <motion.span
                key={value}
                custom={direction.current}
                variants={{
                  enter: (d: number) => ({ y: d * 40, opacity: 0, scale: 0.7 }),
                  center: { y: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({ y: d * -40, opacity: 0, scale: 0.7 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="headline absolute inset-0 flex items-center justify-center text-[4rem] tabular-nums"
              >
                {value}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold opacity-70">
            <motion.span key={value} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="text-rose">
              <LipsIcon size={16} />
            </motion.span>
            kiss{value === 1 ? "" : "es"}
          </span>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => set(value + step)}
          disabled={value >= MAX_KISSES}
          aria-label="More kisses"
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${btn}`}
        >
          <PlusIcon />
        </motion.button>
      </div>

      {presets && (
        <div className="mt-4 flex justify-center gap-2">
          {presets.map((p) => (
            <motion.button
              type="button"
              key={p}
              whileTap={{ scale: 0.9 }}
              onClick={() => set(p)}
              className={`flex h-9 items-center gap-1 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                p === value
                  ? "bg-rose text-white"
                  : tone === "light"
                    ? "bg-cream text-ink"
                    : "bg-white/25 text-white"
              }`}
            >
              <HeartIcon size={12} /> {p}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
