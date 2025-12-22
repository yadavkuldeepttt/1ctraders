/**
 * Dummy Data Service
 * Provides dummy data for trades, stocks, gaming tokens, and crude oil investments
 */

export interface DummyTrade {
  id: string
  symbol: string
  type: "buy" | "sell"
  amount: number
  price: number
  timestamp: Date
  profit?: number
}

export interface DummyStock {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

export interface DummyGamingToken {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  game: string
}

export interface DummyCrudeOilInvestment {
  id: string
  location: string
  barrelPrice: number
  quantity: number
  totalValue: number
  roi: number
  status: "active" | "completed"
  startDate: Date
  endDate?: Date
}

// Dummy Trades Data
export const generateDummyTrades = (count: number = 10): DummyTrade[] => {
  const symbols = ["BTC/USD", "ETH/USD", "BNB/USD", "SOL/USD", "ADA/USD", "DOT/USD", "LINK/USD", "XRP/USD"]
  const trades: DummyTrade[] = []

  for (let i = 0; i < count; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const type = Math.random() > 0.5 ? "buy" : "sell"
    const amount = Math.random() * 10 + 0.1
    const price = Math.random() * 50000 + 1000
    const profit = type === "sell" ? (Math.random() * 1000 - 500) : undefined

    trades.push({
      id: `trade-${i + 1}`,
      symbol,
      type,
      amount: Number(amount.toFixed(4)),
      price: Number(price.toFixed(2)),
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      profit: profit ? Number(profit.toFixed(2)) : undefined,
    })
  }

  return trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Dummy Stocks Data
export const generateDummyStocks = (): DummyStock[] => {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "JPM", name: "JPMorgan Chase & Co." },
    { symbol: "V", name: "Visa Inc." },
    { symbol: "WMT", name: "Walmart Inc." },
  ]

  return stocks.map((stock) => {
    const basePrice = Math.random() * 500 + 50
    const change = (Math.random() - 0.5) * 20
    const changePercent = (change / basePrice) * 100

    return {
      id: stock.symbol,
      symbol: stock.symbol,
      name: stock.name,
      price: Number(basePrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000 + 1000000),
      marketCap: Number((basePrice * (Math.random() * 1000 + 100)).toFixed(0)),
    }
  })
}

// Dummy Gaming Tokens Data
export const generateDummyGamingTokens = (): DummyGamingToken[] => {
  const tokens = [
    { name: "Axie Infinity", symbol: "AXS", game: "Axie Infinity" },
    { name: "The Sandbox", symbol: "SAND", game: "The Sandbox" },
    { name: "Decentraland", symbol: "MANA", game: "Decentraland" },
    { name: "Enjin Coin", symbol: "ENJ", game: "Enjin" },
    { name: "Gala", symbol: "GALA", game: "Gala Games" },
    { name: "Immutable X", symbol: "IMX", game: "Gods Unchained" },
    { name: "Illuvium", symbol: "ILV", game: "Illuvium" },
    { name: "Star Atlas", symbol: "ATLAS", game: "Star Atlas" },
  ]

  return tokens.map((token) => {
    const basePrice = Math.random() * 10 + 0.1
    const change24h = (Math.random() - 0.5) * 20

    return {
      id: token.symbol,
      name: token.name,
      symbol: token.symbol,
      price: Number(basePrice.toFixed(4)),
      change24h: Number(change24h.toFixed(2)),
      volume24h: Number((Math.random() * 1000000 + 100000).toFixed(0)),
      marketCap: Number((basePrice * (Math.random() * 1000000 + 100000)).toFixed(0)),
      game: token.game,
    }
  })
}

// Dummy Crude Oil Investments in Russia
export const generateDummyCrudeOilInvestments = (): DummyCrudeOilInvestment[] => {
  const locations = [
    "West Siberia Oil Field",
    "Volga-Ural Oil Field",
    "East Siberia Oil Field",
    "Sakhalin Island Oil Field",
    "Timan-Pechora Oil Field",
    "North Caucasus Oil Field",
  ]

  return locations.map((location, index) => {
    const barrelPrice = Math.random() * 20 + 60 // $60-$80 per barrel
    const quantity = Math.random() * 1000 + 100 // 100-1100 barrels
    const totalValue = barrelPrice * quantity
    const roi = Math.random() * 5 + 1.5 // 1.5-6.5% ROI
    const status = Math.random() > 0.3 ? "active" : "completed"
    const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const endDate = status === "completed" ? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined

    return {
      id: `oil-${index + 1}`,
      location,
      barrelPrice: Number(barrelPrice.toFixed(2)),
      quantity: Number(quantity.toFixed(2)),
      totalValue: Number(totalValue.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      status,
      startDate,
      endDate,
    }
  })
}

// Get all dummy data
export const getAllDummyData = () => {
  return {
    trades: generateDummyTrades(20),
    stocks: generateDummyStocks(),
    gamingTokens: generateDummyGamingTokens(),
    crudeOilInvestments: generateDummyCrudeOilInvestments(),
  }
}

