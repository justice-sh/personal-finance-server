import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./user.dto";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "@/infrastructure/database/types";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import * as schemas from "@/infrastructure/database/schemas/";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const result = await this.database.insert(schemas.UserTable).values(data).returning();
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
      .update(schemas.UserTable)
      .set(data)
      .where(eq(schemas.UserTable.id, id))
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
