import { z } from "zod";

export const addMoneySchema = z.object({
  amount: z.number().min(1)
});

export const sendMoneySchema = z.object({
  receiverId: z.string(),
  amount: z.number().min(1)
});

export const cashInOutSchema = z.object({
  userId: z.string(),
  amount: z.number().min(1)
});