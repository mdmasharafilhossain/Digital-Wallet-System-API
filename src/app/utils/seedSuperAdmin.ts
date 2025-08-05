/* eslint-disable no-console */
import mongoose from "mongoose";

import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";

import { Wallet } from "../modules/wallet/wallet.model";

export const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    
    const adminPhone = envVars.ADMIN_PHONE ;
    const adminPassword = envVars.ADMIN_PASSWORD ;
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ phone: adminPhone, role: "admin" });
    if (existingAdmin) {
    //  throw new AppError(httpStatus.CONFLICT, "Admin Alreday Created")
      await mongoose.disconnect();
      return;
    }
    
    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create admin user
    const admin = await User.create({
      name: "System Admin",
      phone: adminPhone,
      password: adminPassword,
      role: "admin",
      isAgentApproved: true,
      isActive: true
    });
    
    // Create admin wallet
    await Wallet.create({ user: admin._id, balance: 50 });
    
    // console.log("Admin created successfully!");
    // console.log(`Phone: ${adminPhone}`);
    // console.log(`Password: ${adminPassword}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};
seedSuperAdmin()