import { Router } from "express"
import {
  getDummyTrades,
  getDummyStocks,
  getDummyGamingTokens,
  getDummyCrudeOil,
  getAllDummy,
} from "../controllers/dummyDataController"

const router = Router()

// Dummy data routes (public, no authentication required)
router.get("/trades", getDummyTrades)
router.get("/stocks", getDummyStocks)
router.get("/gaming-tokens", getDummyGamingTokens)
router.get("/crude-oil", getDummyCrudeOil)
router.get("/all", getAllDummy)

export default router

