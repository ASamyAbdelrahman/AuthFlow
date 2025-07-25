import mongoose from 'mongoose';
import { PasswordService } from '../services/passwordService.js';
import { validateEmail, validatePassword } from '../utils/validator.js';
import logger from '../utils/logger.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validateEmail,
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: validatePassword,
            message: 'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one number',
        },
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await PasswordService.hashPassword(this.password);
        next();
    } catch (error) {
        logger.error(`Error hashing password for user ${this.email}: ${error.message}`);
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await PasswordService.comparePassword(candidatePassword, this.password);
    } catch (error) {
        logger.error(`Error comparing password for user ${this.email}: ${error.message}`);
        throw error;
    }
};

const User = mongoose.model('User', userSchema);
export default User;