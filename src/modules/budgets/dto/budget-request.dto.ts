import z from "zod";
import { createZodDto } from "nestjs-zod";
import { Color } from "@/shared/enum/color";
import { Currency } from "@/shared/enum/currency";
import { BudgetAdjustmentType } from "../enums/budget-adjustment-type";

export class CreateBudgetDto extends createZodDto(
  z
    .object({
      category: z.string().nonempty("Category is required"),
      color: z.nativeEnum(Color).describe("Color of the theme"),
      maxSpend: z.number().positive("Max amount must be a positive number"),
      currency: z.enum(Object.values(Currency) as [Currency, ...Currency[]]).describe("Currency of the budget"),
    })
    .transform((data) => {
      data.category = data.category.toLowerCase();
      return data;
    }),
) {}

export class UpdateBudgetDto extends createZodDto(
  z
    .object({
      category: z.string().optional(),
      color: z.nativeEnum(Color).optional().describe("Color of the theme"),
      currency: z
        .enum(Object.values(Currency) as [Currency, ...Currency[]])
        .describe("Currency of the budget")
        .optional(),
    })
    .transform((data) => {
      if (data.category) data.category = data.category.toLowerCase();
      return data;
    }),
) {}

export class SpendBudgetDto extends createZodDto(
  z
    .object({
      description: z.string().describe("Reason for spend"),
      amount: z.number().positive("Amount must be a positive number").describe("Amount to spend"),
    })
    .transform((data) => {
      data.description = data.description.toLowerCase();
      return data;
    })
    .describe("Perform spend operation on a budget"),
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
    .transform((data) => {
      if (data.reason) data.reason = data.reason.toLowerCase();
      return data;
    })
    .describe("Increase or Decrease the allocated amount for a budget"),
) {}
