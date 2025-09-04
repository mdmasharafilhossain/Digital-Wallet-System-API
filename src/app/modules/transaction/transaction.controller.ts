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
    const { page = "1", limit = "10", type, startDate, endDate } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filters
    const filter: any = {
      $or: [{ from: req.user._id }, { to: req.user._id }],
    };
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort("-createdAt").skip(skip).limit(limitNumber),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      results: transactions.length,
      data: { transactions },
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
    const {
      page = 1,
      limit = 10,
      type,
      startDate,
      endDate,
    } = req.query;

    const filter: any = {};
    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      results: transactions.length,
      data: { transactions },
    });
  } catch (err: any) {
    next(new AppError(500, "Failed to get transactions"));
  }
};
