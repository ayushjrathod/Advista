import { z } from "zod";

const tokenValidation = z.string().length(6, "Verification code must be 6 digits");

const emailValidation = z.string().email("Invalid email format");

export const verifySchema = z.object({
  email: emailValidation,
  verify_code: tokenValidation,
});

// Simplified schema for just the verification code
export const verifyCodeSchema = z.object({
  verify_code: tokenValidation,
});
