"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralCommissionModel = exports.ReferralModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReferralSchema = new mongoose_1.Schema({
    referrerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    referredUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
const ReferralCommissionSchema = new mongoose_1.Schema({
    referralId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Referral",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    investmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Investment",
        required: true,
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Indexes
ReferralSchema.index({ referrerId: 1 });
ReferralSchema.index({ referredUserId: 1 });
ReferralSchema.index({ level: 1 });
ReferralCommissionSchema.index({ referralId: 1 });
ReferralCommissionSchema.index({ investmentId: 1 });
exports.ReferralModel = mongoose_1.default.model("Referral", ReferralSchema);
exports.ReferralCommissionModel = mongoose_1.default.model("ReferralCommission", ReferralCommissionSchema);
//# sourceMappingURL=ReferralModel.js.map