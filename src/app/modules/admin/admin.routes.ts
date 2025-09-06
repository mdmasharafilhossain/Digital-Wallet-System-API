import express from "express";
import * as adminController from "./admin.controller";
import { restrictTo, verifyToken } from "../../middlewares/checkAuth";


const router = express.Router();

router.use(verifyToken, restrictTo("admin"));

router.get("/users", adminController.getAllUsers);
router.get("/agents", adminController.getAllAgents);
router.get("/wallets", adminController.getAllWallets);
router.patch("/wallets/:id/block", adminController.toggleWalletBlock);
router.patch("/agents/:id/approve", adminController.toggleAgentApproval);
router.patch("/users/:id/block", adminController.toggleUserBlock);

export default router;