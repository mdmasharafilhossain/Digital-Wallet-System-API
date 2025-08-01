import { z } from 'zod';

export const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),

  password: z.string().min(6, "Password must be at least 6 characters"), 
  
  role: z.enum(['user', 'agent', 'admin']).optional(), 
  isAgentApproved: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
});
