import { Cache } from "cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    return this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<boolean> {
    return this.cache.del(key);
  }

  async clear(): Promise<boolean> {
    return this.cache.clear();
  }

  // getByPrefix<T>(prefix: string) {
  //   const flatStore: { key: string; value: T }[] = [];

  //   this.cache.stores.map(async (store) => {
  //     if (store?.iterator) {
  //       for await (const [key, value] of store.iterator({})) {
  //         if (key.startsWith(prefix)) {
  //           flatStore.push({ key, value });
  //         }
  //       }
  //     }
  //   });

  //   return flatStore;
  // }
}
