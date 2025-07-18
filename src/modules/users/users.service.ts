import * as bcrypt from "bcrypt";
import { User } from "../database/types";
import { CreateUserDto } from "./user.dto";
import { Inject, Injectable } from "@nestjs/common";
import * as userSchemas from "../database/schemas/user";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { DATABASE_CONNECTION } from "../database/database-connection";

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof userSchemas>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const result = await this.database.insert(userSchemas.UserTable).values(data).returning();
    return result[0];
  }

  findById(id: string): Promise<User | undefined> {
    return this.database.query.UserTable.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.database.query.UserTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async updateUser(id: string, data: Partial<User>) {
    const result = await this.database
      .update(userSchemas.UserTable)
      .set(data)
      .where(eq(userSchemas.UserTable.id, id))
      .returning();

    return result[0];
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
