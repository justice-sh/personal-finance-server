import { Cache } from "cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cache.get<T>(key);

    // this.cache.stores.forEach((store) => {
    //   console.log(`Cache store: ${store}`);
    // });

    return value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }
  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async clear(): Promise<void> {
    await this.cache.clear();
  }
}
