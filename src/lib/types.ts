import type { DealStatus, NotificationType, OfferKind } from "@/db/schema";

export const MAX_ROUNDS = 6;
export const MIN_KISSES = 1;
export const MAX_KISSES = 999;

export type Person = { id: string; name: string; kissBalance: number };

/** Positive balance means your love owes you kisses. Negative means you owe them. */
export function kissSide(balance: number) {
  return { amount: Math.abs(balance), label: balance < 0 ? "interest owed" : "interest won" };
}

/** One cute line that sums up where the couple stands, from my point of view. */
export function standing(me: number, partnerName: string) {
  if (me > 0) return `${partnerName} owes you ${me} interest`;
  if (me < 0) return `You owe ${partnerName} ${-me} interest`;
  return "All squared up. Time for a new deal?";
}

export type DealDTO = {
  id: string;
  title: string;
  emoji: string;
  creatorId: string;
  currentOffer: number;
  lastOfferBy: string;
  roundsUsed: number;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
};

export type OfferDTO = {
  id: string;
  userId: string;
  amount: number;
  kind: OfferKind;
  createdAt: string;
};

export type NotificationDTO = {
  id: string;
  dealId: string | null;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
};

export type Feed = {
  me: Person;
  partner: Person | null;
  nest: { id: string; code: string; hostId: string; totalKisses: number } | null;
  deals: DealDTO[];
  notifications: NotificationDTO[];
  unread: number;
};

export type DealDetail = { deal: DealDTO; offers: OfferDTO[] };

export function isMyTurn(deal: DealDTO, meId: string) {
  return deal.status === "bargaining" && deal.lastOfferBy !== meId;
}
