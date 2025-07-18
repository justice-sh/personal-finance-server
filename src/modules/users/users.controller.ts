import { Request } from "express";
import { CreateUserDto } from "./user.dto";
import { OtpService } from "../otp/otp.service";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { ZodValidationPipe } from "@/pipes/zod-validation/zod-validation.pipe";
import { BadRequestException, Body, Controller, Post, Req, UsePipes } from "@nestjs/common";

@Controller("users")
@UsePipes(new ZodValidationPipe())
export class UsersController {
  constructor(
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) throw new BadRequestException("Email already exists");

    const hashedPassword = await this.usersService.hashPassword(data.password);
    await this.usersService.create({ ...data, password: hashedPassword });

    const code = this.otpService.generateCode();
    await this.otpService.sendOtp({ ...data, code, type: "verification" });

    return { message: "User created successfully" };
  }

  @Post("verify")
  async verifyEmail(@Req() request: Request, @Body() body: { email: string; code: string }) {
    const isValid = await this.otpService.verifyOtp({ ...body, type: "verification" });
    if (!isValid) throw new BadRequestException("Invalid OTP");

    let user = await this.usersService.findByEmail(body.email);
    if (!user) throw new BadRequestException("User not found");

    user = await this.usersService.updateUser(user.id, { emailVerifiedAt: new Date() });

    const auth = await this.authService.signIn(user, request);

    return { message: "Email verified successfully", data: auth };
  }

  // @Post("forgot-password")
  // async forgotPassword() {}

  // @Post("verify-forgot-password")
  // async verifyForgotPassword() {}

  // @Post("reset-password")
  // async resetPassword() {}
}
