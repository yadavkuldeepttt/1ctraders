"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_COMMISSION_PERCENTAGE = exports.MAX_ROI_PERCENTAGE = exports.INVESTMENT_PLANS = void 0;
exports.INVESTMENT_PLANS = [
    {
        type: "oil",
        name: "Oil Investment",
        roiMin: 1.5, // 1.5% daily per $100
        roiMax: 2.5, // 2.5% daily per $100
        minInvest: 100,
        maxInvest: 5000,
        durationDays: 365,
    },
    {
        type: "shares",
        name: "Shares Trading",
        roiMin: 1.5, // 1.5% daily per $100
        roiMax: 2.5, // 2.5% daily per $100
        minInvest: 100,
        maxInvest: 10000,
        durationDays: 365,
    },
    {
        type: "crypto",
        name: "Crypto Trading",
        roiMin: 1.5, // 1.5% daily per $100
        roiMax: 2.5, // 2.5% daily per $100
        minInvest: 100,
        maxInvest: 25000,
        durationDays: 365,
    },
    {
        type: "ai",
        name: "AI Trading Bot",
        roiMin: 1.5, // 1.5% daily per $100
        roiMax: 2.5, // 2.5% daily per $100
        minInvest: 100,
        maxInvest: 50000,
        durationDays: 365,
    },
];
// Constants for investment limits
exports.MAX_ROI_PERCENTAGE = 300; // 300% ROI limit
exports.MAX_COMMISSION_PERCENTAGE = 400; // 400% commission limit
//# sourceMappingURL=Investment.js.map