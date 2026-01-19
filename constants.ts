
import { Coin, PortfolioAsset } from './types';

export const INITIAL_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 64230.45, change24h: 1.25, volume24h: 35000000000, marketCap: 1200000000000, sparkline: [62000, 62500, 63000, 62800, 63500, 64230] },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3450.12, change24h: -0.45, volume24h: 18000000000, marketCap: 400000000000, sparkline: [3500, 3480, 3460, 3490, 3470, 3450] },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.67, change24h: 4.82, volume24h: 4000000000, marketCap: 65000000000, sparkline: [130, 135, 138, 142, 144, 145] },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 580.32, change24h: 0.15, volume24h: 1200000000, marketCap: 88000000000, sparkline: [570, 575, 582, 579, 581, 580] },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.62, change24h: 2.10, volume24h: 1100000000, marketCap: 34000000000, sparkline: [0.58, 0.59, 0.61, 0.60, 0.62, 0.62] },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.165, change24h: 8.45, volume24h: 2100000000, marketCap: 23000000000, sparkline: [0.14, 0.15, 0.145, 0.155, 0.16, 0.165] },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.452, change24h: -1.2, volume24h: 450000000, marketCap: 16000000000, sparkline: [0.46, 0.458, 0.455, 0.453, 0.452, 0.452] },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.24, change24h: 1.05, volume24h: 210000000, marketCap: 10000000000, sparkline: [7.10, 7.15, 7.20, 7.18, 7.22, 7.24] },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', price: 0.72, change24h: -0.30, volume24h: 320000000, marketCap: 7000000000, sparkline: [0.73, 0.725, 0.72, 0.73, 0.72, 0.72] },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', price: 35.80, change24h: -2.15, volume24h: 480000000, marketCap: 13000000000, sparkline: [37.0, 36.5, 36.0, 36.2, 35.8, 35.8] },
];

export const INITIAL_PORTFOLIO: PortfolioAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.245, valueUsd: 15736.46 },
  { symbol: 'ETH', name: 'Ethereum', balance: 4.5, valueUsd: 15525.54 },
  { symbol: 'SOL', name: 'Solana', balance: 50, valueUsd: 7283.50 },
  { symbol: 'USDT', name: 'Tether', balance: 2500, valueUsd: 2500.00 },
];
