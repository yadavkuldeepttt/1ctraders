/// <reference types="node" />
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"


import authRoutes from "./routes/authRoutes"
import investmentRoutes from "./routes/investmentRoutes"
import transactionRoutes from "./routes/transactionRoutes"
import referralRoutes from "./routes/referralRoutes"
import taskRoutes from "./routes/taskRoutes"
import adminRoutes from "./routes/adminRoutes"
import adminAuthRoutes from "./routes/adminAuthRoutes"
import otpRoutes from "./routes/otpRoutes"
import paymentRoutes from "./routes/paymentRoutes"
import publicRoutes from "./routes/publicRoutes"
import dummyDataRoutes from "./routes/dummyDataRoutes"
import notificationRoutes from "./routes/notificationRoutes"
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware"
import connectDB from "./db/connection"
import { startScheduler } from "./services/scheduler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
// CORS configuration - allow all origins for API access
app.use(cors({
  origin: "*", // Allow all origins (you can restrict this in production)
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}))
app.use(morgan("dev"))

// Raw body parser for NOWPayments webhook (must be before json parser)
app.use("/api/payments/nowpayments/ipn", express.raw({ type: "application/json" }))

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/investments", investmentRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/referrals", referralRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/otp", otpRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/public", publicRoutes)
app.use("/api/dummy", dummyDataRoutes)
app.use("/api/notifications", notificationRoutes)

// CRITICAL: Admin auth routes MUST be registered BEFORE admin routes
// This ensures /api/admin/auth/* routes are matched before /api/admin/* routes
// Admin auth routes are PUBLIC (no authentication required)
app.use("/api/admin/auth", adminAuthRoutes)

// Protected admin routes (require authentication via middleware)
app.use("/api/admin", adminRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Connect to database and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB()

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 1C Traders Backend API running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/health`)
    })

    // Start daily ROI scheduler
    startScheduler()
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}



startServer()

export default app
