"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyLoginOTP = exports.sendLoginOTP = exports.verifyVerificationOTP = exports.sendVerificationOTP = exports.verifyPaymentOTP = exports.sendPaymentOTP = void 0;
const otpService_1 = require("../services/otpService");
const UserModel_1 = require("../db/models/UserModel");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Send OTP for crypto payment
 * POST /api/otp/send
 */
const sendPaymentOTP = async (req, res) => {
    try {
        const userId = req.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.email) {
            return res.status(400).json({ error: "User email not found" });
        }
        // Check if 2FA is enabled (recommended but not required)
        if (!user.twoFactorEnabled) {
            // Still allow OTP, but suggest enabling 2FA
        }
        const result = await (0, otpService_1.sendOTP)(user.email);
        if (!result.success) {
            return res.status(500).json({ error: result.error || "Failed to send OTP" });
        }
        // In development, return OTP for testing. In production, don't return it
        res.json({
            message: "OTP sent to your email",
            ...(process.env.NODE_ENV === "development" && { otp: result.otp }), // Only in dev
        });
    }
    catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendPaymentOTP = sendPaymentOTP;
/**
 * Verify OTP for crypto payment
 * POST /api/otp/verify
 */
const verifyPaymentOTP = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ error: "OTP is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.email) {
            return res.status(400).json({ error: "User email not found" });
        }
        const result = (0, otpService_1.verifyOTP)(user.email, otp);
        if (!result.valid) {
            return res.status(400).json({ error: result.error || "Invalid OTP" });
        }
        res.json({ message: "OTP verified successfully", verified: true });
    }
    catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.verifyPaymentOTP = verifyPaymentOTP;
/**
 * Send OTP for email verification (public, for registration)
 * POST /api/otp/send-verification
 */
const sendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        // Check if user already exists
        const existingUser = await UserModel_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const result = await (0, otpService_1.sendOTP)(email, {
            subject: "1C Traders - Email Verification OTP",
            title: "1C Traders - Email Verification",
            purpose: "email verification",
        });
        if (!result.success) {
            return res.status(500).json({ error: result.error || "Failed to send OTP" });
        }
        // In development, return OTP for testing. In production, don't return it
        res.json({
            message: "OTP sent to your email",
            ...(process.env.NODE_ENV === "development" && { otp: result.otp }), // Only in dev
        });
    }
    catch (error) {
        console.error("Send verification OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendVerificationOTP = sendVerificationOTP;
/**
 * Verify OTP for email verification (public, for registration)
 * POST /api/otp/verify-verification
 */
const verifyVerificationOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!otp) {
            return res.status(400).json({ error: "OTP is required" });
        }
        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const result = (0, otpService_1.verifyOTP)(email, otp);
        if (!result.valid) {
            return res.status(400).json({ error: result.error || "Invalid OTP" });
        }
        res.json({ message: "OTP verified successfully", verified: true });
    }
    catch (error) {
        console.error("Verify verification OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.verifyVerificationOTP = verifyVerificationOTP;
/**
 * Send OTP for login (public, optional 2FA)
 * POST /api/otp/send-login
 */
const sendLoginOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        // Check if user exists
        const user = await UserModel_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const result = await (0, otpService_1.sendOTP)(email, {
            subject: "1C Traders - Login Verification OTP",
            title: "1C Traders - Login Verification",
            purpose: "login verification",
        });
        if (!result.success) {
            return res.status(500).json({ error: result.error || "Failed to send OTP" });
        }
        // In development, return OTP for testing. In production, don't return it
        res.json({
            message: "OTP sent to your email",
            ...(process.env.NODE_ENV === "development" && { otp: result.otp }), // Only in dev
        });
    }
    catch (error) {
        console.error("Send login OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendLoginOTP = sendLoginOTP;
/**
 * Verify OTP for login (public, optional 2FA)
 * POST /api/otp/verify-login
 */
const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!otp) {
            return res.status(400).json({ error: "OTP is required" });
        }
        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const result = (0, otpService_1.verifyOTP)(email, otp);
        if (!result.valid) {
            return res.status(400).json({ error: result.error || "Invalid OTP" });
        }
        res.json({ message: "OTP verified successfully", verified: true });
    }
    catch (error) {
        console.error("Verify login OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.verifyLoginOTP = verifyLoginOTP;
//# sourceMappingURL=otpController.js.map