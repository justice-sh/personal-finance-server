import { EnvData } from "@/types/env";
import { StringValue } from "@/types/jwt";

export type ConfigData = Omit<EnvData, "JWT_SECRET"> & {
  JWT: {
    secret: string;
    expiresIn: StringValue;
  };
};
