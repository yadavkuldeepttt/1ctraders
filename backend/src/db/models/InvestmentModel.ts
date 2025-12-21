import mongoose, { Schema, Document } from "mongoose"
import type { Investment } from "../../models/Investment"

export interface InvestmentDocument extends Omit<Investment, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const InvestmentSchema = new Schema<InvestmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["oil", "shares", "crypto", "ai"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    roiPercentage: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyReturn: {
      type: Number,
      required: true,
      min: 0,
    },
    totalReturns: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRoiEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCommissionEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    lastPaidDate: {
      type: Date,
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
InvestmentSchema.index({ userId: 1 })
InvestmentSchema.index({ status: 1 })
InvestmentSchema.index({ createdAt: -1 })

export const InvestmentModel = mongoose.model<InvestmentDocument>("Investment", InvestmentSchema)

