import { Module } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { ConfigService } from "@/modules/config/config.service";

@Module({
  providers: [JwtService, ConfigService],
  exports: [JwtService],
})
export class JwtModule {}
