// import React, { useState, useMemo } from 'react';
// import { TrendingUp, ChevronDown, ChevronUp, ZoomIn, ZoomOut } from 'lucide-react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

// // ==========================================
// // 🧠 BLACK-SCHOLES MATH ENGINE (ISOLATED)
// // ==========================================
// const normalCDF = (x) => {
//     const t = 1 / (1 + 0.2316419 * Math.abs(x));
//     const d = 0.39894228 * Math.exp(-x * x / 2);
//     const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
//     return x > 0 ? 1 - prob : prob;
// };

// const normalPDF = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

// const calculateBSPrice = (S, K, t, v, r, type) => {
//     if (t <= 0) return type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
//     const d1 = (Math.log(S / K) + (r + (v * v) / 2) * t) / (v * Math.sqrt(t));
//     const d2 = d1 - v * Math.sqrt(t);
//     if (type === 'call') {
//         return S * normalCDF(d1) - K * Math.exp(-r * t) * normalCDF(d2);
//     } else {
//         return K * Math.exp(-r * t) * normalCDF(-d2) - S * normalCDF(-d1);
//     }
// };

// const calculateBSVega = (S, K, t, v, r) => {
//     if (t <= 0) return 0;
//     const d1 = (Math.log(S / K) + (r + (v * v) / 2) * t) / (v * Math.sqrt(t));
//     return S * Math.sqrt(t) * normalPDF(d1);
// };

// const getImpliedVolatility = (targetPrice, S, K, t, r, type) => {
//     let intrinsic = type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
//     if (targetPrice <= intrinsic) return 0.01; 

//     let v = 0.20; 
//     for (let i = 0; i < 100; i++) {
//         const price = calculateBSPrice(S, K, t, v, r, type);
//         const diff = price - targetPrice;
//         if (Math.abs(diff) < 1e-4) return v;
//         const vega = calculateBSVega(S, K, t, v, r);
//         if (Math.abs(vega) < 1e-6) break; 
//         v = v - (diff / vega); 
//         if (v < 0.001) v = 0.001; 
//         if (v > 3.0) v = 3.0; 
//     }
//     return (v <= 0.001 || isNaN(v)) ? 0.15 : v;
// };

// const getProbAbove = (S, K, v, t) => {
//     if (t <= 0) return S > K ? 1 : 0;
//     const d2 = (Math.log(S / K) - (v * v / 2) * t) / (v * Math.sqrt(t));
//     return normalCDF(d2);
// };

// const calculateLiveLtp = (leg) => {
//     if (!leg || !leg.entryPrice) return 0;
//     const qty = leg.quantity || 1; 
//     const pnl = leg.livePnl || 0;
//     return leg.action === 'BUY' ? leg.entryPrice + (pnl / qty) : leg.entryPrice - (pnl / qty);
// };

// const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//         const pnl = payload[0].value;
//         return (
//             <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2.5 rounded-lg shadow-xl text-xs z-50">
//                 <p className="text-gray-500 font-bold mb-1">Expiry Spot: <span className="text-gray-900 dark:text-white">{label}</span></p>
//                 <p className={`font-black text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>Est. P&L: ₹{pnl.toFixed(0)}</p>
//             </div>
//         );
//     }
//     return null;
// };

// // ==========================================
// // 📊 PAYOFF CHART COMPONENT
// // ==========================================
// const StrategyPayoffChart = ({ legs, liveSpot, livePnl, marginBlocked, tradeBoundaries, dte }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isZoomed, setIsZoomed] = useState(true);

//     const formatShortMargin = (num) => {
//         if (!num || isNaN(num)) return 'N/A';
//         if (num >= 10000000) return `₹${parseFloat((num / 10000000).toFixed(2))}Cr`;
//         if (num >= 100000) return `₹${parseFloat((num / 100000).toFixed(2))}L`;
//         if (num >= 1000) return `₹${parseFloat((num / 1000).toFixed(2))}K`;
//         return `₹${num.toFixed(0)}`;
//     };

//     // 🔥 FIX 1: Hum 'legs' me se sirf STATIC data (Symbol, Action, Qty, Price) nikalenge.
//     // Isse jab livePnl change hoga, to Chart bar-bar destroy nahi hoga!
//     const staticLegsForCurve = (legs || []).map(l => ({
//         symbol: l.symbol,
//         action: l.action,
//         qty: l.quantity,
//         price: l.entryPrice
//     }));
//     const legsStr = JSON.stringify(staticLegsForCurve);
//     const boundsStr = JSON.stringify(tradeBoundaries || {});

//     // 🧠 STATIC PAYOFF DATA (Ye area curve sirf ek baar banega)
//     const chartBase = useMemo(() => {
//         if (!legs || legs.length === 0) return null;

//         let netPremium = 0;
//         const parsedLegs = legs.map(leg => {
//             const match = leg.symbol.match(/(\d+)\s+(CE|PE)/i);
//             if (!match) return null;
//             const strike = parseInt(match[1]);
//             const type = match[2].toUpperCase();
//             const price = leg.entryPrice || 0;
//             const qty = leg.quantity || 0;
            
//             if (leg.action.toUpperCase() === 'BUY') netPremium -= (price * qty);
//             if (leg.action.toUpperCase() === 'SELL') netPremium += (price * qty);
//             return { strike, type, action: leg.action.toUpperCase(), qty, price, legRef: leg };
//         }).filter(l => l !== null);

//         if (parsedLegs.length === 0) return null;

//         const strikes = parsedLegs.map(l => l.strike);
//         const minStrike = Math.min(...strikes);
//         const maxStrike = Math.max(...strikes);
//         const centerSpot = Math.round((minStrike + maxStrike) / 2);

//         let startSpot, endSpot;
//         if (isZoomed && tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) {
//             const spread = tradeBoundaries.upperBreakEven - tradeBoundaries.lowerBreakEven;
//             const padding = spread * 0.25; 
//             startSpot = tradeBoundaries.lowerBreakEven - padding;
//             endSpot = tradeBoundaries.upperBreakEven + padding;
//         } else {
//             const rangePercent = isZoomed ? 0.02 : 0.08; 
//             startSpot = minStrike - (minStrike * rangePercent);
//             endSpot = maxStrike + (maxStrike * rangePercent);
//         }

//         const step = (endSpot - startSpot) / 100; 
//         let data = [];
//         let maxPnl = -Infinity;
//         let minPnl = Infinity;

//         let totalBuyQty = 0;
//         let totalSellQty = 0;
//         parsedLegs.forEach(leg => {
//             if (leg.action === 'BUY') totalBuyQty += leg.qty;
//             if (leg.action === 'SELL') totalSellQty += leg.qty;
//         });
//         const isRiskUnlimited = totalSellQty > totalBuyQty;

//         for (let spot = startSpot; spot <= endSpot; spot += step) {
//             let totalPnl = 0;
//             parsedLegs.forEach(leg => {
//                 let pnl = 0;
//                 if (leg.type === 'CE') {
//                     const intrinsic = Math.max(0, spot - leg.strike);
//                     pnl = leg.action === 'BUY' ? (intrinsic - leg.price) * leg.qty : (leg.price - intrinsic) * leg.qty;
//                 } else if (leg.type === 'PE') {
//                     const intrinsic = Math.max(0, leg.strike - spot);
//                     pnl = leg.action === 'BUY' ? (intrinsic - leg.price) * leg.qty : (leg.price - intrinsic) * leg.qty;
//                 }
//                 totalPnl += pnl;
//             });
//             maxPnl = Math.max(maxPnl, totalPnl);
//             minPnl = Math.min(minPnl, totalPnl);
//             data.push({ spot: Math.round(spot), pnl: totalPnl });
//         }

//         return { data, maxPnl, minPnl, centerSpot, netPremium, isRiskUnlimited, parsedLegs };
//     }, [legsStr, boundsStr, isZoomed]); 

//     // 🧠 DYNAMIC LIVE DATA (Spot Line, IV, POP)
//     let currentMarketSpot = chartBase?.centerSpot || 0;
//     let exactPop = 0;
//     let oneSigmaMove = 0;

//     if (chartBase) {
//         // Safe check for NaN
//         currentMarketSpot = (liveSpot && !isNaN(liveSpot)) ? Number(liveSpot) : chartBase.centerSpot;
//         const timeInYears = Math.max(dte || 1, 0.001) / 365;
        
//         let totalIV = 0;
//         let validIvCount = 0;

//         chartBase.parsedLegs.forEach(l => {
//             const originalLeg = legs.find(leg => leg.symbol === l.legRef.symbol);
//             const liveLtp = calculateLiveLtp(originalLeg);
//             const iv = getImpliedVolatility(liveLtp, currentMarketSpot, l.strike, timeInYears, 0, l.type.toLowerCase());
//             totalIV += iv;
//             validIvCount++;
//         });

//         const avgIV = validIvCount > 0 ? (totalIV / validIvCount) : 0.15;
//         oneSigmaMove = currentMarketSpot * avgIV * Math.sqrt(timeInYears);

//         const pnlAtSpot = chartBase.data.reduce((closest, curr) => Math.abs(curr.spot - currentMarketSpot) < Math.abs(closest.spot - currentMarketSpot) ? curr : closest).pnl;
        
//         if (tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) {
//             const probAboveLower = getProbAbove(currentMarketSpot, tradeBoundaries.lowerBreakEven, avgIV, timeInYears);
//             const probAboveUpper = getProbAbove(currentMarketSpot, tradeBoundaries.upperBreakEven, avgIV, timeInYears);
//             exactPop = pnlAtSpot > 0 ? (probAboveLower - probAboveUpper) * 100 : (1 - (probAboveLower - probAboveUpper)) * 100;
//         } else if (tradeBoundaries?.lowerBreakEven > 0) {
//             const probAbove = getProbAbove(currentMarketSpot, tradeBoundaries.lowerBreakEven, avgIV, timeInYears);
//             exactPop = chartBase.data[chartBase.data.length - 1].pnl > 0 ? probAbove * 100 : (1 - probAbove) * 100;
//         } else if (tradeBoundaries?.upperBreakEven > 0) {
//             const probAbove = getProbAbove(currentMarketSpot, tradeBoundaries.upperBreakEven, avgIV, timeInYears);
//             exactPop = chartBase.data[chartBase.data.length - 1].pnl > 0 ? probAbove * 100 : (1 - probAbove) * 100;
//         }
//         exactPop = Math.max(0, Math.min(100, exactPop));
//     }

//     if (!chartBase || chartBase.data.length === 0) return null;

//     const off = (() => {
//         const dataMax = chartBase.maxPnl;
//         const dataMin = chartBase.minPnl;
//         if (dataMax <= 0) return 0;
//         if (dataMin >= 0) return 1;
//         return dataMax / (dataMax - dataMin);
//     })();

//     return (
//         <div className="mt-2 border-t border-gray-100 dark:border-slate-700/50 pt-2 relative">
//             <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
//                 <TrendingUp size={14} /> 
//                 {isOpen ? 'Hide Payoff Chart' : 'View Payoff Chart'} 
//                 {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </button>

//             {isOpen && (
//                 <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
//                     <div className="flex flex-wrap items-center justify-between bg-gray-50 dark:bg-slate-800/40 p-3 rounded-lg border border-gray-200 dark:border-slate-700 mb-4 gap-y-3 gap-x-2">
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Est. Margin</span>
//                             <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{formatShortMargin(marginBlocked)}</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">P&L</span>
//                             <span className={`text-[11px] font-black ${livePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹{livePnl ? livePnl.toFixed(2) : '0.00'}</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Profit</span>
//                             <span className="text-[11px] font-black text-green-600 dark:text-green-400">
//                                 {chartBase.maxPnl > 0 ? `₹${chartBase.maxPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0'}
//                             </span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Loss</span>
//                             <span className="text-[11px] font-black text-red-600 dark:text-red-400">
//                                 {chartBase.isRiskUnlimited ? 'Undefined' : (chartBase.minPnl < 0 ? `₹${chartBase.minPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0')}
//                             </span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">POP</span>
//                             <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{exactPop.toFixed(1)}%</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{chartBase.netPremium >= 0 ? 'Net Credit' : 'Net Debit'}</span>
//                             <span className={`text-[11px] font-black ${chartBase.netPremium >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹{Math.abs(chartBase.netPremium).toFixed(2)}</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Breakevens</span>
//                             <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 flex items-center gap-1">
//                                 {tradeBoundaries?.lowerBreakEven > 0 ? (
//                                     <span>{tradeBoundaries.lowerBreakEven} <span className="text-[9px] text-red-500 ml-0.5 tracking-tighter">({(((tradeBoundaries.lowerBreakEven - currentMarketSpot) / currentMarketSpot) * 100).toFixed(1)}%)</span></span>
//                                 ) : null}
//                                 {(tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) && <span className="text-gray-400 font-normal">|</span>}
//                                 {tradeBoundaries?.upperBreakEven > 0 ? (
//                                     <span>{tradeBoundaries.upperBreakEven} <span className="text-[9px] text-green-500 ml-0.5 tracking-tighter">(+{(((tradeBoundaries.upperBreakEven - currentMarketSpot) / currentMarketSpot) * 100).toFixed(1)}%)</span></span>
//                                 ) : null}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="h-[220px] w-full mt-2 relative group">
//                         <button onClick={() => setIsZoomed(!isZoomed)} className="absolute top-0 right-2 z-20 p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm text-gray-500 hover:text-blue-600 transition-all opacity-50 group-hover:opacity-100">
//                             {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
//                         </button>

//                         <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
//                             {/* 🔥 FIX 1: [... ] Hata diya (Docs ke anusar). Ab Recharts chart ko destroy nahi karega! 🔥 */}
//                             <AreaChart data={chartBase.data} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
//                                 <defs>
//                                     <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
//                                         <stop offset={off} stopColor="#22c55e" stopOpacity={0.4} />
//                                         <stop offset={off} stopColor="#ef4444" stopOpacity={0.4} />
//                                     </linearGradient>
//                                 </defs>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
//                                 <XAxis dataKey="spot" type="number" domain={['dataMin', 'dataMax']} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} tickLine={false} axisLine={false} tickCount={6} />
//                                 <YAxis tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
//                                 <RechartsTooltip content={<CustomTooltip />} isAnimationActive={false} />
                                
//                                 <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                                
//                                 {/* 🔥 FIX 2: Sabhi ReferenceLine/Area se isAnimationActive hata diya (Docs me ye valid nahi hai) 🔥 */}
//                                 <ReferenceArea x1={currentMarketSpot - oneSigmaMove} x2={currentMarketSpot + oneSigmaMove} fill="#e2e8f0" fillOpacity={0.4} />
//                                 <ReferenceLine x={currentMarketSpot - oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '-1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
//                                 <ReferenceLine x={currentMarketSpot + oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '+1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
//                                 <ReferenceLine x={currentMarketSpot - (oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '-2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />
//                                 <ReferenceLine x={currentMarketSpot + (oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '+2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />

//                                 <ReferenceLine 
//                                     x={currentMarketSpot} 
//                                     stroke="#475569" 
//                                     strokeWidth={1.5} 
//                                     strokeDasharray="4 4" 
//                                     label={{ position: 'top', value: `Spot: ${currentMarketSpot}`, fill: '#1e293b', fontSize: 11, fontWeight: 'bold', offset: 10 }} 
//                                 />

//                                 <Area type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={2.5} fill="url(#splitColor)" isAnimationActive={false} />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // 🔥 FIX 3: Hata diya React.memo. Kyunki useMemo ne apna kaam perfect kar diya hai.
// export default StrategyPayoffChart;



import React, { useState, useMemo } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, ZoomIn, ZoomOut } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

// ==========================================
// 🚀 CONSTANTS (React ko bewakoof banane ka tarika)
// In objects ko bahar rakha hai taaki Recharts inhein bar-bar naya na samjhe!
// ==========================================
const CHART_MARGIN = { top: 25, right: 10, left: -20, bottom: 0 };
const XAXIS_DOMAIN = ['dataMin', 'dataMax'];
const AXIS_TICK = { fontSize: 10, fill: '#64748b', fontWeight: 'bold' };

const LBL_MINUS_1 = { position: 'insideTopRight', value: '-1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' };
const LBL_PLUS_1 = { position: 'insideTopLeft', value: '+1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' };
const LBL_MINUS_2 = { position: 'insideTopRight', value: '-2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' };
const LBL_PLUS_2 = { position: 'insideTopLeft', value: '+2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' };

// ==========================================
// 🧠 BLACK-SCHOLES MATH ENGINE
// ==========================================
const normalCDF = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.39894228 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
};

const normalPDF = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

const calculateBSPrice = (S, K, t, v, r, type) => {
    if (t <= 0) return type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
    const d1 = (Math.log(S / K) + (r + (v * v) / 2) * t) / (v * Math.sqrt(t));
    const d2 = d1 - v * Math.sqrt(t);
    if (type === 'call') {
        return S * normalCDF(d1) - K * Math.exp(-r * t) * normalCDF(d2);
    } else {
        return K * Math.exp(-r * t) * normalCDF(-d2) - S * normalCDF(-d1);
    }
};

const calculateBSVega = (S, K, t, v, r) => {
    if (t <= 0) return 0;
    const d1 = (Math.log(S / K) + (r + (v * v) / 2) * t) / (v * Math.sqrt(t));
    return S * Math.sqrt(t) * normalPDF(d1);
};

const getImpliedVolatility = (targetPrice, S, K, t, r, type) => {
    let intrinsic = type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
    if (targetPrice <= intrinsic) return 0.01; 

    let v = 0.20; 
    for (let i = 0; i < 100; i++) {
        const price = calculateBSPrice(S, K, t, v, r, type);
        const diff = price - targetPrice;
        if (Math.abs(diff) < 1e-4) return v;
        const vega = calculateBSVega(S, K, t, v, r);
        if (Math.abs(vega) < 1e-6) break; 
        v = v - (diff / vega); 
        if (v < 0.001) v = 0.001; 
        if (v > 3.0) v = 3.0; 
    }
    return (v <= 0.001 || isNaN(v)) ? 0.15 : v;
};

const getProbAbove = (S, K, v, t) => {
    if (t <= 0) return S > K ? 1 : 0;
    const d2 = (Math.log(S / K) - (v * v / 2) * t) / (v * Math.sqrt(t));
    return normalCDF(d2);
};

const calculateLiveLtp = (leg) => {
    if (!leg || !leg.entryPrice) return 0;
    const qty = leg.quantity || 1; 
    const pnl = leg.livePnl || 0;
    return leg.action === 'BUY' ? leg.entryPrice + (pnl / qty) : leg.entryPrice - (pnl / qty);
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const pnl = payload[0].value;
        return (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2.5 rounded-lg shadow-xl text-xs z-50">
                <p className="text-gray-500 font-bold mb-1">Expiry Spot: <span className="text-gray-900 dark:text-white">{label}</span></p>
                <p className={`font-black text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>Est. P&L: ₹{pnl.toFixed(0)}</p>
            </div>
        );
    }
    return null;
};

// ==========================================
// 📊 PAYOFF CHART COMPONENT
// ==========================================
const StrategyPayoffChart = ({ legs, liveSpot, livePnl, marginBlocked, tradeBoundaries, dte }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(true);

    const formatShortMargin = (num) => {
        if (!num || isNaN(num)) return 'N/A';
        if (num >= 10000000) return `₹${parseFloat((num / 10000000).toFixed(2))}Cr`;
        if (num >= 100000) return `₹${parseFloat((num / 100000).toFixed(2))}L`;
        if (num >= 1000) return `₹${parseFloat((num / 1000).toFixed(2))}K`;
        return `₹${num.toFixed(0)}`;
    };

    const staticLegsForCurve = (legs || []).map(l => ({
        symbol: l.symbol,
        action: l.action,
        qty: l.quantity,
        price: l.entryPrice
    }));
    const legsStr = JSON.stringify(staticLegsForCurve);
    const boundsStr = JSON.stringify(tradeBoundaries || {});

    // 🧠 1. STATIC CURVE DATA 
    const chartBase = useMemo(() => {
        if (!legs || legs.length === 0) return null;

        let netPremium = 0;
        const parsedLegs = legs.map(leg => {
            const match = leg.symbol.match(/(\d+)\s+(CE|PE)/i);
            if (!match) return null;
            const strike = parseInt(match[1]);
            const type = match[2].toUpperCase();
            const price = leg.entryPrice || 0;
            const qty = leg.quantity || 0;
            
            if (leg.action.toUpperCase() === 'BUY') netPremium -= (price * qty);
            if (leg.action.toUpperCase() === 'SELL') netPremium += (price * qty);
            return { strike, type, action: leg.action.toUpperCase(), qty, price, legRef: leg };
        }).filter(l => l !== null);

        if (parsedLegs.length === 0) return null;

        const strikes = parsedLegs.map(l => l.strike);
        const minStrike = Math.min(...strikes);
        const maxStrike = Math.max(...strikes);
        const centerSpot = Math.round((minStrike + maxStrike) / 2);

        let startSpot, endSpot;
        if (isZoomed && tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) {
            const spread = tradeBoundaries.upperBreakEven - tradeBoundaries.lowerBreakEven;
            const padding = spread * 0.25; 
            startSpot = tradeBoundaries.lowerBreakEven - padding;
            endSpot = tradeBoundaries.upperBreakEven + padding;
        } else {
            const rangePercent = isZoomed ? 0.02 : 0.08; 
            startSpot = minStrike - (minStrike * rangePercent);
            endSpot = maxStrike + (maxStrike * rangePercent);
        }

        const step = (endSpot - startSpot) / 100; 
        let data = [];
        let maxPnl = -Infinity;
        let minPnl = Infinity;

        let totalBuyQty = 0;
        let totalSellQty = 0;
        parsedLegs.forEach(leg => {
            if (leg.action === 'BUY') totalBuyQty += leg.qty;
            if (leg.action === 'SELL') totalSellQty += leg.qty;
        });
        const isRiskUnlimited = totalSellQty > totalBuyQty;

        for (let spot = startSpot; spot <= endSpot; spot += step) {
            let totalPnl = 0;
            parsedLegs.forEach(leg => {
                let pnl = 0;
                if (leg.type === 'CE') {
                    const intrinsic = Math.max(0, spot - leg.strike);
                    pnl = leg.action === 'BUY' ? (intrinsic - leg.price) * leg.qty : (leg.price - intrinsic) * leg.qty;
                } else if (leg.type === 'PE') {
                    const intrinsic = Math.max(0, leg.strike - spot);
                    pnl = leg.action === 'BUY' ? (intrinsic - leg.price) * leg.qty : (leg.price - intrinsic) * leg.qty;
                }
                totalPnl += pnl;
            });
            maxPnl = Math.max(maxPnl, totalPnl);
            minPnl = Math.min(minPnl, totalPnl);
            data.push({ spot: Math.round(spot), pnl: totalPnl });
        }

        return { data, maxPnl, minPnl, centerSpot, netPremium, isRiskUnlimited, parsedLegs };
    }, [legsStr, boundsStr, isZoomed]); 

    // 🧠 2. DYNAMIC SPOT/POP DATA
    let currentMarketSpot = chartBase?.centerSpot || 0;
    let exactPop = 0;
    let oneSigmaMove = 0;

    if (chartBase) {
        currentMarketSpot = (liveSpot && !isNaN(liveSpot)) ? Number(liveSpot) : chartBase.centerSpot;
        const timeInYears = Math.max(dte || 1, 0.001) / 365;
        
        let totalIV = 0;
        let validIvCount = 0;

        chartBase.parsedLegs.forEach(l => {
            const originalLeg = legs.find(leg => leg.symbol === l.legRef.symbol);
            const liveLtp = calculateLiveLtp(originalLeg);
            const iv = getImpliedVolatility(liveLtp, currentMarketSpot, l.strike, timeInYears, 0, l.type.toLowerCase());
            totalIV += iv;
            validIvCount++;
        });

        const avgIV = validIvCount > 0 ? (totalIV / validIvCount) : 0.15;
        oneSigmaMove = currentMarketSpot * avgIV * Math.sqrt(timeInYears);

        const pnlAtSpot = chartBase.data.reduce((closest, curr) => Math.abs(curr.spot - currentMarketSpot) < Math.abs(closest.spot - currentMarketSpot) ? curr : closest).pnl;
        
        if (tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) {
            const probAboveLower = getProbAbove(currentMarketSpot, tradeBoundaries.lowerBreakEven, avgIV, timeInYears);
            const probAboveUpper = getProbAbove(currentMarketSpot, tradeBoundaries.upperBreakEven, avgIV, timeInYears);
            exactPop = pnlAtSpot > 0 ? (probAboveLower - probAboveUpper) * 100 : (1 - (probAboveLower - probAboveUpper)) * 100;
        } else if (tradeBoundaries?.lowerBreakEven > 0) {
            const probAbove = getProbAbove(currentMarketSpot, tradeBoundaries.lowerBreakEven, avgIV, timeInYears);
            exactPop = chartBase.data[chartBase.data.length - 1].pnl > 0 ? probAbove * 100 : (1 - probAbove) * 100;
        } else if (tradeBoundaries?.upperBreakEven > 0) {
            const probAbove = getProbAbove(currentMarketSpot, tradeBoundaries.upperBreakEven, avgIV, timeInYears);
            exactPop = chartBase.data[chartBase.data.length - 1].pnl > 0 ? probAbove * 100 : (1 - probAbove) * 100;
        }
        exactPop = Math.max(0, Math.min(100, exactPop));
    }

    // 🔥 FIX 2: Dynamic Label ko bhi useMemo se freeze kar diya
    const dynamicSpotLabel = useMemo(() => ({ 
        position: 'top', 
        value: `Spot: ${currentMarketSpot}`, 
        fill: '#1e293b', 
        fontSize: 11, 
        fontWeight: 'bold', 
        offset: 10 
    }), [currentMarketSpot]);

    if (!chartBase || chartBase.data.length === 0) return null;

    const off = (() => {
        const dataMax = chartBase.maxPnl;
        const dataMin = chartBase.minPnl;
        if (dataMax <= 0) return 0;
        if (dataMin >= 0) return 1;
        return dataMax / (dataMax - dataMin);
    })();

    return (
        <div className="mt-2 border-t border-gray-100 dark:border-slate-700/50 pt-2 relative">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                <TrendingUp size={14} /> 
                {isOpen ? 'Hide Payoff Chart' : 'View Payoff Chart'} 
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isOpen && (
                <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between bg-gray-50 dark:bg-slate-800/40 p-3 rounded-lg border border-gray-200 dark:border-slate-700 mb-4 gap-y-3 gap-x-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Est. Margin</span>
                            <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{formatShortMargin(marginBlocked)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">P&L</span>
                            <span className={`text-[11px] font-black ${livePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹{livePnl ? livePnl.toFixed(2) : '0.00'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Profit</span>
                            <span className="text-[11px] font-black text-green-600 dark:text-green-400">
                                {chartBase.maxPnl > 0 ? `₹${chartBase.maxPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Loss</span>
                            <span className="text-[11px] font-black text-red-600 dark:text-red-400">
                                {chartBase.isRiskUnlimited ? 'Undefined' : (chartBase.minPnl < 0 ? `₹${chartBase.minPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">POP</span>
                            <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{exactPop.toFixed(1)}%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{chartBase.netPremium >= 0 ? 'Net Credit' : 'Net Debit'}</span>
                            <span className={`text-[11px] font-black ${chartBase.netPremium >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹{Math.abs(chartBase.netPremium).toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Breakevens</span>
                            <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                {tradeBoundaries?.lowerBreakEven > 0 ? (
                                    <span>{tradeBoundaries.lowerBreakEven} <span className="text-[9px] text-red-500 ml-0.5 tracking-tighter">({(((tradeBoundaries.lowerBreakEven - currentMarketSpot) / currentMarketSpot) * 100).toFixed(1)}%)</span></span>
                                ) : null}
                                {(tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) && <span className="text-gray-400 font-normal">|</span>}
                                {tradeBoundaries?.upperBreakEven > 0 ? (
                                    <span>{tradeBoundaries.upperBreakEven} <span className="text-[9px] text-green-500 ml-0.5 tracking-tighter">(+{(((tradeBoundaries.upperBreakEven - currentMarketSpot) / currentMarketSpot) * 100).toFixed(1)}%)</span></span>
                                ) : null}
                            </span>
                        </div>
                    </div>

                    <div className="h-[220px] w-full mt-2 relative group">
                        <button onClick={() => setIsZoomed(!isZoomed)} className="absolute top-0 right-2 z-20 p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm text-gray-500 hover:text-blue-600 transition-all opacity-50 group-hover:opacity-100">
                            {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                        </button>

                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <AreaChart data={chartBase.data} margin={CHART_MARGIN} animationDuration={0}>
                                <defs>
                                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={off} stopColor="#22c55e" stopOpacity={0.4} />
                                        <stop offset={off} stopColor="#ef4444" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                                <XAxis dataKey="spot" type="number" domain={XAXIS_DOMAIN} tick={AXIS_TICK} tickLine={false} axisLine={false} tickCount={6} />
                                <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <RechartsTooltip content={<CustomTooltip />} isAnimationActive={false} />
                                
                                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                                
                                <ReferenceArea x1={currentMarketSpot - oneSigmaMove} x2={currentMarketSpot + oneSigmaMove} fill="#e2e8f0" fillOpacity={0.4} />
                                <ReferenceLine x={currentMarketSpot - oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={LBL_MINUS_1} />
                                <ReferenceLine x={currentMarketSpot + oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={LBL_PLUS_1} />
                                <ReferenceLine x={currentMarketSpot - (oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={LBL_MINUS_2} />
                                <ReferenceLine x={currentMarketSpot + (oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={LBL_PLUS_2} />

                                {/* 🔥 FINAL FIX: Spot line ko stable object reference diya */}
                                <ReferenceLine 
                                    x={currentMarketSpot} 
                                    stroke="#475569" 
                                    strokeWidth={1.5} 
                                    strokeDasharray="4 4" 
                                    label={dynamicSpotLabel} 
                                />

                                <Area type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={2.5} fill="url(#splitColor)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StrategyPayoffChart;