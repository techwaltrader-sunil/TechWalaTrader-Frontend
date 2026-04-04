
// import React, { useState } from 'react';
// import { Info, Plus, Trash2 } from 'lucide-react';
// import IndicatorModal from './IndicatorModal';

// const EntryConditionSection = ({ entrySettings = {}, setEntrySettings }) => {

//   const isSpecialChart = entrySettings?.useCombinedChart || entrySettings?.useOptionsChart;

//   // --- States ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeField, setActiveField] = useState(null); 

//   // ENTRY DATA STATES
//   const [longConditions, setLongConditions] = useState([{ id: Date.now(), ind1: null, op: 'Crosses Above', ind2: null }]);
//   const [shortConditions, setShortConditions] = useState([{ id: Date.now(), ind1: null, op: 'Crosses Below', ind2: null }]);
//   const [entryLogicalOps, setEntryLogicalOps] = useState([]); 

//   // EXIT DATA STATES
//   const [showExitConditions, setShowExitConditions] = useState(false);
//   const [longExitConditions, setLongExitConditions] = useState([{ id: Date.now() + 1, ind1: null, op: 'Crosses Below', ind2: null }]);
//   const [shortExitConditions, setShortExitConditions] = useState([{ id: Date.now() + 1, ind1: null, op: 'Crosses Above', ind2: null }]);
//   const [exitLogicalOps, setExitLogicalOps] = useState([]);

//   // --- Handlers: ENTRY ---
//   const addEntryPair = () => {
//     const newId = Date.now();
//     setLongConditions([...longConditions, { id: newId, ind1: null, op: 'Crosses Above', ind2: null }]);
//     setShortConditions([...shortConditions, { id: newId, ind1: null, op: 'Crosses Below', ind2: null }]);
//     if (longConditions.length > 0) setEntryLogicalOps([...entryLogicalOps, 'AND']);
//   };

//   const removeEntryPair = (index) => {
//     const newLong = longConditions.filter((_, i) => i !== index);
//     const newShort = shortConditions.filter((_, i) => i !== index);
//     const newOps = [...entryLogicalOps];
//     if (index > 0) newOps.splice(index - 1, 1); else newOps.shift();
//     setLongConditions(newLong); setShortConditions(newShort); setEntryLogicalOps(newOps);
//   };

//   const toggleEntryOp = (index) => {
//     const newOps = [...entryLogicalOps];
//     newOps[index] = newOps[index] === 'AND' ? 'OR' : 'AND';
//     setEntryLogicalOps(newOps);
//   };

//   // --- Handlers: EXIT ---
//   const addExitPair = () => {
//     const newId = Date.now();
//     setLongExitConditions([...longExitConditions, { id: newId, ind1: null, op: 'Crosses Below', ind2: null }]);
//     setShortExitConditions([...shortExitConditions, { id: newId, ind1: null, op: 'Crosses Above', ind2: null }]);
//     if (longExitConditions.length > 0) setExitLogicalOps([...exitLogicalOps, 'AND']);
//   };

//   const removeExitPair = (index) => {
//     const newLong = longExitConditions.filter((_, i) => i !== index);
//     const newShort = shortExitConditions.filter((_, i) => i !== index);
//     const newOps = [...exitLogicalOps];
//     if (index > 0) newOps.splice(index - 1, 1); else newOps.shift();
//     setLongExitConditions(newLong); setShortExitConditions(newShort); setExitLogicalOps(newOps);
//   };

//   const toggleExitOp = (index) => {
//     const newOps = [...exitLogicalOps];
//     newOps[index] = newOps[index] === 'AND' ? 'OR' : 'AND';
//     setExitLogicalOps(newOps);
//   };

//   // --- Common Handlers ---
//   const handleChartTypeChange = (type) => {
//     setEntrySettings(prev => {
//         const newState = { ...prev };
//         if (type === 'combined') {
//             newState.useCombinedChart = !prev.useCombinedChart;
//             if(newState.useCombinedChart) newState.useOptionsChart = false; 
//         } else if (type === 'options') {
//             newState.useOptionsChart = !prev.useOptionsChart;
//             if(newState.useOptionsChart) newState.useCombinedChart = false; 
//         }
//         return newState;
//     });
//   };

//   const openModal = (section, type, index, field, currentVal) => {
//     setActiveField({ section, type, index, field });
//     setIsModalOpen(true);
//   };

//   const handleIndicatorSelect = (data) => {
//     if (!activeField) return;
//     const { section, type, index, field } = activeField;

//     if (section === 'entry') {
//         if (type === 'long') {
//             const newConds = [...longConditions]; newConds[index][field] = data; setLongConditions(newConds);
//         } else {
//             const newConds = [...shortConditions]; newConds[index][field] = data; setShortConditions(newConds);
//         }
//     } else {
//         if (type === 'long') {
//             const newConds = [...longExitConditions]; newConds[index][field] = data; setLongExitConditions(newConds);
//         } else {
//             const newConds = [...shortExitConditions]; newConds[index][field] = data; setShortExitConditions(newConds);
//         }
//     }
//   };

//   // --- Render Row Helper ---
//   const renderRow = (cond, index, type, section, conditionsArray, setConditionsArray) => {
//     let labelText = "";
//     if (section === 'entry') {
//         labelText = type === 'long' ? (isSpecialChart ? "Condition" : "Long Entry") : "Short Entry";
//     } else {
//         labelText = type === 'long' ? "Long Exit" : "Short Exit";
//     }

//     return (
//         // ✅ Row Container: Light (White) | Dark (Slate-900)
//         <div key={`${section}-${type}-${index}`} className={`flex flex-col md:flex-row gap-3 items-start p-4 bg-gray-50 dark:bg-slate-900/80 rounded-lg border border-gray-200 dark:border-slate-700 border-l-4 ${type === 'long' ? 'border-l-green-500' : 'border-l-red-500'} transition-all hover:border-gray-300 dark:hover:border-slate-600`}>
            
//             <div className="w-full md:w-24 shrink-0 pt-2">
//                 <span className={`text-[11px] font-bold ${type === 'long' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'} uppercase tracking-wide`}>
//                     {labelText}
//                 </span>
//             </div>

//             <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                
//                 {/* Indicator 1 */}
//                 <div className="flex flex-col gap-1">
//                     <div onClick={() => openModal(section, type, index, 'ind1', cond.ind1)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-between min-h-[34px]">
//                         <span className={cond.ind1 ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>{cond.ind1 ? cond.ind1.label : "Select Indicator"}</span>
//                     </div>
//                     {cond.ind1 && <p className="text-[9px] text-gray-500 dark:text-gray-400 pl-1 font-mono tracking-tight leading-tight">{cond.ind1.display}</p>}
//                 </div>

//                 {/* Comparator */}
//                 <div className="flex flex-col gap-1">
//                     <select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 text-center min-h-[34px] transition-colors"
//                         value={cond.op}
//                         onChange={(e) => {
//                             const newConds = [...conditionsArray];
//                             newConds[index].op = e.target.value;
//                             setConditionsArray(newConds);
//                         }}
//                     >
//                         <option>Crosses Above</option><option>Crosses Below</option><option>Greater Than</option><option>Less Than</option><option>Equals</option>
//                     </select>
//                 </div>

//                 {/* Indicator 2 */}
//                 <div className="flex flex-col gap-1">
//                     <div onClick={() => openModal(section, type, index, 'ind2', cond.ind2)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-between min-h-[34px]">
//                         <span className={cond.ind2 ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>{cond.ind2 ? cond.ind2.label : "Select Indicator / Value"}</span>
//                     </div>
//                     {cond.ind2 && <p className="text-[9px] text-gray-500 dark:text-gray-400 pl-1 font-mono tracking-tight leading-tight">{cond.ind2.display}</p>}
//                 </div>
//             </div>
//         </div>
//     );
//   };

//   return (
//     <>
//         {/* ✅ Main Container: Light (White) | Dark (Slate-800) */}
//         <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 mt-4 animate-in fade-in slide-in-from-bottom-4 shadow-sm dark:shadow-none transition-colors duration-300">
            
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">Entry Conditions</h3>
//                 <div className="flex items-center gap-4">
//                     <label className="flex items-center gap-2 cursor-pointer select-none">
//                         <input type="checkbox" className="w-3.5 h-3.5 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer" checked={entrySettings?.useCombinedChart || false} onChange={() => handleChartTypeChange('combined')}/>
//                         <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">Use Combined Chart</span>
//                     </label>
//                     <div className="flex items-center gap-2 relative group">
//                         <label className="flex items-center gap-2 cursor-pointer select-none">
//                             <input type="checkbox" className="w-3.5 h-3.5 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer" checked={entrySettings?.useOptionsChart || false} onChange={() => handleChartTypeChange('options')}/>
//                             <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">Use Options Chart</span>
//                         </label>
//                         <Info size={14} className="text-gray-400 dark:text-gray-500 cursor-help" />
//                     </div>
//                 </div>
//             </div>

//             {/* 🟢 ENTRY CONDITIONS CONTAINER */}
//             <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/20 transition-colors">
//                 {longConditions.map((_, index) => (
//                     <React.Fragment key={`entry-pair-${index}`}>
//                         {index > 0 && (
//                             <div className="flex justify-center my-3 relative">
//                                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-slate-700"></div></div>
//                                 <div className="relative z-10 flex bg-white dark:bg-slate-800 rounded-md p-0.5 border border-gray-300 dark:border-slate-600 shadow-sm">
//                                     <button onClick={() => toggleEntryOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${entryLogicalOps[index-1] === 'AND' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>AND</button>
//                                     <button onClick={() => toggleEntryOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${entryLogicalOps[index-1] === 'OR' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>OR</button>
//                                 </div>
//                             </div>
//                         )}
//                         <div className="space-y-3 relative group/pair">
//                             {renderRow(longConditions[index], index, 'long', 'entry', longConditions, setLongConditions)}
//                             {!isSpecialChart && renderRow(shortConditions[index], index, 'short', 'entry', shortConditions, setShortConditions)}
                            
//                             {longConditions.length > 1 && (
//                                 <div className="flex justify-end mt-1">
//                                     <button onClick={() => removeEntryPair(index)} className="flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-2 py-1 rounded border border-red-200 dark:border-red-500/20 transition-colors">
//                                         <Trash2 size={12} /> Remove Pair
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </React.Fragment>
//                 ))}
//                 <div className="flex justify-end mt-4">
//                     <button onClick={addEntryPair} className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors shadow-md shadow-blue-500/20 active:scale-95">
//                         <Plus size={12} /> {isSpecialChart ? "Add Condition" : "Add Condition Pair"}
//                     </button>
//                 </div>
//             </div>

//             {/* 🟡 EXIT CONDITIONS TOGGLE */}
//             <div className="mt-5">
//                 <label className="flex items-center gap-2 cursor-pointer w-fit select-none group">
//                     <input 
//                         type="checkbox" 
//                         className="w-3.5 h-3.5 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer"
//                         checked={showExitConditions}
//                         onChange={(e) => setShowExitConditions(e.target.checked)}
//                     />
//                     <span className={`text-[11px] font-bold transition-colors ${showExitConditions ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
//                         Exit Conditions (Optional)
//                     </span>
//                 </label>
//             </div>

//             {/* 🔴 EXIT CONDITIONS CONTAINER */}
//             {showExitConditions && (
//                 <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/20 mt-3 animate-in fade-in slide-in-from-top-2 transition-colors">
//                     {longExitConditions.map((_, index) => (
//                         <React.Fragment key={`exit-pair-${index}`}>
//                             {index > 0 && (
//                                 <div className="flex justify-center my-3 relative">
//                                     <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-slate-700"></div></div>
//                                     <div className="relative z-10 flex bg-white dark:bg-slate-800 rounded-md p-0.5 border border-gray-300 dark:border-slate-600 shadow-sm">
//                                         <button onClick={() => toggleExitOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${exitLogicalOps[index-1] === 'AND' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>AND</button>
//                                         <button onClick={() => toggleExitOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${exitLogicalOps[index-1] === 'OR' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>OR</button>
//                                     </div>
//                                 </div>
//                             )}
//                             <div className="space-y-3 relative group/pair">
//                                 {renderRow(longExitConditions[index], index, 'long', 'exit', longExitConditions, setLongExitConditions)}
//                                 {!isSpecialChart && renderRow(shortExitConditions[index], index, 'short', 'exit', shortExitConditions, setShortExitConditions)}
                                
//                                 {longExitConditions.length > 1 && (
//                                     <div className="flex justify-end mt-1">
//                                         <button onClick={() => removeExitPair(index)} className="flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-2 py-1 rounded border border-red-200 dark:border-red-500/20 transition-colors">
//                                             <Trash2 size={12} /> Remove Pair
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </React.Fragment>
//                     ))}
//                     <div className="flex justify-end mt-4">
//                         <button onClick={addExitPair} className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors shadow-md shadow-blue-500/20 active:scale-95">
//                             <Plus size={12} /> {isSpecialChart ? "Add Exit Condition" : "Add Exit Condition Pair"}
//                         </button>
//                     </div>
//                 </div>
//             )}

//         </div>

//         {/* Modal */}
//         <IndicatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleIndicatorSelect}/>
//     </>
//   );
// };

// export default EntryConditionSection;



import React, { useState, useEffect } from 'react';
import { Info, Plus, Trash2 } from 'lucide-react';
import IndicatorModal from './IndicatorModal';

const EntryConditionSection = ({ entrySettings = {}, setEntrySettings }) => {

  const isSpecialChart = entrySettings?.useCombinedChart || entrySettings?.useOptionsChart;

  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeField, setActiveField] = useState(null); 

  // ENTRY DATA STATES
  const [longConditions, setLongConditions] = useState([{ id: Date.now(), ind1: null, op: 'Crosses Above', ind2: null }]);
  const [shortConditions, setShortConditions] = useState([{ id: Date.now(), ind1: null, op: 'Crosses Below', ind2: null }]);
  const [entryLogicalOps, setEntryLogicalOps] = useState([]); 

  // EXIT DATA STATES
  const [showExitConditions, setShowExitConditions] = useState(false);
  const [longExitConditions, setLongExitConditions] = useState([{ id: Date.now() + 1, ind1: null, op: 'Crosses Below', ind2: null }]);
  const [shortExitConditions, setShortExitConditions] = useState([{ id: Date.now() + 1, ind1: null, op: 'Crosses Above', ind2: null }]);
  const [exitLogicalOps, setExitLogicalOps] = useState([]);

  // --- Handlers: ENTRY ---
  const addEntryPair = () => {
    const newId = Date.now();
    setLongConditions([...longConditions, { id: newId, ind1: null, op: 'Crosses Above', ind2: null }]);
    setShortConditions([...shortConditions, { id: newId, ind1: null, op: 'Crosses Below', ind2: null }]);
    if (longConditions.length > 0) setEntryLogicalOps([...entryLogicalOps, 'AND']);
  };

  const removeEntryPair = (index) => {
    const newLong = longConditions.filter((_, i) => i !== index);
    const newShort = shortConditions.filter((_, i) => i !== index);
    const newOps = [...entryLogicalOps];
    if (index > 0) newOps.splice(index - 1, 1); else newOps.shift();
    setLongConditions(newLong); setShortConditions(newShort); setEntryLogicalOps(newOps);
  };

  const toggleEntryOp = (index) => {
    const newOps = [...entryLogicalOps];
    newOps[index] = newOps[index] === 'AND' ? 'OR' : 'AND';
    setEntryLogicalOps(newOps);
  };

  // --- Handlers: EXIT ---
  const addExitPair = () => {
    const newId = Date.now();
    setLongExitConditions([...longExitConditions, { id: newId, ind1: null, op: 'Crosses Below', ind2: null }]);
    setShortExitConditions([...shortExitConditions, { id: newId, ind1: null, op: 'Crosses Above', ind2: null }]);
    if (longExitConditions.length > 0) setExitLogicalOps([...exitLogicalOps, 'AND']);
  };

  const removeExitPair = (index) => {
    const newLong = longExitConditions.filter((_, i) => i !== index);
    const newShort = shortExitConditions.filter((_, i) => i !== index);
    const newOps = [...exitLogicalOps];
    if (index > 0) newOps.splice(index - 1, 1); else newOps.shift();
    setLongExitConditions(newLong); setShortExitConditions(newShort); setExitLogicalOps(newOps);
  };

  const toggleExitOp = (index) => {
    const newOps = [...exitLogicalOps];
    newOps[index] = newOps[index] === 'AND' ? 'OR' : 'AND';
    setExitLogicalOps(newOps);
  };

  // --- Common Handlers ---
  const handleChartTypeChange = (type) => {
    setEntrySettings(prev => {
        const newState = { ...prev };
        if (type === 'combined') {
            newState.useCombinedChart = !prev.useCombinedChart;
            if(newState.useCombinedChart) newState.useOptionsChart = false; 
        } else if (type === 'options') {
            newState.useOptionsChart = !prev.useOptionsChart;
            if(newState.useOptionsChart) newState.useCombinedChart = false; 
        }
        return newState;
    });
  };

  const openModal = (section, type, index, field, currentVal) => {
    setActiveField({ section, type, index, field });
    setIsModalOpen(true);
  };

  const handleIndicatorSelect = (data) => {
    if (!activeField) return;
    const { section, type, index, field } = activeField;

    if (section === 'entry') {
        if (type === 'long') {
            const newConds = [...longConditions]; newConds[index][field] = data; setLongConditions(newConds);
        } else {
            const newConds = [...shortConditions]; newConds[index][field] = data; setShortConditions(newConds);
        }
    } else {
        if (type === 'long') {
            const newConds = [...longExitConditions]; newConds[index][field] = data; setLongExitConditions(newConds);
        } else {
            const newConds = [...shortExitConditions]; newConds[index][field] = data; setShortExitConditions(newConds);
        }
    }
  };

  const renderRow = (cond, index, type, section, conditionsArray, setConditionsArray) => {
    let labelText = "";
    if (section === 'entry') {
        labelText = type === 'long' ? (isSpecialChart ? "Condition" : "Long Entry") : "Short Entry";
    } else {
        labelText = type === 'long' ? "Long Exit" : "Short Exit";
    }


    // ==========================================
    // 2. THE BRAIN (useEffect ko yahan, renderRow ke bahar aur main return se pehle rakhna hai)
    // ==========================================
    React.useEffect(() => {
        if (typeof setEntrySettings === 'function') {
            setEntrySettings(prev => {
                const newEntryConditions = [
                    {
                        longRules: longConditions,
                        shortRules: shortConditions,
                        logicalOps: entryLogicalOps
                    }
                ];
                
                const newExitConditions = showExitConditions ? [
                    {
                        longRules: longExitConditions,
                        shortRules: shortExitConditions,
                        logicalOps: exitLogicalOps
                    }
                ] : [];

                // Infinite loop break karne ka logic
                if (JSON.stringify(prev?.entryConditions) === JSON.stringify(newEntryConditions) &&
                    JSON.stringify(prev?.exitConditions) === JSON.stringify(newExitConditions)) {
                    return prev; 
                }

                return {
                    ...prev,
                    entryConditions: newEntryConditions,
                    exitConditions: newExitConditions
                };
            });
        }
    }, [longConditions, shortConditions, entryLogicalOps, showExitConditions, longExitConditions, shortExitConditions, exitLogicalOps]);

    return (
        // ✅ Row Container: Light (White) | Dark (Slate-900)
        <div key={`${section}-${type}-${index}`} className={`flex flex-col md:flex-row gap-3 items-start p-4 bg-gray-50 dark:bg-slate-900/80 rounded-lg border border-gray-200 dark:border-slate-700 border-l-4 ${type === 'long' ? 'border-l-green-500' : 'border-l-red-500'} transition-all hover:border-gray-300 dark:hover:border-slate-600`}>
            
            <div className="w-full md:w-24 shrink-0 pt-2">
                <span className={`text-[11px] font-bold ${type === 'long' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'} uppercase tracking-wide`}>
                    {labelText}
                </span>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                
                {/* Indicator 1 */}
                <div className="flex flex-col gap-1">
                    <div onClick={() => openModal(section, type, index, 'ind1', cond.ind1)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-between min-h-[34px]">
                        <span className={cond.ind1 ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>{cond.ind1 ? cond.ind1.label : "Select Indicator"}</span>
                    </div>
                    {cond.ind1 && <p className="text-[9px] text-gray-500 dark:text-gray-400 pl-1 font-mono tracking-tight leading-tight">{cond.ind1.display}</p>}
                </div>

                {/* Comparator */}
                <div className="flex flex-col gap-1">
                    <select className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 text-center min-h-[34px] transition-colors"
                        value={cond.op}
                        onChange={(e) => {
                            const newConds = [...conditionsArray];
                            newConds[index].op = e.target.value;
                            setConditionsArray(newConds);
                        }}
                    >
                        <option>Crosses Above</option><option>Crosses Below</option><option>Greater Than</option><option>Less Than</option><option>Equals</option>
                    </select>
                </div>

                {/* Indicator 2 */}
                <div className="flex flex-col gap-1">
                    <div onClick={() => openModal(section, type, index, 'ind2', cond.ind2)} className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-between min-h-[34px]">
                        <span className={cond.ind2 ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>{cond.ind2 ? cond.ind2.label : "Select Indicator / Value"}</span>
                    </div>
                    {cond.ind2 && <p className="text-[9px] text-gray-500 dark:text-gray-400 pl-1 font-mono tracking-tight leading-tight">{cond.ind2.display}</p>}
                </div>
            </div>
        </div>
    );
  };

  return (
    <>
        {/* ✅ Main Container: Light (White) | Dark (Slate-800) */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 mt-4 animate-in fade-in slide-in-from-bottom-4 shadow-sm dark:shadow-none transition-colors duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Entry Conditions</h3>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" className="w-3.5 h-3.5 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer" checked={entrySettings?.useCombinedChart || false} onChange={() => handleChartTypeChange('combined')}/>
                        <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">Use Combined Chart</span>
                    </label>
                    <div className="flex items-center gap-2 relative group">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" className="w-3.5 h-3.5 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer" checked={entrySettings?.useOptionsChart || false} onChange={() => handleChartTypeChange('options')}/>
                            <span className="text-[12px] font-medium text-gray-600 dark:text-gray-300">Use Options Chart</span>
                        </label>
                        <Info size={14} className="text-gray-400 dark:text-gray-500 cursor-help" />
                    </div>
                </div>
            </div>

            {/* 🟢 ENTRY CONDITIONS CONTAINER */}
            <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/20 transition-colors">
                {longConditions.map((_, index) => (
                    <React.Fragment key={`entry-pair-${index}`}>
                        {index > 0 && (
                            <div className="flex justify-center my-3 relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-slate-700"></div></div>
                                <div className="relative z-10 flex bg-white dark:bg-slate-800 rounded-md p-0.5 border border-gray-300 dark:border-slate-600 shadow-sm">
                                    <button onClick={() => toggleEntryOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${entryLogicalOps[index-1] === 'AND' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>AND</button>
                                    <button onClick={() => toggleEntryOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${entryLogicalOps[index-1] === 'OR' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>OR</button>
                                </div>
                            </div>
                        )}
                        <div className="space-y-3 relative group/pair">
                            {renderRow(longConditions[index], index, 'long', 'entry', longConditions, setLongConditions)}
                            {!isSpecialChart && renderRow(shortConditions[index], index, 'short', 'entry', shortConditions, setShortConditions)}
                            
                            {longConditions.length > 1 && (
                                <div className="flex justify-end mt-1">
                                    <button onClick={() => removeEntryPair(index)} className="flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-2 py-1 rounded border border-red-200 dark:border-red-500/20 transition-colors">
                                        <Trash2 size={12} /> Remove Pair
                                    </button>
                                </div>
                            )}
                        </div>
                    </React.Fragment>
                ))}
                <div className="flex justify-end mt-4">
                    <button onClick={addEntryPair} className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors shadow-md shadow-blue-500/20 active:scale-95">
                        <Plus size={12} /> {isSpecialChart ? "Add Condition" : "Add Condition Pair"}
                    </button>
                </div>
            </div>

            {/* 🟡 EXIT CONDITIONS TOGGLE */}
            <div className="mt-5">
                <label className="flex items-center gap-2 cursor-pointer w-fit select-none group">
                    <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 accent-blue-600 dark:accent-blue-500 rounded cursor-pointer"
                        checked={showExitConditions}
                        onChange={(e) => setShowExitConditions(e.target.checked)}
                    />
                    <span className={`text-[11px] font-bold transition-colors ${showExitConditions ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                        Exit Conditions (Optional)
                    </span>
                </label>
            </div>

            {/* 🔴 EXIT CONDITIONS CONTAINER */}
            {showExitConditions && (
                <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/20 mt-3 animate-in fade-in slide-in-from-top-2 transition-colors">
                    {longExitConditions.map((_, index) => (
                        <React.Fragment key={`exit-pair-${index}`}>
                            {index > 0 && (
                                <div className="flex justify-center my-3 relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-slate-700"></div></div>
                                    <div className="relative z-10 flex bg-white dark:bg-slate-800 rounded-md p-0.5 border border-gray-300 dark:border-slate-600 shadow-sm">
                                        <button onClick={() => toggleExitOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${exitLogicalOps[index-1] === 'AND' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>AND</button>
                                        <button onClick={() => toggleExitOp(index - 1)} className={`px-3 py-0.5 text-[10px] font-bold rounded transition-colors ${exitLogicalOps[index-1] === 'OR' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>OR</button>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-3 relative group/pair">
                                {renderRow(longExitConditions[index], index, 'long', 'exit', longExitConditions, setLongExitConditions)}
                                {!isSpecialChart && renderRow(shortExitConditions[index], index, 'short', 'exit', shortExitConditions, setShortExitConditions)}
                                
                                {longExitConditions.length > 1 && (
                                    <div className="flex justify-end mt-1">
                                        <button onClick={() => removeExitPair(index)} className="flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-2 py-1 rounded border border-red-200 dark:border-red-500/20 transition-colors">
                                            <Trash2 size={12} /> Remove Pair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                    <div className="flex justify-end mt-4">
                        <button onClick={addExitPair} className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors shadow-md shadow-blue-500/20 active:scale-95">
                            <Plus size={12} /> {isSpecialChart ? "Add Exit Condition" : "Add Exit Condition Pair"}
                        </button>
                    </div>
                </div>
            )}

        </div>

        {/* Modal */}
        <IndicatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleIndicatorSelect}/>
    </>
  );
};

export default EntryConditionSection;