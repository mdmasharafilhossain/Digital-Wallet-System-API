/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

/**
 * GET all users with pagination
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: "user" }).skip(skip).limit(limit);;
    const total = await User.countDocuments({ role: "user" });

    res.status(200).json({
      status: "success",
      results: total,
      data: { users }
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get users"));
  }
};

/**
 * GET all agents with pagination
 */
export const getAllAgents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const agents = await User.find({ role: "agent" }).skip(skip).limit(limit);
    const total = await User.countDocuments({ role: "agent" });

    res.status(200).json({
      status: "success",
      results: agents.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: { agents },
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get agents"));
  }
};

/**
 * GET all wallets with pagination
 */
export const getAllWallets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const wallets = await Wallet.find()
      .populate("user")
      .skip(skip)
      .limit(limit);
    const total = await Wallet.countDocuments();

    res.status(200).json({
      status: "success",
      results: wallets.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: { wallets },
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get wallets"));
  }
};

/**
 * TOGGLE Wallet block/unblock
 */
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
      data: { wallet },
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * TOGGLE Agent approval
 */
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
      data: { agent },
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * TOGGLE User block/unblock
 */
export const toggleUserBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError(404, "User not found"));

    user.isActive = !user.isActive; // flip active status
    await user.save();

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err: any) {
    next(err);
  }
};
