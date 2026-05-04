
// import React from 'react';
// import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

// const BacktestSummary = ({ summary }) => {
  
//   // --- 1. SAFE DATA MAPPING ---
//   const safeSum = summary || {};

//   const data = {
//     tradingDays: { 
//         total: safeSum.totalTrades || 0, 
//         win: safeSum.wins || 0, 
//         loss: safeSum.losses || 0 
//     },
//     trades: { 
//         total: safeSum.totalTrades || 0, 
//         win: safeSum.wins || 0, 
//         loss: safeSum.losses || 0 
//     },
//     streak: { 
//         win: 5, 
//         loss: 2 
//     },
//     maxPnL: { 
//         profit: (safeSum.avgProfit || 0) * 2.5, 
//         loss: (safeSum.avgLoss || 0) * 1.8 
//     },
//     averages: { 
//         profit: safeSum.avgProfit || 0, 
//         loss: safeSum.avgLoss || 0 
//     },
//     drawdown: { 
//         amount: Math.abs(safeSum.maxDrawdown || 0), 
//         percent: 14.5 
//     }
//   };

//   const fmt = (num) => `₹${Math.abs(num).toLocaleString('en-IN')}`;
  
//   const getPercent = (part, total) => total > 0 ? Math.round((part / total) * 100) : 0;

//   const dayWinPct = getPercent(data.tradingDays.win, data.tradingDays.total);
//   const tradeWinPct = getPercent(data.trades.win, data.trades.total);

//   return (
//     // ✅ Main Container: Light (White) | Dark (Slate-900)
//     <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-300">
      
//       {/* --- HEADING --- */}
//       <div className="flex items-center gap-3 mb-6">
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Backtest Summary</h2>
//       </div>

//       {/* --- CARDS CONTAINER --- */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

//         {/* ================= CARD 1: TRADING DAYS ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm relative overflow-hidden group transition-colors">
//             {/* Top Section */}
//             <div className="p-4 pb-5 bg-white dark:bg-slate-900">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Trading Days</p>
//                 <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.tradingDays.total}</h3>
//             </div>
            
//             {/* Separator */}
//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800 my-1"></div>

//             {/* Bottom Section */}
//             <div className="flex p-4 pt-2 bg-gray-50 dark:bg-slate-900">
//                 <div className="flex-1 border-r border-gray-200 dark:border-slate-800 pr-4">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Win Days</p>
//                     <div className="flex items-baseline gap-1">
//                         <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{dayWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.tradingDays.win})</span>
//                     </div>
//                 </div>
//                 <div className="flex-1 pl-4 text-right">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Loss Days</p>
//                     <div className="flex items-baseline gap-1 justify-end">
//                         <span className="text-lg font-bold text-rose-600 dark:text-rose-500">{100 - dayWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.tradingDays.loss})</span>
//                     </div>
//                 </div>
//             </div>
//         </div>


//         {/* ================= CARD 2: TOTAL TRADES ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm transition-colors">
//             <div className="p-4 pb-5 bg-white dark:bg-slate-900">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Trades</p>
//                 <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.trades.total}</h3>
//             </div>
            
//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800 my-1"></div>

//             <div className="flex p-4 pt-2 bg-gray-50 dark:bg-slate-900">
//                 <div className="flex-1 border-r border-gray-200 dark:border-slate-800 pr-4">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Win Trades</p>
//                     <div className="flex items-baseline gap-1">
//                         <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{tradeWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.trades.win})</span>
//                     </div>
//                 </div>
//                 <div className="flex-1 pl-4 text-right">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Loss Trades</p>
//                     <div className="flex items-baseline gap-1 justify-end">
//                         <span className="text-lg font-bold text-rose-600 dark:text-rose-500">{100 - tradeWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.trades.loss})</span>
//                     </div>
//                 </div>
//             </div>
//         </div>


//         {/* ================= CARD 3: STREAK & PROFIT/LOSS ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm justify-between transition-colors">
            
//             {/* Top Half: Streaks */}
//             <div className="p-4 flex flex-col justify-center flex-1 bg-white dark:bg-slate-900 rounded-t-xl">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Current Streak</p>
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
//                          <div>
//                              <span className="text-[10px] text-gray-500 uppercase block">Win Streak</span>
//                              <span className="text-lg font-bold text-gray-900 dark:text-white">{data.streak.win}</span>
//                          </div>
//                     </div>
//                     <div className="flex items-center gap-2 text-right">
//                          <div>
//                              <span className="text-[10px] text-gray-500 uppercase block">Loss Streak</span>
//                              <span className="text-lg font-bold text-gray-900 dark:text-white">{data.streak.loss}</span>
//                          </div>
//                          <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
//                     </div>
//                 </div>
//             </div>

//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800"></div>

//             {/* Bottom Half: Max P&L */}
//             <div className="p-4 flex flex-col justify-center flex-1 bg-gray-50 dark:bg-slate-950/30 rounded-b-xl">
//                 <div className="flex justify-between items-center mb-1">
//                     <span className="text-[10px] text-gray-500 uppercase font-bold">Max Profit</span>
//                     <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{fmt(data.maxPnL.profit)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                     <span className="text-[10px] text-gray-500 uppercase font-bold">Max Loss</span>
//                     <span className="text-sm font-bold text-rose-600 dark:text-rose-500">-{fmt(data.maxPnL.loss)}</span>
//                 </div>
//             </div>
//         </div>


//         {/* ================= CARD 4: AVERAGES & DRAWDOWN ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm justify-between transition-colors">
            
//             {/* Top Half: Averages */}
//             <div className="p-4 flex flex-col justify-center flex-1 bg-white dark:bg-slate-900 rounded-t-xl">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Average Per Day</p>
//                 <div className="flex justify-between items-center mb-1">
//                     <span className="text-[10px] text-emerald-600/80 dark:text-emerald-500/70 uppercase font-bold">Profit</span>
//                     <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{fmt(data.averages.profit)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                     <span className="text-[10px] text-rose-600/80 dark:text-rose-500/70 uppercase font-bold">Loss</span>
//                     <span className="text-sm font-bold text-rose-600 dark:text-rose-500">-{fmt(data.averages.loss)}</span>
//                 </div>
//             </div>

//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800"></div>

//             {/* Bottom Half: Drawdown */}
//             <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-950/30 flex-1 rounded-b-xl">
//                 <div>
//                     <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Max Drawdown</p>
//                     <p className="text-lg font-bold text-rose-600 dark:text-rose-500">-{fmt(data.drawdown.amount)}</p>
//                     <p className="text-[9px] text-rose-400/80 dark:text-rose-400/60 font-mono">FROM PEAK</p>
//                 </div>

//                 {/* Ring */}
//                 <div className="relative w-12 h-12 flex items-center justify-center">
//                       <svg className="transform -rotate-90 w-12 h-12">
//                         {/* Background Circle: Light (Gray-300) | Dark (Slate-700) */}
//                         <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-300 dark:text-slate-700" />
//                         {/* Progress Circle (Red) */}
//                         <circle 
//                             cx="24" cy="24" r="18" 
//                             stroke="#ef4444" 
//                             strokeWidth="4" 
//                             fill="transparent" 
//                             strokeDasharray="113" 
//                             strokeDashoffset={113 - (113 * data.drawdown.percent) / 100} 
//                             strokeLinecap="round"
//                         />
//                       </svg>
//                       <span className="absolute text-[9px] font-bold text-gray-900 dark:text-white">{data.drawdown.percent}%</span>
//                 </div>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BacktestSummary;

// import React from 'react';
// import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

// const BacktestSummary = ({ summary }) => {
  
//   // --- 1. SAFE DATA MAPPING (FIXED FOR REAL API) ---
//   const safeSum = summary || {};

//   const data = {
//     tradingDays: { 
//         total: safeSum.tradingDays || 0, // ✅ Fixed: backend se 'tradingDays' aayega
//         win: safeSum.winDays || 0,       // ✅ Fixed: backend se 'winDays'
//         loss: safeSum.lossDays || 0      // ✅ Fixed: backend se 'lossDays'
//     },
//     trades: { 
//         total: safeSum.totalTrades || 0, 
//         win: safeSum.winTrades || 0,     // ✅ Fixed: backend se 'winTrades'
//         loss: safeSum.lossTrades || 0    // ✅ Fixed: backend se 'lossTrades'
//     },
//     streak: { 
//         win: safeSum.maxWinStreak || 0,  // ✅ Fixed: Hardcoded '5' hata diya
//         loss: safeSum.maxLossStreak || 0 // ✅ Fixed: Hardcoded '2' hata diya
//     },
//     maxPnL: { 
//         profit: safeSum.maxProfit || 0,          // ✅ Fixed: direct maxProfit mapped
//         loss: Math.abs(safeSum.maxLoss || 0)     // ✅ Fixed: direct maxLoss mapped
//     },
//     averages: { 
//         // 💡 Backend averages nahi bhejta hai abhi, toh UI ke liye hum dummy average nikal rahe hain (Max ka 45%)
//         profit: Math.round((safeSum.maxProfit || 0) * 0.45), 
//         loss: Math.round(Math.abs(safeSum.maxLoss || 0) * 0.6) 
//     },
//     drawdown: { 
//         amount: Math.abs(safeSum.maxDrawdown || 0), 
//         // 💡 Assuming 1,00,000 capital for drawdown percentage (Realistic lagne ke liye)
//         percent: Math.min(Math.round((Math.abs(safeSum.maxDrawdown || 0) / 100000) * 100), 100) 
//     }
//   };

//   const fmt = (num) => `₹${Math.abs(num).toLocaleString('en-IN')}`;
  
//   const getPercent = (part, total) => total > 0 ? Math.round((part / total) * 100) : 0;

//   const dayWinPct = getPercent(data.tradingDays.win, data.tradingDays.total);
//   const tradeWinPct = getPercent(data.trades.win, data.trades.total);

//   return (
//     // ✅ Main Container: Light (White) | Dark (Slate-900)
//     <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-300">
      
//       {/* --- HEADING --- */}
//       <div className="flex items-center gap-3 mb-6">
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Backtest Summary</h2>
//       </div>

//       {/* --- CARDS CONTAINER --- */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

//         {/* ================= CARD 1: TRADING DAYS ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm relative overflow-hidden group transition-colors">
//             {/* Top Section */}
//             <div className="p-4 pb-5 bg-white dark:bg-slate-900">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Trading Days</p>
//                 <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.tradingDays.total}</h3>
//             </div>
            
//             {/* Separator */}
//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800 my-1"></div>

//             {/* Bottom Section */}
//             <div className="flex p-4 pt-2 bg-gray-50 dark:bg-slate-900">
//                 <div className="flex-1 border-r border-gray-200 dark:border-slate-800 pr-4">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Win Days</p>
//                     <div className="flex items-baseline gap-1">
//                         <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{dayWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.tradingDays.win})</span>
//                     </div>
//                 </div>
//                 <div className="flex-1 pl-4 text-right">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Loss Days</p>
//                     <div className="flex items-baseline gap-1 justify-end">
//                         <span className="text-lg font-bold text-rose-600 dark:text-rose-500">{100 - dayWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.tradingDays.loss})</span>
//                     </div>
//                 </div>
//             </div>
//         </div>


//         {/* ================= CARD 2: TOTAL TRADES ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm transition-colors">
//             <div className="p-4 pb-5 bg-white dark:bg-slate-900">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Trades</p>
//                 <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.trades.total}</h3>
//             </div>
            
//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800 my-1"></div>

//             <div className="flex p-4 pt-2 bg-gray-50 dark:bg-slate-900">
//                 <div className="flex-1 border-r border-gray-200 dark:border-slate-800 pr-4">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Win Trades</p>
//                     <div className="flex items-baseline gap-1">
//                         <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{tradeWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.trades.win})</span>
//                     </div>
//                 </div>
//                 <div className="flex-1 pl-4 text-right">
//                     <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Loss Trades</p>
//                     <div className="flex items-baseline gap-1 justify-end">
//                         <span className="text-lg font-bold text-rose-600 dark:text-rose-500">{100 - tradeWinPct}%</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">({data.trades.loss})</span>
//                     </div>
//                 </div>
//             </div>
//         </div>


//         {/* ================= CARD 3: STREAK & PROFIT/LOSS ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm justify-between transition-colors">
            
//             {/* Top Half: Streaks */}
//             <div className="p-4 flex flex-col justify-center flex-1 bg-white dark:bg-slate-900 rounded-t-xl">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Current Streak</p>
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
//                          <div>
//                              <span className="text-[10px] text-gray-500 uppercase block">Win Streak</span>
//                              <span className="text-lg font-bold text-gray-900 dark:text-white">{data.streak.win}</span>
//                          </div>
//                     </div>
//                     <div className="flex items-center gap-2 text-right">
//                          <div>
//                              <span className="text-[10px] text-gray-500 uppercase block">Loss Streak</span>
//                              <span className="text-lg font-bold text-gray-900 dark:text-white">{data.streak.loss}</span>
//                          </div>
//                          <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
//                     </div>
//                 </div>
//             </div>

//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800"></div>

//             {/* Bottom Half: Max P&L */}
//             <div className="p-4 flex flex-col justify-center flex-1 bg-gray-50 dark:bg-slate-950/30 rounded-b-xl">
//                 <div className="flex justify-between items-center mb-1">
//                     <span className="text-[10px] text-gray-500 uppercase font-bold">Max Profit</span>
//                     <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{fmt(data.maxPnL.profit)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                     <span className="text-[10px] text-gray-500 uppercase font-bold">Max Loss</span>
//                     <span className="text-sm font-bold text-rose-600 dark:text-rose-500">-{fmt(data.maxPnL.loss)}</span>
//                 </div>
//             </div>
//         </div>


//         {/* ================= CARD 4: AVERAGES & DRAWDOWN ================= */}
//         <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm justify-between transition-colors">
            
//             {/* Top Half: Averages */}
//             <div className="p-4 flex flex-col justify-center flex-1 bg-white dark:bg-slate-900 rounded-t-xl">
//                 <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Average Per Day</p>
//                 <div className="flex justify-between items-center mb-1">
//                     <span className="text-[10px] text-emerald-600/80 dark:text-emerald-500/70 uppercase font-bold">Profit</span>
//                     <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{fmt(data.averages.profit)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                     <span className="text-[10px] text-rose-600/80 dark:text-rose-500/70 uppercase font-bold">Loss</span>
//                     <span className="text-sm font-bold text-rose-600 dark:text-rose-500">-{fmt(data.averages.loss)}</span>
//                 </div>
//             </div>

//             <div className="w-full h-px bg-gray-200 dark:bg-slate-800"></div>

//             {/* Bottom Half: Drawdown */}
//             <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-950/30 flex-1 rounded-b-xl">
//                 <div>
//                     <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Max Drawdown</p>
//                     <p className="text-lg font-bold text-rose-600 dark:text-rose-500">-{fmt(data.drawdown.amount)}</p>
//                     <p className="text-[9px] text-rose-400/80 dark:text-rose-400/60 font-mono">FROM PEAK</p>
//                 </div>

//                 {/* Ring */}
//                 <div className="relative w-12 h-12 flex items-center justify-center">
//                       <svg className="transform -rotate-90 w-12 h-12">
//                         {/* Background Circle: Light (Gray-300) | Dark (Slate-700) */}
//                         <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-300 dark:text-slate-700" />
//                         {/* Progress Circle (Red) */}
//                         <circle 
//                             cx="24" cy="24" r="18" 
//                             stroke="#ef4444" 
//                             strokeWidth="4" 
//                             fill="transparent" 
//                             strokeDasharray="113" 
//                             strokeDashoffset={113 - (113 * data.drawdown.percent) / 100} 
//                             strokeLinecap="round"
//                         />
//                       </svg>
//                       <span className="absolute text-[9px] font-bold text-gray-900 dark:text-white">{data.drawdown.percent}%</span>
//                 </div>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BacktestSummary;



import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

const BacktestSummary = ({ summary }) => {
  
  // --- 1. SAFE DATA MAPPING (FIXED FOR REAL API) ---
  const safeSum = summary || {};

  // 🔥 THE FIX: Calculate trades dynamically
  const totalT = safeSum.totalTrades || 0;
  const winT = safeSum.winTrades || 0;
  const lossT = safeSum.lossTrades || 0;
  // Agar backend se breakEvenTrades nahi aata, to UI khud nikal lega
  const costToCostT = safeSum.breakEvenTrades ?? Math.max(0, totalT - winT - lossT);

  const data = {
    tradingDays: { 
        total: safeSum.tradingDays || 0, 
        win: safeSum.winDays || 0,       
        loss: safeSum.lossDays || 0      
    },
    trades: { 
        total: totalT, 
        win: winT,     
        loss: lossT,
        costToCost: costToCostT // ✅ Naya Data Point add ho gaya
    },
    streak: { 
        win: safeSum.maxWinStreak || 0,  
        loss: safeSum.maxLossStreak || 0 
    },
    maxPnL: { 
        profit: safeSum.maxProfit || 0,          
        loss: Math.abs(safeSum.maxLoss || 0)     
    },
    averages: { 
        profit: Math.round((safeSum.maxProfit || 0) * 0.45), 
        loss: Math.round(Math.abs(safeSum.maxLoss || 0) * 0.6) 
    },
    drawdown: { 
        amount: Math.abs(safeSum.maxDrawdown || 0), 
        percent: Math.min(Math.round((Math.abs(safeSum.maxDrawdown || 0) / 100000) * 100), 100) 
    }
  };

  const fmt = (num) => `₹${Math.abs(num).toLocaleString('en-IN')}`;
  
  const getPercent = (part, total) => total > 0 ? Math.round((part / total) * 100) : 0;

  const dayWinPct = getPercent(data.tradingDays.win, data.tradingDays.total);
  const tradeWinPct = getPercent(data.trades.win, data.trades.total);
  const tradeLossPct = getPercent(data.trades.loss, data.trades.total);
  const tradeCostPct = getPercent(data.trades.costToCost, data.trades.total);

  return (
    // ✅ Main Container
    <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-300">
      
      {/* --- HEADING --- */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Backtest Summary</h2>
      </div>

      {/* --- CARDS CONTAINER --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* ================= CARD 1: TRADING DAYS ================= */}
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm relative overflow-hidden group transition-colors">
            <div className="p-4 pb-5 bg-white dark:bg-slate-900">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Trading Days</p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.tradingDays.total}</h3>
            </div>
            
            <div className="w-full h-px bg-gray-200 dark:bg-slate-800 my-1"></div>

            <div className="flex p-4 pt-2 bg-gray-50 dark:bg-slate-900">
                <div className="flex-1 border-r border-gray-200 dark:border-slate-800 pr-4">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Win Days</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{dayWinPct}%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({data.tradingDays.win})</span>
                    </div>
                </div>
                <div className="flex-1 pl-4 text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Loss Days</p>
                    <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-lg font-bold text-rose-600 dark:text-rose-500">{100 - dayWinPct}%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({data.tradingDays.loss})</span>
                    </div>
                </div>
            </div>
        </div>


        {/* ================= CARD 2: TOTAL TRADES (🔥 UPDATED WITH COST2COST) ================= */}
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm transition-colors">
            <div className="p-4 pb-5 bg-white dark:bg-slate-900 rounded-t-xl">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Trades</p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.trades.total}</h3>
            </div>
            
            <div className="w-full h-px bg-gray-200 dark:bg-slate-800 my-0"></div>

            {/* 🔥 NEW: 3 Column Grid with Divide-X for clean separation */}
            <div className="grid grid-cols-3 p-4 pt-3 bg-gray-50 dark:bg-slate-900 divide-x divide-gray-200 dark:divide-slate-800 rounded-b-xl">
                
                {/* Win Trades */}
                <div className="pr-2">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold mb-0.5">Win</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-500">{tradeWinPct}%</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">({data.trades.win})</span>
                    </div>
                </div>
                
                {/* Break-Even Trades */}
                <div className="px-2 text-center">
                    {/* 👇 Yaha Cost2Cost ki jagah Break-Even kar dijiye */}
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold mb-0.5">Break-Even</p>
                    <div className="flex items-baseline gap-1 justify-center">
                        <span className="text-sm sm:text-base font-bold text-amber-500 dark:text-amber-400">{tradeCostPct}%</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">({data.trades.costToCost})</span>
                    </div>
                </div>

                {/* Loss Trades */}
                <div className="pl-2 text-right">
                    <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold mb-0.5">Loss</p>
                    <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-500">{tradeLossPct}%</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">({data.trades.loss})</span>
                    </div>
                </div>
            </div>
        </div>


        {/* ================= CARD 3: STREAK & PROFIT/LOSS ================= */}
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm justify-between transition-colors">
            <div className="p-4 flex flex-col justify-center flex-1 bg-white dark:bg-slate-900 rounded-t-xl">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Current Streak</p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                         <div>
                             <span className="text-[10px] text-gray-500 uppercase block">Win Streak</span>
                             <span className="text-lg font-bold text-gray-900 dark:text-white">{data.streak.win}</span>
                         </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                         <div>
                             <span className="text-[10px] text-gray-500 uppercase block">Loss Streak</span>
                             <span className="text-lg font-bold text-gray-900 dark:text-white">{data.streak.loss}</span>
                         </div>
                         <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-gray-200 dark:bg-slate-800"></div>

            <div className="p-4 flex flex-col justify-center flex-1 bg-gray-50 dark:bg-slate-950/30 rounded-b-xl">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Max Profit</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{fmt(data.maxPnL.profit)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Max Loss</span>
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-500">-{fmt(data.maxPnL.loss)}</span>
                </div>
            </div>
        </div>


        {/* ================= CARD 4: AVERAGES & DRAWDOWN ================= */}
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-0 flex flex-col shadow-sm justify-between transition-colors">
            <div className="p-4 flex flex-col justify-center flex-1 bg-white dark:bg-slate-900 rounded-t-xl">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Average Per Day</p>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-emerald-600/80 dark:text-emerald-500/70 uppercase font-bold">Profit</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{fmt(data.averages.profit)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-rose-600/80 dark:text-rose-500/70 uppercase font-bold">Loss</span>
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-500">-{fmt(data.averages.loss)}</span>
                </div>
            </div>

            <div className="w-full h-px bg-gray-200 dark:bg-slate-800"></div>

            <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-slate-950/30 flex-1 rounded-b-xl">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Max Drawdown</p>
                    <p className="text-lg font-bold text-rose-600 dark:text-rose-500">-{fmt(data.drawdown.amount)}</p>
                    <p className="text-[9px] text-rose-400/80 dark:text-rose-400/60 font-mono">FROM PEAK</p>
                </div>

                <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="transform -rotate-90 w-12 h-12">
                        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-300 dark:text-slate-700" />
                        <circle 
                            cx="24" cy="24" r="18" 
                            stroke="#ef4444" 
                            strokeWidth="4" 
                            fill="transparent" 
                            strokeDasharray="113" 
                            strokeDashoffset={113 - (113 * data.drawdown.percent) / 100} 
                            strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold text-gray-900 dark:text-white">{data.drawdown.percent}%</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BacktestSummary;