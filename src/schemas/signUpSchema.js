import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password must be at most 100 characters long" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

export const emailValidation = z.string().email({ message: "Invalid email address" });

export const signUpSchema = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
