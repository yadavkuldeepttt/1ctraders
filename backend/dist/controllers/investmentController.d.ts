import type { Request, Response } from "express";
type ControllerResponse = Response | void;
export declare const getInvestmentPlans: (_req: Request, res: Response) => Promise<ControllerResponse>;
export declare const createInvestment: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getUserInvestments: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getInvestmentById: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=investmentController.d.ts.map