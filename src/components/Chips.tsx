"use client";

import { motion } from "framer-motion";

type Chip<T extends string> = { id: T; label: string; count?: number };

export function Chips<T extends string>({
  items,
  value,
  onChange,
  layoutId = "chip",
}: {
  items: Chip<T>[];
  value: T;
  onChange: (id: T) => void;
  layoutId?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 py-1" role="tablist">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <motion.button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            whileTap={{ scale: 0.92 }}
            className={`relative h-10 shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors ${active ? "text-white" : "glass text-white"}`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-tang shadow-[0_6px_16px_-6px_rgba(232,143,34,0.8)]"
                transition={{ type: "spring", stiffness: 700, damping: 45, mass: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {item.label}
              {item.count ? (
                <span className={`rounded-full px-1.5 text-xs font-bold ${active ? "bg-white text-tang-deep" : "bg-white/30"}`}>
                  {item.count}
                </span>
              ) : null}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
