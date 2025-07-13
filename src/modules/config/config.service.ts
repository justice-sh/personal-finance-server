import "dotenv/config";
import { EnvData } from "@/types/env";
import { ConfigData } from "./config.type";
import { Injectable } from "@nestjs/common";
import { ExactPathForValue } from "@/types/utils";
import { fromZodError } from "zod-validation-error";
import { EnvSchema } from "@/validation-schemas/env";

@Injectable()
export class ConfigService {
  constructor() {
    this.validate();
  }

  get<R, K extends ExactPathForValue<ConfigData, R>>(selector: (env: ConfigData) => R): R {
    const data = this.transform();
    return selector(data);
  }

  private validate() {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) throw new Error(fromZodError(result.error).message);
  }

  private transform(): ConfigData {
    const data = process.env as EnvData;

    return {
      NODE_ENV: data.NODE_ENV,

      JWT_SECRET: data.JWT_SECRET,

      GOOGLE_OAUTH: {
        clientID: data.GOOGLE_CLIENT_ID,
        callbackURL: data.GOOGLE_CALLBACK_URL,
        clientSecret: data.GOOGLE_CLIENT_SECRET,
      },

      DATABASE_URL: data.DATABASE_URL,

      CLIENT_APP_URL: data.CLIENT_APP_URL,
    };
  }
}
