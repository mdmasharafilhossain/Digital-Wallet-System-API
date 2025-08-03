/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import * as authService from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";


export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = registerSchema.parse(req.body);
    const user = await authService.registerUser(input);
    
    res.status(201).json({
      status: "success",
      data: { user }
    });
  } catch (err: any) {
    next(new AppError(400, err.message));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = loginSchema.parse(req.body);
    const { user, token } = await authService.loginUser(input);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 90 * 24 * 60 * 60 * 1000 
    });
    
    res.status(200).json({
      status: "success",
      data: { token, user }
    });
  } catch (err: any) {
    next(new AppError(401, err.message));
  }
};