import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Get active users (public endpoint)
 * GET /api/public/active-users
 */
export declare const getActiveUsers: (_req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get leaderboard (public endpoint)
 * GET /api/public/leaderboard
 */
export declare const getLeaderboard: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=publicController.d.ts.map