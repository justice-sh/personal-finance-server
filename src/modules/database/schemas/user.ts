import { ThemeTable } from "./theme";
import { BudgetTable } from "./budget";
import { relations } from "drizzle-orm";
import { CategoryTable } from "./category";
import { OAuthAccountTable } from "./oauth-account";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  password: text("password"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  emailVerifiedAt: timestamp("email_verified_at"),
});

export const userRelations = relations(UserTable, ({ many }) => ({
  themes: many(ThemeTable),
  budgets: many(BudgetTable),
  categories: many(CategoryTable),
  oAuthAccounts: many(OAuthAccountTable),
}));
