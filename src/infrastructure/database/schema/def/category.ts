import { budgets } from "./budget";
import { CommonFields } from "../common/fields";
import { relations } from "drizzle-orm/relations";
import { pgTable, text } from "drizzle-orm/pg-core";

const { createdAt, id } = CommonFields;

export const CategoryTable = pgTable("categories", { id, createdAt, name: text("name").notNull().unique() });

// TODO: make name unique, and index name.

export const categoryRelations = relations(CategoryTable, ({ many }) => ({ budgets: many(budgets) }));
