import { OAuthProvider } from "./types";
import { createGoogleOAuthClient } from "./clients/google";

export function getOAuthClient(provider: OAuthProvider) {
  switch (provider) {
    case "google":
      return createGoogleOAuthClient();
    default:
      throw new Error(`Invalid provider: ${provider satisfies never}`);
  }
}
