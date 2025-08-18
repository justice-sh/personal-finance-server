import { users } from "./user";
import { budgets } from "./budget";
import { currency } from "./currency";
import { relations } from "drizzle-orm";
import { CommonFields } from "../common/fields";
import { TransactionStatus, TransactionType } from "@/shared/enum/transaction";
import { doublePrecision, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

const { createdAt, updatedAt, id } = CommonFields;

export const transactionType = pgEnum(
  "transaction_type",
  Object.values(TransactionType) as [TransactionType, ...TransactionType[]],
);

export const transactionStatus = pgEnum(
  "transaction_status",
  Object.values(TransactionStatus) as [TransactionStatus, ...TransactionStatus[]],
);

export const transaction = pgTable("transactions", {
  id,
  createdAt,
  updatedAt,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  budgetId: uuid("budget_id").references(() => budgets.id, { onDelete: "cascade" }),
  type: transactionType().notNull(),
  status: transactionStatus().notNull().default(TransactionStatus.COMPLETED),
  description: text().notNull(),
  avatarUrl: text("avatar_url"),
  amount: doublePrecision().notNull(),
  currency: currency().notNull(),
});

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(users, { fields: [transaction.userId], references: [users.id] }),
  budget: one(budgets, { fields: [transaction.budgetId], references: [budgets.id] }),
}));
