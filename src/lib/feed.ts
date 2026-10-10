import "server-only";
import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db, deals, nests, notifications, offers, users } from "@/db";
import type { DealDetail, DealDTO, Feed } from "./types";

type DealRow = typeof deals.$inferSelect;

function toDealDTO(d: DealRow): DealDTO {
  return {
    id: d.id,
    title: d.title,
    emoji: d.emoji,
    creatorId: d.creatorId,
    currentOffer: d.currentOffer,
    lastOfferBy: d.lastOfferBy,
    roundsUsed: d.roundsUsed,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

/** The user's nest id as a subquery, so every feed query can run in one batch without a prior lookup. */
const myNestId = (userId: string) => sql`(select ${users.nestId} from ${users} where ${users.id} = ${userId})`;

function feedQueries(userId: string) {
  const nestId = myNestId(userId);
  return [
    db().select({ id: users.id, name: users.name, nestId: users.nestId, kissBalance: users.kissBalance }).from(users).where(eq(users.id, userId)).limit(1),
    db().select().from(nests).where(eq(nests.id, nestId)).limit(1),
    db().select({ id: users.id, name: users.name, kissBalance: users.kissBalance }).from(users).where(eq(users.nestId, nestId)),
    db().select().from(deals).where(eq(deals.nestId, nestId)).orderBy(desc(deals.updatedAt)).limit(100),
    db()
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20),
    db()
      .select({ unread: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false))),
  ] as const;
}

const runFeed = (userId: string) => db().batch(feedQueries(userId));
type FeedRows = Awaited<ReturnType<typeof runFeed>>;

function toFeed([[me], [nest], members, dealRows, notes, [{ unread }]]: FeedRows): Feed | null {
  if (!me) return null;
  return {
    me: { id: me.id, name: me.name, kissBalance: me.kissBalance },
    partner: (() => {
      const p = members.find((m) => m.id !== me.id);
      return p ? { id: p.id, name: p.name, kissBalance: p.kissBalance } : null;
    })(),
    nest: nest ? { id: nest.id, code: nest.code, hostId: nest.hostId, totalKisses: nest.totalKisses } : null,
    deals: dealRows.map(toDealDTO),
    notifications: notes.map((n) => ({
      id: n.id,
      dealId: n.dealId,
      type: n.type,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
    unread,
  };
}

const NOTE_PAGE = 20;

export async function loadNotificationPage(userId: string, offset: number) {
  const rows = await db()
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(NOTE_PAGE + 1)
    .offset(offset);
  const hasMore = rows.length > NOTE_PAGE;
  const items = rows.slice(0, NOTE_PAGE).map((n) => ({
    id: n.id,
    dealId: n.dealId,
    type: n.type,
    message: n.message,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));
  return { items, nextOffset: hasMore ? offset + NOTE_PAGE : null };
}

/** Everything a screen needs in a single HTTP round trip to Neon. Returns null if the user no longer exists. */
export async function loadFeed(userId: string): Promise<Feed | null> {
  return toFeed(await runFeed(userId));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function dealQueries(userId: string, dealId: string) {
  const mine = and(eq(deals.id, dealId), eq(deals.nestId, myNestId(userId)));
  return [
    db().select().from(deals).where(mine).limit(1),
    db()
      .select()
      .from(offers)
      .where(and(eq(offers.dealId, dealId), inArray(offers.dealId, db().select({ id: deals.id }).from(deals).where(mine))))
      .orderBy(asc(offers.createdAt)),
  ] as const;
}

const runDeal = (userId: string, dealId: string) => db().batch(dealQueries(userId, dealId));
type DealRows = Awaited<ReturnType<typeof runDeal>>;

function toDetail([[deal], offerRows]: DealRows): DealDetail | null {
  if (!deal) return null;
  return {
    deal: toDealDTO(deal),
    offers: offerRows.map((o) => ({
      id: o.id,
      userId: o.userId,
      amount: o.amount,
      kind: o.kind,
      createdAt: o.createdAt.toISOString(),
    })),
  };
}

export async function loadDeal(userId: string, dealId: string): Promise<DealDetail | null> {
  if (!UUID.test(dealId)) return null;
  return toDetail(await runDeal(userId, dealId));
}

/** Feed plus one deal and its history, also in a single round trip. */
export async function loadFeedAndDeal(
  userId: string,
  dealId: string,
): Promise<{ feed: Feed | null; detail: DealDetail | null }> {
  if (!UUID.test(dealId)) return { feed: await loadFeed(userId), detail: null };
  const [dealRow, offerRows, ...rest] = await db().batch([...dealQueries(userId, dealId), ...feedQueries(userId)]);
  return {
    feed: toFeed(rest as unknown as FeedRows),
    detail: toDetail([dealRow, offerRows] as unknown as DealRows),
  };
}
