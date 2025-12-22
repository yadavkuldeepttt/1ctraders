"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dummyDataController_1 = require("../controllers/dummyDataController");
const router = (0, express_1.Router)();
// Dummy data routes (public, no authentication required)
router.get("/trades", dummyDataController_1.getDummyTrades);
router.get("/stocks", dummyDataController_1.getDummyStocks);
router.get("/gaming-tokens", dummyDataController_1.getDummyGamingTokens);
router.get("/crude-oil", dummyDataController_1.getDummyCrudeOil);
router.get("/all", dummyDataController_1.getAllDummy);
exports.default = router;
//# sourceMappingURL=dummyDataRoutes.js.map