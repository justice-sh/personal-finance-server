import { UsersService } from "./users.service";
import { OtpService } from "../otp/otp.service";
import { Global, Module } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UsersController } from "./users.controller";
import { JwtService } from "@/modules/jwt/jwt.service";
import { NotificationService } from "../notification/notification.service";

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, OtpService, NotificationService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
