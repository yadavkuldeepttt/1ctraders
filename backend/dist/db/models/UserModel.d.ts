import mongoose, { Document } from "mongoose";
import type { User } from "../../models/User";
export interface UserDocument extends Omit<User, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const UserModel: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument, {}, {}> & UserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserModel.d.ts.map