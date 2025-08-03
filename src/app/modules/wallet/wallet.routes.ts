import express from "express";
import * as walletController from "./wallet.controller";
import { checkWalletStatus, restrictTo, verifyToken } from "../../middlewares/checkAuth";


const router = express.Router();

router.use(verifyToken, checkWalletStatus);

router.post("/add-money", restrictTo("user"), walletController.addMoney);
router.post("/send-money", restrictTo("user"), walletController.sendMoney);
router.get("/me", walletController.getWallet);

router.post("/cash-in", restrictTo("agent"), walletController.cashIn);
router.post("/cash-out", restrictTo("agent"), walletController.cashOut);

export default router;