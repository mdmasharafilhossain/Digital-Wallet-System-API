import express from "express";
import * as authController from "./auth.controller";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;