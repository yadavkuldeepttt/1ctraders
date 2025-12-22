"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDummy = exports.getDummyCrudeOil = exports.getDummyGamingTokens = exports.getDummyStocks = exports.getDummyTrades = void 0;
const dummyDataService_1 = require("../services/dummyDataService");
/**
 * Get dummy trades
 * GET /api/dummy/trades
 */
const getDummyTrades = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const trades = (0, dummyDataService_1.generateDummyTrades)(Number(limit));
        res.json({ trades });
    }
    catch (error) {
        console.error("Get dummy trades error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getDummyTrades = getDummyTrades;
/**
 * Get dummy stocks
 * GET /api/dummy/stocks
 */
const getDummyStocks = async (_req, res) => {
    try {
        const stocks = (0, dummyDataService_1.generateDummyStocks)();
        res.json({ stocks });
    }
    catch (error) {
        console.error("Get dummy stocks error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getDummyStocks = getDummyStocks;
/**
 * Get dummy gaming tokens
 * GET /api/dummy/gaming-tokens
 */
const getDummyGamingTokens = async (_req, res) => {
    try {
        const tokens = (0, dummyDataService_1.generateDummyGamingTokens)();
        res.json({ tokens });
    }
    catch (error) {
        console.error("Get dummy gaming tokens error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getDummyGamingTokens = getDummyGamingTokens;
/**
 * Get dummy crude oil investments
 * GET /api/dummy/crude-oil
 */
const getDummyCrudeOil = async (_req, res) => {
    try {
        const investments = (0, dummyDataService_1.generateDummyCrudeOilInvestments)();
        res.json({ investments });
    }
    catch (error) {
        console.error("Get dummy crude oil error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getDummyCrudeOil = getDummyCrudeOil;
/**
 * Get all dummy data
 * GET /api/dummy/all
 */
const getAllDummy = async (_req, res) => {
    try {
        const data = (0, dummyDataService_1.getAllDummyData)();
        res.json(data);
    }
    catch (error) {
        console.error("Get all dummy data error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllDummy = getAllDummy;
//# sourceMappingURL=dummyDataController.js.map