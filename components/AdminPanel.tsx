
import React, { useState } from 'react';
import { backendService } from '../services/backendService';
import { Coin } from '../types';

const AdminPanel: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>(backendService.getCoins());
  const [editPrice, setEditPrice] = useState<{id: string, value: string} | null>(null);
  const stats = backendService.getGlobalStats();
  const orders = backendService.getUserState().orders;

  const handleUpdatePrice = (id: string) => {
    if (!editPrice) return;
    backendService.updateCoinPrice(id, parseFloat(editPrice.value));
    setCoins([...backendService.getCoins()]);
    setEditPrice(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-gauge-high text-yellow-500"></i>
          Admin Command Center
        </h1>
        <div className="flex gap-4">
          <div className="bg-[#161a1e] border border-[#2b3139] px-4 py-2 rounded">
            <p className="text-[10px] text-slate-500 uppercase">System Liquidity</p>
            <p className="text-sm font-bold text-green-400">${stats.systemLiquidity.toLocaleString()}</p>
          </div>
          <div className="bg-[#161a1e] border border-[#2b3139] px-4 py-2 rounded">
            <p className="text-[10px] text-slate-500 uppercase">Total Volume</p>
            <p className="text-sm font-bold text-yellow-500">${stats.totalVolume.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coin Management */}
        <div className="lg:col-span-2 bg-[#161a1e] border border-[#2b3139] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2b3139] bg-[#1e2329]">
            <h2 className="font-bold text-sm">Asset Management</h2>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 border-b border-[#2b3139]">
              <tr>
                <th className="p-4">Asset</th>
                <th className="p-4">Current Price</th>
                <th className="p-4">24h Change</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3139]">
              {coins.map(coin => (
                <tr key={coin.id} className="hover:bg-slate-800/30">
                  <td className="p-4 font-bold">{coin.symbol}/USDT</td>
                  <td className="p-4">
                    {editPrice?.id === coin.id ? (
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={editPrice.value} 
                          onChange={(e) => setEditPrice({ ...editPrice, value: e.target.value })}
                          className="bg-[#2b3139] border border-yellow-500/50 rounded px-2 py-1 w-24 outline-none"
                        />
                        <button onClick={() => handleUpdatePrice(coin.id)} className="text-green-400 hover:text-green-300">
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    ) : (
                      <span>${coin.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td className={`p-4 ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.change24h}%
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setEditPrice({id: coin.id, value: coin.price.toString()})}
                      className="text-slate-400 hover:text-yellow-500 transition-colors"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Recent Trades */}
        <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2b3139] bg-[#1e2329]">
            <h2 className="font-bold text-sm">System Trade Log</h2>
          </div>
          <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
            {orders.length === 0 ? (
              <p className="text-center text-slate-500 py-8 text-xs">No transactions recorded yet.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="p-3 bg-[#0b0e11] rounded border border-[#2b3139] flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold uppercase ${order.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                      {order.type} {order.symbol}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">${order.total.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-500">{order.amount.toFixed(4)} @ {order.price.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
