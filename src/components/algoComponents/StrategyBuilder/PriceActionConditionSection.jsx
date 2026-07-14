// import React from 'react';
// import { Activity, Clock, Target, BarChart2, CheckSquare } from 'lucide-react';

// const PriceActionConditionSection = ({ priceActionSettings, setPriceActionSettings }) => {

//     const handleTrendChange = (e) => {
//         setPriceActionSettings({
//             ...priceActionSettings,
//             startingTrend: e.target.value
//         });
//     };
    
//     // Fallback values if state is not initialized properly yet
//     const settings = priceActionSettings || {
//         masterTimeframe: "15 min",
//         entryTimeframe: "1 min",
//         setupType: "BOS (Break of Structure)",
//         entryTrigger: "Candle Close",
//         volumeConfirmation: false
//     };

//     const handleChange = (field, value) => {
//         setPriceActionSettings(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const timeframes = ["1 min", "3 min", "5 min", "15 min", "30 min", "1H", "4H", "1D"];
//     const setupTypes = [
//         "BOS (Break of Structure)", 
//         "CHoCH (Change of Character)", 
//         "FVG Pullback (Fair Value Gap)", 
//         "Order Block Mitigation", 
//         "Inside Bar Breakout", 
//         "Engulfing Pattern"
//     ];
//     const entryTriggers = ["Candle Close", "Wick Sweep (Liquidity Grab)", "Touch / Limit Order"];

//     return (
//         <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm space-y-6 animate-in fade-in zoom-in duration-300">
            
//             {/* 🏷️ Header */}
//             <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
//                 <Activity className="text-blue-600 dark:text-blue-500" size={20} />
//                 <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//                     Price Action & SMC Setup
//                 </h2>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
//                 {/* ⏱️ LEFT COLUMN: Timeframe Settings */}
//                 <div className="space-y-5">
//                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                         <Clock size={16} className="text-gray-400" /> Timeframe Alignment
//                     </h3>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Master Trend (HTF)
//                             </label>
//                             <select 
//                                 value={settings.masterTimeframe}
//                                 onChange={(e) => handleChange('masterTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                             <p className="text-[10px] text-gray-400">Used for Structure/Trend</p>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Entry Trigger (LTF)
//                             </label>
//                             <select 
//                                 value={settings.entryTimeframe}
//                                 onChange={(e) => handleChange('entryTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                             <p className="text-[10px] text-gray-400">Used for Trade Execution</p>
//                         </div>
//                     </div>

//                     {/* 🔥 NEW: Initial Market Trend Dropdown */}
//                 <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//                         Initial Market Trend (Cold Start)
//                     </label>
//                     <select
//                         value={priceActionSettings.startingTrend || "AUTO"}
//                         onChange={handleTrendChange}
//                         className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
//                     >
//                         <option value="AUTO">🤖 Auto Identify (Smart Flip)</option>
//                         <option value="BULLISH">📈 Force Bullish (Find HH/HL)</option>
//                         <option value="BEARISH">📉 Force Bearish (Find LL/LH)</option>
//                     </select>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Choose how the engine assumes the trend at the start of backtesting.
//                     </p>
//                 </div>
//                 {/* 🔥 NEW: Counter Structure History Dropdown */}
//                 <div>
//                     <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                         Counter Structure History
//                     </label>
//                     <select 
//                         className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         value={priceActionSettings.counterStructureDepth || 0}
//                         onChange={(e) => setPriceActionSettings({ ...priceActionSettings, counterStructureDepth: Number(e.target.value) })}
//                     >
//                         <option value={0}>0 (Strict - No History)</option>
//                         <option value={1}>1 (Keep 1 Previous Wave)</option>
//                         <option value={2}>2 (Keep 2 Previous Waves)</option>
//                     </select>
//                 </div>

//                 {/* 🔥 NEW: Structure Mode Dropdown (Mechanical vs Technical) */}
//                 <div>
//                     <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                         Structure Mode
//                     </label>
//                     <select 
//                         className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         value={priceActionSettings.structureMode || "MECHANICAL"}
//                         onChange={(e) => setPriceActionSettings({ ...priceActionSettings, structureMode: e.target.value })}
//                     >
//                         <option value="MECHANICAL">Mechanical (Standard BOS/CHoCH)</option>
//                         <option value="TECHNICAL">Technical (Transfer of IDM / Single Leg)</option>
//                         <option value="DISCOUNTED">Major Structure (50% Gann / Discounted)</option>
//                     </select>
//                 </div>
//                 </div>

                

//                 {/* 🎯 RIGHT COLUMN: Strategy & Trigger Logic */}
//                 <div className="space-y-5">
//                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                         <Target size={16} className="text-gray-400" /> Execution Logic
//                     </h3>
                    
//                     <div className="space-y-4">
//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Primary Setup Type
//                             </label>
//                             <select 
//                                 value={settings.setupType}
//                                 onChange={(e) => handleChange('setupType', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {setupTypes.map(setup => <option key={setup} value={setup}>{setup}</option>)}
//                             </select>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Confirmation Trigger
//                             </label>
//                             <select 
//                                 value={settings.entryTrigger}
//                                 onChange={(e) => handleChange('entryTrigger', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {entryTriggers.map(trigger => <option key={trigger} value={trigger}>{trigger}</option>)}
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* 🛡️ BOTTOM SECTION: Additional Confirmations */}
//             <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
//                 <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
//                     <CheckSquare size={16} className="text-gray-400" /> Additional Confirmations
//                 </h3>
                
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                     <div className="relative flex items-center justify-center">
//                         <input 
//                             type="checkbox" 
//                             className="sr-only"
//                             checked={settings.volumeConfirmation}
//                             onChange={(e) => handleChange('volumeConfirmation', e.target.checked)}
//                         />
//                         <div className={`w-5 h-5 rounded border ${settings.volumeConfirmation ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-700'} flex items-center justify-center transition-colors group-hover:border-blue-500`}>
//                             {settings.volumeConfirmation && <CheckSquare size={14} className="text-white" />}
//                         </div>
//                     </div>
//                     <div className="flex flex-col">
//                         <span className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1.5">
//                             <BarChart2 size={14} className="text-blue-500" /> Require Volume Confirmation
//                         </span>
//                         <span className="text-[10px] text-gray-500 dark:text-gray-400">
//                             Entry candle volume must be strictly greater than the previous candle's volume.
//                         </span>
//                     </div>
//                 </label>
//             </div>

//         </div>
//     );
// };

// export default PriceActionConditionSection;





// import React from 'react';
// import { Activity, Clock, Target, BarChart2, CheckSquare } from 'lucide-react';

// const PriceActionConditionSection = ({ priceActionSettings, setPriceActionSettings }) => {

//     const handleTrendChange = (e) => {
//         setPriceActionSettings({
//             ...priceActionSettings,
//             startingTrend: e.target.value
//         });
//     };
    
//     // Fallback values if state is not initialized properly yet
//     const settings = priceActionSettings || {
//         masterTimeframe: "15 min",
//         entryTimeframe: "1 min",
//         setupType: "BOS (Break of Structure)",
//         entryTrigger: "Candle Close",
//         volumeConfirmation: false,
//         strictDecisional: false // 🔥 Default state for our new toggle
//     };

//     const handleChange = (field, value) => {
//         setPriceActionSettings(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const timeframes = ["1 min", "3 min", "5 min", "15 min", "30 min", "1H", "4H", "1D"];
//     const setupTypes = [
//         "BOS (Break of Structure)", 
//         "CHoCH (Change of Character)", 
//         "FVG Pullback (Fair Value Gap)", 
//         "Order Block Mitigation", 
//         "Inside Bar Breakout", 
//         "Engulfing Pattern"
//     ];
//     const entryTriggers = ["Candle Close", "Wick Sweep (Liquidity Grab)", "Touch / Limit Order"];

//     return (
//         <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm space-y-6 animate-in fade-in zoom-in duration-300">
            
//             {/* 🏷️ Header */}
//             <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
//                 <Activity className="text-blue-600 dark:text-blue-500" size={20} />
//                 <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//                     Price Action & SMC Setup
//                 </h2>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
//                 {/* ⏱️ LEFT COLUMN: Timeframe Settings */}
//                 <div className="space-y-5">
//                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                         <Clock size={16} className="text-gray-400" /> Timeframe Alignment
//                     </h3>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Master Trend (HTF)
//                             </label>
//                             <select 
//                                 value={settings.masterTimeframe}
//                                 onChange={(e) => handleChange('masterTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                             <p className="text-[10px] text-gray-400">Used for Structure/Trend</p>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Entry Trigger (LTF)
//                             </label>
//                             <select 
//                                 value={settings.entryTimeframe}
//                                 onChange={(e) => handleChange('entryTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                             <p className="text-[10px] text-gray-400">Used for Trade Execution</p>
//                         </div>
//                     </div>

//                     {/* 🔥 Initial Market Trend Dropdown */}
//                 <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//                         Initial Market Trend (Cold Start)
//                     </label>
//                     <select
//                         value={priceActionSettings.startingTrend || "AUTO"}
//                         onChange={handleTrendChange}
//                         className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
//                     >
//                         <option value="AUTO">🤖 Auto Identify (Smart Flip)</option>
//                         <option value="BULLISH">📈 Force Bullish (Find HH/HL)</option>
//                         <option value="BEARISH">📉 Force Bearish (Find LL/LH)</option>
//                     </select>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Choose how the engine assumes the trend at the start of backtesting.
//                     </p>
//                 </div>
//                 {/* 🔥 Counter Structure History Dropdown */}
//                 <div>
//                     <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                         Counter Structure History
//                     </label>
//                     <select 
//                         className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         value={priceActionSettings.counterStructureDepth || 0}
//                         onChange={(e) => setPriceActionSettings({ ...priceActionSettings, counterStructureDepth: Number(e.target.value) })}
//                     >
//                         <option value={0}>0 (Strict - No History)</option>
//                         <option value={1}>1 (Keep 1 Previous Wave)</option>
//                         <option value={2}>2 (Keep 2 Previous Waves)</option>
//                     </select>
//                 </div>

//                 {/* 🔥 Structure Mode Dropdown */}
//                 <div>
//                     <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
//                         Structure Mode
//                     </label>
//                     <select 
//                         className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                         value={priceActionSettings.structureMode || "MECHANICAL"}
//                         onChange={(e) => setPriceActionSettings({ ...priceActionSettings, structureMode: e.target.value })}
//                     >
//                         <option value="MECHANICAL">Mechanical (Standard BOS/CHoCH)</option>
//                         <option value="TECHNICAL">Technical (Transfer of IDM / Single Leg)</option>
//                         <option value="DISCOUNTED">Major Structure (50% Gann / Discounted)</option>
//                     </select>
//                 </div>

//                 {/* 🚀 FIXED: Main Structure Mapping Mode (Strict 50% vs Free Decisional) */}
//                 <div className="pt-2">
//                     <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
//                         Main Structure Decisional Zones (D-OB / D-OF)
//                     </label>
//                     <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
//                         <button
//                             type="button"
//                             onClick={() => handleChange('strictDecisional', true)}
//                             className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                 settings.strictDecisional === true 
//                                     ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
//                                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                             }`}
//                         >
//                             Strict 50% (P/D Only)
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => handleChange('strictDecisional', false)}
//                             className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                 settings.strictDecisional === false || settings.strictDecisional === undefined
//                                     ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
//                                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                             }`}
//                         >
//                             Free Decisional (Anywhere)
//                         </button>
//                     </div>
//                     <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
//                         {settings.strictDecisional 
//                             ? "D-OB/D-OF will only print if they are inside the 50% Premium/Discount zone. Very safe." 
//                             : "D-OB/D-OF will print freely near the IDM, even outside the 50% zone. Best for Runaway Trends."}
//                     </p>
//                 </div>

//                 {/* 🚀 NEW: Counter Structure Mapping Mode (YAHAN CONDITIONAL RENDERING LAGAYA HAI) */}
//                 {/* Agar strictDecisional FALSE hai (Free Decisional mode), tabhi ye block UI me dikhega */}
//                 {!settings.strictDecisional && (
//                     <div className="pt-3 border-t border-gray-100 dark:border-slate-800 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
//                         <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
//                             Counter Structure (D2S / S2D) Mapping
//                         </label>
//                         <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
//                             <button
//                                 type="button"
//                                 onClick={() => handleChange('strictCounter', true)}
//                                 className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                     settings.strictCounter !== false 
//                                         ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
//                                         : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                 }`}
//                             >
//                                 Strict (Extreme Only)
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => handleChange('strictCounter', false)}
//                                 className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                     settings.strictCounter === false
//                                         ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
//                                         : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                 }`}
//                             >
//                                 Every Pullback Mapping
//                             </button>
//                         </div>
//                         <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
//                             {settings.strictCounter !== false
//                                 ? "Prints ONLY the Extreme Origin (E-D2S/E-S2D). Keeps the chart clean for safe counter-trades." 
//                                 : "Maps every internal pullback (IDM, D-OB) inside the counter trend. Best for scalpers."}
//                         </p>
//                     </div>

                    
//                 )}

//                 {/* 🔥 NEW: Major Structure Toggle (Sirf Strict 50% mode mein dikhega) */}
//                 {settings.strictDecisional === true && (
//                     <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 animate-in fade-in duration-300">
//                         <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
//                             Major Structure Filtering
//                         </label>
//                         <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
//                             <button
//                                 type="button"
//                                 onClick={() => handleChange('majorOnly', false)}
//                                 className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                     settings.majorOnly === false || settings.majorOnly === undefined
//                                         ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
//                                         : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//                                 }`}
//                             >
//                                 Default
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => handleChange('majorOnly', true)}
//                                 className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                     settings.majorOnly === true 
//                                         ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
//                                         : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
//                                 }`}
//                             >
//                                 Major Only
//                             </button>
//                         </div>
//                         <p className="text-[10px] text-gray-400 mt-1.5">
//                             {settings.majorOnly 
//                                 ? "Showing ONLY Major BOS/CHoCH/IDM लेबल्स. Internal structure hidden." 
//                                 : "Showing everything (Major + Technical Internal structure)."}
//                         </p>
//                     </div>
//                 )}


//                 {/* Strategy Builder UI - Counter Structure Customization */}
//               <div className="grid grid-cols-2 gap-3 mt-3">
//                 {/* 1. D-D2S(OB) Checkbox */}
//                 <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer">
//                     <input 
//                         type="checkbox" 
//                         checked={priceActionSettings.showD2S_DOB} 
//                         onChange={(e) => setPriceActionSettings({...priceActionSettings, showD2S_DOB: e.target.checked})}
//                         className="rounded text-blue-500 bg-gray-800 border-gray-600 focus:ring-0"
//                     />
//                     <span>Show Decisional Counter OB - D-D2S(OB)</span>
//                 </label>

//                 {/* 2. D-D2S(OF) Checkbox */}
//                 <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer">
//                     <input 
//                         type="checkbox" 
//                         checked={priceActionSettings.showD2S_DOF} 
//                         // 🔥 FIX: yahan DOF karna zaroori tha
//                         onChange={(e) => setPriceActionSettings({...priceActionSettings, showD2S_DOF: e.target.checked})}
//                         className="rounded text-blue-500 bg-gray-800 border-gray-600 focus:ring-0"
//                     />
//                     <span>Show Decisional Counter OF - D-D2S(OF)</span>
//                 </label>

//                 {/* 3. E-D2S(OB) Checkbox */}
//                 <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer">
//                     <input 
//                         type="checkbox" 
//                         checked={priceActionSettings.showD2S_EOB} 
//                         // 🔥 FIX: yahan EOB karna zaroori tha
//                         onChange={(e) => setPriceActionSettings({...priceActionSettings, showD2S_EOB: e.target.checked})}
//                         className="rounded text-blue-500 bg-gray-800 border-gray-600 focus:ring-0"
//                     />
//                     <span>Show Extreme Counter OB - E-D2S(OB)</span>
//                 </label>

//                 {/* 4. E-D2S(EOF) Checkbox */}
//                 <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer">
//                     <input 
//                         type="checkbox" 
//                         checked={priceActionSettings.showD2S_EOF} 
//                         // 🔥 FIX: yahan EOF karna zaroori tha
//                         onChange={(e) => setPriceActionSettings({...priceActionSettings, showD2S_EOF: e.target.checked})}
//                         className="rounded text-blue-500 bg-gray-800 border-gray-600 focus:ring-0"
//                     />
//                     <span>Show Extreme Counter OF - E-D2S(EOF)</span>
//                 </label>
//             </div>


//                 </div>

//                 {/* 🎯 RIGHT COLUMN: Strategy & Trigger Logic */}
//                 <div className="space-y-5">
//                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                         <Target size={16} className="text-gray-400" /> Execution Logic
//                     </h3>
                    
//                     <div className="space-y-4">
//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Primary Setup Type
//                             </label>
//                             <select 
//                                 value={settings.setupType}
//                                 onChange={(e) => handleChange('setupType', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {setupTypes.map(setup => <option key={setup} value={setup}>{setup}</option>)}
//                             </select>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
//                                 Confirmation Trigger
//                             </label>
//                             <select 
//                                 value={settings.entryTrigger}
//                                 onChange={(e) => handleChange('entryTrigger', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {entryTriggers.map(trigger => <option key={trigger} value={trigger}>{trigger}</option>)}
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* 🛡️ BOTTOM SECTION: Additional Confirmations */}
//             <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
//                 <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
//                     <CheckSquare size={16} className="text-gray-400" /> Additional Confirmations
//                 </h3>
                
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                     <div className="relative flex items-center justify-center">
//                         <input 
//                             type="checkbox" 
//                             className="sr-only"
//                             checked={settings.volumeConfirmation}
//                             onChange={(e) => handleChange('volumeConfirmation', e.target.checked)}
//                         />
//                         <div className={`w-5 h-5 rounded border ${settings.volumeConfirmation ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-700'} flex items-center justify-center transition-colors group-hover:border-blue-500`}>
//                             {settings.volumeConfirmation && <CheckSquare size={14} className="text-white" />}
//                         </div>
//                     </div>
//                     <div className="flex flex-col">
//                         <span className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1.5">
//                             <BarChart2 size={14} className="text-blue-500" /> Require Volume Confirmation
//                         </span>
//                         <span className="text-[10px] text-gray-500 dark:text-gray-400">
//                             Entry candle volume must be strictly greater than the previous candle's volume.
//                         </span>
//                     </div>
//                 </label>
//             </div>

//         </div>
//     );
// };

// export default PriceActionConditionSection;




// import React from 'react';
// import { Activity, Clock, Target, BarChart2, CheckSquare } from 'lucide-react';

// const PriceActionConditionSection = ({ priceActionSettings, setPriceActionSettings }) => {

//     const handleTrendChange = (e) => {
//         setPriceActionSettings({
//             ...priceActionSettings,
//             startingTrend: e.target.value
//         });
//     };
    
//     // Fallback values if state is not initialized properly yet
//     const settings = priceActionSettings || {
//         masterTimeframe: "15 min",
//         entryTimeframe: "1 min",
//         setupType: "BOS (Break of Structure)",
//         entryTrigger: "Candle Close",
//         volumeConfirmation: false,
//         structureMode: "DISCOUNTED",
//         strictDecisional: false,
//         strictCounter: false,
//         majorOnly: false,
//         showD2S_DOB: true,
//         showD2S_DOF: true,
//         showD2S_EOB: true,
//         showD2S_EOF: true
//     };

//     const handleChange = (field, value) => {
//         setPriceActionSettings(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const timeframes = ["1 min", "3 min", "5 min", "15 min", "30 min", "1H", "4H", "1D"];
//     const setupTypes = [
//         "BOS (Break of Structure)", 
//         "CHoCH (Change of Character)", 
//         "FVG Pullback (Fair Value Gap)", 
//         "Order Block Mitigation", 
//         "Inside Bar Breakout", 
//         "Engulfing Pattern"
//     ];
//     const entryTriggers = ["Candle Close", "Wick Sweep (Liquidity Grab)", "Touch / Limit Order"];

//     return (
//         <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm space-y-6 animate-in fade-in zoom-in duration-300">
            
//             {/* 🏷️ Header */}
//             <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
//                 <Activity className="text-blue-600 dark:text-blue-500" size={20} />
//                 <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//                     Price Action & SMC Setup
//                 </h2>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
//                 {/* ⏱️ LEFT COLUMN: Timeframe & Structure Settings */}
//                 <div className="space-y-5">
//                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                         <Clock size={16} className="text-gray-400" /> Timeframe Alignment
//                     </h3>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Master Trend (HTF)</label>
//                             <select 
//                                 value={settings.masterTimeframe}
//                                 onChange={(e) => handleChange('masterTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                             <p className="text-[10px] text-gray-400">Used for Structure/Trend</p>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Entry Trigger (LTF)</label>
//                             <select 
//                                 value={settings.entryTimeframe}
//                                 onChange={(e) => handleChange('entryTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                             <p className="text-[10px] text-gray-400">Used for Trade Execution</p>
//                         </div>
//                     </div>

//                     {/* 🔥 Initial Market Trend Dropdown */}
//                     <div className="space-y-2">
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Initial Market Trend (Cold Start)</label>
//                         <select
//                             value={settings.startingTrend || "AUTO"}
//                             onChange={handleTrendChange}
//                             className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
//                         >
//                             <option value="AUTO">🤖 Auto Identify (Smart Flip)</option>
//                             <option value="BULLISH">📈 Force Bullish (Find HH/HL)</option>
//                             <option value="BEARISH">📉 Force Bearish (Find LL/LH)</option>
//                         </select>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Choose how the engine assumes the trend at the start of backtesting.</p>
//                     </div>

//                     {/* 🔥 Counter Structure History Dropdown */}
//                     <div>
//                         <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Counter Structure History</label>
//                         <select 
//                             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                             value={settings.counterStructureDepth || 0}
//                             onChange={(e) => handleChange('counterStructureDepth', Number(e.target.value))}
//                         >
//                             <option value={0}>0 (Strict - No History)</option>
//                             <option value={1}>1 (Keep 1 Previous Wave)</option>
//                             <option value={2}>2 (Keep 2 Previous Waves)</option>
//                         </select>
//                     </div>

//                     {/* 🔥 Structure Mode Dropdown (ALWAYS VISIBLE) */}
//                     <div>
//                         <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Structure Mode</label>
//                         <select 
//                             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                             value={settings.structureMode || "DISCOUNTED"}
//                             onChange={(e) => handleChange('structureMode', e.target.value)}
//                         >
//                             <option value="MECHANICAL">Mechanical (Standard BOS/CHoCH)</option>
//                             <option value="TECHNICAL">Technical (Transfer of IDM / Single Leg)</option>
//                             <option value="DISCOUNTED">Major Structure (50% Gann / Discounted)</option>
//                         </select>
//                     </div>

//                     {/* ===================================================================== */}
//                     {/* 🔮 CONDITIONAL RENDERING: Sirf DISCOUNTED mode me dikhega */}
//                     {/* ===================================================================== */}
//                     {settings.structureMode === "DISCOUNTED" && (
//                         <div className="relative mt-6 p-4 md:p-5 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-900/10 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                            
//                             {/* 🏷️ सुंदर सा ग्रुप टाइटल (Badge) */}
//                             <div className="absolute -top-2.5 left-4 bg-white dark:bg-slate-900 px-3 py-0.5 text-[10px] font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase rounded-full border border-indigo-200 dark:border-indigo-800 shadow-sm">
//                                 Advanced Discounted Controls
//                             </div>
                            
//                             {/* 1. Main Structure Mapping Mode */}
//                             <div>
//                                 <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Main Structure Decisional Zones (D-OB / D-OF)</label>
//                                 <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//                                     <button
//                                         type="button"
//                                         onClick={() => handleChange('strictDecisional', true)}
//                                         className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                             settings.strictDecisional === true 
//                                                 ? 'bg-indigo-500 text-white shadow-md' 
//                                                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                         }`}
//                                     >
//                                         Strict 50% (P/D Only)
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleChange('strictDecisional', false)}
//                                         className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                             settings.strictDecisional === false || settings.strictDecisional === undefined
//                                                 ? 'bg-indigo-500 text-white shadow-md' 
//                                                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                         }`}
//                                     >
//                                         Free Decisional (Anywhere)
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* 2. Counter Structure Mapping Mode */}
//                             {!settings.strictDecisional && (
//                                 <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                                     <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Counter Structure (D2S / S2D) Mapping</label>
//                                     <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//                                         <button
//                                             type="button"
//                                             onClick={() => handleChange('strictCounter', true)}
//                                             className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                                 settings.strictCounter !== false 
//                                                     ? 'bg-indigo-500 text-white shadow-md' 
//                                                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                             }`}
//                                         >
//                                             Strict (Extreme Only)
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => handleChange('strictCounter', false)}
//                                             className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                                 settings.strictCounter === false
//                                                     ? 'bg-indigo-500 text-white shadow-md' 
//                                                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                             }`}
//                                         >
//                                             Every Pullback Mapping
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* 3. Major Structure Filtering */}
//                             {settings.strictDecisional === true && (
//                                 <div className="animate-in fade-in duration-300">
//                                     <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Major Structure Filtering</label>
//                                     <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//                                         <button
//                                             type="button"
//                                             onClick={() => handleChange('majorOnly', false)}
//                                             className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                                 settings.majorOnly === false || settings.majorOnly === undefined
//                                                     ? 'bg-indigo-500 text-white shadow-md' 
//                                                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                             }`}
//                                         >
//                                             Default
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => handleChange('majorOnly', true)}
//                                             className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
//                                                 settings.majorOnly === true 
//                                                     ? 'bg-indigo-500 text-white shadow-md' 
//                                                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
//                                             }`}
//                                         >
//                                             Major Only
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* 4. Checkbox Section */}
//                             <div className="pt-3 border-t border-indigo-200/50 dark:border-indigo-800/50">
//                                 <label className="block text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-3">
//                                     Counter Structure OB/OF View Control
//                                 </label>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                     <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
//                                         <input type="checkbox" checked={settings.showD2S_DOB !== false} onChange={(e) => handleChange('showD2S_DOB', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
//                                         <span>Decisional Counter OB</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
//                                         <input type="checkbox" checked={settings.showD2S_DOF !== false} onChange={(e) => handleChange('showD2S_DOF', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
//                                         <span>Decisional Counter OF</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
//                                         <input type="checkbox" checked={settings.showD2S_EOB !== false} onChange={(e) => handleChange('showD2S_EOB', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
//                                         <span>Extreme Counter OB</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
//                                         <input type="checkbox" checked={settings.showD2S_EOF !== false} onChange={(e) => handleChange('showD2S_EOF', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
//                                         <span>Extreme Counter OF</span>
//                                     </label>
//                                 </div>
//                             </div>

//                         </div>
//                     )}

//                 </div>

//                 {/* 🎯 RIGHT COLUMN: Strategy & Trigger Logic */}
//                 <div className="space-y-5">
//                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                         <Target size={16} className="text-gray-400" /> Execution Logic
//                     </h3>
                    
//                     <div className="space-y-4">
//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Primary Setup Type</label>
//                             <select 
//                                 value={settings.setupType}
//                                 onChange={(e) => handleChange('setupType', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {setupTypes.map(setup => <option key={setup} value={setup}>{setup}</option>)}
//                             </select>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Confirmation Trigger</label>
//                             <select 
//                                 value={settings.entryTrigger}
//                                 onChange={(e) => handleChange('entryTrigger', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {entryTriggers.map(trigger => <option key={trigger} value={trigger}>{trigger}</option>)}
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* 🛡️ BOTTOM SECTION: Additional Confirmations */}
//             <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
//                 <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
//                     <CheckSquare size={16} className="text-gray-400" /> Additional Confirmations
//                 </h3>
                
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                     <div className="relative flex items-center justify-center">
//                         <input 
//                             type="checkbox" 
//                             className="sr-only"
//                             checked={settings.volumeConfirmation}
//                             onChange={(e) => handleChange('volumeConfirmation', e.target.checked)}
//                         />
//                         <div className={`w-5 h-5 rounded border ${settings.volumeConfirmation ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-700'} flex items-center justify-center transition-colors group-hover:border-blue-500`}>
//                             {settings.volumeConfirmation && <CheckSquare size={14} className="text-white" />}
//                         </div>
//                     </div>
//                     <div className="flex flex-col">
//                         <span className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1.5">
//                             <BarChart2 size={14} className="text-blue-500" /> Require Volume Confirmation
//                         </span>
//                         <span className="text-[10px] text-gray-500 dark:text-gray-400">
//                             Entry candle volume must be strictly greater than the previous candle's volume.
//                         </span>
//                     </div>
//                 </label>
//             </div>

//         </div>
//     );
// };

// export default PriceActionConditionSection;


import React from 'react';
import { Activity, Clock, BarChart2, CheckSquare, Compass } from 'lucide-react';
import ExecutionLogic from './ExecutionLogic';


const PriceActionConditionSection = ({ 
    priceActionSettings, setPriceActionSettings,
    activeLegIndex, activeLegData, onSaveToLeg
}) => {

    const handleTrendChange = (e) => {
        setPriceActionSettings({
            ...priceActionSettings,
            startingTrend: e.target.value
        });
    };
    
    // Fallback values if state is not initialized properly yet
    const settings = priceActionSettings || {
        masterTimeframe: "15 min",
        entryTimeframe: "1 min",
        volumeConfirmation: false,
        structureMode: "DISCOUNTED",
        strictDecisional: false,
        strictCounter: false,
        majorOnly: false,
        showD2S_DOB: true,
        showD2S_DOF: true,
        showD2S_EOB: true,
        showD2S_EOF: true
    };

    const handleChange = (field, value) => {
        setPriceActionSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const timeframes = ["1 min", "3 min", "5 min", "15 min", "30 min", "1H", "4H", "1D"];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm space-y-6 animate-in fade-in zoom-in duration-300">
            
            {/* 🏷️ Header */}
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
                <Activity className="text-blue-600 dark:text-blue-500" size={20} />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Price Action & SMC Setup
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ⏱️ LEFT COLUMN: Timeframe & Structure Settings */}
                <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" /> Timeframe Alignment
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Master Trend (HTF)</label>
                            <select 
                                value={settings.masterTimeframe}
                                onChange={(e) => handleChange('masterTimeframe', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                            </select>
                            <p className="text-[10px] text-gray-400">Used for Structure/Trend</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Entry Trigger (LTF)</label>
                            <select 
                                value={settings.entryTimeframe}
                                onChange={(e) => handleChange('entryTimeframe', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                            </select>
                            <p className="text-[10px] text-gray-400">Used for Trade Execution</p>
                        </div>
                    </div>

                    {/* 🔥 Counter Structure History Dropdown */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Counter Structure History</label>
                        <select 
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={settings.counterStructureDepth || 0}
                            onChange={(e) => handleChange('counterStructureDepth', Number(e.target.value))}
                        >
                            <option value={0}>0 (Strict - No History)</option>
                            <option value={1}>1 (Keep 1 Previous Wave)</option>
                            <option value={2}>2 (Keep 2 Previous Waves)</option>
                        </select>
                    </div>

                    {/* 🔥 Structure Mode Dropdown */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Structure Mode</label>
                        <select 
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={settings.structureMode || "DISCOUNTED"}
                            onChange={(e) => handleChange('structureMode', e.target.value)}
                        >
                            <option value="MECHANICAL">Mechanical (Standard BOS/CHoCH)</option>
                            <option value="TECHNICAL">Technical (Transfer of IDM / Single Leg)</option>
                            <option value="DISCOUNTED">Major Structure (50% Gann / Discounted)</option>
                        </select>
                    </div>

                    {/* 🔮 CONDITIONAL RENDERING: Sirf DISCOUNTED mode me dikhega */}
                    {settings.structureMode === "DISCOUNTED" && (
                        <div className="relative mt-6 p-4 md:p-5 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-900/10 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                            
                            <div className="absolute -top-2.5 left-4 bg-white dark:bg-slate-900 px-3 py-0.5 text-[10px] font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase rounded-full border border-indigo-200 dark:border-indigo-800 shadow-sm">
                                Advanced Discounted Controls
                            </div>
                            
                            {/* 1. Main Structure Mapping Mode */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Main Structure Decisional Zones (D-OB / D-OF)</label>
                                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => handleChange('strictDecisional', true)}
                                        className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
                                            settings.strictDecisional === true 
                                                ? 'bg-indigo-500 text-white shadow-md' 
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        Strict 50% (P/D Only)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleChange('strictDecisional', false)}
                                        className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
                                            settings.strictDecisional === false || settings.strictDecisional === undefined
                                                ? 'bg-indigo-500 text-white shadow-md' 
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        Free Decisional (Anywhere)
                                    </button>
                                </div>
                            </div>

                            {/* 2. Counter Structure Mapping Mode */}
                            {!settings.strictDecisional && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Counter Structure (D2S / S2D) Mapping</label>
                                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleChange('strictCounter', true)}
                                            className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
                                                settings.strictCounter !== false 
                                                    ? 'bg-indigo-500 text-white shadow-md' 
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            Strict (Extreme Only)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChange('strictCounter', false)}
                                            className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
                                                settings.strictCounter === false
                                                    ? 'bg-indigo-500 text-white shadow-md' 
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            Every Pullback Mapping
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 3. Major Structure Filtering */}
                            {settings.strictDecisional === true && (
                                <div className="animate-in fade-in duration-300">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Major Structure Filtering</label>
                                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleChange('majorOnly', false)}
                                            className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
                                                settings.majorOnly === false || settings.majorOnly === undefined
                                                    ? 'bg-indigo-500 text-white shadow-md' 
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            Default
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleChange('majorOnly', true)}
                                            className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${
                                                settings.majorOnly === true 
                                                    ? 'bg-indigo-500 text-white shadow-md' 
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            Major Only
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 4. Checkbox Section */}
                            <div className="pt-3 border-t border-indigo-200/50 dark:border-indigo-800/50">
                                <label className="block text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-3">
                                    Counter Structure OB/OF View Control
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <input type="checkbox" checked={settings.showD2S_DOB !== false} onChange={(e) => handleChange('showD2S_DOB', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
                                        <span>Decisional Counter OB</span>
                                    </label>
                                    <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <input type="checkbox" checked={settings.showD2S_DOF !== false} onChange={(e) => handleChange('showD2S_DOF', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
                                        <span>Decisional Counter OF</span>
                                    </label>
                                    <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <input type="checkbox" checked={settings.showD2S_EOB !== false} onChange={(e) => handleChange('showD2S_EOB', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
                                        <span>Extreme Counter OB</span>
                                    </label>
                                    <label className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <input type="checkbox" checked={settings.showD2S_EOF !== false} onChange={(e) => handleChange('showD2S_EOF', e.target.checked)} className="rounded text-indigo-500 focus:ring-0 bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600" />
                                        <span>Extreme Counter OF</span>
                                    </label>
                                </div>
                            </div>

                        </div>
                    )}

                </div>

                {/* 🧭 RIGHT COLUMN: Direction & Market State */}
                <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Compass size={16} className="text-gray-400" /> Execution Logic
                    </h3>
                    
                    <div className="space-y-4">
                        <ExecutionLogic 
                            activeLegIndex={activeLegIndex}
                            activeLegData={activeLegData}
                            onSaveToLeg={onSaveToLeg}
                        />

                    </div>
                </div>
            </div>

            {/* 🛡️ BOTTOM SECTION: Additional Confirmations */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                    <CheckSquare size={16} className="text-gray-400" /> Additional Confirmations
                </h3>
                
                <label className="flex items-center gap-3 cursor-pointer group w-max">
                    <div className="relative flex items-center justify-center">
                        <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={settings.volumeConfirmation}
                            onChange={(e) => handleChange('volumeConfirmation', e.target.checked)}
                        />
                        <div className={`w-5 h-5 rounded border ${settings.volumeConfirmation ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-700'} flex items-center justify-center transition-colors group-hover:border-blue-500`}>
                            {settings.volumeConfirmation && <CheckSquare size={14} className="text-white" />}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1.5">
                            <BarChart2 size={14} className="text-blue-500" /> Require Volume Confirmation
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            Entry candle volume must be strictly greater than the previous candle's volume.
                        </span>
                    </div>
                </label>
            </div>

        </div>
    );
};

export default PriceActionConditionSection;


// import React from 'react';
// import { Activity, Clock, BarChart2, CheckSquare } from 'lucide-react';

// // 👇 1. ExecutionLogic को यहाँ इम्पोर्ट करें
// import ExecutionLogic from './ExecutionLogic'; // पाथ अपने हिसाब से एडजस्ट कर लें

// // 👇 2. Props में activeLegIndex, activeLegData, onSaveToLeg को रिसीव करें
// const PriceActionConditionSection = ({ 
//     priceActionSettings, setPriceActionSettings,
//     activeLegIndex, activeLegData, onSaveToLeg
// }) => {

//     const settings = priceActionSettings || {
//         masterTimeframe: "15 min",
//         entryTimeframe: "1 min",
//         volumeConfirmation: false,
//         structureMode: "DISCOUNTED",
//         strictDecisional: false,
//         strictCounter: false,
//         majorOnly: false,
//         showD2S_DOB: true,
//         showD2S_DOF: true,
//         showD2S_EOB: true,
//         showD2S_EOF: true
//     };

//     const handleChange = (field, value) => {
//         setPriceActionSettings(prev => ({ ...prev, [field]: value }));
//     };

//     const timeframes = ["1 min", "3 min", "5 min", "15 min", "30 min", "1H", "4H", "1D"];

//     return (
//         <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm animate-in fade-in zoom-in duration-300">
            
//             {/* 🏷️ Header */}
//             <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3 mb-6">
//                 <Activity className="text-blue-600 dark:text-blue-500" size={20} />
//                 <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//                     Price Action & SMC Setup
//                 </h2>
//             </div>

//             {/* 👇 3. यहाँ से 2-कॉलम ग्रिड शुरू होता है */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
//                 {/* ⏱️ LEFT COLUMN: Timeframe & Structure Settings */}
//                 <div className="space-y-5">
//                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                         <Clock size={16} className="text-gray-400" /> Timeframe Alignment
//                     </h3>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Master Trend (HTF)</label>
//                             <select 
//                                 value={settings.masterTimeframe}
//                                 onChange={(e) => handleChange('masterTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Entry Trigger (LTF)</label>
//                             <select 
//                                 value={settings.entryTimeframe}
//                                 onChange={(e) => handleChange('entryTimeframe', e.target.value)}
//                                 className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                             >
//                                 {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Counter Structure History */}
//                     <div>
//                         <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Counter Structure History</label>
//                         <select 
//                             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                             value={settings.counterStructureDepth || 0}
//                             onChange={(e) => handleChange('counterStructureDepth', Number(e.target.value))}
//                         >
//                             <option value={0}>0 (Strict - No History)</option>
//                             <option value={1}>1 (Keep 1 Previous Wave)</option>
//                             <option value={2}>2 (Keep 2 Previous Waves)</option>
//                         </select>
//                     </div>

//                     {/* Structure Mode Dropdown */}
//                     <div>
//                         <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Structure Mode</label>
//                         <select 
//                             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                             value={settings.structureMode || "DISCOUNTED"}
//                             onChange={(e) => handleChange('structureMode', e.target.value)}
//                         >
//                             <option value="MECHANICAL">Mechanical (Standard BOS/CHoCH)</option>
//                             <option value="TECHNICAL">Technical (Transfer of IDM / Single Leg)</option>
//                             <option value="DISCOUNTED">Major Structure (50% Gann / Discounted)</option>
//                         </select>
//                     </div>

//                     {/* DISCOUNTED MODE SETTINGS */}
//                     {settings.structureMode === "DISCOUNTED" && (
//                         <div className="relative mt-6 p-4 md:p-5 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-900/10 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
//                             <div className="absolute -top-2.5 left-4 bg-white dark:bg-slate-900 px-3 py-0.5 text-[10px] font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase rounded-full border border-indigo-200 dark:border-indigo-800 shadow-sm">
//                                 Advanced Discounted Controls
//                             </div>
                            
//                             <div>
//                                 <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Main Structure Decisional Zones</label>
//                                 <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//                                     <button type="button" onClick={() => handleChange('strictDecisional', true)} className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${settings.strictDecisional === true ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400'}`}>Strict 50% (P/D Only)</button>
//                                     <button type="button" onClick={() => handleChange('strictDecisional', false)} className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${settings.strictDecisional === false || settings.strictDecisional === undefined ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400'}`}>Free Decisional (Anywhere)</button>
//                                 </div>
//                             </div>

//                             {!settings.strictDecisional && (
//                                 <div>
//                                     <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Counter Structure Mapping</label>
//                                     <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//                                         <button type="button" onClick={() => handleChange('strictCounter', true)} className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${settings.strictCounter !== false ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400'}`}>Strict (Extreme Only)</button>
//                                         <button type="button" onClick={() => handleChange('strictCounter', false)} className={`flex-1 text-xs py-2 px-2 rounded-md font-medium transition-all ${settings.strictCounter === false ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400'}`}>Every Pullback Mapping</button>
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="pt-3 border-t border-indigo-200/50 dark:border-indigo-800/50">
//                                 <label className="block text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-3">Counter Structure View Control</label>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                     <label className="flex items-center space-x-2 text-xs"><input type="checkbox" checked={settings.showD2S_DOB !== false} onChange={(e) => handleChange('showD2S_DOB', e.target.checked)} className="rounded text-indigo-500" /><span>Decisional Counter OB</span></label>
//                                     <label className="flex items-center space-x-2 text-xs"><input type="checkbox" checked={settings.showD2S_DOF !== false} onChange={(e) => handleChange('showD2S_DOF', e.target.checked)} className="rounded text-indigo-500" /><span>Decisional Counter OF</span></label>
//                                     <label className="flex items-center space-x-2 text-xs"><input type="checkbox" checked={settings.showD2S_EOB !== false} onChange={(e) => handleChange('showD2S_EOB', e.target.checked)} className="rounded text-indigo-500" /><span>Extreme Counter OB</span></label>
//                                     <label className="flex items-center space-x-2 text-xs"><input type="checkbox" checked={settings.showD2S_EOF !== false} onChange={(e) => handleChange('showD2S_EOF', e.target.checked)} className="rounded text-indigo-500" /><span>Extreme Counter OF</span></label>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Additional Confirmations */}
//                     <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
//                         <label className="flex items-center gap-3 cursor-pointer group w-max">
//                             <input type="checkbox" className="sr-only" checked={settings.volumeConfirmation} onChange={(e) => handleChange('volumeConfirmation', e.target.checked)} />
//                             <div className={`w-5 h-5 rounded border ${settings.volumeConfirmation ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 border-gray-300'} flex items-center justify-center`}>
//                                 {settings.volumeConfirmation && <CheckSquare size={14} className="text-white" />}
//                             </div>
//                             <div className="flex flex-col">
//                                 <span className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1.5"><BarChart2 size={14} className="text-blue-500" /> Require Volume Confirmation</span>
//                             </div>
//                         </label>
//                     </div>

//                 </div>

//                 {/* 🎯 RIGHT COLUMN: Execution Logic (अब बॉक्स के अंदर है!) */}
//                 <div className="h-full border-l border-gray-100 dark:border-slate-800 pl-0 lg:pl-8">
//                     {/* ExecutionLogic को यहाँ कॉल करें */}
                    // <ExecutionLogic 
                    //     activeLegIndex={activeLegIndex}
                    //     activeLegData={activeLegData}
                    //     onSaveToLeg={onSaveToLeg}
                    // />
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default PriceActionConditionSection;