import * as path from "path";
import * as dotenv from "dotenv";
import { ConfigData } from "./types/config.type";
import { EnvData } from "@/config/types/env.type";
import { Injectable, Logger } from "@nestjs/common";
import { fromZodError } from "zod-validation-error";
import { envSchema } from "@/config/schema/env.schema";

dotenv.config({ debug: true, override: true }); // Load .env file at the very beginning with debug and override enabled

let loadedEnv: EnvData;
let transformedData: ConfigData;

@Injectable()
export class ConfigService {
  private logger: Logger = new Logger(ConfigService.name);

  constructor() {
    if (loadedEnv) return;
    loadedEnv = this.loadAndValidate();
  }

  get<R>(selector: (env: ConfigData) => R): R {
    const data = this.transform();
    return selector(data);
  }

  private transform(): ConfigData {
    if (transformedData) return transformedData;

    transformedData = Object.freeze({ ...loadedEnv });

    return transformedData;
  }

  private loadAndValidate() {
    let result = envSchema().safeParse(process.env);

    if (!result.success) {
      const envFilePath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
      dotenv.config({ path: envFilePath, debug: true, override: true });

      this.logger.log(`✅ Loaded config for: ${process.env.NODE_ENV}, from ${envFilePath}`);

      result = envSchema().safeParse(process.env);
    }

    if (result.error) throw new Error(fromZodError(result.error).message);

    return result.data;
  }
}

/**
 * Config data for application-wide usage outside of NestJS DI context.
 */
export const AppConfig = new ConfigService().get((env) => env);
