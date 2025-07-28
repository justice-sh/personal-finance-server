import { AuthService } from "./auth.service";
import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { OAuthService } from "./oauth/oauth.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { UsersService } from "@/modules/users/users.service";
import { AuthSessionService } from "./auth-session/auth-session.service";

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  exports: [AuthService, AuthSessionService],
  providers: [AuthService, JwtService, UsersService, OAuthService, AuthSessionService],
})
export class AuthModule {}
