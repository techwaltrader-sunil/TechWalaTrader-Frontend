// import React from 'react';
// import { ShieldCheck } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// // 🔥 THE FIX: Props me `strategyType` add kiya gaya hai
// const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon, strategyType }) => {
  
//   const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

//   const handleChange = (field, value) => {
//     const finalValue = (field === 'noTradeAfter' || field === 'profitTrailing') ? value : Number(value);
    
//     setRiskSettings(prev => ({
//         ...prev,
//         [field]: finalValue
//     }));
//   };

//   const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
//   const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

//   // 🔥 THE FIX: Agar Indicator Based hai, toh parent grid me 2 column (Full width) ki jagah lega
//   const containerClass = `w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300 ${
//     strategyType === 'Indicator Based' ? 'md:col-span-2' : ''  
//   }`;

//   return (
//     <div className={containerClass}>
       
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

//                  {(showLockInputs || showTrailInputs) && (
//                     <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 space-y-3 mt-2">
                        
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





// import React, { useEffect } from 'react';
// import { ShieldCheck, Activity } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// // 🔥 THE FIX: Props me `legs = []` add kiya gaya hai
// const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon, strategyType, legs = [] }) => {
  
//   const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

//   // 🌟 THE FIX: Check karein ki kya kisi bhi leg me 'Ratio Spread (Prem/X)' selected hai?
//   const isRatioSpreadActive = legs.some(leg => leg.strikeCriteria === 'Ratio Spread (Prem/X)');

//   // 🌟 THE FIX: Agar user Ratio Spread hata deta hai, toh hidden settings ko reset kar do
//   useEffect(() => {
//       if (!isRatioSpreadActive) {
//           setRiskSettings(prev => {
//               let updates = {};
//               if (prev.profitTrailing === 'Time-Conditioned') updates.profitTrailing = 'No Trailing';
//               if (prev.enableRecovery === true) updates.enableRecovery = false;
              
//               // Agar kuch change karna hai tabhi state update karo
//               if (Object.keys(updates).length > 0) {
//                   return { ...prev, ...updates };
//               }
//               return prev;
//           });
//       }
//   }, [isRatioSpreadActive, setRiskSettings]);

//   const handleChange = (field, value) => {
//     const finalValue = (field === 'noTradeAfter' || field === 'profitTrailing' || field === 'enableRecovery') ? value : Number(value);
    
//     setRiskSettings(prev => ({
//         ...prev,
//         [field]: finalValue
//     }));
//   };

//   const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
//   const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

//   const containerClass = `w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300 ${
//     strategyType === 'Indicator Based' ? 'md:col-span-2' : ''  
//   }`;

//   // 🌟 THE FIX: Trailing options dynamically build karein
//   const trailingOptions = ['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'];
//   if (isRatioSpreadActive) {
//       trailingOptions.push('Time-Conditioned');
//   }

//   return (
//     <div className={containerClass}>
       
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
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Profit (₹ / %)</label>
//                     <input 
//                         type="number" 
//                         placeholder="5000" 
//                         value={riskSettings?.maxProfit || ''} 
//                         onChange={(e) => handleChange('maxProfit', e.target.value)}
//                         className={`${inputClass} text-green-600 dark:text-green-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
//                     />
//                  </div>
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Loss (₹ / %)</label>
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
                 
//                  <div className="flex flex-wrap gap-4 mb-3">
//                     {/* 🔥 THE FIX: Map over dynamic array instead of hardcoded */}
//                     {trailingOptions.map(opt => (
//                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                           <input 
//                                type="radio" 
//                                name="risk_trailing" 
//                                className="accent-blue-600 dark:accent-blue-500 w-3.5 h-3.5" 
//                                checked={riskSettings?.profitTrailing === opt}
//                                onChange={() => handleChange('profitTrailing', opt)}
//                           />
//                           <span className={`text-xs font-medium transition-colors ${opt === 'Time-Conditioned' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
//                                {opt}
//                           </span>
//                        </label>
//                     ))}
//                  </div>

//                  {(showLockInputs || showTrailInputs) && (
//                     <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 space-y-3 mt-2 animate-in fade-in zoom-in-95 duration-200">
                        
//                         {showLockInputs && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="If profit reaches (₹ / %)" 
//                                         value={riskSettings?.lockTrigger || ''} 
//                                         onChange={(e) => handleChange('lockTrigger', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="Lock profit at (₹ / %)" 
//                                         value={riskSettings?.lockAmount || ''} 
//                                         onChange={(e) => handleChange('lockAmount', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {showTrailInputs && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="On every increase of (₹ / %)" 
//                                         value={riskSettings?.trailTrigger || ''} 
//                                         onChange={(e) => handleChange('trailTrigger', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                                 <div>
//                                     <input 
//                                         type="number" 
//                                         placeholder="Trail profit by (₹ / %)" 
//                                         value={riskSettings?.trailAmount || ''} 
//                                         onChange={(e) => handleChange('trailAmount', e.target.value)}
//                                         className={inputClass} 
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                  )}

//                  {/* Custom message for Time-Conditioned Trailing */}
//                  {riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                      <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800/50 mt-2 animate-in fade-in zoom-in-95 duration-200">
                         
//                          <div className="mb-4">
//                              <strong className="block mb-2 text-[11px] text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">⏰ Phase 1 (Move SL to Cost)</strong>
//                              <div className="grid grid-cols-2 gap-4">
//                                  <div>
//                                      <label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Trigger Time (Before)</label>
//                                      <input type="time" value={riskSettings?.tcPhase1Time || '12:00'} onChange={(e) => handleChange('tcPhase1Time', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} />
//                                  </div>
//                                  <div>
//                                      <label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">If Profit reaches (%)</label>
//                                      <input type="number" step="0.1" placeholder="e.g., 0.5" value={riskSettings?.tcPhase1Profit || 0.5} onChange={(e) => handleChange('tcPhase1Profit', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} />
//                                  </div>
//                              </div>
//                          </div>

//                          <div>
//                              <strong className="block mb-2 text-[11px] text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">🚀 Phase 2 (Lock & Trail)</strong>
//                              <div className="grid grid-cols-4 gap-3">
//                                  <div>
//                                      <label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Time (Before)</label>
//                                      <input type="time" value={riskSettings?.tcPhase2Time || '14:30'} onChange={(e) => handleChange('tcPhase2Time', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} />
//                                  </div>
//                                  <div>
//                                      <label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Profit &gt; (%)</label>
//                                      <input type="number" step="0.1" placeholder="1.0" value={riskSettings?.tcPhase2Profit || 1.0} onChange={(e) => handleChange('tcPhase2Profit', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} />
//                                  </div>
//                                  <div>
//                                      <label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Lock at (%)</label>
//                                      <input type="number" step="0.1" placeholder="0.8" value={riskSettings?.tcPhase2Lock || 0.8} onChange={(e) => handleChange('tcPhase2Lock', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} />
//                                  </div>
//                                  <div>
//                                      <label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Trail by (%)</label>
//                                      <input type="number" step="0.1" placeholder="0.2" value={riskSettings?.tcPhase2Trail || 0.2} onChange={(e) => handleChange('tcPhase2Trail', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} />
//                                  </div>
//                              </div>
//                          </div>

//                      </div>
//                  )}
//               </div>

//               {/* 🔥 THE FIX: Dikhayein ONLY agar Time Based ho AND Ratio Spread active ho */}
//               {strategyType === 'Time Based' && isRatioSpreadActive && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
//                       <label className="flex items-center gap-2 cursor-pointer group mb-3">
//                           <input 
//                                type="checkbox" 
//                                className="accent-rose-500 w-4 h-4" 
//                                checked={riskSettings?.enableRecovery === true}
//                                onChange={(e) => handleChange('enableRecovery', e.target.checked)}
//                           />
//                           <span className="text-sm text-rose-600 dark:text-rose-400 font-bold group-hover:text-rose-700 transition-colors flex items-center gap-1.5">
//                               <Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)
//                           </span>
//                       </label>

//                       {riskSettings?.enableRecovery && (
//                           <div className="grid grid-cols-2 gap-4 bg-rose-50/30 dark:bg-rose-900/10 p-4 rounded-lg border border-rose-100 dark:border-rose-800/30 animate-in fade-in slide-in-from-top-2 duration-300">
//                               <div>
//                                   <label className="text-[10px] text-rose-700 dark:text-rose-400 block mb-1.5 font-bold uppercase tracking-wide">Max Recovery Attempts</label>
//                                   <input 
//                                       type="number" 
//                                       min="1" max="5"
//                                       placeholder="e.g., 2" 
//                                       value={riskSettings?.recoveryAttempts !== undefined ? riskSettings.recoveryAttempts : 2} 
//                                       onChange={(e) => handleChange('recoveryAttempts', e.target.value)}
//                                       className={`${inputClass} border-rose-200 dark:border-rose-800 focus:border-rose-500`} 
//                                   />
//                               </div>
//                               <div>
//                                   <label className="text-[10px] text-rose-700 dark:text-rose-400 block mb-1.5 font-bold uppercase tracking-wide">Risk per Attempt (%)</label>
//                                   <input 
//                                       type="number" 
//                                       min="1" max="100"
//                                       placeholder="e.g., 50" 
//                                       value={riskSettings?.recoveryRiskPct !== undefined ? riskSettings.recoveryRiskPct : 50} 
//                                       onChange={(e) => handleChange('recoveryRiskPct', e.target.value)}
//                                       className={`${inputClass} border-rose-200 dark:border-rose-800 focus:border-rose-500`} 
//                                   />
//                                   <p className="text-[9px] text-rose-500 mt-1">% of remaining Max Loss</p>
//                               </div>
//                           </div>
//                       )}
//                   </div>
//               )}

//        </div>
//     </div>
//   );
// };

// export default RiskManagementSection;




// import React, { useEffect } from 'react';
// import { ShieldCheck, Activity } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon, strategyType, legs = [] }) => {
  
//   const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

//   const isRatioSpreadActive = legs.some(leg => leg.strikeCriteria === 'Ratio Spread (Prem/X)');

//   useEffect(() => {
//       if (!isRatioSpreadActive) {
//           setRiskSettings(prev => {
//               let updates = {};
//               if (prev.profitTrailing === 'Time-Conditioned') updates.profitTrailing = 'No Trailing';
//               if (prev.enableRecovery === true) updates.enableRecovery = false;
              
//               if (Object.keys(updates).length > 0) {
//                   return { ...prev, ...updates };
//               }
//               return prev;
//           });
//       }
//   }, [isRatioSpreadActive, setRiskSettings]);

//   const handleChange = (field, value) => {
//     // String, Boolean aur Number ko handle karne ke liye smart check
//     let finalValue = value;
//     if (!['noTradeAfter', 'profitTrailing', 'tcPhase1Time', 'tcPhase2Time'].includes(field) && typeof value !== 'boolean') {
//         finalValue = Number(value);
//     }
    
//     setRiskSettings(prev => {
//         let updatedState = { ...prev, [field]: finalValue };

//         // 🔥 THE FIX: Jab "Time-Conditioned" select ho, toh defaults ko State me Inject kar do
//         if (field === 'profitTrailing' && value === 'Time-Conditioned') {
//             updatedState = {
//                 ...updatedState,
//                 tcPhase1Time: prev.tcPhase1Time ?? '12:00',
//                 tcPhase1Profit: prev.tcPhase1Profit ?? 0.5,
//                 tcPhase2Time: prev.tcPhase2Time ?? '14:30',
//                 tcPhase2Profit: prev.tcPhase2Profit ?? 1.0,
//                 tcPhase2Lock: prev.tcPhase2Lock ?? 0.8,
//                 tcPhase2Trail: prev.tcPhase2Trail ?? 0.2,
//             };
//         }

//         // 🔥 THE FIX: Jab "Enable Recovery" tick ho, toh uske defaults bhi State me Inject kar do
//         if (field === 'enableRecovery' && value === true) {
//             updatedState = {
//                 ...updatedState,
//                 recoveryAttempts: prev.recoveryAttempts ?? 2,
//                 recoveryRiskPct: prev.recoveryRiskPct ?? 50,
//                 recoveryC2C: prev.recoveryC2C ?? 0.4,
//                 recoveryTarget: prev.recoveryTarget ?? 1.0,
//                 recoveryLock: prev.recoveryLock ?? 0.5,
//                 recoveryTrail: prev.recoveryTrail ?? 0.2,
//             };
//         }

//         return updatedState;
//     });
//   };

//   const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
//   const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

//   const containerClass = `w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300 ${
//     strategyType === 'Indicator Based' ? 'md:col-span-2' : ''  
//   }`;

//   const trailingOptions = ['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'];
//   if (isRatioSpreadActive) {
//       trailingOptions.push('Time-Conditioned');
//   }

//   return (
//     <div className={containerClass}>
       
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
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Profit (₹ / %)</label>
//                     <input type="number" placeholder="5000" value={riskSettings?.maxProfit || ''} onChange={(e) => handleChange('maxProfit', e.target.value)} className={`${inputClass} text-green-600 dark:text-green-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} />
//                  </div>
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Loss (₹ / %)</label>
//                     <input type="number" placeholder="2000" value={riskSettings?.maxLoss || ''} onChange={(e) => handleChange('maxLoss', e.target.value)} className={`${inputClass} text-red-600 dark:text-red-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} />
//                  </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Trade Cycle</label>
//                     <input type="number" value={riskSettings?.maxTradeCycle || ''} onChange={(e) => handleChange('maxTradeCycle', e.target.value)} className={`${inputClass} text-gray-900 dark:text-white`} />
//                  </div>
//                  <div>
//                     <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">No Trade After</label>
//                     <input type="time" value={riskSettings?.noTradeAfter || '15:15'} onChange={(e) => handleChange('noTradeAfter', e.target.value)} className={`${inputClass} text-gray-900 dark:text-white`} />
//                  </div>
//               </div>
              
//               <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
//                  <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-3 font-bold uppercase">Profit Trailing</label>
                 
//                  <div className="flex flex-wrap gap-4 mb-3">
//                     {trailingOptions.map(opt => (
//                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                           <input type="radio" name="risk_trailing" className="accent-blue-600 dark:accent-blue-500 w-3.5 h-3.5" checked={riskSettings?.profitTrailing === opt} onChange={() => handleChange('profitTrailing', opt)} />
//                           <span className={`text-xs font-medium transition-colors ${opt === 'Time-Conditioned' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>{opt}</span>
//                        </label>
//                     ))}
//                  </div>

//                  {(showLockInputs || showTrailInputs) && (
//                     <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 space-y-3 mt-2 animate-in fade-in zoom-in-95 duration-200">
//                         {showLockInputs && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div><input type="number" placeholder="If profit reaches (₹ / %)" value={riskSettings?.lockTrigger || ''} onChange={(e) => handleChange('lockTrigger', e.target.value)} className={inputClass} /></div>
//                                 <div><input type="number" placeholder="Lock profit at (₹ / %)" value={riskSettings?.lockAmount || ''} onChange={(e) => handleChange('lockAmount', e.target.value)} className={inputClass} /></div>
//                             </div>
//                         )}
//                         {showTrailInputs && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div><input type="number" placeholder="On every increase of (₹ / %)" value={riskSettings?.trailTrigger || ''} onChange={(e) => handleChange('trailTrigger', e.target.value)} className={inputClass} /></div>
//                                 <div><input type="number" placeholder="Trail profit by (₹ / %)" value={riskSettings?.trailAmount || ''} onChange={(e) => handleChange('trailAmount', e.target.value)} className={inputClass} /></div>
//                             </div>
//                         )}
//                     </div>
//                  )}

//                  {riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                      <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800/50 mt-2 animate-in fade-in zoom-in-95 duration-200">
//                          <div className="mb-4">
//                              <strong className="block mb-2 text-[11px] text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">⏰ Phase 1 (Move SL to Cost)</strong>
//                              <div className="grid grid-cols-2 gap-4">
//                                  <div><label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Trigger Time (Before)</label><input type="time" value={riskSettings?.tcPhase1Time || '12:00'} onChange={(e) => handleChange('tcPhase1Time', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">If Profit reaches (%)</label><input type="number" step="0.1" placeholder="0.5" value={riskSettings?.tcPhase1Profit !== undefined ? riskSettings.tcPhase1Profit : 0.5} onChange={(e) => handleChange('tcPhase1Profit', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} /></div>
//                              </div>
//                          </div>
//                          <div>
//                              <strong className="block mb-2 text-[11px] text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">🚀 Phase 2 (Lock & Trail)</strong>
//                              <div className="grid grid-cols-4 gap-3">
//                                  <div><label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Time (Before)</label><input type="time" value={riskSettings?.tcPhase2Time || '14:30'} onChange={(e) => handleChange('tcPhase2Time', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Profit &gt; (%)</label><input type="number" step="0.1" placeholder="1.0" value={riskSettings?.tcPhase2Profit !== undefined ? riskSettings.tcPhase2Profit : 1.0} onChange={(e) => handleChange('tcPhase2Profit', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" placeholder="0.8" value={riskSettings?.tcPhase2Lock !== undefined ? riskSettings.tcPhase2Lock : 0.8} onChange={(e) => handleChange('tcPhase2Lock', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" placeholder="0.2" value={riskSettings?.tcPhase2Trail !== undefined ? riskSettings.tcPhase2Trail : 0.2} onChange={(e) => handleChange('tcPhase2Trail', e.target.value)} className={`${inputClass} border-indigo-200 focus:border-indigo-500`} /></div>
//                              </div>
//                          </div>
//                      </div>
//                  )}
//               </div>

//               {strategyType === 'Time Based' && isRatioSpreadActive && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
//                       <label className="flex items-center gap-2 cursor-pointer group mb-3">
//                           <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={riskSettings?.enableRecovery === true} onChange={(e) => handleChange('enableRecovery', e.target.checked)} />
//                           <span className="text-sm text-rose-600 dark:text-rose-400 font-bold group-hover:text-rose-700 transition-colors flex items-center gap-1.5">
//                               <Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)
//                           </span>
//                       </label>

//                       {riskSettings?.enableRecovery && (
//                           <div className="bg-rose-50/30 dark:bg-rose-900/10 p-4 rounded-lg border border-rose-100 dark:border-rose-800/30 animate-in fade-in slide-in-from-top-2 duration-300">
//                               <div className="grid grid-cols-2 gap-4 mb-4">
//                                   <div><label className="text-[10px] text-rose-700 dark:text-rose-400 block mb-1.5 font-bold uppercase tracking-wide">Max Recovery Attempts</label><input type="number" min="1" max="5" placeholder="2" value={riskSettings?.recoveryAttempts !== undefined ? riskSettings.recoveryAttempts : 2} onChange={(e) => handleChange('recoveryAttempts', e.target.value)} className={`${inputClass} border-rose-200 dark:border-rose-800 focus:border-rose-500`} /></div>
//                                   <div><label className="text-[10px] text-rose-700 dark:text-rose-400 block mb-1.5 font-bold uppercase tracking-wide">Risk per Attempt (%)</label><input type="number" min="1" max="100" placeholder="50" value={riskSettings?.recoveryRiskPct !== undefined ? riskSettings.recoveryRiskPct : 50} onChange={(e) => handleChange('recoveryRiskPct', e.target.value)} className={`${inputClass} border-rose-200 dark:border-rose-800 focus:border-rose-500`} /><p className="text-[9px] text-rose-500 mt-1">% of remaining Max Loss</p></div>
//                               </div>
                              
//                               {/* 🔥 THE FIX: DYNAMIC RECOVERY TRAILING UI 🔥 */}
//                               <div className="pt-3 border-t border-rose-200/60 dark:border-rose-800/50">
//                                   <strong className="block mb-2 text-[11px] text-rose-700 dark:text-rose-400 uppercase tracking-wide">🚀 Recovery Trailing Rules</strong>
//                                   <div className="grid grid-cols-4 gap-3">
//                                       <div><label className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block mb-1 font-bold">C2C Trigger (%)</label><input type="number" step="0.1" placeholder="0.4" value={riskSettings?.recoveryC2C !== undefined ? riskSettings.recoveryC2C : 0.4} onChange={(e) => handleChange('recoveryC2C', e.target.value)} className={`${inputClass} border-rose-200 focus:border-rose-500`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block mb-1 font-bold">Lock Trigger (%)</label><input type="number" step="0.1" placeholder="1.0" value={riskSettings?.recoveryTarget !== undefined ? riskSettings.recoveryTarget : 1.0} onChange={(e) => handleChange('recoveryTarget', e.target.value)} className={`${inputClass} border-rose-200 focus:border-rose-500`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" placeholder="0.5" value={riskSettings?.recoveryLock !== undefined ? riskSettings.recoveryLock : 0.5} onChange={(e) => handleChange('recoveryLock', e.target.value)} className={`${inputClass} border-rose-200 focus:border-rose-500`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" placeholder="0.2" value={riskSettings?.recoveryTrail !== undefined ? riskSettings.recoveryTrail : 0.2} onChange={(e) => handleChange('recoveryTrail', e.target.value)} className={`${inputClass} border-rose-200 focus:border-rose-500`} /></div>
//                                   </div>
//                               </div>
//                           </div>
//                       )}
//                   </div>
//               )}

//        </div>
//     </div>
//   );
// };

// export default RiskManagementSection;



// import React, { useEffect } from 'react';
// import { ShieldCheck, Activity } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon, strategyType, legs = [] }) => {
  
//   const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

//   const isRatioSpreadActive = legs.some(leg => leg.strikeCriteria === 'Ratio Spread (Prem/X)');

//   // 🔥 THE CLEANUP: Agar Ratio Spread disable ho jaye toh features band kar do
//   useEffect(() => {
//       if (!isRatioSpreadActive) {
//           setRiskSettings(prev => {
//               let updates = {};
//               if (prev.profitTrailing === 'Time-Conditioned') updates.profitTrailing = 'No Trailing';
//               if (prev.recoverySettings?.enableRecovery === true) {
//                   updates.recoverySettings = { ...prev.recoverySettings, enableRecovery: false };
//               }
              
//               if (Object.keys(updates).length > 0) {
//                   return { ...prev, ...updates };
//               }
//               return prev;
//           });
//       }
//   }, [isRatioSpreadActive, setRiskSettings]);

//   // 📂 THE FIX: SMART HANDLE CHANGE (Folder wise data save karega)
//   const handleChange = (category, field, value) => {
//     let finalValue = value;
//     if (!['noTradeAfter', 'profitTrailing', 'phase1Time', 'phase2Time'].includes(field) && typeof value !== 'boolean') {
//         finalValue = Number(value);
//     }
    
//     setRiskSettings(prev => {
//         let updatedState = { ...prev };

//         // 1. Root Level (Main settings)
//         if (category === 'root') {
//             updatedState[field] = finalValue;
            
//             if (field === 'profitTrailing' && value === 'Time-Conditioned') {
//                 if (!updatedState.timeConditionedTrailing) {
//                     updatedState.timeConditionedTrailing = {
//                         phase1Time: '12:00', phase1Profit: 0.5,
//                         phase2Time: '14:30', phase2Profit: 1.0,
//                         phase2Lock: 0.8, phase2Trail: 0.2
//                     };
//                 }
//             }
//         } 
//         // 2. Time Conditioned Folder
//         else if (category === 'timeConditionedTrailing') {
//             updatedState.timeConditionedTrailing = {
//                 ...updatedState.timeConditionedTrailing,
//                 [field]: finalValue
//             };
//         } 
//         // 3. Recovery Settings Folder
//         else if (category === 'recoverySettings') {
//             updatedState.recoverySettings = {
//                 ...updatedState.recoverySettings,
//                 [field]: finalValue
//             };
            
//             if (field === 'enableRecovery' && value === true) {
//                 if (!updatedState.recoverySettings.attempts) {
//                     updatedState.recoverySettings = {
//                         ...updatedState.recoverySettings,
//                         attempts: 2, riskPct: 50, c2cTrigger: 0.4, target: 1.0, lock: 0.5, trail: 0.2
//                     };
//                 }
//             }
//         }

//         return updatedState;
//     });
//   };

//   const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
//   const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

//   const containerClass = `w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300 ${
//     strategyType === 'Indicator Based' ? 'md:col-span-2' : ''  
//   }`;

//   const trailingOptions = ['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'];
//   if (isRatioSpreadActive) {
//       trailingOptions.push('Time-Conditioned');
//   }

//   // 📂 Shortcuts for easy reading
//   const tcData = riskSettings?.timeConditionedTrailing || {};
//   const recData = riskSettings?.recoverySettings || {};

//   return (
//     <div className={containerClass}>
       
//        {isComingSoon && <ComingSoonOverlay />}
//        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white"><ShieldCheck className="text-orange-500" size={18}/> Risk Management</h3>
//        <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-relaxed">Control your trading outcomes by setting global limits on losses and profits.</p>
       
//        <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Profit (₹ / %)</label><input type="number" placeholder="5000" value={riskSettings?.maxProfit || ''} onChange={(e) => handleChange('root', 'maxProfit', e.target.value)} className={`${inputClass} text-green-600 font-bold`} /></div>
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Loss (₹ / %)</label><input type="number" placeholder="2000" value={riskSettings?.maxLoss || ''} onChange={(e) => handleChange('root', 'maxLoss', e.target.value)} className={`${inputClass} text-red-600 font-bold`} /></div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Trade Cycle</label><input type="number" value={riskSettings?.maxTradeCycle || ''} onChange={(e) => handleChange('root', 'maxTradeCycle', e.target.value)} className={inputClass} /></div>
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">No Trade After</label><input type="time" value={riskSettings?.noTradeAfter || '15:15'} onChange={(e) => handleChange('root', 'noTradeAfter', e.target.value)} className={inputClass} /></div>
//               </div>
              
//               <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
//                  <label className="text-[10px] text-gray-500 block mb-3 font-bold uppercase">Profit Trailing</label>
//                  <div className="flex flex-wrap gap-4 mb-3">
//                     {trailingOptions.map(opt => (
//                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                           <input type="radio" name="risk_trailing" className="accent-blue-600 w-3.5 h-3.5" checked={riskSettings?.profitTrailing === opt} onChange={() => handleChange('root', 'profitTrailing', opt)} />
//                           <span className={`text-xs font-medium ${opt === 'Time-Conditioned' ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{opt}</span>
//                        </label>
//                     ))}
//                  </div>

//                  {/* 🔥 TIMED CONDITIONED TRAILING UI */}
//                  {riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                      <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-200 mt-2 animate-in fade-in zoom-in-95 duration-200">
//                          <div className="mb-4">
//                              <strong className="block mb-2 text-[11px] text-indigo-700 uppercase tracking-wide">⏰ Phase 1 (Move SL to Cost)</strong>
//                              <div className="grid grid-cols-2 gap-4">
//                                  <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Trigger Time (Before)</label><input type="time" value={tcData.phase1Time || '12:00'} onChange={(e) => handleChange('timeConditionedTrailing', 'phase1Time', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">If Profit reaches (%)</label><input type="number" step="0.1" value={tcData.phase1Profit !== undefined ? tcData.phase1Profit : 0.5} onChange={(e) => handleChange('timeConditionedTrailing', 'phase1Profit', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                              </div>
//                          </div>
//                          <div>
//                              <strong className="block mb-2 text-[11px] text-indigo-700 uppercase tracking-wide">🚀 Phase 2 (Lock & Trail)</strong>
//                              <div className="grid grid-cols-4 gap-3">
//                                  <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Time (Before)</label><input type="time" value={tcData.phase2Time || '14:30'} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Time', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Profit &gt; (%)</label><input type="number" step="0.1" value={tcData.phase2Profit !== undefined ? tcData.phase2Profit : 1.0} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Profit', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" value={tcData.phase2Lock !== undefined ? tcData.phase2Lock : 0.8} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Lock', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                  <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" value={tcData.phase2Trail !== undefined ? tcData.phase2Trail : 0.2} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Trail', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                              </div>
//                          </div>
//                      </div>
//                  )}
//               </div>

//               {/* 🔥 RECOVERY SETTINGS UI */}
//               {strategyType === 'Time Based' && isRatioSpreadActive && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
//                       <label className="flex items-center gap-2 cursor-pointer group mb-3">
//                           <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={recData.enableRecovery === true} onChange={(e) => handleChange('recoverySettings', 'enableRecovery', e.target.checked)} />
//                           <span className="text-sm text-rose-600 font-bold flex items-center gap-1.5"><Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)</span>
//                       </label>

//                       {recData.enableRecovery && (
//                           <div className="bg-rose-50/30 p-4 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
//                               <div className="grid grid-cols-2 gap-4 mb-4">
//                                   <div><label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Max Recovery Attempts</label><input type="number" min="1" max="5" value={recData.attempts !== undefined ? recData.attempts : 2} onChange={(e) => handleChange('recoverySettings', 'attempts', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                   <div><label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Risk per Attempt (%)</label><input type="number" min="1" max="100" value={recData.riskPct !== undefined ? recData.riskPct : 50} onChange={(e) => handleChange('recoverySettings', 'riskPct', e.target.value)} className={`${inputClass} border-rose-200`} /><p className="text-[9px] text-rose-500 mt-1">% of remaining Max Loss</p></div>
//                               </div>
//                               <div className="pt-3 border-t border-rose-200/60">
//                                   <strong className="block mb-2 text-[11px] text-rose-700 uppercase tracking-wide">🚀 Recovery Trailing Rules</strong>
//                                   <div className="grid grid-cols-4 gap-3">
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">C2C Trigger (%)</label><input type="number" step="0.1" value={recData.c2cTrigger !== undefined ? recData.c2cTrigger : 0.4} onChange={(e) => handleChange('recoverySettings', 'c2cTrigger', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Lock Trigger (%)</label><input type="number" step="0.1" value={recData.target !== undefined ? recData.target : 1.0} onChange={(e) => handleChange('recoverySettings', 'target', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" value={recData.lock !== undefined ? recData.lock : 0.5} onChange={(e) => handleChange('recoverySettings', 'lock', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" value={recData.trail !== undefined ? recData.trail : 0.2} onChange={(e) => handleChange('recoverySettings', 'trail', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                   </div>
//                               </div>
//                           </div>
//                       )}
//                   </div>
//               )}

//        </div>
//     </div>
//   );
// };

// export default RiskManagementSection;





// import React, { useEffect } from 'react';
// import { ShieldCheck, Activity } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon, strategyType, legs = [] }) => {
  
//   const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

//   const isRatioSpreadActive = legs.some(leg => leg.strikeCriteria === 'Ratio Spread (Prem/X)');

//   // 🔥 THE CLEANUP: Agar Ratio Spread disable ho jaye toh features band kar do
//   useEffect(() => {
//       if (!isRatioSpreadActive) {
//           setRiskSettings(prev => {
//               let updates = {};
//               if (prev.profitTrailing === 'Time-Conditioned') updates.profitTrailing = 'No Trailing';
//               if (prev.recoverySettings?.enableRecovery === true) {
//                   updates.recoverySettings = { ...prev.recoverySettings, enableRecovery: false };
//               }
              
//               if (Object.keys(updates).length > 0) {
//                   return { ...prev, ...updates };
//               }
//               return prev;
//           });
//       }
//   }, [isRatioSpreadActive, setRiskSettings]);

//   // 📂 THE FIX: SMART HANDLE CHANGE (Folder wise data save karega)
//   const handleChange = (category, field, value) => {
//     let finalValue = value;
//     // 🔥 NEW: 'lateBoundaryTime' aur 'boundaryEndTime' ko string hi rehne dena hai, Number me convert nahi karna!
//     const stringFields = ['noTradeAfter', 'profitTrailing', 'phase1Time', 'phase2Time', 'lateBoundaryTime', 'boundaryEndTime'];
    
//     if (!stringFields.includes(field) && typeof value !== 'boolean') {
//         finalValue = Number(value);
//     }
    
//     setRiskSettings(prev => {
//         let updatedState = { ...prev };

//         // 1. Root Level (Main settings)
//         if (category === 'root') {
//             updatedState[field] = finalValue;
            
//             if (field === 'profitTrailing' && value === 'Time-Conditioned') {
//                 if (!updatedState.timeConditionedTrailing) {
//                     updatedState.timeConditionedTrailing = {
//                         phase1Time: '12:00', phase1Profit: 0.5,
//                         phase2Time: '14:30', phase2Profit: 1.0,
//                         phase2Lock: 0.8, phase2Trail: 0.2
//                     };
//                 }
//                 // Initialize default boundary times if not present
//                 if (!updatedState.lateBoundaryTime) updatedState.lateBoundaryTime = '14:30';
//                 if (!updatedState.boundaryEndTime) updatedState.boundaryEndTime = '15:00';
//             }
//         } 
//         // 2. Time Conditioned Folder
//         else if (category === 'timeConditionedTrailing') {
//             updatedState.timeConditionedTrailing = {
//                 ...updatedState.timeConditionedTrailing,
//                 [field]: finalValue
//             };
//         } 
//         // 3. Recovery Settings Folder
//         else if (category === 'recoverySettings') {
//             updatedState.recoverySettings = {
//                 ...updatedState.recoverySettings,
//                 [field]: finalValue
//             };
            
//             if (field === 'enableRecovery' && value === true) {
//                 if (!updatedState.recoverySettings.attempts) {
//                     updatedState.recoverySettings = {
//                         ...updatedState.recoverySettings,
//                         attempts: 2, riskPct: 50, c2cTrigger: 0.4, target: 1.0, lock: 0.5, trail: 0.2
//                     };
//                 }
//             }
//         }

//         return updatedState;
//     });
//   };

//   const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
//   const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

//   const containerClass = `w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300 ${
//     strategyType === 'Indicator Based' ? 'md:col-span-2' : ''  
//   }`;

//   const trailingOptions = ['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'];
//   if (isRatioSpreadActive) {
//       trailingOptions.push('Time-Conditioned');
//   }

//   // 📂 Shortcuts for easy reading
//   const tcData = riskSettings?.timeConditionedTrailing || {};
//   const recData = riskSettings?.recoverySettings || {};

//   return (
//     <div className={containerClass}>
       
//        {isComingSoon && <ComingSoonOverlay />}
//        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white"><ShieldCheck className="text-orange-500" size={18}/> Risk Management</h3>
//        <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-relaxed">Control your trading outcomes by setting global limits on losses and profits.</p>
       
//        <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Profit (₹ / %)</label><input type="number" placeholder="5000" value={riskSettings?.maxProfit || ''} onChange={(e) => handleChange('root', 'maxProfit', e.target.value)} className={`${inputClass} text-green-600 font-bold`} /></div>
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Loss (₹ / %)</label><input type="number" placeholder="2000" value={riskSettings?.maxLoss || ''} onChange={(e) => handleChange('root', 'maxLoss', e.target.value)} className={`${inputClass} text-red-600 font-bold`} /></div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Trade Cycle</label><input type="number" value={riskSettings?.maxTradeCycle || ''} onChange={(e) => handleChange('root', 'maxTradeCycle', e.target.value)} className={inputClass} /></div>
//                  <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">No Trade After</label><input type="time" value={riskSettings?.noTradeAfter || '15:15'} onChange={(e) => handleChange('root', 'noTradeAfter', e.target.value)} className={inputClass} /></div>
//               </div>
              
//               <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
//                  <label className="text-[10px] text-gray-500 block mb-3 font-bold uppercase">Profit Trailing</label>
//                  <div className="flex flex-wrap gap-4 mb-3">
//                     {trailingOptions.map(opt => (
//                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
//                           <input type="radio" name="risk_trailing" className="accent-blue-600 w-3.5 h-3.5" checked={riskSettings?.profitTrailing === opt} onChange={() => handleChange('root', 'profitTrailing', opt)} />
//                           <span className={`text-xs font-medium ${opt === 'Time-Conditioned' ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{opt}</span>
//                        </label>
//                     ))}
//                  </div>

//                  {/* 🔥 TIMED CONDITIONED TRAILING UI */}
//                  {riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                      <>
//                          <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-200 mt-2 animate-in fade-in zoom-in-95 duration-200">
//                              <div className="mb-4">
//                                  <strong className="block mb-2 text-[11px] text-indigo-700 uppercase tracking-wide">⏰ Phase 1 (Move SL to Cost)</strong>
//                                  <div className="grid grid-cols-2 gap-4">
//                                      <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Trigger Time (Before)</label><input type="time" value={tcData.phase1Time || '12:00'} onChange={(e) => handleChange('timeConditionedTrailing', 'phase1Time', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                      <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">If Profit reaches (%)</label><input type="number" step="0.1" value={tcData.phase1Profit !== undefined ? tcData.phase1Profit : 0.5} onChange={(e) => handleChange('timeConditionedTrailing', 'phase1Profit', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                  </div>
//                              </div>
//                              <div>
//                                  <strong className="block mb-2 text-[11px] text-indigo-700 uppercase tracking-wide">🚀 Phase 2 (Lock & Trail)</strong>
//                                  <div className="grid grid-cols-4 gap-3">
//                                      <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Time (Before)</label><input type="time" value={tcData.phase2Time || '14:30'} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Time', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                      <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Profit &gt; (%)</label><input type="number" step="0.1" value={tcData.phase2Profit !== undefined ? tcData.phase2Profit : 1.0} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Profit', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                      <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" value={tcData.phase2Lock !== undefined ? tcData.phase2Lock : 0.8} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Lock', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                      <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" value={tcData.phase2Trail !== undefined ? tcData.phase2Trail : 0.2} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Trail', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
//                                  </div>
//                              </div>
//                          </div>

//                          {/* 🔥 NEW: DYNAMIC BREAKEVEN BOUNDARY RULES UI */}
//                          <div className="bg-amber-50/60 p-4 rounded-lg border border-amber-300 mt-3 animate-in fade-in zoom-in-95 duration-200">
//                              <strong className="block mb-2 text-[11px] text-amber-700 uppercase tracking-wide">🚧 Breakeven Boundary Rules (Main Trade)</strong>
//                              <div className="grid grid-cols-2 gap-4">
//                                  <div>
//                                      <label className="text-[10px] text-amber-800/90 block mb-1 font-bold">Early/Late Cutoff Time</label>
//                                      <input type="time" value={riskSettings?.lateBoundaryTime || '14:30'} onChange={(e) => handleChange('root', 'lateBoundaryTime', e.target.value)} className={`${inputClass} border-amber-300 focus:border-amber-500`} />
//                                      <p className="text-[9px] text-amber-600/90 mt-1 leading-tight">Before this: Cut & Start Recovery<br/>After this: Exit All Immediately</p>
//                                  </div>
//                                  <div>
//                                      <label className="text-[10px] text-amber-800/90 block mb-1 font-bold">Boundary End Time</label>
//                                      <input type="time" value={riskSettings?.boundaryEndTime || '15:00'} onChange={(e) => handleChange('root', 'boundaryEndTime', e.target.value)} className={`${inputClass} border-amber-300 focus:border-amber-500`} />
//                                      <p className="text-[9px] text-amber-600/90 mt-1 leading-tight">Stop checking boundary completely after this time.</p>
//                                  </div>
//                              </div>
//                          </div>
//                      </>
//                  )}
//               </div>

//               {/* 🔥 RECOVERY SETTINGS UI */}
//               {strategyType === 'Time Based' && isRatioSpreadActive && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
//                       <label className="flex items-center gap-2 cursor-pointer group mb-3">
//                           <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={recData.enableRecovery === true} onChange={(e) => handleChange('recoverySettings', 'enableRecovery', e.target.checked)} />
//                           <span className="text-sm text-rose-600 font-bold flex items-center gap-1.5"><Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)</span>
//                       </label>

//                       {recData.enableRecovery && (
//                           <div className="bg-rose-50/30 p-4 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
//                               <div className="grid grid-cols-2 gap-4 mb-4">
//                                   <div><label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Max Recovery Attempts</label><input type="number" min="1" max="5" value={recData.attempts !== undefined ? recData.attempts : 2} onChange={(e) => handleChange('recoverySettings', 'attempts', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                   <div><label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Risk per Attempt (%)</label><input type="number" min="1" max="100" value={recData.riskPct !== undefined ? recData.riskPct : 50} onChange={(e) => handleChange('recoverySettings', 'riskPct', e.target.value)} className={`${inputClass} border-rose-200`} /><p className="text-[9px] text-rose-500 mt-1">% of remaining Max Loss</p></div>
//                               </div>
//                               <div className="pt-3 border-t border-rose-200/60">
//                                   <strong className="block mb-2 text-[11px] text-rose-700 uppercase tracking-wide">🚀 Recovery Trailing Rules</strong>
//                                   <div className="grid grid-cols-4 gap-3">
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">C2C Trigger (%)</label><input type="number" step="0.1" value={recData.c2cTrigger !== undefined ? recData.c2cTrigger : 0.4} onChange={(e) => handleChange('recoverySettings', 'c2cTrigger', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Lock Trigger (%)</label><input type="number" step="0.1" value={recData.target !== undefined ? recData.target : 1.0} onChange={(e) => handleChange('recoverySettings', 'target', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" value={recData.lock !== undefined ? recData.lock : 0.5} onChange={(e) => handleChange('recoverySettings', 'lock', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                       <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" value={recData.trail !== undefined ? recData.trail : 0.2} onChange={(e) => handleChange('recoverySettings', 'trail', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
//                                   </div>
//                               </div>
//                           </div>
//                       )}
//                   </div>
//               )}

//        </div>
//     </div>
//   );
// };

// export default RiskManagementSection;


import React, { useEffect } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import ComingSoonOverlay from './ComingSoonOverlay';

const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon, strategyType, legs = [] }) => {
  
  const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

  const isRatioSpreadActive = legs.some(leg => leg.strikeCriteria === 'Ratio Spread (Prem/X)');

  // 🔥 THE CLEANUP: Agar Ratio Spread disable ho jaye toh features band kar do
  useEffect(() => {
      if (!isRatioSpreadActive) {
          setRiskSettings(prev => {
              let updates = {};
              if (prev.profitTrailing === 'Time-Conditioned') updates.profitTrailing = 'No Trailing';
              if (prev.recoverySettings?.enableRecovery === true) {
                  updates.recoverySettings = { ...prev.recoverySettings, enableRecovery: false };
              }
              
              if (Object.keys(updates).length > 0) {
                  return { ...prev, ...updates };
              }
              return prev;
          });
      }
  }, [isRatioSpreadActive, setRiskSettings]);

  // 📂 THE FIX: SMART HANDLE CHANGE (Folder wise data save karega)
  const handleChange = (category, field, value) => {
    let finalValue = value;
    // 🔥 NEW: 'lateBoundaryTime' aur 'boundaryEndTime' ko string hi rehne dena hai, Number me convert nahi karna!
    const stringFields = ['noTradeAfter', 'profitTrailing', 'phase1Time', 'phase2Time', 'lateBoundaryTime', 'boundaryEndTime'];
    
    if (!stringFields.includes(field) && typeof value !== 'boolean') {
        finalValue = Number(value);
    }
    
    setRiskSettings(prev => {
        let updatedState = { ...prev };

        // 1. Root Level (Main settings)
        if (category === 'root') {
            updatedState[field] = finalValue;
            
            if (field === 'profitTrailing' && value === 'Time-Conditioned') {
                if (!updatedState.timeConditionedTrailing) {
                    updatedState.timeConditionedTrailing = {
                        phase1Time: '12:00', phase1Profit: 0.5,
                        phase2Time: '14:30', phase2Profit: 1.0,
                        phase2Lock: 0.8, phase2Trail: 0.2
                    };
                }
                // Initialize default boundary times if not present
                if (!updatedState.lateBoundaryTime) updatedState.lateBoundaryTime = '14:30';
                if (!updatedState.boundaryEndTime) updatedState.boundaryEndTime = '15:00';
            }
        } 
        // 2. Time Conditioned Folder
        else if (category === 'timeConditionedTrailing') {
            updatedState.timeConditionedTrailing = {
                ...updatedState.timeConditionedTrailing,
                [field]: finalValue
            };
        } 
        // 3. Recovery Settings Folder
        else if (category === 'recoverySettings') {
            updatedState.recoverySettings = {
                ...updatedState.recoverySettings,
                [field]: finalValue
            };
            
            // 🔥 NEW: Default slBufferPoints set to 15 when enabled
            if (field === 'enableRecovery' && value === true) {
                if (!updatedState.recoverySettings.attempts) {
                    updatedState.recoverySettings = {
                        ...updatedState.recoverySettings,
                        attempts: 2, riskPct: 50, slBufferPoints: 15, c2cTrigger: 0.4, target: 1.0, lock: 0.5, trail: 0.2
                    };
                }
            }
        }

        return updatedState;
    });
  };

  const showLockInputs = riskSettings?.profitTrailing === 'Lock Fix Profit' || riskSettings?.profitTrailing === 'Lock and Trail';
  const showTrailInputs = riskSettings?.profitTrailing === 'Trail Profit' || riskSettings?.profitTrailing === 'Lock and Trail';

  const containerClass = `w-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300 ${
    strategyType === 'Indicator Based' ? 'md:col-span-2' : ''  
  }`;

  const trailingOptions = ['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'];
  if (isRatioSpreadActive) {
      trailingOptions.push('Time-Conditioned');
  }

  // 📂 Shortcuts for easy reading
  const tcData = riskSettings?.timeConditionedTrailing || {};
  const recData = riskSettings?.recoverySettings || {};

  return (
    <div className={containerClass}>
       
       {isComingSoon && <ComingSoonOverlay />}
       <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white"><ShieldCheck className="text-orange-500" size={18}/> Risk Management</h3>
       <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-relaxed">Control your trading outcomes by setting global limits on losses and profits.</p>
       
       <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Profit (₹ / %)</label><input type="number" placeholder="5000" value={riskSettings?.maxProfit || ''} onChange={(e) => handleChange('root', 'maxProfit', e.target.value)} className={`${inputClass} text-green-600 font-bold`} /></div>
                 <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Loss (₹ / %)</label><input type="number" placeholder="2000" value={riskSettings?.maxLoss || ''} onChange={(e) => handleChange('root', 'maxLoss', e.target.value)} className={`${inputClass} text-red-600 font-bold`} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">Max Trade Cycle</label><input type="number" value={riskSettings?.maxTradeCycle || ''} onChange={(e) => handleChange('root', 'maxTradeCycle', e.target.value)} className={inputClass} /></div>
                 <div><label className="text-[10px] text-gray-500 block mb-1 font-bold">No Trade After</label><input type="time" value={riskSettings?.noTradeAfter || '15:15'} onChange={(e) => handleChange('root', 'noTradeAfter', e.target.value)} className={inputClass} /></div>
              </div>
              
              <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                 <label className="text-[10px] text-gray-500 block mb-3 font-bold uppercase">Profit Trailing</label>
                 <div className="flex flex-wrap gap-4 mb-3">
                    {trailingOptions.map(opt => (
                       <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="risk_trailing" className="accent-blue-600 w-3.5 h-3.5" checked={riskSettings?.profitTrailing === opt} onChange={() => handleChange('root', 'profitTrailing', opt)} />
                          <span className={`text-xs font-medium ${opt === 'Time-Conditioned' ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{opt}</span>
                       </label>
                    ))}
                 </div>

                 {/* 🔥 TIMED CONDITIONED TRAILING UI */}
                 {riskSettings?.profitTrailing === 'Time-Conditioned' && (
                     <>
                         <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-200 mt-2 animate-in fade-in zoom-in-95 duration-200">
                             <div className="mb-4">
                                 <strong className="block mb-2 text-[11px] text-indigo-700 uppercase tracking-wide">⏰ Phase 1 (Move SL to Cost)</strong>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Trigger Time (Before)</label><input type="time" value={tcData.phase1Time || '12:00'} onChange={(e) => handleChange('timeConditionedTrailing', 'phase1Time', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
                                     <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">If Profit reaches (%)</label><input type="number" step="0.1" value={tcData.phase1Profit !== undefined ? tcData.phase1Profit : 0.5} onChange={(e) => handleChange('timeConditionedTrailing', 'phase1Profit', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
                                 </div>
                             </div>
                             <div>
                                 <strong className="block mb-2 text-[11px] text-indigo-700 uppercase tracking-wide">🚀 Phase 2 (Lock & Trail)</strong>
                                 <div className="grid grid-cols-4 gap-3">
                                     <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Time (Before)</label><input type="time" value={tcData.phase2Time || '14:30'} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Time', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
                                     <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Profit &gt; (%)</label><input type="number" step="0.1" value={tcData.phase2Profit !== undefined ? tcData.phase2Profit : 1.0} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Profit', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
                                     <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" value={tcData.phase2Lock !== undefined ? tcData.phase2Lock : 0.8} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Lock', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
                                     <div><label className="text-[10px] text-indigo-600/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" value={tcData.phase2Trail !== undefined ? tcData.phase2Trail : 0.2} onChange={(e) => handleChange('timeConditionedTrailing', 'phase2Trail', e.target.value)} className={`${inputClass} border-indigo-200`} /></div>
                                 </div>
                             </div>
                         </div>

                         {/* 🔥 NEW: DYNAMIC BREAKEVEN BOUNDARY RULES UI */}
                         <div className="bg-amber-50/60 p-4 rounded-lg border border-amber-300 mt-3 animate-in fade-in zoom-in-95 duration-200">
                             <strong className="block mb-2 text-[11px] text-amber-700 uppercase tracking-wide">🚧 Breakeven Boundary Rules (Main Trade)</strong>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label className="text-[10px] text-amber-800/90 block mb-1 font-bold">Early/Late Cutoff Time</label>
                                     <input type="time" value={riskSettings?.lateBoundaryTime || '14:30'} onChange={(e) => handleChange('root', 'lateBoundaryTime', e.target.value)} className={`${inputClass} border-amber-300 focus:border-amber-500`} />
                                     <p className="text-[9px] text-amber-600/90 mt-1 leading-tight">Before this: Cut & Start Recovery<br/>After this: Exit All Immediately</p>
                                 </div>
                                 <div>
                                     <label className="text-[10px] text-amber-800/90 block mb-1 font-bold">Boundary End Time</label>
                                     <input type="time" value={riskSettings?.boundaryEndTime || '15:00'} onChange={(e) => handleChange('root', 'boundaryEndTime', e.target.value)} className={`${inputClass} border-amber-300 focus:border-amber-500`} />
                                     <p className="text-[9px] text-amber-600/90 mt-1 leading-tight">Stop checking boundary completely after this time.</p>
                                 </div>
                             </div>
                         </div>
                     </>
                 )}
              </div>

              {/* 🔥 RECOVERY SETTINGS UI */}
              {strategyType === 'Time Based' && isRatioSpreadActive && (
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
                      <label className="flex items-center gap-2 cursor-pointer group mb-3">
                          <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={recData.enableRecovery === true} onChange={(e) => handleChange('recoverySettings', 'enableRecovery', e.target.checked)} />
                          <span className="text-sm text-rose-600 font-bold flex items-center gap-1.5"><Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)</span>
                      </label>

                      {recData.enableRecovery && (
                          <div className="bg-rose-50/30 p-4 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
                              {/* 🔥 UPDATE: 3 Columns Grid for New Buffer Parameter */}
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div>
                                      <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Max Attempts</label>
                                      <input type="number" min="1" max="5" value={recData.attempts !== undefined ? recData.attempts : 2} onChange={(e) => handleChange('recoverySettings', 'attempts', e.target.value)} className={`${inputClass} border-rose-200`} />
                                  </div>
                                  <div>
                                      <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Risk/Attempt (%)</label>
                                      <input type="number" min="1" max="100" value={recData.riskPct !== undefined ? recData.riskPct : 50} onChange={(e) => handleChange('recoverySettings', 'riskPct', e.target.value)} className={`${inputClass} border-rose-200`} />
                                      <p className="text-[9px] text-rose-500 mt-1">% of remaining Loss</p>
                                  </div>
                                  <div>
                                      <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">SL Buffer (Points)</label>
                                      <input type="number" min="1" value={recData.slBufferPoints !== undefined ? recData.slBufferPoints : 15} onChange={(e) => handleChange('recoverySettings', 'slBufferPoints', e.target.value)} className={`${inputClass} border-rose-200`} />
                                      <p className="text-[9px] text-rose-500 mt-1">Min points per lot</p>
                                  </div>
                              </div>
                              
                              <div className="pt-3 border-t border-rose-200/60">
                                  <strong className="block mb-2 text-[11px] text-rose-700 uppercase tracking-wide">🚀 Recovery Trailing Rules</strong>
                                  <div className="grid grid-cols-4 gap-3">
                                      <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">C2C Trigger (%)</label><input type="number" step="0.1" value={recData.c2cTrigger !== undefined ? recData.c2cTrigger : 0.4} onChange={(e) => handleChange('recoverySettings', 'c2cTrigger', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
                                      <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Lock Trigger (%)</label><input type="number" step="0.1" value={recData.target !== undefined ? recData.target : 1.0} onChange={(e) => handleChange('recoverySettings', 'target', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
                                      <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Lock at (%)</label><input type="number" step="0.1" value={recData.lock !== undefined ? recData.lock : 0.5} onChange={(e) => handleChange('recoverySettings', 'lock', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
                                      <div><label className="text-[10px] text-rose-600/80 block mb-1 font-bold">Trail by (%)</label><input type="number" step="0.1" value={recData.trail !== undefined ? recData.trail : 0.2} onChange={(e) => handleChange('recoverySettings', 'trail', e.target.value)} className={`${inputClass} border-rose-200`} /></div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              )}

       </div>
    </div>
  );
};

export default RiskManagementSection;