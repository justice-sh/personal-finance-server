import { EnvData } from "@/types/env";
import { StringValue } from "@/types/jwt";

export type ConfigData = Omit<
  EnvData,
  "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET" | "GOOGLE_CALLBACK_URL" | "JWT_SECRET"
> & {
  GOOGLE_OAUTH: {
    clientID: string;
    callbackURL: string;
    clientSecret: string;
  };
  JWT: {
    secret: string;
    expiresIn: StringValue;
  };
};
