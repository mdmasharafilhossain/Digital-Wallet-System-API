import express from "express";
import * as authController from "./auth.controller";
import cookieParser from "cookie-parser";
import { validate } from "../../utils/validate";
import { loginSchema, registerSchema, updateSchema } from "./auth.schema";
import { verifyToken } from "../../middlewares/checkAuth";

const router = express.Router();
router.use(cookieParser());

router.post("/register",validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/profile",verifyToken, authController.getProfile);
router.patch("/profile",verifyToken, validate(updateSchema), authController.updateProfile);

export default router;