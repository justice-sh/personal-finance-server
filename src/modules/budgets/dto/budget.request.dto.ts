import z from "zod";
import { createZodDto } from "nestjs-zod";
import { Color } from "@/shared/enum/color";
import { Currency } from "@/shared/enum/currency";

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
    maxSpend: z.number().positive("Max amount must be a positive number").optional(),
    currency: z
      .enum(Object.values(Currency) as [Currency, ...Currency[]])
      .describe("Currency of the budget")
      .optional(),
  }),
) {}
