/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
 

import { AppError } from "../utils/appError";
import { User } from "../modules/user/user.model";
import { envVars } from "../config/env";
import { Wallet } from "../modules/wallet/wallet.model";

declare global {
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user?: any;
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }
console.log("🔐 Auth Header:", req.headers.authorization);
console.log("🍪 Cookie Token:", req.cookies?.token);
  if (!token) return next(new AppError(401, "Not authenticated"));

  try {
    const decoded = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("+role");
    console.log("✅ Decoded token:", decoded);
    if (!user) return next(new AppError(401, "User no longer exists"));
    if (!user.isActive) return next(new AppError(403, "Account suspended"));

    req.user = user;
    next();
  } catch (err) {
    next(new AppError(401, "Invalid token"));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Unauthorized action"));
    }
    next();
  };
};

export const checkWalletStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const wallet = await Wallet.findOne({ user: req.user._id });
  if (wallet?.isBlocked) {
    return next(new AppError(403, "Wallet is blocked"));
  }
  next();
};