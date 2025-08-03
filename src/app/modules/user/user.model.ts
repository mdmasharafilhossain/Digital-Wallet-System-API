import {  Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.interface";
import { envVars } from "../../config/env";



const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"]
  },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ["user", "agent", "admin"],
    default: "user"
  },
  isAgentApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(Number(envVars.BCRYPT_SALT_ROUND));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


export const User = model<IUser>("User", userSchema);