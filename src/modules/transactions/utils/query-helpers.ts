import { sql } from "drizzle-orm/sql/sql";
import { TransactionSortBy } from "../enums/sort-by";
import schema from "@/infrastructure/database/schema";

// TODO: use proper query type
export function applySort(sortBy: TransactionSortBy, query: any) {
  switch (sortBy.toUpperCase()) {
    case TransactionSortBy.LATEST:
      return query.orderBy(sql`${schema.transaction.createdAt} desc`);
    case TransactionSortBy.OLDEST:
      return query.orderBy(schema.transaction.createdAt);
    case TransactionSortBy.A_TO_Z:
      return query.orderBy(schema.transaction.description);
    case TransactionSortBy.Z_TO_A:
      return query.orderBy(sql`${schema.transaction.description} desc`);
    case TransactionSortBy.HIGHEST:
      return query.orderBy(sql`${schema.transaction.amount} desc`);
    case TransactionSortBy.LOWEST:
      return query.orderBy(schema.transaction.amount);
    default:
      return query.orderBy(sql`${schema.transaction.createdAt} desc`);
  }
}

export function selectFields() {
  return {
    id: schema.transaction.id,
    type: schema.transaction.type,
    amount: schema.transaction.amount,
    status: schema.transaction.status,
    category: schema.CategoryTable.name,
    avatar: schema.transaction.avatarUrl,
    currency: schema.transaction.currency,
    createdAt: schema.transaction.createdAt,
    description: schema.transaction.description,
  };
}
