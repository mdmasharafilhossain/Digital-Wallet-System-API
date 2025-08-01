import { z } from "zod";

export const userValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters")
    .trim(),

  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .trim(),

  role: z.enum(["user", "agent", "admin"]).default("user"),

  isAgentApproved: z.boolean().default(false),

  isActive: z.boolean().default(true),

  createdAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
});
