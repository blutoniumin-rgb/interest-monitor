import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const nests = pgTable("nests", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 6 }).notNull().unique(),
  hostId: uuid("host_id").notNull(),
  totalKisses: integer("total_kisses").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 24 }).notNull(),
    pinHash: text("pin_hash").notNull(),
    nestId: uuid("nest_id").references(() => nests.id, { onDelete: "set null" }),
    kissBalance: integer("kiss_balance").notNull().default(0),
    failedAttempts: integer("failed_attempts").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_name_lower_idx").on(sql`lower(${t.name})`),
    index("users_nest_idx").on(t.nestId),
  ],
);

export const DEAL_STATUSES = ["bargaining", "sealed", "declined"] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

export const deals = pgTable(
  "deals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nestId: uuid("nest_id")
      .notNull()
      .references(() => nests.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 60 }).notNull(),
    emoji: varchar("emoji", { length: 16 }).notNull(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    currentOffer: integer("current_offer").notNull(),
    lastOfferBy: uuid("last_offer_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roundsUsed: integer("rounds_used").notNull().default(0),
    status: text("status", { enum: DEAL_STATUSES }).notNull().default("bargaining"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("deals_nest_idx").on(t.nestId, t.updatedAt)],
);

export const OFFER_KINDS = ["open", "counter", "accept", "decline"] as const;
export type OfferKind = (typeof OFFER_KINDS)[number];

export const offers = pgTable(
  "offers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dealId: uuid("deal_id")
      .notNull()
      .references(() => deals.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    kind: text("kind", { enum: OFFER_KINDS }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("offers_deal_idx").on(t.dealId, t.createdAt)],
);

export const NOTIFICATION_TYPES = ["new_deal", "counter", "sealed", "declined", "joined", "settled"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dealId: uuid("deal_id").references(() => deals.id, { onDelete: "cascade" }),
    type: text("type", { enum: NOTIFICATION_TYPES }).notNull(),
    message: text("message").notNull(),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("notifications_user_idx").on(t.userId, t.createdAt)],
);
