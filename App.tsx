
import React, { useState, useEffect, useMemo } from 'react';
import { backendService } from './services/backendService';
import { Coin, View, Order, UserState } from './types';
import TradingChart from './components/TradingChart';
import OrderBook from './components/OrderBook';
import TradePanel from './components/TradePanel';
import MarketAnalysis from './components/MarketAnalysis';
import AdminPanel from './components/AdminPanel';

// Mock live chart data generator
const generateChartData = (basePrice: number) => {
  return Array.from({ length: 40 }).map((_, i) => ({
    time: `${i}:00`,
    price: basePrice + Math.random() * 500 - 250
  }));
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('trade');
  const [coins, setCoins] = useState<Coin[]>(backendService.getCoins());
  const [userState, setUserState] = useState<UserState>(backendService.getUserState());
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);
  const [chartData, setChartData] = useState(generateChartData(coins[0].price));

  // Sync state from backend
  const refreshData = () => {
    setCoins([...backendService.getCoins()]);
    setUserState({...backendService.getUserState()});
  };

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random variations
      coins.forEach(c => {
        const variation = (Math.random() - 0.5) * (c.price * 0.0005);
        backendService.updateCoinPrice(c.id, c.price + variation);
      });
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, [coins]);

  // Update selected coin if the list changes
  useEffect(() => {
    const updated = coins.find(c => c.id === selectedCoin.id);
    if (updated) setSelectedCoin(updated);
  }, [coins]);

  // Sync selected coin price updates for charts
  const currentCoinPrice = useMemo(() => {
    return selectedCoin.price;
  }, [selectedCoin]);

  // Mock Order Book Data
  const orderBookData = useMemo(() => {
    const generateOrders = (base: number, type: 'buy' | 'sell') => {
      return Array.from({ length: 12 }).map((_, i) => {
        const offset = (i + 1) * 2;
        const price = type === 'buy' ? base - offset : base + offset;
        const amount = Math.random() * 0.5;
        return { price, amount, total: price * amount, type } as Order;
      });
    };
    return {
      asks: generateOrders(currentCoinPrice, 'sell'),
      bids: generateOrders(currentCoinPrice, 'buy')
    };
  }, [currentCoinPrice]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navigation */}
      <header className="h-16 border-b border-[#2b3139] flex items-center justify-between px-6 bg-[#0b0e11] shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('trade')}>
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-cube text-black font-bold"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-yellow-500">NEXUS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {['Markets', 'Trade', 'Insights', 'Wallet'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveView(tab.toLowerCase() as View)}
                className={`text-sm font-medium transition-colors ${activeView === tab.toLowerCase() ? 'text-yellow-500' : 'text-slate-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
            <button 
              onClick={() => setActiveView('admin')}
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${activeView === 'admin' ? 'text-red-400' : 'text-slate-500 hover:text-red-300'}`}
            >
              <i className="fa-solid fa-user-shield text-[10px]"></i>
              Admin
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Balance</span>
            <span className="text-sm font-bold text-white">${userState.balanceUsdt.toLocaleString()} USDT</span>
          </div>
          <button className="px-4 py-1.5 bg-[#2b3139] hover:bg-slate-700 rounded text-sm font-medium transition-colors">
            Log In
          </button>
          <button className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-sm font-bold transition-colors">
            Register
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex bg-[#0b0e11]">
        {activeView === 'admin' ? (
          <AdminPanel />
        ) : (
          <>
            {/* Left Ticker Sidebar */}
            <aside className="w-72 border-r border-[#2b3139] flex flex-col shrink-0 bg-[#0b0e11]">
              <div className="p-4 border-b border-[#2b3139]">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                  <input 
                    type="text" 
                    placeholder="Search coins..." 
                    className="w-full bg-[#1e2329] rounded py-2 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {coins.map(coin => (
                  <div 
                    key={coin.id}
                    onClick={() => {
                      setSelectedCoin(coin);
                      setChartData(generateChartData(coin.price));
                    }}
                    className={`flex items-center justify-between p-4 cursor-pointer border-b border-[#2b3139]/30 hover:bg-[#1e2329] transition-colors ${selectedCoin.id === coin.id ? 'bg-[#1e2329]' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{coin.symbol}/USDT</span>
                      <span className="text-[10px] text-slate-500">{coin.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      </span>
                      <span className={`text-[10px] ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Main Workspace */}
            <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
              <div className="grid grid-cols-12 gap-4">
                
                {/* Main Trading View */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
                  {/* Token Stats Bar */}
                  <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg p-4 flex items-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <i className={`fa-brands fa-${selectedCoin.symbol.toLowerCase() === 'btc' ? 'bitcoin' : 'ethereum'} text-yellow-500`}></i>
                      </div>
                      <div>
                        <h2 className="text-sm font-bold">{selectedCoin.symbol}/USDT</h2>
                        <p className="text-[10px] text-slate-500">{selectedCoin.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">Price</span>
                      <span className="text-sm font-bold text-green-400">{currentCoinPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">24h Change</span>
                      <span className={`text-sm font-bold ${selectedCoin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedCoin.change24h}%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">24h Volume</span>
                      <span className="text-sm font-bold">${(selectedCoin.volume24h / 1e9).toFixed(2)}B</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">Market Cap</span>
                      <span className="text-sm font-bold">${(selectedCoin.marketCap / 1e9).toFixed(1)}B</span>
                    </div>
                  </div>

                  {/* Chart & AI Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <TradingChart data={chartData} symbol={selectedCoin.symbol} />
                    </div>
                    <div className="md:col-span-1">
                      <MarketAnalysis selectedCoin={selectedCoin} />
                    </div>
                  </div>

                  {/* Order Book & Trade Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-[400px]">
                      <OrderBook 
                        asks={orderBookData.asks} 
                        bids={orderBookData.bids} 
                        currentPrice={currentCoinPrice} 
                      />
                    </div>
                    <div className="h-[400px]">
                      <TradePanel 
                        symbol={selectedCoin.symbol} 
                        price={currentCoinPrice} 
                        onTradeSuccess={refreshData}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side - Assets */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                  <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg p-5 flex flex-col gap-4">
                    <h3 className="text-sm font-bold border-b border-[#2b3139] pb-3">My Assets</h3>
                    <div className="space-y-4">
                      {userState.portfolio.filter(p => p.balance > 0).map(asset => (
                        <div key={asset.symbol} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                              {asset.symbol[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{asset.symbol}</span>
                              <span className="text-[10px] text-slate-500">{asset.balance.toFixed(4)}</span>
                            </div>
                          </div>
                          <span className="text-xs font-medium">${(asset.balance * (coins.find(c => c.symbol === asset.symbol)?.price || 1)).toLocaleString()}</span>
                        </div>
                      ))}
                      {userState.portfolio.filter(p => p.balance > 0).length === 0 && (
                        <p className="text-center text-[10px] text-slate-500 py-4">No assets found</p>
                      )}
                    </div>
                    <button className="w-full py-2 bg-[#2b3139] rounded text-xs font-bold hover:bg-slate-700 mt-2">
                      Deposit Funds
                    </button>
                  </div>

                  <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg p-5 flex flex-col gap-4 flex-1">
                    <h3 className="text-sm font-bold border-b border-[#2b3139] pb-3">Recent Trades</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[300px]">
                      {userState.orders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center text-[11px]">
                          <span className={order.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                            {order.price.toLocaleString()}
                          </span>
                          <span className="text-slate-300">{order.amount.toFixed(4)} {order.symbol}</span>
                          <span className="text-slate-500">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-[#2b3139] bg-[#0b0e11] shrink-0 flex items-center justify-between px-6 text-[10px] text-slate-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Network Healthy
          </span>
          <span>BTC Dominance: 52.4%</span>
          <span>Session trades: {userState.orders.length}</span>
        </div>
        <div className="flex gap-4">
          <span>&copy; 2024 Nexus Exchange</span>
          <span className="hover:text-yellow-500 cursor-pointer">Support</span>
          <span className="hover:text-yellow-500 cursor-pointer">API</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
