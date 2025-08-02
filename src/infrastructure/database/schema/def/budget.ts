import { users } from "./user";
import { themes } from "./theme";
import { relations } from "drizzle-orm";
import { CategoryTable } from "./category";
import { CommonFields } from "../common/fields";
import { doublePrecision, pgTable, uuid } from "drizzle-orm/pg-core";

const { createdAt, updatedAt, id } = CommonFields;

export const budgets = pgTable("budgets", {
  id,
  createdAt,
  updatedAt,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  maxAmount: doublePrecision("max_amount").notNull(),
  currentAmount: doublePrecision("current_amount").notNull().default(0),
  spent: doublePrecision("spent").default(0).notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => CategoryTable.id, { onDelete: "restrict" }),
  themeId: uuid("theme_id")
    .notNull()
    .references(() => themes.id, { onDelete: "restrict" }),
});

export const budgetRelations = relations(budgets, ({ one, many }) => ({
  theme: one(themes, { fields: [budgets.themeId], references: [themes.id] }),
  category: one(CategoryTable, { fields: [budgets.categoryId], references: [CategoryTable.id] }),
  user: one(users, { fields: [budgets.userId], references: [users.id] }),
}));
