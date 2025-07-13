import { PasswordSchema } from "@/validation-schemas/user";
import { createZodDto } from "nestjs-zod";
import z from "zod";

export class CreateUserDto extends createZodDto(
  z.object({
    email: z.string().email(),
    password: PasswordSchema(),
    name: z.string().min(1, { message: "Name is required" }),
  }),
) {}
