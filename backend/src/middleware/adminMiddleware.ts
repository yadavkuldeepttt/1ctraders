import type { Request, Response, NextFunction } from "express"

// In-memory admin users list (replace with database check)
const adminUsers = ["admin@irma.com"]

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userEmail = (req as any).userEmail

    if (!adminUsers.includes(userEmail)) {
      return res.status(403).json({ error: "Access denied. Admin privileges required." })
    }

    next()
  } catch (error) {
    return res.status(403).json({ error: "Access denied" })
  }
}
