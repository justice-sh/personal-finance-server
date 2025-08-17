import { budgets } from "./budget";
import { relations } from "drizzle-orm";
import { transaction } from "./transaction";
import { CommonFields } from "../common/fields";
import { OAuthAccountTable } from "./oauth-account";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

const { createdAt, updatedAt, id } = CommonFields;

export const users = pgTable("users", {
  id,
  createdAt,
  updatedAt,
  password: text("password"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at"),
});

export const userRelations = relations(users, ({ many }) => ({
  budgets: many(budgets),
  transactions: many(transaction),
  oAuthAccounts: many(OAuthAccountTable),
}));
