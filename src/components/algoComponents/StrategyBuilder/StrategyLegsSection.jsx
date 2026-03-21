

// import React, { useEffect, useRef, useState } from 'react';
// import { Plus, Trash2, Minus, Copy, AlertCircle, TrendingUp, XCircle, Shield, Clock, Scale, Repeat, ChevronsUp, CandlestickChart, Edit } from 'lucide-react';
// import ComingSoonOverlay from './ComingSoonOverlay';

// // Import Data
// import { EXPIRY_TYPES, STRIKE_CRITERIA, ATM_POINT_STEPS, ATM_PERCENT_STEPS } from '../../../data/instrumentData';

// const StrategyLegsSection = ({ legs, addLeg, updateLeg, removeLeg, isComingSoon, strategyType, instruments, advanceSettings, entrySettings }) => {
  
//   const hasInstrument = instruments && instruments.length > 0;
//   const selectedInstrumentName = hasInstrument ? instruments[0].name : "NIFTY 50"; 
//   const baseLotSize = hasInstrument ? (instruments[0].lot || 1) : 1;

//   const [expandedLegId, setExpandedLegId] = useState(legs.length > 0 ? legs[0].id : null);
//   const prevLegsLength = useRef(legs.length);
//   const [showSignalCandle, setShowSignalCandle] = useState(false);

//   // Auto Expand Logic
//   useEffect(() => {
//     if (legs.length > prevLegsLength.current) {
//         if (!entrySettings?.useCombinedChart) {
//             const newLeg = legs[legs.length - 1];
//             setExpandedLegId(newLeg.id);
//         }
//     } else if (legs.length < prevLegsLength.current) {
//         if (!legs.find(l => l.id === expandedLegId) && legs.length > 0) {
//             setExpandedLegId(legs[legs.length - 1].id);
//         }
//     }
//     prevLegsLength.current = legs.length;
//   }, [legs, entrySettings]);

//   useEffect(() => {
//     if (hasInstrument && legs.length > 0) {
//       legs.forEach(leg => {
//         if (leg.quantity !== baseLotSize) {
//            updateLeg(leg.id, 'quantity', baseLotSize);
//         }
//       });
//     }
//   }, [baseLotSize]);

//   const prevCriteriaRef = useRef({});
//   useEffect(() => {
//     legs.forEach(leg => {
//         const currentCriteria = leg.strikeCriteria || "ATM pt";
//         const prevCriteria = prevCriteriaRef.current[leg.id];
//         if (prevCriteria === undefined) { prevCriteriaRef.current[leg.id] = currentCriteria; return; }
//         if (prevCriteria !== currentCriteria) {
//             let newInitialValue = "ATM";
//             if (currentCriteria === 'Delta') newInitialValue = 0.5;
//             else if (currentCriteria === 'CP') newInitialValue = ""; 
//             else if (currentCriteria.includes('CP')) newInitialValue = 0; 
//             updateLeg(leg.id, 'strikeType', newInitialValue);
//             prevCriteriaRef.current[leg.id] = currentCriteria;
//         }
//     });
//   }, [legs]); 

//   const getLegSummary = (leg) => {
//     let typeLabel = "";
//     if (strategyType === 'Indicator Based') {
//         typeLabel = leg.longCondition || 'CE';
//     } else {
//         typeLabel = leg.optionType === 'Call' ? 'CE' : 'PE';
//     }
//     const actionText = `${leg.action} ${typeLabel}`;
//     const expiryText = leg.expiry || "WEEKLY";
//     let strikeText = "";
//     const sType = leg.strikeType !== undefined && leg.strikeType !== null ? leg.strikeType : "ATM";
//     const sCriteria = leg.strikeCriteria || "ATM pt";
//     if (sType === 'ATM') { strikeText = "Strike ATM"; } 
//     else if (sCriteria === 'ATM pt' && typeof sType === 'string') {
//         if (sType.includes('ITM')) strikeText = `Strike ATM -${sType.replace('ITM ', '')} pts`;
//         else if (sType.includes('OTM')) strikeText = `Strike ATM +${sType.replace('OTM ', '')} pts`;
//         else strikeText = `Strike ${sCriteria} ${sType}`;
//     }
//     else if (sCriteria === 'ATM %' && typeof sType === 'string') {
//         const val = sType.replace('ITM ', '').replace('OTM ', '');
//         if (sType.includes('ITM')) strikeText = `Strike ATM -${val}`;
//         else if (sType.includes('OTM')) strikeText = `Strike ATM +${val}`;
//         else strikeText = `Strike ${sCriteria} ${sType}`;
//     }
//     else { strikeText = `Strike ${sCriteria} ${sType === "" ? "?" : sType}`; }
//     const currentSLType = leg.slType || 'SL%'; 
//     const currentTPType = leg.tpType || 'TP%';
//     const slLabel = currentSLType === 'SL%' ? '%' : ' Pts';
//     const tpLabel = currentTPType === 'TP%' ? '%' : ' Pts';
//     const slText = `SL ${leg.slValue}${slLabel}`;
//     const tpText = `TP ${leg.tpValue}${tpLabel}`;
//     return `${actionText}  ●  ${expiryText}  ●  ${selectedInstrumentName}  ●  Qty ${leg.quantity}  ●  ${strikeText}  ●  ${tpText}  ●  ${slText}`;
//   };

//   const handleIncrement = (legId, currentQty) => updateLeg(legId, 'quantity', (currentQty || 0) + baseLotSize);
//   const handleDecrement = (legId, currentQty) => updateLeg(legId, 'quantity', Math.max(0, (currentQty || 0) - baseLotSize));
//   const handleValueChange = (legId, field, currentValue, change, criteria) => {
//     let base = currentValue; if (base === "" || base === null || base === undefined) base = 0;
//     const safeValue = parseFloat(base); const newValue = safeValue + change;
//     if ((criteria === "CP >=" || criteria === "CP <=") && newValue < 0) { updateLeg(legId, field, 0); return; }
//     updateLeg(legId, field, parseFloat(newValue.toFixed(2)));
//   };

//   const renderStrikeTypeInput = (leg) => {
//     const criteria = leg.strikeCriteria || "ATM pt";
//     const generateStrikePoints = () => { const step = ATM_POINT_STEPS[selectedInstrumentName] || 50; const maxRange = 2000; let options = []; for (let i = maxRange; i >= step; i -= step) options.push(`ITM ${i}`); options.push("ATM"); for (let i = step; i <= maxRange; i += step) options.push(`OTM ${i}`); return options; };
//     const generateStrikePercents = () => { const step = ATM_PERCENT_STEPS[selectedInstrumentName] || 1.0; const maxRange = 20.0; let options = []; for (let i = maxRange; i >= step; i -= step) options.push(`ITM ${i.toFixed(1)}%`); options.push("ATM"); for (let i = step; i <= maxRange; i += step) options.push(`OTM ${i.toFixed(1)}%`); return options; };

//     // ✅ INPUT STYLES: Light (White + Gray Border) | Dark (Slate-800 + Slate-600 Border)
//     const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none custom-scrollbar focus:border-blue-500 transition-colors";

//     if (criteria === "ATM pt" || criteria === "ATM %") { const options = criteria === "ATM pt" ? generateStrikePoints() : generateStrikePercents(); return (<select className={inputClass} value={leg.strikeType || "ATM"} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)}>{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>); }
//     if (criteria === "Delta") { return (<input type="number" step="0.1" min="0" max="1" placeholder="0.5" value={typeof leg.strikeType === 'number' ? leg.strikeType : ''} onChange={(e) => { let val = e.target.value; if (val === "") { updateLeg(leg.id, 'strikeType', ""); return; } let numVal = parseFloat(val); if (numVal > 1) numVal = 1; if (numVal < 0) numVal = 0; updateLeg(leg.id, 'strikeType', numVal); }} className={inputClass} />); }
//     if (criteria === "CP") { return (<div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden transition-colors"><button onClick={() => handleValueChange(leg.id, 'strikeType', leg.strikeType, -1, criteria)} className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-slate-600"><Minus size={12}/></button><input type="number" placeholder="Value" value={leg.strikeType} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className="w-full text-center bg-transparent text-xs text-gray-900 dark:text-gray-300 outline-none appearance-none placeholder-gray-400" /><button onClick={() => handleValueChange(leg.id, 'strikeType', leg.strikeType, 1, criteria)} className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-slate-600"><Plus size={12}/></button></div>); }
//     if (criteria === "CP >=" || criteria === "CP <=") { return (<div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden transition-colors"><button onClick={() => handleValueChange(leg.id, 'strikeType', leg.strikeType, -1, criteria)} className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-slate-600"><Minus size={12}/></button><input type="number" placeholder="Value" value={leg.strikeType} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className="w-full text-center bg-transparent text-xs text-gray-900 dark:text-gray-300 outline-none appearance-none" /><button onClick={() => handleValueChange(leg.id, 'strikeType', leg.strikeType, 1, criteria)} className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-slate-600"><Plus size={12}/></button></div>); }
//   };

//   const isAnyAdvanceFeatureActive = advanceSettings && Object.values(advanceSettings).some(val => val === true);

//   return (
//     // ✅ Main Container: Light (White) | Dark (Slate-800)
//     <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative h-full min-h-[600px] flex flex-col shadow-sm dark:shadow-none transition-colors duration-300">
      
//       {isComingSoon && <ComingSoonOverlay />}
      
//       {!isComingSoon && !hasInstrument && (
//         <div className="absolute inset-0 z-40 bg-gray-50/80 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700/50 text-center animate-in fade-in duration-300">
//             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-600 shadow-xl flex flex-col items-center gap-3 max-w-xs transition-colors">
//                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400"><AlertCircle size={28} /></div>
//                 <div className="mt-3"><h4 className="text-gray-900 dark:text-white font-bold text-lg">Select Instrument</h4><p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">Please add an instrument.</p></div>
//             </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-5">
//         <h3 className="font-bold text-lg text-gray-800 dark:text-white">Strategy Legs</h3>
//         <button onClick={() => addLeg()} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/20 transition-all"><Plus size={14} /> Add Leg</button>
//       </div>

//       <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
//         {legs.map((leg, index) => {
//           const isExpanded = legs.length === 1 || leg.id === expandedLegId;
//           const isDeleteDisabled = legs.length <= 1;

//           let displayTypeLabel = "";
//           if (strategyType === 'Indicator Based') {
//              displayTypeLabel = leg.longCondition || 'CE';
//           } else {
//              displayTypeLabel = leg.optionType === 'Call' ? 'CE' : 'PE';
//           }

//           return (
//             // ✅ Leg Card: Light (Gray-50) | Dark (Slate-900)
//             <div key={leg.id} className={`rounded-lg relative group transition-all border shadow-sm 
//                 ${isExpanded 
//                     ? 'bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700' 
//                     : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
//                 }`}>
              
//               <div className={`flex justify-between items-center p-3 ${isExpanded ? 'border-b border-gray-300 dark:border-slate-700' : ''}`}>
//                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedLegId(leg.id)}>
//                     <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
//                        Leg {index + 1} 
//                        <span className={`text-xs font-bold px-1.5 rounded ${leg.action === 'BUY' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20' : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20'}`}>
//                            {leg.action} {displayTypeLabel}
//                        </span>
//                     </h4>
//                     <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{getLegSummary(leg)}</p>
//                  </div>
//                  <div className="flex items-center gap-2 ml-3">
//                     {!isExpanded && (<button onClick={() => setExpandedLegId(leg.id)} className="bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded text-[10px] font-bold border border-gray-300 dark:border-slate-700 transition-colors flex items-center gap-1"><Edit size={12} /> Edit</button>)}
//                     {isExpanded && (<span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-500/20 hidden sm:inline-block">ACTIVE</span>)}
                    
//                     <button 
//                         disabled={isDeleteDisabled}
//                         className={`p-1.5 rounded border border-transparent transition-colors 
//                             ${isDeleteDisabled 
//                                 ? 'text-gray-400 dark:text-gray-700 cursor-not-allowed opacity-50' 
//                                 : 'bg-gray-100 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/30'
//                             }`} 
//                         onClick={(e) => { 
//                             e.stopPropagation(); 
//                             if (!isDeleteDisabled) removeLeg(leg.id); 
//                         }} 
//                         title={isDeleteDisabled ? "Cannot remove the only leg" : "Remove Leg"}
//                     >
//                         <Trash2 size={14}/>
//                     </button>
//                  </div>
//               </div>

//               {isExpanded && (
//                         <>
//                             <div className="p-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
                                
//                                 {strategyType === 'Indicator Based' && (
//                                     <div className={`grid ${entrySettings?.useCombinedChart || entrySettings?.useOptionsChart ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                                            
//                                             {/* Long Condition */}
//                                             <div>
//                                                 <label className="text-[11px] text-green-600 dark:text-green-500 font-bold block mb-1.5">When Long Condition</label>
//                                                 <select 
//                                                     className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none focus:border-green-500 transition-colors" 
//                                                     value={leg.longCondition || 'CE'} 
//                                                     onChange={(e) => { 
//                                                         const val = e.target.value; 
//                                                         updateLeg(leg.id, 'longCondition', val); 
//                                                         updateLeg(leg.id, 'shortCondition', val === 'CE' ? 'PE' : 'CE'); 
//                                                     }}
//                                                 >
//                                                     <option value="CE">CE</option>
//                                                     <option value="PE">PE</option>
//                                                 </select>
//                                             </div>

//                                             {/* Short Condition */}
//                                             {!entrySettings?.useCombinedChart && !entrySettings?.useOptionsChart && (
//                                                 <div>
//                                                     <label className="text-[11px] text-red-600 dark:text-red-500 font-bold block mb-1.5">When Short Condition</label>
//                                                     <select 
//                                                         className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none focus:border-red-500 transition-colors" 
//                                                         value={leg.shortCondition || 'PE'} 
//                                                         onChange={(e) => { 
//                                                             const val = e.target.value; 
//                                                             updateLeg(leg.id, 'shortCondition', val); 
//                                                             updateLeg(leg.id, 'longCondition', val === 'CE' ? 'PE' : 'CE'); 
//                                                         }}
//                                                     >
//                                                         <option value="PE">PE</option>
//                                                         <option value="CE">CE</option>
//                                                     </select>
//                                                 </div>
//                                             )}
//                                     </div>
//                                 )}

//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                     {/* Quantity */}
//                                     <div>
//                                         <label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Qty</label>
//                                         <div className="flex items-center">
//                                             <button onClick={() => handleDecrement(leg.id, leg.quantity)} className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-l border border-gray-300 dark:border-slate-600 font-bold transition-colors"><Minus size={14}/></button>
//                                             <input type="number" value={leg.quantity} readOnly className="w-full text-center bg-white dark:bg-slate-800 border-y border-gray-300 dark:border-slate-600 py-1.5 text-sm text-gray-900 dark:text-slate-100 font-bold outline-none transition-colors" />
//                                             <button onClick={() => handleIncrement(leg.id, leg.quantity)} className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-r border border-gray-300 dark:border-slate-600 font-bold transition-colors"><Plus size={14}/></button>
//                                         </div>
//                                         <p className="text-[9px] text-gray-400 dark:text-gray-400 mt-1">Multiples of lot ({baseLotSize})</p>
//                                     </div>
                                    
//                                     {/* Position (Buy/Sell) */}
//                                     <div>
//                                         <label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Position</label>
//                                         <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-slate-600">
//                                             <button onClick={() => updateLeg(leg.id, 'action', 'BUY')} className={`flex-1 py-1.5 text-xs font-bold transition-colors ${leg.action === 'BUY' ? 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-500' : 'bg-gray-50 dark:bg-slate-800 text-gray-500'}`}>BUY</button>
//                                             <button onClick={() => updateLeg(leg.id, 'action', 'SELL')} className={`flex-1 py-1.5 text-xs font-bold transition-colors ${leg.action === 'SELL' ? 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-500' : 'bg-gray-50 dark:bg-slate-800 text-gray-500'}`}>SELL</button>
//                                         </div>
//                                     </div>

//                                     {/* Option Type (Call/Put) - Only for Non-Indicator based or when needed */}
//                                     {strategyType !== 'Indicator Based' && (
//                                         <div>
//                                             <label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Option Type</label>
//                                             <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-slate-600">
//                                                 <button onClick={() => updateLeg(leg.id, 'optionType', 'Call')} className={`flex-1 py-1.5 text-xs font-bold transition-colors ${leg.optionType === 'Call' ? 'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-500' : 'bg-gray-50 dark:bg-slate-800 text-gray-500'}`}>Call</button>
//                                                 <button onClick={() => updateLeg(leg.id, 'optionType', 'Put')} className={`flex-1 py-1.5 text-xs font-bold transition-colors ${leg.optionType === 'Put' ? 'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-500' : 'bg-gray-50 dark:bg-slate-800 text-gray-500'}`}>Put</button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="grid grid-cols-3 gap-4">
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Expiry</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" value={leg.expiry || 'WEEKLY'} onChange={(e) => updateLeg(leg.id, 'expiry', e.target.value)}>{EXPIRY_TYPES.map(exp => <option key={exp} value={exp}>{exp}</option>)}</select></div>
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Strike Criteria</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" value={leg.strikeCriteria || "ATM pt"} onChange={(e) => { const newCriteria = e.target.value; let newInitialValue = "ATM"; if (newCriteria === 'Delta') newInitialValue = 0.5; if (newCriteria === 'CP') newInitialValue = ""; if (newCriteria.includes('CP')) newInitialValue = 0; updateLeg(leg.id, 'strikeCriteria', newCriteria); updateLeg(leg.id, 'strikeType', newInitialValue); }}>{STRIKE_CRITERIA.map(cri => <option key={cri}>{cri}</option>)}</select></div>
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Strike Type</label>{renderStrikeTypeInput(leg)}</div>
//                                 </div>

//                                 <div className="grid grid-cols-3 gap-4">
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">SL Type</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" value={leg.slType || 'SL%'} onChange={(e) => updateLeg(leg.id, 'slType', e.target.value)}><option value="SL%">SL%</option><option value="Points">Points</option></select></div>
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">SL</label><input type="number" value={leg.slValue} onChange={(e) => updateLeg(leg.id, 'slValue', e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" /></div>
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">On Price</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors"><option>On Price</option><option>On Trigger</option></select></div>
//                                 </div>

//                                 <div className="grid grid-cols-3 gap-4">
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">TP Type</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" value={leg.tpType || 'TP%'} onChange={(e) => updateLeg(leg.id, 'tpType', e.target.value)}><option value="TP%">TP%</option><option value="Points">Points</option></select></div>
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">TP</label><input type="number" value={leg.tpValue} onChange={(e) => updateLeg(leg.id, 'tpValue', e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" /></div>
//                                     <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">On Price</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors"><option>On Price</option><option>On Trigger</option></select></div>
//                                 </div>

//                                 {strategyType !== 'Time Based' && (
//                                     <div className="grid grid-cols-3 gap-4">
//                                         <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Trail SL Type</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors"><option>%</option><option>Points</option></select></div>
//                                         <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Price Movement</label><input type="number" value={leg.priceMovement} onChange={(e) => updateLeg(leg.id, 'priceMovement', e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" /></div>
//                                         <div><label className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block mb-1.5">Trailing Value</label><input type="number" value={leg.trailValue} onChange={(e) => updateLeg(leg.id, 'trailValue', e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-gray-300 outline-none transition-colors" /></div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Footer: Pre Punch & Clone */}
//                             <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-b-lg border-t border-gray-200 dark:border-gray-500 transition-colors">
//                                 {strategyType !== 'Time Based' && (
//                                     <label className="flex items-center gap-2 cursor-pointer">
//                                         <input type="checkbox" className="accent-blue-600 w-3.5 h-3.5"/>
//                                         <span className="text-[10px] text-gray-500 dark:text-gray-500 font-bold">Pre Punch SL</span>
//                                     </label>
//                                 )}
//                                 <div className="flex items-center gap-3 text-gray-400 dark:text-gray-400 ml-auto">
//                                     <button className="hover:text-blue-500 transition-colors" title="Duplicate Leg" onClick={() => addLeg(leg)}>
//                                         <Copy size={16} className="text-yellow-500 dark:text-yellow-400"/>
//                                     </button>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//             </div>
//           );
//         })}
//       </div>

//       {strategyType === 'Indicator Based' && (
//         <div className="mt-4 p-4 border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-slate-900/50 rounded-lg animate-in fade-in transition-colors">
//             <div className="flex items-center justify-between mb-3">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                     <input type="checkbox" className="w-3.5 h-3.5 accent-blue-500 rounded" checked={showSignalCandle} onChange={(e) => setShowSignalCandle(e.target.checked)}/>
//                     <div className="flex items-center gap-2"><CandlestickChart size={16} className="text-blue-500 dark:text-blue-400" /><span className="text-sm font-bold text-gray-800 dark:text-gray-200">Add Signal Candle Condition (Optional)</span></div>
//                 </label>
//             </div>
//             {showSignalCandle && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pl-6 border-l-2 border-blue-500/20">
//                     <div className="col-span-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-3 h-3 accent-blue-500" /><span className="text-[11px] text-gray-500 dark:text-gray-400">Trade on Trigger Candle</span></label></div>
//                     <div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Buy When</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none"><option>High Break</option><option>Close &gt; High</option></select></div>
//                     <div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Short When</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none"><option>Low Break</option><option>Close &lt; Low</option></select></div>
//                     <div className="col-span-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-3 h-3 accent-blue-500" /><span className="text-[11px] text-gray-500 dark:text-gray-400">Of Continuous Candle</span></label></div>
//                 </div>
//             )}
//         </div>
//       )}

//       {isAnyAdvanceFeatureActive && (
//         <div className="flex items-center justify-center my-4 opacity-50">
//             <div className="h-px bg-gray-300 dark:bg-gray-600 w-1/4"></div>
//             <span className="text-[12px] text-gray-500 dark:text-gray-100 px-3 uppercase tracking-widest">--- Advance Features ---</span>
//             <div className="h-px bg-gray-300 dark:bg-gray-600 w-1/4"></div>
//         </div>
//       )}

//       <div className="flex flex-col gap-2">
//           {/* Card Style Helper */}
//           {/* Replaced fixed colors with theme classes */}
//           {advanceSettings && advanceSettings.moveSLToCost && (<div className="animate-in slide-in-from-bottom-2 fade-in"><div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-lg p-3 shadow-md dark:shadow-lg shadow-purple-100 dark:shadow-purple-500/5"><div className="flex items-center gap-2 mb-3"><TrendingUp size={16} className="text-purple-500 dark:text-purple-400" /><h4 className="text-sm font-bold text-purple-700 dark:text-purple-100">Move SL to Cost Configuration</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Activate when Profit Reaches</label><div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden"><input type="number" placeholder="500" className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none" min="0"/><select className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1.5 border-l border-gray-300 dark:border-slate-600 outline-none"><option>Points</option><option>Amount ₹</option></select></div></div><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Buffer (Optional)</label><div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden"><input type="number" placeholder="0" className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none" min="0"/><span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1.5 border-l border-gray-300 dark:border-slate-600">Pts</span></div></div></div></div></div>)}
//           {/* ... Add similar theme classes to other Advance Cards ... */}
//           {advanceSettings && advanceSettings.exitAllOnSLTgt && (<div className="animate-in slide-in-from-bottom-2 fade-in"><div className="bg-white dark:bg-slate-900/80 border border-red-200 dark:border-red-500/30 rounded-lg p-3 shadow-md dark:shadow-lg shadow-red-100 dark:shadow-red-500/5"><div className="flex items-center gap-2 mb-3"><XCircle size={16} className="text-red-500 dark:text-red-400" /><h4 className="text-sm font-bold text-red-700 dark:text-red-100">Exit All on SL/Tgt Configuration</h4></div><div className="grid grid-cols-1 gap-4"><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Trigger Condition</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none"><option>Exit All if ANY Leg hits SL or Tgt (Both)</option><option>Exit All if ANY Leg hits SL Only</option><option>Exit All if ANY Leg hits Target Only</option></select></div></div></div></div>)}
//           {advanceSettings && advanceSettings.prePunchSL && (<div className="animate-in slide-in-from-bottom-2 fade-in"><div className="bg-white dark:bg-slate-900/80 border border-cyan-200 dark:border-cyan-500/30 rounded-lg p-3 shadow-md dark:shadow-lg shadow-cyan-100 dark:shadow-cyan-500/5"><div className="flex items-center gap-2 mb-3"><Shield size={16} className="text-cyan-500 dark:text-cyan-400" /><h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-100">Pre Punch SL Configuration</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">SL Order Type</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none"><option>SL-M (Market Order)</option><option>SL-L (Limit Order)</option></select></div><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Buffer (For Limit Order)</label><div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden"><input type="number" placeholder="0" className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none" min="0"/><span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1.5 border-l border-gray-300 dark:border-slate-600">Pts</span></div></div></div></div></div>)}
//           {advanceSettings && advanceSettings.waitAndTrade && (<div className="animate-in slide-in-from-bottom-2 fade-in"><div className="bg-white dark:bg-slate-900/80 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 shadow-md dark:shadow-lg shadow-amber-100 dark:shadow-amber-500/5"><div className="flex items-center gap-2 mb-3"><Clock size={16} className="text-amber-500 dark:text-amber-400" /><h4 className="text-sm font-bold text-amber-700 dark:text-amber-100">Wait & Trade Configuration</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Reference Candle</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none"><option>First Candle (Market Open)</option><option>Strategy Start Candle</option></select></div><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Breakout Condition</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none"><option>High Break (Buy) / Low Break (Sell)</option><option>High Break Only</option><option>Low Break Only</option></select></div></div></div></div>)}
//           {advanceSettings && advanceSettings.premiumDifference && (<div className="animate-in slide-in-from-bottom-2 fade-in"><div className="bg-white dark:bg-slate-900/80 border border-teal-200 dark:border-teal-500/30 rounded-lg p-3 shadow-md dark:shadow-lg shadow-teal-100 dark:shadow-teal-500/5"><div className="flex items-center gap-2 mb-3"><Scale size={16} className="text-teal-500 dark:text-teal-400" /><h4 className="text-sm font-bold text-teal-700 dark:text-teal-100">Premium Difference Configuration</h4></div><div className="grid grid-cols-1 gap-4"><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Max Allowed Difference</label><div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden"><input type="number" placeholder="20" className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none" min="0"/><span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1.5 border-l border-gray-300 dark:border-slate-600">Points</span></div><p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">Strategy will only execute if difference between leg premiums is less than this value.</p></div></div></div></div>)}
//           {advanceSettings && advanceSettings.reEntryExecute && (<div className="animate-in slide-in-from-bottom-2 fade-in"><div className="bg-white dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-500/30 rounded-lg p-3 shadow-md dark:shadow-lg shadow-indigo-100 dark:shadow-indigo-500/5"><div className="flex items-center gap-2 mb-3"><Repeat size={16} className="text-indigo-500 dark:text-indigo-400" /><h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-100">Re-Entry / Execute Configuration</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Re-Enter On</label><select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none"><option>Target Hit</option><option>Stop Loss Hit</option><option>Both (SL or Tgt)</option><option>Cost-to-Cost Exit</option></select></div><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Max Re-Entries (Times)</label><div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden"><input type="number" placeholder="1" min="1" className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none" onInput={(e) => { if(e.target.value < 0) e.target.value = 0; }}/></div></div></div></div></div>)}
//           {advanceSettings && advanceSettings.trailSL && (<div className="animate-in slide-in-from-bottom-2 fade-in"><div className="bg-white dark:bg-slate-900/80 border border-pink-200 dark:border-pink-500/30 rounded-lg p-3 shadow-md dark:shadow-lg shadow-pink-100 dark:shadow-pink-500/5"><div className="flex items-center gap-2 mb-3"><ChevronsUp size={16} className="text-pink-500 dark:text-pink-400" /><h4 className="text-sm font-bold text-pink-700 dark:text-pink-100">Trail SL Configuration</h4></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">When Profit Moves By</label><div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden"><input type="number" min="0" placeholder="20" className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none" onInput={(e) => { if(e.target.value < 0) e.target.value = 0; }}/><select className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1.5 border-l border-gray-300 dark:border-slate-600 outline-none"><option>Points</option><option>Amount ₹</option></select></div></div><div><label className="text-[11px] text-gray-500 dark:text-gray-400 font-bold block mb-1.5">Move SL By</label><div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded overflow-hidden"><input type="number" min="0" placeholder="10" className="w-full bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none" onInput={(e) => { if(e.target.value < 0) e.target.value = 0; }}/><span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-1.5 border-l border-gray-300 dark:border-slate-600">Pts</span></div></div></div></div></div>)}
//       </div> 
//     </div>
//   );
// };

// export default StrategyLegsSection;


import React, { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Minus, Copy, AlertCircle, CandlestickChart, Edit } from 'lucide-react';
import ComingSoonOverlay from './ComingSoonOverlay';
import { EXPIRY_TYPES, STRIKE_CRITERIA, ATM_POINT_STEPS, ATM_PERCENT_STEPS } from '../../../data/instrumentData';

const StrategyLegsSection = ({ legs, addLeg, updateLeg, removeLeg, isComingSoon, strategyType, instruments, advanceSettings, entrySettings }) => {
  
  // ... (Apka purana pura logic as-it-is rahega) ...
  const hasInstrument = instruments && instruments.length > 0;
  const selectedInstrumentName = hasInstrument ? instruments[0].name : "NIFTY 50"; 
  const baseLotSize = hasInstrument ? (instruments[0].lot || 1) : 1;

  const [expandedLegId, setExpandedLegId] = useState(legs.length > 0 ? legs[0].id : null);
  const prevLegsLength = useRef(legs.length);
  const [showSignalCandle, setShowSignalCandle] = useState(false);

  useEffect(() => {
    if (legs.length > prevLegsLength.current) {
        if (!entrySettings?.useCombinedChart) setExpandedLegId(legs[legs.length - 1].id);
    } else if (legs.length < prevLegsLength.current) {
        if (!legs.find(l => l.id === expandedLegId) && legs.length > 0) setExpandedLegId(legs[legs.length - 1].id);
    }
    prevLegsLength.current = legs.length;
  }, [legs, entrySettings, expandedLegId]);

  useEffect(() => {
    if (hasInstrument && legs.length > 0) legs.forEach(leg => { if (leg.quantity !== baseLotSize) updateLeg(leg.id, 'quantity', baseLotSize); });
  }, [baseLotSize]);

  const prevCriteriaRef = useRef({});
  useEffect(() => {
    legs.forEach(leg => {
        const currentCriteria = leg.strikeCriteria || "ATM pt";
        const prevCriteria = prevCriteriaRef.current[leg.id];
        if (prevCriteria === undefined) { prevCriteriaRef.current[leg.id] = currentCriteria; return; }
        if (prevCriteria !== currentCriteria) {
            let newInitialValue = "ATM";
            if (currentCriteria === 'Delta') newInitialValue = 0.5;
            else if (currentCriteria === 'CP') newInitialValue = ""; 
            else if (currentCriteria.includes('CP')) newInitialValue = 0; 
            updateLeg(leg.id, 'strikeType', newInitialValue);
            prevCriteriaRef.current[leg.id] = currentCriteria;
        }
    });
  }, [legs]); 

  const getLegSummary = (leg) => {
    let typeLabel = strategyType === 'Indicator Based' ? (leg.longCondition || 'CE') : (leg.optionType === 'Call' ? 'CE' : 'PE');
    const sType = leg.strikeType !== undefined && leg.strikeType !== null ? leg.strikeType : "ATM";
    const sCriteria = leg.strikeCriteria || "ATM pt";
    let strikeText = `Strike ${sCriteria} ${sType}`;
    if (sType === 'ATM') strikeText = "Strike ATM"; 
    return `${leg.action} ${typeLabel}  ●  Qty ${leg.quantity}  ●  ${strikeText}  ●  TP ${leg.tpValue}  ●  SL ${leg.slValue}`;
  };

  const handleIncrement = (legId, currentQty) => updateLeg(legId, 'quantity', (currentQty || 0) + baseLotSize);
  const handleDecrement = (legId, currentQty) => updateLeg(legId, 'quantity', Math.max(0, (currentQty || 0) - baseLotSize));
  const handleValueChange = (legId, field, currentValue, change, criteria) => {
    const newValue = (parseFloat(currentValue) || 0) + change;
    if ((criteria === "CP >=" || criteria === "CP <=") && newValue < 0) { updateLeg(legId, field, 0); return; }
    updateLeg(legId, field, parseFloat(newValue.toFixed(2)));
  };

  const inputClass = "w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 transition-colors";

  const renderStrikeTypeInput = (leg) => {
    const criteria = leg.strikeCriteria || "ATM pt";
    if (criteria === "ATM pt" || criteria === "ATM %") { 
        const options = criteria === "ATM pt" ? ["ITM 100", "ATM", "OTM 100"] : ["ITM 5%", "ATM", "OTM 5%"]; 
        return <select className={inputClass} value={leg.strikeType || "ATM"} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select>; 
    }
    if (criteria === "Delta") { return <input type="number" step="0.1" min="0" max="1" value={leg.strikeType || ''} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className={inputClass} />; }
    return (
        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button onClick={() => handleValueChange(leg.id, 'strikeType', leg.strikeType, -1, criteria)} className="px-2 py-1.5 bg-gray-100"><Minus size={12}/></button>
            <input type="number" value={leg.strikeType} onChange={(e) => updateLeg(leg.id, 'strikeType', e.target.value)} className="w-full text-center text-xs outline-none" />
            <button onClick={() => handleValueChange(leg.id, 'strikeType', leg.strikeType, 1, criteria)} className="px-2 py-1.5 bg-gray-100"><Plus size={12}/></button>
        </div>
    );
  };

  const hasInlineAdvanceFeatures = advanceSettings?.waitAndTrade || advanceSettings?.premiumDifference || advanceSettings?.reEntryExecute || advanceSettings?.trailSL;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 relative h-full min-h-[600px] flex flex-col shadow-sm">
      
      {isComingSoon && <ComingSoonOverlay />}
      
      {/* 🟢 THE MAGIC FIX: Move SL to Cost ON hai to '+ Add Leg' chhup jayega */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-lg text-gray-800">Strategy Legs</h3>
        {(!advanceSettings?.moveSLToCost) && (
            <button onClick={() => addLeg()} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all">
                <Plus size={14} /> Add Leg
            </button>
        )}
      </div>

      {/* 🟢 LEGS LOOP */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
        {legs.map((leg, index) => {
          const isExpanded = legs.length === 1 || leg.id === expandedLegId;
          const isDeleteDisabled = legs.length <= 1;

          return (
            <div key={leg.id} className={`rounded-lg relative group transition-all border shadow-sm ${isExpanded ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'}`}>
              
              <div className={`flex justify-between items-center p-3 ${isExpanded ? 'border-b border-gray-300' : ''}`}>
                 <div className="flex-1 cursor-pointer" onClick={() => setExpandedLegId(leg.id)}>
                    <h4 className="font-bold text-sm flex items-center gap-2">Leg {index + 1} 
                       <span className={`text-xs font-bold px-1.5 rounded ${leg.action === 'BUY' ? 'text-blue-600 bg-blue-100' : 'text-red-600 bg-red-100'}`}>{leg.action}</span>
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{getLegSummary(leg)}</p>
                 </div>
                 <div className="flex items-center gap-2 ml-3">
                    {!isExpanded && <button onClick={() => setExpandedLegId(leg.id)} className="text-blue-600 border border-gray-300 px-3 py-1.5 rounded text-[10px] font-bold"><Edit size={12}/> Edit</button>}
                    <button disabled={isDeleteDisabled} onClick={(e) => { e.stopPropagation(); if(!isDeleteDisabled) removeLeg(leg.id); }} className={`p-1.5 rounded ${isDeleteDisabled ? 'opacity-50' : 'hover:bg-red-50 hover:text-red-600 text-gray-500'}`}><Trash2 size={14}/></button>
                 </div>
              </div>

              {isExpanded && (
                  <div className="p-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
                      {/* QTY, POSITION, OPTION TYPE */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                              <label className="text-[11px] text-gray-500 font-bold block mb-1.5">Qty</label>
                              <div className="flex items-center"><button onClick={() => handleDecrement(leg.id, leg.quantity)} className="bg-gray-100 px-3 py-1.5 border font-bold"><Minus size={14}/></button><input type="number" value={leg.quantity} readOnly className="w-full text-center border-y py-1.5 text-sm font-bold" /><button onClick={() => handleIncrement(leg.id, leg.quantity)} className="bg-gray-100 px-3 py-1.5 border font-bold"><Plus size={14}/></button></div>
                          </div>
                          <div>
                              <label className="text-[11px] text-gray-500 font-bold block mb-1.5">Position</label>
                              <div className="flex rounded-md overflow-hidden border"><button onClick={() => updateLeg(leg.id, 'action', 'BUY')} className={`flex-1 py-1.5 text-xs font-bold ${leg.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-500'}`}>BUY</button><button onClick={() => updateLeg(leg.id, 'action', 'SELL')} className={`flex-1 py-1.5 text-xs font-bold ${leg.action === 'SELL' ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-500'}`}>SELL</button></div>
                          </div>
                          {strategyType !== 'Indicator Based' && (
                              <div>
                                  <label className="text-[11px] text-gray-500 font-bold block mb-1.5">Option Type</label>
                                  <div className="flex rounded-md overflow-hidden border"><button onClick={() => updateLeg(leg.id, 'optionType', 'Call')} className={`flex-1 py-1.5 text-xs font-bold ${leg.optionType === 'Call' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>Call</button><button onClick={() => updateLeg(leg.id, 'optionType', 'Put')} className={`flex-1 py-1.5 text-xs font-bold ${leg.optionType === 'Put' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>Put</button></div>
                              </div>
                          )}
                      </div>

                      {/* STRIKE DETAILS */}
                      <div className="grid grid-cols-3 gap-4">
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">Expiry</label><select className={inputClass} value={leg.expiry} onChange={(e) => updateLeg(leg.id, 'expiry', e.target.value)}>{EXPIRY_TYPES.map(exp => <option key={exp}>{exp}</option>)}</select></div>
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">Strike Criteria</label><select className={inputClass} value={leg.strikeCriteria} onChange={(e) => { updateLeg(leg.id, 'strikeCriteria', e.target.value); updateLeg(leg.id, 'strikeType', 'ATM'); }}>{STRIKE_CRITERIA.map(cri => <option key={cri}>{cri}</option>)}</select></div>
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">Strike Type</label>{renderStrikeTypeInput(leg)}</div>
                      </div>

                      {/* SL & TP DETAILS */}
                      <div className="grid grid-cols-3 gap-4">
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">SL Type</label><select className={inputClass} value={leg.slType || 'SL%'} onChange={(e) => updateLeg(leg.id, 'slType', e.target.value)}><option value="SL%">SL%</option><option value="Points">Points</option></select></div>
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">SL</label><input type="number" value={leg.slValue || 0} onChange={(e) => updateLeg(leg.id, 'slValue', e.target.value)} className={inputClass} /></div>
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">On Price</label><select className={inputClass}><option>On Close</option><option>On Trigger</option></select></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">TP Type</label><select className={inputClass} value={leg.tpType || 'TP%'} onChange={(e) => updateLeg(leg.id, 'tpType', e.target.value)}><option value="TP%">TP%</option><option value="Points">Points</option></select></div>
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">TP</label><input type="number" value={leg.tpValue || 0} onChange={(e) => updateLeg(leg.id, 'tpValue', e.target.value)} className={inputClass} /></div>
                          <div><label className="text-[11px] text-gray-500 font-bold block mb-1.5">On Price</label><select className={inputClass}><option>On Close</option><option>On Trigger</option></select></div>
                      </div>

                      {/* 🔥 ADVANCE FEATURES INLINE INJECTION 🔥 */}
                      {hasInlineAdvanceFeatures && (
                          <div className="mt-6 mb-2">
                              <div className="flex items-center justify-center opacity-60">
                                  <div className="h-px bg-gray-300 w-full"></div>
                                  <span className="text-[10px] text-gray-500 px-3 uppercase font-bold whitespace-nowrap">--- Advance Features ---</span>
                                  <div className="h-px bg-gray-300 w-full"></div>
                              </div>
                          </div>
                      )}

                      {advanceSettings?.waitAndTrade && (
                          <div className="grid grid-cols-2 gap-4 mt-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                              <div><label className="text-[11px] text-amber-700 font-bold block mb-1.5">Wait & Trade Type</label><select value={leg.waitAndTradeType || advanceSettings.waitAndTradeConfig?.type || '%'} onChange={e => updateLeg(leg.id, 'waitAndTradeType', e.target.value)} className={inputClass}><option value="%">% ↑</option><option value="Pt">Pt ↑</option></select></div>
                              <div><label className="text-[11px] text-amber-700 font-bold block mb-1.5">Movement</label><input type="number" value={leg.waitAndTradeMovement !== undefined ? leg.waitAndTradeMovement : (advanceSettings.waitAndTradeConfig?.movement || 0)} onChange={e => updateLeg(leg.id, 'waitAndTradeMovement', e.target.value)} className={inputClass} /></div>
                          </div>
                      )}

                      {advanceSettings?.premiumDifference && (
                          <div className="grid grid-cols-2 gap-4 mt-3 bg-teal-50 p-3 rounded-lg border border-teal-100">
                              <div><label className="text-[11px] text-teal-700 font-bold block mb-1.5">Premium Difference</label><input type="number" value={leg.premiumDifference !== undefined ? leg.premiumDifference : (advanceSettings.premiumDifferenceConfig?.premium || 0)} onChange={e => updateLeg(leg.id, 'premiumDifference', e.target.value)} className={inputClass} /></div>
                          </div>
                      )}

                      {advanceSettings?.reEntryExecute && (
                          <div className="grid grid-cols-3 gap-4 mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                              <div><label className="text-[11px] text-blue-700 font-bold block mb-1.5">Re-Entry Type</label><select value={leg.reEntryType || advanceSettings.reEntryExecuteConfig?.reEntryType || 'ReExecute'} onChange={e => updateLeg(leg.id, 'reEntryType', e.target.value)} className={inputClass}><option>ReExecute</option><option>ReEntry On Cost</option><option>ReEntry On Close</option></select></div>
                              <div><label className="text-[11px] text-blue-700 font-bold block mb-1.5">Action Type</label><select value={leg.actionType || advanceSettings.reEntryExecuteConfig?.actionType || 'On Close'} onChange={e => updateLeg(leg.id, 'actionType', e.target.value)} className={inputClass}><option>On Close</option><option>Immediate</option></select></div>
                              <div><label className="text-[11px] text-blue-700 font-bold block mb-1.5">Cycles</label><input type="number" value={leg.reEntryCycles !== undefined ? leg.reEntryCycles : (advanceSettings.reEntryExecuteConfig?.cycles || 0)} onChange={e => updateLeg(leg.id, 'reEntryCycles', e.target.value)} className={inputClass} /></div>
                          </div>
                      )}

                      {advanceSettings?.trailSL && (
                          <div className="grid grid-cols-3 gap-4 mt-3 bg-pink-50 p-3 rounded-lg border border-pink-100">
                              <div><label className="text-[11px] text-pink-700 font-bold block mb-1.5">Trail SL Type</label><select value={leg.trailSLType || advanceSettings.trailSLConfig?.trailType || 'Pt'} onChange={e => updateLeg(leg.id, 'trailSLType', e.target.value)} className={inputClass}><option value="%">%</option><option value="Pt">Pt</option></select></div>
                              <div><label className="text-[11px] text-pink-700 font-bold block mb-1.5">Price Movement</label><input type="number" value={leg.trailSLMovement !== undefined ? leg.trailSLMovement : (advanceSettings.trailSLConfig?.x || 0)} onChange={e => updateLeg(leg.id, 'trailSLMovement', e.target.value)} className={inputClass} /></div>
                              <div><label className="text-[11px] text-pink-700 font-bold block mb-1.5">Trailing Value</label><input type="number" value={leg.trailSLValue !== undefined ? leg.trailSLValue : (advanceSettings.trailSLConfig?.y || 0)} onChange={e => updateLeg(leg.id, 'trailSLValue', e.target.value)} className={inputClass} /></div>
                          </div>
                      )}

                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrategyLegsSection;