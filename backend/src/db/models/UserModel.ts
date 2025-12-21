import mongoose, { Schema, Document } from "mongoose"
import type { User } from "../../models/User"

export interface UserDocument extends Omit<User, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    referredBy: {
      type: String,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
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
        delete ret.password
        return ret
      },
    },
  }
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })
UserSchema.index({ referralCode: 1 })

export const UserModel = mongoose.model<UserDocument>("User", UserSchema)

