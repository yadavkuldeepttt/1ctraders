import type { Request, Response, NextFunction } from "express";
type MiddlewareResponse = Response | void;
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => MiddlewareResponse;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map