import z from "zod";
import { createZodDto } from "nestjs-zod";
import { Color } from "@/shared/enum/color";

export class CreateBudgetDto extends createZodDto(
  z.object({
    category: z.string().nonempty("Category is required"),
    color: z.nativeEnum(Color).describe("Color of the theme"),
    maxAmount: z.number().positive("Max amount must be a positive number"),
  }),
) {}
