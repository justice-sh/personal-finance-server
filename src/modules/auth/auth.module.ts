import { AuthService } from "./auth.service";
import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { OAuthService } from "./oauth/oauth.service";
import { JwtService } from "@/modules/jwt/jwt.service";
import { UsersService } from "@/modules/users/users.service";

@Global()
@Module({
  imports: [],
  providers: [AuthService, JwtService, UsersService, OAuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
