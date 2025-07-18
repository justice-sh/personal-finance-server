import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { Request } from "express";
import { AuthUser } from "@/types/guards";
import { AuthService } from "./auth.service";
import { OAuthService } from "./oauth/oauth.service";
import { LoginUserRequestDto } from "./dto/auth.dto";
import { UsersService } from "../users/users.service";
import { AuthorizationGuard } from "@/guards/auth/auth.guard";
import { ZodValidationPipe } from "@/pipes/zod-validation/zod-validation.pipe";

@Controller("auth")
@UsePipes(new ZodValidationPipe())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly oAuthService: OAuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async login(@Body() body: LoginUserRequestDto, @Req() request: Request) {
    const user = await this.authService.verifyLogin(body);
    const token = await this.authService.signIn(user, request);
    return { message: "Login successful", data: token };
  }

  @HttpCode(HttpStatus.OK)
  @Post("me")
  @UseGuards(AuthorizationGuard)
  async me(@Req() request: { user: AuthUser }) {
    const user = await this.userService.findByEmail(request.user.email);

    if (!user) throw new UnauthorizedException("User not found");

    const data = {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerifiedAt: user.emailVerifiedAt,
    };

    return { message: "Auth me successful", data };
  }

  @HttpCode(HttpStatus.OK)
  @Get("oauth/:provider")
  async getOAuthUrl(@Req() req: Request) {
    const url = this.oAuthService.getAuthUrl(req);
    return { url };
  }

  @HttpCode(HttpStatus.OK)
  @Get("callback/:provider")
  async providerCallback(@Req() req: Request<{ provider: string }>) {
    const user = await this.oAuthService.linkUser(req);
    const auth = this.authService.signIn(user, req);

    return {
      message: `${req.params.provider} login successful`,
      data: auth,
    };
  }
}
