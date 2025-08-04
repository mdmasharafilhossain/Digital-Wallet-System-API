/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";

import { AppError } from "../../utils/appError";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users }
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get users"));
  }
};

export const getAllAgents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agents = await User.find({ role: "agent" });
    res.status(200).json({
      status: "success",
      results: agents.length,
      data: { agents }
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get agents"));
  }
};

export const getAllWallets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const wallets = await Wallet.find().populate("user");
    res.status(200).json({
      status: "success",
      results: wallets.length,
      data: { wallets }
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get wallets"));
  }
};

export const toggleWalletBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return next(new AppError(404, "Wallet not found"));
    
    wallet.isBlocked = !wallet.isBlocked;
    await wallet.save();
    
    res.status(200).json({
      status: "success",
      data: { wallet }
    });
  } catch (err: any) {
    next(err);
  }
};

export const toggleAgentApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent || agent.role !== "agent") {
      return next(new AppError(404, "Agent not found"));
    }
    
    agent.isAgentApproved = !agent.isAgentApproved;
    await agent.save();
    
    res.status(200).json({
      status: "success",
      data: { agent }
    });
  } catch (err: any) {
    next(err);
  }
};