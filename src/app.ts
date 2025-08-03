import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './app/modules/auth/auth.routes';
import { errorHandler } from './app/middlewares/globalErrorHandler';

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/wallet", walletRouter);
// app.use("/api/v1/transactions", transactionRouter);
// app.use("/api/v1/admin", adminRouter);

// Health check route
app.get('/', (req, res) => res.send('Digital Wallet API is running'));

// Global error handler
app.use(errorHandler);

export default app;
