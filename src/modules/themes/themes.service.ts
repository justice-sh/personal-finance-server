import { Theme } from "../database/types";
import * as schemas from "../database/schemas";
import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { DATABASE_CONNECTION } from "../database/database-connection";

@Injectable()
export class ThemesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schemas>,
  ) {}

  async create(data: { userId: string; name: string; budgetId: string }, db = this.db) {
    const [theme] = await db.insert(schemas.ThemeTable).values(data).returning();
    return theme;
  }

  getPublicData({ budgetId, userId, ...theme }: Theme) {
    return theme;
  }
}
