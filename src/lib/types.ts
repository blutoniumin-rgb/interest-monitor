import type { DealStatus, NotificationType, OfferKind } from "@/db/schema";

export const MAX_ROUNDS = 6;
export const MIN_KISSES = 1;
export const MAX_KISSES = 999;

export type Person = { id: string; name: string; kissBalance: number };

/** Positive balance: kisses coming to you. Negative: kisses you still have to give. */
export function kissSide(balance: number) {
  if (balance < 0) return { amount: -balance, label: "to give" };
  if (balance > 0) return { amount: balance, label: "to get" };
  return { amount: 0, label: "all even" };
}

/** One plain line that sums up where the couple stands, from my point of view. */
export function standing(me: number, partnerName: string) {
  if (me > 0) return `You get ${me} kisses from ${partnerName}`;
  if (me < 0) return `You give ${-me} kisses to ${partnerName}`;
  return "All even. Time for a new deal?";
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
  totals: { mine: number; partner: number; all: number };
};

export type DealDetail = { deal: DealDTO; offers: OfferDTO[] };

export function isMyTurn(deal: DealDTO, meId: string) {
  return deal.status === "bargaining" && deal.lastOfferBy !== meId;
}
