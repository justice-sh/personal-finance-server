import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { JwtModule } from "./modules/jwt/jwt.module";
import { OtpModule } from "./modules/otp/otp.module";
import { ConfigModule } from "./modules/config/config.module";
import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [DatabaseModule, UsersModule, ConfigModule, OtpModule, JwtModule, AuthModule],
})
export class AppModule {}
