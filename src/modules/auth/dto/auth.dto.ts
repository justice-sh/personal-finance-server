import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PasswordSchema } from "@/shared/schemas/user";

export class LoginUserRequestDto extends createZodDto(
  z.object({ email: z.string().email(), password: PasswordSchema() }),
) {}
