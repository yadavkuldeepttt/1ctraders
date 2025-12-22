import mongoose, { Schema, Document } from "mongoose"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error" | "task" | "investment" | "system"
  isRead: boolean
  relatedId?: string // ID of related entity (task, investment, etc.)
  relatedType?: "task" | "investment" | "transaction" | "referral"
  createdAt: Date
  updatedAt: Date
}

export interface NotificationDocument extends Omit<Notification, "id">, Document {}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    } as any,
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "task", "investment", "system"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedId: {
      type: String,
    },
    relatedType: {
      type: String,
      enum: ["task", "investment", "transaction", "referral"],
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

// Indexes for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1 })
NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ createdAt: -1 })

export const NotificationModel = mongoose.model<NotificationDocument>("Notification", NotificationSchema)

