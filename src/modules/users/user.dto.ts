import z from "zod";
import { createZodDto } from "nestjs-zod";
import { PasswordSchema } from "@/shared/schemas/user";

export class CreateUserDto extends createZodDto(
  z.object({
    email: z.string().email(),
    password: PasswordSchema(),
    name: z.string().min(1, { message: "Name is required" }),
  }),
) {}
