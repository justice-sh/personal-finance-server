import { AuthService } from "@/modules/auth/auth.service";
import { UsersService } from "@/modules/users/users.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.authService.retriveToken(request);
    if (!token) throw new UnauthorizedException("No token provided");

    try {
      const tokenPayload = this.authService.verifyToken(token);
      const user = await this.usersService.findByEmail(tokenPayload.email);

      if (!user) throw new UnauthorizedException("User not found");
      if (!user.emailVerifiedAt) throw new UnauthorizedException("Email not verified");

      request.user = { id: user.id, email: user.email };
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
