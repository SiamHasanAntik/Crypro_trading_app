
import React, { useState, useEffect, useMemo } from 'react';
import { backendService } from './services/backendService';
import { authService } from './services/authService';
import { geminiService } from './services/geminiService';
import { Coin, View, Order, UserState, User } from './types';
import TradingChart from './components/TradingChart';
import OrderBook from './components/OrderBook';
import TradePanel from './components/TradePanel';
import MarketAnalysis from './components/MarketAnalysis';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';

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
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getActiveSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // AI Insights State
  const [aiStrategy, setAiStrategy] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const refreshData = () => {
    setCoins([...backendService.getCoins()]);
    setUserState({...backendService.getUserState()});
    setCurrentUser(authService.getActiveSession());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      coins.forEach(c => {
        const variation = (Math.random() - 0.5) * (c.price * 0.0005);
        backendService.updateCoinPrice(c.id, c.price + variation);
      });
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, [coins]);

  useEffect(() => {
    const updated = coins.find(c => c.id === selectedCoin.id);
    if (updated) setSelectedCoin(updated);
  }, [coins]);

  const currentCoinPrice = useMemo(() => {
    return selectedCoin.price;
  }, [selectedCoin]);

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

  const fetchAiStrategy = async () => {
    setLoadingAi(true);
    const strategy = await geminiService.getTradingStrategy(userState.portfolio);
    setAiStrategy(strategy);
    setLoadingAi(false);
  };

  useEffect(() => {
    if (activeView === 'ai-insights' && aiStrategy.length === 0) {
      fetchAiStrategy();
    }
  }, [activeView]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveView('trade');
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // --- Rendering Helpers ---

  const renderMarkets = () => (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Market Overview</h2>
      <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1e2329] text-slate-400 text-xs uppercase font-bold border-b border-[#2b3139]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">24h Change</th>
              <th className="p-4">24h Volume</th>
              <th className="p-4">Market Cap</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b3139]">
            {coins.map(coin => (
              <tr key={coin.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                    {coin.symbol[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{coin.name}</p>
                    <p className="text-[10px] text-slate-500">{coin.symbol}</p>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium">${coin.price.toLocaleString()}</td>
                <td className={`p-4 text-sm font-bold ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                </td>
                <td className="p-4 text-sm text-slate-400">${(coin.volume24h / 1e9).toFixed(2)}B</td>
                <td className="p-4 text-sm text-slate-400">${(coin.marketCap / 1e9).toFixed(1)}B</td>
                <td className="p-4">
                  <button 
                    onClick={() => { setSelectedCoin(coin); setActiveView('trade'); }}
                    className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded hover:bg-yellow-500 hover:text-black text-xs transition-all"
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-wand-magic-sparkles text-yellow-500"></i>
            Nexus AI Insights
          </h2>
          <p className="text-slate-400 text-sm mt-1">Smart portfolio analysis powered by Gemini 3.0</p>
        </div>
        <button 
          onClick={fetchAiStrategy}
          className="px-4 py-2 bg-[#2b3139] rounded text-xs hover:bg-slate-700 flex items-center gap-2"
        >
          <i className={`fa-solid fa-arrows-rotate ${loadingAi ? 'animate-spin' : ''}`}></i>
          Generate New Strategy
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loadingAi ? (
          <div className="bg-[#161a1e] border border-[#2b3139] p-10 rounded-lg flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Analyzing your assets and market trends...</p>
          </div>
        ) : (
          aiStrategy.map((item, i) => (
            <div key={i} className="bg-[#161a1e] border border-[#2b3139] p-6 rounded-lg hover:border-yellow-500/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center shrink-0 text-yellow-500 font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-yellow-500 mb-2">{item.step}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.reasoning}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg flex gap-3 text-xs text-blue-400">
        <i className="fa-solid fa-circle-info mt-0.5"></i>
        <p>This analysis is generated by AI based on your current simulated portfolio. Use it as a secondary data point for your trading decisions.</p>
      </div>
    </div>
  );

  const renderWallet = () => {
    const totalAssetValue = userState.portfolio.reduce((sum, p) => {
      const price = coins.find(c => c.symbol === p.symbol)?.price || 0;
      return sum + (p.balance * price);
    }, 0);
    const totalBalance = totalAssetValue + userState.balanceUsdt;

    return (
      <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#161a1e] border border-[#2b3139] p-6 rounded-xl">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Total Balance</p>
            <h2 className="text-3xl font-black text-white">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded font-bold text-sm">Deposit</button>
              <button className="flex-1 bg-[#2b3139] hover:bg-slate-700 py-2 rounded font-bold text-sm">Withdraw</button>
            </div>
          </div>
          
          <div className="bg-[#161a1e] border border-[#2b3139] p-6 rounded-xl">
            <h3 className="font-bold mb-4">Asset Allocation</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">USDT (Cash)</span>
                <span className="font-bold">${userState.balanceUsdt.toLocaleString()}</span>
              </div>
              <div className="w-full bg-[#2b3139] h-2 rounded-full overflow-hidden flex">
                <div className="bg-yellow-500 h-full" style={{ width: `${(userState.balanceUsdt / totalBalance) * 100}%` }}></div>
                <div className="bg-blue-500 h-full" style={{ width: `${(totalAssetValue / totalBalance) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Cash: {((userState.balanceUsdt / totalBalance) * 100).toFixed(1)}%</span>
                <span>Crypto: {((totalAssetValue / totalBalance) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-[#161a1e] border border-[#2b3139] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2b3139] bg-[#1e2329]">
              <h3 className="font-bold text-sm">My Crypto Assets</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 text-[10px] uppercase border-b border-[#2b3139]">
                <tr>
                  <th className="p-4">Coin</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Value (USD)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b3139]">
                {userState.portfolio.filter(p => p.balance > 0).map(asset => {
                  const coin = coins.find(c => c.symbol === asset.symbol);
                  return (
                    <tr key={asset.symbol} className="hover:bg-slate-800/10">
                      <td className="p-4 font-bold">{asset.symbol}</td>
                      <td className="p-4 font-medium">{asset.balance.toFixed(4)}</td>
                      <td className="p-4 text-green-400">${(asset.balance * (coin?.price || 0)).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => { setSelectedCoin(coin || coins[0]); setActiveView('trade'); }} className="text-yellow-500 hover:underline">Trade</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-[#161a1e] border border-[#2b3139] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#2b3139] bg-[#1e2329]">
              <h3 className="font-bold text-sm">Transaction History</h3>
            </div>
            <div className="p-0">
               {userState.orders.length === 0 ? (
                 <div className="p-10 text-center text-slate-500 text-xs">No transactions recorded.</div>
               ) : (
                 <table className="w-full text-left text-xs">
                    <thead className="bg-[#0b0e11] text-slate-500 text-[9px] uppercase">
                      <tr>
                        <th className="p-3">Type</th>
                        <th className="p-3">Asset</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2b3139]">
                      {userState.orders.map(order => (
                        <tr key={order.id}>
                          <td className={`p-3 font-bold uppercase ${order.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{order.type}</td>
                          <td className="p-3 font-bold">{order.symbol}</td>
                          <td className="p-3">${order.price.toLocaleString()}</td>
                          <td className="p-3">{order.amount.toFixed(4)}</td>
                          <td className="p-3 font-medium">${order.total.toLocaleString()}</td>
                          <td className="p-3 text-slate-500">{new Date(order.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTradeView = () => (
    <>
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

      <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
            <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg p-4 flex items-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                  {selectedCoin.symbol[0]}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <TradingChart data={chartData} symbol={selectedCoin.symbol} />
              </div>
              <div className="md:col-span-1">
                <MarketAnalysis selectedCoin={selectedCoin} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[400px]">
                <OrderBook asks={orderBookData.asks} bids={orderBookData.bids} currentPrice={currentCoinPrice} />
              </div>
              <div className="h-[400px]">
                <TradePanel symbol={selectedCoin.symbol} price={currentCoinPrice} onTradeSuccess={refreshData} />
              </div>
            </div>
          </div>

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
              </div>
              <button className="w-full py-2 bg-[#2b3139] rounded text-xs font-bold hover:bg-slate-700 mt-2">Deposit Funds</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={refreshData} initialMode={authMode} />

      <header className="h-16 border-b border-[#2b3139] flex items-center justify-between px-6 bg-[#0b0e11] shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('trade')}>
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-cube text-black font-bold"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-yellow-500">NEXUS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveView('markets')} className={`text-sm font-medium transition-colors ${activeView === 'markets' ? 'text-yellow-500' : 'text-slate-400 hover:text-white'}`}>Markets</button>
            <button onClick={() => setActiveView('trade')} className={`text-sm font-medium transition-colors ${activeView === 'trade' ? 'text-yellow-500' : 'text-slate-400 hover:text-white'}`}>Trade</button>
            <button onClick={() => setActiveView('ai-insights')} className={`text-sm font-medium transition-colors ${activeView === 'ai-insights' ? 'text-yellow-500' : 'text-slate-400 hover:text-white'}`}>Insights</button>
            <button onClick={() => setActiveView('wallet')} className={`text-sm font-medium transition-colors ${activeView === 'wallet' ? 'text-yellow-500' : 'text-slate-400 hover:text-white'}`}>Wallet</button>
            <button onClick={() => setActiveView('admin')} className={`text-sm font-medium transition-colors flex items-center gap-1 ${activeView === 'admin' ? 'text-red-400' : 'text-slate-500 hover:text-red-300'}`}>
              <i className="fa-solid fa-user-shield text-[10px]"></i> Admin
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end border-r border-[#2b3139] pr-4">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Balance</span>
                <span className="text-sm font-bold text-green-400">${userState.balanceUsdt.toLocaleString()} USDT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <span className="text-yellow-500 text-xs font-bold">{currentUser.name[0]}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{currentUser.name}</span>
                  <button onClick={handleLogout} className="text-[10px] text-slate-500 hover:text-red-400 text-left">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => handleOpenAuth('login')} className="px-4 py-1.5 bg-[#2b3139] hover:bg-slate-700 rounded text-sm font-medium transition-colors">Log In</button>
              <button onClick={() => handleOpenAuth('register')} className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-sm font-bold transition-colors">Register</button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex bg-[#0b0e11]">
        {activeView === 'admin' && <AdminPanel />}
        {activeView === 'markets' && renderMarkets()}
        {activeView === 'ai-insights' && renderInsights()}
        {activeView === 'wallet' && renderWallet()}
        {activeView === 'trade' && renderTradeView()}
      </main>

      <footer className="h-8 border-t border-[#2b3139] bg-[#0b0e11] shrink-0 flex items-center justify-between px-6 text-[10px] text-slate-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Live Node Online</span>
          <span>View: {activeView.toUpperCase()}</span>
        </div>
        <div className="flex gap-4">
          <span>&copy; 2024 Nexus Exchange</span>
          <span className="hover:text-yellow-500 cursor-pointer">Security Protocol 4.2</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
