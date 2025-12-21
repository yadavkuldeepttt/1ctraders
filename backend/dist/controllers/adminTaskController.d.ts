import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Get all tasks (admin)
 * GET /api/admin/tasks
 */
export declare const getAllTasks: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get single task (admin)
 * GET /api/admin/tasks/:taskId
 */
export declare const getTask: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Create task (admin)
 * POST /api/admin/tasks
 */
export declare const createTask: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Update task (admin)
 * PATCH /api/admin/tasks/:taskId
 */
export declare const updateTask: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Delete task (admin)
 * DELETE /api/admin/tasks/:taskId
 */
export declare const deleteTask: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=adminTaskController.d.ts.map