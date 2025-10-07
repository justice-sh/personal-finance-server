import { Request } from "express";
import { CreateUserDto } from "./user.dto";
import { OtpService } from "../otp/otp.service";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { ZodValidationPipe } from "@/common/pipes/zod-validation/zod-validation.pipe";
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

    return { message: "Account created successfully" };
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

  @Post("users/forgot-password")
  async forgotPassword(body: { email: string }) {
    // send forgot password otp to email
  }

  @Post("users/reset-password")
  async resetPassword(body: { code: string; email: string; newPassword: string }) {
    // verify code
    // ensure user exists
    // ensure user's email is verified
    // hash new password
    // update new password
  }

  // Authenticated endpoint
  @Post("users/request-change-password")
  async changePasswordRequest() {
    // retrieve email from authentication
    // ensure user exists
    // ensure email is verified
    // send change-password otp code
    // return message otp code sent successfully
  }

  // Authenticated endpoint
  @Post("users/change-password")
  async changePassword(body: { code: string; currentPassword: string; newPassword: string }) {
    // verify code
    // retrieve email from authentication
    // ensure user exists
    // ensure user's email is verified
    // ensure currentPassword matches
    // hash new password
    // update new password
  }
}
