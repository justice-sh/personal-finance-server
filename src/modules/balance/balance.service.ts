import { Currency } from "@/shared/enum/currency";
import { BudgetsService } from "../budgets/budgets.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BalanceService {
  constructor(private readonly budgetSv: BudgetsService) {}

  async getBalances(userId: string, currency: Currency) {
    return this.budgetSv.sumBalances(userId, currency);
  }
}
