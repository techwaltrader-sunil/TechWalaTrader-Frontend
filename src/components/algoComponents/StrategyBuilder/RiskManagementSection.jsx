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
            
//             // 🔥 NEW: Default slBufferPoints set to 15 when enabled
//             if (field === 'enableRecovery' && value === true) {
//                 if (!updatedState.recoverySettings.attempts) {
//                     updatedState.recoverySettings = {
//                         ...updatedState.recoverySettings,
//                         attempts: 2, riskPct: 50, slBufferPoints: 15, c2cTrigger: 0.4, target: 1.0, lock: 0.5, trail: 0.2
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
//                               {/* 🔥 UPDATE: 3 Columns Grid for New Buffer Parameter */}
//                               <div className="grid grid-cols-3 gap-4 mb-4">
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Max Attempts</label>
//                                       <input type="number" min="1" max="5" value={recData.attempts !== undefined ? recData.attempts : 2} onChange={(e) => handleChange('recoverySettings', 'attempts', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                   </div>
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Risk/Attempt (%)</label>
//                                       <input type="number" min="1" max="100" value={recData.riskPct !== undefined ? recData.riskPct : 50} onChange={(e) => handleChange('recoverySettings', 'riskPct', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                       <p className="text-[9px] text-rose-500 mt-1">% of remaining Loss</p>
//                                   </div>
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">SL Buffer (Points)</label>
//                                       <input type="number" min="1" value={recData.slBufferPoints !== undefined ? recData.slBufferPoints : 15} onChange={(e) => handleChange('recoverySettings', 'slBufferPoints', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                       <p className="text-[9px] text-rose-500 mt-1">Min points per lot</p>
//                                   </div>
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
//     // 🔥 NEW: 'legSelectionMode' ko stringFields me add kiya gaya hai taki wo Number me convert na ho!
//     const stringFields = ['noTradeAfter', 'profitTrailing', 'phase1Time', 'phase2Time', 'lateBoundaryTime', 'boundaryEndTime', 'legSelectionMode'];
    
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

//             if (field === 'legSelectionMode' && value === 'ASYMMETRIC') {
//                 if (updatedState.maxAsymmetricLots === undefined) {
//                     updatedState.maxAsymmetricLots = 5;
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
            
//             // 🔥 NEW: Default slBufferPoints set to 15 when enabled
//             if (field === 'enableRecovery' && value === true) {
//                 if (!updatedState.recoverySettings.attempts) {
//                     updatedState.recoverySettings = {
//                         ...updatedState.recoverySettings,
//                         attempts: 2, riskPct: 50, slBufferPoints: 15, c2cTrigger: 0.4, target: 1.0, lock: 0.5, trail: 0.2
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

//               {/* 🔥 NEW: RATIO SPREAD EXECUTION MODE (SYMMETRIC VS ASYMMETRIC) */}
//               {isRatioSpreadActive && riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2">
//                       <label className="text-[10px] text-gray-500 block mb-3 font-bold uppercase">⚡ Ratio Spread Execution Mode</label>
//                       <div className="flex flex-wrap gap-4 mb-3">
//                           <label className="flex items-center gap-2 cursor-pointer group">
//                               {/* Agar 'legSelectionMode' backend se undefined aata hai to default Symmetric mana jayega */}
//                               <input type="radio" name="leg_selection" className="accent-blue-600 w-3.5 h-3.5" 
//                                   checked={riskSettings?.legSelectionMode !== 'ASYMMETRIC'} 
//                                   onChange={() => handleChange('root', 'legSelectionMode', 'SYMMETRIC')} />
//                               <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Symmetric (Fixed Steps)</span>
//                           </label>
//                           <label className="flex items-center gap-2 cursor-pointer group">
//                               <input type="radio" name="leg_selection" className="accent-purple-600 w-3.5 h-3.5" 
//                                   checked={riskSettings?.legSelectionMode === 'ASYMMETRIC'} 
//                                   onChange={() => handleChange('root', 'legSelectionMode', 'ASYMMETRIC')} />
//                               <span className="text-xs font-bold text-purple-600">Asymmetric (Premium Matched)</span>
//                           </label>
//                       </div>

//                       {/* Event Day Safety Guard UI for Asymmetric Mode */}
//                       {riskSettings?.legSelectionMode === 'ASYMMETRIC' && (
//                           <div className="bg-purple-50/40 p-4 rounded-lg border border-purple-200 mb-2 animate-in fade-in zoom-in-95 duration-200">
//                               <p className="text-[10px] text-purple-700 mb-3 leading-relaxed font-medium">
//                                   🔥 <strong>Smart Mode:</strong> Matches exact premium (ATM/4) on both sides. Sell lot quantity is dynamically calculated based on strike distance to maintain strict delta neutrality.
//                               </p>
//                               <div>
//                                   <label className="text-[10px] text-purple-800 font-bold block mb-1 uppercase">Max Event-Day Sell Lots (Safety Guard)</label>
//                                   <input type="number" min="3" max="15" placeholder="5" 
//                                       value={riskSettings?.maxAsymmetricLots !== undefined ? riskSettings?.maxAsymmetricLots : 5} 
//                                       onChange={(e) => handleChange('root', 'maxAsymmetricLots', e.target.value)} 
//                                       className={`${inputClass} border-purple-300 focus:border-purple-500 w-1/2`} />
//                                   <p className="text-[9px] text-purple-500 mt-1 font-medium">Prevents margin block/crash on high IV days (e.g., Budget, Election). Caps extreme sell quantities.</p>
//                               </div>
//                           </div>
//                       )}
//                   </div>
//               )}

//               {/* 🔥 RECOVERY SETTINGS UI */}
//               {strategyType === 'Time Based' && isRatioSpreadActive && riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
//                       <label className="flex items-center gap-2 cursor-pointer group mb-3">
//                           <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={recData.enableRecovery === true} onChange={(e) => handleChange('recoverySettings', 'enableRecovery', e.target.checked)} />
//                           <span className="text-sm text-rose-600 font-bold flex items-center gap-1.5"><Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)</span>
//                       </label>

//                       {recData.enableRecovery && (
//                           <div className="bg-rose-50/30 p-4 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
//                               {/* 🔥 UPDATE: 3 Columns Grid for New Buffer Parameter */}
//                               <div className="grid grid-cols-3 gap-4 mb-4">
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Max Attempts</label>
//                                       <input type="number" min="1" max="5" value={recData.attempts !== undefined ? recData.attempts : 2} onChange={(e) => handleChange('recoverySettings', 'attempts', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                   </div>
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Risk/Attempt (%)</label>
//                                       <input type="number" min="1" max="100" value={recData.riskPct !== undefined ? recData.riskPct : 50} onChange={(e) => handleChange('recoverySettings', 'riskPct', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                       <p className="text-[9px] text-rose-500 mt-1">% of remaining Loss</p>
//                                   </div>
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">SL Buffer (Points)</label>
//                                       <input type="number" min="1" value={recData.slBufferPoints !== undefined ? recData.slBufferPoints : 15} onChange={(e) => handleChange('recoverySettings', 'slBufferPoints', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                       <p className="text-[9px] text-rose-500 mt-1">Min points per lot</p>
//                                   </div>
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
// import { ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
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

//   // 🔥 THE DEFAULT INJECTOR: Agar user input change na kare, toh bhi default values save honi chahiye
//   useEffect(() => {
//       if (isRatioSpreadActive) {
//           setRiskSettings(prev => {
//               let updates = {};
              
//               // 👇 NAYA FIX: Ek 'gammaBlastSettings' object bana kar usme teeno daal do
//               if (!prev.gammaBlastSettings) {
//                   updates.gammaBlastSettings = {
//                       velocityWindow: 15,
//                       velocityPoints: 100,
//                       panicLimitPct: 70
//                   };
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
//     // 🔥 NEW: 'legSelectionMode' ko stringFields me add kiya gaya hai taki wo Number me convert na ho!
//     const stringFields = ['noTradeAfter', 'profitTrailing', 'phase1Time', 'phase2Time', 'lateBoundaryTime', 'boundaryEndTime', 'legSelectionMode'];
    
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

//             if (field === 'legSelectionMode' && value === 'ASYMMETRIC') {
//                 if (updatedState.maxAsymmetricLots === undefined) {
//                     updatedState.maxAsymmetricLots = 5;
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
            
//             // 🔥 NEW: Default slBufferPoints set to 15 when enabled
//             if (field === 'enableRecovery' && value === true) {
//                 if (!updatedState.recoverySettings.attempts) {
//                     updatedState.recoverySettings = {
//                         ...updatedState.recoverySettings,
//                         attempts: 2, riskPct: 50, slBufferPoints: 15, c2cTrigger: 0.4, target: 1.0, lock: 0.5, trail: 0.2
//                     };
//                 }
//             }
//         }

//         // 4. Gamma Blast Settings Folder
//         else if (category === 'gammaBlastSettings') {
//             updatedState.gammaBlastSettings = {
//                 ...updatedState.gammaBlastSettings,
//                 [field]: finalValue
//             };
//         }

//         return updatedState;
//     });
//   };

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

//               {/* 🔥 NEW: RATIO SPREAD EXECUTION MODE (SYMMETRIC VS ASYMMETRIC) */}
//               {isRatioSpreadActive && riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2">
//                       <label className="text-[10px] text-gray-500 block mb-3 font-bold uppercase">⚡ Ratio Spread Execution Mode</label>
//                       <div className="flex flex-wrap gap-4 mb-3">
//                           <label className="flex items-center gap-2 cursor-pointer group">
//                               {/* Agar 'legSelectionMode' backend se undefined aata hai to default Symmetric mana jayega */}
//                               <input type="radio" name="leg_selection" className="accent-blue-600 w-3.5 h-3.5" 
//                                   checked={riskSettings?.legSelectionMode !== 'ASYMMETRIC'} 
//                                   onChange={() => handleChange('root', 'legSelectionMode', 'SYMMETRIC')} />
//                               <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Symmetric (Fixed Steps)</span>
//                           </label>
//                           <label className="flex items-center gap-2 cursor-pointer group">
//                               <input type="radio" name="leg_selection" className="accent-purple-600 w-3.5 h-3.5" 
//                                   checked={riskSettings?.legSelectionMode === 'ASYMMETRIC'} 
//                                   onChange={() => handleChange('root', 'legSelectionMode', 'ASYMMETRIC')} />
//                               <span className="text-xs font-bold text-purple-600">Asymmetric (Premium Matched)</span>
//                           </label>
//                       </div>

//                       {/* Event Day Safety Guard UI for Asymmetric Mode */}
//                       {riskSettings?.legSelectionMode === 'ASYMMETRIC' && (
//                           <div className="bg-purple-50/40 p-4 rounded-lg border border-purple-200 mb-2 animate-in fade-in zoom-in-95 duration-200">
//                               <p className="text-[10px] text-purple-700 mb-3 leading-relaxed font-medium">
//                                   🔥 <strong>Smart Mode:</strong> Matches exact premium (ATM/4) on both sides. Sell lot quantity is dynamically calculated based on strike distance to maintain strict delta neutrality.
//                               </p>
//                               <div>
//                                   <label className="text-[10px] text-purple-800 font-bold block mb-1 uppercase">Max Event-Day Sell Lots (Safety Guard)</label>
//                                   <input type="number" min="3" max="15" placeholder="5" 
//                                       value={riskSettings?.maxAsymmetricLots !== undefined ? riskSettings?.maxAsymmetricLots : 5} 
//                                       onChange={(e) => handleChange('root', 'maxAsymmetricLots', e.target.value)} 
//                                       className={`${inputClass} border-purple-300 focus:border-purple-500 w-1/2`} />
//                                   <p className="text-[9px] text-purple-500 mt-1 font-medium">Prevents margin block/crash on high IV days (e.g., Budget, Election). Caps extreme sell quantities.</p>
//                               </div>
//                           </div>
//                       )}
                      
//                       {/* 🔥 DYNAMIC GAMMA BLAST VELOCITY GUARD UI */}
//                       <div className="bg-red-50/40 p-4 rounded-lg border border-red-200 mt-3 animate-in fade-in zoom-in-95 duration-200">
//                           <strong className="mb-2 text-[11px] text-red-700 uppercase tracking-wide flex items-center gap-1.5">
//                               <AlertTriangle size={14} /> Gamma Blast (Velocity Guard)
//                           </strong>
//                           <p className="text-[10px] text-red-600/90 mb-3 leading-relaxed font-medium">
//                               Detects sudden market crashes. If the market falls rapidly within the time window, it bypasses Mock MTM and verifies real API to prevent IV crush loss.
//                           </p>
//                           <div className="grid grid-cols-3 gap-4">
//                               <div>
//                                   <label className="text-[10px] text-red-800/90 block mb-1 font-bold">Track Window (Mins)</label>
//                                   <input type="number" min="1" 
//                                       value={riskSettings?.gammaBlastSettings?.velocityWindow !== undefined ? riskSettings?.gammaBlastSettings?.velocityWindow : 15} 
//                                       onChange={(e) => handleChange('gammaBlastSettings', 'velocityWindow', e.target.value)} 
//                                       className={`${inputClass} border-red-300 focus:border-red-500 bg-red-50/50`} />
//                               </div>
//                               <div>
//                                   <label className="text-[10px] text-red-800/90 block mb-1 font-bold">Trigger Speed (Pts)</label>
//                                   <input type="number" min="1" 
//                                       value={riskSettings?.gammaBlastSettings?.velocityPoints !== undefined ? riskSettings?.gammaBlastSettings?.velocityPoints : 100} 
//                                       onChange={(e) => handleChange('gammaBlastSettings', 'velocityPoints', e.target.value)} 
//                                       className={`${inputClass} border-red-300 focus:border-red-500 bg-red-50/50`} />
//                               </div>
//                               <div>
//                                   <label className="text-[10px] text-red-800/90 block mb-1 font-bold">Panic Cutoff SL (%)</label>
//                                   <input type="number" min="1" max="100" 
//                                       value={riskSettings?.gammaBlastSettings?.panicLimitPct !== undefined ? riskSettings?.gammaBlastSettings?.panicLimitPct : 70} 
//                                       onChange={(e) => handleChange('gammaBlastSettings', 'panicLimitPct', e.target.value)} 
//                                       className={`${inputClass} border-red-300 focus:border-red-500 bg-red-50/50`} />
//                               </div>
//                           </div>
//                       </div>
                      
//                   </div>
//               )}

//               {/* 🔥 RECOVERY SETTINGS UI */}
//               {strategyType === 'Time Based' && isRatioSpreadActive && riskSettings?.profitTrailing === 'Time-Conditioned' && (
//                   <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
//                       <label className="flex items-center gap-2 cursor-pointer group mb-3">
//                           <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={recData.enableRecovery === true} onChange={(e) => handleChange('recoverySettings', 'enableRecovery', e.target.checked)} />
//                           <span className="text-sm text-rose-600 font-bold flex items-center gap-1.5"><Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)</span>
//                       </label>

//                       {recData.enableRecovery && (
//                           <div className="bg-rose-50/30 p-4 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
//                               <div className="grid grid-cols-3 gap-4 mb-4">
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Max Attempts</label>
//                                       <input type="number" min="1" max="5" value={recData.attempts !== undefined ? recData.attempts : 2} onChange={(e) => handleChange('recoverySettings', 'attempts', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                   </div>
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">Risk/Attempt (%)</label>
//                                       <input type="number" min="1" max="100" value={recData.riskPct !== undefined ? recData.riskPct : 50} onChange={(e) => handleChange('recoverySettings', 'riskPct', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                       <p className="text-[9px] text-rose-500 mt-1">% of remaining Loss</p>
//                                   </div>
//                                   <div>
//                                       <label className="text-[10px] text-rose-700 block mb-1.5 font-bold uppercase">SL Buffer (Points)</label>
//                                       <input type="number" min="1" value={recData.slBufferPoints !== undefined ? recData.slBufferPoints : 15} onChange={(e) => handleChange('recoverySettings', 'slBufferPoints', e.target.value)} className={`${inputClass} border-rose-200`} />
//                                       <p className="text-[9px] text-rose-500 mt-1">Min points per lot</p>
//                                   </div>
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
import { ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
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

  // 🔥 THE DEFAULT INJECTOR: Agar user input change na kare, toh bhi default values save honi chahiye
  useEffect(() => {
      if (isRatioSpreadActive) {
          setRiskSettings(prev => {
              let updates = {};
              
              if (!prev.gammaBlastSettings) {
                  updates.gammaBlastSettings = {
                      velocityWindow: 15,
                      velocityPoints: 100,
                      panicLimitPct: 70
                  };
              }

              // 🔥 NAYA FIX: Intrinsic Guard ko default 'false' set karo taki DB me hamesha save ho
              if (prev.enableIntrinsicGuard === undefined) {
                  updates.enableIntrinsicGuard = false;
              }

              // 🔥 NAYA FIX 2: Freak Tick Guard ko bhi default 'false' set karo
              if (prev.enableFreakTickGuard === undefined) {
                  updates.enableFreakTickGuard = false;
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
    
    const stringFields = ['noTradeAfter', 'profitTrailing', 'phase1Time', 'phase2Time', 'lateBoundaryTime', 'boundaryEndTime', 'legSelectionMode'];
    
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
                if (!updatedState.lateBoundaryTime) updatedState.lateBoundaryTime = '14:30';
                if (!updatedState.boundaryEndTime) updatedState.boundaryEndTime = '15:00';
            }

            // 🔥 NEW: Apply Max Lots logic for both Dynamic Modes
            if (field === 'legSelectionMode' && (value === 'ASYMMETRIC' || value === 'ADAPTIVE_SKEW')) {
                if (updatedState.maxAsymmetricLots === undefined) {
                    updatedState.maxAsymmetricLots = 5;
                }
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
            
            if (field === 'enableRecovery' && value === true) {
                if (!updatedState.recoverySettings.attempts) {
                    updatedState.recoverySettings = {
                        ...updatedState.recoverySettings,
                        attempts: 2, riskPct: 50, slBufferPoints: 15, c2cTrigger: 0.4, target: 1.0, lock: 0.5, trail: 0.2
                    };
                }
            }
        }
        // 4. Gamma Blast Settings Folder
        else if (category === 'gammaBlastSettings') {
            updatedState.gammaBlastSettings = {
                ...updatedState.gammaBlastSettings,
                [field]: finalValue
            };
        }

        return updatedState;
    });
  };

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

              {/* 🔥 NEW: RATIO SPREAD EXECUTION MODE (SYMMETRIC VS ASYMMETRIC VS ADAPTIVE) */}
              {isRatioSpreadActive && riskSettings?.profitTrailing === 'Time-Conditioned' && (
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2">
                      <label className="text-[10px] text-gray-500 block mb-3 font-bold uppercase">⚡ Ratio Spread Execution Mode</label>
                      <div className="flex flex-wrap gap-4 mb-3">
                          <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name="leg_selection" className="accent-blue-600 w-3.5 h-3.5" 
                                  checked={!riskSettings?.legSelectionMode || riskSettings?.legSelectionMode === 'SYMMETRIC'} 
                                  onChange={() => handleChange('root', 'legSelectionMode', 'SYMMETRIC')} />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Symmetric (Fixed Steps)</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name="leg_selection" className="accent-purple-600 w-3.5 h-3.5" 
                                  checked={riskSettings?.legSelectionMode === 'ASYMMETRIC'} 
                                  onChange={() => handleChange('root', 'legSelectionMode', 'ASYMMETRIC')} />
                              <span className="text-xs font-bold text-purple-600">Asymmetric (Premium Matched)</span>
                          </label>
                          
                          {/* 🔥 NAYA MODE INJECT KIYA GAYA */}
                          <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name="leg_selection" className="accent-emerald-600 w-3.5 h-3.5" 
                                  checked={riskSettings?.legSelectionMode === 'ADAPTIVE_SKEW'} 
                                  onChange={() => handleChange('root', 'legSelectionMode', 'ADAPTIVE_SKEW')} />
                              <span className="text-xs font-bold text-emerald-600">Adaptive Skew Mode</span>
                          </label>
                      </div>

                      {/* Event Day Safety Guard UI for Both Dynamic Modes */}
                      {(riskSettings?.legSelectionMode === 'ASYMMETRIC' || riskSettings?.legSelectionMode === 'ADAPTIVE_SKEW') && (
                          <div className={`p-4 rounded-lg border mb-2 animate-in fade-in zoom-in-95 duration-200 ${riskSettings.legSelectionMode === 'ADAPTIVE_SKEW' ? 'bg-emerald-50/40 border-emerald-200' : 'bg-purple-50/40 border-purple-200'}`}>
                              <p className={`text-[10px] mb-3 leading-relaxed font-medium ${riskSettings.legSelectionMode === 'ADAPTIVE_SKEW' ? 'text-emerald-700' : 'text-purple-700'}`}>
                                  {riskSettings.legSelectionMode === 'ADAPTIVE_SKEW' ? (
                                      <>🔥 <strong>Adaptive Skew Mode:</strong> Matches premiums but balances risk dynamically. Reduces lots (3 vs 4) on closer strikes and shifts dangerous skews (+1 step) to maximize break-even and survive extreme IV days.</>
                                  ) : (
                                      <>🔥 <strong>Smart Mode:</strong> Matches exact premium (ATM/4) on both sides. Sell lot quantity is dynamically calculated based on strike distance to maintain strict delta neutrality.</>
                                  )}
                              </p>
                              <div>
                                  <label className={`text-[10px] font-bold block mb-1 uppercase ${riskSettings.legSelectionMode === 'ADAPTIVE_SKEW' ? 'text-emerald-800' : 'text-purple-800'}`}>Max Event-Day Sell Lots (Safety Guard)</label>
                                  <input type="number" min="3" max="15" placeholder="5" 
                                      value={riskSettings?.maxAsymmetricLots !== undefined ? riskSettings?.maxAsymmetricLots : 5} 
                                      onChange={(e) => handleChange('root', 'maxAsymmetricLots', e.target.value)} 
                                      className={`${inputClass} w-1/2 ${riskSettings.legSelectionMode === 'ADAPTIVE_SKEW' ? 'border-emerald-300 focus:border-emerald-500' : 'border-purple-300 focus:border-purple-500'}`} />
                                  <p className={`text-[9px] mt-1 font-medium ${riskSettings.legSelectionMode === 'ADAPTIVE_SKEW' ? 'text-emerald-600' : 'text-purple-500'}`}>Prevents margin block/crash on high IV days (e.g., Budget, Election). Caps extreme sell quantities.</p>
                              </div>
                          </div>
                      )}

                      {/* 🔥 NEW: INTRINSIC GUARD TOGGLE */}
                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
                            <label className="flex items-center gap-2 cursor-pointer group mb-2">
                                <input 
                                    type="checkbox" 
                                    className="accent-blue-600 w-4 h-4" 
                                    checked={riskSettings?.enableIntrinsicGuard === true} 
                                    onChange={(e) => handleChange('root', 'enableIntrinsicGuard', e.target.checked)} 
                                />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                    🛡️ Enable Strict Intrinsic Guard (Math Floor)
                                </span>
                            </label>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed ml-6">
                                <strong>OFF (Recommended):</strong> Trusts the API's real traded price even if it trades below intrinsic value.<br/>
                                <strong>ON:</strong> Forces a mathematical floor price if API returns an unusually low premium.
                            </p>
                        </div>

                      {/* 🔥 NEW: FREAK TICK GUARD TOGGLE */}
                        <div className="pt-2 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group mb-2">
                                <input 
                                    type="checkbox" 
                                    className="accent-purple-600 w-4 h-4" 
                                    checked={riskSettings?.enableFreakTickGuard === true} 
                                    onChange={(e) => handleChange('root', 'enableFreakTickGuard', e.target.checked)} 
                                />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                    ⚡ Enable Freak Tick Guard (Spike Filter)
                                </span>
                            </label>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed ml-6">
                                <strong>OFF (Recommended):</strong> Fully trusts the broker's API price, even if it spikes aggressively due to sudden IV crush/expansion.<br/>
                                <strong>ON:</strong> Blocks extreme API spikes (3x & 40+ pts diff) assuming them as broker data glitches.
                            </p>
                        </div>
                      
                      {/* 🔥 DYNAMIC GAMMA BLAST VELOCITY GUARD UI */}
                      <div className="bg-red-50/40 p-4 rounded-lg border border-red-200 mt-3 animate-in fade-in zoom-in-95 duration-200">
                          <strong className="mb-2 text-[11px] text-red-700 uppercase tracking-wide flex items-center gap-1.5">
                              <AlertTriangle size={14} /> Gamma Blast (Velocity Guard)
                          </strong>
                          <p className="text-[10px] text-red-600/90 mb-3 leading-relaxed font-medium">
                              Detects sudden market crashes. If the market falls rapidly within the time window, it bypasses Mock MTM and verifies real API to prevent IV crush loss.
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                              <div>
                                  <label className="text-[10px] text-red-800/90 block mb-1 font-bold">Track Window (Mins)</label>
                                  <input type="number" min="1" 
                                      value={riskSettings?.gammaBlastSettings?.velocityWindow !== undefined ? riskSettings?.gammaBlastSettings?.velocityWindow : 15} 
                                      onChange={(e) => handleChange('gammaBlastSettings', 'velocityWindow', e.target.value)} 
                                      className={`${inputClass} border-red-300 focus:border-red-500 bg-red-50/50`} />
                              </div>
                              <div>
                                  <label className="text-[10px] text-red-800/90 block mb-1 font-bold">Trigger Speed (Pts)</label>
                                  <input type="number" min="1" 
                                      value={riskSettings?.gammaBlastSettings?.velocityPoints !== undefined ? riskSettings?.gammaBlastSettings?.velocityPoints : 100} 
                                      onChange={(e) => handleChange('gammaBlastSettings', 'velocityPoints', e.target.value)} 
                                      className={`${inputClass} border-red-300 focus:border-red-500 bg-red-50/50`} />
                              </div>
                              <div>
                                  <label className="text-[10px] text-red-800/90 block mb-1 font-bold">Panic Cutoff SL (%)</label>
                                  <input type="number" min="1" max="100" 
                                      value={riskSettings?.gammaBlastSettings?.panicLimitPct !== undefined ? riskSettings?.gammaBlastSettings?.panicLimitPct : 70} 
                                      onChange={(e) => handleChange('gammaBlastSettings', 'panicLimitPct', e.target.value)} 
                                      className={`${inputClass} border-red-300 focus:border-red-500 bg-red-50/50`} />
                              </div>
                          </div>
                      </div>
                      
                  </div>
              )}

              {/* 🔥 RECOVERY SETTINGS UI */}
              {strategyType === 'Time Based' && isRatioSpreadActive && riskSettings?.profitTrailing === 'Time-Conditioned' && (
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2 animate-in fade-in duration-300">
                      <label className="flex items-center gap-2 cursor-pointer group mb-3">
                          <input type="checkbox" className="accent-rose-500 w-4 h-4" checked={recData.enableRecovery === true} onChange={(e) => handleChange('recoverySettings', 'enableRecovery', e.target.checked)} />
                          <span className="text-sm text-rose-600 font-bold flex items-center gap-1.5"><Activity size={16} /> Enable Auto-Recovery Trade (Firefighting)</span>
                      </label>

                      {recData.enableRecovery && (
                          <div className="bg-rose-50/30 p-4 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
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