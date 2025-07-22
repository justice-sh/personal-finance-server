import { CreateBudgetDto } from "./budget.dto";
import * as schemas from "../database/schemas";
import { Inject, Injectable } from "@nestjs/common";
import { BudgetWRelations } from "../database/types";
import { ThemesService } from "../themes/themes.service";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { CategoriesService } from "../categories/categories.service";
import { DATABASE_CONNECTION } from "../database/database-connection";

@Injectable()
export class BudgetsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schemas>,
    private readonly themesService: ThemesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  create(data: { userId: string } & CreateBudgetDto) {
    return this.db.transaction(async (trx) => {
      const [budget] = await trx
        .insert(schemas.BudgetTable)
        .values({ maxAmount: data.maxAmount, currentAmount: data.maxAmount, userId: data.userId })
        .returning();

      const theme = await this.themesService.create(
        { userId: data.userId, name: data.theme, budgetId: budget.id },
        trx,
      );

      const category = await this.categoriesService.create(
        { userId: data.userId, name: data.category, budgetId: budget.id },
        trx,
      );

      return { ...budget, theme, category };
    });
  }

  async findByUserId(userId: string) {
    return this.db.query.BudgetTable.findMany({
      where: (budgets, { eq }) => eq(budgets.userId, userId),
      with: { theme: true, category: true },
    }) as Promise<BudgetWRelations[]>;
  }

  getPublicData({ id, userId, theme, category, ...budget }: BudgetWRelations) {
    return {
      ...budget,
      theme: this.themesService.getPublicData(theme),
      category: this.categoriesService.getPublicData(category),
    };
  }
}
