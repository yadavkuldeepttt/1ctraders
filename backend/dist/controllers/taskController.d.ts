import type { Request, Response } from "express";
type ControllerResponse = Response | void;
export declare const getAvailableTasks: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const getUserTasks: (req: Request, res: Response) => Promise<ControllerResponse>;
export declare const completeTask: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=taskController.d.ts.map