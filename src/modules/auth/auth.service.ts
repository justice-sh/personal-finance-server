import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthUser } from "@/shared/types/guards";
import { JwtService } from "@/common/jwt/jwt.service";
import { User } from "@/infrastructure/database/types";
import { UsersService } from "@/modules/users/users.service";
import { AuthSessionService } from "./auth-session/auth-session.service";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";

const cookie_name = "access_token";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authSessionService: AuthSessionService,
  ) {}
  async signIn(user: AuthUser, request: Request) {
    const accessToken = this.generateToken(user);
    await this.authSessionService.register(accessToken, user);

    request.res?.cookie(cookie_name, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { accessToken };
  }

  async refreshToken(request: Request) {
    const accessToken = this.retrieveToken(request);
    if (!accessToken) throw new ForbiddenException("No access token provided");

    const user = await this.authSessionService.find(accessToken);
    if (!user) throw new ForbiddenException("Invalid access token");

    await this.authSessionService.unregister(accessToken);
    return this.signIn(user, request);
  }

  signOut(request: Request) {
    request.res?.clearCookie(cookie_name);
  }

  async verifyLogin(data: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException("Invalid email or password");

    if (!user.password) throw new BadRequestException("Invalid email or password");

    const isValid = await this.usersService.verifyPassword(data.password, user.password);
    if (!isValid) throw new BadRequestException("Invalid email or password");

    // TODO: enable later, also, consider having a EmailNotVerifiedException
    // if (!user.emailVerifiedAt) throw new BadRequestException("Email not verified");
    return user;
  }

  retrieveToken(request: Request): string | undefined {
    const authorization = request.headers["authorization"];

    let token = authorization?.split(" ")[1];
    if (token) return token;

    token = request.cookies?.[cookie_name];
    if (token) return token;

    token = request.body?.accessToken;
    return token;
  }

  private generateToken(user: Pick<User, "id" | "email">) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): Promise<JwtPayload & { email: string }> {
    return new Promise((resolve, reject) => {
      try {
        const payload = this.jwtService.verify(token) as JwtPayload & { email: string };
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  }
}
