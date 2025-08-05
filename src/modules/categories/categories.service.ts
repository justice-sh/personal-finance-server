import schema from "@/infrastructure/database/schema";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { Category, Database, Transaction } from "@/infrastructure/database/types";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async create(name: string, trx: Transaction) {
    const [category] = await trx.insert(schema.CategoryTable).values({ name }).returning();
    return category;
  }

  async findMany(userId: string): Promise<Category[]> {
    return this.db
      .select({ name: schema.CategoryTable.name, id: schema.CategoryTable.id, createdAt: schema.CategoryTable.createdAt })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .innerJoin(schema.budgets, eq(schema.users.id, schema.budgets.userId))
      .innerJoin(schema.CategoryTable, eq(schema.budgets.categoryId, schema.CategoryTable.id));
  }

  findByName(name: string): Promise<Category | undefined> {
    return this.db.query.CategoryTable.findFirst({
      where: (category, { eq }) => eq(category.name, name),
    });
  }

  async upsert(name: string, trx: Transaction) {
    const category = await this.findByName(name);
    return category ? Promise.resolve(category) : this.create(name, trx);
  }

  async delete(id: string, trx: Transaction) {
    try {
      await trx.delete(schema.CategoryTable).where(eq(schema.CategoryTable.id, id));
      return true;
    } catch (error) {
      this.logger.error({ ...error, errorMessage: `Failed to delete category with id ${id}` });
      return false;
    }
  }

  toResponse(category: Category) {
    return category.name;
  }
}
