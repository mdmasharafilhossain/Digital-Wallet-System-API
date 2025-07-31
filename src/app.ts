import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';



dotenv.config();

const app = express();

// Middleware setup
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes


// Basic route
app.get('/', (req, res) => res.send('Digital Wallet API is running'));

export default app;
