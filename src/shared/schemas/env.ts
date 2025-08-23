import { z } from "zod";

export const EnvSchema = z.object({
  JWT_SECRET: z.string().min(1),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  DATABASE_URL: z.string().min(1),

  // OAuth Configuration
  OAUTH_REDIRECT_URL_BASE: z.string().url(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  CLIENT_APP_URL: z.string().url(),

  VALID_ORIGINS: z.preprocess((value) => {
    if (typeof value !== "string") return value;
    return value.split(",");
  }, z.array(z.string().url())),
});
