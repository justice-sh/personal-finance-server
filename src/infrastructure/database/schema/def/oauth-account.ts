import { users } from "./user";
import { relations } from "drizzle-orm";
import { CommonFields } from "../common/fields";
import { oAuthProviders } from "@/modules/auth/oauth/constants";
import { pgEnum, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

export const oAuthProviderEnum = pgEnum("oauth_providers", oAuthProviders);

const { createdAt, updatedAt } = CommonFields;

export const OAuthAccountTable = pgTable(
  "oauth_accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
    provider: oAuthProviderEnum().notNull(),
    providerAccountId: text("provider_account_id").notNull().unique(),
  },
  (t) => [primaryKey({ columns: [t.providerAccountId, t.provider] })],
);

export const oAuthAccountRelations = relations(OAuthAccountTable, ({ one }) => ({
  user: one(users, { fields: [OAuthAccountTable.userId], references: [users.id] }),
}));
