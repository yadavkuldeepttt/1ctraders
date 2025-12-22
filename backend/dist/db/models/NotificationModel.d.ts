import mongoose, { Document } from "mongoose";
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error" | "task" | "investment" | "system";
    isRead: boolean;
    relatedId?: string;
    relatedType?: "task" | "investment" | "transaction" | "referral";
    createdAt: Date;
    updatedAt: Date;
}
export interface NotificationDocument extends Omit<Notification, "id">, Document {
}
export declare const NotificationModel: mongoose.Model<NotificationDocument, {}, {}, {}, mongoose.Document<unknown, {}, NotificationDocument, {}, {}> & NotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=NotificationModel.d.ts.map