"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_REFERRAL_COMMISSION_PERCENTAGE = exports.REFERRAL_LEVELS = void 0;
// Updated referral system: 8% direct, 1% levels 2-12, capped at 20% total
exports.REFERRAL_LEVELS = [
    { level: 1, percentage: 8 }, // Direct referral: 8%
    { level: 2, percentage: 1 }, // Level 2: 1%
    { level: 3, percentage: 1 }, // Level 3: 1%
    { level: 4, percentage: 1 }, // Level 4: 1%
    { level: 5, percentage: 1 }, // Level 5: 1%
    { level: 6, percentage: 1 }, // Level 6: 1%
    { level: 7, percentage: 1 }, // Level 7: 1%
    { level: 8, percentage: 1 }, // Level 8: 1%
    { level: 9, percentage: 1 }, // Level 9: 1%
    { level: 10, percentage: 1 }, // Level 10: 1%
    { level: 11, percentage: 1 }, // Level 11: 1%
    { level: 12, percentage: 1 }, // Level 12: 1%
];
exports.MAX_REFERRAL_COMMISSION_PERCENTAGE = 20; // Total commission capped at 20%
//# sourceMappingURL=Referral.js.map