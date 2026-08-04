import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Zap, Clock, TrendingUp, TrendingDown, RefreshCcw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ReportTab = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('Live'); 
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [expandedStrategy, setExpandedStrategy] = useState(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  const fetchReports = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 
      const response = await axios.get(`${apiUrl}/api/deployments/reports/summary`, {
        params: { startDate, endDate, mode: viewMode } 
      });

      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error("❌ Reports fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    setExpandedStrategy(null); 
  }, [startDate, endDate, viewMode]);

  const toggleAccordion = (index) => {
    setExpandedStrategy(expandedStrategy === index ? null : index);
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!timeStr || timeStr === "--:--:--") return "-";
    let formattedDate = "";
    if (dateStr) {
      const d = new Date(dateStr);
      const day = d.getDate();
      const month = d.toLocaleString('en-US', { month: 'short' });
      formattedDate = `${day} ${month}, `;
    }
    const shortTime = timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
    return `(${formattedDate}${shortTime})`;
  };

  const getExitTypeColor = (exitType) => {
    const type = (exitType || "").toUpperCase();
    if (type.includes("TARGET") || type.includes("MAX PROFIT")) return "text-emerald-600 dark:text-emerald-400";
    if (type.includes("STOPLOSS") || type.includes("MAX LOSS")) return "text-rose-600 dark:text-rose-400";
    if (type.includes("TRAILING SL") || type.includes("MOVE SL TO COST")) return "text-blue-600 dark:text-blue-400";
    return "text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      
      {/* TOP FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
            <div className="flex-1 flex items-center justify-between sm:justify-start gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-2 sm:px-3 py-1.5 shadow-inner min-w-[220px]">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-xs sm:text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none w-full" />
                <span className="text-gray-400 shrink-0">→</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-xs sm:text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none w-full text-right sm:text-left" />
            </div>
            <button onClick={fetchReports} className="shrink-0 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-blue-600 transition-colors">
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-full border border-gray-200 dark:border-slate-800 self-start md:self-auto shrink-0">
          {[
            { label: 'Live', value: 'Live' },
            { label: 'Forward', value: 'Forward' }
          ].map(mode => (
            <button 
              key={mode.value} 
              onClick={() => setViewMode(mode.value)} 
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === mode.value ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              Calculating Metrics...
          </div>
      ) : reportData ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-4 sm:px-5 py-6 flex items-center gap-3 sm:gap-4 transition-all">
                <div className={`shrink-0 p-3 rounded-lg ${reportData.totalPnl >= 0 ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
                  {reportData.totalPnl >= 0 ? <TrendingUp size={20} className="sm:w-6 sm:h-6"/> : <TrendingDown size={20} className="sm:w-6 sm:h-6"/>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Total P&L</p>
                  <p className={`text-lg sm:text-xl font-extrabold mt-0.5 truncate ${reportData.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} title={`₹ ${reportData.totalPnl.toFixed(2)}`}>
                    ₹ {reportData.totalPnl.toFixed(2)}
                  </p>
                </div>
              </div>
              <MiniCard title="Win Rate" value={`${reportData.winRate}%`} icon={Target} color="text-blue-600" />
              <MiniCard title="Total Trades" value={reportData.totalTrades} icon={Zap} color="text-yellow-600" />
              <MiniCard title="Max Drawdown" value={`₹ ${Math.abs(reportData.maxLoss).toFixed(2)}`} icon={Clock} color="text-purple-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Strategy Breakdown (Trades)</p>
                {reportData.strategyData && reportData.strategyData.length > 0 ? (
                  <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                    <div className="w-full md:w-1/2 space-y-4">
                        {reportData.strategyData.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="w-3 h-3 shrink-0 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                              <span className="font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]" title={entry.name}>{entry.name}</span>
                            </div>
                            <span className="font-extrabold text-gray-900 dark:text-white">{entry.trades}</span>
                          </div>
                        ))}
                    </div>
                    <div className="w-full md:w-1/2 h-48 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                          <Pie data={reportData.strategyData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="trades" nameKey="name">
                              {reportData.strategyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value, name) => [`${value} Trades`, name]} />
                          </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
                    No trades found.
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Day-wise P&L</p>
                {reportData.dailyData && reportData.dailyData.length > 0 ? (
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} width={55} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹ ${value.toFixed(2)}`, 'Net P&L']} />
                        <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={40}>
                            {reportData.dailyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
                    No daily data found.
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-100 dark:border-slate-800">
                            <tr>
                                <th scope="col" className="px-5 py-4 w-10"></th> 
                                <th scope="col" className="px-5 py-4 whitespace-nowrap">Strategy Name</th>
                                <th scope="col" className="px-5 py-4 text-center">Trades</th>
                                <th scope="col" className="px-5 py-4 text-center">Wins</th>
                                <th scope="col" className="px-5 py-4 text-center">Losses</th>
                                <th scope="col" className="px-5 py-4 text-right whitespace-nowrap">Net P&L</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                          {reportData.strategyData && reportData.strategyData.length > 0 ? (
                            reportData.strategyData.map((stat, idx) => (
                              <React.Fragment key={idx}>
                                <tr 
                                  onClick={() => toggleAccordion(idx)}
                                  className={`hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${expandedStrategy === idx ? 'bg-gray-50 dark:bg-slate-800/30' : ''}`}
                                >
                                  <td className="px-5 py-4 text-gray-400">
                                    {expandedStrategy === idx ? <ChevronUp size={18} className="text-blue-600" /> : <ChevronDown size={18} />}
                                  </td>
                                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                                    <div className="flex items-center gap-2">
                                      <span className="truncate max-w-[120px] sm:max-w-xs block" title={stat.name}>{stat.name}</span>
                                      
                                      {/* 🔥 FIX 1: Removed N/A issue */}
                                      <span className="font-medium text-[10px] text-gray-500 uppercase bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded whitespace-nowrap shrink-0 border border-gray-200 dark:border-slate-700">
                                        {stat.segment && stat.segment !== "N/A" ? stat.segment : "OPTION"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-5 py-4 text-center font-medium">{stat.trades}</td>
                                  <td className="px-5 py-4 text-center text-green-600 dark:text-green-400 font-bold">{stat.wins}</td>
                                  <td className="px-5 py-4 text-center text-red-500 font-bold">{stat.losses}</td>
                                  <td className={`px-5 py-4 text-right font-extrabold whitespace-nowrap ${stat.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {stat.pnl >= 0 ? "+" : "-"}₹{Math.abs(stat.pnl).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                </tr>

                                {expandedStrategy === idx && stat.tradesList && stat.tradesList.length > 0 && (
                                  <tr>
                                    <td colSpan="6" className="p-0 border-none bg-gray-50/50 dark:bg-slate-950/50">
                                      <div className="px-3 sm:px-8 py-4 animate-in slide-in-from-top-2 duration-200 overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[650px]">
                                          <thead>
                                            <tr className="text-[10px] text-gray-500 dark:text-gray-500 uppercase border-b border-gray-200 dark:border-slate-700">
                                              <th className="pb-2 px-3 font-bold">Symbol</th>
                                              <th className="pb-2 px-3 font-bold">Action</th>
                                              <th className="pb-2 px-3 font-bold text-center">Qty</th>
                                              <th className="pb-2 px-3 font-bold">Entry</th>
                                              <th className="pb-2 px-3 font-bold">Exit</th>
                                              <th className="pb-2 px-3 font-bold text-right">P&L</th>
                                              <th className="pb-2 px-3 font-bold text-right">Exit Type</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            
                                            {/* 🔥 FIX 2, 3, 4: Mapping inside executedLegs array properly */}
                                            {/* 🔥 FIX 2, 3, 4: Mapping inside executedLegs array properly */}
                                            {stat.tradesList.flatMap((trade, tIdx) => {
                                                const legs = trade.executedLegs && trade.executedLegs.length > 0 ? trade.executedLegs : [trade];
                                                
                                                // 🟢 Background color logic: Har pair (trade) ka background fix rahega
                                                const rowColor = tIdx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-100 dark:bg-slate-950/200";

                                                return legs.map((leg, lIdx) => {
                                                    const sym = leg.symbol || leg.tradedSymbol || stat.name;
                                                    const txn = leg.action || leg.tradeAction || "BUY";
                                                    const qty = leg.quantity || leg.tradedQty || "-";
                                                    
                                                    const entP = leg.entryPrice ? leg.entryPrice.toFixed(2) : "-";
                                                    const pnl = leg.livePnl !== undefined ? leg.livePnl : (leg.pnl || trade.pnl || 0);

                                                    let calculatedExitPrice = leg.exitPrice;
                                                    if (!calculatedExitPrice && pnl !== 0 && leg.entryPrice && qty !== "-") {
                                                        calculatedExitPrice = txn.toUpperCase() === "BUY" 
                                                            ? leg.entryPrice + (pnl / Number(qty))
                                                            : leg.entryPrice - (pnl / Number(qty));
                                                    }

                                                    const extP = calculatedExitPrice ? Math.max(0, calculatedExitPrice).toFixed(2) : "-";
                                                    const eType = leg.exitReason || leg.exitRemarks || trade.exitRemarks || "SQUAREOFF";
                                                    const dateStr = trade.createdAt || trade.date; 

                                                    // 🛡️ Safe time extraction
                                                    const entryTime = leg.entryTime || trade.entryTime || "";
                                                    const exitTime = leg.exitTime || trade.exitTime || "";

                                                    return (
                                                        <tr key={`${tIdx}-${lIdx}`} className={`${rowColor} border-b border-gray-200 dark:border-slate-800/30 last:border-0 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors`}>
                                                            <td className="py-3 px-3">
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{sym}</p>
                                                            </td>
                                                            <td className="py-3 px-3">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap
                                                                    ${txn.toUpperCase() === "BUY" 
                                                                        ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20"
                                                                        : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-500 border-rose-200 dark:border-rose-500/20"
                                                                    }`}>
                                                                    {txn.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-3 text-sm text-center font-bold text-gray-700 dark:text-gray-300">{qty}</td>
                                                            <td className="py-3 px-3 whitespace-nowrap">
                                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                                    {entP !== "-" ? `₹${entP}` : "-"} 
                                                                    <span className="text-[10px] font-medium text-gray-500 ml-1">{formatDateTime(dateStr, entryTime)}</span>
                                                                </p>
                                                            </td>
                                                            <td className="py-3 px-3 whitespace-nowrap">
                                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                                    {extP !== "-" ? `₹${extP}` : "-"} 
                                                                    <span className="text-[10px] font-medium text-gray-500 ml-1">{formatDateTime(dateStr, exitTime)}</span>
                                                                </p>
                                                            </td>
                                                            <td className={`py-3 px-3 text-right font-bold text-sm whitespace-nowrap ${pnl >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                                                                {pnl >= 0 ? "+" : "-"}₹{Math.abs(pnl).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </td>
                                                            <td className="py-3 px-3 text-right whitespace-nowrap">
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${getExitTypeColor(eType)}`}>
                                                                    {eType.replace(/_/g, ' ')}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                            })}
                                            
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-10 text-gray-400 text-sm italic">
                                No completed deployments found for the selected mode.
                              </td>
                            </tr>
                          )}
                        </tbody>
                    </table>
                </div>
            </div>

          </>
      ) : (
          <div className="text-center py-16 text-gray-400 italic text-sm">No report data available.</div>
      )}
    </div>
  );
};

const MiniCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-4 sm:px-5 py-6 flex items-center gap-3 sm:gap-4 transition-all">
        <div className={`shrink-0 p-2 sm:p-3 rounded-md ${color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon size={20} className={`${color} sm:w-5 sm:h-5`} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate" title={title}>{title}</p>
            <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mt-0.5 truncate" title={value}>{value}</p>
        </div>
    </div>
);

export default ReportTab;