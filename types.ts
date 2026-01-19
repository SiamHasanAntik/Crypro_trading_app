
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
}

export interface Order {
  id: string;
  price: number;
  amount: number;
  total: number;
  type: 'buy' | 'sell';
  symbol: string;
  timestamp: number;
}

export type View = 'dashboard' | 'trade' | 'markets' | 'wallet' | 'ai-insights' | 'admin';

export interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
}

export interface UserState {
  balanceUsdt: number;
  portfolio: PortfolioAsset[];
  orders: Order[];
}
