
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from 'recharts';

interface ChartData {
  time: string;
  price: number;
}

interface TradingChartProps {
  data: ChartData[];
  symbol: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ data, symbol }) => {
  return (
    <div className="w-full h-[400px] bg-[#161a1e] rounded-lg p-4 border border-[#2b3139]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          {symbol}/USDT <span className="text-sm font-normal text-slate-400">Live Chart</span>
        </h3>
        <div className="flex gap-2">
          {['1H', '4H', '1D', '1W'].map(tf => (
            <button key={tf} className="px-3 py-1 text-xs bg-[#2b3139] hover:bg-yellow-500 hover:text-black rounded transition-colors">
              {tf}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f0b90b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f0b90b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#474d57" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#474d57" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            orientation="right"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e2329', border: 'none', borderRadius: '8px', color: '#eaecef' }}
            itemStyle={{ color: '#f0b90b' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#f0b90b" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;
