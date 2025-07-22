import { UserTable } from "./user";
import { BudgetTable } from "./budget";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const CategoryTable = pgTable("categories", {
  name: text("name").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  budgetId: uuid()
    .notNull()
    .references(() => BudgetTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryRelations = relations(CategoryTable, ({ one }) => ({
  user: one(UserTable, { fields: [CategoryTable.userId], references: [UserTable.id] }),
  budget: one(BudgetTable, { fields: [CategoryTable.budgetId], references: [BudgetTable.id] }),
}));
