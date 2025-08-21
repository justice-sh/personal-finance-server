import { BadRequestException } from "@nestjs/common";
import { Budget } from "@/infrastructure/database/types";
import { TransactionType } from "@/shared/enum/transaction";
import { AdjustBudgetDto } from "../dto/budget-request.dto";
import { BudgetAdjustmentType } from "../enums/budget-adjustment-type";

/**
 * Calculates the new budget amount and transaction type based on an adjustment.
 * @param budget The current budget object.
 * @param data The adjustment data including type and amount.
 * @returns An object containing the new amount and transaction type.
 */
export function calculateBudgetAdjustment(
  budget: Budget,
  data: AdjustBudgetDto,
): { maxSpend: number; txType: TransactionType; description: string; balance: number } {
  const description = data.reason || `${data.type.toLowerCase()}d budget`;

  let maxSpend: number, txType: TransactionType;

  switch (data.type) {
    case BudgetAdjustmentType.INCREASE:
      maxSpend = budget.maxSpend + data.amount;
      txType = TransactionType.DEPOSIT;
      break;

    case BudgetAdjustmentType.DECREASE:
      if (budget.currentAmount < data.amount) {
        throw new BadRequestException("Available balance is too small for decrease.");
      }
      maxSpend = budget.maxSpend - data.amount;
      txType = TransactionType.WITHDRAWAL;
      break;

    default:
      throw new BadRequestException("Invalid adjustment type");
  }

  return { maxSpend, balance: maxSpend - budget.spent, txType, description };
}
