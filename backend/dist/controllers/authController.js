"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = require("../db/models/UserModel");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const register = async (req, res) => {
    try {
        const { username, email, password, phone, referralCode } = req.body;
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }
        // Check if user exists
        const existingUser = await UserModel_1.UserModel.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Generate unique referral code
        const userReferralCode = `1CT-${username.toUpperCase()}-${Date.now().toString().slice(-4)}`;
        // Create user
        const newUser = await UserModel_1.UserModel.create({
            username,
            email,
            password: hashedPassword,
            phone,
            referralCode: userReferralCode,
            referredBy: referralCode,
            balance: 0,
            totalInvested: 0,
            totalEarnings: 0,
            totalWithdrawn: 0,
            status: "active",
            emailVerified: false,
            twoFactorEnabled: false,
        });
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id.toString(), email: newUser.email }, JWT_SECRET, { expiresIn: "7d" });
        // Convert to JSON to get transformed document
        const userWithoutPassword = newUser.toJSON();
        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        // Find user
        const user = await UserModel_1.UserModel.findOne({
            $or: [{ username }, { email: username }],
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        // Convert to JSON to get transformed document
        const userWithoutPassword = user.toJSON();
        res.json({
            message: "Login successful",
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userWithoutPassword = user.toJSON();
        res.json(userWithoutPassword);
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProfile = getProfile;
const verifyToken = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ valid: false, error: "Invalid user ID" });
        }
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(401).json({ valid: false, error: "User not found" });
        }
        const userWithoutPassword = user.toJSON();
        res.json({ valid: true, user: userWithoutPassword });
    }
    catch (error) {
        console.error("Verify token error:", error);
        res.status(401).json({ valid: false, error: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authController.js.map