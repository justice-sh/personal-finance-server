import { Module } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { BalanceController } from "./balance.controller";
import { BudgetsModule } from "../budgets/budgets.module";

@Module({
  imports: [BudgetsModule],
  providers: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
