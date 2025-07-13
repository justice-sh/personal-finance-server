import { UsersService } from "@/modules/users/users.service";
import { Injectable } from "@nestjs/common";
import { GoogleUser, ProviderUser } from "../dto/provider";
import { User } from "@/modules/database/types";

@Injectable()
export class ProviderService {
  constructor(private readonly userService: UsersService) {}

  getGoogleUser(user: GoogleUser): ProviderUser {
    return {
      id: user.profile.id,
      providerUserId: user.profile.id,
      email: user.profile._json.email,
      name: user.profile._json.name,
      emailVerified: user.profile._json.email_verified,
      provider: user.profile.provider,
      photo: user.profile.photos[0]?.value,
    };
  }

  async saveUser(data: ProviderUser): Promise<User> {
    let user = await this.userService.findByEmail(data.email);

    if (!user) {
      user = await this.userService.createUser({
        email: data.email,
        name: data.name,
        password: "",
      });
    }

    return user;
  }
}
