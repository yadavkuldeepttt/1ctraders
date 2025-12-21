import mongoose, { Document } from "mongoose";
import type { Task, UserTask } from "../../models/Task";
export interface TaskDocument extends Omit<Task, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
export interface UserTaskDocument extends Omit<UserTask, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const TaskModel: mongoose.Model<TaskDocument, {}, {}, {}, mongoose.Document<unknown, {}, TaskDocument, {}, {}> & TaskDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const UserTaskModel: mongoose.Model<UserTaskDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserTaskDocument, {}, {}> & UserTaskDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TaskModel.d.ts.map