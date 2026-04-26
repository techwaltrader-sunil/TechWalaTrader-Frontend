
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, Play, Activity, ChevronDown, X, Calendar, CheckSquare, Square
// } from 'lucide-react';



// // Components Imports
// import EquityCurveChart from '../../components/algoComponents/Backtest/EquityCurveChart';
// import BacktestSummary from '../../components/algoComponents/Backtest/BacktestSummary';
// import MaxProfitLossChart from '../../components/algoComponents/Backtest/MaxProfitLossChart';
// import DaywiseBreakdown from '../../components/algoComponents/Backtest/DaywiseBreakdown';
// import TransactionTable from '../../components/algoComponents/Backtest/TransactionTable';

// // Data Service
// import { fetchBacktestData } from '../../data/AlogoTrade/backtestMockData';

// const Backtest = () => {
//   const { strategyId } = useParams();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   // --- STATES ---
//   const [strategies, setStrategies] = useState([]);
//   const [selectedStrategyIds, setSelectedStrategyIds] = useState([]); 
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedPeriod, setSelectedPeriod] = useState("1M"); 
//   const [customRange, setCustomRange] = useState({ start: '', end: '' });

//   // Simulation States
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   // --- LOAD STRATEGIES ---
//   useEffect(() => {
//     const savedData = localStorage.getItem("myStrategies");
//     if (savedData) {
//       const parsed = JSON.parse(savedData);
//       setStrategies(parsed);
//       if (strategyId) {
//         setSelectedStrategyIds([strategyId]);
//       } else if (parsed.length > 0) {
//         setSelectedStrategyIds([parsed[0].id]);
//       }
//     }
    
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);

//   }, [strategyId]);

//   // --- HANDLERS ---
//   const toggleStrategy = (id) => {
//     if (selectedStrategyIds.includes(id)) {
//       setSelectedStrategyIds(prev => prev.filter(sid => sid !== id));
//     } else {
//       setSelectedStrategyIds(prev => [...prev, id]);
//     }
//   };

//   const removeTag = (id, e) => {
//     e.stopPropagation();
//     setSelectedStrategyIds(prev => prev.filter(sid => sid !== id));
//   };

//   const handlePeriodChange = (period) => {
//     setSelectedPeriod(period);
//     if (period !== 'Custom') {
//         setCustomRange({ start: '', end: '' });
//     }
//   };

//   const getDropdownLabel = () => {
//     if (selectedStrategyIds.length === 0) return "Select Strategies";
//     const names = strategies
//         .filter(s => selectedStrategyIds.includes(s.id))
//         .map(s => s.name);
//     return names.join(", ");
//   };

//   // --- SIMULATION ENGINE ---
//   const runBacktest = async () => {
//     if (selectedStrategyIds.length === 0) return;
    
//     setIsLoading(true);
//     setResult(null);

//     try {
//       const data = await fetchBacktestData(selectedPeriod, selectedStrategyIds);
//       setResult(data);
//     } catch (error) {
//       console.error("Backtest Failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     // ✅ Main Container: Themed Background & Text
//     <div className="p-4 md:p-6 text-gray-900 dark:text-white min-h-screen bg-gray-100 dark:bg-slate-950 font-sans transition-colors duration-300">
      
//       {/* 1. TOP HEADER */}
//       <div className="flex items-center gap-3 mb-6">
//         <button 
//             onClick={() => navigate(-1)} 
//             className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-white"
//         >
//             <ArrowLeft size={20} />
//         </button>
//         <div>
//             <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Backtesting Suite</h1>
//             <p className="text-gray-500 dark:text-gray-400 text-xs">Test your strategies on historical data</p>
//         </div>
//       </div>

//       {/* 2. CONTROL PANEL */}
//       <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 mb-6 shadow-sm dark:shadow-xl transition-colors duration-300">
          
//           <div className="flex flex-col gap-6">
              
//               {/* ROW 1: SELECTORS */}
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  
//                   {/* A. MULTI-SELECT DROPDOWN */}
//                   <div className="w-full lg:w-1/2 relative" ref={dropdownRef}>
//                       <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Choose Strategies</label>
                      
//                       <div 
//                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                         className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-white cursor-pointer flex justify-between items-center hover:border-gray-400 dark:hover:border-slate-600 transition-colors relative"
//                       >
//                           <span className="truncate pr-4 text-gray-700 dark:text-gray-300">
//                               {getDropdownLabel()}
//                           </span>
//                           <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
//                       </div>

//                       {/* Dropdown Menu */}
//                       {isDropdownOpen && (
//                           <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar p-2">
//                               {strategies.length === 0 && <p className="text-gray-500 text-xs p-2">No strategies found.</p>}
//                               {strategies.map(s => {
//                                   const isSelected = selectedStrategyIds.includes(s.id);
//                                   return (
//                                       <div 
//                                         key={s.id} 
//                                         onClick={() => toggleStrategy(s.id)}
//                                         className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors 
//                                             ${isSelected 
//                                                 ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400' 
//                                                 : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'}`}
//                                       >
//                                           {isSelected ? <CheckSquare size={16} className="text-blue-600 dark:text-blue-500"/> : <Square size={16} className="text-gray-400 dark:text-gray-600"/>}
//                                           <span className="text-sm font-medium">{s.name}</span>
//                                       </div>
//                                   );
//                               })}
//                           </div>
//                       )}
//                   </div>

//                   {/* B. DATE FILTERS */}
//                   <div className="w-full lg:w-auto">
//                       <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block lg:text-right">Time Range</label>
//                       <div className="flex flex-wrap gap-2">
//                           {['1M', '3M', '6M', '1Y', '2Y', 'Custom'].map((p) => (
//                               <button 
//                                 key={p} 
//                                 onClick={() => handlePeriodChange(p)}
//                                 className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all 
//                                 ${selectedPeriod === p 
//                                     ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' 
//                                     : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:border-slate-600 hover:text-gray-900 dark:hover:text-white'
//                                 }`}
//                               >
//                                   {p === 'Custom' ? 'Custom Range' : p === '1M' ? '1 Month' : p === '1Y' ? '1 Year' : p}
//                               </button>
//                           ))}
//                       </div>
//                   </div>
//               </div>

//               {/* ROW 2: TAGS */}
//               {selectedStrategyIds.length > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                       {strategies.filter(s => selectedStrategyIds.includes(s.id)).map(s => (
//                           <div key={s.id} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm animate-in fade-in zoom-in duration-200">
//                               {s.name}
//                               <button onClick={(e) => removeTag(s.id, e)} className="hover:text-blue-200">
//                                   <X size={14} />
//                               </button>
//                           </div>
//                       ))}
//                   </div>
//               )}

//               {/* ROW 3: CUSTOM DATE INPUTS */}
//               {selectedPeriod === 'Custom' && (
//                   <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 dark:bg-slate-950 p-4 rounded-lg border border-gray-200 dark:border-slate-800 animate-in slide-in-from-top-2">
//                       <div className="flex-1">
//                           <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
//                           <div className="relative">
//                             <input 
//                                 type="date" 
//                                 className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
//                                 value={customRange.start}
//                                 onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
//                             />
//                              <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16}/>
//                           </div>
//                       </div>
//                       <div className="flex-1">
//                           <label className="text-xs text-gray-500 mb-1 block">End Date</label>
//                           <div className="relative">
//                             <input 
//                                 type="date" 
//                                 className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
//                                 value={customRange.end}
//                                 onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
//                             />
//                             <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16}/>
//                           </div>
//                       </div>
//                   </div>
//               )}

//               {/* ROW 4: CREDIT BAR & BUTTON */}
//               <div className="mt-2 flex flex-col md:flex-row items-center gap-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg p-1 pr-1 pl-4 transition-colors">
//                   <div className="flex-1 w-full flex items-center gap-2 py-2 md:py-0">
//                       <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Backtest Credit:</span>
//                       <span className="text-sm font-bold text-gray-900 dark:text-white">47/50</span>
//                       <div className="w-24 h-1.5 bg-gray-300 dark:bg-slate-800 rounded-full ml-2 overflow-hidden">
//                           <div className="bg-green-500 h-full w-[94%]"></div>
//                       </div>
//                   </div>
                  
//                   <button 
//                     onClick={runBacktest}
//                     disabled={isLoading || selectedStrategyIds.length === 0}
//                     className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-8 rounded-md font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
//                   >
//                       {isLoading ? <Activity className="animate-spin" size={18}/> : <Play size={18} fill="currentColor" />}
//                       {isLoading ? "Running..." : "Run Backtest"}
//                   </button>
//               </div>

//           </div>
//       </div>

//       {/* 3. RESULTS AREA */}
//       {result && !isLoading && (
//           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
//               <BacktestSummary summary={result.summary} /> 

//               <div className="mt-6">
//                   <EquityCurveChart transactions={result.transactions} />
//               </div>

//               <div className="mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
//                   <MaxProfitLossChart transactions={result.transactions} summary={result.summary} />
//               </div>

//               <div className="mt-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
//                 <DaywiseBreakdown transactions={result.transactions} period={selectedPeriod} />
//               </div>

//               <div className="mt-6 animate-in fade-in slide-in-from-bottom-12 duration-700 pb-10">
//                   <TransactionTable transactions={result.transactions} />
//               </div>

//           </div>
//       )}

//       {/* 4. EMPTY STATE */}
//       {!result && !isLoading && (
//           <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-xl bg-gray-100 dark:bg-slate-900/30 dark:opacity-50 transition-colors">
//               <div className="bg-white dark:bg-slate-800 p-4 rounded-full mb-4 shadow-sm">
//                   <Activity size={32} className="text-gray-400 dark:text-gray-500" />
//               </div>
//               <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Ready to Simulate</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Select strategies and date range to begin analysis.</p>
//           </div>
//       )}

//     </div>
//   );
// };

// export default Backtest;



// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, Play, Activity, ChevronDown, X, Calendar, CheckSquare, Square
// } from 'lucide-react';
// import axios from 'axios'; // ✅ Naya Import: Axios for API calls
// import { getStrategies } from '../../data/AlogoTrade/strategyService';

// // Components Imports (Inhe waise hi rehne dein)
// import EquityCurveChart from '../../components/algoComponents/Backtest/EquityCurveChart';
// import BacktestSummary from '../../components/algoComponents/Backtest/BacktestSummary';
// import MaxProfitLossChart from '../../components/algoComponents/Backtest/MaxProfitLossChart';
// import DaywiseBreakdown from '../../components/algoComponents/Backtest/DaywiseBreakdown';
// import TransactionTable from '../../components/algoComponents/Backtest/TransactionTable';

// // ❌ Ise hata dein (Mock data ki ab zarurat nahi)
// // import { fetchBacktestData } from '../../data/AlogoTrade/backtestMockData'; 

// const Backtest = () => {
//   // ... (Aapke baaki saare states waise hi rahenge) ...
//   const { strategyId } = useParams();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   const [strategies, setStrategies] = useState([]);
//   const [selectedStrategyIds, setSelectedStrategyIds] = useState([]); 
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedPeriod, setSelectedPeriod] = useState("1M"); 
//   const [customRange, setCustomRange] = useState({ start: '', end: '' });

//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState(null);


//   // --- LOAD STRATEGIES FROM REAL DATABASE ---
//   useEffect(() => {
//     const fetchAndSetStrategies = async () => {
//       try {
//         // Backend se asli strategies mangwao
//         const data = await getStrategies();
//         setStrategies(data);
        
//         if (strategyId) {
//           setSelectedStrategyIds([strategyId]);
//         } else if (data && data.length > 0) {
//           // Default: Pehli strategy select kar lo
//           setSelectedStrategyIds([data[0]._id || data[0].id]);
//         }
//       } catch (error) {
//         console.error("Failed to load strategies:", error);
//       }
//     };

//     fetchAndSetStrategies();
    
//     // Dropdown close karne ka logic
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);

//   }, [strategyId]);

//   // ... (Aapke baaki handlers waise hi rahenge: toggleStrategy, removeTag, etc) ...
//   const toggleStrategy = (id) => {
//     if (selectedStrategyIds.includes(id)) {
//       setSelectedStrategyIds(prev => prev.filter(sid => sid !== id));
//     } else {
//       setSelectedStrategyIds(prev => [...prev, id]);
//     }
//   };

//   const removeTag = (id, e) => {
//     e.stopPropagation();
//     setSelectedStrategyIds(prev => prev.filter(sid => sid !== id));
//   };

//   const handlePeriodChange = (period) => {
//     setSelectedPeriod(period);
//     if (period !== 'Custom') {
//         setCustomRange({ start: '', end: '' });
//     }
//   };

//   const getDropdownLabel = () => {
//     if (selectedStrategyIds.length === 0) return "Select Strategies";
//     const names = strategies
//         .filter(s => selectedStrategyIds.includes(s.id || s._id))
//         .map(s => s.name);
//     return names.join(", ");
//   };

//   // --- 🔥 THE NEW REAL API ENGINE 🔥 ---
//  const runBacktest = async () => {
//     if (selectedStrategyIds.length === 0) return;
    
//     setIsLoading(true);
//     setResult(null);

//     try {
//       const API_URL = "https://techwalatrader-algobackend.onrender.com/api"; 
//       const targetId = selectedStrategyIds[0];
      
//       // ✅ THE FIX: API url ke end me '?period=1M' lagaya taaki backend ko pata chale
//       const response = await axios.get(`${API_URL}/backtest/run/${targetId}?period=${selectedPeriod}`);
      
//       if (response.data.success) {
//           const backendData = response.data.data;

//           const formattedResult = {
//               summary: backendData.summary,
//               equityCurve: backendData.equityCurve,
//               transactions: backendData.daywiseBreakdown.map(day => {
//                   const eqData = backendData.equityCurve.find(e => e.date === day.date);
//                   return {
//                       date: day.date,
//                       pnl: day.dailyPnL,
//                       cumulativePnl: eqData ? eqData.pnl : 0,
//                       tradesTaken: day.tradesTaken
//                   };
//               })
//           };

//           setResult(formattedResult);
//       }
//     } catch (error) {
//       console.error("Backtest Failed:", error);
//       alert("Error running backtest. Make sure backend is running.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     // ✅ Main Container: Themed Background & Text
//     <div className="p-4 md:p-6 text-gray-900 dark:text-white min-h-screen bg-gray-100 dark:bg-slate-950 font-sans transition-colors duration-300">
      
//       {/* 1. TOP HEADER */}
//       <div className="flex items-center gap-3 mb-6">
//         <button 
//             onClick={() => navigate(-1)} 
//             className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-white"
//         >
//             <ArrowLeft size={20} />
//         </button>
//         <div>
//             <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Backtesting Suite</h1>
//             <p className="text-gray-500 dark:text-gray-400 text-xs">Test your strategies on historical data</p>
//         </div>
//       </div>

//       {/* 2. CONTROL PANEL */}
//       <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 mb-6 shadow-sm dark:shadow-xl transition-colors duration-300">
          
//           <div className="flex flex-col gap-6">
              
//               {/* ROW 1: SELECTORS */}
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  
//                   {/* A. MULTI-SELECT DROPDOWN */}
//                   <div className="w-full lg:w-1/2 relative" ref={dropdownRef}>
//                       <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Choose Strategies</label>
                      
//                       <div 
//                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                         className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-white cursor-pointer flex justify-between items-center hover:border-gray-400 dark:hover:border-slate-600 transition-colors relative"
//                       >
//                           <span className="truncate pr-4 text-gray-700 dark:text-gray-300">
//                               {getDropdownLabel()}
//                           </span>
//                           <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
//                       </div>

//                       {/* Dropdown Menu */}
//                       {isDropdownOpen && (
//                           <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar p-2">
//                               {strategies.length === 0 && <p className="text-gray-500 text-xs p-2">No strategies found.</p>}
//                               {strategies.map(s => {
//                                   const isSelected = selectedStrategyIds.includes(s.id);
//                                   return (
//                                       <div 
//                                         key={s.id} 
//                                         onClick={() => toggleStrategy(s.id)}
//                                         className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors 
//                                             ${isSelected 
//                                                 ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400' 
//                                                 : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'}`}
//                                       >
//                                           {isSelected ? <CheckSquare size={16} className="text-blue-600 dark:text-blue-500"/> : <Square size={16} className="text-gray-400 dark:text-gray-600"/>}
//                                           <span className="text-sm font-medium">{s.name}</span>
//                                       </div>
//                                   );
//                               })}
//                           </div>
//                       )}
//                   </div>

//                   {/* B. DATE FILTERS */}
//                   <div className="w-full lg:w-auto">
//                       <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block lg:text-right">Time Range</label>
//                       <div className="flex flex-wrap gap-2">
//                           {['1M', '3M', '6M', '1Y', '2Y', 'Custom'].map((p) => (
//                               <button 
//                                 key={p} 
//                                 onClick={() => handlePeriodChange(p)}
//                                 className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all 
//                                 ${selectedPeriod === p 
//                                     ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' 
//                                     : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:border-slate-600 hover:text-gray-900 dark:hover:text-white'
//                                 }`}
//                               >
//                                   {p === 'Custom' ? 'Custom Range' : p === '1M' ? '1 Month' : p === '1Y' ? '1 Year' : p}
//                               </button>
//                           ))}
//                       </div>
//                   </div>
//               </div>

//               {/* ROW 2: TAGS */}
//               {selectedStrategyIds.length > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                       {strategies.filter(s => selectedStrategyIds.includes(s.id)).map(s => (
//                           <div key={s.id} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm animate-in fade-in zoom-in duration-200">
//                               {s.name}
//                               <button onClick={(e) => removeTag(s.id, e)} className="hover:text-blue-200">
//                                   <X size={14} />
//                               </button>
//                           </div>
//                       ))}
//                   </div>
//               )}

//               {/* ROW 3: CUSTOM DATE INPUTS */}
//               {selectedPeriod === 'Custom' && (
//                   <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 dark:bg-slate-950 p-4 rounded-lg border border-gray-200 dark:border-slate-800 animate-in slide-in-from-top-2">
//                       <div className="flex-1">
//                           <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
//                           <div className="relative">
//                             <input 
//                                 type="date" 
//                                 className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
//                                 value={customRange.start}
//                                 onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
//                             />
//                              <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16}/>
//                           </div>
//                       </div>
//                       <div className="flex-1">
//                           <label className="text-xs text-gray-500 mb-1 block">End Date</label>
//                           <div className="relative">
//                             <input 
//                                 type="date" 
//                                 className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
//                                 value={customRange.end}
//                                 onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
//                             />
//                             <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16}/>
//                           </div>
//                       </div>
//                   </div>
//               )}

//               {/* ROW 4: CREDIT BAR & BUTTON */}
//               <div className="mt-2 flex flex-col md:flex-row items-center gap-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg p-1 pr-1 pl-4 transition-colors">
//                   <div className="flex-1 w-full flex items-center gap-2 py-2 md:py-0">
//                       <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Backtest Credit:</span>
//                       <span className="text-sm font-bold text-gray-900 dark:text-white">47/50</span>
//                       <div className="w-24 h-1.5 bg-gray-300 dark:bg-slate-800 rounded-full ml-2 overflow-hidden">
//                           <div className="bg-green-500 h-full w-[94%]"></div>
//                       </div>
//                   </div>
                  
//                   <button 
//                     onClick={runBacktest}
//                     disabled={isLoading || selectedStrategyIds.length === 0}
//                     className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-8 rounded-md font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
//                   >
//                       {isLoading ? <Activity className="animate-spin" size={18}/> : <Play size={18} fill="currentColor" />}
//                       {isLoading ? "Running..." : "Run Backtest"}
//                   </button>
//               </div>

//           </div>
//       </div>

//       {/* 3. RESULTS AREA */}
//       {result && !isLoading && (
//           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
//               <BacktestSummary summary={result.summary} /> 

//               <div className="mt-6">
//                   <EquityCurveChart transactions={[...result.transactions].reverse()} />
//               </div>

//               <div className="mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
//                   <MaxProfitLossChart transactions={result.transactions} summary={result.summary} />
//               </div>

//               <div className="mt-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
//                 <DaywiseBreakdown transactions={result.transactions} period={selectedPeriod} />
//               </div>

//               <div className="mt-6 animate-in fade-in slide-in-from-bottom-12 duration-700 pb-10">
//                   <TransactionTable transactions={result.transactions} />
//               </div>

//           </div>
//       )}

//       {/* 4. EMPTY STATE */}
//       {!result && !isLoading && (
//           <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-xl bg-gray-100 dark:bg-slate-900/30 dark:opacity-50 transition-colors">
//               <div className="bg-white dark:bg-slate-800 p-4 rounded-full mb-4 shadow-sm">
//                   <Activity size={32} className="text-gray-400 dark:text-gray-500" />
//               </div>
//               <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Ready to Simulate</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Select strategies and date range to begin analysis.</p>
//           </div>
//       )}

//     </div>
//   );
// };

// export default Backtest;


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, Activity, ChevronDown, X, Calendar, CheckSquare, Square, Info
} from 'lucide-react';
import axios from 'axios'; 
import { getStrategies } from '../../data/AlogoTrade/strategyService';

import EquityCurveChart from '../../components/algoComponents/Backtest/EquityCurveChart';
import BacktestSummary from '../../components/algoComponents/Backtest/BacktestSummary';
import MaxProfitLossChart from '../../components/algoComponents/Backtest/MaxProfitLossChart';
import DaywiseBreakdown from '../../components/algoComponents/Backtest/DaywiseBreakdown';
import TransactionTable from '../../components/algoComponents/Backtest/TransactionTable';

const Backtest = () => {
  const { strategyId } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [strategies, setStrategies] = useState([]);
  const [selectedStrategyIds, setSelectedStrategyIds] = useState([]); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1M"); 
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🔥 NAYA STATE: Toggle button ke liye
  const [withSlippage, setWithSlippage] = useState(true);


  // --- LOAD STRATEGIES FROM REAL DATABASE ---
  useEffect(() => {
    const fetchAndSetStrategies = async () => {
      try {
        const data = await getStrategies();
        setStrategies(data);
        
        if (strategyId) {
          setSelectedStrategyIds([strategyId]);
        } else if (data && data.length > 0) {
          // ✅ FIXED: MongoDB ka _id pehle check karega
          setSelectedStrategyIds([data[0]._id || data[0].id]);
        }
      } catch (error) {
        console.error("Failed to load strategies:", error);
      }
    };

    fetchAndSetStrategies();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [strategyId]);

  const toggleStrategy = (id) => {
    if (selectedStrategyIds.includes(id)) {
      setSelectedStrategyIds(prev => prev.filter(sid => sid !== id));
    } else {
      setSelectedStrategyIds(prev => [...prev, id]);
    }
  };

  const removeTag = (id, e) => {
    e.stopPropagation();
    setSelectedStrategyIds(prev => prev.filter(sid => sid !== id));
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'Custom') {
        setCustomRange({ start: '', end: '' });
    }
  };

  const getDropdownLabel = () => {
    if (selectedStrategyIds.length === 0) return "Select Strategies";
    const names = strategies
        .filter(s => selectedStrategyIds.includes(s._id || s.id)) // ✅ FIXED
        .map(s => s.name);
    return names.join(", ");
  };

  // --- 🔥 THE NEW REAL API ENGINE 🔥 ---
 const runBacktest = async () => {
    if (selectedStrategyIds.length === 0) return;
    
    setIsLoading(true);
    setResult(null);

    try {
      const API_URL = "https://techwalatrader-algobackend.onrender.com/api"; 
      const targetId = selectedStrategyIds[0];

      // 🔥 FIX: API URL me slippage toggle pass karna
      let requestUrl = `${API_URL}/backtest/run/${targetId}?period=${selectedPeriod}&slippage=${withSlippage}`;
      if (selectedPeriod === 'Custom' && customRange.start && customRange.end) {
          requestUrl += `&start=${customRange.start}&end=${customRange.end}`;
      }
      const response = await axios.get(requestUrl);
        
      
    //   const response = await axios.get(`${API_URL}/backtest/run/${targetId}?period=${selectedPeriod}`);

      // 🔥 FIX: Custom date range API me bhej rahe hain
        
      
      if (response.data.success) {
          const backendData = response.data.data;

          const formattedResult = {
              summary: backendData.summary,
              equityCurve: backendData.equityCurve,
              // 🔥 FIX 1: daywiseBreakdown ko bhi result me save karein
              daywiseBreakdown: backendData.daywiseBreakdown, 
              transactions: backendData.daywiseBreakdown.map(day => {
                  const eqData = backendData.equityCurve.find(e => e.date === day.date);
                  return {
                      date: day.date,
                      pnl: day.dailyPnL,
                      cumulativePnl: eqData ? eqData.pnl : 0,
                      tradesTaken: day.tradesTaken
                  };
              })
          };

          setResult(formattedResult);
      }
    } catch (error) {
      console.error("Backtest Failed:", error);
      
      // Agar backend ne hamara NO_DATA wala error bheja hai
      if (error.response && error.response.data && error.response.data.errorType === "NO_DATA") {
          alert(`⚠️ ${error.response.data.message}`);
      } else {
          alert("❌ Failed to fetch backtest data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 text-gray-900 dark:text-white min-h-screen bg-gray-100 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      <div className="flex items-center gap-3 mb-6">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-white"
        >
            <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Backtesting Suite</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Test your strategies on historical data</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 mb-6 shadow-sm dark:shadow-xl transition-colors duration-300">
          
          <div className="flex flex-col gap-6">
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  
                  <div className="w-full lg:w-1/2 relative" ref={dropdownRef}>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Choose Strategies</label>
                      
                      <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-white cursor-pointer flex justify-between items-center hover:border-gray-400 dark:hover:border-slate-600 transition-colors relative"
                      >
                          <span className="truncate pr-4 text-gray-700 dark:text-gray-300">
                              {getDropdownLabel()}
                          </span>
                          <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                      </div>

                      {isDropdownOpen && (
                          <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar p-2">
                              {strategies.length === 0 && <p className="text-gray-500 text-xs p-2">No strategies found.</p>}
                              {strategies.map(s => {
                                  // ✅ FIXED: Using MongoDB _id safely
                                  const currentId = s._id || s.id;
                                  const isSelected = selectedStrategyIds.includes(currentId);
                                  return (
                                      <div 
                                        key={currentId} 
                                        onClick={() => toggleStrategy(currentId)}
                                        className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors 
                                            ${isSelected 
                                                ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400' 
                                                : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'}`}
                                      >
                                          {isSelected ? <CheckSquare size={16} className="text-blue-600 dark:text-blue-500"/> : <Square size={16} className="text-gray-400 dark:text-gray-600"/>}
                                          <span className="text-sm font-medium">{s.name}</span>
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                  </div>

                  <div className="w-full lg:w-auto">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block lg:text-right">Time Range</label>
                      <div className="flex flex-wrap gap-2">
                          {['1M', '3M', '6M', '1Y', '2Y', 'Custom'].map((p) => (
                              <button 
                                key={p} 
                                onClick={() => handlePeriodChange(p)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all 
                                ${selectedPeriod === p 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:border-slate-600 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                  {p === 'Custom' ? 'Custom Range' : p === '1M' ? '1 Month' : p === '1Y' ? '1 Year' : p}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              {/* ROW 2: TAGS */}
              {selectedStrategyIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                      {/* ✅ FIXED: Use _id for filtering tags too */}
                      {strategies.filter(s => selectedStrategyIds.includes(s._id || s.id)).map(s => {
                          const currentId = s._id || s.id;
                          return (
                          <div key={currentId} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm animate-in fade-in zoom-in duration-200">
                              {s.name}
                              <button onClick={(e) => removeTag(currentId, e)} className="hover:text-blue-200">
                                  <X size={14} />
                              </button>
                          </div>
                      )})}
                  </div>
              )}

              {/* ROW 3: CUSTOM DATE INPUTS */}
              {selectedPeriod === 'Custom' && (
                  <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 dark:bg-slate-950 p-4 rounded-lg border border-gray-200 dark:border-slate-800 animate-in slide-in-from-top-2">
                      <div className="flex-1">
                          <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                          <div className="relative">
                            <input 
                                type="date" 
                                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                value={customRange.start}
                                onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                            />
                             <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16}/>
                          </div>
                      </div>
                      <div className="flex-1">
                          <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                          <div className="relative">
                            <input 
                                type="date" 
                                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                value={customRange.end}
                                onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                            />
                            <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16}/>
                          </div>
                      </div>
                  </div>
              )}

              {/* ROW 4: CREDIT BAR, TOGGLE & BUTTON */}
              <div className="mt-2 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg p-2 pr-2 pl-4 transition-colors">
                  
                  {/* Credit Bar */}
                  <div className="flex-1 w-full flex items-center gap-2 py-2 md:py-0">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Backtest Credit:</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">47/50</span>
                      <div className="w-24 h-1.5 bg-gray-300 dark:bg-slate-800 rounded-full ml-2 overflow-hidden">
                          <div className="bg-green-500 h-full w-[94%]"></div>
                      </div>
                  </div>
                  

                  {/* 🔥 THE SLIPPAGE TOGGLE BUTTON 🔥 */}
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-md border border-gray-200 dark:border-slate-700 shadow-sm relative">
                      
                      {/* INFO ICON & TOOLTIP (Group Hover) */}
                      <div className="flex items-center gap-1 relative group cursor-help">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                              Fill Type:
                          </span>
                          <Info size={14} className="text-gray-400 hover:text-blue-500 transition-colors" />
                          
                          {/* 💡 Tooltip Box (Hidden by default, shows on hover) */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-[280px] p-3 bg-gray-800 dark:bg-slate-700 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800 dark:before:border-t-slate-700">
                              <p className="font-bold text-blue-300 mb-1">Exact Trigger + Gaps:</p>
                              <p className="text-gray-200 mb-3 leading-relaxed">
                                  Exits exactly at your calculated price during smooth market moves. If the market gaps past your Stoploss/Target, it applies realistic slippage using the candle's Open price.
                              </p>
                              <p className="font-bold text-orange-300 mb-1">Always Exit at Open:</p>
                              <p className="text-gray-200 leading-relaxed">
                                  A strict pessimistic mode for worst-case testing. It ignores the exact trigger point and forces the exit at the 1-minute candle's Opening price every time.
                              </p>
                          </div>
                      </div>

                      <button 
                          onClick={() => setWithSlippage(!withSlippage)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${withSlippage ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}
                      >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${withSlippage ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                      <span className={`text-xs font-bold ${withSlippage ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
                          {withSlippage ? 'Exact Trigger + Gaps' : 'Always Exit at Open'}
                      </span>
                  </div>
                  
                  {/* Run Button */}
                  <button 
                    onClick={runBacktest}
                    disabled={isLoading || selectedStrategyIds.length === 0}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-8 rounded-md font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                      {isLoading ? <Activity className="animate-spin" size={18}/> : <Play size={18} fill="currentColor" />}
                      {isLoading ? "Running..." : "Run Backtest"}
                  </button>
              </div>

          </div>
      </div>

      {/* 3. RESULTS AREA */}
      {result && !isLoading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <BacktestSummary summary={result.summary} /> 

              <div className="mt-6">
                  <EquityCurveChart transactions={[...result.transactions].reverse()} />
              </div>

              <div className="mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <MaxProfitLossChart transactions={result.transactions} summary={result.summary} />
              </div>

              <div className="mt-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                {/* <DaywiseBreakdown transactions={result.transactions} period={selectedPeriod} /> */}
                <DaywiseBreakdown data={result.daywiseBreakdown || []} />
              </div>

              <div className="mt-6 animate-in fade-in slide-in-from-bottom-12 duration-700 pb-10">
                  <TransactionTable transactions={result.daywiseBreakdown} />
              </div>

          </div>
      )}

      {/* 4. EMPTY STATE */}
      {!result && !isLoading && (
          <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-xl bg-gray-100 dark:bg-slate-900/30 dark:opacity-50 transition-colors">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-full mb-4 shadow-sm">
                  <Activity size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Ready to Simulate</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Select strategies and date range to begin analysis.</p>
          </div>
      )}

    </div>
  );
};

export default Backtest;


