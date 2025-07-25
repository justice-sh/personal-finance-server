import * as jwt from "jsonwebtoken";
import { StringValue } from "@/types/jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@/modules/config/config.service";

@Injectable()
export class JwtService {
  private readonly options: { secret: string; expiresIn: StringValue };

  constructor(private readonly configService: ConfigService) {
    this.options = this.configService.get((env) => env.JWT);
  }

  sign(payload: string | object): string {
    const { secret, expiresIn } = this.options;
    return jwt.sign(payload, secret, { expiresIn });
  }

  verify<T extends object>(token: string): jwt.JwtPayload & T {
    return jwt.verify(token, this.options.secret) as jwt.JwtPayload & T;
  }
}
