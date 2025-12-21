import mongoose, { Document } from "mongoose";
import type { Referral, ReferralCommission } from "../../models/Referral";
export interface ReferralDocument extends Omit<Referral, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
export interface ReferralCommissionDocument extends Omit<ReferralCommission, "id">, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const ReferralModel: mongoose.Model<ReferralDocument, {}, {}, {}, mongoose.Document<unknown, {}, ReferralDocument, {}, {}> & ReferralDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const ReferralCommissionModel: mongoose.Model<ReferralCommissionDocument, {}, {}, {}, mongoose.Document<unknown, {}, ReferralCommissionDocument, {}, {}> & ReferralCommissionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ReferralModel.d.ts.map