import { Types } from "mongoose";

export interface IWallet extends Document {
  user: Types.ObjectId;
  balance: number;
  isBlocked: boolean;
}