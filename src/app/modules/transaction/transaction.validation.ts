import { z } from "zod";

export const transactionValidationSchema = z.object({
  type: z.enum(["top-up", "withdraw", "send", "cash-in", "cash-out"]),
  
  amount: z
    .number()
    .positive("Amount must be a positive number"),
  
  fee: z
    .number()
    .min(0, "Fee cannot be negative"),
  
  commission: z
    .number()
    .min(0, "Commission cannot be negative"),
  
  from: z
    .string()
    .length(24, "Sender ID must be a valid 24-character ObjectId")
    .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId for sender"),
  
  to: z
    .string()
    .length(24, "Receiver ID must be a valid 24-character ObjectId")
    .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId for receiver"),
  
  status: z.enum(["pending", "completed", "failed"]),
  
  createdAt: z
    .string()
    .datetime({ offset: true })
    .transform((str) => new Date(str))
    .optional(), // Mongoose can default this
});
