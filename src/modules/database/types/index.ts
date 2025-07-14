import * as userSchemas from "../schemas/user";

export type User = typeof userSchemas.UserTable.$inferSelect;
