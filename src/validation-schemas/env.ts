import { z } from "zod";

export const EnvSchema = z.object({
  JWT_SECRET: z.string().min(1),

  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),

  DATABASE_URL: z.string().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),

  CLIENT_APP_URL: z.string().url(),
});
