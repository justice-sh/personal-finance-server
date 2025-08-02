import { Color } from "@/shared/enum/color";
import { PublicTheme } from "./types/public.theme";
import { Inject, Injectable } from "@nestjs/common";
import schema from "@/infrastructure/database/schema";
import { ThemePresets } from "./constants/theme.presets";
import { Database, Transaction, Theme } from "@/infrastructure/database/types";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class ThemesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async create(data: { color: Color; userId: string }, trx: Transaction) {
    const [theme] = await trx.insert(schema.themes).values({ color: data.color }).returning();
    await trx.insert(schema.usersThemes).values({ themeId: theme.id, userId: data.userId }).returning();
    return theme;
  }

  async findMany(userId: string): Promise<Theme[]> {
    const result = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: { usersToThemes: { with: { theme: true } } },
    });

    return result?.usersToThemes.map((userTheme) => userTheme.theme) || [];
  }

  combinePresets(themes: Theme[]): PublicTheme[] {
    const usedColors = new Map<Color, boolean>(themes.map((theme) => [theme.color, true]));

    return ThemePresets.map((themePreset) => {
      const isUsed = Boolean(usedColors.get(themePreset.color));
      return { ...themePreset, isUsed };
    });
  }
}
