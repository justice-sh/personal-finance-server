import { Request } from "express";
import { AuthUser } from "@/shared/types/guards";
import { AuthService } from "@/modules/auth/auth.service";
import { UsersService } from "@/modules/users/users.service";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const token = this.authService.retrieveToken(request);
    if (!token) throw new ForbiddenException("No token provided");

    const payload = await this.authService.verifyToken(token).catch(() => {
      throw new UnauthorizedException("Invalid token");
    });

    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new ForbiddenException("User not found");

    const authUser: AuthUser = { id: user.id, email: user.email };

    request.user = authUser;
    return true;
  }
}
