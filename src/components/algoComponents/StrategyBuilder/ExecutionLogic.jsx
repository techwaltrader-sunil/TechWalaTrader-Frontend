// // import React, { useState, useEffect, useRef } from 'react';
// // import { TRADE_DATA_ALGO } from '../../../data/AlogoTrade/tradeLogicAlgo'; // आपका पाथ यहाँ डालें

// // const ExecutionLogic = () => {
// //   // 🗄️ States for Step-by-Step Selection
// //   const [marketTrend, setMarketTrend] = useState(null);
// //   const [direction, setDirection] = useState(null);
// //   const [tradeType, setTradeType] = useState(null);
// //   const [setup, setSetup] = useState(null);
// //   const [entryTrigger, setEntryTrigger] = useState(null);
// //   const [exitLogic, setExitLogic] = useState(null);

// //   // 🧹 The Ghost State Killer (Auto-Reset Logic)
// //   const handleMarketTrend = (val) => {
// //     setMarketTrend(val);
// //   };

// //   const handleDirection = (val) => {
// //     setDirection(val);
// //   };

// //   const handleTradeType = (val) => {
// //     setTradeType(val);
// //     // Reset child states
// //     setSetup(null);
// //     setEntryTrigger(null);
// //     setExitLogic(null); 
// //   };

// //   const handleSetup = (val) => {
// //     setSetup(val);
// //     // Reset child state
// //     setEntryTrigger(null);
// //   };

// //   // 🎨 Helper Component for Buttons (To keep code clean)
// //   const OptionButton = ({ label, isSelected, onClick, disabled }) => (
// //     <button
// //       onClick={onClick}
// //       disabled={disabled}
// //       className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all duration-200 
// //       ${disabled ? 'cursor-not-allowed opacity-60 bg-gray-100 border-gray-200 text-gray-400' : 
// //         isSelected 
// //           ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
// //           : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
// //       }`}
// //     >
// //       {label}
// //     </button>
// //   );

// //   return (
// //     <div className="max-w-4xl mx-auto p-6 space-y-6">
      
// //       {/* 🟢 STEP 1: Market Trend */}
// //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-l-4 border-l-blue-500">
// //         <h3 className="text-gray-500 font-bold mb-3">1. Market Trend</h3>
// //         <div className="flex flex-wrap gap-3">
// //           {TRADE_DATA_ALGO.trends.map((item) => (
// //             <OptionButton 
// //               key={item} 
// //               label={item} 
// //               isSelected={marketTrend === item} 
// //               onClick={() => handleMarketTrend(item)} 
// //               disabled={false}
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       {/* 🟢 STEP 2: Direction */}
// //       <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-opacity duration-300 
// //         ${!marketTrend ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
// //         <h3 className="text-gray-500 font-bold mb-3">2. Direction</h3>
// //         <div className="flex flex-wrap gap-3">
// //           {TRADE_DATA_ALGO.directions.map((item) => (
// //             <OptionButton 
// //               key={item} 
// //               label={item} 
// //               isSelected={direction === item} 
// //               onClick={() => handleDirection(item)} 
// //               disabled={!marketTrend}
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       {/* 🟢 STEP 3: Trade Type & Setup */}
// //       <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-opacity duration-300 
// //         ${!direction ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
// //         <h3 className="text-gray-500 font-bold mb-3">3. Trade Type & Setup</h3>
// //         <div className="flex flex-wrap gap-3 mb-4">
// //           {TRADE_DATA_ALGO.tradeTypes.map((item) => (
// //             <OptionButton 
// //               key={item} 
// //               label={item} 
// //               isSelected={tradeType === item} 
// //               onClick={() => handleTradeType(item)} 
// //               disabled={!direction}
// //             />
// //           ))}
// //         </div>

// //         {/* Setup Sub-box (Appears only when Trade Type is selected) */}
// //         {tradeType && TRADE_DATA_ALGO.setups[tradeType] && (
// //           <div className="bg-gray-50 border border-gray-200 rounded-md p-4 animate-in fade-in slide-in-from-top-2">
// //             <p className="text-xs text-gray-500 mb-2">Select Setup:</p>
// //             <div className="flex flex-wrap gap-3">
// //               {TRADE_DATA_ALGO.setups[tradeType].map((item) => (
// //                 <OptionButton 
// //                   key={item} 
// //                   label={item} 
// //                   isSelected={setup === item} 
// //                   onClick={() => handleSetup(item)} 
// //                   disabled={false}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* 🟢 STEP 4: Entry Trigger */}
// //       <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-opacity duration-300 
// //         ${!setup ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
// //         <h3 className="text-gray-500 font-bold mb-3">4. Entry Trigger</h3>
// //         <div className="flex flex-wrap gap-3">
// //           {setup && TRADE_DATA_ALGO.entryRules[setup] ? (
// //              TRADE_DATA_ALGO.entryRules[setup].map((item) => (
// //               <OptionButton 
// //                 key={item} 
// //                 label={item} 
// //                 isSelected={entryTrigger === item} 
// //                 onClick={() => setEntryTrigger(item)} 
// //                 disabled={!setup}
// //               />
// //             ))
// //           ) : (
// //             <p className="text-sm text-gray-400 italic">Please select a Setup first.</p>
// //           )}
// //         </div>
// //       </div>

// //       {/* 🟢 STEP 5: Exit Logic */}
// //       <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-opacity duration-300 
// //         ${!entryTrigger ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
// //         <h3 className="text-gray-500 font-bold mb-3">5. Exit Logic</h3>
// //         <div className="flex flex-wrap gap-3">
// //           {tradeType && TRADE_DATA_ALGO.exitRules[tradeType] ? (
// //              TRADE_DATA_ALGO.exitRules[tradeType].map((item) => (
// //               <OptionButton 
// //                 key={item} 
// //                 label={item} 
// //                 isSelected={exitLogic === item} 
// //                 onClick={() => setExitLogic(item)} 
// //                 disabled={!entryTrigger}
// //               />
// //             ))
// //           ) : (
// //             <p className="text-sm text-gray-400 italic">Awaiting previous selections...</p>
// //           )}
// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default ExecutionLogic;





// import React, { useState, useEffect } from 'react';
// // ध्यान दें: नीचे दिए गए पाथ को अपने फोल्डर स्ट्रक्चर के हिसाब से एडजस्ट कर लें
// import { TRADE_DATA_ALGO } from '../../../data/AlogoTrade/tradeLogicAlgo'; 

// const ExecutionLogic = ({ activeLegIndex = 0, activeLegData, onSaveToLeg }) => {
//   // 🗄️ States for Step-by-Step Selection
//   const [marketTrend, setMarketTrend] = useState(null);
//   const [tradeType, setTradeType] = useState(null);
//   const [setup, setSetup] = useState(null);
//   const [entryTrigger, setEntryTrigger] = useState(null);
//   const [exitLogic, setExitLogic] = useState(null);

//   // 🔄 Two-Way Binding: Active Leg बदलने पर फॉर्म को ऑटो-फिल या रीसेट करना
//   useEffect(() => {
//     if (activeLegData && activeLegData.smcSetup) {
//       // Edit Mode: अगर लेग में पहले से SMC डेटा है, तो उसे स्टेट में भर दें
//       const { smcSetup } = activeLegData;
//       setMarketTrend(smcSetup.marketTrend || null);
//       setTradeType(smcSetup.tradeType || null);
//       setSetup(smcSetup.setup || null);
//       setEntryTrigger(smcSetup.entryTrigger || null);
//       setExitLogic(smcSetup.exitLogic || null);
//     } else {
//       // New Mode: अगर नया लेग है या डेटा नहीं है, तो फॉर्म खाली कर दें
//       setMarketTrend(null);
//       setTradeType(null);
//       setSetup(null);
//       setEntryTrigger(null);
//       setExitLogic(null);
//     }
//   }, [activeLegData]);

//   // 🧹 The Ghost State Killer (Auto-Reset Logic)
//   const handleMarketTrend = (val) => {
//     setMarketTrend(val);
//     // Reset downstream child states
//     setTradeType(null);
//     setSetup(null);
//     setEntryTrigger(null);
//     setExitLogic(null);
//   };

//   const handleTradeType = (val) => {
//     setTradeType(val);
//     setSetup(null);
//     setEntryTrigger(null);
//     setExitLogic(null); 
//   };

//   const handleSetup = (val) => {
//     setSetup(val);
//     setEntryTrigger(null);
//     setExitLogic(null);
//   };

//   // 🎨 Helper Component for Buttons
//   const OptionButton = ({ label, isSelected, onClick, disabled }) => (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all duration-200 
//       ${disabled ? 'cursor-not-allowed opacity-60 bg-gray-100 border-gray-200 text-gray-400' : 
//         isSelected 
//           ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
//           : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
//       }`}
//     >
//       {label}
//     </button>
//   );

//   // 💾 Save Logic & Button State Management
//   const handleSave = () => {
//     const smcData = {
//       marketTrend,
//       tradeType,
//       setup,
//       entryTrigger,
//       exitLogic
//     };
//     // यह फंक्शन पैरेंट कंपोनेंट को डेटा भेजेगा
//     if (onSaveToLeg) {
//       onSaveToLeg(activeLegIndex, smcData);
//     }
//   };

//   // यह चेक करने के लिए कि क्या फॉर्म का डेटा लेग के सेव्ड डेटा से अलग है (ताकि Update बटन दिखे)
//   const isEditMode = activeLegData?.smcSetup != null;
//   const isDataChanged = isEditMode && (
//     activeLegData.smcSetup.marketTrend !== marketTrend ||
//     activeLegData.smcSetup.tradeType !== tradeType ||
//     activeLegData.smcSetup.setup !== setup ||
//     activeLegData.smcSetup.entryTrigger !== entryTrigger ||
//     activeLegData.smcSetup.exitLogic !== exitLogic
//   );

//   // सेव बटन तभी इनेबल होगा जब सभी 4 स्टेप्स सिलेक्ट हो चुके हों
//   const isFormComplete = marketTrend && tradeType && setup && entryTrigger && exitLogic;

//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm flex flex-col h-full animate-in fade-in zoom-in duration-300">
      
//       <div className="flex-grow space-y-6">
//         {/* 🟢 STEP 1: Market Trend */}
//         <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 border-l-4 border-l-blue-500">
//           <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-3">1. Market Trend</h3>
//           <div className="flex flex-wrap gap-3">
//             {TRADE_DATA_ALGO.trends.map((item) => (
//               <OptionButton 
//                 key={item} 
//                 label={item} 
//                 isSelected={marketTrend === item} 
//                 onClick={() => handleMarketTrend(item)} 
//                 disabled={false}
//               />
//             ))}
//           </div>
//         </div>

//         {/* 🟢 STEP 2: Trade Type & Setup */}
//         <div className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 transition-opacity duration-300 
//           ${!marketTrend ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
//           <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-3">2. Trade Type & Setup</h3>
//           <div className="flex flex-wrap gap-3 mb-4">
//             {TRADE_DATA_ALGO.tradeTypes.map((item) => (
//               <OptionButton 
//                 key={item} 
//                 label={item} 
//                 isSelected={tradeType === item} 
//                 onClick={() => handleTradeType(item)} 
//                 disabled={!marketTrend}
//               />
//             ))}
//           </div>

//           {/* Setup Sub-box */}
//           {tradeType && TRADE_DATA_ALGO.setups[tradeType] && (
//             <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-4 animate-in fade-in slide-in-from-top-2">
//               <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select Setup:</p>
//               <div className="flex flex-wrap gap-3">
//                 {TRADE_DATA_ALGO.setups[tradeType].map((item) => (
//                   <OptionButton 
//                     key={item} 
//                     label={item} 
//                     isSelected={setup === item} 
//                     onClick={() => handleSetup(item)} 
//                     disabled={false}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* 🟢 STEP 3: Entry Trigger */}
//         <div className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 transition-opacity duration-300 
//           ${!setup ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
//           <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-3">3. Entry Trigger</h3>
//           <div className="flex flex-wrap gap-3">
//             {setup && TRADE_DATA_ALGO.entryRules[setup] ? (
//                TRADE_DATA_ALGO.entryRules[setup].map((item) => (
//                 <OptionButton 
//                   key={item} 
//                   label={item} 
//                   isSelected={entryTrigger === item} 
//                   onClick={() => setEntryTrigger(item)} 
//                   disabled={!setup}
//                 />
//               ))
//             ) : (
//               <p className="text-sm text-gray-400 italic">Please select a Setup first.</p>
//             )}
//           </div>
//         </div>

//         {/* 🟢 STEP 4: Exit Logic */}
//         <div className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 transition-opacity duration-300 
//           ${!entryTrigger ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
//           <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-3">4. Exit Logic</h3>
//           <div className="flex flex-wrap gap-3">
//             {tradeType && TRADE_DATA_ALGO.exitRules[tradeType] ? (
//                TRADE_DATA_ALGO.exitRules[tradeType].map((item) => (
//                 <OptionButton 
//                   key={item} 
//                   label={item} 
//                   isSelected={exitLogic === item} 
//                   onClick={() => setExitLogic(item)} 
//                   disabled={!entryTrigger}
//                 />
//               ))
//             ) : (
//               <p className="text-sm text-gray-400 italic">Awaiting previous selections...</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 🚀 BOTTOM RIGHT: Dynamic Save Button */}
//       <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-end">
//         <button 
//           onClick={handleSave}
//           disabled={!isFormComplete || (!isDataChanged && isEditMode)}
//           className={`px-8 py-3 rounded-lg font-bold tracking-wide transition-all duration-300 shadow-md flex items-center gap-2
//             ${!isFormComplete 
//               ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
//               : isEditMode && !isDataChanged
//                 ? 'bg-green-100 text-green-700 border border-green-300 cursor-default shadow-none'
//                 : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
//             }`}
//         >
//           {isEditMode 
//             ? (isDataChanged ? `Update Leg ${activeLegIndex + 1}` : `Leg ${activeLegIndex + 1} Saved ✓`) 
//             : `Add to Leg ${activeLegIndex + 1}`
//           }
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ExecutionLogic;




import React, { useState, useEffect } from 'react';
// ध्यान दें: नीचे दिए गए पाथ को अपने फोल्डर स्ट्रक्चर के हिसाब से एडजस्ट कर लें
import { TRADE_DATA_ALGO } from '../../../data/AlogoTrade/tradeLogicAlgo'; 

const ExecutionLogic = ({ activeLegIndex = 0, activeLegData, onSaveToLeg }) => {
  // 🗄️ States for Step-by-Step Selection
  const [marketTrend, setMarketTrend] = useState(null);
  const [tradeType, setTradeType] = useState(null);
  const [setup, setSetup] = useState(null);
  // 1. स्टेट को Array में बदल दिया गया है
  const [entryTriggers, setEntryTriggers] = useState([]); 
  const [exitLogic, setExitLogic] = useState(null);

  // 🔄 Two-Way Binding: Active Leg बदलने पर फॉर्म को ऑटो-फिल या रीसेट करना
  useEffect(() => {
    if (activeLegData && activeLegData.smcSetup) {
      // Edit Mode: अगर लेग में पहले से SMC डेटा है, तो उसे स्टेट में भर दें
      const { smcSetup } = activeLegData;
      setMarketTrend(smcSetup.marketTrend || null);
      setTradeType(smcSetup.tradeType || null);
      setSetup(smcSetup.setup || null);
      
      // 2. Array को हैंडल करने का लॉजिक (पुरानी स्ट्रिंग को भी एरे में बदल लेगा ताकि एरर ना आए)
      const savedTriggers = smcSetup.entryTriggers 
          ? smcSetup.entryTriggers 
          : (smcSetup.entryTrigger ? [smcSetup.entryTrigger] : []);
      setEntryTriggers(savedTriggers);
      
      setExitLogic(smcSetup.exitLogic || null);
    } else {
      // New Mode: अगर नया लेग है या डेटा नहीं है, तो फॉर्म खाली कर दें
      setMarketTrend(null);
      setTradeType(null);
      setSetup(null);
      setEntryTriggers([]); // 👈 खाली एरे
      setExitLogic(null);
    }
  }, [activeLegData]);

  // 🧹 The Ghost State Killer (Auto-Reset Logic)
  const handleMarketTrend = (val) => {
    setMarketTrend(val);
    setTradeType(null);
    setSetup(null);
    setEntryTriggers([]);
    setExitLogic(null);
  };

  const handleTradeType = (val) => {
    setTradeType(val);
    setSetup(null);
    setEntryTriggers([]);
    setExitLogic(null); 
  };

  const handleSetup = (val) => {
    setSetup(val);
    setEntryTriggers([]);
    setExitLogic(null);
  };

  // 3. नया Toggle Logic (मल्टी-सिलेक्शन के लिए)
  const handleEntryTriggerToggle = (val) => {
    setEntryTriggers(prev => {
      // अगर पहले से है, तो हटा दो। नहीं है, तो एरे में जोड़ दो।
      const newTriggers = prev.includes(val) 
        ? prev.filter(item => item !== val) 
        : [...prev, val];
      
      // जैसे ही एंट्री टाइप चेंज हो, एग्जिट लॉजिक को रिसेट कर दो (सुरक्षा के लिए)
      setExitLogic(null); 
      return newTriggers;
    });
  };

  // 🎨 Helper Component for Buttons
  const OptionButton = ({ label, isSelected, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all duration-200 
      ${disabled ? 'cursor-not-allowed opacity-60 bg-gray-100 border-gray-200 text-gray-400' : 
        isSelected 
          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
          : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      {label}
    </button>
  );

  // 💾 Save Logic & Button State Management
  const handleSave = () => {
    const smcData = {
      marketTrend,
      tradeType,
      setup,
      entryTriggers, // 👈 5. अब यह एरे सेव होगा
      exitLogic
    };
    // यह फंक्शन पैरेंट कंपोनेंट को डेटा भेजेगा
    if (onSaveToLeg) {
      onSaveToLeg(activeLegIndex, smcData);
    }
  };

  // Array को Compare करने के लिए Helper (ताकि Update बटन सही से काम करे)
  const isEditMode = activeLegData?.smcSetup != null;
  const savedTriggers = isEditMode ? (activeLegData.smcSetup.entryTriggers || [activeLegData.smcSetup.entryTrigger]) : [];
  
  // JSON.stringify से हम चेक कर रहे हैं कि एरे में कुछ बदलाव हुआ है या नहीं
  const isDataChanged = isEditMode && (
    activeLegData.smcSetup.marketTrend !== marketTrend ||
    activeLegData.smcSetup.tradeType !== tradeType ||
    activeLegData.smcSetup.setup !== setup ||
    JSON.stringify([...savedTriggers].sort()) !== JSON.stringify([...entryTriggers].sort()) ||
    activeLegData.smcSetup.exitLogic !== exitLogic
  );

  // सेव बटन तभी इनेबल होगा जब सभी 4 स्टेप्स सिलेक्ट हो चुके हों (और entryTriggers एरे खाली ना हो)
  const isFormComplete = marketTrend && tradeType && setup && entryTriggers.length > 0 && exitLogic;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      <div className="flex-grow space-y-6">
        {/* 🟢 STEP 1: Market Trend */}
        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 border-l-4 border-l-blue-500">
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-3">1. Market Trend</h3>
          <div className="flex flex-wrap gap-3">
            {TRADE_DATA_ALGO.trends.map((item) => (
              <OptionButton 
                key={item} 
                label={item} 
                isSelected={marketTrend === item} 
                onClick={() => handleMarketTrend(item)} 
                disabled={false}
              />
            ))}
          </div>
        </div>

        {/* 🟢 STEP 2: Trade Type & Setup */}
        <div className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 transition-opacity duration-300 
          ${!marketTrend ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-3">2. Trade Type & Setup</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {TRADE_DATA_ALGO.tradeTypes.map((item) => (
              <OptionButton 
                key={item} 
                label={item} 
                isSelected={tradeType === item} 
                onClick={() => handleTradeType(item)} 
                disabled={!marketTrend}
              />
            ))}
          </div>

          {/* Setup Sub-box */}
          {tradeType && TRADE_DATA_ALGO.setups[tradeType] && (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-4 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select Setup:</p>
              <div className="flex flex-wrap gap-3">
                {TRADE_DATA_ALGO.setups[tradeType].map((item) => (
                  <OptionButton 
                    key={item} 
                    label={item} 
                    isSelected={setup === item} 
                    onClick={() => handleSetup(item)} 
                    disabled={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🟢 STEP 3: Entry Trigger (Multi-Select Updated) */}
        <div className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 transition-opacity duration-300 
          ${!setup ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
          
          {/* 4. UI में Multi-Select बैज जोड़ा गया */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-500 dark:text-gray-400 font-bold">3. Entry Trigger</h3>
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Multi Select</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {setup && TRADE_DATA_ALGO.entryRules[setup] ? (
               TRADE_DATA_ALGO.entryRules[setup].map((item) => (
                <OptionButton 
                  key={item} 
                  label={item} 
                  // 4. यहाँ includes से चेक कर रहे हैं
                  isSelected={entryTriggers.includes(item)} 
                  onClick={() => handleEntryTriggerToggle(item)} 
                  disabled={!setup}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">Please select a Setup first.</p>
            )}
          </div>
        </div>

        {/* 🟢 STEP 4: Exit Logic */}
        <div className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg p-5 transition-opacity duration-300 
          ${entryTriggers.length === 0 ? 'opacity-50 pointer-events-none' : 'border-l-4 border-l-blue-500'}`}>
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-3">4. Exit Logic</h3>
          <div className="flex flex-wrap gap-3">
            {tradeType && TRADE_DATA_ALGO.exitRules[tradeType] ? (
               TRADE_DATA_ALGO.exitRules[tradeType].map((item) => (
                <OptionButton 
                  key={item} 
                  label={item} 
                  isSelected={exitLogic === item} 
                  onClick={() => setExitLogic(item)} 
                  disabled={entryTriggers.length === 0}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">Awaiting previous selections...</p>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 BOTTOM RIGHT: Dynamic Save Button */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={!isFormComplete || (!isDataChanged && isEditMode)}
          className={`px-8 py-3 rounded-lg font-bold tracking-wide transition-all duration-300 shadow-md flex items-center gap-2
            ${!isFormComplete 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
              : isEditMode && !isDataChanged
                ? 'bg-green-100 text-green-700 border border-green-300 cursor-default shadow-none'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
            }`}
        >
          {isEditMode 
            ? (isDataChanged ? `Update Leg ${activeLegIndex + 1}` : `Leg ${activeLegIndex + 1} Saved ✓`) 
            : `Add to Leg ${activeLegIndex + 1}`
          }
        </button>
      </div>

    </div>
  );
};

export default ExecutionLogic;