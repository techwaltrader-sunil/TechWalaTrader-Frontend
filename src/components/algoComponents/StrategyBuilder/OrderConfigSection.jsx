
// import React from 'react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// const OrderConfigSection = ({ config, setConfig, isComingSoon, strategyType, entrySettings }) => {
  
//   const toggleDay = (day) => {
//     config.days.includes(day) 
//       ? setConfig({ ...config, days: config.days.filter(d => d !== day) })
//       : setConfig({ ...config, days: [...config.days, day] });
//   };

//   const updateConfig = (key, value) => {
//     setConfig({ ...config, [key]: value });
//   };

//   // Slider Background Logic
//   const getSliderStyle = (value) => {
//     const max = 4; 
//     const percentage = (value / max) * 100;
//     return {
//       background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #64748b ${percentage}%, #64748b 100%)`
//     };
//   };

//   const isSpecialChart = entrySettings?.useCombinedChart || entrySettings?.useOptionsChart;
  
//   let transactionList = ['Both Side', 'Only Long', 'Only Short'];
//   if (isSpecialChart) {
//       transactionList = ['Only Long', 'Only Short'];
//   }

//   return (
//     // ✅ Main Container: Light (White) | Dark (Slate-800)
//     <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative h-full shadow-sm dark:shadow-none transition-colors duration-300">
      
//       {isComingSoon && <ComingSoonOverlay />}
      
//       <h3 className="font-bold mb-4 text-lg text-gray-800 dark:text-white">Order Type</h3>
      
//       <div className="space-y-5">
         
//          {/* 1. Order Type Selection */}
//          <div>
//             <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Select your type</label>
//             <div className="flex gap-4">
//               {['MIS', 'CNC', 'BTST'].map(type => (
//                 <label key={type} className="flex items-center gap-1 cursor-pointer">
//                   <input 
//                     type="radio" 
//                     name="orderType" 
//                     className="accent-blue-600 dark:accent-blue-500" 
//                     checked={config.orderType === type}
//                     onChange={() => updateConfig('orderType', type)} 
//                   />
//                   <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{type}</span>
//                 </label>
//               ))}
//             </div>
//          </div>

//          {/* CNC SETTINGS (Conditional) */}
//          {config.orderType === 'CNC' && (
//             <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600 space-y-5 animate-in fade-in slide-in-from-top-2 transition-colors">
//                 <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">CNC Settings</h4>
                
//                 {/* Entry Slider */}
//                 <div>
//                     <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-300 mb-2 font-medium">
//                         <span>Entry: <span className="text-blue-600 dark:text-blue-400 font-bold">{config.cncEntryDays}</span> trading days before expiry</span>
//                     </div>
//                     <input 
//                         type="range" min="0" max="4" step="1"
//                         value={config.cncEntryDays}
//                         onChange={(e) => updateConfig('cncEntryDays', Number(e.target.value))}
//                         className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 dark:[&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
//                         style={getSliderStyle(config.cncEntryDays)}
//                     />
//                     <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 mt-1 px-0.5">
//                         <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
//                     </div>
//                 </div>

//                 {/* Exit Slider */}
//                 <div>
//                     <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-300 mb-2 font-medium">
//                         <span>Exit: <span className="text-gray-900 dark:text-white font-bold">{config.cncExitDays}</span> trading days before expiry</span>
//                     </div>
//                     <input 
//                         type="range" min="0" max="4" step="1"
//                         value={config.cncExitDays}
//                         onChange={(e) => updateConfig('cncExitDays', Number(e.target.value))}
//                         className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-500 dark:[&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
//                         style={{
//                             background: `linear-gradient(to right, #64748b 0%, #64748b ${(config.cncExitDays/4)*100}%, #cbd5e1 ${(config.cncExitDays/4)*100}%, #cbd5e1 100%)`
//                         }}
//                     />
//                     <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 mt-1 px-0.5">
//                         <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
//                     </div>
//                 </div>
//             </div>
//          )}

//          {/* 2. Times */}
//          <div className="grid grid-cols-2 gap-4">
//             <div>
//                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Start Time</label>
//                <input 
//                  type="time" 
//                  defaultValue="09:16" 
//                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-2 py-2 text-xs text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" 
//                />
//             </div>
//             <div>
//                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Square Off</label>
//                <input 
//                  type="time" 
//                  defaultValue="15:15" 
//                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-2 py-2 text-xs text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" 
//                />
//             </div>
//          </div>

//          {/* 3. Days */}
//          <div>
//            <div className="flex gap-1">
//               {["MON", "TUE", "WED", "THU", "FRI"].map(day => (
//                 <button 
//                   key={day} onClick={() => toggleDay(day)} 
//                   className={`text-[10px] flex-1 py-1.5 rounded font-bold transition-all border 
//                   ${config.days.includes(day) 
//                     ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
//                     : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
//                 >
//                   {day}
//                 </button>
//               ))}
//            </div>
//          </div>

//          {/* INDICATOR SETTINGS */}
//          {strategyType === 'Indicator Based' && (
//             <div className="space-y-5 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-gray-200 dark:border-slate-700/50">
//                 <div className="grid grid-cols-2 gap-4">
                    
//                     {/* Transaction Type */}
//                     <div>
//                         <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Transaction Type</label>
//                         <div className="flex flex-col gap-2">
//                             {transactionList.map(type => (
//                                 <button 
//                                     key={type}
//                                     onClick={() => updateConfig('transactionType', type)}
//                                     className={`text-[10px] py-1.5 rounded border font-bold transition-colors 
//                                     ${config.transactionType === type 
//                                       ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
//                                       : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-blue-400'}`}
//                                 >
//                                     {type}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Chart Type */}
//                     <div>
//                         <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Chart Type</label>
//                         <div className="flex flex-col gap-2">
//                             {['Candle', 'Heikin Ashi'].map(type => (
//                                 <button 
//                                     key={type}
//                                     onClick={() => updateConfig('chartType', type)}
//                                     className={`text-[10px] py-1.5 rounded border font-bold transition-colors 
//                                     ${config.chartType === type 
//                                       ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
//                                       : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-blue-400'}`}
//                                 >
//                                     {type}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Interval */}
//                 <div>
//                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Interval</label>
//                    <div className="flex gap-2 flex-wrap">
//                       {['1 min', '3 min', '5 min', '10 min', '15 min', '30 min', '1H', '1D'].map(int => (
//                         <button 
//                             key={int} onClick={() => updateConfig('interval', int)}
//                             className={`text-[10px] px-2 py-1.5 rounded border transition-colors 
//                             ${config.interval === int 
//                               ? 'bg-blue-50 dark:bg-slate-700 border-blue-500 text-blue-700 dark:text-blue-400 shadow-sm' 
//                               : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'}`}
//                         >
//                             {int}
//                         </button>
//                       ))}
//                    </div>
//                 </div>
//             </div>
//          )}
//       </div>
//     </div>
//   );
// };

// export default OrderConfigSection;



import React from 'react';
import ComingSoonOverlay from './ComingSoonOverlay';

const OrderConfigSection = ({ config, setConfig, isComingSoon, strategyType, entrySettings }) => {
  
  const toggleDay = (day) => {
    config.days.includes(day) 
      ? setConfig({ ...config, days: config.days.filter(d => d !== day) })
      : setConfig({ ...config, days: [...config.days, day] });
  };

  const updateConfig = (key, value) => {
    setConfig({ ...config, [key]: value });
  };

  // Slider Background Logic
  const getSliderStyle = (value) => {
    const max = 4; 
    const percentage = (value / max) * 100;
    return {
      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #64748b ${percentage}%, #64748b 100%)`
    };
  };

  const isSpecialChart = entrySettings?.useCombinedChart || entrySettings?.useOptionsChart;
  
  let transactionList = ['Both Side', 'Only Long', 'Only Short'];
  if (isSpecialChart) {
      transactionList = ['Only Long', 'Only Short'];
  }

  return (
    // ✅ Main Container: Light (White) | Dark (Slate-800)
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative h-full shadow-sm dark:shadow-none transition-colors duration-300">
      
      {isComingSoon && <ComingSoonOverlay />}
      
      <h3 className="font-bold mb-4 text-lg text-gray-800 dark:text-white">Order Type</h3>
      
      <div className="space-y-5">
         
         {/* 1. Order Type Selection */}
         <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Select your type</label>
            <div className="flex gap-4">
              {['MIS', 'CNC', 'BTST'].map(type => (
                <label key={type} className="flex items-center gap-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="orderType" 
                    className="accent-blue-600 dark:accent-blue-500" 
                    checked={config.orderType === type}
                    onChange={() => updateConfig('orderType', type)} 
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{type}</span>
                </label>
              ))}
            </div>
         </div>

         {/* CNC SETTINGS (Conditional) */}
         {config.orderType === 'CNC' && (
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600 space-y-5 animate-in fade-in slide-in-from-top-2 transition-colors">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">CNC Settings</h4>
                
                {/* Entry Slider */}
                <div>
                    <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-300 mb-2 font-medium">
                        <span>Entry: <span className="text-blue-600 dark:text-blue-400 font-bold">{config.cncEntryDays}</span> trading days before expiry</span>
                    </div>
                    <input 
                        type="range" min="0" max="4" step="1"
                        value={config.cncEntryDays}
                        onChange={(e) => updateConfig('cncEntryDays', Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 dark:[&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                        style={getSliderStyle(config.cncEntryDays)}
                    />
                    <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 mt-1 px-0.5">
                        <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
                    </div>
                </div>

                {/* Exit Slider */}
                <div>
                    <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-300 mb-2 font-medium">
                        <span>Exit: <span className="text-gray-900 dark:text-white font-bold">{config.cncExitDays}</span> trading days before expiry</span>
                    </div>
                    <input 
                        type="range" min="0" max="4" step="1"
                        value={config.cncExitDays}
                        onChange={(e) => updateConfig('cncExitDays', Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-500 dark:[&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                        style={{
                            background: `linear-gradient(to right, #64748b 0%, #64748b ${(config.cncExitDays/4)*100}%, #cbd5e1 ${(config.cncExitDays/4)*100}%, #cbd5e1 100%)`
                        }}
                    />
                    <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 mt-1 px-0.5">
                        <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
                    </div>
                </div>
            </div>
         )}

         {/* 🔥 2. Times (Dynamically linked to config) 🔥 */}
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Start Time</label>
               <input 
                 type="time" 
                 value={config.startTime || "09:16"} 
                 onChange={(e) => updateConfig('startTime', e.target.value)}
                 className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-2 py-2 text-xs text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" 
               />
            </div>
            <div>
               <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Square Off</label>
               <input 
                 type="time" 
                 value={config.squareOffTime || "15:15"} 
                 onChange={(e) => updateConfig('squareOffTime', e.target.value)}
                 className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-2 py-2 text-xs text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" 
               />
            </div>
         </div>

         {/* 3. Days */}
         <div>
           <div className="flex gap-1">
              {["MON", "TUE", "WED", "THU", "FRI"].map(day => (
                <button 
                  key={day} onClick={() => toggleDay(day)} 
                  className={`text-[10px] flex-1 py-1.5 rounded font-bold transition-all border 
                  ${config.days.includes(day) 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                >
                  {day}
                </button>
              ))}
           </div>
         </div>

         {/* INDICATOR SETTINGS */}
         {strategyType === 'Indicator Based' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-gray-200 dark:border-slate-700/50">
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* Transaction Type */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Transaction Type</label>
                        <div className="flex flex-col gap-2">
                            {transactionList.map(type => (
                                <button 
                                    key={type}
                                    onClick={() => updateConfig('transactionType', type)}
                                    className={`text-[10px] py-1.5 rounded border font-bold transition-colors 
                                    ${config.transactionType === type 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-blue-400'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart Type */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Chart Type</label>
                        <div className="flex flex-col gap-2">
                            {['Candle', 'Heikin Ashi'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => updateConfig('chartType', type)}
                                    className={`text-[10px] py-1.5 rounded border font-bold transition-colors 
                                    ${config.chartType === type 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-blue-400'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interval */}
                <div>
                   <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">Interval</label>
                   <div className="flex gap-2 flex-wrap">
                      {['1 min', '3 min', '5 min', '10 min', '15 min', '30 min', '1H', '1D'].map(int => (
                        <button 
                            key={int} onClick={() => updateConfig('interval', int)}
                            className={`text-[10px] px-2 py-1.5 rounded border transition-colors 
                            ${config.interval === int 
                              ? 'bg-blue-50 dark:bg-slate-700 border-blue-500 text-blue-700 dark:text-blue-400 shadow-sm' 
                              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'}`}
                        >
                            {int}
                        </button>
                      ))}
                   </div>
                </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default OrderConfigSection;