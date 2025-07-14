import z from "zod";
import { oAuthProviders } from "../constants";

export type OAuthProvider = (typeof oAuthProviders)[number];

export type OAuthUser = { id: string; email: string; name: string; isVerified: boolean };

export type OAuthURLs = { auth: string; token: string; user: string };

export type OAuthUserInfo<T> = { schema: z.ZodSchema<T>; parser: (data: T) => OAuthUser };
