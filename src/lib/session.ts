import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { loadFeed } from "./feed";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./jwt";

export async function createSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUserId() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const [user] = await db()
    .select({ id: users.id, name: users.name, nestId: users.nestId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user ?? null;
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** For server components: a stale cookie (user deleted) goes through /logout to clear it. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");
  return user;
}

export async function requireFeed() {
  const userId = await getSessionUserId();
  const feed = userId ? await loadFeed(userId) : null;
  if (!feed) redirect("/logout");
  return feed;
}
