import { Request } from "express";
import { User } from "../database/types";
import { JwtService } from "@/modules/jwt/jwt.service";
import { UsersService } from "@/modules/users/users.service";
import { BadRequestException, Injectable, Req } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async signIn(user: Pick<User, "id" | "email">, request: Request) {
    const token = this.generateToken(user);

    request.res?.setHeader("Authorization", `Bearer ${token}`);
    return { accessToken: token, refreshToken: "" };
  }

  async verifyLogin(data: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException("Invalid email or password");

    const isValid = await this.usersService.verifyPassword(data.password, user.password);
    if (!isValid) throw new BadRequestException("Invalid email or password");

    if (!user.emailVerifiedAt) throw new BadRequestException("Email not verified");
    return user;
  }

  retriveToken(request: Request) {
    const authorization = request.headers["authorization"];
    return authorization?.split(" ")[1];
  }

  generateToken(user: Pick<User, "id" | "email">) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string) {
    return this.jwtService.verify<{ email: string }>(token);
  }
}
