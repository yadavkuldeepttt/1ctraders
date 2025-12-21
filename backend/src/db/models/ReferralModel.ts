import mongoose, { Schema, Document } from "mongoose"
import type { Referral, ReferralCommission } from "../../models/Referral"

export interface ReferralDocument extends Omit<Referral, "id">, Document {
  _id: mongoose.Types.ObjectId
}

export interface ReferralCommissionDocument extends Omit<ReferralCommission, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const ReferralSchema = new Schema<ReferralDocument>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

const ReferralCommissionSchema = new Schema<ReferralCommissionDocument>(
  {
    referralId: {
      type: Schema.Types.ObjectId,
      ref: "Referral",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    investmentId: {
      type: Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

// Indexes
ReferralSchema.index({ referrerId: 1 })
ReferralSchema.index({ referredUserId: 1 })
ReferralSchema.index({ level: 1 })
ReferralCommissionSchema.index({ referralId: 1 })
ReferralCommissionSchema.index({ investmentId: 1 })

export const ReferralModel = mongoose.model<ReferralDocument>("Referral", ReferralSchema)
export const ReferralCommissionModel = mongoose.model<ReferralCommissionDocument>(
  "ReferralCommission",
  ReferralCommissionSchema
)

