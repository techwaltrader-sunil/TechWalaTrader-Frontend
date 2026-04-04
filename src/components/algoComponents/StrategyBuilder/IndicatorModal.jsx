// import React, { useState, useEffect } from 'react';
// import { Search, X } from 'lucide-react';
// import { INDICATOR_LIST } from '../../../data/indicatorList'; // Adjust path accordingly

// const IndicatorModal = ({ isOpen, onClose, onSelect, initialData }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedId, setSelectedId] = useState(null);
//   const [params, setParams] = useState({});

//   // Reset or Load Initial Data when Modal Opens
//   useEffect(() => {
//     if (isOpen) {
//         setSearchTerm("");
//         if (initialData && initialData.id) {
//             setSelectedId(initialData.id);
//             setParams(initialData.params || {});
//         } else {
//             setSelectedId(null);
//             setParams({});
//         }
//     }
//   }, [isOpen, initialData]);

//   // Handle Indicator Selection
//   const handleSelectIndicator = (indicator) => {
//     setSelectedId(indicator.id);
//     // Load default params into state
//     const defaultParams = {};
//     indicator.params.forEach(p => {
//         defaultParams[p.name] = p.value;
//     });
//     setParams(defaultParams);
//   };

//   // Handle Parameter Change
//   const handleParamChange = (name, value) => {
//     setParams(prev => ({ ...prev, [name]: value }));
//   };

//   // Filter List
//   const filteredList = INDICATOR_LIST.filter(item => 
//     item.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Confirm Selection
//   const handleOk = () => {
//     if (!selectedId) return;
//     const indicatorInfo = INDICATOR_LIST.find(i => i.id === selectedId);
    
//     // Construct Display String (e.g., "RSI(14)")
//     let displayString = indicatorInfo.label;
//     const paramValues = Object.values(params);
//     if (paramValues.length > 0) {
//         displayString = `${indicatorInfo.id.toUpperCase()}(${paramValues.join(',')})`;
//     }

//     onSelect({
//         id: selectedId,
//         label: indicatorInfo.label,
//         display: displayString,
//         params: params
//     });
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//       <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-slate-700">
//             <h3 className="text-white font-bold text-sm">Select Indicator</h3>
//             <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18}/></button>
//         </div>

//         {/* Search */}
//         <div className="p-4 border-b border-slate-800">
//             <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
//                 <Search size={16} className="text-gray-500 mr-2"/>
//                 <input 
//                     type="text" 
//                     placeholder="Search..." 
//                     className="bg-transparent border-none outline-none text-xs text-white w-full"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>
//         </div>

//         {/* List Content */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
//             {filteredList.map((indicator) => {
//                 const isSelected = selectedId === indicator.id;
                
//                 return (
//                     <div 
//                         key={indicator.id}
//                         onClick={() => handleSelectIndicator(indicator)}
//                         className={`p-3 rounded-lg border cursor-pointer transition-all ${
//                             isSelected 
//                             ? 'bg-blue-600/10 border-blue-500' 
//                             : 'bg-transparent border-transparent hover:bg-slate-800 border-b-slate-800'
//                         }`}
//                     >
//                         <div className="flex items-center gap-3">
//                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500' : 'border-gray-500'}`}>
//                                 {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
//                             </div>
//                             <span className={`text-xs font-medium ${isSelected ? 'text-blue-400' : 'text-gray-300'}`}>
//                                 {indicator.label}
//                             </span>
//                         </div>

//                         {/* ✅ PARAMETERS INPUTS (Only if selected) */}
//                         {isSelected && indicator.params.length > 0 && (
//                             <div className="mt-3 ml-7 grid grid-cols-2 gap-3 animate-in slide-in-from-top-1">
//                                 {indicator.params.map((param) => (
//                                     <div key={param.name}>
//                                         <label className="text-[10px] text-gray-400 block mb-1">{param.name}</label>
//                                         {param.type === 'select' ? (
//                                             <select 
//                                                 value={params[param.name] || param.value}
//                                                 onChange={(e) => handleParamChange(param.name, e.target.value)}
//                                                 className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
//                                             >
//                                                 {param.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                                             </select>
//                                         ) : (
//                                             <input 
//                                                 type="number" 
//                                                 value={params[param.name] || param.value}
//                                                 onChange={(e) => handleParamChange(param.name, e.target.value)}
//                                                 className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
//                                             />
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t border-slate-700 flex justify-end gap-3 bg-slate-900 rounded-b-xl">
//             <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
//             <button 
//                 onClick={handleOk} 
//                 disabled={!selectedId}
//                 className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-500/20"
//             >
//                 Ok
//             </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default IndicatorModal;


import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { INDICATOR_LIST } from '../../../data/indicatorList'; // Adjust path accordingly

const IndicatorModal = ({ isOpen, onClose, onSelect, initialData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [params, setParams] = useState({});

  // Reset or Load Initial Data when Modal Opens
  useEffect(() => {
    if (isOpen) {
        setSearchTerm("");
        if (initialData && initialData.id) {
            setSelectedId(initialData.id);
            setParams(initialData.params || {});
        } else {
            setSelectedId(null);
            setParams({});
        }
    }
  }, [isOpen, initialData]);

  // Handle Indicator Selection
  const handleSelectIndicator = (indicator) => {
    setSelectedId(indicator.id);
    // Load default params into state
    const defaultParams = {};
    indicator.params.forEach(p => {
        defaultParams[p.name] = p.value;
    });
    setParams(defaultParams);
  };

  // Handle Parameter Change
  const handleParamChange = (name, value) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  // Filter List
  const filteredList = INDICATOR_LIST.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

 // Confirm Selection
  const handleOk = () => {
    if (!selectedId) return;
    const indicatorInfo = INDICATOR_LIST.find(i => i.id === selectedId);
    
    // Construct Display String
    let displayString = indicatorInfo.label;
    const paramValues = Object.values(params);
    
    // 🔥 THE FIX: Agar "Number" select kiya hai, to sirf number dikhao (e.g., "50")
    if (selectedId === 'number' || selectedId === 'static') {
        displayString = `${paramValues[0] || 0}`;
    } 
    // Baaki indicators ke liye (e.g., "RSI(14)")
    else if (paramValues.length > 0) {
        displayString = `${indicatorInfo.id.toUpperCase()}(${paramValues.join(',')})`;
    }

    onSelect({
        id: selectedId,
        label: indicatorInfo.label,
        display: displayString,
        params: params,
        // Backend ke liye direct value bhej do agar number hai
        value: (selectedId === 'number' || selectedId === 'static') ? Number(paramValues[0]) : null 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 transition-colors">
      {/* ✅ Modal Container */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh] transition-colors duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-700 transition-colors">
            <h3 className="text-gray-900 dark:text-white font-bold text-sm">Select Indicator</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors">
                <X size={18}/>
            </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 transition-colors">
                <Search size={16} className="text-gray-500 mr-2"/>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white w-full placeholder-gray-400 dark:placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredList.map((indicator) => {
                const isSelected = selectedId === indicator.id;
                
                return (
                    <div 
                        key={indicator.id}
                        onClick={() => handleSelectIndicator(indicator)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                            ? 'bg-blue-50 dark:bg-blue-600/10 border-blue-500' 
                            : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-700'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500' : 'border-gray-300 dark:border-gray-500'}`}>
                                {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                            <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                {indicator.label}
                            </span>
                        </div>

                        {/* ✅ PARAMETERS INPUTS */}
                        {isSelected && indicator.params?.length > 0 && (
                            <div className="mt-3 ml-7 grid grid-cols-2 gap-3 animate-in slide-in-from-top-1">
                                {indicator.params.map((param) => (
                                    <div key={param.name} onClick={(e) => e.stopPropagation()}>
                                        <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold block mb-1">{param.name}</label>
                                        {param.type === 'select' ? (
                                            <select 
                                                value={params[param.name] || param.value}
                                                onChange={(e) => handleParamChange(param.name, e.target.value)}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                            >
                                                {param.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input 
                                                type="number" 
                                                value={params[param.name] || param.value}
                                                onChange={(e) => handleParamChange(param.name, e.target.value)}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900 rounded-b-xl transition-colors">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
            <button 
                onClick={handleOk} 
                disabled={!selectedId}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
            >
                Ok
            </button>
        </div>

      </div>
    </div>
  );
};

export default IndicatorModal;