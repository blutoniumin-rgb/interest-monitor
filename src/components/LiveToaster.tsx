"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NotificationDTO } from "@/lib/types";
import { useFeed } from "@/lib/useFeed";
import { NotificationIcon } from "./Bell";

const TOAST_MS = 4500;

export function LiveToaster() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, error } = useFeed();
  const seen = useRef<Set<string> | null>(null);
  const [toast, setToast] = useState<NotificationDTO | null>(null);

  useEffect(() => {
    if (error && "status" in error && error.status === 401) router.replace("/logout");
  }, [error, router]);

  useEffect(() => {
    if (!data) return;
    if (!seen.current) {
      seen.current = new Set(data.notifications.map((n) => n.id));
      return;
    }
    const fresh = data.notifications.filter((n) => !n.read && !seen.current!.has(n.id));
    data.notifications.forEach((n) => seen.current!.add(n.id));
    const latest = fresh.find((n) => !(n.dealId && pathname === `/deal/${n.dealId}`));
    if (latest) setToast(latest);
  }, [data, pathname, router]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-safe md:left-1/2 md:w-full md:max-w-[430px] md:-translate-x-1/2">
      <AnimatePresence>
        {toast && (
          <motion.button
            key={toast.id}
            initial={{ y: -120, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -120, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.6, bottom: 0 }}
            onDragEnd={(_, info) => info.offset.y < -40 && setToast(null)}
            onClick={() => {
              setToast(null);
              router.push(toast.dealId ? `/deal/${toast.dealId}` : "/home");
            }}
            className="pointer-events-auto flex w-full items-center gap-3 rounded-[24px] bg-white p-3 pr-4 text-left text-ink shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
          >
            <motion.span
              animate={{ rotate: [0, -14, 14, -8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <NotificationIcon type={toast.type} />
            </motion.span>
            <span className="flex-1">
              <span className="block text-xs font-semibold uppercase tracking-wide text-mute">Kiss Monitor</span>
              <span className="block text-[15px] font-semibold leading-snug">{toast.message}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
