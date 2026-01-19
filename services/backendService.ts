
import { Order, UserState, Coin, PortfolioAsset } from '../types';
import { INITIAL_COINS, INITIAL_PORTFOLIO } from '../constants';

const STORAGE_KEY = 'nexus_exchange_state';
const COINS_KEY = 'nexus_coins_state';

class BackendService {
  private userState: UserState;
  private coins: Coin[];

  constructor() {
    const savedState = localStorage.getItem(STORAGE_KEY);
    this.userState = savedState ? JSON.parse(savedState) : {
      balanceUsdt: 12450.00,
      portfolio: INITIAL_PORTFOLIO,
      orders: []
    };

    const savedCoins = localStorage.getItem(COINS_KEY);
    this.coins = savedCoins ? JSON.parse(savedCoins) : INITIAL_COINS;
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.userState));
    localStorage.setItem(COINS_KEY, JSON.stringify(this.coins));
  }

  // --- Coin Management ---
  getCoins(): Coin[] {
    return this.coins;
  }

  updateCoinPrice(id: string, newPrice: number) {
    const coin = this.coins.find(c => c.id === id);
    if (coin) {
      const oldPrice = coin.price;
      coin.price = newPrice;
      coin.change24h = parseFloat(((newPrice - oldPrice) / oldPrice * 100).toFixed(2));
      this.save();
    }
  }

  addCoin(coin: Coin) {
    this.coins.push(coin);
    this.save();
  }

  // --- User & Trade Management ---
  getUserState(): UserState {
    return this.userState;
  }

  executeTrade(type: 'buy' | 'sell', symbol: string, amount: number, price: number): boolean {
    const total = amount * price;

    if (type === 'buy') {
      if (this.userState.balanceUsdt < total) return false;
      this.userState.balanceUsdt -= total;
      this.updatePortfolio(symbol, amount, true);
    } else {
      const asset = this.userState.portfolio.find(p => p.symbol === symbol);
      if (!asset || asset.balance < amount) return false;
      this.userState.balanceUsdt += total;
      this.updatePortfolio(symbol, amount, false);
    }

    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      price,
      amount,
      total,
      type,
      symbol,
      timestamp: Date.now()
    };

    this.userState.orders.unshift(order);
    this.save();
    return true;
  }

  private updatePortfolio(symbol: string, amount: number, isAdding: boolean) {
    let asset = this.userState.portfolio.find(p => p.symbol === symbol);
    if (!asset) {
      asset = { symbol, name: symbol, balance: 0, valueUsd: 0 };
      this.userState.portfolio.push(asset);
    }
    
    if (isAdding) asset.balance += amount;
    else asset.balance -= amount;
    
    this.save();
  }

  getGlobalStats() {
    return {
      totalVolume: this.userState.orders.reduce((sum, o) => sum + o.total, 0),
      orderCount: this.userState.orders.length,
      userCount: 1, // Simulated
      systemLiquidity: this.userState.balanceUsdt + this.userState.portfolio.reduce((sum, p) => sum + p.valueUsd, 0)
    };
  }
}

export const backendService = new BackendService();
