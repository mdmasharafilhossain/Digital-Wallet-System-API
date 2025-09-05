/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import * as walletService from "./wallet.service";
import { addMoneySchema, cashInOutSchema, sendMoneySchema, withdrawSchema } from "./wallet.schema";
import mongoose from "mongoose";


export const addMoney = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount } = addMoneySchema.parse(req.body);
    const wallet = await walletService.addMoney(req.user._id, amount);
    
    res.status(200).json({
      status: "success",
       message: "Money Added successfully",
      data: { wallet }
    });
  } catch (err: any) {
    next(err);
  }
};

export const sendMoney = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { receiverId, amount } = sendMoneySchema.parse(req.body);
    await walletService.sendMoney(
      req.user._id,
      new mongoose.Types.ObjectId(receiverId),
      amount
    );
    
    res.status(200).json({
      status: "success",
      message: "Money sent successfully"
    });
  } catch (err: any) {
    next(err);
  }
};

export const cashIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, amount } = cashInOutSchema.parse(req.body);
    await walletService.cashIn(
      req.user._id,
      new mongoose.Types.ObjectId(userId),
      amount
    );
    
    res.status(200).json({
      status: "success",
      message: "Cash-in successful"
    });
  } catch (err: any) {
    next(err);
  }
};

export const cashOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, amount } = cashInOutSchema.parse(req.body);
    await walletService.cashOut(
      req.user._id,
      new mongoose.Types.ObjectId(userId),
      amount
    );
    
    res.status(200).json({
      status: "success",
      message: "Cash-out successful"
    });
  } catch (err: any) {
    next(err);
  }
};
export const withdrawMoney = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
     const { amount } = withdrawSchema.parse(req.body);;
    const wallet = await walletService.withdrawMoney(req.user._id, amount);
    
    res.status(200).json({
      status: "success",
      message: "Withdrawal successful",
      data: { 
        newBalance: wallet.balance,
        transactionId: wallet._id
      }
    });
  } catch (err: any) {
    if (err.message.includes("Insufficient funds")) {
      return next(new AppError(400, "Insufficient balance for withdrawal"));
    }
    next(err);
  }
};
export const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const wallet = await walletService.getWallet(req.user._id);
    res.status(200).json({
      status: "success",
      data: { wallet }
    });
  } catch (err: any) {
    next(new AppError(404, "Wallet not found"));
  }
};