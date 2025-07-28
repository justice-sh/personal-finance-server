import { EnvData } from "@/shared/types/env";
import { StringValue } from "@/shared/types/jwt";

export type ConfigData = Omit<EnvData, "JWT_SECRET"> & {
  JWT: {
    secret: string;
    expiresIn: StringValue;
  };
};
