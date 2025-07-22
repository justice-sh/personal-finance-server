import { Category } from "../database/types";
import * as schemas from "../database/schemas";
import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { DATABASE_CONNECTION } from "../database/database-connection";

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
