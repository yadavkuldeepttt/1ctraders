import type { Request, Response } from "express";
type ControllerResponse = Response | void;
export declare const register: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const login: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getProfile: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const verifyToken: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=authController.d.ts.map