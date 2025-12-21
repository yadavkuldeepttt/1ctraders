import type { Request, Response } from "express";
type ControllerResponse = Response | void;
export declare const getReferralStats: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getUserReferrals: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getReferralTree: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=referralController.d.ts.map