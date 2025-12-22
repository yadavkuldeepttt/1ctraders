import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Get dummy trades
 * GET /api/dummy/trades
 */
export declare const getDummyTrades: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get dummy stocks
 * GET /api/dummy/stocks
 */
export declare const getDummyStocks: (_req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get dummy gaming tokens
 * GET /api/dummy/gaming-tokens
 */
export declare const getDummyGamingTokens: (_req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get dummy crude oil investments
 * GET /api/dummy/crude-oil
 */
export declare const getDummyCrudeOil: (_req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get all dummy data
 * GET /api/dummy/all
 */
export declare const getAllDummy: (_req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=dummyDataController.d.ts.map