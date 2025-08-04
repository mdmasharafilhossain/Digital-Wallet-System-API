import express from "express";
import * as transactionController from "./transaction.controller";
import { restrictTo, verifyToken } from "../../middlewares/checkAuth";


const router = express.Router();

router.use(verifyToken);

router.get("/me", transactionController.getMyTransactions);
router.get("/all", restrictTo("admin"), transactionController.getAllTransactions);

export default router;