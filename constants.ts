
import { Coin, PortfolioAsset } from './types';

export const INITIAL_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 64230.45, change24h: 1.25, volume24h: 35000000000, marketCap: 1200000000000, sparkline: [62000, 62500, 63000, 62800, 63500, 64230] },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3450.12, change24h: -0.45, volume24h: 18000000000, marketCap: 400000000000, sparkline: [3500, 3480, 3460, 3490, 3470, 3450] },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.67, change24h: 4.82, volume24h: 4000000000, marketCap: 65000000000, sparkline: [130, 135, 138, 142, 144, 145] },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 580.32, change24h: 0.15, volume24h: 1200000000, marketCap: 88000000000, sparkline: [570, 575, 582, 579, 581, 580] },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.452, change24h: -1.2, volume24h: 450000000, marketCap: 16000000000, sparkline: [0.46, 0.458, 0.455, 0.453, 0.452, 0.452] },
];

export const INITIAL_PORTFOLIO: PortfolioAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.245, valueUsd: 15736.46 },
  { symbol: 'ETH', name: 'Ethereum', balance: 4.5, valueUsd: 15525.54 },
  { symbol: 'SOL', name: 'Solana', balance: 50, valueUsd: 7283.50 },
  { symbol: 'USDT', name: 'Tether', balance: 2500, valueUsd: 2500.00 },
];
