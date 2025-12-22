/**
 * Dummy Data Service
 * Provides dummy data for trades, stocks, gaming tokens, and crude oil investments
 */
export interface DummyTrade {
    id: string;
    symbol: string;
    type: "buy" | "sell";
    amount: number;
    price: number;
    timestamp: Date;
    profit?: number;
}
export interface DummyStock {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
}
export interface DummyGamingToken {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    game: string;
}
export interface DummyCrudeOilInvestment {
    id: string;
    location: string;
    barrelPrice: number;
    quantity: number;
    totalValue: number;
    roi: number;
    status: "active" | "completed";
    startDate: Date;
    endDate?: Date;
}
export declare const generateDummyTrades: (count?: number) => DummyTrade[];
export declare const generateDummyStocks: () => DummyStock[];
export declare const generateDummyGamingTokens: () => DummyGamingToken[];
export declare const generateDummyCrudeOilInvestments: () => DummyCrudeOilInvestment[];
export declare const getAllDummyData: () => {
    trades: DummyTrade[];
    stocks: DummyStock[];
    gamingTokens: DummyGamingToken[];
    crudeOilInvestments: DummyCrudeOilInvestment[];
};
//# sourceMappingURL=dummyDataService.d.ts.map