import type { Request, Response } from "express";
type ControllerResponse = Response | void;
export declare const register: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const login: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getProfile: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const verifyToken: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const updateProfile: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const changePassword: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const updateTwoFactor: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Request password reset - sends reset email
 */
export declare const forgotPassword: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Verify reset token
 */
export declare const verifyResetToken: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Reset password using reset token
 */
export declare const resetPassword: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=authController.d.ts.map