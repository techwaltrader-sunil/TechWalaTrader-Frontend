// import React, { useState } from 'react';

// const ReportTab = () => {
//   // Filters State
//   const [fromDate, setFromDate] = useState('2026-02-22');
//   const [toDate, setToDate] = useState('2026-02-22');
//   const [broker, setBroker] = useState('All');

//   return (
//     <div className="animate-in fade-in duration-300 space-y-6">
//         {/* FILTERS ROW */}
//         <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50">
//             <div className="flex flex-wrap items-center gap-4">
//                 <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">From</span>
//                     <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">To</span>
//                     <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Select Broker</span>
//                     <select value={broker} onChange={(e)=>setBroker(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 min-w-[120px]">
//                         <option value="All">All</option>
//                         <option value="Dhan">Dhan</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="flex items-center gap-3">
//                 <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-1 flex">
//                     <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Live</button>
//                     <button className="px-4 py-1.5 text-xs font-bold rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Forward</button>
//                 </div>
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95">
//                     Get Reports
//                 </button>
//             </div>
//         </div>

//         {/* STRATEGY BREAKDOWN CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] relative">
//                 <h3 className="absolute top-4 left-6 text-sm font-bold text-gray-700 dark:text-gray-300">Strategy Breakdown</h3>
//                 <div className="relative w-48 h-48 mt-4">
//                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//                         <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="15" className="text-gray-100 dark:text-slate-800" />
//                         <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="251.2" className="text-gray-300 dark:text-slate-700 transition-all duration-1000 ease-out" />
//                     </svg>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
//                         <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total P&L</span>
//                         <span className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹ 0.00</span>
//                     </div>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-6">No data</p>
//             </div>

//             <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
//                 <p className="text-sm text-gray-400">No data</p>
//             </div>
//         </div>

//         <p className="text-center text-sm text-gray-400 mt-4">No strategies found.</p>
//     </div>
//   );
// };

// export default ReportTab;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Target, Zap, Clock, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// const ReportTab = () => {
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('Live'); // 'Live' or 'Forward'
  
//   // 📅 Dates (Default: Today)
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

//   // Donut Chart Colors
//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

//   // 📡 1. Backend API se Data Fetch karna (Exactly matching old logic)
//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       // NOTE: Apna actual backend URL yahan daalein ya .env use karein
//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

//       // const response = await axios.get(`${apiUrl}/api/reports/summary`, {
//       //   params: { startDate, endDate }
//       // });

//       // Isko badal kar aisa kar dijiye (deployments add kar dijiye):
//       const response = await axios.get(`${apiUrl}/api/deployments/reports/summary`, {
//         params: { startDate, endDate }
//       });

//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error("❌ Reports fetch failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📅 Jab Date change ho, data fetch karo
//   useEffect(() => {
//     fetchReports();
//   }, [startDate, endDate]);

//   return (
//     <div className="space-y-6">
      
//       {/* --- ✅ 1. TOP FILTER BAR (Integrated Style - matching old design) --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
        
//         {/* Date Selectors */}
//         <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
//                 <input 
//                     type="date" 
//                     value={startDate} 
//                     onChange={(e) => setStartDate(e.target.value)} 
//                     className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none"
//                 />
//                 <span className="text-gray-400">→</span>
//                 <input 
//                     type="date" 
//                     value={endDate} 
//                     onChange={(e) => setEndDate(e.target.value)} 
//                     className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none"
//                 />
//             </div>
//             <button onClick={fetchReports} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-blue-600 transition-colors">
//                 <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
//             </button>
//         </div>

//         {/* Live/Forward Toggle (matching old design) */}
//         <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-full border border-gray-200 dark:border-slate-800">
//           {['Live', 'Forward'].map(mode => (
//             <button key={mode} onClick={() => setViewMode(mode)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>{mode}</button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//           <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
//               Calculating Metrics...
//           </div>
//       ) : reportData ? (
//           <>
//             {/* --- ✅ 2. METRICS GRID (matching old design) --- */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
//               {/* Total P&L Card */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-5 py-6 flex items-center gap-4 transition-all">
//                 <div className={`p-3 rounded-lg ${reportData.totalPnl >= 0 ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
//                   {reportData.totalPnl >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total P&L</p>
//                   <p className={`text-xl font-extrabold mt-0.5 ${reportData.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹ {reportData.totalPnl.toFixed(2)}</p>
//                 </div>
//               </div>

//               <MiniCard title="Win Rate" value={`${reportData.winRate}%`} icon={Target} color="text-blue-600" />
//               <MiniCard title="Total Trades" value={reportData.totalTrades} icon={Zap} color="text-yellow-600" />
//               <MiniCard title="Max Drawdown" value={`₹ ${Math.abs(reportData.maxLoss).toFixed(2)}`} icon={Clock} color="text-purple-600" />
//             </div>

//             {/* --- ✅ 3. CHARTS SECTION (keeping integrated placeholder design) --- */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               {/* Strategy Breakdown Donut */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Strategy Breakdown (Trades)</p>
//                 {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                   <div className="w-full h-56 flex items-center justify-center">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                         <Pie data={reportData.strategyData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="trades" nameKey="name">
//                             {reportData.strategyData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value, name) => [`${value} Trades`, name]} />
//                         </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 ) : (
//                   <div className="w-full h-56 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     No trades found.
//                   </div>
//                 )}
//               </div>

//               {/* Bar Chart Placeholder (as in old design) */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Day-wise P&L (Coming Soon)</p>
//                 <div className="w-full h-56 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     Bar Chart Area
//                 </div>
//               </div>
//             </div>

//             {/* --- ✅ 4. TABLE SECTION (matching old integrated design) --- */}
//             <div className="border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//                         <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400 font-bold">
//                             <tr>
//                                 <th scope="col" className="px-5 py-3.5">Strategy Name</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Trades</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Wins</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Losses</th>
//                                 <th scope="col" className="px-5 py-3.5 text-right">Net P&L</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
//                           {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                             reportData.strategyData.map((stat, idx) => (
//                               <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
//                                 <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{stat.name} <span className="font-medium text-xs text-gray-400">({stat.segment})</span></td>
//                                 <td className="px-5 py-4 text-center font-medium">{stat.trades}</td>
//                                 <td className="px-5 py-4 text-center text-green-600 dark:text-green-400 font-bold">{stat.wins}</td>
//                                 <td className="px-5 py-4 text-center text-red-500 font-bold">{stat.losses}</td>
//                                 <td className={`px-5 py-4 text-right font-extrabold ${stat.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                   ₹ {stat.pnl.toFixed(2)}
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="5" className="text-center py-10 text-gray-400 text-sm italic">
//                                 No completed deployments found for the selected dates.
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//           </>
//       ) : (
//           <div className="text-center py-16 text-gray-400 italic text-sm">No report data available.</div>
//       )}
//     </div>
//   );
// };

// // 🃏 Mini Metric Card (matching old integrated style)
// const MiniCard = ({ title, value, icon: Icon, color }) => (
//     <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5 flex items-center gap-3">
//         <div className={`p-2 rounded-md ${color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10 dark:bg-opacity-20`}>
//             <Icon size={18} className={`${color}`} />
//         </div>
//         <div>
//             <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
//             <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
//         </div>
//     </div>
// );

// export default ReportTab;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Target, Zap, Clock, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// const ReportTab = () => {
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('Live'); // 'Live' or 'Forward'
  
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 
//       const response = await axios.get(`${apiUrl}/api/deployments/reports/summary`, {
//         // 🎯 FIX 3: API ko viewMode bheja jaa raha hai (Live/Forward)
//         params: { startDate, endDate, mode: viewMode } 
//       });

//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error("❌ Reports fetch failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🎯 FIX 3: viewMode change hone par API dubara call hogi
//   useEffect(() => {
//     fetchReports();
//   }, [startDate, endDate, viewMode]); 

//   return (
//     <div className="space-y-6">
      
//       {/* TOP FILTER BAR */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
//         <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
//                 <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
//                 <span className="text-gray-400">→</span>
//                 <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
//             </div>
//             <button onClick={fetchReports} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-blue-600 transition-colors">
//                 <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
//             </button>
//         </div>

//         <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-full border border-gray-200 dark:border-slate-800">
//           {['Live', 'Forward'].map(mode => (
//             <button key={mode} onClick={() => setViewMode(mode)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}>{mode}</button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//           <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
//               Calculating Metrics...
//           </div>
//       ) : reportData ? (
//           <>
//             {/* METRICS GRID */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-5 py-6 flex items-center gap-4 transition-all">
//                 <div className={`p-3 rounded-lg ${reportData.totalPnl >= 0 ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
//                   {reportData.totalPnl >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total P&L</p>
//                   <p className={`text-xl font-extrabold mt-0.5 ${reportData.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹ {reportData.totalPnl.toFixed(2)}</p>
//                 </div>
//               </div>
//               <MiniCard title="Win Rate" value={`${reportData.winRate}%`} icon={Target} color="text-blue-600" />
//               <MiniCard title="Total Trades" value={reportData.totalTrades} icon={Zap} color="text-yellow-600" />
//               <MiniCard title="Max Drawdown" value={`₹ ${Math.abs(reportData.maxLoss).toFixed(2)}`} icon={Clock} color="text-purple-600" />
//             </div>

//             {/* CHARTS SECTION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               {/* 🎯 FIX 1: Strategy Breakdown with List (Trade Type Mix jaisa) */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Strategy Breakdown (Trades)</p>
//                 {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                   <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                    
//                     {/* Left Side: Strategy List with Counts */}
//                     <div className="w-full md:w-1/2 space-y-4">
//                         {reportData.strategyData.map((entry, index) => (
//                           <div key={index} className="flex items-center justify-between text-sm">
//                             <div className="flex items-center gap-3">
//                               <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
//                               <span className="font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]" title={entry.name}>{entry.name}</span>
//                             </div>
//                             <span className="font-extrabold text-gray-900 dark:text-white">{entry.trades}</span>
//                           </div>
//                         ))}
//                     </div>

//                     {/* Right Side: Donut Chart */}
//                     <div className="w-full md:w-1/2 h-48 flex items-center justify-center">
//                       <ResponsiveContainer width="100%" height="100%">
//                           <PieChart>
//                           <Pie data={reportData.strategyData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="trades" nameKey="name">
//                               {reportData.strategyData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                               ))}
//                           </Pie>
//                           <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value, name) => [`${value} Trades`, name]} />
//                           </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     No trades found.
//                   </div>
//                 )}
//               </div>

//               {/* 🎯 FIX 2: Day-wise P&L Bar Chart */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Day-wise P&L</p>
//                 {reportData.dailyData && reportData.dailyData.length > 0 ? (
//                   <div className="w-full h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={reportData.dailyData}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
//                         <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
//                         <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} width={55} />
//                         <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹ ${value.toFixed(2)}`, 'Net P&L']} />
//                         <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={40}>
//                             {reportData.dailyData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.fill} />
//                             ))}
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 ) : (
//                   <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     No daily data found.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* TABLE SECTION */}
//             <div className="border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//                         <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400 font-bold">
//                             <tr>
//                                 <th scope="col" className="px-5 py-3.5">Strategy Name</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Trades</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Wins</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Losses</th>
//                                 <th scope="col" className="px-5 py-3.5 text-right">Net P&L</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
//                           {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                             reportData.strategyData.map((stat, idx) => (
//                               <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
//                                 <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{stat.name} <span className="font-medium text-xs text-gray-400">({stat.segment})</span></td>
//                                 <td className="px-5 py-4 text-center font-medium">{stat.trades}</td>
//                                 <td className="px-5 py-4 text-center text-green-600 dark:text-green-400 font-bold">{stat.wins}</td>
//                                 <td className="px-5 py-4 text-center text-red-500 font-bold">{stat.losses}</td>
//                                 <td className={`px-5 py-4 text-right font-extrabold ${stat.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                   ₹ {stat.pnl.toFixed(2)}
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="5" className="text-center py-10 text-gray-400 text-sm italic">
//                                 No completed deployments found for the selected mode.
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//           </>
//       ) : (
//           <div className="text-center py-16 text-gray-400 italic text-sm">No report data available.</div>
//       )}
//     </div>
//   );
// };

// const MiniCard = ({ title, value, icon: Icon, color }) => (
//     <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5 flex items-center gap-3">
//         <div className={`p-2 rounded-md ${color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10 dark:bg-opacity-20`}>
//             <Icon size={18} className={`${color}`} />
//         </div>
//         <div>
//             <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
//             <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
//         </div>
//     </div>
// );

// export default ReportTab;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Target, Zap, Clock, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// const ReportTab = () => {
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('LIVE'); // 'Live' or 'Forward'
  
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 
//       const response = await axios.get(`${apiUrl}/api/deployments/reports/summary`, {
//         // 🎯 FIX 3: API ko viewMode bheja jaa raha hai (Live/Forward)
//         params: { startDate, endDate, mode: viewMode } 
//       });

//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error("❌ Reports fetch failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🎯 FIX 3: viewMode change hone par API dubara call hogi
//   useEffect(() => {
//     fetchReports();
//   }, [startDate, endDate, viewMode]); 

//   return (
//     <div className="space-y-6">
      
//       {/* TOP FILTER BAR */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
//         <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
//                 <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
//                 <span className="text-gray-400">→</span>
//                 <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
//             </div>
//             <button onClick={fetchReports} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-blue-600 transition-colors">
//                 <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
//             </button>
//         </div>

//         <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-full border border-gray-200 dark:border-slate-800">
//           {/* 🔥 THE FIX: UI me label dikhega, par API ko asli 'value' jayegi */}
//           {[
//             { label: 'Live', value: 'LIVE' },
//             { label: 'Forward', value: 'FORWARD_TEST' }
//           ].map(mode => (
//             <button 
//               key={mode.value} 
//               onClick={() => setViewMode(mode.value)} 
//               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === mode.value ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}
//             >
//               {mode.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//           <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
//               Calculating Metrics...
//           </div>
//       ) : reportData ? (
//           <>
//             {/* METRICS GRID */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-5 py-6 flex items-center gap-4 transition-all">
//                 <div className={`p-3 rounded-lg ${reportData.totalPnl >= 0 ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
//                   {reportData.totalPnl >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total P&L</p>
//                   <p className={`text-xl font-extrabold mt-0.5 ${reportData.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹ {reportData.totalPnl.toFixed(2)}</p>
//                 </div>
//               </div>
//               <MiniCard title="Win Rate" value={`${reportData.winRate}%`} icon={Target} color="text-blue-600" />
//               <MiniCard title="Total Trades" value={reportData.totalTrades} icon={Zap} color="text-yellow-600" />
//               <MiniCard title="Max Drawdown" value={`₹ ${Math.abs(reportData.maxLoss).toFixed(2)}`} icon={Clock} color="text-purple-600" />
//             </div>

//             {/* CHARTS SECTION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               {/* 🎯 FIX 1: Strategy Breakdown with List (Trade Type Mix jaisa) */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Strategy Breakdown (Trades)</p>
//                 {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                   <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                    
//                     {/* Left Side: Strategy List with Counts */}
//                     <div className="w-full md:w-1/2 space-y-4">
//                         {reportData.strategyData.map((entry, index) => (
//                           <div key={index} className="flex items-center justify-between text-sm">
//                             <div className="flex items-center gap-3">
//                               <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
//                               <span className="font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]" title={entry.name}>{entry.name}</span>
//                             </div>
//                             <span className="font-extrabold text-gray-900 dark:text-white">{entry.trades}</span>
//                           </div>
//                         ))}
//                     </div>

//                     {/* Right Side: Donut Chart */}
//                     <div className="w-full md:w-1/2 h-48 flex items-center justify-center">
//                       <ResponsiveContainer width="100%" height="100%">
//                           <PieChart>
//                           <Pie data={reportData.strategyData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="trades" nameKey="name">
//                               {reportData.strategyData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                               ))}
//                           </Pie>
//                           <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value, name) => [`${value} Trades`, name]} />
//                           </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     No trades found.
//                   </div>
//                 )}
//               </div>

//               {/* 🎯 FIX 2: Day-wise P&L Bar Chart */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Day-wise P&L</p>
//                 {reportData.dailyData && reportData.dailyData.length > 0 ? (
//                   <div className="w-full h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={reportData.dailyData}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
//                         <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
//                         <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} width={55} />
//                         <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹ ${value.toFixed(2)}`, 'Net P&L']} />
//                         <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={40}>
//                             {reportData.dailyData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.fill} />
//                             ))}
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 ) : (
//                   <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     No daily data found.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* TABLE SECTION */}
//             <div className="border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//                         <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400 font-bold">
//                             <tr>
//                                 <th scope="col" className="px-5 py-3.5">Strategy Name</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Trades</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Wins</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Losses</th>
//                                 <th scope="col" className="px-5 py-3.5 text-right">Net P&L</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
//                           {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                             reportData.strategyData.map((stat, idx) => (
//                               <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
//                                 <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{stat.name} <span className="font-medium text-xs text-gray-400">({stat.segment})</span></td>
//                                 <td className="px-5 py-4 text-center font-medium">{stat.trades}</td>
//                                 <td className="px-5 py-4 text-center text-green-600 dark:text-green-400 font-bold">{stat.wins}</td>
//                                 <td className="px-5 py-4 text-center text-red-500 font-bold">{stat.losses}</td>
//                                 <td className={`px-5 py-4 text-right font-extrabold ${stat.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                   ₹ {stat.pnl.toFixed(2)}
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="5" className="text-center py-10 text-gray-400 text-sm italic">
//                                 No completed deployments found for the selected mode.
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//           </>
//       ) : (
//           <div className="text-center py-16 text-gray-400 italic text-sm">No report data available.</div>
//       )}
//     </div>
//   );
// };

// const MiniCard = ({ title, value, icon: Icon, color }) => (
//     <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5 flex items-center gap-3">
//         <div className={`p-2 rounded-md ${color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10 dark:bg-opacity-20`}>
//             <Icon size={18} className={`${color}`} />
//         </div>
//         <div>
//             <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
//             <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
//         </div>
//     </div>
// );

// export default ReportTab;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Target, Zap, Clock, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// const ReportTab = () => {
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // 🔥 THE BUG FIX 1: Default state ko 'Live' set kiya (Title case me, backend se match karne ke liye)
//   const [viewMode, setViewMode] = useState('Live'); 
  
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 
//       const response = await axios.get(`${apiUrl}/api/deployments/reports/summary`, {
//         // API ko viewMode bheja jaa raha hai ('Live' ya 'Forward')
//         params: { startDate, endDate, mode: viewMode } 
//       });

//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error("❌ Reports fetch failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [startDate, endDate, viewMode]); 

//   return (
//     <div className="space-y-6">
      
//       {/* TOP FILTER BAR */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
//         <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
//                 <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
//                 <span className="text-gray-400">→</span>
//                 <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
//             </div>
//             <button onClick={fetchReports} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-blue-600 transition-colors">
//                 <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
//             </button>
//         </div>

//         <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-full border border-gray-200 dark:border-slate-800">
//           {/* 🔥 THE BUG FIX 2: Values ko strictly Backend query ('Live', 'Forward') se match kara diya */}
//           {[
//             { label: 'Live', value: 'Live' },
//             { label: 'Forward', value: 'Forward' }
//           ].map(mode => (
//             <button 
//               key={mode.value} 
//               onClick={() => setViewMode(mode.value)} 
//               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === mode.value ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}
//             >
//               {mode.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//           <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
//               Calculating Metrics...
//           </div>
//       ) : reportData ? (
//           <>
//             {/* METRICS GRID */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-5 py-6 flex items-center gap-4 transition-all">
//                 <div className={`p-3 rounded-lg ${reportData.totalPnl >= 0 ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
//                   {reportData.totalPnl >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total P&L</p>
//                   <p className={`text-xl font-extrabold mt-0.5 ${reportData.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹ {reportData.totalPnl.toFixed(2)}</p>
//                 </div>
//               </div>
//               <MiniCard title="Win Rate" value={`${reportData.winRate}%`} icon={Target} color="text-blue-600" />
//               <MiniCard title="Total Trades" value={reportData.totalTrades} icon={Zap} color="text-yellow-600" />
//               <MiniCard title="Max Drawdown" value={`₹ ${Math.abs(reportData.maxLoss).toFixed(2)}`} icon={Clock} color="text-purple-600" />
//             </div>

//             {/* CHARTS SECTION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Strategy Breakdown (Trades)</p>
//                 {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                   <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                    
//                     {/* Left Side: Strategy List with Counts */}
//                     <div className="w-full md:w-1/2 space-y-4">
//                         {reportData.strategyData.map((entry, index) => (
//                           <div key={index} className="flex items-center justify-between text-sm">
//                             <div className="flex items-center gap-3">
//                               <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
//                               <span className="font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]" title={entry.name}>{entry.name}</span>
//                             </div>
//                             <span className="font-extrabold text-gray-900 dark:text-white">{entry.trades}</span>
//                           </div>
//                         ))}
//                     </div>

//                     {/* Right Side: Donut Chart */}
//                     <div className="w-full md:w-1/2 h-48 flex items-center justify-center">
//                       <ResponsiveContainer width="100%" height="100%">
//                           <PieChart>
//                           <Pie data={reportData.strategyData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="trades" nameKey="name">
//                               {reportData.strategyData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                               ))}
//                           </Pie>
//                           <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value, name) => [`${value} Trades`, name]} />
//                           </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     No trades found.
//                   </div>
//                 )}
//               </div>

//               {/* Day-wise P&L Bar Chart */}
//               <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5">
//                 <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Day-wise P&L</p>
//                 {reportData.dailyData && reportData.dailyData.length > 0 ? (
//                   <div className="w-full h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={reportData.dailyData}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
//                         <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
//                         <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} width={55} />
//                         <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹ ${value.toFixed(2)}`, 'Net P&L']} />
//                         <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={40}>
//                             {reportData.dailyData.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.fill} />
//                             ))}
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 ) : (
//                   <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 text-sm">
//                     No daily data found.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* TABLE SECTION */}
//             <div className="border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
//                         <thead className="text-xs uppercase bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400 font-bold">
//                             <tr>
//                                 <th scope="col" className="px-5 py-3.5">Strategy Name</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Trades</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Wins</th>
//                                 <th scope="col" className="px-5 py-3.5 text-center">Losses</th>
//                                 <th scope="col" className="px-5 py-3.5 text-right">Net P&L</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
//                           {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                             reportData.strategyData.map((stat, idx) => (
//                               <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
//                                 <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{stat.name} <span className="font-medium text-xs text-gray-400">({stat.segment})</span></td>
//                                 <td className="px-5 py-4 text-center font-medium">{stat.trades}</td>
//                                 <td className="px-5 py-4 text-center text-green-600 dark:text-green-400 font-bold">{stat.wins}</td>
//                                 <td className="px-5 py-4 text-center text-red-500 font-bold">{stat.losses}</td>
//                                 <td className={`px-5 py-4 text-right font-extrabold ${stat.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                   ₹ {stat.pnl.toFixed(2)}
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="5" className="text-center py-10 text-gray-400 text-sm italic">
//                                 No completed deployments found for the selected mode.
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//           </>
//       ) : (
//           <div className="text-center py-16 text-gray-400 italic text-sm">No report data available.</div>
//       )}
//     </div>
//   );
// };

// const MiniCard = ({ title, value, icon: Icon, color }) => (
//     <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5 flex items-center gap-3">
//         <div className={`p-2 rounded-md ${color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10 dark:bg-opacity-20`}>
//             <Icon size={18} className={`${color}`} />
//         </div>
//         <div>
//             <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
//             <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
//         </div>
//     </div>
// );

// export default ReportTab;


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
  
  // Kis strategy ka accordion khula hai usko track karne ke liye
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
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
                <span className="text-gray-400">→</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none focus:ring-0 p-0 border-none" />
            </div>
            <button onClick={fetchReports} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-blue-600 transition-colors">
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-full border border-gray-200 dark:border-slate-800">
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
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-5 py-6 flex items-center gap-4 transition-all">
                <div className={`p-3 rounded-lg ${reportData.totalPnl >= 0 ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
                  {reportData.totalPnl >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total P&L</p>
                  <p className={`text-xl font-extrabold mt-0.5 ${reportData.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>₹ {reportData.totalPnl.toFixed(2)}</p>
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
                              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
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
                                <th scope="col" className="px-5 py-4">Strategy Name</th>
                                <th scope="col" className="px-5 py-4 text-center">Trades</th>
                                <th scope="col" className="px-5 py-4 text-center">Wins</th>
                                <th scope="col" className="px-5 py-4 text-center">Losses</th>
                                <th scope="col" className="px-5 py-4 text-right">Net P&L</th>
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
                                    {stat.name} <span className="font-medium text-[10px] text-gray-400 uppercase ml-1 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">{stat.segment}</span>
                                  </td>
                                  <td className="px-5 py-4 text-center font-medium">{stat.trades}</td>
                                  <td className="px-5 py-4 text-center text-green-600 dark:text-green-400 font-bold">{stat.wins}</td>
                                  <td className="px-5 py-4 text-center text-red-500 font-bold">{stat.losses}</td>
                                  <td className={`px-5 py-4 text-right font-extrabold ${stat.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {stat.pnl >= 0 ? "+" : "-"}₹{Math.abs(stat.pnl).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                </tr>

                                {expandedStrategy === idx && stat.tradesList && stat.tradesList.length > 0 && (
                                  <tr>
                                    <td colSpan="6" className="p-0 border-none bg-gray-50/50 dark:bg-slate-950/50">
                                      <div className="px-8 py-4 animate-in slide-in-from-top-2 duration-200">
                                        <table className="w-full text-left border-collapse">
                                          <thead>
                                            <tr className="text-[10px] text-gray-500 dark:text-gray-500 uppercase border-b border-gray-200 dark:border-slate-700">
                                              <th className="pb-2 font-bold pl-2">Symbol</th>
                                              <th className="pb-2 font-bold">Action</th>
                                              <th className="pb-2 font-bold">Qty</th>
                                              <th className="pb-2 font-bold">Entry</th>
                                              <th className="pb-2 font-bold">Exit</th>
                                              <th className="pb-2 font-bold text-right">P&L</th>
                                              <th className="pb-2 font-bold text-right pr-2">Exit Type</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {stat.tradesList.map((trade, tIdx) => {
                                              const sym = trade.tradedSymbol || trade.symbol || stat.name;
                                              const txn = trade.tradeAction || trade.transaction || "BUY";
                                              const qty = trade.tradedQty || trade.quantity || "-";
                                              const entP = trade.entryPrice ? trade.entryPrice.toFixed(2) : "-";
                                              const extP = trade.exitPrice ? trade.exitPrice.toFixed(2) : "-";
                                              const pnl = trade.realizedPnl || trade.pnl || 0;
                                              const eType = trade.exitRemarks || trade.exitType || "SQUAREOFF";
                                              const dateStr = trade.date || trade.createdAt; 
                                              
                                              return (
                                                <tr key={tIdx} className="border-b border-gray-200 dark:border-slate-800/30 last:border-0 hover:bg-gray-100 dark:hover:bg-slate-900/50 transition-colors">
                                                  <td className="py-2.5 pl-2">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{sym}</p>
                                                  </td>
                                                  <td className="py-2.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border 
                                                        ${txn.toUpperCase() === "BUY"
                                                          ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20"
                                                          : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-500 border-rose-200 dark:border-rose-500/20"
                                                        }`}
                                                    >
                                                      {txn.toUpperCase()}
                                                    </span>
                                                  </td>
                                                  <td className="py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300">{qty}</td>
                                                  <td className="py-2.5">
                                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                      ₹{entP} <span className="text-[10px] font-medium text-gray-500 block sm:inline mt-1 sm:mt-0">{formatDateTime(dateStr, trade.entryTime)}</span>
                                                    </p>
                                                  </td>
                                                  <td className="py-2.5">
                                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                      ₹{extP} <span className="text-[10px] font-medium text-gray-500 block sm:inline mt-1 sm:mt-0">{formatDateTime(dateStr, trade.exitTime)}</span>
                                                    </p>
                                                  </td>
                                                  <td className={`py-2.5 text-right font-bold text-sm ${pnl >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                                                    {pnl >= 0 ? "+" : "-"}₹{Math.abs(pnl).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                  </td>
                                                  <td className="py-2.5 text-right pr-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${getExitTypeColor(eType)}`}>
                                                      {eType.replace('_', ' ')}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
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
    <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-5 flex items-center gap-3">
        <div className={`p-2 rounded-md ${color.replace('text-', 'bg-').split(' ')[0]} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon size={18} className={`${color}`} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        </div>
    </div>
);

export default ReportTab;