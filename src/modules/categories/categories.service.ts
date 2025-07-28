import { Inject, Injectable } from "@nestjs/common";
import { Category } from "@/infrastructure/database/types";
import * as schemas from "@/infrastructure/database/schemas";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schemas>,
  ) {}

  async create(data: { userId: string; name: string; budgetId: string }, db = this.db) {
    const [category] = await db.insert(schemas.CategoryTable).values(data).returning();
    return category;
  }

  getPublicData({ budgetId, userId, ...category }: Category) {
    return category;
  }
}
