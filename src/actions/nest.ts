"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { CODE_LENGTH, generateNestCode } from "@/lib/code";
import { getSessionUserId } from "@/lib/session";

export type NestResult = { error: string } | { ok: true; redirectTo: string };

export async function buildNest(): Promise<NestResult> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "Please log in again." };

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateNestCode();
    const { rows } = await db().execute<{ my_nest: string | null; created: string | null }>(sql`
      with n as (
        insert into nests (code, host_id)
        select ${code}, ${userId}::uuid
        where exists (select 1 from users where id = ${userId}::uuid and nest_id is null)
        on conflict (code) do nothing
        returning id
      ), u as (
        update users set nest_id = n.id from n
        where users.id = ${userId}::uuid and users.nest_id is null
        returning users.id
      )
      select
        (select nest_id from users where id = ${userId}::uuid) as my_nest,
        (select id from n) as created`);
    const row = rows[0];
    if (row?.created) return { ok: true, redirectTo: "/nest/host" };
    if (row?.my_nest) return { ok: true, redirectTo: "/home" };
  }
  return { error: "Couldn't make a code right now. Try again." };
}

export async function flyIntoNest(rawCode: string): Promise<NestResult> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "Please log in again." };

  const code = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length !== CODE_LENGTH) return { error: "Nest codes are 6 characters." };

  const { rows } = await db().execute<{ my_nest: string | null; found: number; joined: number }>(sql`
    with n as (
      select id, host_id from nests where code = ${code}
    ), u as (
      update users set nest_id = n.id from n
      where users.id = ${userId}::uuid
        and users.nest_id is null
        and (select count(*) from users x where x.nest_id = n.id) < 2
      returning n.host_id, users.name
    ), note as (
      insert into notifications (user_id, type, message)
      select host_id, 'joined', name || ' flew into your nest' from u
    )
    select
      (select nest_id from users where id = ${userId}::uuid) as my_nest,
      (select count(*) from n)::int as found,
      (select count(*) from u)::int as joined`);

  const row = rows[0];
  if (row?.joined) return { ok: true, redirectTo: "/home" };
  if (row?.my_nest) return { error: "You're already in a nest. One nest per love!" };
  if (!row?.found) return { error: "No nest with that code. Double-check with your love." };
  return { error: "That nest is already full. It's a nest for two." };
}

/** Only allowed while waiting alone, so nobody can abandon a partner. */
export async function leaveEmptyNest(): Promise<NestResult> {
  const userId = await getSessionUserId();
  if (!userId) return { ok: true, redirectTo: "/" };

  await db().execute(sql`
    delete from nests
    where host_id = ${userId}::uuid
      and id = (select nest_id from users where id = ${userId}::uuid)
      and (select count(*) from users u where u.nest_id = nests.id) = 1`);
  return { ok: true, redirectTo: "/nest" };
}
