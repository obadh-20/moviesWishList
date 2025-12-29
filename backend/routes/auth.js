import express from "express";
import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
import { authMiddleware } from "../midlleware/auth_middleware.js"
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, (req, res) => {
    console.log(req.user);
    res.json(req.user);
});
export default router;