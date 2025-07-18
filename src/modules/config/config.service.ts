import "dotenv/config";
import { EnvData } from "@/types/env";
import { ConfigData } from "./config.type";
import { Injectable } from "@nestjs/common";
import { ExactPathForValue } from "@/types/utils";
import { fromZodError } from "zod-validation-error";
import { EnvSchema } from "@/common/schemas/env";

@Injectable()
export class ConfigService {
  constructor() {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) throw new Error(fromZodError(result.error).message);
  }

  get<R, K extends ExactPathForValue<ConfigData, R>>(selector: (env: ConfigData) => R): R {
    const data = this.transform();
    return selector(data);
  }

  private transform(): ConfigData {
    const data = process.env as EnvData;

    return {
      ...data,
      JWT: {
        secret: data.JWT_SECRET,
        expiresIn: "15m",
      },
    };
  }
}
