import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ["top-up", "withdraw", "send", "cash-in", "cash-out"],
    required: true
  },
  amount: { type: Number, required: true, min: 1 },
  fee: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  from: { type: Schema.Types.ObjectId, ref: "User" },
  to: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed"
  },
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);