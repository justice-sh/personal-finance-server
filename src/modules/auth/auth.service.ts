import { Request } from "express";
import { User } from "../database/types";
import { JwtPayload } from "jsonwebtoken";
import { JwtService } from "@/modules/jwt/jwt.service";
import { UsersService } from "@/modules/users/users.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async signIn(user: Pick<User, "id" | "email">, request: Request) {
    const accessToken = this.generateToken(user);

    request.res?.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { accessToken };
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

  retriveToken(request: Request): string | undefined {
    const authorization = request.headers["authorization"];

    let token = authorization?.split(" ")[1];
    if (token) return token;

    token = request.cookies?.["access_token"];
    if (token) return token;

    token = request.body.accessToken;
    return token;
  }

  generateToken(user: Pick<User, "id" | "email">) {
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
