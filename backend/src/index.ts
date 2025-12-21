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
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware"
import connectDB from "./db/connection"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}



startServer()

export default app
