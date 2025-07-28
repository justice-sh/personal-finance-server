import { UserTable } from "./user";
import { BudgetTable } from "./budget";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const ThemeTable = pgTable("themes", {
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
  isUsed: boolean("is_used").default(true).notNull(),
});

export const themeRelations = relations(ThemeTable, ({ one }) => ({
  user: one(UserTable, { fields: [ThemeTable.userId], references: [UserTable.id] }),
  budget: one(BudgetTable, { fields: [ThemeTable.budgetId], references: [BudgetTable.id] }),
}));
