/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";

import { AppError } from "../../utils/appError";
import { Transaction } from "./transaction.model";

export const getMyTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ from: req.user._id }, { to: req.user._id }]
    }).sort("-createdAt");
    
    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: { transactions }
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get transactions"));
  }
};

export const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await Transaction.find().sort("-createdAt");
    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: { transactions }
    });
  
  } catch (err: any) {
    next(new AppError(500, "Failed to get transactions"));
  }
};