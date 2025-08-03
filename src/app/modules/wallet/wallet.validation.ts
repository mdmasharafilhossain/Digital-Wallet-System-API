import { z } from "zod";

export const walletValidationSchema = z.object({
  user: z
    .string()
    .length(24, "User ID must be a valid 24-character ObjectId")
    .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId"),

 balance: z
  .number()
  .min(0, "Balance cannot be negative")
  .max(1000000, "Balance exceeds limit")
  .optional(),


  isBlocked: z.boolean().default(false).optional(),
});
