import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Create crypto payment with coin selection
 * POST /api/payments/crypto
 */
export declare const createCryptoPayment: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * NowPayments IPN webhook handler
 * POST /api/payments/nowpayments/ipn
 */
export declare const handleNowPaymentsIPN: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get payment status
 * GET /api/payments/:paymentId/status
 */
export declare const getPaymentStatus: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=paymentController.d.ts.map