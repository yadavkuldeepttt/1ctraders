import mongoose, { Document } from "mongoose";
import type { Investment } from "../../models/Investment";
export interface InvestmentDocument extends Omit<Investment, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const InvestmentModel: mongoose.Model<InvestmentDocument, {}, {}, {}, mongoose.Document<unknown, {}, InvestmentDocument, {}, {}> & InvestmentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=InvestmentModel.d.ts.map