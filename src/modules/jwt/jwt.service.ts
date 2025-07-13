import { ConfigService } from "@/modules/config/config.service";
import { StringValue } from "@/types/jwt";
import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
  private readonly options: { secret: string; expiresIn: StringValue };

  constructor(private readonly configService: ConfigService) {
    this.options = {
      secret: this.configService.get("JWT_SECRET"),
      expiresIn: "5m",
    };
  }

  sign(payload: string | object): string {
    const { secret, expiresIn } = this.options;
    return jwt.sign(payload, secret, { expiresIn });
  }

  verify<T extends object>(token: string): jwt.JwtPayload & T {
    return jwt.verify(token, this.options.secret) as jwt.JwtPayload & T;
  }
}
