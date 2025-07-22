import z from "zod";
import { createZodDto } from "nestjs-zod";

export class CreateBudgetDto extends createZodDto(
  z.object({
    category: z.string().nonempty("Category is required"),
    theme: z.string().nonempty("Theme is required"),
    maxAmount: z.number().positive("Max amount must be a positive number"),
  }),
) {}
