import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { PasswordSchema } from "@/common/schemas/user";

export class LoginUserRequestDto extends createZodDto(
  z.object({ email: z.string().email(), password: PasswordSchema() }),
) {}
