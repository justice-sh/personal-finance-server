export interface GoogleUser {
  accessToken: string;
  refreshToken: string;
  profile: {
    id: string;
    displayName: string;
    name: { familyName: string; givenName: string; middleName?: string };
    emails: { value: string; verified: boolean }[];
    photos: { value: string }[];
    provider: string;
    _raw: string;
    _json: {
      sub: string;
      name: string;
      given_name: string;
      family_name: string;
      email: string;
      email_verified: boolean;
    };
  };
}

export type ProviderUser = {
  id: string;
  providerUserId: string;
  email: string;
  name: string;
  emailVerified: boolean;
  provider: string;
  photo?: string;
};
