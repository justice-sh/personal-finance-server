import { budgets } from "./budget";
import { relations } from "drizzle-orm";
import { usersThemes } from "./user-theme";
import { CommonFields } from "../common/fields";
import { OAuthAccountTable } from "./oauth-account";
import { UserCategoryTable } from "./user-category";
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
  usersToThemes: many(usersThemes),
  oAuthAccounts: many(OAuthAccountTable),
  usersToCategories: many(UserCategoryTable),
}));
