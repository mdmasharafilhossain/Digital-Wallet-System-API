/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import {  ZodTypeAny } from "zod"; 
import { AppError } from "./appError";


export const validate = (schema: ZodTypeAny) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const errors = error.errors.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
     
      next(new AppError(400, `Validation failed: ${errors.map((e: any) => e.message).join(', ')}`));
    }
  };
