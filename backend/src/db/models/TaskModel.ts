import mongoose, { Schema, Document } from "mongoose"
import type { Task, UserTask } from "../../models/Task"

export interface TaskDocument extends Omit<Task, "id">, Document {
  _id: mongoose.Types.ObjectId
}

export interface UserTaskDocument extends Omit<UserTask, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const TaskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["social", "referral", "daily", "special"],
      required: true,
    },
    reward: {
      type: Number,
      required: true,
      min: 0,
    },
    requirements: {
      type: Schema.Types.Mixed,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
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

const UserTaskSchema = new Schema<UserTaskDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "completed", "pending", "expired"],
      default: "available",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
    },
    rewardClaimed: {
      type: Boolean,
      default: false,
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
TaskSchema.index({ isActive: 1 })
TaskSchema.index({ type: 1 })
UserTaskSchema.index({ userId: 1, taskId: 1 }, { unique: true })
UserTaskSchema.index({ userId: 1 })
UserTaskSchema.index({ status: 1 })

export const TaskModel = mongoose.model<TaskDocument>("Task", TaskSchema)
export const UserTaskModel = mongoose.model<UserTaskDocument>("UserTask", UserTaskSchema)

