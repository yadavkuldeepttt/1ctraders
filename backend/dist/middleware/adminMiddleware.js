"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const UserModel_1 = require("../db/models/UserModel");
const mongoose_1 = __importDefault(require("mongoose"));
const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ error: "Invalid user ID" });
        }
        const user = await UserModel_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
        }
        // Attach admin user to request
        ;
        req.adminUser = user;
        next();
    }
    catch (error) {
        console.error("Admin middleware error:", error);
        return res.status(403).json({ error: "Access denied" });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map