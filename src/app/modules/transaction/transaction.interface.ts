import { Types } from "mongoose";

type TransactionType = "top-up" | "withdraw" | "send" | "cash-in" | "cash-out";
type TransactionStatus = "pending" | "completed" | "failed";

export interface ITransaction extends Document {
  type: TransactionType;
  amount: number;
  fee: number;
  commission: number;
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: TransactionStatus;
  createdAt: Date;
}