import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtService } from "@/modules/jwt/jwt.service";
import { OtpService } from "../otp/otp.service";
import { NotificationService } from "../notification/notification.service";
import { AuthService } from "../auth/auth.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, OtpService, NotificationService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
