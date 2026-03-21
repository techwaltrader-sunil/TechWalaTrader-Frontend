
// import React, { useEffect } from 'react';
// import { Layers } from 'lucide-react';

// const AdvanceFeaturesSection = ({ advanceSettings, setAdvanceSettings, legs }) => {
  
//   const features = [
//     { key: 'moveSLToCost', label: 'Move SL to Cost' },
//     { key: 'exitAllOnSLTgt', label: 'Exit All on SL/Tgt' },
//     { key: 'prePunchSL', label: 'Pre Punch SL' },
//     { key: 'waitAndTrade', label: 'Wait & Trade' },
//     { key: 'premiumDifference', label: 'Premium Difference' }, // Needs 2+ Legs
//     { key: 'reEntryExecute', label: 'Re Entry/Execute' },
//     { key: 'trailSL', label: 'Trail SL' },
//   ];

//   // Safety Check: If legs < 2 and Premium Diff is ON, turn it OFF
//   useEffect(() => {
//     if (legs && legs.length < 2 && advanceSettings.premiumDifference) {
//         setAdvanceSettings(prev => ({ ...prev, premiumDifference: false }));
//     }
//   }, [legs]);

//   const handleToggle = (key) => {
//     setAdvanceSettings(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   return (
//     // ✅ Main Container: Light (White) | Dark (Slate-800)
//     <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 shadow-sm dark:shadow-none transition-colors duration-300">
       
//        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
//           <Layers className="text-purple-600 dark:text-purple-500" size={18}/> Advance Features
//        </h3>
       
//        <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-tight">
//           Utilize advanced execution controls for dynamic stop-loss movement and exit synchronization.
//        </p>
       
//        <div className="grid grid-cols-2 gap-4">
//           {features.map((feat) => {
             
//              const isPremDiff = feat.key === 'premiumDifference';
//              const isDisabled = isPremDiff && legs.length < 2;

//              return (
//                  <label 
//                     key={feat.key} 
//                     className={`flex items-center gap-2 p-2 rounded border transition-all duration-200 
//                         ${isDisabled 
//                             ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-800' 
//                             : 'cursor-pointer'} 
//                         ${!isDisabled && advanceSettings[feat.key] 
//                             ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/50' 
//                             : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-gray-500'}
//                     `}
//                  >
//                     <input 
//                         type="checkbox" 
//                         className="w-3.5 h-3.5 accent-purple-600 dark:accent-purple-500 rounded cursor-pointer disabled:cursor-not-allowed" 
//                         checked={!!advanceSettings[feat.key]}
//                         onChange={() => !isDisabled && handleToggle(feat.key)}
//                         disabled={isDisabled} 
//                     />
                    
//                     <span className={`text-xs font-medium 
//                         ${advanceSettings[feat.key] 
//                             ? 'text-purple-900 dark:text-white' 
//                             : 'text-gray-600 dark:text-gray-300'
//                         }`}>
//                         {feat.label}
//                     </span>

//                     {/* Disabled Badge */}
//                     {isDisabled && (
//                         <span className="ml-auto text-[9px] text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded">
//                             Needs 2 Legs
//                         </span>
//                     )}
//                  </label>
//              );
//           })}
//        </div>
//     </div>
//   );
// };

// export default AdvanceFeaturesSection;


import React, { useEffect, useState } from 'react';
import { Layers, Info } from 'lucide-react';

const AdvanceFeaturesSection = ({ advanceSettings, setAdvanceSettings, legs }) => {
  
  // ✅ MODAL STATE
  const [popupFeature, setPopupFeature] = useState(null);
  const [tempConfig, setTempConfig] = useState({});

  const features = [
    { key: 'moveSLToCost', label: 'Move SL to Cost' },
    { key: 'exitAllOnSLTgt', label: 'Exit All on SL/Tgt' },
    { key: 'prePunchSL', label: 'Pre Punch SL' },
    { key: 'waitAndTrade', label: 'Wait & Trade' },
    { key: 'premiumDifference', label: 'Premium Difference' }, 
    { key: 'reEntryExecute', label: 'Re Entry/Execute' },
    { key: 'trailSL', label: 'Trail SL' },
  ];

  // ✅ Premium Difference Needs 2 Legs Validation
  useEffect(() => {
    if (legs && legs.length < 2 && advanceSettings?.premiumDifference) {
        setAdvanceSettings(prev => ({ ...prev, premiumDifference: false }));
    }
  }, [legs, advanceSettings, setAdvanceSettings]);

  // 🔥 THE LOGIC BRAIN: Conflict Management (Jo rules aapne bataye hain) 🔥
  const getDisabledState = (key) => {
      if (!advanceSettings) return false;
      const { moveSLToCost, exitAllOnSLTgt, trailSL, waitAndTrade, reEntryExecute } = advanceSettings;

      if (key === 'moveSLToCost') return exitAllOnSLTgt || waitAndTrade || trailSL || reEntryExecute;
      if (key === 'exitAllOnSLTgt') return moveSLToCost || reEntryExecute;
      if (key === 'prePunchSL') return moveSLToCost || trailSL;
      if (key === 'waitAndTrade') return moveSLToCost;
      if (key === 'premiumDifference') return legs && legs.length < 2;
      if (key === 'reEntryExecute') return exitAllOnSLTgt || moveSLToCost;
      if (key === 'trailSL') return moveSLToCost;

      return false;
  };

  // ✅ Checkbox Toggle & Popup Trigger
  const handleToggle = (key) => {
    if (advanceSettings && advanceSettings[key]) {
      // Off karna ho to direct off kardo
      setAdvanceSettings(prev => ({ ...prev, [key]: false }));
    } else {
      // Agar In features me se koi on ho, to pehle Popup kholo
      if (['waitAndTrade', 'premiumDifference', 'reEntryExecute', 'trailSL'].includes(key)) {
          setPopupFeature(key);
          // Default Values for Modal
          if(key === 'waitAndTrade') setTempConfig({ type: '%', movement: 0 });
          if(key === 'premiumDifference') setTempConfig({ premium: 0 });
          if(key === 'reEntryExecute') setTempConfig({ reEntryType: 'ReExecute', actionType: 'On Close', cycles: 0 });
          if(key === 'trailSL') setTempConfig({ trailType: 'Pt', x: 0, y: 0 });
      } else {
          // Direct On
          setAdvanceSettings(prev => ({ ...prev, [key]: true }));
      }
    }
  };

  // ✅ Save Popup Config to Global State
  const savePopup = () => {
      setAdvanceSettings(prev => ({
          ...prev,
          [popupFeature]: true,
          [`${popupFeature}Config`]: tempConfig // Ye config StrategyLegs padhega
      }));
      setPopupFeature(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 shadow-sm transition-colors duration-300">
       
       <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
          <Layers className="text-purple-600 dark:text-purple-500" size={18}/> Advance Features
       </h3>
       
       <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-tight">
          Utilize advanced execution controls for dynamic stop-loss movement, conditional entry/re-entry, and exit synchronization.
       </p>
       
       {/* Feature Checkboxes Grid */}
       <div className="grid grid-cols-2 gap-4">
          {features.map((feat) => {
             const isDisabled = getDisabledState(feat.key);
             return (
                 <label 
                    key={feat.key} 
                    className={`flex items-center gap-2 p-2 rounded border transition-all duration-200 
                        ${isDisabled 
                            ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-800' 
                            : 'cursor-pointer'} 
                        ${!isDisabled && advanceSettings?.[feat.key] 
                            ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/50' 
                            : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-gray-400'}
                    `}
                 >
                    <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 accent-purple-600 rounded cursor-pointer disabled:cursor-not-allowed" 
                        checked={!!advanceSettings?.[feat.key]}
                        onChange={() => !isDisabled && handleToggle(feat.key)}
                        disabled={isDisabled} 
                    />
                    
                    <span className={`text-xs font-medium 
                        ${advanceSettings?.[feat.key] 
                            ? 'text-purple-900 dark:text-white' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                        {feat.label}
                    </span>

                    {feat.key === 'premiumDifference' && isDisabled && (
                        <span className="ml-auto text-[9px] text-red-600 font-bold bg-red-100 px-1.5 py-0.5 rounded">Needs 2 Legs</span>
                    )}
                 </label>
             );
          })}
       </div>

       {/* 🔥 THE POPUP MODALS 🔥 */}
       {popupFeature && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex justify-center items-center backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl w-[400px] shadow-2xl p-6 relative">
                  
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
                      {popupFeature === 'waitAndTrade' && 'Wait & Trade'}
                      {popupFeature === 'premiumDifference' && 'Premium Difference'}
                      {popupFeature === 'reEntryExecute' && 'Re-Entry/Execute Configuration'}
                      {popupFeature === 'trailSL' && 'Trail Stop loss'}
                  </h3>

                  {/* 1. Wait & Trade Modal */}
                  {popupFeature === 'waitAndTrade' && (
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs text-gray-500 font-bold block mb-1">Type</label>
                              <select value={tempConfig.type} onChange={e => setTempConfig({...tempConfig, type: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none">
                                  <option value="%"> % ↑ </option>
                                  <option value="Pt"> Pt ↑ </option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-bold block mb-1">Movement</label>
                              <input type="number" value={tempConfig.movement} onChange={e => setTempConfig({...tempConfig, movement: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none" />
                          </div>
                      </div>
                  )}

                  {/* 2. Premium Difference Modal */}
                  {popupFeature === 'premiumDifference' && (
                      <div>
                          <label className="text-xs text-gray-500 font-bold block mb-1">Trade When Premium Difference &lt;=</label>
                          <input type="number" value={tempConfig.premium} onChange={e => setTempConfig({...tempConfig, premium: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none" />
                      </div>
                  )}

                  {/* 3. Re-Entry/Execute Modal */}
                  {popupFeature === 'reEntryExecute' && (
                      <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-lg text-xs text-blue-600 dark:text-blue-400 flex gap-2">
                              <Info size={16} className="shrink-0" />
                              Configure re-entry behavior for your strategy. Choose execution type and number of cycles based on your risk management needs.
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-bold block mb-1">Re-Entry Type</label>
                              <select value={tempConfig.reEntryType} onChange={e => setTempConfig({...tempConfig, reEntryType: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none">
                                  <option>ReExecute</option>
                                  <option>ReEntry On Cost</option>
                                  <option>ReEntry On Close</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-bold block mb-1">Action Type</label>
                              <select value={tempConfig.actionType} onChange={e => setTempConfig({...tempConfig, actionType: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none">
                                  <option>On Close</option>
                                  <option>Immediate</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-bold block mb-1">Re-Entry/Execute Cycles</label>
                              <input type="number" value={tempConfig.cycles} onChange={e => setTempConfig({...tempConfig, cycles: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none" />
                          </div>
                      </div>
                  )}

                  {/* 4. Trail SL Modal */}
                  {popupFeature === 'trailSL' && (
                      <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-lg text-xs text-blue-600 dark:text-blue-400 flex gap-2">
                              <Info size={18} className="shrink-0" />
                              A trailing stop-loss is a dynamic trading tool. It's an order that adjusts as market prices change to protect profits.
                          </div>
                          <div className="flex rounded-lg overflow-hidden border dark:border-slate-700">
                              <button onClick={() => setTempConfig({...tempConfig, trailType: '%'})} className={`flex-1 py-2 text-sm font-bold transition-colors ${tempConfig.trailType === '%' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200'}`}>%</button>
                              <button onClick={() => setTempConfig({...tempConfig, trailType: 'Pt'})} className={`flex-1 py-2 text-sm font-bold transition-colors ${tempConfig.trailType === 'Pt' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200'}`}>Pt</button>
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-bold block mb-1">If price moves (X)</label>
                              <input type="number" value={tempConfig.x} onChange={e => setTempConfig({...tempConfig, x: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none" />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-bold block mb-1">Then Trail SL by (Y)</label>
                              <input type="number" value={tempConfig.y} onChange={e => setTempConfig({...tempConfig, y: e.target.value})} className="w-full border dark:border-slate-700 rounded p-2 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none" />
                          </div>
                      </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <button onClick={() => setPopupFeature(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">Cancel</button>
                      <button onClick={savePopup} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-500/20 active:scale-95">Save</button>
                  </div>
              </div>
          </div>
       )}
    </div>
  );
};

export default AdvanceFeaturesSection;