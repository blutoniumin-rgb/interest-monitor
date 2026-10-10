"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeartIcon, LipsIcon } from "./Icons";

const COLORS = ["#ff5a7a", "#ffffff", "#f5a53b", "#9b3bf0", "#ff8fab", "#4a9df4"];

type Particle = { id: number; x: number; y: number; rotate: number; size: number; color: string; lips: boolean; delay: number };

function makeParticles(count: number, seed: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const distance = 90 + Math.random() * 130;
    return {
      id: seed * 1000 + i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 60,
      rotate: Math.random() * 120 - 60,
      size: 14 + Math.random() * 18,
      color: COLORS[i % COLORS.length],
      lips: i % 4 === 0,
      delay: Math.random() * 0.12,
    };
  });
}

/** Fires a burst of hearts and lips from its center each time `trigger` increases. */
export function HeartBurst({ trigger, count = 22 }: { trigger: number; count?: number }) {
  const reduce = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;
    setParticles(makeParticles(reduce ? 6 : count, trigger));
    const t = setTimeout(() => setParticles([]), 1600);
    return () => clearTimeout(t);
  }, [trigger, count, reduce]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 h-0 w-0" aria-hidden>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ color: p.color, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: [0, p.y, p.y + 80],
              scale: [0, 1.2, 0.9],
              opacity: [1, 1, 0],
              rotate: p.rotate,
            }}
            transition={{ duration: 1.3, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {p.lips ? <LipsIcon size={p.size} /> : <HeartIcon size={p.size} />}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
