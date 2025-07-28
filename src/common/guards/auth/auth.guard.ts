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
    if (!token) throw new UnauthorizedException("No token provided");

    const tokenPayload = await this.authService.verifyToken(token).catch(() => {
      throw new ForbiddenException("Invalid token");
    });

    const user = await this.usersService.findByEmail(tokenPayload.email);
    if (!user) throw new ForbiddenException("User not found");

    // TODO: enable later, also, consider having a EmailNotVerifiedException
    // if (!user.emailVerifiedAt) throw new UnauthorizedException("Email not verified");

    const authUser: AuthUser = { id: user.id, email: user.email };

    request.user = authUser;
    return true;
  }
}
