
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