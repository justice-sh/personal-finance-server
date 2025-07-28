import { Injectable, Logger } from "@nestjs/common";
import { CacheService } from "@/infrastructure/cache/cache.service";
import { NotificationService } from "@/infrastructure/notification/notification.service";

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  constructor(
    private readonly cacheService: CacheService,
    private readonly notificationService: NotificationService,
  ) {}

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(data: { email: string; code: string; type: string }) {
    await this.saveOtp(data.email, data.code, data.type);
    await this.notificationService.send();
  }

  async verifyOtp(data: { email: string; code: string; type: string }) {
    const cachedCode = await this.getOtp(data.email, data.type);
    if (!cachedCode) throw new Error("OTP not found or expired");
    return cachedCode === data.code;
  }

  private async saveOtp(email: string, code: string, type: string) {
    await this.cacheService.set(`${email}:${type}`, code);
    this.logger.log(`OTP for ${email} of type ${type} is ${code}`);
  }

  private async getOtp(email: string, type: string): Promise<string | undefined> {
    const code = this.cacheService.get<string>(`${email}:${type}`);
    if (!code) this.logger.warn(`No OTP found for ${email} of type ${type}`);
    return code;
  }
}
