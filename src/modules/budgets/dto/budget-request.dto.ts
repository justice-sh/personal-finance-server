import z from "zod";
import { createZodDto } from "nestjs-zod";
import { Color } from "@/shared/enum/color";
import { Currency } from "@/shared/enum/currency";
import { BudgetAdjustmentType } from "../enums/budget-adjustment-type";

export class CreateBudgetDto extends createZodDto(
  z.object({
    category: z.string().nonempty("Category is required"),
    color: z.nativeEnum(Color).describe("Color of the theme"),
    maxSpend: z.number().positive("Max amount must be a positive number"),
    currency: z.enum(Object.values(Currency) as [Currency, ...Currency[]]).describe("Currency of the budget"),
  }),
) {}

export class UpdateBudgetDto extends createZodDto(
  z.object({
    category: z.string().optional(),
    color: z.nativeEnum(Color).optional().describe("Color of the theme"),
    currency: z
      .enum(Object.values(Currency) as [Currency, ...Currency[]])
      .describe("Currency of the budget")
      .optional(),
  }),
) {}

export class SpendBudgetDto extends createZodDto(
  z.object({
    description: z.string().describe("Reason for spend"),
    amount: z.number().positive("Amount must be a positive number").describe("Amount to spend"),
  }),
) {}

export class AdjustBudgetDto extends createZodDto(
  z
    .object({
      amount: z.number().positive("Amount must be a positive number").describe("Amount to spend"),
      type: z
        .enum(Object.values(BudgetAdjustmentType) as [BudgetAdjustmentType, ...BudgetAdjustmentType[]])
        .describe("Type of adjustment"),
      reason: z.string().optional().describe("Reason for adjustment"),
    })
    .describe("Adjustment the amount of your budget by increasing or decreasing it."),
) {}
