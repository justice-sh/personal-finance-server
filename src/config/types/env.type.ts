import { z } from 'zod';
import { envSchema } from '@/config/schema/env.schema';

export type EnvData = z.infer<ReturnType<typeof envSchema>>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvData {}
  }
}
