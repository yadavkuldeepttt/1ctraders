import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

type MiddlewareResponse = Response | void

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export const authMiddleware = (req: Request, res: Response, next: NextFunction): MiddlewareResponse => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

    // Attach user info to request
    ;(req as any).userId = decoded.userId
    ;(req as any).userEmail = decoded.email

    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
