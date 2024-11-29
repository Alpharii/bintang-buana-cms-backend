import express from "express";
import { login, register, changePassword } from "../controllers/authController";

const router = express.Router();

// Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/change-password", changePassword);


export default router;
