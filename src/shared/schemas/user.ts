import z from "zod";

export function PasswordSchema() {
  return z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
  });
}

export function OTPSchema() {
  return z
    .string({ required_error: "OTP is required" })
    .min(6, "OTP must be at least 6 characters long")
    .max(6, "OTP must be at most 6 characters long")
    .describe("Your OTP code");
}
