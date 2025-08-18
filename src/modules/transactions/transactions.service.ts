import { Inject, Injectable } from "@nestjs/common";
import schema from "@/infrastructure/database/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { CreateTransactionDto } from "./dto/transaction-request.dto";
import { TransactionResponse } from "./dto/transaction-response.dto";
import { Database, Transaction } from "@/infrastructure/database/types";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";
import { currency } from "@/infrastructure/database/schema/def/currency";

@Injectable()
export class TransactionsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async create(data: CreateTransactionDto, db: Database = this.db): Promise<Transaction> {
    const result = await db.insert(schema.transaction).values(data).returning();
    return result[0];
  }

  async findMany(userId: string): Promise<TransactionResponse[]> {
    const result = await this.db
      .select({
        id: schema.transaction.id,
        type: schema.transaction.type,
        amount: schema.transaction.amount,
        status: schema.transaction.status,
        category: schema.CategoryTable.name,
        avatar: schema.transaction.avatarUrl,
        currency: schema.transaction.currency,
        createdAt: schema.transaction.createdAt,
        description: schema.transaction.description,
      })
      .from(schema.transaction)
      .where(eq(schema.transaction.userId, userId))
      .innerJoin(schema.budgets, eq(schema.budgets.id, schema.transaction.budgetId))
      .innerJoin(schema.CategoryTable, eq(schema.CategoryTable.id, schema.budgets.categoryId));

    return result;
  }
}
