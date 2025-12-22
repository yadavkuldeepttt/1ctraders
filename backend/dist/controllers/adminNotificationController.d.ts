import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Send notification to a specific user
 * POST /api/admin/notifications/send
 */
export declare const sendNotification: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Send notification to all users (broadcast)
 * POST /api/admin/notifications/broadcast
 */
export declare const broadcastNotification: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Send notification to multiple specific users
 * POST /api/admin/notifications/send-multiple
 */
export declare const sendMultipleNotifications: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=adminNotificationController.d.ts.map