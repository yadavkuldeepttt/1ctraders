import type { Request, Response } from "express";
type ControllerResponse = Response | void;
export declare const createDeposit: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const createWithdrawal: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getUserTransactions: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getTransactionById: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=transactionController.d.ts.map