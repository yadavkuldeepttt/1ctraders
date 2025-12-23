import type { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"

dotenv.config()

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error("Error:", err)

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode).json({
    error: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  })
}

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    error: "Route not found",
  })
}
