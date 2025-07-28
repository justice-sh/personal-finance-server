import * as schema from "../schemas";

export type User = typeof schema.UserTable.$inferSelect;

type Budget = typeof schema.BudgetTable.$inferSelect;

export type BudgetWRelations = Budget & { theme: Theme; category: Category };

export type Category = typeof schema.CategoryTable.$inferSelect;

export type Theme = typeof schema.ThemeTable.$inferSelect;
