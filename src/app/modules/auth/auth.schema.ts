import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  password: z.string().min(6),
  role: z.enum(["user", "agent"]).default("user")
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