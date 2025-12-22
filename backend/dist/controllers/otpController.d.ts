import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Send OTP for crypto payment
 * POST /api/otp/send
 */
export declare const sendPaymentOTP: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Verify OTP for crypto payment
 * POST /api/otp/verify
 */
export declare const verifyPaymentOTP: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Send OTP for email verification (public, for registration)
 * POST /api/otp/send-verification
 */
export declare const sendVerificationOTP: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Verify OTP for email verification (public, for registration)
 * POST /api/otp/verify-verification
 */
export declare const verifyVerificationOTP: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Send OTP for login (public, optional 2FA)
 * POST /api/otp/send-login
 */
export declare const sendLoginOTP: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Verify OTP for login (public, optional 2FA)
 * POST /api/otp/verify-login
 */
export declare const verifyLoginOTP: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=otpController.d.ts.map