import { themes } from "./theme";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";

export const usersThemes = pgTable(
  "users_to_themes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    themeId: uuid("theme_id")
      .notNull()
      .references(() => themes.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.themeId] })],
);

export const usersToThemesRelations = relations(usersThemes, ({ one }) => ({
  user: one(users, {
    fields: [usersThemes.userId],
    references: [users.id],
  }),
  theme: one(themes, {
    fields: [usersThemes.themeId],
    references: [themes.id],
  }),
}));
