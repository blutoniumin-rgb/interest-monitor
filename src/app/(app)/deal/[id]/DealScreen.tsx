"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { mutate } from "swr";
import { acceptDeal, counterDeal, declineDeal, markDealNotificationsRead, type DealResult } from "@/actions/deals";
import { Avatar } from "@/components/Avatar";
import { Bell } from "@/components/Bell";
import { RoundsBar } from "@/components/DealCard";
import { HeartBurst } from "@/components/HeartBurst";
import { BackIcon, CheckIcon, CloseIcon, HeartIcon, LipsIcon, SwapIcon } from "@/components/Icons";
import { KissStepper } from "@/components/KissStepper";
import { TapButton } from "@/components/TapButton";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryBg } from "@/lib/categories";
import { isMyTurn, MAX_ROUNDS, type DealDetail, type DealDTO, type Feed, type OfferDTO, type Person } from "@/lib/types";
import { useDeal, useFeed } from "@/lib/useFeed";

const dateFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });

export function DealScreen({ id, initialDetail, initialFeed }: { id: string; initialDetail: DealDetail; initialFeed: Feed }) {
  const { data: detail = initialDetail } = useDeal(id, initialDetail);
  const { data: feed = initialFeed } = useFeed(initialFeed);
  const { deal, offers } = detail;
  const me = feed.me;
  const partner: Person = feed.partner ?? { id: "", name: "Your love", kissBalance: 0 };
  const nameOf = (userId: string) => (userId === me.id ? "You" : partner.name);

  const [burst, setBurst] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const prevStatus = useRef(deal.status);

  useEffect(() => {
    if (prevStatus.current === "bargaining" && deal.status === "sealed") setBurst((b) => b + 1);
    prevStatus.current = deal.status;
  }, [deal.status]);

  useEffect(() => {
    markDealNotificationsRead(id).then(() => mutate("/api/feed"));
  }, [id, deal.updatedAt]);

  const chatRef = useRef<HTMLElement>(null);
  const scrolledOnce = useRef(false);
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: scrolledOnce.current ? "smooth" : "auto" });
    scrolledOnce.current = true;
  }, [offers.length]);

  const roundsLeft = MAX_ROUNDS - deal.roundsUsed;

  return (
    <main className="relative flex h-dvh flex-col overflow-hidden bg-tang text-white md:h-[calc(100dvh-3rem)]">
      <header className="flex shrink-0 items-center justify-between px-6 pt-safe">
        <motion.div whileTap={{ scale: 0.88 }}>
          <Link href="/home" aria-label="Back to home" className="glass flex h-12 w-12 items-center justify-center rounded-full">
            <BackIcon size={22} />
          </Link>
        </motion.div>
        <Bell />
      </header>

      <section className="shrink-0 px-6 pt-4">
        <p className="text-sm font-medium text-white/70" suppressHydrationWarning>
          {dateFmt.format(new Date(deal.createdAt))} · by {nameOf(deal.creatorId)}
        </p>
        <h1 className="headline mt-1 line-clamp-2 text-[2.3rem] break-words">{deal.title}</h1>
      </section>

      <section className="shrink-0 px-6 pt-4">
        <div className="relative flex items-center gap-4 rounded-[var(--radius-card)] bg-white px-5 py-4 text-ink">
          <HeartBurst trigger={burst} count={28} />
          <div className="flex-1">
            <RoundsBar used={deal.roundsUsed} status={deal.status} className="w-full" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-mute">
              {deal.status === "bargaining"
                ? `Round ${deal.roundsUsed} of ${MAX_ROUNDS}`
                : deal.status === "sealed"
                  ? "Sealed with a kiss"
                  : "Declined"}
            </p>
            <div className="mt-2 flex items-end gap-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={deal.currentOffer}
                  initial={{ y: 30, opacity: 0, scale: 0.6 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="headline text-[3rem] tabular-nums"
                >
                  {deal.currentOffer}
                </motion.span>
              </AnimatePresence>
              <span className="mb-2 flex items-center gap-1 font-semibold text-rose">
                <LipsIcon size={20} /> kisses
              </span>
            </div>
            <p className="text-sm text-mute">
              {deal.status === "bargaining" ? `On the table from ${nameOf(deal.lastOfferBy)}` : `Final price`}
            </p>
          </div>
          <motion.div
            className="flex h-24 w-20 shrink-0 items-center justify-center rounded-[20px] text-[2.8rem]"
            style={{ background: categoryBg(deal.emoji) }}
            animate={deal.status === "sealed" ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : { y: [0, -5, 0] }}
            transition={{ duration: deal.status === "sealed" ? 0.8 : 2.6, repeat: deal.status === "sealed" ? 0 : Infinity }}
          >
            <CategoryIcon emoji={deal.emoji} size={52} />
          </motion.div>
        </div>
      </section>

      <h2 className="shrink-0 px-6 pb-1 pt-4 text-lg font-bold">Bargain story</h2>
      <section
        ref={chatRef}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-none px-6 pb-6 pt-3 [mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]"
      >
        <ol className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {offers.map((o) => (
              <OfferBubble key={o.id} offer={o} mine={o.userId === me.id} name={o.userId === me.id ? me.name : partner.name} />
            ))}
          </AnimatePresence>
        </ol>
      </section>

      <AnimatePresence>
        {actionError && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-6 mb-2 shrink-0 rounded-2xl bg-white/90 px-4 py-2.5 text-center text-sm font-semibold text-rose"
          >
            {actionError}
          </motion.p>
        )}
      </AnimatePresence>
      <ActionPanel
        key={`${deal.currentOffer}-${deal.status}-${deal.lastOfferBy}`}
        dealId={deal.id}
        meId={me.id}
        onError={setActionError}
        myTurn={isMyTurn(deal, me.id)}
        status={deal.status}
        currentOffer={deal.currentOffer}
        roundsLeft={roundsLeft}
        partnerName={partner.name}
        iEarn={deal.creatorId === me.id}
      />
    </main>
  );
}

function OfferBubble({ offer, mine, name }: { offer: OfferDTO; mine: boolean; name: string }) {
  const text = {
    open: `Asked for ${offer.amount}`,
    counter: `Countered with ${offer.amount}`,
    accept: `Accepted ${offer.amount}`,
    decline: "Declined the deal",
  }[offer.kind];
  const icon = {
    open: <LipsIcon size={16} />,
    counter: <SwapIcon size={16} />,
    accept: <CheckIcon size={16} />,
    decline: <CloseIcon size={16} />,
  }[offer.kind];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}
    >
      <Avatar name={name} size={32} ring={false} />
      <div
        className={`max-w-[75%] rounded-[22px] px-4 py-2.5 ${
          mine ? "rounded-br-md bg-white text-ink" : "glass rounded-bl-md text-white"
        }`}
      >
        <p className="flex items-center gap-1.5 text-[15px] font-semibold">
          {icon}
          {text}
        </p>
      </div>
    </motion.li>
  );
}

type ActionKind = "accept" | "counter" | "decline";

function applyOptimistic(dealId: string, meId: string, kind: ActionKind, amount: number) {
  const now = new Date().toISOString();
  const patchDeal = (d: DealDTO): DealDTO =>
    kind === "counter"
      ? { ...d, currentOffer: amount, lastOfferBy: meId, roundsUsed: d.roundsUsed + 1, updatedAt: now }
      : { ...d, status: kind === "accept" ? "sealed" : "declined", updatedAt: now };

  mutate<DealDetail>(
    `/api/deals/${dealId}`,
    (detail) =>
      detail && {
        deal: patchDeal(detail.deal),
        offers: [
          ...detail.offers,
          { id: `optimistic-${now}`, userId: meId, amount: kind === "counter" ? amount : detail.deal.currentOffer, kind, createdAt: now },
        ],
      },
    { revalidate: false },
  );
  mutate<Feed>(
    "/api/feed",
    (feed) => {
      if (!feed) return feed;
      const target = feed.deals.find((d) => d.id === dealId);
      return {
        ...feed,
        deals: feed.deals.map((d) => (d.id === dealId ? patchDeal(d) : d)),
        me:
          kind === "accept" && target
            ? { ...feed.me, kissBalance: feed.me.kissBalance + (target.creatorId === meId ? target.currentOffer : -target.currentOffer) }
            : feed.me,
        partner:
          kind === "accept" && target && feed.partner
            ? {
                ...feed.partner,
                kissBalance: feed.partner.kissBalance + (target.creatorId === feed.partner.id ? target.currentOffer : -target.currentOffer),
              }
            : feed.partner,
        nest:
          feed.nest && kind === "accept" && target
            ? { ...feed.nest, totalKisses: feed.nest.totalKisses + target.currentOffer }
            : feed.nest,
      };
    },
    { revalidate: false },
  );
}

function ActionPanel({
  dealId,
  meId,
  myTurn,
  status,
  currentOffer,
  roundsLeft,
  partnerName,
  iEarn,
  onError,
}: {
  dealId: string;
  meId: string;
  myTurn: boolean;
  status: DealDetail["deal"]["status"];
  currentOffer: number;
  roundsLeft: number;
  partnerName: string;
  iEarn: boolean;
  onError: (message: string | null) => void;
}) {
  const [amount, setAmount] = useState(currentOffer);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<ActionKind | null>(null);

  function run(kind: ActionKind, action: () => Promise<DealResult>) {
    onError(null);
    setBusy(kind);
    applyOptimistic(dealId, meId, kind, amount);
    startTransition(async () => {
      try {
        const res = await action();
        if ("error" in res) onError(res.error);
      } catch {
        onError("Couldn't reach the server. Try again.");
      }
      await Promise.all([mutate(`/api/deals/${dealId}`), mutate("/api/feed")]);
    });
  }

  const panel = "relative z-20 shrink-0 rounded-t-[32px] bg-white px-6 pb-safe pt-5 text-ink shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.3)]";

  if (status === "sealed") {
    return (
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className={panel}>
        <div className="flex items-center gap-4 pb-2">
          <motion.span
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-rose text-white"
          >
            <HeartIcon size={28} />
          </motion.span>
          <div>
            <p className="headline text-[1.6rem]">Sealed with a kiss</p>
            <p className="text-sm text-mute">
              {iEarn ? `You get ${currentOffer} kisses from ${partnerName}` : `You give ${partnerName} ${currentOffer} kisses`}
            </p>
          </div>
        </div>
        <Link href="/home" className="mt-3 flex h-12 items-center justify-center rounded-full bg-sky font-semibold text-white">
          Back to our nest
        </Link>
      </motion.div>
    );
  }

  if (status === "declined") {
    return (
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className={panel}>
        <p className="headline text-[1.6rem]">This deal was declined</p>
        <p className="mt-1 text-sm text-mute">No kisses changed hands. Try a sweeter offer?</p>
        <Link href="/home" className="mt-4 flex h-12 items-center justify-center rounded-full bg-tang font-semibold text-white">
          Make a new deal
        </Link>
      </motion.div>
    );
  }

  if (!myTurn) {
    return (
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className={panel}>
        <div className="flex items-center gap-4 pb-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tang-soft text-rose">
            <HeartIcon size={28} className="animate-breathe" />
          </span>
          <div>
            <p className="text-lg font-bold">Waiting for {partnerName}</p>
            <p className="text-sm text-mute">
              Your offer of {currentOffer} is on the table.{" "}
              {roundsLeft > 0 ? `${roundsLeft} counter-offer${roundsLeft === 1 ? "" : "s"} left.` : "It's the final offer."}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const canCounter = roundsLeft > 0;
  const changed = amount !== currentOffer;

  return (
    <motion.div initial={{ y: 120 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} className={panel}>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">Your turn</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${canCounter ? "bg-grape-soft text-grape" : "bg-rose/15 text-rose"}`}
        >
          {canCounter ? `${roundsLeft} of ${MAX_ROUNDS} counters left` : "Final offer"}
        </span>
      </div>

      {canCounter ? (
        <div className="mt-3">
          <KissStepper value={amount} onChange={setAmount} />
        </div>
      ) : (
        <p className="mt-2 text-sm text-mute">No more bargaining. Accept {currentOffer} kisses or decline the deal.</p>
      )}

      <div className="mt-4 flex gap-3">
        <AnimatePresence mode="wait" initial={false}>
          {changed && canCounter ? (
            <motion.div key="counter" className="flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <TapButton
                variant="grape"
                size="lg"
                className="w-full"
                loading={pending && busy === "counter"}
                disabled={pending}
                onClick={() => run("counter", () => counterDeal(dealId, amount))}
              >
                <SwapIcon size={20} /> Counter with {amount}
              </TapButton>
            </motion.div>
          ) : (
            <motion.div key="accept" className="flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <TapButton
                variant="sky"
                size="lg"
                className="w-full"
                loading={pending && busy === "accept"}
                disabled={pending}
                onClick={() => run("accept", () => acceptDeal(dealId))}
              >
                <CheckIcon size={20} /> Accept {currentOffer}
              </TapButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-6 py-2">
        {changed && canCounter && (
          <button onClick={() => setAmount(currentOffer)} className="text-sm font-semibold text-sky">
            Reset to {currentOffer}
          </button>
        )}
        <button
          onClick={() => run("decline", () => declineDeal(dealId))}
          disabled={pending}
          className="text-sm font-semibold text-mute disabled:opacity-50"
        >
          {pending && busy === "decline" ? "Declining..." : "Decline deal"}
        </button>
      </div>
    </motion.div>
  );
}
