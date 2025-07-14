import { Request } from "express";
import { AuthService } from "./auth.service";
import { OAuthService } from "./oauth/oauth.service";
import { ZodValidationPipe } from "@/pipes/zod-validation/zod-validation.pipe";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UsePipes } from "@nestjs/common";

@Controller("auth")
@UsePipes(new ZodValidationPipe())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oAuthService: OAuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async login(@Body() data: any, @Req() request: Request) {
    const user = await this.authService.verifyLogin(data);
    const token = await this.authService.signIn(user, request);
    return { message: "Login successful", data: token };
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
