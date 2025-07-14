import { Pool } from "pg";
import { Global, Module } from "@nestjs/common";
import * as userSchemas from "./schemas/user";
import { drizzle } from "drizzle-orm/node-postgres";
import { ConfigService } from "../config/config.service";
import { DATABASE_CONNECTION } from "./database-connection";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({ connectionString: configService.get((env) => env.DATABASE_URL) });
        return drizzle(pool, { schema: { ...userSchemas } });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
