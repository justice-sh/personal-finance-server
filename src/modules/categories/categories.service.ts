import schema from "@/infrastructure/database/schema";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Category, Database, Transaction } from "@/infrastructure/database/types";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class CategoriesService {
  private readonly logger: Logger;

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {
    this.logger = new Logger(CategoriesService.name);
  }

  async create(data: { category: string; userId: string }, trx: Transaction) {
    const [category] = await trx.insert(schema.CategoryTable).values({ name: data.category }).returning();
    await trx.insert(schema.UserCategoryTable).values({ categoryId: category.id, userId: data.userId });
    return category;
  }

  async getManyByUserId(userId: string): Promise<Category[]> {
    try {
      const result = await this.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        // with: { categories: true },
      });

      // return result?.categories ?? [];
      return [];
    } catch (error) {
      this.logger.error("Error fetching categories:", error);
      return [];
    }
  }
}
