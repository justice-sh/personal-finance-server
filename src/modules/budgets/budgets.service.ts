import schema from "@/infrastructure/database/schema";
import { ThemesService } from "../themes/themes.service";
import { BudgetResponse } from "./dto/budget.response.dto";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { CategoriesService } from "../categories/categories.service";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto/budget.request.dto";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";
import { Budget, BudgetWRelations, Database } from "@/infrastructure/database/types";

@Injectable()
export class BudgetsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
    private readonly themesService: ThemesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  create(data: CreateBudgetDto & { userId: string }) {
    return this.db.transaction(async (trx) => {
      const theme = await this.themesService.upsert(data.color, trx);
      const category = await this.categoriesService.upsert(data.category, trx);

      let existingBudget = await this.findOne({ categoryId: category.id, userId: data.userId });
      if (existingBudget) throw new BadRequestException("Budget with this category already exists");

      existingBudget = await this.findOne({ themeId: theme.id, userId: data.userId });
      if (existingBudget) throw new BadRequestException("Budget with this color already exists");

      const [budget] = await trx
        .insert(schema.budgets)
        .values({
          categoryId: category.id,
          themeId: theme.id,
          maxSpend: data.maxSpend,
          userId: data.userId,
          currency: data.currency,
          currentAmount: data.maxSpend,
        })
        .returning();

      return { ...budget, category, theme };
    });
  }

  async update(data: UpdateBudgetDto & { id: string; userId: string }): Promise<BudgetWRelations> {
    const { id, userId, category: categoryName, color } = data;

    const budget = await this.findOne({ id, userId });
    if (!budget) throw new BadRequestException("Budget not found");

    if (data.maxSpend && budget.spent > data.maxSpend)
      throw new BadRequestException("New max amount cannot be less than spent amount");

    const updatedBudget = await this.db.transaction(async (trx) => {
      const category = categoryName ? await this.categoriesService.upsert(categoryName, trx) : budget.category;
      const theme = color ? await this.themesService.upsert(color, trx) : budget.theme;

      const maxSpend = data.maxSpend || budget.maxSpend,
        currency = data.currency || budget.currency;

      const [updatedBudget] = await trx
        .update(schema.budgets)
        .set({
          maxSpend,
          currency,
          categoryId: category.id,
          themeId: theme.id,
          currentAmount: maxSpend - budget.spent,
        })
        .where(eq(schema.budgets.id, id))
        .returning();

      return { ...updatedBudget, theme, category };
    });

    await this.themesService.delete(budget.themeId);
    await this.categoriesService.delete(budget.categoryId);

    return updatedBudget;
  }

  findMany(userId: string) {
    return this.db.query.budgets.findMany({
      where: (budgets, { eq }) => eq(budgets.userId, userId),
      with: { category: true, theme: true },
    });
  }

  findOne(data: BudgetField) {
    const keys = Object.keys(data);
    if (keys.length === 0) throw new BadRequestException("At least one filter must be provided");

    return this.db.query.budgets.findFirst({
      where: (budgets, filter) => filter.and(...keys.map((key) => eq(budgets[key], data[key]))),
      with: { category: true, theme: true },
    });
  }

  toResponse({ categoryId, themeId, userId, theme, category, ...budget }: BudgetWRelations) {
    const data: BudgetResponse = { ...budget, color: theme.color, category: category.name };
    return data;
  }
}

type BudgetField = Partial<{ [key in keyof Budget]: Budget[key] }>;
