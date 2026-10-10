"use server";

import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, users } from "@/db";
import { createSession, deleteSession } from "@/lib/session";

export type AuthResult = { error: string } | { ok: true; redirectTo: string };

const MAX_FAILED = 5;
const LOCK_MINUTES = 5;

export async function getStarted(rawName: string, pin: string): Promise<AuthResult> {
  const name = rawName.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 24) return { error: "Pick a name between 2 and 24 letters." };
  if (!/^\d{4}$/.test(pin)) return { error: "Your love code is 4 digits." };

  const [existing] = await db()
    .select()
    .from(users)
    .where(sql`lower(${users.name}) = lower(${name})`)
    .limit(1);

  if (!existing) {
    const pinHash = await bcrypt.hash(pin, 10);
    try {
      const [created] = await db().insert(users).values({ name, pinHash }).returning({ id: users.id });
      await createSession(created.id);
      return { ok: true, redirectTo: "/nest" };
    } catch {
      return { error: "That name was just taken. Try again or pick another." };
    }
  }

  if (existing.lockedUntil && existing.lockedUntil > new Date()) {
    const mins = Math.ceil((existing.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `Too many tries. Take a breath and try again in ${mins} min.` };
  }

  const valid = await bcrypt.compare(pin, existing.pinHash);
  if (!valid) {
    const failed = existing.failedAttempts + 1;
    await db()
      .update(users)
      .set(
        failed >= MAX_FAILED
          ? { failedAttempts: 0, lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60000) }
          : { failedAttempts: failed },
      )
      .where(eq(users.id, existing.id));
    return { error: "That name is taken, and the code doesn't match." };
  }

  if (existing.failedAttempts > 0 || existing.lockedUntil) {
    await db().update(users).set({ failedAttempts: 0, lockedUntil: null }).where(eq(users.id, existing.id));
  }
  await createSession(existing.id);
  return { ok: true, redirectTo: existing.nestId ? "/home" : "/nest" };
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
