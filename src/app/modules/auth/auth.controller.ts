/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import * as authService from "./auth.service";
import { loginSchema, registerSchema, updateSchema } from "./auth.schema";
import { envVars } from "../../config/env";


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
      secure: envVars.NODE_ENV === 'production',
      domain:envVars.NODE_ENV === 'production' ? 'https://digital-wallet-client-beta.vercel.app/' : 'localhost',
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


export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (err: any) {
    next(new AppError(500, "Logout failed"));
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new AppError(401, "Not authenticated"));
    }

    const user = await authService.getUserFromToken(token);
    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err: any) {
    next(new AppError(500, err.message || "Could not fetch profile"));
  }
};





export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
   

    const input = updateSchema.parse(req.body);

    const updatedUser = await authService.updateUserProfile(req.user._id, input);

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (err: any) {
    next(new AppError(400, err.message));
  }
};


