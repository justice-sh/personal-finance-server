import { Module } from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { BudgetsController } from "./budgets.controller";
import { ThemesService } from "../themes/themes.service";
import { CategoriesService } from "../categories/categories.service";

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService, ThemesService, CategoriesService],
})
export class BudgetsModule {}
