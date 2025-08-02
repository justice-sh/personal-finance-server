import schema from "@/infrastructure/database/schema";
import { ThemesService } from "../themes/themes.service";
import { BudgetResponse } from "./dto/budget.response.dto";
import { CreateBudgetDto } from "./dto/budget.request.dto";
import { CategoriesService } from "../categories/categories.service";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { BudgetWRelations, Database } from "@/infrastructure/database/types";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class BudgetsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
    private readonly themesService: ThemesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  create(data: { userId: string } & CreateBudgetDto) {
    return this.db.transaction(async (trx) => {
      const user = await trx.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, data.userId),
        with: { usersToCategories: true, usersToThemes: true },
      });
      if (!user) throw new BadRequestException("User not found");

      let category = await trx.query.CategoryTable.findFirst({
        where: (category, { eq }) => eq(category.name, data.category),
      });

      let theme = await trx.query.themes.findFirst({
        where: (theme, { eq }) => eq(theme.color, data.color),
      });

      if (category && user.usersToCategories.some((c) => c.categoryId === category!.id))
        throw new BadRequestException("Category already exists for this user");

      if (theme && user.usersToThemes.some((t) => t.themeId === theme!.id))
        throw new BadRequestException("Color is already in use");

      if (!category) category = await this.categoriesService.create(data, trx);
      if (!theme) theme = await this.themesService.create(data, trx);

      const [budget] = await trx
        .insert(schema.budgets)
        .values({ categoryId: category.id, themeId: theme.id, maxAmount: data.maxAmount, userId: data.userId })
        .returning();

      return { ...budget, category, theme };
    });
  }

  findMany(userId: string) {
    return this.db.query.budgets.findMany({
      where: (budgets, { eq }) => eq(budgets.userId, userId),
      with: { category: true, theme: true },
    });
  }

  findOne(data: { id: string; userId: string }) {
    return this.db.query.budgets.findFirst({
      where: (budgets, { eq, and }) => and(eq(budgets.id, data.id), eq(budgets.userId, data.userId)),
      with: { category: true, theme: true },
    });
  }

  toResponse({ categoryId, themeId, userId, theme, category, ...budget }: BudgetWRelations) {
    const data: BudgetResponse = { ...budget, color: theme.color, category: category.name };
    return data;
  }
}
