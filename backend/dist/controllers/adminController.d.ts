import type { Request, Response } from "express";
type ControllerResponse = Response | void;
export declare const getDashboardStats: (_req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateUserStatus: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getPendingWithdrawals: (_req: Request, res: Response) => Promise<ControllerResponse>;
export declare const approveWithdrawal: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=adminController.d.ts.map