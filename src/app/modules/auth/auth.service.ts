

import jwt from "jsonwebtoken";

import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { LoginInput, RegisterInput } from "./auth.schema";
import { envVars } from "../../config/env";


export const registerUser = async (userData: RegisterInput) => {
  const user = await User.create(userData);
  
  await Wallet.create({ user: user._id, balance: 50 });
  
  return user;
};

export const loginUser = async ({ phone, password }: LoginInput) => {
  const user = await User.findOne({ phone }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  if (user.role === "agent" && !user.isAgentApproved) {
    throw new Error("Agent not approved");
  }

  const token = jwt.sign({ id: user._id }, envVars.JWT_ACCESS_SECRET, {
    expiresIn: Number(envVars.JWT_ACCESS_EXPIRES)
  });

  return { user, token };
};