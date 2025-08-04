import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import walletRouter from "./app/modules/wallet/wallet.routes";
import adminRouter from "./app/modules/admin/admin.routes";
import { errorHandler } from "./app/middlewares/globalErrorHandler";
import authRouter from "./app/modules/auth/auth.routes";
import transactionRouter from "./app/modules/transaction/transaction.routes";


 const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/admin", adminRouter);

// Error handling
app.use(errorHandler);

export default app;