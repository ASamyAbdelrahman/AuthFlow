/**
 * @file authService.js
 * @description Service for handling authentication-related operations.
 */

// Import necessary modules
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';
const TOKEN_EXPIRY = process.env.JWT_EXPIRATION || '1h';
const COOKIE_SECURE = process.env.NODE_ENV === 'production';


/**
 * @function generateTokenAndSetCookie
 * @description Generates a JWT token and sets it as a cookie in the response.
 * 
 * @param {*} res - The response object to set the cookie on.
 * @param {*} userId - The ID of the user for whom the token is generated.
 * 
 * @returns {string} The generated JWT token.
 * 
 * @throws {Error} If there is an error generating the token or setting the cookie.
 */
export const generateTokenAndSetCookie = (res, userId) => {
    try {
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        res.cookie('token', token, {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: 'strict',
            maxAge: parseDuration(TOKEN_EXPIRY),
        });

        logger.info(`Token generated and cookie set for user ID: ${userId}`);
        return token;
    } catch (error) {
        logger.error(`Error generating token for user ID: ${userId}: ${error.message}`);
        throw new Error('Failed to generate token and set cookie');
    }
};

/**
 * @function parseDuration
 * @description Parses a duration string (e.g., "1h", "30m") into milliseconds.
 * 
 * @param {string} duration - The duration string to parse.
 * 
 * @returns {number} The duration in milliseconds.
 * 
 * @throws {Error} If the duration format is invalid.
 */
const parseDuration = (duration) => {
    const regex = /^(\d+)([smhd])$/;
    const match = duration.match(regex);
    if (!match) return 3600 * 1000;

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
};