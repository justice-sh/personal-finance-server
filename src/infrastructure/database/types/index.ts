import schema from "../schema";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm/relations";
import { NodePgDatabase, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

export type User = typeof schema.users.$inferSelect;
export type UserRelation = typeof schema.userRelations;

export type Budget = typeof schema.budgets.$inferSelect;

export type BudgetWRelations = Budget & { theme: Theme; category: Category };

export type Category = typeof schema.CategoryTable.$inferSelect;

export type Theme = typeof schema.themes.$inferSelect;

export type Transaction = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export type Database = NodePgDatabase<typeof schema> | Transaction;

// let d: UserRelation = "usersToCategories";
