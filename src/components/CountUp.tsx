"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const first = useRef(true);
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: first.current ? 1.2 : 0.9,
      ease: [0.16, 1, 0.3, 1],
    });
    first.current = false;
    return () => controls.stop();
  }, [value, mv]);

  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>;
}
