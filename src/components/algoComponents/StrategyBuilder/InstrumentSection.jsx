

// import React, { useState, useEffect } from "react";
// import { Info, X, Plus, Minus } from "lucide-react"; 
// import ComingSoonOverlay from "./ComingSoonOverlay";
// import InstrumentModal from "./InstrumentModal";

// const InstrumentSection = ({ isComingSoon, strategyType, instruments, setInstruments }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Strategy badalne par reset
//   useEffect(() => {
//     setInstruments([]);
//   }, [strategyType, setInstruments]);

//   const handleInstrumentSave = (dataArray) => {
//     setInstruments(
//       dataArray.map((item) => ({
//         ...item,
//         exchange: "NSE",
//         segment: item.segment || (item.lot === 1 ? 'Equity' : 'Option')
//       })),
//     );
//   };

//   const removeInstrument = (indexToRemove) => {
//     setInstruments(instruments.filter((_, index) => index !== indexToRemove));
//   };

//   const updateQuantity = (index, change) => {
//     setInstruments(prevInstruments => 
//       prevInstruments.map((inst, i) => {
//         if (i === index) {
//           const newQty = (inst.lot || 1) + change;
//           return { ...inst, lot: newQty > 0 ? newQty : 1 };
//         }
//         return inst;
//       })
//     );
//   };

//   return (
//     <>
//       {/* ✅ Container: Light (White) | Dark (Slate-800) */}
//       <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative h-full flex flex-col shadow-sm dark:shadow-none transition-colors duration-300">
        
//         {isComingSoon && <ComingSoonOverlay />}

//         <div className="flex items-center gap-2 mb-3">
//           <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400">
//             Select Instruments
//           </h3>
//           {strategyType === "Indicator Based" && (
//             <div className="group relative flex items-center">
//               <Info
//                 size={14}
//                 className="text-gray-400 dark:text-gray-500 cursor-help hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
//               />
//               <div className="absolute left-6 top-0 w-48 bg-gray-900 dark:bg-black/90 text-white text-[10px] p-2 rounded shadow-xl border border-gray-700 dark:border-slate-600 hidden group-hover:block z-20">
//                 Equity mode allows selecting a maximum of 50 Instruments
//               </div>
//             </div>
//           )}
//         </div>

//         {/* LIST RENDERING */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[300px] space-y-2 mb-4">
//           {instruments.length > 0 ? (
//             instruments.map((inst, index) => (
//               // ✅ Item Card: Light (Gray-50) | Dark (Slate-900)
//               <div key={index} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg shadow-sm relative group animate-in fade-in slide-in-from-top-1 transition-colors">
                
//                 {/* Remove Button */}
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         removeInstrument(index);
//                     }}
//                     className="absolute top-6 left-2 text-gray-400 hover:text-red-500 transition-colors"
//                 >
//                     <X size={14} />
//                 </button>

//                 <div className="flex justify-between items-center pl-6">
                  
//                   {/* Left Side: Name & Exchange */}
//                   <div>
//                     <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase">
//                       {inst.name}
//                     </h4>
//                     <div className="text-[10px] text-gray-500 dark:text-gray-500 font-bold mt-0.5">
//                       {inst.exchange}
//                     </div>
//                   </div>

//                   {/* Right Side Logic */}
//                   <div className="text-right">
                    
//                     {(strategyType === 'Time Based' || inst.segment === 'Option') ? (
//                         // CASE 1: Static Lot Size
//                         <>
//                             <span className="text-[9px] text-gray-500 dark:text-gray-500 font-bold block mb-1">
//                                 LOT SIZE
//                             </span>
//                             <h4 className="font-bold text-xs text-gray-800 dark:text-white pr-1">
//                                 {inst.lot}
//                             </h4>
//                         </>
//                     ) : (
//                         // CASE 2: Equity (Qty with Counter)
//                         <>
//                             <span className="text-[10px] text-gray-500 dark:text-gray-500 font-bold block mb-1">
//                                 Qty
//                             </span>
//                             {/* Counter Box: Light (White bg) | Dark (Slate-950 bg) */}
//                             <div className="flex items-center bg-white dark:bg-slate-950 rounded border border-gray-300 dark:border-slate-600 overflow-hidden transition-colors">
//                                 <button 
//                                     onClick={() => updateQuantity(index, -1)}
//                                     className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-r border-gray-300 dark:border-slate-800"
//                                 >
//                                     <Minus size={8} strokeWidth={3} />
//                                 </button>

//                                 <div className="w-6 text-center text-xs font-bold text-gray-800 dark:text-white bg-transparent">
//                                     {inst.lot}
//                                 </div>

//                                 <button 
//                                     onClick={() => updateQuantity(index, 1)}
//                                     className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-l border-gray-300 dark:border-slate-800"
//                                 >
//                                     <Plus size={8} strokeWidth={2} />
//                                 </button>
//                             </div>
//                         </>
//                     )}

//                   </div>

//                 </div>
//               </div>
//             ))
//           ) : (
//             // Empty State Message (Optional)
//             <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-600 italic">
//                No instruments selected
//             </div>
//           )}
//         </div>

//         {/* + Add Button */}
//         {/* Light (Gray-50 + Dashed Border) | Dark (Slate-900/30 + Dashed Border) */}
//         <div
//           onClick={() => setIsModalOpen(true)}
//           className="border border-dashed border-gray-300 dark:border-slate-600 rounded-lg py-3 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-500 transition-all bg-gray-50 hover:bg-blue-50 dark:bg-slate-900/30 dark:hover:bg-slate-900 mt-auto group"
//         >
//           <span className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//             {instruments.length > 0 ? "+ Add More" : "+ Add Instrument"}
//           </span>
//         </div>
//       </div>

//       <InstrumentModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleInstrumentSave}
//         strategyType={strategyType}
//       />
//     </>
//   );
// };

// export default InstrumentSection;



import React, { useState, useEffect } from "react";
import { Info, X, Plus, Minus } from "lucide-react"; 
import ComingSoonOverlay from "./ComingSoonOverlay";
import InstrumentModal from "./InstrumentModal";

// 🔥 Naya prop 'underlyingType' aur 'setUnderlyingType' add kiya gaya hai
const InstrumentSection = ({ isComingSoon, strategyType, instruments, setInstruments, underlyingType = "Spot", setUnderlyingType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Strategy badalne par reset
  useEffect(() => {
    setInstruments([]);
    // Default Spot set kar do strategy badalne par
    if (setUnderlyingType) setUnderlyingType("Spot");
  }, [strategyType, setInstruments, setUnderlyingType]);

  const handleInstrumentSave = (dataArray) => {
    setInstruments(
      dataArray.map((item) => ({
        ...item,
        exchange: "NSE",
        segment: item.segment || (item.lot === 1 ? 'Equity' : 'Option')
      })),
    );
  };

  const removeInstrument = (indexToRemove) => {
    setInstruments(instruments.filter((_, index) => index !== indexToRemove));
  };

  const updateQuantity = (index, change) => {
    setInstruments(prevInstruments => 
      prevInstruments.map((inst, i) => {
        if (i === index) {
          const newQty = (inst.lot || 1) + change;
          return { ...inst, lot: newQty > 0 ? newQty : 1 };
        }
        return inst;
      })
    );
  };

  // 🔥 THE TOGGLE HANDLER
  const handleUnderlyingChange = (type) => {
      if (setUnderlyingType) setUnderlyingType(type);
  };

  return (
    <>
      {/* ✅ Container */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative h-full flex flex-col shadow-sm dark:shadow-none transition-colors duration-300">
        
        {isComingSoon && <ComingSoonOverlay />}

        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400">
            Select Instruments
          </h3>
          {strategyType === "Indicator Based" && (
            <div className="group relative flex items-center">
              <Info
                size={14}
                className="text-gray-400 dark:text-gray-500 cursor-help hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              />
              <div className="absolute left-6 top-0 w-48 bg-gray-900 dark:bg-black/90 text-white text-[10px] p-2 rounded shadow-xl border border-gray-700 dark:border-slate-600 hidden group-hover:block z-20">
                Equity mode allows selecting a maximum of 50 Instruments
              </div>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* 🔥 NEW UI: SPOT vs FUTURE TOGGLE BOX */}
        {/* ========================================== */}
        <div className="mb-4 bg-blue-50/50 dark:bg-slate-900/40 p-3 rounded-lg border border-blue-100 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
                <div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Underlying</span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                        Choose the reference chart used for indicator calculations. (Note: Volume indicators require Future chart)
                    </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <div className="flex bg-gray-200 dark:bg-slate-800 p-1 rounded-md w-full mt-1 relative">
                    {/* Sliding Background */}
                    <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 dark:bg-blue-600 rounded shadow transition-all duration-300 ease-in-out z-0 ${underlyingType === 'Future' ? 'translate-x-full left-1' : 'translate-x-0 left-1'}`}
                    ></div>
                    
                    <button 
                        onClick={() => handleUnderlyingChange('Spot')}
                        className={`flex-1 text-xs font-bold py-1.5 rounded z-10 transition-colors duration-300 ${underlyingType === 'Spot' ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        Spot
                    </button>
                    <button 
                        onClick={() => handleUnderlyingChange('Future')}
                        className={`flex-1 text-xs font-bold py-1.5 rounded z-10 transition-colors duration-300 ${underlyingType === 'Future' ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        Future
                    </button>
                </div>
            </div>
        </div>
        {/* ========================================== */}

        {/* LIST RENDERING */}
        <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[220px] space-y-2 mb-4">
          {instruments.length > 0 ? (
            instruments.map((inst, index) => (
              <div key={index} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg shadow-sm relative group animate-in fade-in slide-in-from-top-1 transition-colors">
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeInstrument(index);
                    }}
                    className="absolute top-6 left-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={14} />
                </button>

                <div className="flex justify-between items-center pl-6">
                  <div>
                    <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase">
                      {inst.name}
                    </h4>
                    <div className="text-[10px] text-gray-500 dark:text-gray-500 font-bold mt-0.5">
                      {inst.exchange}
                    </div>
                  </div>

                  <div className="text-right">
                    {(strategyType === 'Time Based' || inst.segment === 'Option') ? (
                        <>
                            <span className="text-[9px] text-gray-500 dark:text-gray-500 font-bold block mb-1">
                                LOT SIZE
                            </span>
                            <h4 className="font-bold text-xs text-gray-800 dark:text-white pr-1">
                                {inst.lot}
                            </h4>
                        </>
                    ) : (
                        <>
                            <span className="text-[10px] text-gray-500 dark:text-gray-500 font-bold block mb-1">
                                Qty
                            </span>
                            <div className="flex items-center bg-white dark:bg-slate-950 rounded border border-gray-300 dark:border-slate-600 overflow-hidden transition-colors">
                                <button 
                                    onClick={() => updateQuantity(index, -1)}
                                    className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-r border-gray-300 dark:border-slate-800"
                                >
                                    <Minus size={8} strokeWidth={3} />
                                </button>
                                <div className="w-6 text-center text-xs font-bold text-gray-800 dark:text-white bg-transparent">
                                    {inst.lot}
                                </div>
                                <button 
                                    onClick={() => updateQuantity(index, 1)}
                                    className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-l border-gray-300 dark:border-slate-800"
                                >
                                    <Plus size={8} strokeWidth={2} />
                                </button>
                            </div>
                        </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-600 italic border border-dashed border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-900/30">
               No instruments selected
            </div>
          )}
        </div>

        {/* + Add Button */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="border border-dashed border-gray-300 dark:border-slate-600 rounded-lg py-3 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-500 transition-all bg-gray-50 hover:bg-blue-50 dark:bg-slate-900/30 dark:hover:bg-slate-900 mt-auto group"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {instruments.length > 0 ? "+ Add More" : "+ Add"}
          </span>
        </div>
      </div>

      <InstrumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleInstrumentSave}
        strategyType={strategyType}
      />
    </>
  );
};

export default InstrumentSection;
