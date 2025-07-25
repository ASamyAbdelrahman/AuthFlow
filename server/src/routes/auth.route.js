import { Router } from 'express';
import {
    signup,
    login,
    logout,
    checkAuth,
    verifyEmail,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/check-auth", checkAuth); // implement verifyToken middleware in the controller

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
