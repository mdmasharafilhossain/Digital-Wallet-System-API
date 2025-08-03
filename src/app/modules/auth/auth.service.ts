

import jwt, { SignOptions } from "jsonwebtoken";

import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { LoginInput, RegisterInput } from "./auth.schema";
import { envVars } from "../../config/env";
import httpStatus from "http-status-codes";
import { AppError } from "../../utils/appError";

export const registerUser = async (userData: RegisterInput) => {
  const { name, phone, password, role = "user" } = userData;

 
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT,"Phone number already registered");
  }

  
 


  const allowedRoles = ["user", "agent"];
  if (!allowedRoles.includes(role)) {
    throw new AppError(httpStatus.BAD_REQUEST,"Invalid Roles");
  }

 
  const user = await User.create({ name, phone, password, role });

  
  await Wallet.create({ user: user._id, balance: 50 });

  return user;
};

export const loginUser = async ({ phone, password }: LoginInput) => {
  const user = await User.findOne({ phone }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Password did not Matched")
    
    ;
  }

  if (user.role === "agent" && !user.isAgentApproved) {
    throw new Error("Agent not approved");
  }

  const token = jwt.sign({ id: user._id }, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRES
  } as SignOptions);

  return { user, token };
};