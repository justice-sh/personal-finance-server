import { Module } from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { BudgetsController } from "./budgets.controller";
import { ThemesService } from "../themes/themes.service";
import { CategoriesService } from "../categories/categories.service";
import { TransactionsService } from "../transactions/transactions.service";

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService, ThemesService, CategoriesService, TransactionsService],
})
export class BudgetsModule {}
