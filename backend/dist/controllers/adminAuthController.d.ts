import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Admin Login
 * POST /api/admin/auth/login
 */
export declare const adminLogin: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Create Admin (for manual creation via Postman)
 * POST /api/admin/auth/create
 * Note: In production, this should be protected or removed
 */
export declare const createAdmin: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get Admin Profile
 * GET /api/admin/auth/profile
 */
export declare const getAdminProfile: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=adminAuthController.d.ts.map