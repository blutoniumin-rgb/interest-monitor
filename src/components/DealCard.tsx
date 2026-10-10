"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { categoryBg } from "@/lib/categories";
import { isMyTurn, MAX_ROUNDS, type DealDTO } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { CheckIcon, CloseIcon, HeartIcon } from "./Icons";

export function RoundsBar({ used, status, className = "w-28" }: { used: number; status: DealDTO["status"]; className?: string }) {
  const color = status === "sealed" ? "bg-tang" : status === "declined" ? "bg-mute" : used >= 4 ? "bg-grape" : "bg-sky";
  const pct = status === "sealed" ? 100 : (used / MAX_ROUNDS) * 100;
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-ink/8 ${className}`}>
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(pct, 8)}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function DealCard({
  deal,
  meId,
  creatorName,
  index = 0,
}: {
  deal: DealDTO;
  meId: string;
  creatorName: string;
  index?: number;
}) {
  const myTurn = isMyTurn(deal, meId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 8) * 0.025 }}
      whileTap={{ scale: 0.96 }}
      className="min-w-0"
    >
      <Link
        href={`/deal/${deal.id}`}
        className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] bg-white p-3 text-ink shadow-[0_14px_30px_-20px_rgba(0,0,0,0.5)]"
      >
        <RoundsBar used={deal.roundsUsed} status={deal.status} className="w-12" />

        <div
          className="relative mt-2 flex aspect-square items-center justify-center overflow-hidden rounded-[16px]"
          style={{ background: categoryBg(deal.emoji) }}
        >
          <CategoryIcon emoji={deal.emoji} size={68} />
          <StatusBadge status={deal.status} />
          {myTurn && (
            <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-rose px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white [animation:breathe_1.2s_ease-in-out_infinite]" />
              Turn
            </span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[2.4rem] text-[0.95rem] font-extrabold leading-[1.15] tracking-[-0.02em]">{deal.title}</h3>
        <p className="mt-0.5 truncate text-[11px] font-semibold text-mute">by {creatorName}</p>

        <div className="mt-1.5 flex items-center justify-between gap-1 text-xs">
          <span className="truncate font-medium text-mute">
            {deal.status === "bargaining" ? `Round ${deal.roundsUsed}/${MAX_ROUNDS}` : deal.status === "sealed" ? "Sealed" : "Declined"}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-rose">
            <HeartIcon size={14} />
            {deal.currentOffer}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: DealDTO["status"] }) {
  if (status === "bargaining") return null;
  const sealed = status === "sealed";
  return (
    <span
      className={`absolute right-2 top-2 flex h-6 w-6 -rotate-8 items-center justify-center rounded-full text-white ${sealed ? "bg-tang" : "bg-mute"}`}
      aria-label={sealed ? "Sealed" : "Declined"}
    >
      {sealed ? <CheckIcon size={14} /> : <CloseIcon size={14} />}
    </span>
  );
}
