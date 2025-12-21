import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err)

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode).json({
    error: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  })
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
  })
}
