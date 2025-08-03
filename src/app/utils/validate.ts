/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import {  ZodTypeAny } from "zod"; 
import { AppError } from "./appError";


export const validate = (schema: ZodTypeAny) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("Incoming req.body:", req.body);
      schema.parse(req.body); 
      next();
    } catch (error: any) {
      const errors = error.issues?.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      })) || [];

      // console.error("Validation failed:", errors);
      
      next(
        new AppError(
          400,
          `Validation failed: ${errors.map((e: any) => `${e.path}: ${e.message}`).join(', ')}`
        )
      );
    }
  };
