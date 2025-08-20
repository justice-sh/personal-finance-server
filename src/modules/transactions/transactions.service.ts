import { sql } from "drizzle-orm";
import { TransactionSortBy } from "./enums/sort-by";
import * as queryUtils from "./utils/query-helpers";
import { Inject, Injectable } from "@nestjs/common";
import schema from "@/infrastructure/database/schema";
import { formatSortByLabel } from "./utils/formatters";
import { CreateTransactionDto } from "./dto/transaction-request.dto";
import { TransactionResponse } from "./dto/transaction-response.dto";
import { Database, Transaction } from "@/infrastructure/database/types";
import { eq, and, ilike } from "drizzle-orm/sql/expressions/conditions";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class TransactionsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async create(data: CreateTransactionDto, db: Database = this.db): Promise<Transaction> {
    const result = await db.insert(schema.transaction).values(data).returning();
    return result[0];
  }

  async findMany({ userId, limit, offset, description, budgetId, sortBy }: FindOption): Promise<TransactionResponse> {
    const conditions = [eq(schema.transaction.userId, userId)];

    if (description) conditions.push(ilike(schema.transaction.description, `%${description}%`));
    if (budgetId) conditions.push(eq(schema.transaction.budgetId, budgetId));

    const dataQuery = this.db
      .select(queryUtils.selectFields())
      .from(schema.transaction)
      .where(and(...conditions))
      .innerJoin(schema.budgets, eq(schema.budgets.id, schema.transaction.budgetId))
      .innerJoin(schema.CategoryTable, eq(schema.CategoryTable.id, schema.budgets.categoryId));

    if (limit) dataQuery.limit(limit);
    if (offset) dataQuery.offset(offset);
    if (sortBy) queryUtils.applySort(sortBy, dataQuery);

    const totalQuery = this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.transaction)
      .where(and(...conditions));

    const [data, total] = await Promise.all([dataQuery, totalQuery]);

    return { data, meta: { total: total[0].count, limit: limit || total[0].count, offset: offset || 0 } };
  }

  getSortBy() {
    return Object.values(TransactionSortBy).map((value) => ({ value, label: formatSortByLabel(value) }));
  }
}

type FindOption = {
  userId: string;
  limit?: number;
  offset?: number;
  description?: string;
  budgetId?: string;
  sortBy?: TransactionSortBy;
};
