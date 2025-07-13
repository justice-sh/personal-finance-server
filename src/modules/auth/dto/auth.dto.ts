// import { OTPSchema, PasswordSchema } from "@/schemas/user";
// import { createZodDto } from "nestjs-zod";
// import { z } from "zod";

// export class LoginUserRequestDto extends createZodDto(ContactSchema().and(PasswordSchema())) {}

// export class VerifyRegistrationDto extends createZodDto(z.object({ otp: OTPSchema() }).and(ContactSchema())) {}

// export class PasswordResetDto extends createZodDto(
//   z.object({ resetOtp: OTPSchema() }).and(ContactSchema()).and(PasswordSchema()),
// ) {}

// export class VerifyPasswordResetDto extends createZodDto(z.object({ otp: OTPSchema() }).and(ContactSchema())) {}

// export class ResendOtpDto extends createZodDto(ContactSchema()) {}

// export class RefreshTokenRequestDto extends createZodDto(
//   z.object({ refreshToken: z.string().describe("Your current refresh token") }),
// ) {}
