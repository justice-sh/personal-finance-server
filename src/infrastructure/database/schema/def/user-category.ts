import { users } from "./user";
import { relations } from "drizzle-orm";
import { CategoryTable } from "./category";
import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";

export const UserCategoryTable = pgTable(
  "users_to_categories",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => CategoryTable.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.categoryId] })],
);

export const usersToCategoriesRelations = relations(UserCategoryTable, ({ one }) => ({
  user: one(users, {
    fields: [UserCategoryTable.userId],
    references: [users.id],
  }),
  category: one(CategoryTable, {
    fields: [UserCategoryTable.categoryId],
    references: [CategoryTable.id],
  }),
}));
