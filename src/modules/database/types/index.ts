import * as userSchemas from "../schemas/users";

export type User = typeof userSchemas.users.$inferSelect;
