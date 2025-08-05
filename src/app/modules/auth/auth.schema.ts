import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .trim(),
  role: z.enum(["user", "agent","admin"]).default("user")
});

export const loginSchema = z.object({
  phone: z.string(),
  password: z.string()
});

// Explicitly define the types
export interface RegisterInput  {
  name: string;
  phone: string;
  password: string;
  role?: "user" | "agent";
};

export interface LoginInput {
  phone: string;
  password: string;
};