import { users } from "./user";
import { themes } from "./theme";
import { relations } from "drizzle-orm";
import { CategoryTable } from "./category";
import { CommonFields } from "../common/fields";
import { Currency } from "@/shared/enum/currency";
import { doublePrecision, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";

const { createdAt, updatedAt, id } = CommonFields;

export const currencyEnum = pgEnum("currency", Object.values(Currency) as [Currency, ...Currency[]]);

export const budgets = pgTable("budgets", {
  id,
  createdAt,
  updatedAt,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  maxSpend: doublePrecision("max_spend").notNull(),
  currency: currencyEnum().notNull(),
  currentAmount: doublePrecision("current_amount").notNull(),
  spent: doublePrecision("spent").default(0).notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => CategoryTable.id, { onDelete: "restrict" }),
  themeId: uuid("theme_id")
    .notNull()
    .references(() => themes.id, { onDelete: "restrict" }),
});

export const budgetRelations = relations(budgets, ({ one, many }) => ({
  user: one(users, { fields: [budgets.userId], references: [users.id] }),
  theme: one(themes, { fields: [budgets.themeId], references: [themes.id] }),
  category: one(CategoryTable, { fields: [budgets.categoryId], references: [CategoryTable.id] }),
}));
