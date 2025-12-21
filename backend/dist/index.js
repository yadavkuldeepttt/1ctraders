"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const connection_1 = __importDefault(require("./db/connection"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map