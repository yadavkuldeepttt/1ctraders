import mongoose, { Schema, Document } from "mongoose"
import type { Transaction } from "../../models/Transaction"

export interface TransactionDocument extends Omit<Transaction, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const TransactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    } as any,
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "roi", "referral", "task"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    description: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      trim: true,
    },
    withdrawalAddress: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        ret.id = (ret._id as mongoose.Types.ObjectId).toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

// Indexes
TransactionSchema.index({ userId: 1 })
TransactionSchema.index({ type: 1 })
TransactionSchema.index({ status: 1 })
TransactionSchema.index({ createdAt: -1 })

export const TransactionModel = mongoose.model<TransactionDocument>("Transaction", TransactionSchema)

