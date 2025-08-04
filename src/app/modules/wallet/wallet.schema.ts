import { z } from "zod";

export const addMoneySchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
});


export const sendMoneySchema = z.object({
  receiverId: z
    .string()
    .length(24, "Receiver ID must be a 24-character MongoDB ObjectId"),
  amount: z.number().min(1, "Amount must be at least 1"),
});


export const cashInOutSchema = z.object({
  userId: z
    .string()
    .length(24, "User ID must be a 24-character MongoDB ObjectId"),
  amount: z.number().min(1, "Amount must be at least 1"),
});

export const withdrawSchema = z.object({
 amount: z.number().min(1, "Amount must be at least 1"),
});
