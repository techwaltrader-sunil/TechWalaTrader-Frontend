import React from 'react';
import { TrendingUp, Wallet, Calendar } from 'lucide-react';

const TradeLogPanel = ({ viewMode, resultFilter, totalValue, recentTrades, calculateValue, onTradeSelect }) => {
  return (
    <div className="lg:col-span-1 flex flex-col gap-4 h-[500px] lg:h-[calc(100vh-220px)] relative lg:sticky top-0 lg:top-6">
      
      {/* 1. STATS CARD */}
      <div className={`rounded-2xl p-6 text-white shadow-lg relative overflow-hidden shrink-0 ${resultFilter === "Brokerage" ? "bg-gradient-to-br from-orange-500 to-orange-600" : viewMode === "BACKTEST" ? "bg-gradient-to-br from-purple-600 to-purple-700" : "bg-gradient-to-br from-blue-600 to-blue-700"}`}>
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-white opacity-10"></div>
        <div>
          <div className="flex justify-between items-start">
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold text-white mb-2 inline-block uppercase">{viewMode} • {resultFilter === "Brokerage" ? "Charges" : "Net P&L"}</span>
            {resultFilter === "Brokerage" ? <Wallet size={24} className="text-white opacity-70" /> : <TrendingUp size={24} className="text-white opacity-70" />}
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-1">{resultFilter === "Brokerage" ? "₹" : totalValue > 0 ? "+" : ""}{totalValue.toLocaleString()}</h2>
          <p className="text-sm font-medium text-white opacity-80">{resultFilter === "Brokerage" ? "Total Brokerage & Taxes" : "Total Value (Points × Qty)"}</p>
        </div>
      </div>

      {/* 2. TRADE LIST */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2"><Calendar size={14} /> Trade Log</h3>
          <div className="grid grid-cols-3 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
            <span>Date</span><span className="text-center">Result</span><span className="text-right">{resultFilter === "Brokerage" ? "Charge" : "Value"}</span>
          </div>
        </div>
        <div className="overflow-y-auto p-2 space-y-1 flex-1 custom-scrollbar">
          {recentTrades.map((t, i) => {
            const val = calculateValue(t);
            const isWin = t.result?.includes("TARGET") || t.result === "Win" || parseFloat(t.netPnL) > 0;
            return (
              <div key={i} onClick={() => onTradeSelect(t)} className="grid grid-cols-3 text-xs p-2.5 hover:bg-blue-50 cursor-pointer rounded border-b border-slate-50 last:border-0 transition group">
                <span className="text-slate-500 font-medium group-hover:text-blue-700">{new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                <div className="flex justify-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold truncate max-w-[80px] ${isWin ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.result || (parseFloat(t.netPnL) >= 0 ? "Win" : "Loss")}</span></div>
                <span className={`text-right font-bold ${resultFilter === "Brokerage" ? "text-orange-500" : val >= 0 ? "text-green-600" : "text-red-500"}`}>{val.toFixed(2)}</span>
              </div>
            );
          })}
          {recentTrades.length === 0 && <p className="text-center text-slate-400 text-xs py-4">No trades found.</p>}
        </div>
      </div>
    </div>
  );
};

export default TradeLogPanel;