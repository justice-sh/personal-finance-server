import z from "zod";
import { Request } from "express";
import { OAuthProvider } from "./types";
import { getOAuthClient } from "./manager";
import { oAuthProviders } from "./constants";
import { Inject, Injectable } from "@nestjs/common";
import * as schema from "@/infrastructure/database/schemas";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";
import { OAuthAccountTable } from "@/infrastructure/database/schemas/oauth-account";

@Injectable()
export class OAuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  getAuthUrl(req: Request): string {
    const provider = this.retrieveProvider(req);
    return getOAuthClient(provider).createAuthUrl();
  }

  async linkUser(req: Request) {
    const provider = this.retrieveProvider(req);
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (typeof code !== "string" || typeof state !== "string") {
      throw new Error(`oauthError=${encodeURIComponent("Failed to connect. Please try again.")}`);
    }

    try {
      const oAuthUser = await getOAuthClient(provider).fetchUser(code, state);
      const user = await this.connectUserToAccount(oAuthUser, provider);
      return user;
    } catch (error) {
      console.error(error);
      throw new Error(`/sign-in?oauthError=${encodeURIComponent("Failed to connect. Please try again.")}`);
    }
  }

  private retrieveProvider(req: Request): OAuthProvider {
    const rawProvider = req.params.provider;
    return z.enum(oAuthProviders).parse(rawProvider);
  }

  private connectUserToAccount(
    { id, email, name }: { id: string; email: string; name: string },
    provider: OAuthProvider,
  ) {
    return this.db.transaction(async (trx) => {
      let user = await trx.query.UserTable.findFirst({
        where: eq(schema.UserTable.email, email),
        columns: { id: true, email: true },
      });

      if (user == null) {
        const [newUser] = await trx
          .insert(schema.UserTable)
          .values({ email, name, emailVerifiedAt: new Date() })
          .returning({ id: schema.UserTable.id, email: schema.UserTable.email });

        user = newUser;
      }

      await trx
        .insert(OAuthAccountTable)
        .values({
          provider,
          providerAccountId: id,
          userId: user.id,
        })
        .onConflictDoNothing();

      return user;
    });
  }
}
