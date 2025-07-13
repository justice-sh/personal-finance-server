import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { GoogleUser } from "./dto/provider";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ConfigService } from "../config/config.service";
import { ProviderService } from "./services/provider.service";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "@/pipes/zod-validation/zod-validation.pipe";

@Controller("auth")
@UsePipes(new ZodValidationPipe())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly providerService: ProviderService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async login(@Body() data: any, @Req() request: Request) {
    const user = await this.authService.verifyLogin(data);
    const token = await this.authService.signIn(user, request);
    return { message: "Login successful", data: token };
  }

  @Get("google")
  @UseGuards(PassportAuthGuard("google"))
  async googleAuth() {
    return "Redirecting to Google...";
  }

  @Get("google/callback")
  @UseGuards(PassportAuthGuard("google"))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const data = this.providerService.getGoogleUser(req.user as GoogleUser);
    const user = await this.providerService.saveUser(data);

    if (!user.emailVerifiedAt) throw new BadRequestException("Email not verified");

    const token = await this.authService.signIn(user, req);

    const url = this.configService.get((env) => env.CLIENT_APP_URL);
    res.redirect(`${url}?token=${token}`);
  }
}
