import type { Request, Response } from "express"
import {
  generateDummyTrades,
  generateDummyStocks,
  generateDummyGamingTokens,
  generateDummyCrudeOilInvestments,
  getAllDummyData,
} from "../services/dummyDataService"

type ControllerResponse = Response | void

/**
 * Get dummy trades
 * GET /api/dummy/trades
 */
export const getDummyTrades = async (req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const { limit = 20 } = req.query
    const trades = generateDummyTrades(Number(limit))
    res.json({ trades })
  } catch (error) {
    console.error("Get dummy trades error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get dummy stocks
 * GET /api/dummy/stocks
 */
export const getDummyStocks = async (_req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const stocks = generateDummyStocks()
    res.json({ stocks })
  } catch (error) {
    console.error("Get dummy stocks error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get dummy gaming tokens
 * GET /api/dummy/gaming-tokens
 */
export const getDummyGamingTokens = async (_req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const tokens = generateDummyGamingTokens()
    res.json({ tokens })
  } catch (error) {
    console.error("Get dummy gaming tokens error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get dummy crude oil investments
 * GET /api/dummy/crude-oil
 */
export const getDummyCrudeOil = async (_req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const investments = generateDummyCrudeOilInvestments()
    res.json({ investments })
  } catch (error) {
    console.error("Get dummy crude oil error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Get all dummy data
 * GET /api/dummy/all
 */
export const getAllDummy = async (_req: Request, res: Response): Promise<ControllerResponse> => {
  try {
    const data = getAllDummyData()
    res.json(data)
  } catch (error) {
    console.error("Get all dummy data error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

