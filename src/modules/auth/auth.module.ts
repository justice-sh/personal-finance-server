import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JwtService } from "@/modules/jwt/jwt.service";
import { UsersService } from "@/modules/users/users.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { ConfigService } from "@/modules/config/config.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "google" })],
  providers: [AuthService, ConfigService, JwtService, UsersService, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
