import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtService } from "@/modules/jwt/jwt.service";
import { OtpService } from "../otp/otp.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, OtpService],
  exports: [UsersService],
})
export class UsersModule {}
