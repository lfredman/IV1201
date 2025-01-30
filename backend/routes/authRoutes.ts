import express from "express";
import { login, register, protectedRoute } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/protected", authMiddleware, protectedRoute);

export default router;