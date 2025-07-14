import { relations } from "drizzle-orm";
import { oAuthProviders } from "@/modules/auth/oauth/constants";
import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
});

export const userRelations = relations(UserTable, ({ many }) => ({
  oAuthAccount: many(OAuthAccountTable),
}));

export const oAuthProviderEnum = pgEnum("oauth_provides", oAuthProviders);

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

export const userOAuthAccountRelationships = relations(OAuthAccountTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [OAuthAccountTable.userId],
    references: [UserTable.id],
  }),
}));
