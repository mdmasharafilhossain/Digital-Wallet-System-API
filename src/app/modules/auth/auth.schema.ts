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