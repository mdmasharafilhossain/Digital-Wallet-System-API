import express from "express";
import * as walletController from "./wallet.controller";
import { checkWalletStatus, restrictTo, verifyToken } from "../../middlewares/checkAuth";
import { validate } from "../../utils/validate";

import { addMoneySchema, cashInOutSchema, sendMoneySchema } from "./wallet.schema";


const router = express.Router();

router.use(verifyToken, checkWalletStatus);

router.post("/add-money", validate(addMoneySchema) ,restrictTo("user"), walletController.addMoney);
router.post("/send-money",validate(sendMoneySchema) , restrictTo("user"), walletController.sendMoney);
router.get("/me", walletController.getWallet);

router.post("/cash-in",validate(cashInOutSchema) , restrictTo("agent"), walletController.cashIn);
router.post("/cash-out",validate(cashInOutSchema) , restrictTo("agent"), walletController.cashOut);

export default router;