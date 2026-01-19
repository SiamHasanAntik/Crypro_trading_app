
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Coin } from '../types';

interface MarketAnalysisProps {
  selectedCoin: Coin;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ selectedCoin }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    const result = await geminiService.analyzeMarket(selectedCoin.name, selectedCoin.price, selectedCoin.change24h);
    setAnalysis(result || '');
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, [selectedCoin.id]);

  return (
    <div className="bg-[#161a1e] border border-[#2b3139] rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles text-yellow-500"></i>
          AI Market Insight
        </h3>
        <button 
          onClick={fetchAnalysis}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-yellow-500 flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <i className={`fa-solid fa-arrows-rotate ${loading ? 'animate-spin' : ''}`}></i>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 py-4">
          <div className="h-4 bg-[#2b3139] rounded w-full animate-pulse"></div>
          <div className="h-4 bg-[#2b3139] rounded w-11/12 animate-pulse"></div>
          <div className="h-4 bg-[#2b3139] rounded w-4/5 animate-pulse"></div>
        </div>
      ) : (
        <div className="text-sm leading-relaxed text-slate-300">
          <p>{analysis}</p>
        </div>
      )}

      <div className="bg-yellow-500/5 border border-yellow-500/20 p-3 rounded text-[11px] text-yellow-500/80">
        <i className="fa-solid fa-circle-info mr-1"></i>
        AI analysis is for educational purposes only and not financial advice.
      </div>
    </div>
  );
};

export default MarketAnalysis;
