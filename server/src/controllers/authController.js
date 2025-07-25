import logger from '../utils/logger.js';
import User from '../models/User.js';
import EmailService from '../services/emailService.js';
import { validateEmail, validatePassword } from '../utils/validator.js';
import { generateTokenAndSetCookie } from '../services/authService.js';
import { mailtrapClient, sender } from '../config/mail.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required',
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message:
                    'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one number',
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

        const user = new User({
            name,
            email,
            password,
            verificationToken,
            verificationTokenExpiresAt,
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        const emailService = new EmailService(mailtrapClient, sender, join(__dirname, '../templates'));
        await emailService.sendVerificationEmail(email, verificationToken);

        logger.info(`User signed up successfully: ${email}`);

        res.status(201).json({
            success: true,
            message: 'User created successfully. Please verify your email.',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        logger.error(`Error during signup for email ${email}: ${error.message}`);

        res.status(500).json({
            success: false,
            message: 'An error occurred during signup',
        });
    }
};


export const verifyEmail = async (req, res) => {
    res.send("Verify email endpoint is not implemented yet.");
};

export const login = async (req, res) => {
    res.send("Login endpoint is not implemented yet.");
};

export const logout = async (req, res) => {
    res.send("Logout endpoint is not implemented yet.");
};

export const forgotPassword = async (req, res) => {
    res.send("Forgot password endpoint is not implemented yet.");
};

export const resetPassword = async (req, res) => {
    res.send("Reset password endpoint is not implemented yet.");
};

export const checkAuth = async (req, res) => {
    res.send("Check auth endpoint is not implemented yet.");
};