import mongoose, { Document } from "mongoose";
import type { Transaction } from "../../models/Transaction";
export interface TransactionDocument extends Omit<Transaction, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const TransactionModel: mongoose.Model<TransactionDocument, {}, {}, {}, mongoose.Document<unknown, {}, TransactionDocument, {}, {}> & TransactionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TransactionModel.d.ts.map