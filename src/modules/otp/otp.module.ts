import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { NotificationService } from "../notification/notification.service";

@Module({
  providers: [OtpService, NotificationService],
  exports: [OtpService],
})
export class OtpModule {}
