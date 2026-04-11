
// import React from 'react';
// import { ShieldCheck } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// // ✅ Props receive kiye: riskSettings & setRiskSettings
// const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon }) => {
  
//   const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

//   // ✅ Helper Function: State Update karne ke liye
//   const handleChange = (field, value) => {
//     // Agar number field hai to Number() me convert karo, nahi to string rakho
//     const finalValue = (field === 'noTradeAfter' || field === 'profitTrailing') ? value : Number(value);
    
//     setRiskSettings(prev => ({
//         ...prev,
//         [field]: finalValue
//     }));
//   };

//   return (
//     <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300">
       
//        {isComingSoon && <ComingSoonOverlay />}
       
//        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
//           <ShieldCheck className="text-orange-500" size={18}/> Risk Management
//        </h3>
       
//        <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-relaxed">
//           Control your trading outcomes by setting global limits on losses and profits on the strategy, and automating how gains are protected (trailing).
//        </p>
       
//        <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Profit (₹)</label>
//                     <input 
//                         type="number" 
//                         placeholder="5000" 
//                         // ✅ Value bind ki
//                         value={riskSettings?.maxProfit || ''} 
//                         // ✅ onChange lagaya
//                         onChange={(e) => handleChange('maxProfit', e.target.value)}
//                         className={`${inputClass} text-green-600 dark:text-green-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
//                     />
//                  </div>
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Loss (₹)</label>
//                     <input 
//                         type="number" 
//                         placeholder="2000" 
//                         value={riskSettings?.maxLoss || ''} 
//                         onChange={(e) => handleChange('maxLoss', e.target.value)}
//                         className={`${inputClass} text-red-600 dark:text-red-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
//                     />
//                  </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Trade Cycle</label>
//                     <input 
//                         type="number" 
//                         value={riskSettings?.maxTradeCycle || ''} 
//                         onChange={(e) => handleChange('maxTradeCycle', e.target.value)}
//                         className={`${inputClass} text-gray-900 dark:text-white`} 
//                     />
//                  </div>
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">No Trade After</label>
//                     <input 
//                         type="time" 
//                         value={riskSettings?.noTradeAfter || '15:15'} 
//                         onChange={(e) => handleChange('noTradeAfter', e.target.value)}
//                         className={`${inputClass} text-gray-900 dark:text-white`} 
//                     />
//                  </div>
//               </div>
              
//               <div>
//                   <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-2 font-bold uppercase">Profit Trailing</label>
//                   <div className="flex flex-wrap gap-4">
//                      {['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'].map(opt => (
//                         <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                            <input 
//                                 type="radio" 
//                                 name="risk_trailing" 
//                                 className="accent-blue-600 dark:accent-blue-500 w-3.5 h-3.5" 
//                                 // ✅ Checked Logic
//                                 checked={riskSettings?.profitTrailing === opt}
//                                 // ✅ onChange Logic
//                                 onChange={() => handleChange('profitTrailing', opt)}
//                            />
//                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                 {opt}
//                            </span>
//                         </label>
//                      ))}
//                   </div>
//               </div>
//        </div>
//     </div>
//   );
// };
// export default RiskManagementSection;


// import React from 'react';
// import { ShieldCheck } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// // ✅ Props receive kiye: riskSettings & setRiskSettings
// const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon }) => {
  
//   const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

//   // ✅ Helper Function: State Update karne ke liye
//   const handleChange = (field, value) => {
//     // Agar number field hai to Number() me convert karo, nahi to string rakho
//     const finalValue = (field === 'noTradeAfter' || field === 'profitTrailing') ? value : Number(value);
    
//     setRiskSettings(prev => ({
//         ...prev,
//         [field]: finalValue
//     }));
//   };

//   // ✅ UI Logic: Kaun se box dikhane hain
//   const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
//   const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

//   return (
//     // ✅ w-full add kiya taki width 100% ho jaye
//     <div className="w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300">
       
//        {isComingSoon && <ComingSoonOverlay />}
       
//        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
//           <ShieldCheck className="text-orange-500" size={18}/> Risk Management
//        </h3>
       
//        <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-relaxed">
//           Control your trading outcomes by setting global limits on losses and profits on the strategy, and automating how gains are protected (trailing).
//        </p>
       
//        <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Profit (₹)</label>
//                     <input 
//                         type="number" 
//                         placeholder="5000" 
//                         value={riskSettings?.maxProfit || ''} 
//                         onChange={(e) => handleChange('maxProfit', e.target.value)}
//                         className={`${inputClass} text-green-600 dark:text-green-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
//                     />
//                  </div>
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Loss (₹)</label>
//                     <input 
//                         type="number" 
//                         placeholder="2000" 
//                         value={riskSettings?.maxLoss || ''} 
//                         onChange={(e) => handleChange('maxLoss', e.target.value)}
//                         className={`${inputClass} text-red-600 dark:text-red-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
//                     />
//                  </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Trade Cycle</label>
//                     <input 
//                         type="number" 
//                         value={riskSettings?.maxTradeCycle || ''} 
//                         onChange={(e) => handleChange('maxTradeCycle', e.target.value)}
//                         className={`${inputClass} text-gray-900 dark:text-white`} 
//                     />
//                  </div>
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">No Trade After</label>
//                     <input 
//                         type="time" 
//                         value={riskSettings?.noTradeAfter || '15:15'} 
//                         onChange={(e) => handleChange('noTradeAfter', e.target.value)}
//                         className={`${inputClass} text-gray-900 dark:text-white`} 
//                     />
//                  </div>
//               </div>
              
//               <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
//                  <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-3 font-bold uppercase">Profit Trailing</label>
                 
//                  {/* Radio Buttons */}
//                  <div className="flex flex-wrap gap-4 mb-3">
//                     {['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'].map(opt => (
//                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                           <input 
//                                type="radio" 
//                                name="risk_trailing" 
//                                className="accent-blue-600 dark:accent-blue-500 w-3.5 h-3.5" 
//                                checked={riskSettings?.profitTrailing === opt}
//                                onChange={() => handleChange('profitTrailing', opt)}
//                           />
//                           <span className="text-xs text-gray-600 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                {opt}
//                           </span>
//                        </label>
//                     ))}
//                  </div>

//                  {/* ✅ Dynamic Inputs Based on Selection (AlgoRooms Style) */}
//                  {(showLockInputs || showTrailInputs) && (
//                     <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 space-y-3 mt-2">
                        
//                         {/* Lock Inputs */}
//                         {showLockInputs && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="If profit reaches (₹)" 
//                                         value={riskSettings?.lockTrigger || ''} 
//                                         onChange={(e) => handleChange('lockTrigger', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="Lock profit at (₹)" 
//                                         value={riskSettings?.lockAmount || ''} 
//                                         onChange={(e) => handleChange('lockAmount', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Trail Inputs */}
//                         {showTrailInputs && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="On every increase of (₹)" 
//                                         value={riskSettings?.trailTrigger || ''} 
//                                         onChange={(e) => handleChange('trailTrigger', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="Trail profit by (₹)" 
//                                         value={riskSettings?.trailAmount || ''} 
//                                         onChange={(e) => handleChange('trailAmount', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                  )}
//               </div>
//        </div>
//     </div>
//   );
// };
// export default RiskManagementSection;


import React from 'react';
import { ShieldCheck } from 'lucide-react';
import ComingSoonOverlay from './ComingSoonOverlay';

// 🔥 THE FIX: Props me `strategyType` add kiya gaya hai
const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon, strategyType }) => {
  
  const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

  const handleChange = (field, value) => {
    const finalValue = (field === 'noTradeAfter' || field === 'profitTrailing') ? value : Number(value);
    
    setRiskSettings(prev => ({
        ...prev,
        [field]: finalValue
    }));
  };

  const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
  const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

  // 🔥 THE FIX: Agar Indicator Based hai, toh parent grid me 2 column (Full width) ki jagah lega
  const containerClass = `w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300 ${
    strategyType === 'Indicator Based' ? 'md:col-span-2' : ''  
  }`;

  return (
    <div className={containerClass}>
       
       {isComingSoon && <ComingSoonOverlay />}
       
       <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
          <ShieldCheck className="text-orange-500" size={18}/> Risk Management
       </h3>
       
       <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-relaxed">
          Control your trading outcomes by setting global limits on losses and profits on the strategy, and automating how gains are protected (trailing).
       </p>
       
       <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Profit (₹)</label>
                    <input 
                        type="number" 
                        placeholder="5000" 
                        value={riskSettings?.maxProfit || ''} 
                        onChange={(e) => handleChange('maxProfit', e.target.value)}
                        className={`${inputClass} text-green-600 dark:text-green-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
                    />
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Loss (₹)</label>
                    <input 
                        type="number" 
                        placeholder="2000" 
                        value={riskSettings?.maxLoss || ''} 
                        onChange={(e) => handleChange('maxLoss', e.target.value)}
                        className={`${inputClass} text-red-600 dark:text-red-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Trade Cycle</label>
                    <input 
                        type="number" 
                        value={riskSettings?.maxTradeCycle || ''} 
                        onChange={(e) => handleChange('maxTradeCycle', e.target.value)}
                        className={`${inputClass} text-gray-900 dark:text-white`} 
                    />
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">No Trade After</label>
                    <input 
                        type="time" 
                        value={riskSettings?.noTradeAfter || '15:15'} 
                        onChange={(e) => handleChange('noTradeAfter', e.target.value)}
                        className={`${inputClass} text-gray-900 dark:text-white`} 
                    />
                 </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                 <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-3 font-bold uppercase">Profit Trailing</label>
                 
                 <div className="flex flex-wrap gap-4 mb-3">
                    {['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'].map(opt => (
                       <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                               type="radio" 
                               name="risk_trailing" 
                               className="accent-blue-600 dark:accent-blue-500 w-3.5 h-3.5" 
                               checked={riskSettings?.profitTrailing === opt}
                               onChange={() => handleChange('profitTrailing', opt)}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                               {opt}
                          </span>
                       </label>
                    ))}
                 </div>

                 {(showLockInputs || showTrailInputs) && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 space-y-3 mt-2">
                        
                        {showLockInputs && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input 
                                        type="number" 
                                        placeholder="If profit reaches (₹)" 
                                        value={riskSettings?.lockTrigger || ''} 
                                        onChange={(e) => handleChange('lockTrigger', e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="number" 
                                        placeholder="Lock profit at (₹)" 
                                        value={riskSettings?.lockAmount || ''} 
                                        onChange={(e) => handleChange('lockAmount', e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>
                            </div>
                        )}

                        {showTrailInputs && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input 
                                        type="number" 
                                        placeholder="On every increase of (₹)" 
                                        value={riskSettings?.trailTrigger || ''} 
                                        onChange={(e) => handleChange('trailTrigger', e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="number" 
                                        placeholder="Trail profit by (₹)" 
                                        value={riskSettings?.trailAmount || ''} 
                                        onChange={(e) => handleChange('trailAmount', e.target.value)}
                                        className={inputClass} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                 )}
              </div>
       </div>
    </div>
  );
};
export default RiskManagementSection;