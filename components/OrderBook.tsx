
import React from 'react';
import { Order } from '../types';

interface OrderBookProps {
  asks: Order[];
  bids: Order[];
  currentPrice: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ asks, bids, currentPrice }) => {
  return (
    <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg p-3 flex flex-col h-full overflow-hidden">
      <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Order Book</h4>
      <div className="grid grid-cols-3 text-[10px] text-slate-500 mb-2 font-medium">
        <span>Price(USDT)</span>
        <span className="text-right">Amount(BTC)</span>
        <span className="text-right">Total</span>
      </div>
      
      {/* Asks (Sell Orders) */}
      <div className="flex flex-col-reverse mb-4">
        {asks.map((order, i) => (
          <div key={`ask-${i}`} className="grid grid-cols-3 text-[11px] py-0.5 relative group hover:bg-red-900/10">
            <div className="absolute inset-y-0 right-0 bg-red-500/10" style={{ width: `${(order.amount / 0.5) * 100}%` }}></div>
            <span className="text-red-400 z-10">{order.price.toLocaleString()}</span>
            <span className="text-right text-slate-300 z-10">{order.amount.toFixed(4)}</span>
            <span className="text-right text-slate-300 z-10">{order.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Current Spread Price */}
      <div className="py-2 px-1 mb-4 border-y border-[#2b3139] flex items-center justify-between">
        <span className="text-lg font-bold text-green-400">{currentPrice.toLocaleString()}</span>
        <span className="text-xs text-slate-400">$64,231.02</span>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex flex-col">
        {bids.map((order, i) => (
          <div key={`bid-${i}`} className="grid grid-cols-3 text-[11px] py-0.5 relative group hover:bg-green-900/10">
            <div className="absolute inset-y-0 right-0 bg-green-500/10" style={{ width: `${(order.amount / 0.5) * 100}%` }}></div>
            <span className="text-green-400 z-10">{order.price.toLocaleString()}</span>
            <span className="text-right text-slate-300 z-10">{order.amount.toFixed(4)}</span>
            <span className="text-right text-slate-300 z-10">{order.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
