

// import React from 'react';
// import { 
//   MoreVertical, Trash2, Edit, Copy, Check, ArrowRight, Zap 
// } from 'lucide-react';
// import { SiTradingview } from "react-icons/si";

// // ✅ 1. PIXEL-PERFECT SKELETON LOADER
// export const StrategyCardSkeleton = () => {
//   return (
//     // Same container styling as the real card
//     <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 h-full flex flex-col bg-white dark:bg-slate-800 animate-pulse shadow-sm">
      
//       {/* 1. Header (Title & Author) */}
//       <div className="flex justify-between items-start mb-4">
//           <div className="w-full">
//               {/* Title: h-4 matches text-[15px] approx */}
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
//               {/* Author: h-2.5 matches text-[11px] */}
//               <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
//           </div>
//           {/* Menu Button */}
//           <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded shrink-0"></div>
//       </div>

//       {/* 2. Info Grid (Exact spacing match) */}
//       <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">
//           {/* Item 1 */}
//           <div>
//              <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           {/* Item 2 (Right aligned) */}
//           <div className="flex flex-col items-end">
//              <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           {/* Item 3 */}
//           <div>
//              <div className="h-2 w-12 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           {/* Item 4 (Right aligned) */}
//           <div className="flex flex-col items-end">
//              <div className="h-2 w-8 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//       </div>

//       {/* 3. Legs Section (Crucial Fix: min-h-[80px] to match real card) */}
//       <div className="mb-5 flex-1 min-h-[80px] flex flex-col justify-center space-y-2">
//           {/* Single Leg Bar (Matches px-3 py-2.5 height) */}
//           <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded w-full border border-transparent"></div>
//       </div>

//       {/* 4. Footer Buttons (h-9 matches real card) */}
//       <div className="flex items-center gap-2.5 mt-auto h-9">
//           <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//           <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//           {/* Small button for TV/Signal */}
//           <div className="w-12 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//       </div>
//     </div>
//   );
// };

// // ✅ 2. MAIN COMPONENT (No changes needed here, keep your existing code)
// const StrategyCard = ({ 
//   strategy, 
//   viewMode, 
//   isMenuOpen, 
//   onToggleMenu, 
//   onEdit, 
//   onDuplicate, 
//   onDelete, 
//   onOpenWebhook, 
//   onDeploy,       
//   onBacktest     
// }) => {
//   // ... (Apka purana StrategyCard code as-is rahega) ...
//   if (!strategy) return null;

//   return (
//     <div className={`border rounded-xl p-5 transition-all relative group shadow-sm hover:shadow-lg h-full flex flex-col animate-in fade-in duration-300
//         ${viewMode === 'signals' 
//             ? 'bg-blue-50 dark:bg-slate-800 border-blue-500/50 dark:border-blue-500/30 shadow-blue-100 dark:shadow-blue-900/10' 
//             : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
//         }
//     `}>
//       {/* ... Baki pura content same ... */}
      
//       {/* 1. HEADER */}
//       <div className="flex justify-between items-start mb-4">
//           <div>
//               <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">{strategy.name || "Unknown Strategy"}</h3>
//               <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-medium">
//                   {viewMode === 'signals' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
//                   {strategy.author || "System"}
//               </p>
//           </div>
//           <div className="relative">
//               <button onClick={(e) => { e.stopPropagation(); onToggleMenu(); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
//                   <MoreVertical size={18} />
//               </button>
              
//               {isMenuOpen && (
//                   <div className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden transition-colors animate-in fade-in zoom-in-95 duration-100">
//                       <button onClick={onEdit} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Edit Strategy</button>
//                       <button onClick={onDuplicate} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Copy size={12} /> Duplicate</button>
//                       {viewMode === 'signals' && (
//                           <button onClick={onOpenWebhook} className="w-full text-left px-4 py-2.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Config Alert</button>
//                       )}
//                       <button onClick={onDelete} className="w-full text-left px-4 py-2.5 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-2"><Trash2 size={12} /> Delete</button>
//                   </div>
//               )}
//           </div>
//       </div>

//       {/* 2. INFO GRID */}
//       <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4 transition-colors">
//           <div><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Start Time</p><p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.startTime || '--:--'}</p></div>
//           <div className="text-right"><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">End Time</p><p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.endTime || '--:--'}</p></div>
//           <div><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Segment</p><p className="text-xs text-gray-800 dark:text-gray-200 font-semibold uppercase">{strategy.segment}</p></div>
//           <div className="text-right"><p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Type</p><p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.type}</p></div>
//       </div>

//       {/* 3. LEGS DISPLAY */}
//       <div className="space-y-2 mb-5 flex-1 min-h-[80px]">
//           {(strategy.segment === 'Equity' || strategy.segment === 'Future') ? (
//               strategy.instruments && strategy.instruments.length > 0 ? (
//                   strategy.instruments.map((inst, idx) => (
//                       <div key={idx} className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
//                           <div className="flex items-center gap-2">
//                               <span className={`text-[10px] font-bold ${strategy.equityAction === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{strategy.equityAction || 'BUY'}</span>
//                               <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide">{inst?.name || "Unknown"}</span>
//                           </div>
//                           <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300">{inst?.lot || 1}</span></span>
//                       </div>
//                   ))
//               ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No instruments</div>
//           ) : (
//               strategy.legs && strategy.legs.length > 0 ? (
//                   strategy.legs.map((leg, idx) => (
//                       <div key={idx} className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
//                           <div className="flex items-center gap-2">
//                               <span className={`text-[10px] font-bold ${leg.action === 'BUY' ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>{leg.action}</span>
//                               <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide">
//                                   {leg.symbol} <span className="text-yellow-600 dark:text-yellow-500/90">{leg.strike}</span> <span className={leg.type === 'CE' ? 'text-green-600 dark:text-green-400' : leg.type === 'PE' ? 'text-red-500 dark:text-red-400' : 'text-blue-500'}>{leg.type}</span>
//                               </span>
//                           </div>
//                           <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300">{leg.qty}</span></span>
//                       </div>
//                   ))
//               ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No legs configured</div>
//           )}
//       </div>

//       {/* 4. FOOTER BUTTONS */}
//       <div className="flex items-center gap-2.5 mt-auto h-9">
//           <button 
//             onClick={onBacktest} 
//             className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-600 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
//           >
//             Backtest
//           </button>
          
//           <button 
//             onClick={onDeploy} 
//             className="flex-1 p-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
//           >
//               Deploy
//           </button>
          
//           {strategy.type !== 'Time Based' && (
//               <button 
//                 onClick={onOpenWebhook} 
//                 className={`h-full px-3 rounded-lg border flex items-center justify-center transition-all hover:scale-[1.05] active:scale-95
//                     ${viewMode === 'signals' 
//                         ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500/50 hover:bg-blue-200 dark:hover:bg-blue-900/50' 
//                         : 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' 
//                     }
//                 `}
//                 title={viewMode === 'signals' ? "Signal Connected" : "Connect TradingView"}
//               >
//                   {viewMode === 'signals' ? (
//                       <div className="flex items-center gap-1.5 opacity-90">
//                           <SiTradingview className="text-gray-900 dark:text-white" size={18}/>
//                           <ArrowRight size={10} className="text-blue-500 dark:text-blue-400" />
//                           <Zap size={12} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
//                       </div>
//                   ) : (
//                       <SiTradingview className="text-gray-600 dark:text-white" size={18}/>
//                   )}
//               </button>
//           )}
//       </div>

//     </div>
//   );
// };

// export default StrategyCard;



// import React from 'react';
// import { 
//   MoreVertical, Trash2, Edit, Copy, Check, ArrowRight, Zap 
// } from 'lucide-react';
// import { SiTradingview } from "react-icons/si";

// // ✅ 1. PIXEL-PERFECT SKELETON LOADER
// export const StrategyCardSkeleton = () => {
//   return (
//     <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 h-full flex flex-col bg-white dark:bg-slate-800 animate-pulse shadow-sm">
//       <div className="flex justify-between items-start mb-4">
//           <div className="w-full">
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
//               <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
//           </div>
//           <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded shrink-0"></div>
//       </div>

//       <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">
//           <div>
//              <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           <div className="flex flex-col items-end">
//              <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           <div>
//              <div className="h-2 w-12 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           <div className="flex flex-col items-end">
//              <div className="h-2 w-8 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//       </div>

//       <div className="mb-5 flex-1 min-h-[80px] flex flex-col justify-center space-y-2">
//           <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded w-full border border-transparent"></div>
//       </div>

//       <div className="flex items-center gap-2.5 mt-auto h-9">
//           <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//           <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//           <div className="w-12 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//       </div>
//     </div>
//   );
// };

// // ✅ 2. MAIN COMPONENT 
// const StrategyCard = ({ 
//   strategy, 
//   viewMode, 
//   isMenuOpen, 
//   onToggleMenu, 
//   onEdit, 
//   onDuplicate, 
//   onDelete, 
//   onOpenWebhook, 
//   onDeploy,       
//   onBacktest     
// }) => {
//   if (!strategy) return null;

//   return (
//     <div className={`border rounded-xl p-5 transition-all relative group shadow-sm hover:shadow-lg h-full flex flex-col animate-in fade-in duration-300
//         ${viewMode === 'signals' 
//             ? 'bg-blue-50 dark:bg-slate-800 border-blue-500/50 dark:border-blue-500/30 shadow-blue-100 dark:shadow-blue-900/10' 
//             : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
//         }
//     `}>
      
//       {/* 1. HEADER */}
//       <div className="flex justify-between items-start mb-4">
//           <div>
//               <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">{strategy.name || "Unknown Strategy"}</h3>
//               <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-medium">
//                   {viewMode === 'signals' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
//                   {strategy.author || "System"}
//               </p>
//           </div>
//           <div className="relative">
//               <button onClick={(e) => { e.stopPropagation(); onToggleMenu(); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
//                   <MoreVertical size={18} />
//               </button>
              
//               {isMenuOpen && (
//                   <div className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden transition-colors animate-in fade-in zoom-in-95 duration-100">
//                       <button onClick={onEdit} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Edit Strategy</button>
//                       <button onClick={onDuplicate} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Copy size={12} /> Duplicate</button>
//                       {viewMode === 'signals' && (
//                           <button onClick={onOpenWebhook} className="w-full text-left px-4 py-2.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Config Alert</button>
//                       )}
//                       <button onClick={onDelete} className="w-full text-left px-4 py-2.5 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-2"><Trash2 size={12} /> Delete</button>
//                   </div>
//               )}
//           </div>
//       </div>

//       {/* 2. INFO GRID - 🔥 YAHAN FIX KIYA HAI 🔥 */}
//       <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4 transition-colors">
//           <div>
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Start Time</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.data?.config?.startTime || strategy.startTime || '--:--'}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Square Off</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.data?.config?.squareOffTime || strategy.squareOffTime || strategy.endTime || '--:--'}</p>
//           </div>
//           <div>
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Segment</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold uppercase">{strategy.segment}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Type</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.type}</p>
//           </div>
//       </div>

//       {/* 3. LEGS DISPLAY */}
//       <div className="space-y-2 mb-5 flex-1 min-h-[80px]">
//           {(strategy.segment === 'Equity' || strategy.segment === 'Future') ? (
//               strategy.instruments && strategy.instruments.length > 0 ? (
//                   strategy.instruments.map((inst, idx) => (
//                       <div key={idx} className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
//                           <div className="flex items-center gap-2">
//                               <span className={`text-[10px] font-bold ${strategy.equityAction === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{strategy.equityAction || 'BUY'}</span>
//                               <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide">{inst?.name || "Unknown"}</span>
//                           </div>
//                           <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300">{inst?.lot || 1}</span></span>
//                       </div>
//                   ))
//               ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No instruments</div>
//           ) : (
//               strategy.legs && strategy.legs.length > 0 ? (
//                   strategy.legs.map((leg, idx) => (
//                       <div key={idx} className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
//                           <div className="flex items-center gap-2">
//                               <span className={`text-[10px] font-bold ${leg.action === 'BUY' ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>{leg.action}</span>
//                               <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide">
//                                   {leg.symbol} <span className="text-yellow-600 dark:text-yellow-500/90">{leg.strike}</span> <span className={leg.type === 'CE' ? 'text-green-600 dark:text-green-400' : leg.type === 'PE' ? 'text-red-500 dark:text-red-400' : 'text-blue-500'}>{leg.type}</span>
//                               </span>
//                           </div>
//                           <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300">{leg.qty}</span></span>
//                       </div>
//                   ))
//               ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No legs configured</div>
//           )}
//       </div>

//       {/* 4. FOOTER BUTTONS */}
//       <div className="flex items-center gap-2.5 mt-auto h-9">
//           <button 
//             onClick={onBacktest} 
//             className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-600 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
//           >
//             Backtest
//           </button>
          
//           <button 
//             onClick={onDeploy} 
//             className="flex-1 p-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
//           >
//               Deploy
//           </button>
          
//           {strategy.type !== 'Time Based' && (
//               <button 
//                 onClick={onOpenWebhook} 
//                 className={`h-full px-3 rounded-lg border flex items-center justify-center transition-all hover:scale-[1.05] active:scale-95
//                     ${viewMode === 'signals' 
//                         ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500/50 hover:bg-blue-200 dark:hover:bg-blue-900/50' 
//                         : 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' 
//                     }
//                 `}
//                 title={viewMode === 'signals' ? "Signal Connected" : "Connect TradingView"}
//               >
//                   {viewMode === 'signals' ? (
//                       <div className="flex items-center gap-1.5 opacity-90">
//                           <SiTradingview className="text-gray-900 dark:text-white" size={18}/>
//                           <ArrowRight size={10} className="text-blue-500 dark:text-blue-400" />
//                           <Zap size={12} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
//                       </div>
//                   ) : (
//                       <SiTradingview className="text-gray-600 dark:text-white" size={18}/>
//                   )}
//               </button>
//           )}
//       </div>

//     </div>
//   );
// };

// export default StrategyCard;


// import React from 'react';
// import { 
//   MoreVertical, Trash2, Edit, Copy, Check, ArrowRight, Zap 
// } from 'lucide-react';
// import { SiTradingview } from "react-icons/si";

// // ✅ 1. PIXEL-PERFECT SKELETON LOADER
// export const StrategyCardSkeleton = () => {
//   return (
//     <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 h-full flex flex-col bg-white dark:bg-slate-800 animate-pulse shadow-sm">
//       <div className="flex justify-between items-start mb-4">
//           <div className="w-full">
//               <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
//               <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
//           </div>
//           <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded shrink-0"></div>
//       </div>

//       <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">
//           <div>
//              <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           <div className="flex flex-col items-end">
//              <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           <div>
//              <div className="h-2 w-12 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//           <div className="flex flex-col items-end">
//              <div className="h-2 w-8 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
//              <div className="h-3 w-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
//           </div>
//       </div>

//       <div className="mb-5 flex-1 min-h-[80px] flex flex-col justify-center space-y-2">
//           <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded w-full border border-transparent"></div>
//       </div>

//       <div className="flex items-center gap-2.5 mt-auto h-9">
//           <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//           <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//           <div className="w-12 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
//       </div>
//     </div>
//   );
// };

// // ✅ 2. MAIN COMPONENT 
// const StrategyCard = ({ 
//   strategy, 
//   viewMode, 
//   isMenuOpen, 
//   onToggleMenu, 
//   onEdit, 
//   onDuplicate, 
//   onDelete, 
//   onOpenWebhook, 
//   onDeploy,       
//   onBacktest     
// }) => {
//   if (!strategy) return null;

//   return (
//     <div className={`border rounded-xl p-5 transition-all relative group shadow-sm hover:shadow-lg h-full flex flex-col animate-in fade-in duration-300
//         ${viewMode === 'signals' 
//             ? 'bg-blue-50 dark:bg-slate-800 border-blue-500/50 dark:border-blue-500/30 shadow-blue-100 dark:shadow-blue-900/10' 
//             : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
//         }
//     `}>
      
//       {/* 1. HEADER */}
//       <div className="flex justify-between items-start mb-4">
//           <div>
//               <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">{strategy.name || "Unknown Strategy"}</h3>
//               <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-medium">
//                   {viewMode === 'signals' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
//                   {strategy.author || "System"}
//               </p>
//           </div>
//           <div className="relative">
//               <button onClick={(e) => { e.stopPropagation(); onToggleMenu(); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
//                   <MoreVertical size={18} />
//               </button>
              
//               {isMenuOpen && (
//                   <div className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden transition-colors animate-in fade-in zoom-in-95 duration-100">
//                       <button onClick={onEdit} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Edit Strategy</button>
//                       <button onClick={onDuplicate} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Copy size={12} /> Duplicate</button>
//                       {viewMode === 'signals' && (
//                           <button onClick={onOpenWebhook} className="w-full text-left px-4 py-2.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Config Alert</button>
//                       )}
//                       <button onClick={onDelete} className="w-full text-left px-4 py-2.5 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-2"><Trash2 size={12} /> Delete</button>
//                   </div>
//               )}
//           </div>
//       </div>

//       {/* 2. INFO GRID */}
//       <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4 transition-colors">
//           <div>
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Start Time</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.data?.config?.startTime || strategy.startTime || '--:--'}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Square Off</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.data?.config?.squareOffTime || strategy.squareOffTime || strategy.endTime || '--:--'}</p>
//           </div>
//           <div>
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Segment</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold uppercase">{strategy.segment}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Type</p>
//             <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.type}</p>
//           </div>
//       </div>

//       {/* 3. LEGS DISPLAY - 🔥 YAHAN FIX KIYA HAI 🔥 */}
//       <div className="space-y-2 mb-5 flex-1 min-h-[80px]">
//           {(strategy.segment === 'Equity' || strategy.segment === 'Future') ? (
//               strategy.instruments && strategy.instruments.length > 0 ? (
//                   strategy.instruments.map((inst, idx) => (
//                       <div key={idx} className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
//                           <div className="flex items-center gap-2">
//                               <span className={`text-[10px] font-bold ${strategy.equityAction === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{strategy.equityAction || 'BUY'}</span>
//                               <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide">{inst?.name || "Unknown"}</span>
//                           </div>
//                           <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300 font-bold">{inst?.lot || 1}</span></span>
//                       </div>
//                   ))
//               ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No instruments</div>
//           ) : (
//               strategy.legs && strategy.legs.length > 0 ? (
//                   strategy.legs.map((leg, idx) => {
//                       // 🔥 SMART VISUAL TRICK: Transaction Type se Pata Karo CE dikhana hai ya PE ya Dono
//                       const txnType = strategy.data?.config?.transactionType || strategy.config?.transactionType || 'Both Side';
                      
//                       const showCE = txnType === 'Both Side' || txnType === 'Only Long';
//                       const showPE = txnType === 'Both Side' || txnType === 'Only Short';

//                       // Safe Fallbacks
//                       const instrumentName = strategy.instruments?.[0]?.name || strategy.data?.instruments?.[0]?.name || leg.symbol || "NIFTY BANK";
//                       const strikeTxt = leg.strike || leg.strikeType || "ATM";
//                       const qtyTxt = leg.qty || leg.quantity || 30;
//                       const actionTxt = leg.action || "BUY";

//                       return (
//                           <div key={idx} className="flex flex-col gap-1.5">
//                               {/* 🟢 LONG LEG DISPLAY (CE) */}
//                               {showCE && (
//                                   <div className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
//                                       <div className="flex items-center gap-2">
//                                           <span className={`text-[10px] font-bold ${actionTxt === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{actionTxt}</span>
//                                           <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide flex items-center gap-1.5">
//                                               {instrumentName} 
//                                               <span className="text-yellow-600 dark:text-yellow-500/90">{strikeTxt}</span> 
//                                               <span className="text-green-600 dark:text-green-500 font-bold">CE</span>
//                                           </span>
//                                       </div>
//                                       <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300 font-bold">{qtyTxt}</span></span>
//                                   </div>
//                               )}

//                               {/* 🔴 SHORT LEG DISPLAY (PE) */}
//                               {showPE && (
//                                   <div className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors mt-0.5">
//                                       <div className="flex items-center gap-2">
//                                           <span className={`text-[10px] font-bold ${actionTxt === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{actionTxt}</span>
//                                           <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide flex items-center gap-1.5">
//                                               {instrumentName} 
//                                               <span className="text-yellow-600 dark:text-yellow-500/90">{strikeTxt}</span> 
//                                               <span className="text-red-500 dark:text-red-400 font-bold">PE</span>
//                                           </span>
//                                       </div>
//                                       <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300 font-bold">{qtyTxt}</span></span>
//                                   </div>
//                               )}
//                           </div>
//                       );
//                   })
//               ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No legs configured</div>
//           )}
//       </div>

//       {/* 4. FOOTER BUTTONS */}
//       <div className="flex items-center gap-2.5 mt-auto h-9">
//           <button 
//             onClick={onBacktest} 
//             className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-600 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
//           >
//             Backtest
//           </button>
          
//           <button 
//             onClick={onDeploy} 
//             className="flex-1 p-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
//           >
//               Deploy
//           </button>
          
//           {strategy.type !== 'Time Based' && (
//               <button 
//                 onClick={onOpenWebhook} 
//                 className={`h-full px-3 rounded-lg border flex items-center justify-center transition-all hover:scale-[1.05] active:scale-95
//                     ${viewMode === 'signals' 
//                         ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500/50 hover:bg-blue-200 dark:hover:bg-blue-900/50' 
//                         : 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' 
//                     }
//                 `}
//                 title={viewMode === 'signals' ? "Signal Connected" : "Connect TradingView"}
//               >
//                   {viewMode === 'signals' ? (
//                       <div className="flex items-center gap-1.5 opacity-90">
//                           <SiTradingview className="text-gray-900 dark:text-white" size={18}/>
//                           <ArrowRight size={10} className="text-blue-500 dark:text-blue-400" />
//                           <Zap size={12} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
//                       </div>
//                   ) : (
//                       <SiTradingview className="text-gray-600 dark:text-white" size={18}/>
//                   )}
//               </button>
//           )}
//       </div>

//     </div>
//   );
// };

// export default StrategyCard;




import React from 'react';
import { 
  MoreVertical, Trash2, Edit, Copy, Check, ArrowRight, Zap 
} from 'lucide-react';
import { SiTradingview } from "react-icons/si";

// ✅ 1. PIXEL-PERFECT SKELETON LOADER
export const StrategyCardSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 h-full flex flex-col bg-white dark:bg-slate-800 animate-pulse shadow-sm">
      <div className="flex justify-between items-start mb-4">
          <div className="w-full">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded shrink-0"></div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">
          <div>
             <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
             <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="flex flex-col items-end">
             <div className="h-2 w-10 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
             <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div>
             <div className="h-2 w-12 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
             <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="flex flex-col items-end">
             <div className="h-2 w-8 bg-gray-200 dark:bg-slate-700 rounded mb-1.5"></div>
             <div className="h-3 w-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
      </div>

      <div className="mb-5 flex-1 min-h-[80px] flex flex-col justify-center space-y-2">
          <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded w-full border border-transparent"></div>
      </div>

      <div className="flex items-center gap-2.5 mt-auto h-9">
          <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="flex-1 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="w-12 h-full bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  );
};

// ✅ 2. MAIN COMPONENT 
const StrategyCard = ({ 
  strategy, 
  viewMode, 
  isMenuOpen, 
  onToggleMenu, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onOpenWebhook, 
  onDeploy,       
  onBacktest     
}) => {
  if (!strategy) return null;

  return (
    <div className={`border rounded-xl p-5 transition-all relative group shadow-sm hover:shadow-lg h-full flex flex-col animate-in fade-in duration-300
        ${viewMode === 'signals' 
            ? 'bg-blue-50 dark:bg-slate-800 border-blue-500/50 dark:border-blue-500/30 shadow-blue-100 dark:shadow-blue-900/10' 
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
        }
    `}>
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-start mb-4">
          <div>
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white leading-tight">{strategy.name || "Unknown Strategy"}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-medium">
                  {viewMode === 'signals' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                  {strategy.author || "System"}
              </p>
          </div>
          <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); onToggleMenu(); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
                  <MoreVertical size={18} />
              </button>
              
              {isMenuOpen && (
                  <div className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden transition-colors animate-in fade-in zoom-in-95 duration-100">
                      <button onClick={onEdit} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Edit Strategy</button>
                      <button onClick={onDuplicate} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Copy size={12} /> Duplicate</button>
                      {viewMode === 'signals' && (
                          <button onClick={onOpenWebhook} className="w-full text-left px-4 py-2.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800"><Edit size={12} /> Config Alert</button>
                      )}
                      <button onClick={onDelete} className="w-full text-left px-4 py-2.5 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-2"><Trash2 size={12} /> Delete</button>
                  </div>
              )}
          </div>
      </div>

      {/* 2. INFO GRID */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-b border-gray-100 dark:border-slate-700 pb-4 transition-colors">
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Start Time</p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.data?.config?.startTime || strategy.startTime || '--:--'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Square Off</p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.data?.config?.squareOffTime || strategy.squareOffTime || strategy.endTime || '--:--'}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Segment</p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold uppercase">{strategy.segment}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Type</p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{strategy.type}</p>
          </div>
      </div>

      {/* 3. LEGS DISPLAY - 🔥 YAHAN FIX KIYA HAI 🔥 */}
      <div className="space-y-2 mb-5 flex-1 min-h-[80px]">
          {(strategy.segment === 'Equity' || strategy.segment === 'Future') ? (
              strategy.instruments && strategy.instruments.length > 0 ? (
                  strategy.instruments.map((inst, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
                          <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold ${strategy.equityAction === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{strategy.equityAction || 'BUY'}</span>
                              <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide">{inst?.name || "Unknown"}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300 font-bold">{inst?.lot || 1}</span></span>
                      </div>
                  ))
              ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No instruments</div>
          ) : (
              strategy.legs && strategy.legs.length > 0 ? (
                  strategy.legs.map((leg, idx) => {
                      
                      // 1. Check Strategy Type & Transaction Type
                      const stratType = strategy.type || 'Time Based';
                      const txnType = strategy.data?.config?.transactionType || strategy.config?.transactionType || 'Both Side';
                      
                      // 2. Original Option Type configured by user (Call or Put)
                      const legOptType = leg.optionType || 'Call';

                      // 🔥 SMART LOGIC: Sirf Indicator + Both Side me 2 legs dikhao, warna original dikhao
                      let showCE = false;
                      let showPE = false;

                      if (stratType === 'Indicator Based' && txnType === 'Both Side') {
                          showCE = true;
                          showPE = true;
                      } else {
                          // Normal behavior: Jo select kiya hai wahi dikhega
                          if (legOptType === 'Call') showCE = true;
                          if (legOptType === 'Put') showPE = true;
                      }

                      // Safe Fallbacks
                      const instrumentName = strategy.instruments?.[0]?.name || strategy.data?.instruments?.[0]?.name || leg.symbol || "NIFTY BANK";
                      const strikeTxt = leg.strike || leg.strikeType || "ATM";
                      const qtyTxt = leg.qty || leg.quantity || 30;
                      const actionTxt = leg.action || "BUY";

                      return (
                          <div key={idx} className="flex flex-col gap-1.5">
                              {/* 🟢 LONG LEG DISPLAY (CE) */}
                              {showCE && (
                                  <div className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors">
                                      <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-bold ${actionTxt === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{actionTxt}</span>
                                          <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide flex items-center gap-1.5">
                                              {instrumentName} 
                                              <span className="text-yellow-600 dark:text-yellow-500/90">{strikeTxt}</span> 
                                              <span className="text-green-600 dark:text-green-500 font-bold">CE</span>
                                          </span>
                                      </div>
                                      <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300 font-bold">{qtyTxt}</span></span>
                                  </div>
                              )}

                              {/* 🔴 SHORT LEG DISPLAY (PE) */}
                              {showPE && (
                                  <div className="bg-gray-50 dark:bg-slate-900 rounded px-3 py-2.5 flex justify-between items-center border border-gray-200 dark:border-slate-700 transition-colors mt-0.5">
                                      <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-bold ${actionTxt === 'SELL' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{actionTxt}</span>
                                          <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium tracking-wide flex items-center gap-1.5">
                                              {instrumentName} 
                                              <span className="text-yellow-600 dark:text-yellow-500/90">{strikeTxt}</span> 
                                              <span className="text-red-500 dark:text-red-400 font-bold">PE</span>
                                          </span>
                                      </div>
                                      <span className="text-[10px] text-gray-500 font-medium">Qty: <span className="text-gray-700 dark:text-gray-300 font-bold">{qtyTxt}</span></span>
                                  </div>
                              )}
                          </div>
                      );
                  })
              ) : <div className="text-center text-gray-400 dark:text-gray-500 text-[11px] py-3 bg-gray-50 dark:bg-slate-900 rounded italic border border-dashed border-gray-200 dark:border-slate-700">No legs configured</div>
          )}
      </div>

      {/* 4. FOOTER BUTTONS */}
      <div className="flex items-center gap-2.5 mt-auto h-9">
          <button 
            onClick={onBacktest} 
            className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-600 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
          >
            Backtest
          </button>
          
          <button 
            onClick={onDeploy} 
            className="flex-1 p-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-95"
          >
              Deploy
          </button>
          
          {strategy.type !== 'Time Based' && (
              <button 
                onClick={onOpenWebhook} 
                className={`h-full px-3 rounded-lg border flex items-center justify-center transition-all hover:scale-[1.05] active:scale-95
                    ${viewMode === 'signals' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500/50 hover:bg-blue-200 dark:hover:bg-blue-900/50' 
                        : 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' 
                    }
                `}
                title={viewMode === 'signals' ? "Signal Connected" : "Connect TradingView"}
              >
                  {viewMode === 'signals' ? (
                      <div className="flex items-center gap-1.5 opacity-90">
                          <SiTradingview className="text-gray-900 dark:text-white" size={18}/>
                          <ArrowRight size={10} className="text-blue-500 dark:text-blue-400" />
                          <Zap size={12} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                      </div>
                  ) : (
                      <SiTradingview className="text-gray-600 dark:text-white" size={18}/>
                  )}
              </button>
          )}
      </div>

    </div>
  );
};

export default StrategyCard;