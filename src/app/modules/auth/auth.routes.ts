import express from "express";
import * as authController from "./auth.controller";
import cookieParser from "cookie-parser";
import { validate } from "../../utils/validate";
import { loginSchema, registerSchema } from "./auth.schema";

const router = express.Router();
router.use(cookieParser());

router.post("/register",validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authController.getProfile);

export default router;