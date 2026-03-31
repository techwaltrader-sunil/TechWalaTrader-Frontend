
import React, { useState } from 'react';
import { History } from 'lucide-react';
import ReportTab from '../../components/algoComponents/Reports/ReportTab';
import TradeEngineLogsTab from '../../components/algoComponents/Reports/TradeEngineLogsTab';

const Reports = () => {
  // ✅ TAB STATE: 'report' ya 'logs'
  const [activeTab, setActiveTab] = useState('report');

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <History className="text-blue-600 dark:text-blue-500" size={28} />
            Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Analyze your algorithmic trading performance and execution logs.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors overflow-hidden">
        
        {/* ✅ TABS NAVIGATION */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 px-6 pt-4">
            <button 
                onClick={() => setActiveTab('report')}
                className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'report' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
                Report
            </button>
            <button 
                onClick={() => setActiveTab('logs')}
                className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'logs' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
                Trade Engine Logs
            </button>
        </div>

        {/* ✅ DYNAMIC COMPONENT RENDERING */}
        <div className="p-6">
            {activeTab === 'report' ? <ReportTab /> : <TradeEngineLogsTab />}
        </div>
        
      </div>
    </div>
  );
};

export default Reports;


// import React, { useState, useEffect } from 'react';
// import { History, Search, Filter, Download, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
// import { getAlgoLogs } from '../../data/AlogoTrade/brokerService'; // API function import kiya

// const Reports = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ 1. FETCH REAL DATA FROM BACKEND
//   useEffect(() => {
//     const fetchLogs = async () => {
//         setLoading(true);
//         const data = await getAlgoLogs();
//         setLogs(data);
//         setLoading(false);
//     };
//     fetchLogs();
//   }, []);

//   // ✅ 2. DATE & TIME FORMATTING HELPER
//   const formatTime = (dateString) => {
//       return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//   };
//   const formatDate = (dateString) => {
//       return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };

//   return (
//     <div className="space-y-6 p-6 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
//       {/* --- PAGE HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
//             <History className="text-blue-600 dark:text-blue-500" size={28} />
//             Trade Logs
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//             Real-time execution history of your algorithmic strategies.
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button className="bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
//             <Filter size={18} /> Filters
//           </button>
//           <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95">
//             <Download size={18} /> Export CSV
//           </button>
//         </div>
//       </div>

//       {/* --- SEARCH BAR --- */}
//       <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm transition-colors">
//         <div className="relative w-full md:w-96">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search by Symbol, Strategy, or Order ID..."
//             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
//           />
//         </div>
//         <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
//           <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer shadow-md">All Trades</span>
//           <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer border border-red-200 dark:border-red-500/20">Rejected / Failed</span>
//         </div>
//       </div>

//       {/* --- DATA TABLE --- */}
//       <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-lg transition-colors">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-slate-700 transition-colors">
//               <tr>
//                 <th className="px-6 py-4 font-medium">Time / Order ID</th>
//                 <th className="px-6 py-4 font-medium">Symbol</th>
//                 <th className="px-6 py-4 font-medium">Broker</th>
//                 <th className="px-6 py-4 font-medium text-center">Action</th>
//                 <th className="px-6 py-4 font-medium text-right">Price & Qty</th>
//                 <th className="px-6 py-4 font-medium text-center">Status</th>
//                 <th className="px-6 py-4 font-medium text-right">Net P&L</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50 transition-colors">
              
//               {loading ? (
//                 <tr>
//                     <td colSpan="7" className="text-center py-10 text-gray-500">Loading Trade Logs...</td>
//                 </tr>
//               ) : logs.length === 0 ? (
//                 <tr>
//                     <td colSpan="7" className="text-center py-10 text-gray-500">No algorithm trades executed yet.</td>
//                 </tr>
//               ) : (
//                 logs.map((log) => (
//                     <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all text-sm group">
                    
//                     {/* Time & ID */}
//                     <td className="px-6 py-4">
//                         <p className="text-gray-900 dark:text-white font-medium flex items-center gap-1.5">
//                         <Clock size={14} className="text-gray-400 dark:text-gray-500" /> {formatTime(log.createdAt)}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                             {log.orderId && log.orderId !== "N/A" ? log.orderId : "N/A"} • {formatDate(log.createdAt)}
//                         </p>
//                     </td>

//                     {/* Symbol */}
//                     <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{log.symbol}</td>

//                     {/* Broker Name (Pehle yahan Strategy tha) */}
//                     <td className="px-6 py-4">
//                         <span className="bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 transition-colors">
//                         {log.brokerName || "Webhook Algo"}
//                         </span>
//                     </td>

//                     {/* Action (BUY/SELL) */}
//                     <td className="px-6 py-4 text-center">
//                         {log.action === 'BUY' ? (
//                         <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-md font-bold text-xs border border-green-200 dark:border-green-500/20">
//                             <ArrowUpRight size={14} /> BUY
//                         </span>
//                         ) : (
//                         <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-md font-bold text-xs border border-red-200 dark:border-red-500/20">
//                             <ArrowDownRight size={14} /> SELL
//                         </span>
//                         )}
//                     </td>

//                     {/* Price & Qty */}
//                     <td className="px-6 py-4 text-right">
//                         {/* Dhan me MARKET order gaya hai isliye price exact tab tak nahi aayega jab tak hum dobara API call na karein. */}
//                         <p className="text-gray-900 dark:text-white font-bold text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded inline-block">MARKET</p>
//                         <p className="text-xs text-gray-500 mt-1">Qty: {log.quantity}</p>
//                     </td>

//                     {/* Status */}
//                     <td className="px-6 py-4 text-center">
//                         {log.status === 'SUCCESS' ? (
//                         <span className="text-green-600 dark:text-green-400 flex justify-center"><CheckCircle2 size={18} /></span>
//                         ) : (
//                         <div className="flex flex-col items-center group relative cursor-help">
//                             <span className="text-red-600 dark:text-red-400"><XCircle size={18} /></span>
//                             {/* Tooltip for Rejected Reason */}
//                             <div className="absolute bottom-full mb-2 hidden group-hover:block bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 max-w-xs truncate overflow-hidden">
//                             {log.message || "Order Failed"}
//                             </div>
//                         </div>
//                         )}
//                     </td>

//                     {/* P&L */}
//                     <td className="px-6 py-4 text-right font-bold text-gray-400 italic">
//                         N/A
//                     </td>

//                     </tr>
//                 ))
//               )}

//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Reports;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
// import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

// const Reports = () => {
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   // Date states (Default: Today)
//   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

//   // Donut Chart Colors
//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

//   // 📡 Backend se Data Fetch karne ka function
//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       // NOTE: Apna actual backend URL yahan daalein ya .env use karein
//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 
//       const response = await axios.get(`${apiUrl}/api/reports/summary`, {
//         params: { startDate, endDate }
//       });

//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch reports:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Jab bhi page load ho ya Date change ho, data fetch karo
//   useEffect(() => {
//     fetchReports();
//   }, [startDate, endDate]);

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      
//       {/* 📅 TOP FILTER BAR */}
//       <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between border border-gray-200 dark:border-slate-700">
//         <div className="flex items-center gap-4">
//           <div>
//             <label className="text-xs text-gray-500 font-bold uppercase">From</label>
//             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
//           </div>
//           <div>
//             <label className="text-xs text-gray-500 font-bold uppercase">To</label>
//             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
//           </div>
//         </div>
//         <button onClick={fetchReports} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all">
//           Get Reports
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : reportData ? (
//         <>
//           {/* 📊 1. TOP METRICS CARDS */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <MetricCard title="Total P&L" value={`₹ ${reportData.totalPnl.toFixed(2)}`} isPositive={reportData.totalPnl >= 0} icon={reportData.totalPnl >= 0 ? TrendingUp : TrendingDown} />
//             <MetricCard title="Win Rate" value={`${reportData.winRate}%`} icon={Target} color="text-blue-500" />
//             <MetricCard title="Total Trades" value={reportData.totalTrades} icon={Activity} color="text-purple-500" />
//             <MetricCard title="Max Drawdown" value={`₹ ${reportData.maxLoss.toFixed(2)}`} isPositive={false} icon={TrendingDown} />
//           </div>

//           {/* 📈 2. CHARTS SECTION */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
//             {/* Donut Chart: Strategy Breakdown */}
//             <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
//               <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 self-start">Strategy Breakdown (Trades)</h3>
//               {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                 <div className="w-full h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie data={reportData.strategyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="trades" nameKey="name">
//                         {reportData.strategyData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip formatter={(value, name) => [`${value} Trades`, name]} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">No data available</div>
//               )}
//             </div>

//             {/* Empty Box for Future Bar Chart */}
//             <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
//                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 self-start w-full">Day-wise P&L (Coming Soon)</h3>
//                <div className="text-gray-400 text-sm border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg w-full h-full flex items-center justify-center">
//                   Bar Chart Space
//                </div>
//             </div>
//           </div>

//           {/* 📋 3. DEEP DIVE TABLE */}
//           <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
//             <div className="p-4 border-b border-gray-200 dark:border-slate-700">
//               <h3 className="text-sm font-bold text-gray-800 dark:text-white">Detailed Strategy Performance</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                 <thead className="bg-gray-50 dark:bg-slate-900/50 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
//                   <tr>
//                     <th className="px-4 py-3">Strategy Name</th>
//                     <th className="px-4 py-3">Segment</th>
//                     <th className="px-4 py-3 text-center">Trades</th>
//                     <th className="px-4 py-3 text-center text-green-600">Wins</th>
//                     <th className="px-4 py-3 text-center text-red-500">Losses</th>
//                     <th className="px-4 py-3 text-right">Net P&L</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
//                   {reportData.strategyData && reportData.strategyData.length > 0 ? (
//                     reportData.strategyData.map((stat, idx) => (
//                       <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
//                         <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{stat.name}</td>
//                         <td className="px-4 py-3">{stat.segment}</td>
//                         <td className="px-4 py-3 text-center">{stat.trades}</td>
//                         <td className="px-4 py-3 text-center text-green-600">{stat.wins}</td>
//                         <td className="px-4 py-3 text-center text-red-500">{stat.losses}</td>
//                         <td className={`px-4 py-3 text-right font-bold ${stat.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                           ₹ {stat.pnl.toFixed(2)}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr><td colSpan="6" className="text-center py-6 text-gray-400">No strategies found for selected dates.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       ) : null}
//     </div>
//   );
// };

// // 🃏 Chhota Metric Card Component (UI ko saaf rakhne ke liye)
// const MetricCard = ({ title, value, isPositive, icon: Icon, color }) => {
//   const textColor = isPositive === true ? 'text-green-600 dark:text-green-400' : isPositive === false ? 'text-red-600 dark:text-red-400' : color || 'text-gray-800 dark:text-white';
  
//   return (
//     <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
//       <div className={`p-3 rounded-lg bg-opacity-10 dark:bg-opacity-20 ${textColor.split(' ')[0].replace('text-', 'bg-')}`}>
//         <Icon size={24} className={textColor} />
//       </div>
//       <div>
//         <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
//         <p className={`text-lg font-bold mt-0.5 ${textColor}`}>{value}</p>
//       </div>
//     </div>
//   );
// };

// export default Reports;