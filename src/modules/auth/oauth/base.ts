import { z } from "zod";
import * as crypto from "crypto";
import { ConfigService } from "@/modules/config/config.service";
import { OAuthProvider, OAuthURLs, OAuthUserInfo } from "./types";

// This map is used to store states for CSRF protection
const states = new Map<string, boolean>(); // state => true;

// This map is used to store code verifiers
const codeVerifiers = new Map<string, string>(); // state => codeVerifier;

export class OAuthClient<T> {
  private readonly config: ConfigService;
  private readonly provider: OAuthProvider;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly scopes: string[];
  private readonly urls: OAuthURLs;
  private readonly userInfo: OAuthUserInfo<T>;
  private readonly tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
  });

  constructor({
    provider,
    clientId,
    clientSecret,
    scopes,
    urls,
    userInfo,
  }: {
    provider: OAuthProvider;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    urls: OAuthURLs;
    userInfo: OAuthUserInfo<T>;
  }) {
    this.provider = provider;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
    this.urls = urls;
    this.userInfo = userInfo;
    this.config = new ConfigService();
  }

  private get redirectUrl() {
    return new URL(
      this.provider,
      this.config.get((env) => env.OAUTH_REDIRECT_URL_BASE),
    );
  }

  createAuthUrl() {
    const state = createState();
    const codeVerifier = createCodeVerifier(state);
    const url = new URL(this.urls.auth);
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectUrl.toString());
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.scopes.join(" "));
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("code_challenge", crypto.hash("sha256", codeVerifier, "base64url"));
    console.log("redirectUrl", this.redirectUrl.toString());
    return url.toString();
  }

  async fetchUser(code: string, state: string) {
    const isValidState = validateState(state);
    if (!isValidState) throw new InvalidStateError();

    const { accessToken, tokenType } = await this.fetchToken(code, getCodeVerifier(state));

    const user = await fetch(this.urls.user, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((rawData) => {
        console.log(rawData, "rawData");
        const { data, success, error } = this.userInfo.schema.safeParse(rawData);
        if (!success) throw new InvalidUserError(error);

        return data;
      });

    clearState(state);

    return this.userInfo.parser(user);
  }

  private async fetchToken(code: string, codeVerifier: string) {
    const res = await fetch(this.urls.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        redirect_uri: this.redirectUrl.toString(),
        grant_type: "authorization_code",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code_verifier: codeVerifier,
      }),
    });
    const rawData = await res.json();
    console.log(rawData, "rawData", this.fetchToken.name);
    const { data, success, error } = this.tokenSchema.safeParse(rawData);
    if (!success) throw new InvalidTokenError(error);
    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
    };
  }
}

class InvalidTokenError extends Error {
  constructor(zodError: z.ZodError) {
    super("Invalid Token");
    this.cause = zodError;
  }
}

class InvalidUserError extends Error {
  constructor(zodError: z.ZodError) {
    super("Invalid User");
    this.cause = zodError;
  }
}

class InvalidStateError extends Error {
  constructor() {
    super("Invalid State");
  }
}

class InvalidCodeVerifierError extends Error {
  constructor() {
    super("Invalid Code Verifier");
  }
}

function createState() {
  const state = crypto.randomBytes(64).toString("hex").normalize();
  states.set(state, true);
  return state;
}

function createCodeVerifier(state: string) {
  const codeVerifier = crypto.randomBytes(64).toString("hex").normalize();
  codeVerifiers.set(state, codeVerifier);
  return codeVerifier;
}

function validateState(state: string) {
  const isValid = states.get(state);
  return Boolean(isValid);
}

function getCodeVerifier(state: string) {
  const codeVerifier = codeVerifiers.get(state);
  if (!codeVerifier) throw new InvalidCodeVerifierError();
  return codeVerifier;
}

function clearState(state: string) {
  states.delete(state);
  codeVerifiers.delete(state);
}
