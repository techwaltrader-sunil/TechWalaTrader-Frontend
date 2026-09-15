// import React, { useState, useEffect } from 'react';
// import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2, Wallet, TrendingUp, ChevronDown, ChevronUp, ZoomIn, ZoomOut } from 'lucide-react'; 
// import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService';
// import io from 'socket.io-client'; 
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

// // ==========================================
// // 🧠 BLACK-SCHOLES MATH ENGINE (FRONTEND)
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

// // Probability of Spot expiring ABOVE a certain target (K)
// const getProbAbove = (S, K, v, t) => {
//     if (t <= 0) return S > K ? 1 : 0;
//     const d2 = (Math.log(S / K) - (v * v / 2) * t) / (v * Math.sqrt(t));
//     return normalCDF(d2);
// };

// // ==========================================
// // 📊 PAYOFF CHART COMPONENT (WITH POP & SIGMA LINES)
// // ==========================================
// const StrategyPayoffChart = ({ legs, liveSpot, livePnl, marginBlocked, tradeBoundaries, dte }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isHovering, setIsHovering] = useState(false); 
//     const [isZoomed, setIsZoomed] = useState(true);

//     const formatShortMargin = (num) => {
//         if (!num || isNaN(num)) return 'N/A';
//         if (num >= 10000000) return `₹${parseFloat((num / 10000000).toFixed(2))}Cr`;
//         if (num >= 100000) return `₹${parseFloat((num / 100000).toFixed(2))}L`;
//         if (num >= 1000) return `₹${parseFloat((num / 1000).toFixed(2))}K`;
//         return `₹${num.toFixed(0)}`;
//     };

//     const generatePayoffData = () => {
//         if (!legs || legs.length === 0) return null;

//         let netPremium = 0; 
//         let totalIV = 0;
//         let validIvCount = 0;
//         const timeInYears = Math.max(dte || 1, 0.001) / 365; // Time for BS Math
        
//         const currentMarketSpot = liveSpot ? Math.round(liveSpot) : null;

//         const parsedLegs = legs.map(leg => {
//             const match = leg.symbol.match(/(\d+)\s+(CE|PE)/i);
//             if (!match) return null;
            
//             const strike = parseInt(match[1]);
//             const type = match[2].toUpperCase();
//             const price = leg.entryPrice || 0;
//             const liveLtp = calculateLiveLtp(leg); // Live premium for accurate IV
//             const qty = leg.quantity || 0;
            
//             if (leg.action.toUpperCase() === 'BUY') netPremium -= (price * qty);
//             if (leg.action.toUpperCase() === 'SELL') netPremium += (price * qty);

//             // Calculate IV for this leg
//             if (currentMarketSpot) {
//                 const iv = getImpliedVolatility(liveLtp, currentMarketSpot, strike, timeInYears, 0, type.toLowerCase());
//                 totalIV += iv;
//                 validIvCount++;
//             }

//             return { strike, type, action: leg.action.toUpperCase(), qty, price };
//         }).filter(l => l !== null);

//         if (parsedLegs.length === 0) return null;

//         const strikes = parsedLegs.map(l => l.strike);
//         const minStrike = Math.min(...strikes);
//         const maxStrike = Math.max(...strikes);
//         const centerSpot = currentMarketSpot || Math.round((minStrike + maxStrike) / 2);

//         // 🔥 CALCULATE SIGMA (STANDARD DEVIATION) MOVES
//         const avgIV = validIvCount > 0 ? (totalIV / validIvCount) : 0.15; // Fallback to 15% IV
//         const oneSigmaMove = centerSpot * avgIV * Math.sqrt(timeInYears);

//         let startSpot, endSpot;
//         if (isZoomed && tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) {
//             const spread = tradeBoundaries.upperBreakEven - tradeBoundaries.lowerBreakEven;
//             const padding = spread * 0.25; 
//             startSpot = tradeBoundaries.lowerBreakEven - padding;
//             endSpot = tradeBoundaries.upperBreakEven + padding;
//         } else {
//             const rangePercent = isZoomed ? 0.02 : 0.08; // Widened to show 2 Sigma
//             startSpot = minStrike - (minStrike * rangePercent);
//             endSpot = maxStrike + (maxStrike * rangePercent);
//         }

//         const step = (endSpot - startSpot) / 100; 

//         let data = [];
//         let maxPnl = -Infinity;
//         let minPnl = Infinity;

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

//         // 🔥 EXACT POP CALCULATION (USING BLACK-SCHOLES NORMAL CDF)
//         let exactPop = 0;
//         const pnlAtSpot = data.reduce((closest, curr) => Math.abs(curr.spot - centerSpot) < Math.abs(closest.spot - centerSpot) ? curr : closest).pnl;

//         if (tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) {
//             const probAboveLower = getProbAbove(centerSpot, tradeBoundaries.lowerBreakEven, avgIV, timeInYears);
//             const probAboveUpper = getProbAbove(centerSpot, tradeBoundaries.upperBreakEven, avgIV, timeInYears);
            
//             if (pnlAtSpot > 0) {
//                 // Tent shape (e.g. Ratio Spread, Iron Condor)
//                 exactPop = (probAboveLower - probAboveUpper) * 100;
//             } else {
//                 // Inverse shape (e.g. Long Straddle)
//                 exactPop = (1 - (probAboveLower - probAboveUpper)) * 100;
//             }
//         } else if (tradeBoundaries?.lowerBreakEven > 0) {
//             const probAbove = getProbAbove(centerSpot, tradeBoundaries.lowerBreakEven, avgIV, timeInYears);
//             exactPop = data[data.length - 1].pnl > 0 ? probAbove * 100 : (1 - probAbove) * 100;
//         } else if (tradeBoundaries?.upperBreakEven > 0) {
//             const probAbove = getProbAbove(centerSpot, tradeBoundaries.upperBreakEven, avgIV, timeInYears);
//             exactPop = data[data.length - 1].pnl > 0 ? probAbove * 100 : (1 - probAbove) * 100;
//         }

//         // 🔥 NEW: Detect mathematically if risk is unlimited (More Sells than Buys)
//         let totalBuyQty = 0;
//         let totalSellQty = 0;
//         parsedLegs.forEach(leg => {
//             if (leg.action === 'BUY') totalBuyQty += leg.qty;
//             if (leg.action === 'SELL') totalSellQty += leg.qty;
//         });
//         const isRiskUnlimited = totalSellQty > totalBuyQty;

//         return { data, maxPnl, minPnl, currentMarketSpot: centerSpot, netPremium, exactPop: Math.max(0, Math.min(100, exactPop)), oneSigmaMove, isRiskUnlimited };
//     };

//     const chartInfo = generatePayoffData();
//     if (!chartInfo || chartInfo.data.length === 0) return null;

//     const gradientOffset = () => {
//         const dataMax = chartInfo.maxPnl;
//         const dataMin = chartInfo.minPnl;
//         if (dataMax <= 0) return 0;
//         if (dataMin >= 0) return 1;
//         return dataMax / (dataMax - dataMin);
//     };
//     const off = gradientOffset();

//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             const pnl = payload[0].value;
//             return (
//                 <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2.5 rounded-lg shadow-xl text-xs z-50">
//                     <p className="text-gray-500 font-bold mb-1">Expiry Spot: <span className="text-gray-900 dark:text-white">{label}</span></p>
//                     <p className={`font-black text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>Est. P&L: ₹{pnl.toFixed(0)}</p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     return (
//         <div className="mt-2 border-t border-gray-100 dark:border-slate-700/50 pt-2 relative">
//             <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
//                 <TrendingUp size={14} /> 
//                 {isOpen ? 'Hide Payoff Chart' : 'View Payoff Chart'} 
//                 {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </button>

//             {isOpen && (
//                 <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
//                     {/* 🔥 SUMMARY BAR (UPDATED EXACT POP) 🔥 */}
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
//                                 {chartInfo.maxPnl > 0 ? `₹${chartInfo.maxPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0'}
//                             </span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Loss</span>
//                             <span className="text-[11px] font-black text-red-600 dark:text-red-400">
//                                 {chartInfo.isRiskUnlimited ? (
//                                     'Undefined'
//                                 ) : (
//                                     chartInfo.minPnl < 0 ? `₹${chartInfo.minPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0'
//                                 )}
                                
//                                 {!chartInfo.isRiskUnlimited && chartInfo.minPnl < 0 && marginBlocked > 0 && (
//                                     <span className="text-[9px] ml-1 font-bold opacity-90 tracking-tight">
//                                         ({((Math.abs(chartInfo.minPnl) / marginBlocked) * 100).toFixed(1)}%)
//                                     </span>
//                                 )}
//                             </span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">POP</span>
//                             {/* 🔥 EXACT BS POP 🔥 */}
//                             <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{chartInfo.exactPop.toFixed(1)}%</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{chartInfo.netPremium >= 0 ? 'Net Credit' : 'Net Debit'}</span>
//                             <span className={`text-[11px] font-black ${chartInfo.netPremium >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹{Math.abs(chartInfo.netPremium).toFixed(2)}</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Breakevens</span>
//                             <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 flex items-center gap-1">
//                                 {tradeBoundaries?.lowerBreakEven > 0 ? (
//                                     <span>{tradeBoundaries.lowerBreakEven} <span className="text-[9px] text-red-500 ml-0.5 tracking-tighter">({(((tradeBoundaries.lowerBreakEven - chartInfo.currentMarketSpot) / chartInfo.currentMarketSpot) * 100).toFixed(1)}%)</span></span>
//                                 ) : null}
//                                 {(tradeBoundaries?.lowerBreakEven > 0 && tradeBoundaries?.upperBreakEven > 0) && <span className="text-gray-400 font-normal">|</span>}
//                                 {tradeBoundaries?.upperBreakEven > 0 ? (
//                                     <span>{tradeBoundaries.upperBreakEven} <span className="text-[9px] text-green-500 ml-0.5 tracking-tighter">(+{(((tradeBoundaries.upperBreakEven - chartInfo.currentMarketSpot) / chartInfo.currentMarketSpot) * 100).toFixed(1)}%)</span></span>
//                                 ) : null}
//                                 {(!tradeBoundaries?.lowerBreakEven && !tradeBoundaries?.upperBreakEven) && '--'}
//                             </span>
//                         </div>
//                     </div>

//                     {/* 🔥 CHART AREA WITH SIGMA LINES 🔥 */}
//                     <div className="h-[220px] w-full mt-2 relative group">
//                         <button onClick={() => setIsZoomed(!isZoomed)} className="absolute top-0 right-2 z-20 p-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm text-gray-500 hover:text-blue-600 transition-all opacity-50 group-hover:opacity-100" title={isZoomed ? "Zoom Out (Wide View)" : "Zoom In (Breakeven View)"}>
//                             {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
//                         </button>

//                         <ResponsiveContainer width="100%" height="100%">
//                             <AreaChart data={chartInfo.data} margin={{ top: 25, right: 10, left: -20, bottom: 0 }} onMouseEnter={() => setIsHovering(true)} onMouseMove={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
//                                 <defs>
//                                     <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
//                                         <stop offset={off} stopColor="#22c55e" stopOpacity={0.4} />
//                                         <stop offset={off} stopColor="#ef4444" stopOpacity={0.4} />
//                                     </linearGradient>
//                                 </defs>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
//                                 <XAxis dataKey="spot" type="number" domain={['dataMin', 'dataMax']} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} tickLine={false} axisLine={false} tickCount={6} />
//                                 <YAxis tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
//                                 <Tooltip content={<CustomTooltip />} />
                                
//                                 <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                                
//                                 {/* 🔥 1 SIGMA SHADED AREA (StockMock Style) 🔥 */}
//                                 <ReferenceArea x1={chartInfo.currentMarketSpot - chartInfo.oneSigmaMove} x2={chartInfo.currentMarketSpot + chartInfo.oneSigmaMove} fill="#e2e8f0" fillOpacity={0.4} />

//                                 {/* -1 Sigma Line */}
//                                 <ReferenceLine x={chartInfo.currentMarketSpot - chartInfo.oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '-1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
//                                 {/* +1 Sigma Line */}
//                                 <ReferenceLine x={chartInfo.currentMarketSpot + chartInfo.oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '+1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                                
//                                 {/* -2 Sigma Line (Visible in Zoom Out) */}
//                                 <ReferenceLine x={chartInfo.currentMarketSpot - (chartInfo.oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '-2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />
//                                 {/* +2 Sigma Line (Visible in Zoom Out) */}
//                                 <ReferenceLine x={chartInfo.currentMarketSpot + (chartInfo.oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '+2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />

//                                 {!isHovering && (
//                                     <ReferenceLine x={chartInfo.currentMarketSpot} stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" label={{ position: 'top', value: `Spot: ${chartInfo.currentMarketSpot}`, fill: '#1e293b', fontSize: 11, fontWeight: 'bold', offset: 10 }} />
//                                 )}

//                                 <Area type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={2.5} fill="url(#splitColor)" />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // ==========================================
// // 🛠️ EXISTING HELPERS
// // ==========================================
// const calculateLiveLtp = (leg) => {
//     if (!leg || !leg.entryPrice) return 0;
//     const qty = leg.quantity || 1; 
//     const pnl = leg.livePnl || 0;
//     return leg.action === 'BUY' ? leg.entryPrice + (pnl / qty) : leg.entryPrice - (pnl / qty);
// };

// const getLotsInfo = (leg, dep) => {
//     if (!leg.quantity) return { value: 0, type: 'Qty' };
//     let dbLotSize = null;
//     if (dep?.strategyId?.data?.instruments && Array.isArray(dep.strategyId.data.instruments)) {
//         const baseSymbol = String(leg.symbol).split(' ')[0]; 
//         const matchedInst = dep.strategyId.data.instruments.find(inst => inst.name && (baseSymbol.includes(inst.name) || inst.name.includes(baseSymbol)));
//         if (matchedInst && matchedInst.lot) {
//             dbLotSize = Number(matchedInst.lot);
//         } else if (dep.strategyId.data.instruments.length > 0 && dep.strategyId.data.instruments[0].lot) {
//             dbLotSize = Number(dep.strategyId.data.instruments[0].lot);
//         }
//     }
//     if (dbLotSize && dbLotSize > 0) {
//         const calculatedLots = leg.quantity / dbLotSize;
//         if (Number.isInteger(calculatedLots)) {
//             return { value: calculatedLots, type: calculatedLots > 1 ? 'Lots' : 'Lot' };
//         }
//     }
//     return { value: leg.quantity, type: 'Qty' };
// };

// // ==========================================
// // 🚀 MAIN TAB COMPONENT
// // ==========================================
// const DeployedStrategiesTab = () => {
//     const [deployments, setDeployments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [stoppingId, setStoppingId] = useState(null); 
//     const [livePnls, setLivePnls] = useState({});
//     const [liveSpots, setLiveSpots] = useState({}); 

//     useEffect(() => {
//         const loadDeployments = async () => {
//             try {
//                 const data = await fetchActiveDeployments();
//                 setDeployments(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Failed to fetch deployments:", error);
//                 setLoading(false);
//             }
//         };

//         loadDeployments();
//         const intervalId = setInterval(() => loadDeployments(), 2500); 
//         return () => clearInterval(intervalId);
//     }, []);

//     useEffect(() => {
//         const socket = io(`${import.meta.env.VITE_API_URL}`);
//         socket.on('live-pnl-update', (pnlData) => setLivePnls(pnlData)); 
//         socket.on('live-spot-update', (spotData) => {
//             if (spotData && spotData.symbol && spotData.ltp) {
//                 setLiveSpots(prev => ({ ...prev, [spotData.symbol]: spotData.ltp }));
//             }
//         });
//         return () => socket.disconnect();
//     }, []);

//     const handleStopAlgo = async (deploymentId) => {
//         if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
//             setStoppingId(deploymentId); 
//             try {
//                 await stopDeployment(deploymentId); 
//                 setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
//                 alert("Algo Stopped Successfully!");
//             } catch (error) {
//                 console.error("Failed to stop algo:", error);
//                 alert("Failed to stop algo. Please try again.");
//             } finally {
//                 setStoppingId(null); 
//             }
//         }
//     };

//     if (loading) return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;

//     if (deployments.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
//                 <AlertCircle size={48} className="text-gray-400 mb-4" />
//                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
//                 <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
//             </div>
//         );
//     }

//     const totalMTM = deployments.reduce((acc, dep) => {
//         let legSumPnl = 0;
//         if (dep.executedLegs && dep.executedLegs.length > 0) {
//             legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
//         }
//         const pnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;
//         return acc + parseFloat(pnl);
//     }, 0);

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {/* TOTAL MTM DASHBOARD */}
//             <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
//                 <div className="flex items-center gap-5">
//                     <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${totalMTM >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
//                         <Wallet size={28} />
//                     </div>
//                     <div>
//                         <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Live MTM</p>
//                         <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold transition-colors duration-300 tracking-tight ${totalMTM >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                             ₹ {totalMTM >= 0 ? `+${totalMTM.toFixed(2)}` : totalMTM.toFixed(2)}
//                         </h1>
//                     </div>
//                 </div>

//                 <div className="flex gap-4 w-full md:w-auto">
//                     <div className="flex-1 md:flex-none bg-gray-50 dark:bg-slate-900/50 px-6 py-4 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center transition-colors">
//                         <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5"><Activity size={12}/> Active Algos</p>
//                         <p className="text-2xl font-black text-gray-800 dark:text-white">{deployments.length}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* STRATEGY CARDS GRID */}
//            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {deployments.map((dep) => {
//                     const strategyName = dep.strategyId?.name || 'Unknown Strategy';
//                     const isLive = dep.executionType === 'LIVE';
//                     const isStopping = stoppingId === dep._id;

//                     let legSumPnl = 0;
//                     if (dep.executedLegs && dep.executedLegs.length > 0) {
//                         legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
//                     }
//                     const currentPnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;

//                     return (
//                         <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
//                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

//                             <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex-1">
//                                 <div className="flex justify-between items-start mb-3">
//                                     <div>
//                                         <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
//                                         <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
//                                             <PlayCircle size={12} className="text-green-500" />
//                                             Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                         </p>
//                                     </div>
//                                     <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
//                                         <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
//                                         {dep.executionType?.replace('_', ' ')}
//                                     </span>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4 mt-4">
//                                     <div className="bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
//                                         <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Multiplier</p>
//                                         <p className="text-sm font-black text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
//                                     </div>
//                                     <div className="bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
//                                         <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Target Time</p>
//                                         <p className="text-sm font-black text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
//                                     </div>
//                                 </div>

//                                 {/* INDIVIDUAL LEGS */}
//                                 {dep.executedLegs && dep.executedLegs.length > 0 && (
//                                     <div className="mt-5 space-y-2.5">
//                                         <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-2 border-b border-gray-100 dark:border-slate-700/50 pb-1">Positions</p>
//                                         {dep.executedLegs.map((leg, idx) => {
//                                             const legPnl = leg.livePnl || 0;
//                                             const isLegProfit = legPnl >= 0;
//                                             const isCompleted = leg.status === 'COMPLETED';
//                                             const liveLtp = calculateLiveLtp(leg);
//                                             const lotInfo = getLotsInfo(leg, dep);

//                                             return (
//                                                 <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border transition-all ${isCompleted ? 'bg-gray-100 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-slate-900/40 border-gray-100 dark:border-slate-700 shadow-sm'}`}>
//                                                     <div className="flex flex-col gap-1.5">
//                                                         <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 pr-2 flex items-center gap-2">
//                                                             <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${leg.action === 'BUY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>{leg.action}</span>
//                                                             <span className="font-bold tracking-wide">{leg.symbol}</span>
//                                                             <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded ml-1 tracking-wide shadow-sm">
//                                                                 {lotInfo.value} {lotInfo.type}
//                                                             </span>
//                                                         </span>
//                                                         <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
//                                                             <span>Entry: <span className="text-gray-700 dark:text-gray-300 font-bold">₹{leg.entryPrice?.toFixed(2) || '0.00'}</span></span>
//                                                             <span className="text-gray-300 dark:text-slate-600">|</span> 
//                                                             <span>LTP: <span className="text-blue-600 dark:text-blue-400 font-bold">₹{liveLtp.toFixed(2)}</span></span>
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex flex-col items-end gap-1">
//                                                         <span className={`text-xs font-black whitespace-nowrap px-2 py-0.5 rounded ${isLegProfit ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
//                                                             ₹ {isLegProfit ? `+${legPnl.toFixed(2)}` : legPnl.toFixed(2)}
//                                                         </span>
//                                                         {isCompleted && <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Closed</span>}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
                                        
//                                         {/* 🔥 PAYOFF CHART WITH DTE PROP 🔥 */}
//                                         {(() => {
//                                             let baseSymbol = "NIFTY";
//                                             if (dep.executedLegs && dep.executedLegs.length > 0) {
//                                                 baseSymbol = String(dep.executedLegs[0].symbol).split(' ')[0];
//                                             }
//                                             const currentLiveSpot = liveSpots[baseSymbol] || liveSpots[`${baseSymbol} 50`] || dep.sessionState?.entrySpotPrice;

//                                             return (
//                                                 <StrategyPayoffChart 
//                                                     legs={dep.executedLegs} 
//                                                     liveSpot={currentLiveSpot} 
//                                                     livePnl={currentPnl}
//                                                     marginBlocked={dep.marginBlocked} 
//                                                     tradeBoundaries={dep.sessionState?.tradeBoundaries}
//                                                     dte={dep.dte || 1} // 👈 Backend se DTE aana chahiye, warna default 1 maanega
//                                                 />
//                                             );
//                                         })()}

//                                     </div>
//                                 )}
//                             </div>

//                             <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900 mt-auto border-t border-gray-100 dark:border-slate-800">
//                                 <div>
//                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Live P&L</p>
//                                     <p className={`text-lg font-black flex items-center gap-1 transition-colors duration-300 ${currentPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                         ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
//                                     </p>
//                                 </div>
//                                 <button 
//                                     onClick={() => handleStopAlgo(dep._id)}
//                                     disabled={isStopping}
//                                     className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-extrabold rounded-xl shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:-translate-y-0.5 transition-all active:scale-95"
//                                 >
//                                     {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
//                                     {isStopping ? 'Stopping...' : 'Stop Algo'}
//                                 </button>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default DeployedStrategiesTab;





// import React, { useState, useEffect } from 'react';
// import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2, Wallet, TrendingUp, ChevronDown, ChevronUp, ZoomIn, ZoomOut } from 'lucide-react'; 
// import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService';
// import io from 'socket.io-client'; 
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

// // ==========================================
// // 🧠 BLACK-SCHOLES MATH ENGINE (FRONTEND)
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

// // Probability of Spot expiring ABOVE a certain target (K)
// const getProbAbove = (S, K, v, t) => {
//     if (t <= 0) return S > K ? 1 : 0;
//     const d2 = (Math.log(S / K) - (v * v / 2) * t) / (v * Math.sqrt(t));
//     return normalCDF(d2);
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
// // 📊 PAYOFF CHART COMPONENT (WITH POP & SIGMA LINES)
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

//     // 🔥 FIX 1: React ko API updates par confuse hone se rokne ke liye Strings banayein
//     const legsStr = JSON.stringify(legs || []);
//     const boundsStr = JSON.stringify(tradeBoundaries || {});

//     // 🧠 2. STATIC PAYOFF DATA (Ye area curve sirf tab banega jab strategy actually change hogi)
//     const chartBase = React.useMemo(() => {
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
//     }, [legsStr, boundsStr, isZoomed]); // 👈 Only recalculates if Trade Legs or Zoom changes

//     // 🧠 3. DYNAMIC LIVE DATA (Spot Line, IV, POP) - Ye fast update hoga bina chart tode
//     let currentMarketSpot = chartBase?.centerSpot || 0;
//     let exactPop = 0;
//     let oneSigmaMove = 0;

//     if (chartBase) {
//         currentMarketSpot = liveSpot ? Number(liveSpot) : chartBase.centerSpot;
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
//                         {/* 1. Est Margin */}
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Est. Margin</span>
//                             <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{formatShortMargin(marginBlocked)}</span>
//                         </div>
//                         {/* 2. Live P&L */}
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">P&L</span>
//                             <span className={`text-[11px] font-black ${livePnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹{livePnl ? livePnl.toFixed(2) : '0.00'}</span>
//                         </div>
//                         {/* 3. Max Profit */}
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Profit</span>
//                             <span className="text-[11px] font-black text-green-600 dark:text-green-400">
//                                 {chartBase.maxPnl > 0 ? `₹${chartBase.maxPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0'}
//                             </span>
//                         </div>
//                         {/* 4. Max Loss */}
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Loss</span>
//                             <span className="text-[11px] font-black text-red-600 dark:text-red-400">
//                                 {chartBase.isRiskUnlimited ? 'Undefined' : (chartBase.minPnl < 0 ? `₹${chartBase.minPnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '0')}
//                             </span>
//                         </div>
//                         {/* 5. POP */}
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">POP</span>
//                             <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{exactPop.toFixed(1)}%</span>
//                         </div>
//                         {/* 6. Net Premium */}
//                         <div className="flex flex-col">
//                             <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{chartBase.netPremium >= 0 ? 'Net Credit' : 'Net Debit'}</span>
//                             <span className={`text-[11px] font-black ${chartBase.netPremium >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹{Math.abs(chartBase.netPremium).toFixed(2)}</span>
//                         </div>
//                         {/* 7. Breakevens */}
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

//                         <ResponsiveContainer width="100%" height="100%">
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
//                                 <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                                
//                                 <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                                
//                                 <ReferenceArea x1={currentMarketSpot - oneSigmaMove} x2={currentMarketSpot + oneSigmaMove} fill="#e2e8f0" fillOpacity={0.4} isAnimationActive={false} />
//                                 <ReferenceLine x={currentMarketSpot - oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '-1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} isAnimationActive={false} />
//                                 <ReferenceLine x={currentMarketSpot + oneSigmaMove} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '+1σ', fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} isAnimationActive={false} />
//                                 <ReferenceLine x={currentMarketSpot - (oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '-2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} isAnimationActive={false} />
//                                 <ReferenceLine x={currentMarketSpot + (oneSigmaMove * 2)} stroke="#e2e8f0" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '+2σ', fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} isAnimationActive={false} />

//                                 <ReferenceLine 
//                                     x={currentMarketSpot} 
//                                     stroke="#475569" 
//                                     strokeWidth={1.5} 
//                                     strokeDasharray="4 4" 
//                                     label={{ position: 'top', value: `Spot: ${currentMarketSpot}`, fill: '#1e293b', fontSize: 11, fontWeight: 'bold', offset: 10 }} 
//                                     isAnimationActive={false} 
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

// // ==========================================
// // 🛠️ EXISTING HELPERS
// // ==========================================
// const calculateLiveLtp = (leg) => {
//     if (!leg || !leg.entryPrice) return 0;
//     const qty = leg.quantity || 1; 
//     const pnl = leg.livePnl || 0;
//     return leg.action === 'BUY' ? leg.entryPrice + (pnl / qty) : leg.entryPrice - (pnl / qty);
// };

// const getLotsInfo = (leg, dep) => {
//     if (!leg.quantity) return { value: 0, type: 'Qty' };
//     let dbLotSize = null;
//     if (dep?.strategyId?.data?.instruments && Array.isArray(dep.strategyId.data.instruments)) {
//         const baseSymbol = String(leg.symbol).split(' ')[0]; 
//         const matchedInst = dep.strategyId.data.instruments.find(inst => inst.name && (baseSymbol.includes(inst.name) || inst.name.includes(baseSymbol)));
//         if (matchedInst && matchedInst.lot) {
//             dbLotSize = Number(matchedInst.lot);
//         } else if (dep.strategyId.data.instruments.length > 0 && dep.strategyId.data.instruments[0].lot) {
//             dbLotSize = Number(dep.strategyId.data.instruments[0].lot);
//         }
//     }
//     if (dbLotSize && dbLotSize > 0) {
//         const calculatedLots = leg.quantity / dbLotSize;
//         if (Number.isInteger(calculatedLots)) {
//             return { value: calculatedLots, type: calculatedLots > 1 ? 'Lots' : 'Lot' };
//         }
//     }
//     return { value: leg.quantity, type: 'Qty' };
// };

// // ==========================================
// // 🚀 MAIN TAB COMPONENT
// // ==========================================
// const DeployedStrategiesTab = () => {
//     const [deployments, setDeployments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [stoppingId, setStoppingId] = useState(null); 
//     const [livePnls, setLivePnls] = useState({});
//     const [liveSpots, setLiveSpots] = useState({}); 

//     useEffect(() => {
//         const loadDeployments = async () => {
//             try {
//                 const data = await fetchActiveDeployments();
//                 setDeployments(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Failed to fetch deployments:", error);
//                 setLoading(false);
//             }
//         };

//         loadDeployments();
//         const intervalId = setInterval(() => loadDeployments(), 2500); 
//         return () => clearInterval(intervalId);
//     }, []);

//     useEffect(() => {
//         const socket = io(`${import.meta.env.VITE_API_URL}`);
//         socket.on('live-pnl-update', (pnlData) => setLivePnls(pnlData)); 
//         socket.on('live-spot-update', (spotData) => {
//             if (spotData && spotData.symbol && spotData.ltp) {
//                 // 🔥 FIX 1: Convert Symbol to UpperCase to avoid Case Mismatch
//                 setLiveSpots(prev => ({ ...prev, [String(spotData.symbol).toUpperCase()]: spotData.ltp }));
//             }
//         });
//         return () => socket.disconnect();
//     }, []);

//     const handleStopAlgo = async (deploymentId) => {
//         if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
//             setStoppingId(deploymentId); 
//             try {
//                 await stopDeployment(deploymentId); 
//                 setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
//                 alert("Algo Stopped Successfully!");
//             } catch (error) {
//                 console.error("Failed to stop algo:", error);
//                 alert("Failed to stop algo. Please try again.");
//             } finally {
//                 setStoppingId(null); 
//             }
//         }
//     };

//     if (loading) return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;

//     if (deployments.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
//                 <AlertCircle size={48} className="text-gray-400 mb-4" />
//                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
//                 <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
//             </div>
//         );
//     }

//     const totalMTM = deployments.reduce((acc, dep) => {
//         let legSumPnl = 0;
//         if (dep.executedLegs && dep.executedLegs.length > 0) {
//             legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
//         }
//         const pnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;
//         return acc + parseFloat(pnl);
//     }, 0);

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {/* TOTAL MTM DASHBOARD */}
//             <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
//                 <div className="flex items-center gap-5">
//                     <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${totalMTM >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
//                         <Wallet size={28} />
//                     </div>
//                     <div>
//                         <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Live MTM</p>
//                         <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold transition-colors duration-300 tracking-tight ${totalMTM >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                             ₹ {totalMTM >= 0 ? `+${totalMTM.toFixed(2)}` : totalMTM.toFixed(2)}
//                         </h1>
//                     </div>
//                 </div>

//                 <div className="flex gap-4 w-full md:w-auto">
//                     <div className="flex-1 md:flex-none bg-gray-50 dark:bg-slate-900/50 px-6 py-4 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center transition-colors">
//                         <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5"><Activity size={12}/> Active Algos</p>
//                         <p className="text-2xl font-black text-gray-800 dark:text-white">{deployments.length}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* STRATEGY CARDS GRID */}
//            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {deployments.map((dep) => {
//                     const strategyName = dep.strategyId?.name || 'Unknown Strategy';
//                     const isLive = dep.executionType === 'LIVE';
//                     const isStopping = stoppingId === dep._id;

//                     let legSumPnl = 0;
//                     if (dep.executedLegs && dep.executedLegs.length > 0) {
//                         legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
//                     }
//                     const currentPnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;

//                     return (
//                         <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
//                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

//                             <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex-1">
//                                 <div className="flex justify-between items-start mb-3">
//                                     <div>
//                                         <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
//                                         <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
//                                             <PlayCircle size={12} className="text-green-500" />
//                                             Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                         </p>
//                                     </div>
//                                     <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
//                                         <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
//                                         {dep.executionType?.replace('_', ' ')}
//                                     </span>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4 mt-4">
//                                     <div className="bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
//                                         <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Multiplier</p>
//                                         <p className="text-sm font-black text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
//                                     </div>
//                                     <div className="bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
//                                         <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Target Time</p>
//                                         <p className="text-sm font-black text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
//                                     </div>
//                                 </div>

//                                 {/* INDIVIDUAL LEGS */}
//                                 {dep.executedLegs && dep.executedLegs.length > 0 && (
//                                     <div className="mt-5 space-y-2.5">
//                                         <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-2 border-b border-gray-100 dark:border-slate-700/50 pb-1">Positions</p>
//                                         {dep.executedLegs.map((leg, idx) => {
//                                             const legPnl = leg.livePnl || 0;
//                                             const isLegProfit = legPnl >= 0;
//                                             const isCompleted = leg.status === 'COMPLETED';
//                                             const liveLtp = calculateLiveLtp(leg);
//                                             const lotInfo = getLotsInfo(leg, dep);

//                                             return (
//                                                 <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border transition-all ${isCompleted ? 'bg-gray-100 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-slate-900/40 border-gray-100 dark:border-slate-700 shadow-sm'}`}>
//                                                     <div className="flex flex-col gap-1.5">
//                                                         <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 pr-2 flex items-center gap-2">
//                                                             <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${leg.action === 'BUY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>{leg.action}</span>
//                                                             <span className="font-bold tracking-wide">{leg.symbol}</span>
//                                                             <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded ml-1 tracking-wide shadow-sm">
//                                                                 {lotInfo.value} {lotInfo.type}
//                                                             </span>
//                                                         </span>
//                                                         <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
//                                                             <span>Entry: <span className="text-gray-700 dark:text-gray-300 font-bold">₹{leg.entryPrice?.toFixed(2) || '0.00'}</span></span>
//                                                             <span className="text-gray-300 dark:text-slate-600">|</span> 
//                                                             <span>LTP: <span className="text-blue-600 dark:text-blue-400 font-bold">₹{liveLtp.toFixed(2)}</span></span>
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex flex-col items-end gap-1">
//                                                         <span className={`text-xs font-black whitespace-nowrap px-2 py-0.5 rounded ${isLegProfit ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
//                                                             ₹ {isLegProfit ? `+${legPnl.toFixed(2)}` : legPnl.toFixed(2)}
//                                                         </span>
//                                                         {isCompleted && <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Closed</span>}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
                                        
//                                         {/* 🔥 PAYOFF CHART WITH DTE PROP 🔥 */}
//                                         {(() => {
//                                             let baseSymbol = "NIFTY";
//                                             if (dep.executedLegs && dep.executedLegs.length > 0) {
//                                                 baseSymbol = String(dep.executedLegs[0].symbol).split(' ')[0].toUpperCase();
//                                             }

//                                             // 🔥 THE ULTIMATE FIX: Dhan Security ID + Text Name fallback 🔥
//                                             let spotSearchKey = baseSymbol;
//                                             let dhanSecurityId = "13"; // NIFTY 50 ka default ID
                                            
//                                             if (baseSymbol.includes("BANKNIFTY")) {
//                                                 spotSearchKey = "NIFTY BANK";
//                                                 dhanSecurityId = "25";
//                                             } else if (baseSymbol.includes("FINNIFTY")) {
//                                                 spotSearchKey = "NIFTY FIN SERVICE";
//                                                 dhanSecurityId = "27";
//                                             } else if (baseSymbol.includes("MIDCPNIFTY")) {
//                                                 spotSearchKey = "NIFTY MID SELECT";
//                                                 dhanSecurityId = "26";
//                                             } else if (baseSymbol.includes("SENSEX")) {
//                                                 spotSearchKey = "BSE SENSEX";
//                                                 dhanSecurityId = "51";
//                                             } else if (baseSymbol.includes("BANKEX")) {
//                                                 spotSearchKey = "BSE BANKEX";
//                                                 dhanSecurityId = "52";
//                                             } else if (baseSymbol.includes("NIFTY")) {
//                                                 spotSearchKey = "NIFTY 50";
//                                                 dhanSecurityId = "13";
//                                             }

//                                             // Live Spot check karega: Pehle ID (13), fir Name (NIFTY 50), aur last me Database
//                                             const currentLiveSpot = liveSpots[dhanSecurityId] || 
//                                                                     liveSpots[spotSearchKey] || 
//                                                                     liveSpots[baseSymbol] || 
//                                                                     dep.sessionState?.entrySpotPrice;

//                                             return (
//                                                 <StrategyPayoffChart
//                                                     legs={dep.executedLegs} 
//                                                     liveSpot={currentLiveSpot} 
//                                                     livePnl={currentPnl}
//                                                     marginBlocked={dep.marginBlocked} 
//                                                     tradeBoundaries={dep.sessionState?.tradeBoundaries}
//                                                     dte={dep.dte || 1} // 👈 Backend se DTE aana chahiye, warna default 1 maanega
//                                                 />
//                                             );
//                                         })()}

//                                     </div>
//                                 )}
//                             </div>

//                             <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900 mt-auto border-t border-gray-100 dark:border-slate-800">
//                                 <div>
//                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Live P&L</p>
//                                     <p className={`text-lg font-black flex items-center gap-1 transition-colors duration-300 ${currentPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                         ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
//                                     </p>
//                                 </div>
//                                 <button 
//                                     onClick={() => handleStopAlgo(dep._id)}
//                                     disabled={isStopping}
//                                     className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-extrabold rounded-xl shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:-translate-y-0.5 transition-all active:scale-95"
//                                 >
//                                     {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
//                                     {isStopping ? 'Stopping...' : 'Stop Algo'}
//                                 </button>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default DeployedStrategiesTab;




import React, { useState, useEffect } from 'react';
import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2, Wallet } from 'lucide-react'; 
import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService';
import io from 'socket.io-client'; 

// 🔥 NAYA IMPORT: Yahan dhyan dein ki path aapke folder structure ke hisab se sahi ho
import StrategyPayoffChart from './StrategyPayoffChart'; 

// ==========================================
// 🛠️ EXISTING HELPERS (UI me legs dikhane ke liye zaroori hain)
// ==========================================
const calculateLiveLtp = (leg) => {
    if (!leg || !leg.entryPrice) return 0;
    const qty = leg.quantity || 1; 
    const pnl = leg.livePnl || 0;
    return leg.action === 'BUY' ? leg.entryPrice + (pnl / qty) : leg.entryPrice - (pnl / qty);
};

const getLotsInfo = (leg, dep) => {
    if (!leg.quantity) return { value: 0, type: 'Qty' };
    let dbLotSize = null;
    if (dep?.strategyId?.data?.instruments && Array.isArray(dep.strategyId.data.instruments)) {
        const baseSymbol = String(leg.symbol).split(' ')[0]; 
        const matchedInst = dep.strategyId.data.instruments.find(inst => inst.name && (baseSymbol.includes(inst.name) || inst.name.includes(baseSymbol)));
        if (matchedInst && matchedInst.lot) {
            dbLotSize = Number(matchedInst.lot);
        } else if (dep.strategyId.data.instruments.length > 0 && dep.strategyId.data.instruments[0].lot) {
            dbLotSize = Number(dep.strategyId.data.instruments[0].lot);
        }
    }
    if (dbLotSize && dbLotSize > 0) {
        const calculatedLots = leg.quantity / dbLotSize;
        if (Number.isInteger(calculatedLots)) {
            return { value: calculatedLots, type: calculatedLots > 1 ? 'Lots' : 'Lot' };
        }
    }
    return { value: leg.quantity, type: 'Qty' };
};

// ==========================================
// 🚀 MAIN TAB COMPONENT
// ==========================================
const DeployedStrategiesTab = () => {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stoppingId, setStoppingId] = useState(null); 
    const [livePnls, setLivePnls] = useState({});
    const [liveSpots, setLiveSpots] = useState({}); 

    useEffect(() => {
        const loadDeployments = async () => {
            try {
                const data = await fetchActiveDeployments();
                setDeployments(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch deployments:", error);
                setLoading(false);
            }
        };

        loadDeployments();
        const intervalId = setInterval(() => loadDeployments(), 2500); 
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_API_URL}`);
        socket.on('live-pnl-update', (pnlData) => setLivePnls(pnlData)); 
        socket.on('live-spot-update', (spotData) => {
            if (spotData && spotData.symbol && spotData.ltp) {
                // 🔥 FIX: Convert Symbol to UpperCase to avoid Case Mismatch
                setLiveSpots(prev => ({ ...prev, [String(spotData.symbol).toUpperCase()]: spotData.ltp }));
            }
        });
        return () => socket.disconnect();
    }, []);

    const handleStopAlgo = async (deploymentId) => {
        if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
            setStoppingId(deploymentId); 
            try {
                await stopDeployment(deploymentId); 
                setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
                alert("Algo Stopped Successfully!");
            } catch (error) {
                console.error("Failed to stop algo:", error);
                alert("Failed to stop algo. Please try again.");
            } finally {
                setStoppingId(null); 
            }
        }
    };

    if (loading) return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;

    if (deployments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <AlertCircle size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
                <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
            </div>
        );
    }

    const totalMTM = deployments.reduce((acc, dep) => {
        let legSumPnl = 0;
        if (dep.executedLegs && dep.executedLegs.length > 0) {
            legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
        }
        const pnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;
        return acc + parseFloat(pnl);
    }, 0);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* TOTAL MTM DASHBOARD */}
            <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
                <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${totalMTM >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                        <Wallet size={28} />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Live MTM</p>
                        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold transition-colors duration-300 tracking-tight ${totalMTM >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            ₹ {totalMTM >= 0 ? `+${totalMTM.toFixed(2)}` : totalMTM.toFixed(2)}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-gray-50 dark:bg-slate-900/50 px-6 py-4 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center transition-colors">
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5"><Activity size={12}/> Active Algos</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-white">{deployments.length}</p>
                    </div>
                </div>
            </div>

            {/* STRATEGY CARDS GRID */}
           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {deployments.map((dep) => {
                    const strategyName = dep.strategyId?.name || 'Unknown Strategy';
                    const isLive = dep.executionType === 'LIVE';
                    const isStopping = stoppingId === dep._id;

                    let legSumPnl = 0;
                    if (dep.executedLegs && dep.executedLegs.length > 0) {
                        legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
                    }
                    const currentPnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;

                    return (
                        <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                            <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                                            <PlayCircle size={12} className="text-green-500" />
                                            Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                        {dep.executionType?.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
                                        <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Multiplier</p>
                                        <p className="text-sm font-black text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
                                        <p className="text-[10px] text-gray-500 mb-1 font-bold uppercase tracking-wider">Target Time</p>
                                        <p className="text-sm font-black text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
                                    </div>
                                </div>

                                {/* INDIVIDUAL LEGS */}
                                {dep.executedLegs && dep.executedLegs.length > 0 && (
                                    <div className="mt-5 space-y-2.5">
                                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-2 border-b border-gray-100 dark:border-slate-700/50 pb-1">Positions</p>
                                        {dep.executedLegs.map((leg, idx) => {
                                            const legPnl = leg.livePnl || 0;
                                            const isLegProfit = legPnl >= 0;
                                            const isCompleted = leg.status === 'COMPLETED';
                                            const liveLtp = calculateLiveLtp(leg);
                                            const lotInfo = getLotsInfo(leg, dep);

                                            return (
                                                <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border transition-all ${isCompleted ? 'bg-gray-100 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-slate-900/40 border-gray-100 dark:border-slate-700 shadow-sm'}`}>
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 pr-2 flex items-center gap-2">
                                                            <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${leg.action === 'BUY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>{leg.action}</span>
                                                            <span className="font-bold tracking-wide">{leg.symbol}</span>
                                                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded ml-1 tracking-wide shadow-sm">
                                                                {lotInfo.value} {lotInfo.type}
                                                            </span>
                                                        </span>
                                                        <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
                                                            <span>Entry: <span className="text-gray-700 dark:text-gray-300 font-bold">₹{leg.entryPrice?.toFixed(2) || '0.00'}</span></span>
                                                            <span className="text-gray-300 dark:text-slate-600">|</span> 
                                                            <span>LTP: <span className="text-blue-600 dark:text-blue-400 font-bold">₹{liveLtp.toFixed(2)}</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`text-xs font-black whitespace-nowrap px-2 py-0.5 rounded ${isLegProfit ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                                                            ₹ {isLegProfit ? `+${legPnl.toFixed(2)}` : legPnl.toFixed(2)}
                                                        </span>
                                                        {isCompleted && <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Closed</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* 🔥 ISOLATED PAYOFF CHART COMPONENT 🔥 */}
                                        {(() => {
                                            let baseSymbol = "NIFTY";
                                            if (dep.executedLegs && dep.executedLegs.length > 0) {
                                                baseSymbol = String(dep.executedLegs[0].symbol).split(' ')[0].toUpperCase();
                                            }

                                            let spotSearchKey = baseSymbol;
                                            let dhanSecurityId = "13"; 
                                            
                                            if (baseSymbol.includes("BANKNIFTY")) {
                                                spotSearchKey = "NIFTY BANK";
                                                dhanSecurityId = "25";
                                            } else if (baseSymbol.includes("FINNIFTY")) {
                                                spotSearchKey = "NIFTY FIN SERVICE";
                                                dhanSecurityId = "27";
                                            } else if (baseSymbol.includes("MIDCPNIFTY")) {
                                                spotSearchKey = "NIFTY MID SELECT";
                                                dhanSecurityId = "26";
                                            } else if (baseSymbol.includes("SENSEX")) {
                                                spotSearchKey = "BSE SENSEX";
                                                dhanSecurityId = "51";
                                            } else if (baseSymbol.includes("BANKEX")) {
                                                spotSearchKey = "BSE BANKEX";
                                                dhanSecurityId = "52";
                                            } else if (baseSymbol.includes("NIFTY")) {
                                                spotSearchKey = "NIFTY 50";
                                                dhanSecurityId = "13";
                                            }

                                            const currentLiveSpot = liveSpots[dhanSecurityId] || 
                                                                    liveSpots[spotSearchKey] || 
                                                                    liveSpots[baseSymbol] || 
                                                                    dep.sessionState?.entrySpotPrice;

                                            return (
                                                <StrategyPayoffChart
                                                    legs={dep.executedLegs} 
                                                    liveSpot={currentLiveSpot} 
                                                    livePnl={currentPnl}
                                                    marginBlocked={dep.marginBlocked} 
                                                    tradeBoundaries={dep.sessionState?.tradeBoundaries}
                                                    dte={dep.dte || 1} 
                                                />
                                            );
                                        })()}

                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900 mt-auto border-t border-gray-100 dark:border-slate-800">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Live P&L</p>
                                    <p className={`text-lg font-black flex items-center gap-1 transition-colors duration-300 ${currentPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleStopAlgo(dep._id)}
                                    disabled={isStopping}
                                    className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-extrabold rounded-xl shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
                                    {isStopping ? 'Stopping...' : 'Stop Algo'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeployedStrategiesTab;