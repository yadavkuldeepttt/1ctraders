"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const investmentRoutes_1 = __importDefault(require("./routes/investmentRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const referralRoutes_1 = __importDefault(require("./routes/referralRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const adminAuthRoutes_1 = __importDefault(require("./routes/adminAuthRoutes"));
const otpRoutes_1 = __importDefault(require("./routes/otpRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const dummyDataRoutes_1 = __importDefault(require("./routes/dummyDataRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const connection_1 = __importDefault(require("./db/connection"));
const scheduler_1 = require("./services/scheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
// CORS configuration - allow all origins for API access
app.use((0, cors_1.default)({
    origin: "*", // Allow all origins (you can restrict this in production)
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use((0, morgan_1.default)("dev"));
// Raw body parser for NOWPayments webhook (must be before json parser)
app.use("/api/payments/nowpayments/ipn", express_1.default.raw({ type: "application/json" }));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/investments", investmentRoutes_1.default);
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/referrals", referralRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.use("/api/otp", otpRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/public", publicRoutes_1.default);
app.use("/api/dummy", dummyDataRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
// CRITICAL: Admin auth routes MUST be registered BEFORE admin routes
// This ensures /api/admin/auth/* routes are matched before /api/admin/* routes
// Admin auth routes are PUBLIC (no authentication required)
app.use("/api/admin/auth", adminAuthRoutes_1.default);
// Protected admin routes (require authentication via middleware)
app.use("/api/admin", adminRoutes_1.default);
// Error handling
app.use(errorMiddleware_1.notFoundHandler);
app.use(errorMiddleware_1.errorHandler);
// Connect to database and start server
async function startServer() {
    try {
        // Connect to MongoDB
        await (0, connection_1.default)();
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 1C Traders Backend API running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        });
        // Start daily ROI scheduler
        (0, scheduler_1.startScheduler)();
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map