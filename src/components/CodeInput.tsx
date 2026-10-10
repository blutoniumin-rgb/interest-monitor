"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  mode?: "numeric" | "alphanumeric";
  masked?: boolean;
  /** Change this value (e.g. a counter) to trigger a shake. */
  shakeKey?: number;
  tone?: "light" | "glass";
  autoFocus?: boolean;
  label: string;
};

export function CodeInput({
  length,
  value,
  onChange,
  onComplete,
  mode = "numeric",
  masked = false,
  shakeKey = 0,
  tone = "light",
  autoFocus,
  label,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const controls = useAnimationControls();

  useEffect(() => {
    if (shakeKey > 0) {
      controls.start({ x: [0, -12, 12, -9, 9, -4, 0], transition: { duration: 0.45 } });
    }
  }, [shakeKey, controls]);

  const clean = (s: string) =>
    mode === "numeric" ? s.replace(/\D/g, "") : s.toUpperCase().replace(/[^A-Z0-9]/g, "");

  function setAt(index: number, raw: string) {
    const chars = clean(raw);
    if (!chars) return;
    const next = (value.slice(0, index) + chars + value.slice(index + chars.length)).slice(0, length);
    onChange(next);
    const focusIndex = Math.min(index + chars.length, length - 1);
    refs.current[focusIndex]?.focus();
    if (next.length === length) onComplete?.(next);
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  const boxTone =
    tone === "light"
      ? "bg-cream/70 text-ink focus:bg-white focus:ring-tang"
      : "bg-white/25 text-white placeholder-white/50 focus:bg-white focus:text-ink focus:ring-white";

  return (
    <motion.div animate={controls} className="flex justify-between gap-2" role="group" aria-label={label}>
      {Array.from({ length }).map((_, i) => {
        const filled = Boolean(value[i]);
        return (
          <motion.input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={value[i] ? (masked ? "•" : value[i]) : ""}
            onChange={(e) => setAt(i, e.target.value.replace("•", ""))}
            onKeyDown={(e) => onKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            onPaste={(e) => {
              e.preventDefault();
              setAt(0, e.clipboardData.getData("text"));
            }}
            animate={{ scale: filled ? [1, 1.12, 1] : 1 }}
            transition={{ duration: 0.25 }}
            inputMode={mode === "numeric" ? "numeric" : "text"}
            autoComplete="one-time-code"
            autoCapitalize="characters"
            autoFocus={autoFocus && i === 0}
            aria-label={`${label} character ${i + 1}`}
            className={`aspect-square w-full min-w-0 rounded-2xl text-center text-2xl font-extrabold outline-none ring-0 transition-colors focus:ring-[3px] ${boxTone}`}
          />
        );
      })}
    </motion.div>
  );
}
