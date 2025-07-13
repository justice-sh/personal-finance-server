import { EnvData } from "@/types/env";

export type ConfigData = Omit<EnvData, "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET" | "GOOGLE_CALLBACK_URL"> & {
  GOOGLE_OAUTH: {
    clientID: string;
    callbackURL: string;
    clientSecret: string;
  };
};
