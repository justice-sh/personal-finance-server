import { z } from "zod";
import { EnvSchema } from "@/shared/schemas/env";

export type EnvData = z.infer<typeof EnvSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvData {}
  }
}
