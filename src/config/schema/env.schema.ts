import { NodeEnv } from "@/shared/enum/node-env.enum";
import z from "zod";

export function envSchema() {
  return z.object({
    PORT: z.coerce.number().positive().int().default(3001),

    JWT_SECRET: z.string().nonempty(),

    NODE_ENV: z.enum(Object.values(NodeEnv)),

    DATABASE_URL: z.string().nonempty(),

    // OAuth Configuration
    OAUTH_REDIRECT_URL_BASE: z.url(),
    GOOGLE_CLIENT_ID: z.string().nonempty(),
    GOOGLE_CLIENT_SECRET: z.string().nonempty(),

    CLIENT_APP_URL: z.url(),

    VALID_ORIGINS: z.preprocess((value) => String(value).split(","), z.array(z.url())),
  });
}
