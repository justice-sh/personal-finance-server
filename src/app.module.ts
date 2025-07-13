import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { JwtModule } from "./modules/jwt/jwt.module";
import { OtpModule } from "./modules/otp/otp.module";
import { AuthService } from "./modules/auth/auth.service";
import { UsersService } from "./modules/users/users.service";
import { ConfigModule } from "./modules/config/config.module";
import { UsersController } from "./modules/users/users.controller";
import { DatabaseModule } from "./modules/database/database.module";

@Module({
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, AuthService],
  imports: [DatabaseModule, ConfigModule, OtpModule, JwtModule],
})
export class AppModule {}
