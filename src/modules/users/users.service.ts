import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./user.dto";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "@/infrastructure/database/types";
import schemas from "@/infrastructure/database/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { DATABASE_CONNECTION } from "@/infrastructure/database/database-connection";

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schemas>) {}

  async create(data: CreateUserDto): Promise<User> {
    const result = await this.db.insert(schemas.users).values(data).returning();
    return result[0];
  }

  findById(id: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, id) });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, email) });
  }

  async updateUser(id: string, data: Partial<User>) {
    const result = await this.db.update(schemas.users).set(data).where(eq(schemas.users.id, id)).returning();
    return result[0];
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
