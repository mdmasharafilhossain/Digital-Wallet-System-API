
import mongoose from "mongoose";

import { AppError } from "../../utils/appError";
import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";

const COMMISSION_RATE = 0.01; // 1% commission

const updateBalance = async (
  userId: mongoose.Types.ObjectId,
  amount: number,
  session: mongoose.ClientSession
) => {
  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    { $inc: { balance: amount } },
    { new: true, session }
  ).populate("user");
  
  if (!wallet) throw new AppError(404, "Wallet not found");
  if (wallet.balance < 0) throw new AppError(400, "Insufficient funds");
  if (wallet.isBlocked) throw new AppError(403, "Wallet is blocked");
  
  return wallet;
};

export const addMoney = async (
  userId: mongoose.Types.ObjectId,
  amount: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const wallet = await updateBalance(userId, amount, session);
    
    await Transaction.create([{
      type: "top-up",
      amount,
      from: userId,
      to: userId
    }], { session });
    
    await session.commitTransaction();
    return wallet;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const sendMoney = async (
  senderId: mongoose.Types.ObjectId,
  receiverId: mongoose.Types.ObjectId,
  amount: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) throw new AppError(404, "Receiver not found");
    
    await updateBalance(senderId, -amount, session);
    await updateBalance(receiverId, amount, session);
    
    await Transaction.create([{
      type: "send",
      amount,
      from: senderId,
      to: receiverId
    }], { session });
    
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const cashIn = async (
  agentId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  amount: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const commission = amount * COMMISSION_RATE;
    const netAmount = amount - commission;
    
    await updateBalance(userId, netAmount, session);
    
    await Transaction.create([{
      type: "cash-in",
      amount: netAmount,
      commission,
      from: agentId,
      to: userId
    }], { session });
    
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const cashOut = async (
  agentId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  amount: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const commission = amount * COMMISSION_RATE;
    const netAmount = amount + commission;
    
    await updateBalance(userId, -netAmount, session);
    
    await Transaction.create([{
      type: "cash-out",
      amount: netAmount,
      commission,
      from: userId,
      to: agentId
    }], { session });
    
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const getWallet = async (userId: mongoose.Types.ObjectId) => {
  return Wallet.findOne({ user: userId }).populate("user");
};