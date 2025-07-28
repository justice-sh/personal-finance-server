import { Injectable } from "@nestjs/common";
import { AuthUser } from "@/shared/types/guards";
import { CacheService } from "@/infrastructure/cache/cache.service";

@Injectable()
export class AuthSessionService {
  constructor(private readonly cache: CacheService) {}

  async register(token: string, user: AuthUser): Promise<void> {
    const data = { id: user.id, email: user.email };
    await this.cache.set(`token:${token}`, data, 1000 * 60 * 60 * 24); // Store token with a TTL of 24 hours
  }

  async find(token: string): Promise<AuthUser | undefined> {
    const user = await this.cache.get<AuthUser>(`token:${token}`);
    return user;
  }

  async unregister(token: string): Promise<void> {
    await this.cache.del(`token:${token}`);
  }

  // Additional methods for managing user sessions; to be used mostly by the application logic
  findByUserId(userId: string) {
    // Get all tokens and filter by userId
  }

  unregisterByUserId(userId: string) {
    // Get all tokens and filter by userId, then delete them
  }
}
