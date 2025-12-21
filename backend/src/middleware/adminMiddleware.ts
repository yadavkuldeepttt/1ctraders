import type { Request, Response, NextFunction } from "express"
import { UserModel } from "../db/models/UserModel"
import mongoose from "mongoose"

type MiddlewareResponse = Response | void

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<MiddlewareResponse> => {
  try {
    const userId = (req as any).userId

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid user ID" })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." })
    }

    // Attach admin user to request
    ;(req as any).adminUser = user

    next()
  } catch (error) {
    console.error("Admin middleware error:", error)
    return res.status(403).json({ error: "Access denied" })
  }
}
