"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { logout } from "@/actions/auth";
import { Avatar } from "@/components/Avatar";
import { Bell } from "@/components/Bell";
import { Chips } from "@/components/Chips";
import { CountUp } from "@/components/CountUp";
import { LoveBuddy } from "@/components/Couple";
import { DealCard } from "@/components/DealCard";
import { HeartBurst } from "@/components/HeartBurst";
import { HeartIcon, LipsIcon, LogoutIcon, PlusIcon } from "@/components/Icons";
import { NewDealSheet } from "@/components/NewDealSheet";
import { isMyTurn, kissSide, standing, type Feed, type Person } from "@/lib/types";
import { useFeed } from "@/lib/useFeed";

const FILTERS = ["all", "turn", "bargaining", "sealed"] as const;
type Filter = (typeof FILTERS)[number];

export function HomeScreen({ initialFeed }: { initialFeed: Feed }) {
  const { data = initialFeed } = useFeed(initialFeed);
  const { me, partner, deals } = data;
  const mine = me.kissBalance;
  const [filter, setFilter] = useState<Filter>("all");
  const [direction, setDirection] = useState(0);

  function changeFilter(next: Filter) {
    setDirection(Math.sign(FILTERS.indexOf(next) - FILTERS.indexOf(filter)));
    setFilter(next);
  }
  const [sheetOpen, setSheetOpen] = useState(false);
  const [burst, setBurst] = useState(0);
  const pulse = useAnimationControls();
  const prevMine = useRef(mine);

  useEffect(() => {
    if (mine > prevMine.current) {
      setBurst((b) => b + 1);
      pulse.start({ scale: [1, 1.08, 1], transition: { duration: 0.45 } });
    }
    prevMine.current = mine;
  }, [mine, pulse]);

  const counts = useMemo(
    () => ({
      turn: deals.filter((d) => isMyTurn(d, me.id)).length,
      bargaining: deals.filter((d) => d.status === "bargaining").length,
      sealed: deals.filter((d) => d.status === "sealed").length,
    }),
    [deals, me.id],
  );

  const visible = useMemo(() => {
    switch (filter) {
      case "turn":
        return deals.filter((d) => isMyTurn(d, me.id));
      case "bargaining":
        return deals.filter((d) => d.status === "bargaining");
      case "sealed":
        return deals.filter((d) => d.status === "sealed");
      default:
        return deals;
    }
  }, [deals, filter, me.id]);

  return (
    <main className="relative min-h-dvh w-full bg-sky pb-36 text-white">
      <header className="flex items-center justify-between px-4 pt-safe min-[400px]:px-6">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            <Avatar name={me.name} />
            {partner && <Avatar name={partner.name} />}
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setSheetOpen(true)}
            aria-label="New Kiss Deal"
            className="glass flex h-11 w-11 items-center justify-center rounded-full"
          >
            <PlusIcon size={20} />
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <form action={logout}>
            <motion.button whileTap={{ scale: 0.88 }} aria-label="Log out" className="glass flex h-12 w-12 items-center justify-center rounded-full">
              <LogoutIcon size={20} />
            </motion.button>
          </form>
          <Bell />
        </div>
      </header>

      <section className="relative px-4 pt-6 min-[400px]:px-6">
        <p className="text-base font-medium text-white/75 min-[400px]:text-lg">
          {me.name} &amp; {partner?.name ?? "..."}&apos;s Love Nest
        </p>
        <div className="relative mt-4">
          <HeartBurst trigger={burst} count={26} />
          <motion.div animate={pulse} className="grid grid-cols-2 gap-3 pt-2">
            <BalanceCard person={me} you />
            <BalanceCard person={partner} />
          </motion.div>
          <p className="mx-auto mt-4 flex w-fit max-w-full items-center justify-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-center text-[13px] font-bold">
            <HeartIcon size={13} className="shrink-0 text-rose" />
            <span>{standing(mine, partner?.name ?? "Your love")}</span>
          </p>
        </div>
      </section>

      <section className="mt-7 px-4 min-[400px]:px-6">
        <div className="mb-3 flex items-center gap-2 text-xl font-bold">
          <LipsIcon size={22} />
          <span>
            Kiss <span className="text-white/55">Deals</span>
          </span>
        </div>
        <Chips<Filter>
          value={filter}
          onChange={changeFilter}
          items={[
            { id: "all", label: "All" },
            { id: "turn", label: "Your turn", count: counts.turn },
            { id: "bargaining", label: "Bargaining", count: counts.bargaining },
            { id: "sealed", label: "Sealed", count: counts.sealed },
          ]}
        />
      </section>

      <motion.section
        key={filter}
        initial={{ opacity: 0, x: direction * 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 px-4 pb-4 min-[400px]:px-6"
      >
        {visible.length === 0 ? (
          <EmptyCard filter={filter} onCreate={() => setSheetOpen(true)} />
        ) : (
          <div className="grid grid-cols-2 gap-2.5 min-[400px]:gap-3">
            {visible.map((d, i) => (
              <DealCard
                key={d.id}
                deal={d}
                meId={me.id}
                index={i}
                creatorName={d.creatorId === me.id ? "you" : (partner?.name ?? "your love")}
              />
            ))}
          </div>
        )}
      </motion.section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center bg-gradient-to-t from-sky via-sky/80 to-transparent px-4 pb-safe pt-10 min-[400px]:px-6 md:mx-auto md:max-w-[430px]">
        <motion.button
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => setSheetOpen(true)}
          className="pointer-events-auto mb-2 flex h-16 items-center gap-3 rounded-full bg-tang pl-3 pr-7 text-lg font-bold text-white shadow-[0_14px_30px_-10px_rgba(232,143,34,0.9)]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-tang">
            <PlusIcon size={22} />
          </span>
          New Kiss Deal
        </motion.button>
      </div>

      <NewDealSheet open={sheetOpen} onClose={() => setSheetOpen(false)} partnerName={partner?.name ?? "your love"} />
    </main>
  );
}

function BalanceCard({ person, you = false }: { person: Person | null; you?: boolean }) {
  const side = kissSide(person?.kissBalance ?? 0);
  const owed = (person?.kissBalance ?? 0) < 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: you ? -1.5 : 1.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileTap={{ scale: 0.96, rotate: 0 }}
      className={`relative min-w-0 rounded-[28px] px-3.5 pb-3.5 pt-5 shadow-[0_14px_26px_-14px_rgba(0,0,0,0.45)] ${
        you ? "bg-white text-ink" : "bg-tang text-white"
      }`}
    >
      <span className="absolute -top-3 left-3.5">
        <Avatar name={person?.name ?? "?"} size={34} />
      </span>
      <motion.span
        className={`absolute right-3 top-2.5 ${you ? "text-rose" : "text-white/80"}`}
        animate={{ scale: [1, 1.25, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <HeartIcon size={16} />
      </motion.span>
      <p className={`mt-2 truncate text-sm font-bold ${you ? "text-mute" : "text-white/90"}`}>{you ? "You" : (person?.name ?? "...")}</p>
      <p className={`headline mt-0.5 text-[clamp(2.4rem,12vw,3.4rem)] tabular-nums leading-none ${you ? "text-sky-deep" : ""}`}>
        <CountUp value={side.amount} />
      </p>
      <p
        className={`mt-2 inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase leading-tight tracking-wide ${
          you ? (owed ? "bg-grape-soft text-grape" : "bg-rose/15 text-rose") : "bg-white/25 text-white"
        }`}
      >
        {side.label}
      </p>
    </motion.div>
  );
}

function EmptyCard({ filter, onCreate }: { filter: Filter; onCreate: () => void }) {
  const copy = {
    all: { title: "No deals yet", body: "Snacks for 30 kisses? Make the first deal." },
    turn: { title: "All caught up", body: "Nothing is waiting on you right now." },
    bargaining: { title: "No haggling", body: "Every deal is settled. Start a new one?" },
    sealed: { title: "Nothing sealed", body: "Accept a deal to start filling your total." },
  }[filter];

  return (
    <motion.button
      onClick={onCreate}
      whileTap={{ scale: 0.97 }}
      className="flex w-full shrink-0 snap-start flex-col items-center rounded-[var(--radius-card)] border-2 border-dashed border-white/50 bg-white/10 px-6 py-10 text-center"
    >
      <LoveBuddy size={84} tone="cream" />
      <span className="headline mt-4 text-[1.8rem]">{copy.title}</span>
      <span className="mt-2 text-sm text-white/80">{copy.body}</span>
    </motion.button>
  );
}
