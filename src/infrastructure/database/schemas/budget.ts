import { UserTable } from "./user";
import { ThemeTable } from "./theme";
import { relations } from "drizzle-orm";
import { CategoryTable } from "./category";
import { doublePrecision, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const BudgetTable = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  maxAmount: doublePrecision().notNull(),
  currentAmount: doublePrecision().notNull(),
  spent: doublePrecision().default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
});

export const budgetRelations = relations(BudgetTable, ({ one, many }) => ({
  theme: one(ThemeTable),
  category: one(CategoryTable),
  user: one(UserTable, { fields: [BudgetTable.userId], references: [UserTable.id] }),
}));
