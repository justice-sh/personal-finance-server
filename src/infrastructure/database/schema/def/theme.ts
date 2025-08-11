import { budgets } from "./budget";
import { relations } from "drizzle-orm";
import { Color } from "@/shared/enum/color";
import { CommonFields } from "../common/fields";
import { pgTable, pgEnum } from "drizzle-orm/pg-core";

const { createdAt, id } = CommonFields;

// NOTE: The themes table is a flyweight table. It enable us not have duplicate themes in the database.

export const colorEnum = pgEnum("color", Object.values(Color) as [Color, ...Color[]]);

export const themes = pgTable("themes", { id, createdAt, color: colorEnum().notNull() });

export const themesRelations = relations(themes, ({ many }) => ({ budgets: many(budgets) }));
