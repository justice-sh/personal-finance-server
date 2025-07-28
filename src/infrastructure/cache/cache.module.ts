import { CacheService } from "./cache.service";
import { Global, Module } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";

@Global()
@Module({
  imports: [NestCacheModule.register({ ttl: 1000 * 60 * 30 })], // Cache TTL set to 30 minutes
  exports: [NestCacheModule, CacheService],
  providers: [CacheService],
})
export class CacheModule {}
