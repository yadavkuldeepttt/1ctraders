import type { Request, Response } from "express";
type ControllerResponse = Response | void;
/**
 * Get user notifications
 * GET /api/notifications
 */
export declare const getNotifications: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Get unread notification count
 * GET /api/notifications/unread-count
 */
export declare const getUnreadNotificationCount: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export declare const markNotificationAsRead: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
export declare const markAllNotificationsAsRead: (req: Request, res: Response) => Promise<ControllerResponse>;
/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export declare const deleteUserNotification: (req: Request, res: Response) => Promise<ControllerResponse>;
export {};
//# sourceMappingURL=notificationController.d.ts.map