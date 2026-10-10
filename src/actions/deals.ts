"use server";

import { and, eq, sql } from "drizzle-orm";
import { db, notifications } from "@/db";
import { getSessionUserId } from "@/lib/session";
import { MAX_KISSES, MAX_ROUNDS, MIN_KISSES } from "@/lib/types";

export type DealResult = { error: string } | { ok: true; dealId: string; totalKisses?: number };

type Couple = { userId: string; userName: string; nestId: string; partnerId: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** One query: me, my nest and my partner. */
async function requireCouple(dealId?: string): Promise<Couple | null> {
  if (dealId !== undefined && !UUID.test(dealId)) return null;
  const userId = await getSessionUserId();
  if (!userId) return null;
  const { rows } = await db().execute<{ name: string; nest_id: string | null; partner_id: string | null }>(sql`
    select me.name, me.nest_id, p.id as partner_id
    from users me
    left join users p on p.nest_id = me.nest_id and p.id <> me.id
    where me.id = ${userId}
    limit 1`);
  const row = rows[0];
  if (!row?.nest_id || !row.partner_id) return null;
  return { userId, userName: row.name, nestId: row.nest_id, partnerId: row.partner_id };
}

function validAmount(n: number) {
  return Number.isInteger(n) && n >= MIN_KISSES && n <= MAX_KISSES;
}

const kisses = (n: number) => `${n} kiss${n === 1 ? "" : "es"}`;
const NO_COUPLE = { error: "You need your love in the nest first." };

export async function createDeal(input: { title: string; emoji: string; amount: number }): Promise<DealResult> {
  const title = input.title.trim().replace(/\s+/g, " ").slice(0, 60);
  const emoji = Array.from(input.emoji.trim()).slice(0, 2).join("") || "💋";
  if (title.length < 2) return { error: "Give your deal a name." };
  if (!validAmount(input.amount)) return { error: `Kisses must be between ${MIN_KISSES} and ${MAX_KISSES}.` };

  const c = await requireCouple();
  if (!c) return NO_COUPLE;

  const message = `${c.userName} wants ${kisses(input.amount)} for ${title}`;
  const { rows } = await db().execute<{ id: string }>(sql`
    with d as (
      insert into deals (nest_id, title, emoji, creator_id, current_offer, last_offer_by)
      values (${c.nestId}::uuid, ${title}, ${emoji}, ${c.userId}::uuid, ${input.amount}::int, ${c.userId}::uuid)
      returning id
    ), o as (
      insert into offers (deal_id, user_id, amount, kind)
      select id, ${c.userId}::uuid, ${input.amount}::int, 'open' from d
    ), n as (
      insert into notifications (user_id, deal_id, type, message)
      select ${c.partnerId}::uuid, id, 'new_deal', ${message}::text from d
    )
    select id from d`);
  return { ok: true, dealId: rows[0].id };
}

export async function counterDeal(dealId: string, amount: number): Promise<DealResult> {
  if (!validAmount(amount)) return { error: `Kisses must be between ${MIN_KISSES} and ${MAX_KISSES}.` };
  const c = await requireCouple(dealId);
  if (!c) return NO_COUPLE;

  const prefix = `${c.userName} countered `;
  const suffix = ` with ${kisses(amount)}`;
  const { rows } = await db().execute<{ id: string }>(sql`
    with u as (
      update deals set
        current_offer = ${amount}::int,
        last_offer_by = ${c.userId}::uuid,
        rounds_used = rounds_used + 1,
        updated_at = now()
      where id = ${dealId}::uuid
        and nest_id = ${c.nestId}::uuid
        and status = 'bargaining'
        and last_offer_by <> ${c.userId}::uuid
        and rounds_used < ${MAX_ROUNDS}::int
        and current_offer <> ${amount}::int
      returning id, title, rounds_used
    ), o as (
      insert into offers (deal_id, user_id, amount, kind)
      select id, ${c.userId}::uuid, ${amount}::int, 'counter' from u
    ), n as (
      insert into notifications (user_id, deal_id, type, message)
      select ${c.partnerId}::uuid, id, 'counter',
        ${prefix}::text || title || ${suffix}::text
          || case when rounds_used >= ${MAX_ROUNDS}::int then ' (final offer)' else '' end
      from u
    )
    select id from u`);

  if (rows.length === 0) return { error: "This deal can't be countered right now. It may have changed." };
  return { ok: true, dealId };
}

export async function acceptDeal(dealId: string): Promise<DealResult> {
  const c = await requireCouple(dealId);
  if (!c) return NO_COUPLE;

  // Sealing, adding to the total and logging happen in one statement, so they succeed or fail together.
  const { rows } = await db().execute<{ total_kisses: number }>(sql`
    with sealed as (
      update deals set status = 'sealed', updated_at = now()
      where id = ${dealId}::uuid
        and nest_id = ${c.nestId}::uuid
        and status = 'bargaining'
        and last_offer_by <> ${c.userId}::uuid
      returning id, nest_id, creator_id, current_offer, title
    ), earn as (
      update users set kiss_balance = users.kiss_balance + sealed.current_offer
      from sealed where users.id = sealed.creator_id
    ), give as (
      update users set kiss_balance = users.kiss_balance - sealed.current_offer
      from sealed
      where users.nest_id = sealed.nest_id and users.id <> sealed.creator_id
    ), t as (
      update nests set total_kisses = nests.total_kisses + sealed.current_offer
      from sealed where nests.id = sealed.nest_id
      returning nests.total_kisses
    ), o as (
      insert into offers (deal_id, user_id, amount, kind)
      select id, ${c.userId}::uuid, current_offer, 'accept' from sealed
    ), n as (
      insert into notifications (user_id, deal_id, type, message)
      select ${c.partnerId}::uuid, id, 'sealed',
        ${`${c.userName} sealed `}::text || title || ' for ' || current_offer
          || case when current_offer = 1 then ' kiss' else ' kisses' end
      from sealed
    )
    select total_kisses from t
    where (select count(*) from earn) >= 0 and (select count(*) from give) >= 0`);

  if (rows.length === 0) return { error: "This deal can't be accepted right now. It may have changed." };
  return { ok: true, dealId, totalKisses: Number(rows[0].total_kisses) };
}

export async function declineDeal(dealId: string): Promise<DealResult> {
  const c = await requireCouple(dealId);
  if (!c) return NO_COUPLE;

  const { rows } = await db().execute<{ id: string }>(sql`
    with u as (
      update deals set status = 'declined', updated_at = now()
      where id = ${dealId}::uuid
        and nest_id = ${c.nestId}::uuid
        and status = 'bargaining'
        and last_offer_by <> ${c.userId}::uuid
      returning id, title, current_offer
    ), o as (
      insert into offers (deal_id, user_id, amount, kind)
      select id, ${c.userId}::uuid, current_offer, 'decline' from u
    ), n as (
      insert into notifications (user_id, deal_id, type, message)
      select ${c.partnerId}::uuid, id, 'declined', ${`${c.userName} declined `}::text || title from u
    )
    select id from u`);

  if (rows.length === 0) return { error: "This deal can't be declined right now." };
  return { ok: true, dealId };
}

export async function markNotificationsRead() {
  const userId = await getSessionUserId();
  if (!userId) return;
  await db()
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
}

export async function markDealNotificationsRead(dealId: string) {
  const userId = await getSessionUserId();
  if (!userId) return;
  await db()
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.dealId, dealId), eq(notifications.read, false)));
}
