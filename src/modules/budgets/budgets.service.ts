import schema from "@/infrastructure/database/schema";
import { ThemesService } from "../themes/themes.service";
import { BudgetResponse } from "./dto/budget-response.dto";
import { TransactionType } from "@/shared/enum/transaction";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { CategoriesService } from "../categories/categories.service";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { TransactionsService } from "../transactions/transactions.service";
import { calculateBudgetAdjustment } from "./utils/calc-budget-adjustment";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";
import { Budget, BudgetWRelations, Database } from "@/infrastructure/database/types";
import { AdjustBudgetDto, CreateBudgetDto, SpendBudgetDto, UpdateBudgetDto } from "./dto/budget-request.dto";

@Injectable()
export class BudgetsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
    private readonly themesService: ThemesService,
    private readonly categoriesService: CategoriesService,
    private readonly transactionsService: TransactionsService,
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

      await this.transactionsService.create(
        {
          budgetId: budget.id,
          userId: data.userId,
          amount: budget.maxSpend,
          currency: budget.currency,
          type: TransactionType.ALLOCATION,
          description: `Budget allocation: ${category.name}`,
        },
        trx,
      );

      return { ...budget, category, theme };
    });
  }

  async update(data: UpdateBudgetDto & { id: string; userId: string }): Promise<BudgetWRelations> {
    const { id, userId, category: categoryName, color } = data;

    const budget = await this.findOne({ id, userId });
    if (!budget) throw new BadRequestException("Budget not found");

    const updatedBudget = await this.db.transaction(async (trx) => {
      const category = categoryName ? await this.categoriesService.upsert(categoryName, trx) : budget.category;
      const theme = color ? await this.themesService.upsert(color, trx) : budget.theme;

      let existingBudget = await this.findOne({ categoryId: category.id, userId: data.userId });
      if (existingBudget && existingBudget.id !== budget.id)
        throw new BadRequestException("Budget with this category already exists");

      existingBudget = await this.findOne({ themeId: theme.id, userId: data.userId });
      if (existingBudget && existingBudget.id !== budget.id)
        throw new BadRequestException("Budget with this color already exists");

      const currency = data.currency || budget.currency;

      const [updatedBudget] = await trx
        .update(schema.budgets)
        .set({ currency, categoryId: category.id, themeId: theme.id })
        .where(eq(schema.budgets.id, id))
        .returning();

      return { ...updatedBudget, theme, category };
    });

    await Promise.all([this.themesService.delete(budget.themeId), this.categoriesService.delete(budget.categoryId)]);

    return updatedBudget;
  }

  findMany(userId: string) {
    return this.db.query.budgets.findMany({
      where: (budgets, { eq }) => eq(budgets.userId, userId),
      with: { category: true, theme: true },
      orderBy: (budgets, { desc }) => desc(budgets.createdAt),
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

  async delete(budgetId: string, userId: string) {
    const [budget] = await this.db
      .delete(schema.budgets)
      .where(and(eq(schema.budgets.id, budgetId), eq(schema.budgets.userId, userId)))
      .returning();

    if (budget) await this.themesService.delete(budget.themeId);
    if (budget) await this.categoriesService.delete(budget.categoryId);

    return budget;
  }

  toResponse({ categoryId, themeId, userId, theme, category, ...budget }: BudgetWRelations) {
    const data: BudgetResponse = { ...budget, color: theme.color, category: category.name };
    return data;
  }

  async spend(data: { userId: string; budgetId: string } & SpendBudgetDto) {
    const { budgetId, userId } = data;

    const budget = await this.findOne({ id: budgetId, userId });
    if (!budget) throw new BadRequestException("Budget not found");

    if (budget.currentAmount < data.amount) throw new BadRequestException("Available balance is too small for this spend.");

    const spent = budget.spent + data.amount;
    const currentAmount = budget.maxSpend - spent;

    return this.db.transaction(async (trx) => {
      const [updatedBudget] = await trx
        .update(schema.budgets)
        .set({ currentAmount, spent })
        .where(eq(schema.budgets.id, budgetId))
        .returning();

      await this.transactionsService.create(
        {
          budgetId: updatedBudget.id,
          userId,
          amount: data.amount,
          currency: updatedBudget.currency,
          type: TransactionType.SPEND,
          description: data.description,
        },
        trx,
      );

      return { ...budget, ...updatedBudget };
    });
  }

  async adjust(data: { userId: string; budgetId: string } & AdjustBudgetDto) {
    const { budgetId, userId } = data;

    const budget = await this.findOne({ id: budgetId, userId });
    if (!budget) throw new BadRequestException("Budget not found");

    const adjustment = calculateBudgetAdjustment(budget, data);

    return this.db.transaction(async (trx) => {
      const [updatedBudget] = await trx
        .update(schema.budgets)
        .set({ maxSpend: adjustment.maxSpend, currentAmount: adjustment.balance })
        .where(eq(schema.budgets.id, budgetId))
        .returning();

      await this.transactionsService.create(
        {
          budgetId: updatedBudget.id,
          userId,
          amount: data.amount,
          currency: updatedBudget.currency,
          type: adjustment.txType,
          description: adjustment.description,
        },
        trx,
      );

      return { ...budget, ...updatedBudget };
    });
  }
}

type BudgetField = Partial<{ [key in keyof Budget]: Budget[key] }>;
