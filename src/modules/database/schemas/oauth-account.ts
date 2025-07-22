import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { oAuthProviders } from "@/modules/auth/oauth/constants";
import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const oAuthProviderEnum = pgEnum("oauth_providers", oAuthProviders);

export const OAuthAccountTable = pgTable(
  "oauth_accounts",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    provider: oAuthProviderEnum().notNull(),
    providerAccountId: text().notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.providerAccountId, t.provider] })],
);

export const oAuthAccountRelations = relations(OAuthAccountTable, ({ one }) => ({
  user: one(UserTable, { fields: [OAuthAccountTable.userId], references: [UserTable.id] }),
}));
