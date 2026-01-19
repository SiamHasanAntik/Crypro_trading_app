
import React, { useState } from 'react';
import { backendService } from '../services/backendService';

interface TradePanelProps {
  symbol: string;
  price: number;
  onTradeSuccess?: () => void;
}

const TradePanel: React.FC<TradePanelProps> = ({ symbol, price, onTradeSuccess }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const userState = backendService.getUserState();
  const total = parseFloat(amount || '0') * price;

  const handleTrade = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const success = backendService.executeTrade(activeTab, symbol, numAmount, price);
    
    if (success) {
      setStatus({ message: `Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ${numAmount} ${symbol}`, type: 'success' });
      setAmount('');
      if (onTradeSuccess) onTradeSuccess();
    } else {
      setStatus({ message: 'Insufficient funds or balance', type: 'error' });
    }

    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg p-4 flex flex-col h-full relative">
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-2 rounded font-bold transition-all ${activeTab === 'buy' ? 'bg-green-500 text-white' : 'bg-[#2b3139] text-slate-400'}`}
        >
          Buy
        </button>
        <button 
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-2 rounded font-bold transition-all ${activeTab === 'sell' ? 'bg-red-500 text-white' : 'bg-[#2b3139] text-slate-400'}`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Available</span>
          <span className="font-medium text-slate-200">
            {activeTab === 'buy' 
              ? `${userState.balanceUsdt.toLocaleString()} USDT` 
              : `${(userState.portfolio.find(p => p.symbol === symbol)?.balance || 0).toFixed(4)} ${symbol}`
            }
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400">Price</label>
          <div className="flex items-center bg-[#2b3139] rounded px-3 py-2 border border-transparent focus-within:border-yellow-500">
            <input 
              type="text" 
              value={price.toFixed(2)} 
              readOnly
              className="bg-transparent w-full text-sm outline-none font-medium" 
            />
            <span className="text-xs text-slate-400 ml-2">USDT</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400">Amount</label>
          <div className="flex items-center bg-[#2b3139] rounded px-3 py-2 border border-transparent focus-within:border-yellow-500">
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent w-full text-sm outline-none font-medium" 
            />
            <span className="text-xs text-slate-400 ml-2">{symbol}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1">
          {['25%', '50%', '75%', '100%'].map(p => (
            <button key={p} className="bg-[#2b3139] py-1 text-[10px] rounded hover:bg-slate-600">{p}</button>
          ))}
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400">Total</label>
          <div className="flex items-center bg-[#2b3139] rounded px-3 py-2 opacity-70">
            <input 
              type="text" 
              value={total.toFixed(2)} 
              readOnly 
              className="bg-transparent w-full text-sm outline-none font-medium" 
            />
            <span className="text-xs text-slate-400 ml-2">USDT</span>
          </div>
        </div>

        {status && (
          <div className={`text-[10px] text-center p-2 rounded ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {status.message}
          </div>
        )}

        <button 
          onClick={handleTrade}
          className={`w-full py-3 mt-4 rounded font-bold transition-transform active:scale-95 ${activeTab === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {activeTab === 'buy' ? 'Buy' : 'Sell'} {symbol}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
