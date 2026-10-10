"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { NotificationDTO } from "@/lib/types";
import { useFeed } from "@/lib/useFeed";
import { BellIcon, CheckIcon, CloseIcon, HeartIcon, LipsIcon, SwapIcon } from "./Icons";

export function Bell() {
  const { data } = useFeed();
  const unread = data?.unread ?? 0;
  const controls = useAnimationControls();
  const prev = useRef(unread);

  useEffect(() => {
    if (unread > prev.current) {
      controls.start({ rotate: [0, -22, 18, -12, 8, -4, 0], transition: { duration: 0.8 } });
    }
    prev.current = unread;
  }, [unread, controls]);

  return (
    <>
      <Link
        href="/notes"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="glass relative flex h-12 w-12 items-center justify-center rounded-full text-white"
      >
        <motion.span animate={controls} style={{ originY: 0.1 }}>
          <BellIcon size={22} />
        </motion.span>
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key={unread}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 15 }}
              className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white ring-2 ring-white/40"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </>
  );
}

export function NotificationIcon({ type }: { type: NotificationDTO["type"] }) {
  const map = {
    new_deal: { bg: "bg-tang", icon: <LipsIcon size={18} /> },
    counter: { bg: "bg-grape", icon: <SwapIcon size={18} /> },
    sealed: { bg: "bg-sky", icon: <CheckIcon size={18} /> },
    declined: { bg: "bg-mute", icon: <CloseIcon size={18} /> },
    joined: { bg: "bg-rose", icon: <HeartIcon size={18} /> },
  } as const;
  const { bg, icon } = map[type];
  return <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${bg}`}>{icon}</span>;
}

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
