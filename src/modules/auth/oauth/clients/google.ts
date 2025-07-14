import { ConfigService } from "@/modules/config/config.service";
import { OAuthClient } from "../base";
import { z } from "zod";

export function createGoogleOAuthClient() {
  const config = new ConfigService();

  return new OAuthClient({
    provider: "google",
    clientId: config.get((env) => env.GOOGLE_CLIENT_ID),
    clientSecret: config.get((env) => env.GOOGLE_CLIENT_SECRET),
    scopes: ["openid", "email", "profile"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://openidconnect.googleapis.com/v1/userinfo",
    },
    userInfo: {
      schema: z.object({
        sub: z.string().min(1),
        name: z.string(),
        given_name: z.string().nullable(),
        family_name: z.string().nullable(),
        email: z.string().email(),
        email_verified: z.boolean().optional().default(false),
      }),
      parser: (user) => ({
        id: user.sub,
        name: user.name,
        email: user.email,
        isVerified: Boolean(user.email_verified),
      }),
    },
  });
}
