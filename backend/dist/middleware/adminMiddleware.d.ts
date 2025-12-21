import type { Request, Response, NextFunction } from "express";
type MiddlewareResponse = Response | void;
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => MiddlewareResponse;
export {};
//# sourceMappingURL=adminMiddleware.d.ts.map