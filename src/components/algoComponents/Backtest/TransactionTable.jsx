// import React, { useState, useMemo } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   ArrowLeft,
//   ArrowRight,
//   ExternalLink,
// } from "lucide-react";

// const TransactionTable = ({ transactions }) => {
//   const [expandedDate, setExpandedDate] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // --- 1. DATA GROUPING LOGIC ---
//   const groupedData = useMemo(() => {
//     if (!transactions) return [];

//     const groups = {};
//     transactions.forEach((trade) => {
//       const dateKey = trade.date;
//       if (!groups[dateKey]) {
//         groups[dateKey] = {
//           date: dateKey,
//           totalPnL: 0,
//           trades: [],
//         };
//       }
//       groups[dateKey].totalPnL += trade.pnl;
//       groups[dateKey].trades.push(trade);
//     });

//     return Object.values(groups).sort((a, b) => {
//       const [d1, m1, y1] = a.date.split("/");
//       const [d2, m2, y2] = b.date.split("/");
//       return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
//     });
//   }, [transactions]);

//   // --- 2. PAGINATION LOGIC ---
//   const totalPages = Math.ceil(groupedData.length / itemsPerPage);
//   const currentData = groupedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   const toggleAccordion = (date) => {
//     setExpandedDate(expandedDate === date ? null : date);
//   };

//   const fmt = (num) => `₹${Math.abs(num).toLocaleString("en-IN")}`;

//   return (
//     // ✅ Main Container: Light (White) | Dark (Slate-900)
//     <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg flex flex-col transition-colors duration-300">
//       {/* --- HEADER --- */}
//       <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 transition-colors">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//             Transaction Details
//           </h2>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//             Daily trade breakdown and logs
//           </p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-blue-500/20 active:scale-95">
//           <FileText size={16} /> Export to PDF
//         </button>
//       </div>

//       {/* --- TABLE CONTENT --- */}
//       <div className="flex-1 overflow-x-auto">
//         <div className="min-w-[800px]">
//           {currentData.map((group) => (
//             <div
//               key={group.date}
//               className="border-b border-gray-200 dark:border-slate-800 last:border-0 transition-colors"
//             >
//               {/* A. PARENT ROW (Summary) */}
//               <div
//                 onClick={() => toggleAccordion(group.date)}
//                 className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50 
//                             ${expandedDate === group.date ? "bg-gray-50 dark:bg-slate-800/30" : "bg-white dark:bg-slate-900"}
//                         `}
//               >
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`p-2 rounded-full transition-colors ${expandedDate === group.date ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"}`}
//                   >
//                     {expandedDate === group.date ? (
//                       <ChevronUp size={18} />
//                     ) : (
//                       <ChevronDown size={18} />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-gray-900 dark:text-white">
//                       {group.date}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-500">
//                       {group.trades.length} Trades Executed
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-6">
//                   <div className="text-right">
//                     <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold">
//                       Net P&L
//                     </p>
//                     <p
//                       className={`text-base font-bold ${group.totalPnL >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}
//                     >
//                       {group.totalPnL >= 0 ? "+" : "-"}
//                       {fmt(group.totalPnL)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* B. EXPANDED CONTENT (Nested Table) */}
//               {expandedDate === group.date && (
//                 <div className="bg-gray-50 dark:bg-slate-950/50 border-t border-gray-200 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 duration-300">
//                   <table className="w-full text-left border-collapse">
//                     <thead>
//                       <tr className="text-[10px] text-gray-500 dark:text-gray-500 uppercase border-b border-gray-200 dark:border-slate-800/50">
//                         <th className="pb-2 font-bold pl-2">Symbol</th>
//                         <th className="pb-2 font-bold">Transaction</th>
//                         <th className="pb-2 font-bold">Quantity</th>
//                         <th className="pb-2 font-bold">Entry</th>
//                         <th className="pb-2 font-bold">Exit</th>
//                         <th className="pb-2 font-bold text-right">P&L</th>
//                         <th className="pb-2 font-bold text-right pr-2">
//                           Exit Type
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {group.trades.map((trade, idx) => (
//                         <tr
//                           key={idx}
//                           className="border-b border-gray-200 dark:border-slate-800/30 last:border-0 hover:bg-gray-100 dark:hover:bg-slate-900/50 transition-colors"
//                         >
//                           {/* Symbol */}
//                           <td className="py-3 pl-2">
//                             <p className="text-sm font-bold text-gray-900 dark:text-white">
//                               {trade.symbol}
//                             </p>
//                             <p className="text-[10px] text-gray-500 dark:text-gray-500">
//                               Weekly Expiry
//                             </p>
//                           </td>

//                           {/* Transaction Type */}
//                           <td className="py-3">
//                             <span
//                               className={`px-2 py-0.5 rounded text-[10px] font-bold border 
//                                                     ${
//                                                       trade.pnl >= 0
//                                                         ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20"
//                                                         : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-500 border-rose-200 dark:border-rose-500/20"
//                                                     }`}
//                             >
//                               {trade.pnl >= 0 ? "BUY" : "SELL"}
//                             </span>
//                           </td>

//                           {/* Quantity */}
//                           <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
//                             {trade.details?.quantity || 50}
//                           </td>

//                           {/* Entry */}
//                           <td className="py-3">
//                             <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
//                               ₹{trade.entryPrice}
//                             </p>
//                             <p className="text-[10px] text-gray-500 dark:text-gray-500">
//                               {trade.details?.entryTime || "09:15:00"}
//                             </p>
//                           </td>

//                           {/* Exit */}
//                           <td className="py-3">
//                             <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
//                               ₹{trade.exitPrice}
//                             </p>
//                             <p className="text-[10px] text-gray-500 dark:text-gray-500">
//                               {trade.details?.exitTime || "15:30:00"}
//                             </p>
//                           </td>

//                           {/* P&L */}
//                           <td
//                             className={`py-3 text-right font-bold text-sm ${trade.pnl >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}
//                           >
//                             {trade.pnl >= 0 ? "+" : "-"}
//                             {fmt(trade.pnl)}
//                           </td>

//                           {/* Exit Type */}
//                           <td className="py-3 text-right pr-2">
//                             <a
//                               href="#"
//                               className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-end gap-1 transition-colors"
//                             >
//                               M2M_SQUAREOFF <ExternalLink size={10} />
//                             </a>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           ))}

//           {groupedData.length === 0 && (
//             <div className="p-8 text-center text-gray-500 dark:text-gray-500">
//               No transactions found.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* --- FOOTER (PAGINATION) --- */}
//       <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center transition-colors">
//         <p className="text-xs text-gray-500 dark:text-gray-400">
//           Showing{" "}
//           <span className="font-bold text-gray-900 dark:text-white">
//             {(currentPage - 1) * itemsPerPage + 1}
//           </span>{" "}
//           -{" "}
//           <span className="font-bold text-gray-900 dark:text-white">
//             {Math.min(currentPage * itemsPerPage, groupedData.length)}
//           </span>{" "}
//           of{" "}
//           <span className="font-bold text-gray-900 dark:text-white">
//             {groupedData.length}
//           </span>
//         </p>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <ArrowLeft size={16} />
//           </button>

//           <div className="flex gap-1">
//             {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors 
//                             ${
//                               currentPage === i + 1
//                                 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
//                                 : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
//                             }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionTable;



// import React, { useState, useMemo } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   ArrowLeft,
//   ArrowRight,
//   ExternalLink,
// } from "lucide-react";

// const TransactionTable = ({ transactions }) => {
//   const [expandedDate, setExpandedDate] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // --- 1. DATA GROUPING LOGIC (✅ FIXED SORTING & DATE FORMAT) ---
//   const groupedData = useMemo(() => {
//     if (!transactions) return [];

//     const groups = {};
//     transactions.forEach((trade) => {
//       const originalDate = trade.date; // e.g. "YYYY-MM-DD"
      
//       if (!groups[originalDate]) {
//         // Indian Format DD/MM/YY banayenge display ke liye
//         const [year, month, day] = originalDate.split("-");
//         const displayDate = `${day}/${month}/${year.slice(-2)}`;

//         groups[originalDate] = {
//           rawDate: originalDate, // Sorting ke liye YYYY-MM-DD use karenge
//           date: displayDate,     // UI me DD/MM/YY dikhayenge
//           totalPnL: 0,
//           trades: [],
//         };
//       }
//       groups[originalDate].totalPnL += trade.pnl;
//       groups[originalDate].trades.push(trade);
//     });

//     // ✅ FIXED: Descending Sort (Latest date upar aayegi)
//     return Object.values(groups).sort((a, b) => {
//       if (a.rawDate < b.rawDate) return 1;
//       if (a.rawDate > b.rawDate) return -1;
//       return 0;
//     });
//   }, [transactions]);

//   // --- 2. PAGINATION LOGIC ---
//   const totalPages = Math.ceil(groupedData.length / itemsPerPage);
//   const currentData = groupedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   const toggleAccordion = (dateKey) => {
//     setExpandedDate(expandedDate === dateKey ? null : dateKey);
//   };

//   const fmt = (num) => `₹${Math.abs(num).toLocaleString("en-IN")}`;

//   return (
//     <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg flex flex-col transition-colors duration-300">
//       {/* --- HEADER --- */}
//       <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 transition-colors">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//             Transaction Details
//           </h2>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//             Daily trade breakdown and logs
//           </p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-blue-500/20 active:scale-95">
//           <FileText size={16} /> Export to PDF
//         </button>
//       </div>

//       {/* --- TABLE CONTENT --- */}
//       <div className="flex-1 overflow-x-auto">
//         <div className="min-w-[800px]">
//           {currentData.map((group) => (
//             <div
//               key={group.rawDate}
//               className="border-b border-gray-200 dark:border-slate-800 last:border-0 transition-colors"
//             >
//               {/* A. PARENT ROW (Summary) */}
//               <div
//                 onClick={() => toggleAccordion(group.rawDate)}
//                 className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50 
//                             ${expandedDate === group.rawDate ? "bg-gray-50 dark:bg-slate-800/30" : "bg-white dark:bg-slate-900"}
//                         `}
//               >
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`p-2 rounded-full transition-colors ${expandedDate === group.rawDate ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"}`}
//                   >
//                     {expandedDate === group.rawDate ? (
//                       <ChevronUp size={18} />
//                     ) : (
//                       <ChevronDown size={18} />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-gray-900 dark:text-white">
//                       {group.date} {/* ✅ INDIAN DATE FORMAT DISPLAYED HERE */}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-500">
//                       {group.trades.length} Trades Executed
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-6">
//                   <div className="text-right">
//                     <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold">
//                       Net P&L
//                     </p>
//                     <p
//                       className={`text-base font-bold ${group.totalPnL >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}
//                     >
//                       {group.totalPnL >= 0 ? "+" : "-"}
//                       {fmt(group.totalPnL)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* B. EXPANDED CONTENT (Nested Table) */}
//               {expandedDate === group.rawDate && (
//                 <div className="bg-gray-50 dark:bg-slate-950/50 border-t border-gray-200 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 duration-300">
//                   <table className="w-full text-left border-collapse">
//                     <thead>
//                       <tr className="text-[10px] text-gray-500 dark:text-gray-500 uppercase border-b border-gray-200 dark:border-slate-800/50">
//                         <th className="pb-2 font-bold pl-2">Symbol</th>
//                         <th className="pb-2 font-bold">Transaction</th>
//                         <th className="pb-2 font-bold">Quantity</th>
//                         <th className="pb-2 font-bold">Entry</th>
//                         <th className="pb-2 font-bold">Exit</th>
//                         <th className="pb-2 font-bold text-right">P&L</th>
//                         <th className="pb-2 font-bold text-right pr-2">
//                           Exit Type
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {group.trades.map((trade, idx) => (
//                         <tr
//                           key={idx}
//                           className="border-b border-gray-200 dark:border-slate-800/30 last:border-0 hover:bg-gray-100 dark:hover:bg-slate-900/50 transition-colors"
//                         >
//                           <td className="py-3 pl-2">
//                             <p className="text-sm font-bold text-gray-900 dark:text-white">
//                               {trade.symbol || "Dummy CE/PE"}
//                             </p>
//                             <p className="text-[10px] text-gray-500 dark:text-gray-500">
//                               Weekly Expiry
//                             </p>
//                           </td>

//                           <td className="py-3">
//                             <span
//                               className={`px-2 py-0.5 rounded text-[10px] font-bold border 
//                                                     ${
//                                                       trade.pnl >= 0
//                                                         ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20"
//                                                         : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-500 border-rose-200 dark:border-rose-500/20"
//                                                     }`}
//                             >
//                               {trade.pnl >= 0 ? "BUY" : "SELL"}
//                             </span>
//                           </td>

//                           <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
//                             {trade.details?.quantity || 50}
//                           </td>

//                           <td className="py-3">
//                             <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
//                               ₹{trade.entryPrice || "-"}
//                             </p>
//                             <p className="text-[10px] text-gray-500 dark:text-gray-500">
//                               {trade.details?.entryTime || "09:15:00"}
//                             </p>
//                           </td>

//                           <td className="py-3">
//                             <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
//                               ₹{trade.exitPrice || "-"}
//                             </p>
//                             <p className="text-[10px] text-gray-500 dark:text-gray-500">
//                               {trade.details?.exitTime || "15:30:00"}
//                             </p>
//                           </td>

//                           <td
//                             className={`py-3 text-right font-bold text-sm ${trade.pnl >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}
//                           >
//                             {trade.pnl >= 0 ? "+" : "-"}
//                             {fmt(trade.pnl)}
//                           </td>

//                           <td className="py-3 text-right pr-2">
//                             <a
//                               href="#"
//                               className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-end gap-1 transition-colors"
//                             >
//                               M2M_SQUAREOFF <ExternalLink size={10} />
//                             </a>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           ))}

//           {groupedData.length === 0 && (
//             <div className="p-8 text-center text-gray-500 dark:text-gray-500">
//               No transactions found.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* --- FOOTER (PAGINATION) --- */}
//       <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center transition-colors">
//         <p className="text-xs text-gray-500 dark:text-gray-400">
//           Showing{" "}
//           <span className="font-bold text-gray-900 dark:text-white">
//             {groupedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
//           </span>{" "}
//           -{" "}
//           <span className="font-bold text-gray-900 dark:text-white">
//             {Math.min(currentPage * itemsPerPage, groupedData.length)}
//           </span>{" "}
//           of{" "}
//           <span className="font-bold text-gray-900 dark:text-white">
//             {groupedData.length}
//           </span>
//         </p>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <ArrowLeft size={16} />
//           </button>

//           <div className="flex gap-1">
//             {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors 
//                             ${
//                               currentPage === i + 1
//                                 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
//                                 : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
//                             }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages || totalPages === 0}
//             className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionTable;



import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const TransactionTable = ({ transactions }) => {
  const [expandedDate, setExpandedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- 1. DATA GROUPING LOGIC (✅ SUPER SMART FIX) ---
  const groupedData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const groups = {};
    transactions.forEach((item) => {
      const originalDate = item.date; // e.g. "YYYY-MM-DD"
      
      if (!groups[originalDate]) {
        // Indian Format DD/MM/YY
        const [year, month, day] = originalDate.split("-");
        const displayDate = `${day}/${month}/${year.slice(-2)}`;

        groups[originalDate] = {
          rawDate: originalDate, 
          date: displayDate,     
          totalPnL: 0,
          trades: [],
        };
      }

      // 🔥 SMART FIX: Agar parent component se direct 'daywiseBreakdown' array aa raha hai jisme 'tradesList' hai
      if (item.tradesList) {
          groups[originalDate].totalPnL = item.dailyPnL || item.pnl || 0;
          groups[originalDate].trades = item.tradesList;
      } 
      // Agar flat trades ka array aa raha hai to ye fallback chalega
      else {
          groups[originalDate].totalPnL += item.pnl || 0;
          groups[originalDate].trades.push(item);
      }
    });

    // Descending Sort (Latest date upar)
    return Object.values(groups).sort((a, b) => {
      if (a.rawDate < b.rawDate) return 1;
      if (a.rawDate > b.rawDate) return -1;
      return 0;
    });
  }, [transactions]);

  // --- 2. PAGINATION LOGIC ---
  const totalPages = Math.ceil(groupedData.length / itemsPerPage);
  const currentData = groupedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleAccordion = (dateKey) => {
    setExpandedDate(expandedDate === dateKey ? null : dateKey);
  };

  const fmt = (num) => `₹${Math.abs(num).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg flex flex-col transition-colors duration-300">
      {/* --- HEADER --- */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Transaction Details
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Daily trade breakdown and logs
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-blue-500/20 active:scale-95">
          <FileText size={16} /> Export to PDF
        </button>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[800px]">
          {currentData.map((group) => (
            <div
              key={group.rawDate}
              className="border-b border-gray-200 dark:border-slate-800 last:border-0 transition-colors"
            >
              {/* A. PARENT ROW (Summary) */}
              <div
                onClick={() => toggleAccordion(group.rawDate)}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50 
                            ${expandedDate === group.rawDate ? "bg-gray-50 dark:bg-slate-800/30" : "bg-white dark:bg-slate-900"}
                        `}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full transition-colors ${expandedDate === group.rawDate ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"}`}
                  >
                    {expandedDate === group.rawDate ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {group.date}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {group.trades.length} Trades Executed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold">
                      Net P&L
                    </p>
                    <p
                      className={`text-base font-bold ${group.totalPnL >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}
                    >
                      {group.totalPnL >= 0 ? "+" : "-"}
                      {fmt(group.totalPnL)}
                    </p>
                  </div>
                </div>
              </div>

              {/* B. EXPANDED CONTENT (Nested Table) */}
              {expandedDate === group.rawDate && (
                <div className="bg-gray-50 dark:bg-slate-950/50 border-t border-gray-200 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 duration-300">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] text-gray-500 dark:text-gray-500 uppercase border-b border-gray-200 dark:border-slate-800/50">
                        <th className="pb-2 font-bold pl-2">Symbol</th>
                        <th className="pb-2 font-bold">Transaction</th>
                        <th className="pb-2 font-bold">Quantity</th>
                        <th className="pb-2 font-bold">Entry</th>
                        <th className="pb-2 font-bold">Exit</th>
                        <th className="pb-2 font-bold text-right">P&L</th>
                        <th className="pb-2 font-bold text-right pr-2">
                          Exit Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.trades.map((trade, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 dark:border-slate-800/30 last:border-0 hover:bg-gray-100 dark:hover:bg-slate-900/50 transition-colors"
                        >
                          <td className="py-3 pl-2">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {/* 🔥 FIX 1: Exact Symbol */}
                              {trade.symbol || "NIFTY/BANKNIFTY"}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-500">
                              Intraday
                            </p>
                          </td>

                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border 
                                                    ${
                                                      trade.transaction === "BUY" || trade.pnl >= 0
                                                        ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20"
                                                        : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-500 border-rose-200 dark:border-rose-500/20"
                                                    }`}
                            >
                              {trade.transaction || "BUY"}
                            </span>
                          </td>

                          <td className="py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                            {/* 🔥 FIX 2: Exact Quantity */}
                            {trade.quantity || "-"}
                          </td>

                          <td className="py-3">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {/* 🔥 FIX 3: Entry Price (Entry Time) */}
                              ₹{trade.entryPrice ? trade.entryPrice.toFixed(2) : "-"}
                              <span className="text-[11px] font-normal text-gray-500 ml-1">
                                ({trade.entryTime || "09:15:00"})
                              </span>
                            </p>
                          </td>

                          <td className="py-3">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {/* 🔥 FIX 4: Exit Price (Exit Time) */}
                              ₹{trade.exitPrice ? trade.exitPrice.toFixed(2) : "-"}
                              <span className="text-[11px] font-normal text-gray-500 ml-1">
                                ({trade.exitTime || "15:30:00"})
                              </span>
                            </p>
                          </td>

                          <td
                            className={`py-3 text-right font-bold text-sm ${trade.pnl >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}
                          >
                            {trade.pnl >= 0 ? "+" : "-"}
                            {fmt(trade.pnl)}
                          </td>

                          <td className="py-3 text-right pr-2">
                            <a
                              href="#"
                              className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-end gap-1 transition-colors uppercase"
                            >
                              {trade.exitType || "TIME_SQUAREOFF"} <ExternalLink size={10} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {groupedData.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-500">
              No transactions found.
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER (PAGINATION) --- */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center transition-colors">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {groupedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
          </span>{" "}
          -{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {Math.min(currentPage * itemsPerPage, groupedData.length)}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {groupedData.length}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors 
                            ${
                              currentPage === i + 1
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                            }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;