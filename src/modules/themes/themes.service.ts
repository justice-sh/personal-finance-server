import { Color } from "@/shared/enum/color";
import { PublicTheme } from "./types/public.theme";
import { ThemePresets } from "./constants/theme.presets";
import { Inject, Injectable, Logger } from "@nestjs/common";
import schema from "@/infrastructure/database/schema";
import { Database, Transaction, Theme } from "@/infrastructure/database/types";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class ThemesService {
  private readonly logger: Logger;

  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {
    this.logger = new Logger(ThemesService.name);
  }

  async create(data: { color: Color; userId: string }, trx: Transaction) {
    const [theme] = await trx.insert(schema.themes).values({ color: data.color }).returning();
    await trx.insert(schema.usersThemes).values({ themeId: theme.id, userId: data.userId }).returning();
    return theme;
  }

  async getPublicThemes(userId: string): Promise<PublicTheme[]> {
    const themes = await this.getByUserId(userId);

    const usedColors = new Map<Color, boolean>(themes.map((theme) => [theme.color, true]));

    return ThemePresets.map((themePreset) => {
      const isUsed = Boolean(usedColors.get(themePreset.color));
      return { ...themePreset, isUsed };
    });
  }

  private async getByUserId(userId: string): Promise<Theme[]> {
    try {
      const result = await this.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
        with: { usersToThemes: true },
      });

      return [];
    } catch (error) {
      this.logger.error(`Error fetching themes: ${error.message}`);
      return [];
    }
  }
}
