import express from "express";
import { registerUser, loginUser } from "../controller/AuthController.js";
import {
  authenticateApp,
  routeProtection,
  verifyRoleSystem,
} from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);

authRouter.post("/register", routeProtection, verifyRoleSystem, registerUser);

export default authRouter;
