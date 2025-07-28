import { Injectable } from "@nestjs/common";
import { NotificationService } from "@/infrastructure/notification/notification.service";

@Injectable()
export class OtpService {
  constructor(private readonly notificationService: NotificationService) {}

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(email: string, code: string, type: string) {
    // save OTP to database or cache (not implemented here)
    console.log(`OTP for ${email} of type ${type} is ${code}`);
  }

  async sendOtp(data: { email: string; code: string; type: string }) {
    // save OTP to database or cache (not implemented here)

    await this.notificationService.send();
  }

  async verifyOtp(data: { email: string; code: string; type: string }) {
    // verify OTP from database or cache (not implemented here)
    return true;
  }
}
