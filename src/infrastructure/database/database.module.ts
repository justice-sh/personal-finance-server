import { Pool } from "pg";
import * as schema from "./schemas";
import { Global, Module } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { ConfigService } from "@/config/config.service";
import { DATABASE_CONNECTION } from "./database-connection";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({ connectionString: configService.get((env) => env.DATABASE_URL) });
        return drizzle(pool, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
