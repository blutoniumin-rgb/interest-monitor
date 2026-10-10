"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { markNotificationsRead } from "@/actions/deals";
import { NotificationIcon, timeAgo } from "@/components/Bell";
import { LoveBuddy } from "@/components/Couple";
import { BackIcon } from "@/components/Icons";
import { TapButton } from "@/components/TapButton";
import type { Feed, NotificationDTO } from "@/lib/types";

type Page = { items: NotificationDTO[]; nextOffset: number | null };

export function NotesScreen({ initial }: { initial: Page }) {
  const [items, setItems] = useState(initial.items);
  const [nextOffset, setNextOffset] = useState(initial.nextOffset);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    markNotificationsRead().then(() =>
      mutate<Feed>("/api/feed", (f) => f && { ...f, unread: 0, notifications: f.notifications.map((n) => ({ ...n, read: true })) }),
    );
  }, []);

  async function loadMore() {
    if (nextOffset == null || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notifications?offset=${nextOffset}`);
      if (!res.ok) throw new Error("load failed");
      const page = (await res.json()) as Page;
      setItems((prev) => [...prev, ...page.items]);
      setNextOffset(page.nextOffset);
    } catch {
      setError("Couldn't load more. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-sky pb-10 text-white">
      <header className="flex items-center gap-3 px-4 pt-safe min-[400px]:px-6">
        <motion.div whileTap={{ scale: 0.88 }}>
          <Link href="/home" aria-label="Back to home" className="glass flex h-12 w-12 items-center justify-center rounded-full">
            <BackIcon size={22} />
          </Link>
        </motion.div>
        <div>
          <p className="text-sm font-medium text-white/70">Your nest</p>
          <h1 className="headline text-[2rem]">Love notes</h1>
        </div>
      </header>

      <section className="mt-6 px-4 min-[400px]:px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center rounded-[28px] bg-white px-6 py-14 text-center text-ink">
            <LoveBuddy size={88} tone="orange" />
            <p className="headline mt-3 text-[1.7rem]">Nothing yet</p>
            <p className="mt-1 text-sm text-mute">Make a deal and the notes will land here.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {items.map((n, i) => (
              <motion.li key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.03 }}>
                <Link
                  href={n.dealId ? `/deal/${n.dealId}` : "/home"}
                  className={`flex items-center gap-3 rounded-[22px] p-3.5 text-ink shadow-[0_12px_24px_-18px_rgba(0,0,0,0.45)] ${n.read ? "bg-white" : "bg-tang-soft"}`}
                >
                  <NotificationIcon type={n.type} />
                  <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug">{n.message}</span>
                  <span className="shrink-0 text-xs font-medium text-mute" suppressHydrationWarning>
                    {timeAgo(n.createdAt)}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}

        {nextOffset != null && (
          <TapButton type="button" variant="tang" loading={loading} onClick={loadMore} className="mt-5 w-full">
            Load more
          </TapButton>
        )}
        {error && <p className="mt-3 text-center text-sm font-semibold">{error}</p>}
      </section>
    </main>
  );
}
