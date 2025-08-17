import { Color } from "@/shared/enum/color";
import { PublicTheme } from "./types/public.theme";
import schema from "@/infrastructure/database/schema";
import { ThemePresets } from "./constants/theme.presets";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Database, DatabaseTx, Theme } from "@/infrastructure/database/types";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class ThemesService {
  private readonly logger = new Logger(ThemesService.name);

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async create(color: Color, trx: DatabaseTx) {
    const [theme] = await trx.insert(schema.themes).values({ color }).returning();
    return theme;
  }

  async upsert(color: Color, trx: DatabaseTx) {
    const theme = await this.findByColor(color);
    return theme ? Promise.resolve(theme) : this.create(color, trx);
  }

  async findMany(userId: string): Promise<Theme[]> {
    return this.db
      .select({ color: schema.themes.color, id: schema.themes.id, createdAt: schema.themes.createdAt })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .innerJoin(schema.budgets, eq(schema.users.id, schema.budgets.userId))
      .innerJoin(schema.themes, eq(schema.budgets.themeId, schema.themes.id));
  }

  findByColor(color: Color) {
    return this.db.query.themes.findFirst({ where: (theme, { eq }) => eq(theme.color, color) });
  }

  async delete(id: string) {
    try {
      await this.db.delete(schema.themes).where(eq(schema.themes.id, id));
      return true;
    } catch (error) {
      this.logger.error({ ...error, errorMessage: `Failed to delete theme with id ${id}` });
      return false;
    }
  }

  toResponse(theme: Theme[]): PublicTheme[] {
    return this.combinePresets(theme);
  }

  private combinePresets(themes: Theme[]): PublicTheme[] {
    const usedColors = new Map<Color, boolean>(themes.map((theme) => [theme.color, true]));

    return ThemePresets.map((themePreset) => {
      const isUsed = Boolean(usedColors.get(themePreset.color));
      return { ...themePreset, isUsed };
    }).sort((a, b) => (a.isUsed === b.isUsed ? 0 : a.isUsed ? -1 : 1));
  }
}
