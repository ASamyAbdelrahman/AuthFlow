/**
 * @file auth.route.js
 * @brief Routes for authentication-related operations.
 */

// Import necessary modules and controllers
import { Router } from 'express';
import {
    signup,
    login,
    logout,
    checkAuth,
    verifyEmail,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";

// Create a new router instance
const router = Router();

// Define routes for authentication
router.get("/check-auth", checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
