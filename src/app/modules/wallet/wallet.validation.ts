import { z } from 'zod';

export const walletValidationSchema = z.object({
  user: z.string().length(24, "Invalid user ID"), 
  balance: z.number().min(0).optional(), 
  isBlocked: z.boolean().optional() 
});
