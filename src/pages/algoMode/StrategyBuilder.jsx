
// import React, { useState, useEffect } from "react";
// import { Zap, ArrowLeft, Loader2 } from "lucide-react"; 
// import { useNavigate, useLocation } from "react-router-dom"; 

// // ✅ Service Import
// import { createStrategy, updateStrategy } from '../../data/AlogoTrade/strategyService';

// // Components Import
// import StrategyTypeSection from "../../components/algoComponents/StrategyBuilder/StrategyTypeSection";
// import InstrumentSection from "../../components/algoComponents/StrategyBuilder/InstrumentSection";
// import OrderConfigSection from "../../components/algoComponents/StrategyBuilder/OrderConfigSection";
// import StrategyLegsSection from "../../components/algoComponents/StrategyBuilder/StrategyLegsSection";
// import RiskManagementSection from "../../components/algoComponents/StrategyBuilder/RiskManagementSection";
// import AdvanceFeaturesSection from "../../components/algoComponents/StrategyBuilder/AdvanceFeaturesSection";
// import EntryConditionSection from "../../components/algoComponents/StrategyBuilder/EntryConditionSection";
// import StrategyFooter from "../../components/algoComponents/StrategyBuilder/StrategyFooter";

// const StrategyBuilder = () => {
//   const navigate = useNavigate(); 
//   const location = useLocation();

//   // ✅ Safe Access to Edit Data
//   const incomingData = location.state?.strategyData;
//   const backendData = incomingData?.data || incomingData || null; 
//   const isEditing = !!incomingData;

//   // --- STATES ---
//   const [selectedStrategyType, setSelectedStrategyType] = useState(incomingData?.type || "Time Based");
//   const [instruments, setInstruments] = useState(backendData?.instruments || []);
//   const [strategyName, setStrategyName] = useState(incomingData?.name || "");
//   const [loading, setLoading] = useState(false); 

//   // 🔥 THE FIX: Edit mode me purana (Spot/Future) data load karo
//   const [underlyingType, setUnderlyingType] = useState(backendData?.config?.underlying || "Spot");
  
//   const [legs, setLegs] = useState(backendData?.legs && backendData.legs.length > 0 ? backendData.legs : [
//     { id: 1, action: "BUY", optionType: "Call", quantity: 65, expiry: "WEEKLY", strikeCriteria: "ATM pt", strikeType: "ATM", slType: "SL%", slValue: 30, tpType: "TP%", tpValue: 0 }
//   ]);

//   const [config, setConfig] = useState(backendData?.config || {
//     underlying: "Spot",
//     orderType: "MIS", 
//     days: ["MON", "TUE", "WED", "THU", "FRI"], 
//     interval: "1 min", 
//     transactionType: "Both Side", 
//     chartType: "Candle", 
//     cncEntryDays: 4, 
//     cncExitDays: 0,
//     startTime: "09:45",       // 🔥 THE FIX: Ab hamesha default save hoga!
//     squareOffTime: "15:15",    // 🔥 THE FIX: Square Off bhi!
//     nextDaySquareOff: "09:15" // 🔥 THE NEW FIX: BTST Default time
//   });

//   const [advanceSettings, setAdvanceSettings] = useState(backendData?.advanceSettings || {
//     moveSLToCost: false, exitAllOnSLTgt: false, prePunchSL: false, waitAndTrade: false, premiumDifference: false, reEntryExecute: false, trailSL: false
//   });

//   const [entrySettings, setEntrySettings] = useState(backendData?.entrySettings || {
//     useCombinedChart: false, useOptionsChart: false, entryConditions: []
//   });

//   // ✅ NEW: Risk Management State
//   const [riskSettings, setRiskSettings] = useState(backendData?.riskManagement || {
//       maxProfit: 0,
//       maxLoss: 0,
//       maxTradeCycle: 1,
//       noTradeAfter: "15:15",
//       profitTrailing: "No Trailing", // Radio button value
//       lockFixProfit: 0,
//       trailProfit: 0
//   });

//   // --- EDIT MODE FLAGS ---
//   const [isEditMode, setIsEditMode] = useState(isEditing);

//   const [editingId, setEditingId] = useState(incomingData?._id || incomingData?.id || null);

//   // --- FORCE DATA RELOAD ---
//   useEffect(() => {
//     if (isEditMode && backendData) {
//         setInstruments(backendData.instruments || []);
//         setSelectedStrategyType(incomingData.type || "Time Based");
        
//         // 🔥 THE FIX: InstrumentSection ke reset karne ke baad, yahan se wapas Data restore karo!
//         setUnderlyingType(backendData.config?.underlying || "Spot");

//         if(backendData.legs && backendData.legs.length > 0) {
//             setLegs(backendData.legs);
//         }
//     }
//   }, []);

//   // --- RESET EFFECTS ---
//   useEffect(() => {
//     if (!isEditMode) {
//         setAdvanceSettings({ moveSLToCost: false, exitAllOnSLTgt: false, prePunchSL: false, waitAndTrade: false, premiumDifference: false, reEntryExecute: false, trailSL: false });
//     }
//   }, [selectedStrategyType]);

//   // Combined Chart Automation
//   useEffect(() => {
//     if (entrySettings.useCombinedChart) {
//       if (legs.length === 1) {
//         const firstLeg = legs[0];
//         const newLeg = { ...firstLeg, id: Date.now(), optionType: firstLeg.optionType === 'Call' ? 'Put' : 'Call', longCondition: firstLeg.longCondition === 'CE' ? 'PE' : 'CE', shortCondition: firstLeg.shortCondition === 'PE' ? 'CE' : 'PE', action: firstLeg.action };
//         setLegs(prev => [...prev, newLeg]);
//       }
//     } else {
//       if (legs.length === 2 && !isEditMode) setLegs(prev => [prev[0]]);
//     }
//   }, [entrySettings.useCombinedChart]);

//   // Auto-Reset Transaction Type
//   useEffect(() => {
//     const isSpecialChart = entrySettings.useCombinedChart || entrySettings.useOptionsChart;
//     if (isSpecialChart && config.transactionType === 'Both Side') setConfig(prev => ({ ...prev, transactionType: 'Long' }));
//   }, [entrySettings.useCombinedChart, entrySettings.useOptionsChart, config.transactionType]);

//   // --- HANDLERS ---
//   const addLeg = (legToCopy = null) => {
//     const defaultLeg = { action: 'BUY', optionType: 'Call', quantity: instruments.length > 0 ? (instruments[0].lot || 1) : 1, expiry: 'WEEKLY', strikeCriteria: 'ATM pt', strikeType: 'ATM', slType: 'SL%', tpType: 'TP%', slValue: 0, tpValue: 0, priceMovement: 0, trailValue: 0, longCondition: 'CE', shortCondition: 'PE' };
//     const dataToUse = (legToCopy && legToCopy.action) ? legToCopy : defaultLeg;
//     const newLeg = { ...dataToUse, id: Date.now() };
//     setLegs([...legs, newLeg]);
//   };
//   const updateLeg = (id, field, value) => { setLegs(prevLegs => prevLegs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg)); };
//   const removeLeg = (id) => setLegs(legs.filter((l) => l.id !== id));
  
//   const isEquityOrFutureMode = selectedStrategyType === "Indicator Based" && instruments.length > 0 && (instruments[0].segment === "Equity" || instruments[0].segment === "Future");


//   // ✅ NEW SAVE LOGIC (Handles Create AND Update)
//   const handleSaveStrategy = async () => {
//     // 1. Validation 
//     if (!strategyName.trim()) { alert("⚠️ Please enter a Strategy Name!"); return; }
//     if (instruments.length === 0) { alert("⚠️ Please select at least one Instrument!"); return; }
//     if (!isEquityOrFutureMode && legs.length === 0) { alert("⚠️ Please add at least one Strategy Leg!"); return; }

//     setLoading(true);

//     // 🔥 THE FIX: Indicator Based Strategy me 'longCondition' se 'optionType' sync karein 🔥
//     const legsToSave = isEquityOrFutureMode ? [] : legs.map(leg => {
//         let updatedLeg = { ...leg };
        
//         if (selectedStrategyType === "Indicator Based") {
//             // User ne jo UI me chuna (PE ya CE), wahi asli Option Type ban jayega
//             updatedLeg.optionType = leg.longCondition === "PE" ? "Put" : "Call";
//         }
        
//         return updatedLeg;
//     });

//     const strategyPayload = {
//       name: strategyName,
//       type: selectedStrategyType,
//       status: "Inactive",
//       data: {
//           type: selectedStrategyType,
//           instruments: instruments,
//           legs: legsToSave, 
//           // 🔥 THE FIX: Payload bhejte waqt state se fresh 'underlying' add kardo
//           config: { ...config, underlying: underlyingType }, 
//           advanceSettings: advanceSettings,
//           entrySettings: entrySettings,
//           riskManagement: riskSettings 
//       }
//     };

//     try {
//       if (isEditMode) {
//           await updateStrategy(editingId, strategyPayload);
//           alert("✅ Strategy Updated Successfully!");
//       } else {
//           await createStrategy(strategyPayload);
//           alert("✅ Strategy Created Successfully!");
//       }
//       navigate("/strategies"); 
//     } catch (error) {
//       console.error("Save Error:", error);
//       alert("❌ Failed to save strategy.");
//     } finally {
//       setLoading(false); 
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 text-gray-900 dark:text-white min-h-screen bg-gray-100 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300 animate-in fade-in">
//       {/* HEADER */}
//       <div className="mx-auto border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex justify-between items-center transition-colors">
//         <div className="flex items-center gap-4">
//              {isEditMode && (
//                  <button onClick={() => navigate("/strategies")} className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-bold">
//                      <ArrowLeft size={16} /> Back
//                  </button>
//              )}
//              <h1 className="text-2xl font-bold flex items-center gap-2">
//                 {!isEditMode && <Zap className="text-blue-600 dark:text-blue-500" />} 
//                 {isEditMode ? "Edit Strategy" : "Strategy Builder"}
//              </h1>
//         </div>
//         {isEditMode && <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-gray-200 dark:border-slate-800">Editing: <span className="text-blue-600 dark:text-blue-400 font-bold">{strategyName}</span></span>}
//       </div>

//       <div className="mx-auto space-y-4">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
//             <div className="lg:col-span-6 space-y-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
//                     <StrategyTypeSection selected={selectedStrategyType} onSelect={setSelectedStrategyType} />
//                     <InstrumentSection isComingSoon={selectedStrategyType === "Price Action Based"} strategyType={selectedStrategyType} instruments={instruments} setInstruments={setInstruments} underlyingType={underlyingType} setUnderlyingType={setUnderlyingType} />
//                 </div>
                
//                 {!isEquityOrFutureMode && selectedStrategyType === "Time Based" && (
//                     <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={selectedStrategyType === "Price Action Based"} entrySettings={entrySettings} />
//                 )}
                
//                 {!isEquityOrFutureMode && selectedStrategyType === "Indicator Based" && (
//                     <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={false} entrySettings={entrySettings} />
//                 )}
//             </div>

//             <div className="lg:col-span-6 h-full">
//                 {isEquityOrFutureMode ? (
//                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
//                       <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={false} entrySettings={entrySettings} />
//                    </div>
//                 ) : (
//                     // <StrategyLegsSection legs={legs} addLeg={addLeg} updateLeg={updateLeg} removeLeg={removeLeg} isComingSoon={selectedStrategyType === 'Price Action Based'} strategyType={selectedStrategyType} instruments={instruments} advanceSettings={advanceSettings} entrySettings={entrySettings} />
//                     <StrategyLegsSection 
//                         config={config} // 🔥 बस ये ऐड करना था!
//                         legs={legs} 
//                         addLeg={addLeg} 
//                         updateLeg={updateLeg} 
//                         removeLeg={removeLeg} 
//                         isComingSoon={selectedStrategyType === 'Price Action Based'} 
//                         strategyType={selectedStrategyType} 
//                         instruments={instruments} 
//                         advanceSettings={advanceSettings} 
//                         entrySettings={entrySettings} 
//                         setEntrySettings={setEntrySettings} // 🔥 THE FIX: Ye Nayi line add karni hai
//                         setAdvanceSettings={setAdvanceSettings} // 🔥 YEH LINE ADD KARNI HAI
//                     />
                
//                 )}
//             </div>
//         </div>

        
//         {selectedStrategyType === "Indicator Based" && (
//             <EntryConditionSection 
//                 entrySettings={entrySettings} 
//                 setEntrySettings={setEntrySettings} 
//                 transactionType={config.transactionType} 
//             />
//         )}

//         {/* ✅ PASSING PROPS TO RISK MANAGEMENT */}
//         {selectedStrategyType === "Indicator Based" ? (
//             // 🔥 THE FIX: Faltu grid aur divs hata diye. Ab seedha component render hoga
//             // jo khud ke andar md:col-span-2 lagakar full width le lega!
//             <RiskManagementSection 
//                 riskSettings={riskSettings} 
//                 setRiskSettings={setRiskSettings} 
//                 isComingSoon={false} 
//                 strategyType={selectedStrategyType}
//             />
//         ) : (
//             <div className={`grid grid-cols-1 ${selectedStrategyType === "Time Based" ? 'lg:grid-cols-2 gap-6' : 'lg:grid-cols-1 gap-6'}`}>
//                 <RiskManagementSection 
//                     riskSettings={riskSettings} 
//                     setRiskSettings={setRiskSettings} 
//                     isComingSoon={false} 
//                     strategyType={selectedStrategyType}
//                 />
//                 {selectedStrategyType === "Time Based" && (<AdvanceFeaturesSection advanceSettings={advanceSettings} setAdvanceSettings={setAdvanceSettings} legs={legs} addLeg={addLeg} removeLeg={removeLeg}/>)}
//             </div>
//         )}

//         <StrategyFooter 
//             name={strategyName} 
//             setName={setStrategyName} 
//             onSave={handleSaveStrategy} 
//             isEditMode={isEditMode} 
//             loading={loading}
//         />
//       </div>
//     </div>
//   );
// };

// export default StrategyBuilder;



// import React, { useState, useEffect } from "react";
// import { Zap, ArrowLeft, Loader2 } from "lucide-react"; 
// import { useNavigate, useLocation } from "react-router-dom"; 

// // ✅ Service Import
// import { createStrategy, updateStrategy } from '../../data/AlogoTrade/strategyService';

// // Components Import
// import StrategyTypeSection from "../../components/algoComponents/StrategyBuilder/StrategyTypeSection";
// import InstrumentSection from "../../components/algoComponents/StrategyBuilder/InstrumentSection";
// import OrderConfigSection from "../../components/algoComponents/StrategyBuilder/OrderConfigSection";
// import StrategyLegsSection from "../../components/algoComponents/StrategyBuilder/StrategyLegsSection";
// import RiskManagementSection from "../../components/algoComponents/StrategyBuilder/RiskManagementSection";
// import AdvanceFeaturesSection from "../../components/algoComponents/StrategyBuilder/AdvanceFeaturesSection";
// import EntryConditionSection from "../../components/algoComponents/StrategyBuilder/EntryConditionSection";
// import StrategyFooter from "../../components/algoComponents/StrategyBuilder/StrategyFooter";

// // 🔥 NAYA COMPONENT IMPORT 🔥
// import PriceActionConditionSection from "../../components/algoComponents/StrategyBuilder/PriceActionConditionSection";

// const StrategyBuilder = () => {
//   const navigate = useNavigate(); 
//   const location = useLocation();

//   // ✅ Safe Access to Edit Data
//   const incomingData = location.state?.strategyData;
//   const backendData = incomingData?.data || incomingData || null; 
//   const isEditing = !!incomingData;

//   // --- STATES ---
//   const [selectedStrategyType, setSelectedStrategyType] = useState(incomingData?.type || "Time Based");
//   const [instruments, setInstruments] = useState(backendData?.instruments || []);
//   const [strategyName, setStrategyName] = useState(incomingData?.name || "");
//   const [loading, setLoading] = useState(false); 

//   // 🔥 THE FIX: Edit mode me purana (Spot/Future) data load karo
//   const [underlyingType, setUnderlyingType] = useState(backendData?.config?.underlying || "Spot");
  
//   const [legs, setLegs] = useState(backendData?.legs && backendData.legs.length > 0 ? backendData.legs : [
//     { id: 1, action: "BUY", optionType: "Call", quantity: 65, expiry: "WEEKLY", strikeCriteria: "ATM pt", strikeType: "ATM", slType: "SL%", slValue: 30, tpType: "TP%", tpValue: 0 }
//   ]);

//   const [config, setConfig] = useState(backendData?.config || {
//     underlying: "Spot",
//     orderType: "MIS", 
//     days: ["MON", "TUE", "WED", "THU", "FRI"], 
//     interval: "1 min", 
//     transactionType: "Both Side", 
//     chartType: "Candle", 
//     cncEntryDays: 4, 
//     cncExitDays: 0,
//     startTime: "09:45",       
//     squareOffTime: "15:15",    
//     nextDaySquareOff: "09:15" 
//   });

//   const [advanceSettings, setAdvanceSettings] = useState(backendData?.advanceSettings || {
//     moveSLToCost: false, exitAllOnSLTgt: false, prePunchSL: false, waitAndTrade: false, premiumDifference: false, reEntryExecute: false, trailSL: false
//   });

//   const [entrySettings, setEntrySettings] = useState(backendData?.entrySettings || {
//     useCombinedChart: false, useOptionsChart: false, entryConditions: []
//   });

//   // ✅ NEW: Risk Management State
//   const [riskSettings, setRiskSettings] = useState(backendData?.riskManagement || {
//       maxProfit: 0,
//       maxLoss: 0,
//       maxTradeCycle: 1,
//       noTradeAfter: "15:15",
//       profitTrailing: "No Trailing",
//       lockFixProfit: 0,
//       trailProfit: 0
//   });

//   // 🔥 NAYA STATE: Price Action / SMC Settings 🔥
//   const [priceActionSettings, setPriceActionSettings] = useState(backendData?.priceActionSettings || {
//       masterTimeframe: "15 min",
//       entryTimeframe: "1 min",
//       setupType: "BOS (Break of Structure)",
//       entryTrigger: "Candle Close",
//       volumeConfirmation: false
//   });

//   // --- EDIT MODE FLAGS ---
//   const [isEditMode, setIsEditMode] = useState(isEditing);
//   const [editingId, setEditingId] = useState(incomingData?._id || incomingData?.id || null);

//   // --- FORCE DATA RELOAD ---
//   useEffect(() => {
//     if (isEditMode && backendData) {
//         setInstruments(backendData.instruments || []);
//         setSelectedStrategyType(incomingData.type || "Time Based");
        
//         // InstrumentSection reset fix
//         setUnderlyingType(backendData.config?.underlying || "Spot");

//         if(backendData.legs && backendData.legs.length > 0) {
//             setLegs(backendData.legs);
//         }
//     }
//   }, [isEditMode, backendData, incomingData]);

//   // --- RESET EFFECTS ---
//   useEffect(() => {
//     if (!isEditMode) {
//         setAdvanceSettings({ moveSLToCost: false, exitAllOnSLTgt: false, prePunchSL: false, waitAndTrade: false, premiumDifference: false, reEntryExecute: false, trailSL: false });
//     }
//   }, [selectedStrategyType, isEditMode]);

//   // Combined Chart Automation
//   useEffect(() => {
//     if (entrySettings.useCombinedChart) {
//       if (legs.length === 1) {
//         const firstLeg = legs[0];
//         const newLeg = { ...firstLeg, id: Date.now(), optionType: firstLeg.optionType === 'Call' ? 'Put' : 'Call', longCondition: firstLeg.longCondition === 'CE' ? 'PE' : 'CE', shortCondition: firstLeg.shortCondition === 'PE' ? 'CE' : 'PE', action: firstLeg.action };
//         setLegs(prev => [...prev, newLeg]);
//       }
//     } else {
//       if (legs.length === 2 && !isEditMode) setLegs(prev => [prev[0]]);
//     }
//   }, [entrySettings.useCombinedChart, isEditMode, legs.length]); // Added dependencies to avoid warnings

//   // Auto-Reset Transaction Type
//   useEffect(() => {
//     const isSpecialChart = entrySettings.useCombinedChart || entrySettings.useOptionsChart;
//     if (isSpecialChart && config.transactionType === 'Both Side') setConfig(prev => ({ ...prev, transactionType: 'Long' }));
//   }, [entrySettings.useCombinedChart, entrySettings.useOptionsChart, config.transactionType]);

//   // --- HANDLERS ---
//   const addLeg = (legToCopy = null) => {
//     const defaultLeg = { action: 'BUY', optionType: 'Call', quantity: instruments.length > 0 ? (instruments[0].lot || 1) : 1, expiry: 'WEEKLY', strikeCriteria: 'ATM pt', strikeType: 'ATM', slType: 'SL%', tpType: 'TP%', slValue: 0, tpValue: 0, priceMovement: 0, trailValue: 0, longCondition: 'CE', shortCondition: 'PE' };
//     const dataToUse = (legToCopy && legToCopy.action) ? legToCopy : defaultLeg;
//     const newLeg = { ...dataToUse, id: Date.now() };
//     setLegs([...legs, newLeg]);
//   };
//   const updateLeg = (id, field, value) => { setLegs(prevLegs => prevLegs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg)); };
//   const removeLeg = (id) => setLegs(legs.filter((l) => l.id !== id));
  
//   const isEquityOrFutureMode = (selectedStrategyType === "Indicator Based" || selectedStrategyType === "Price Action Based") && instruments.length > 0 && (instruments[0].segment === "Equity" || instruments[0].segment === "Future");


//   // ✅ NEW SAVE LOGIC (Handles Create AND Update)
//   const handleSaveStrategy = async () => {
//     // 1. Validation 
//     if (!strategyName.trim()) { alert("⚠️ Please enter a Strategy Name!"); return; }
//     if (instruments.length === 0) { alert("⚠️ Please select at least one Instrument!"); return; }
//     if (!isEquityOrFutureMode && legs.length === 0) { alert("⚠️ Please add at least one Strategy Leg!"); return; }

//     setLoading(true);

//     // 🔥 THE FIX: Sync optionType
//     const legsToSave = isEquityOrFutureMode ? [] : legs.map(leg => {
//         let updatedLeg = { ...leg };
        
//         if (selectedStrategyType === "Indicator Based" || selectedStrategyType === "Price Action Based") {
//             // User ne jo UI me chuna (PE ya CE), wahi asli Option Type ban jayega
//             updatedLeg.optionType = leg.longCondition === "PE" ? "Put" : "Call";
//         }
        
//         return updatedLeg;
//     });

//     const strategyPayload = {
//       name: strategyName,
//       type: selectedStrategyType,
//       status: "Inactive",
//       data: {
//           type: selectedStrategyType,
//           instruments: instruments,
//           legs: legsToSave, 
//           config: { ...config, underlying: underlyingType }, 
//           advanceSettings: advanceSettings,
//           entrySettings: entrySettings,
//           // 🔥 NEW: Save Price Action Settings only if selected
          // priceActionSettings: selectedStrategyType === "Price Action Based" ? priceActionSettings : undefined,
          // riskManagement: riskSettings 
//       }
//     };

//     try {
//       if (isEditMode) {
//           await updateStrategy(editingId, strategyPayload);
//           alert("✅ Strategy Updated Successfully!");
//       } else {
//           await createStrategy(strategyPayload);
//           alert("✅ Strategy Created Successfully!");
//       }
//       navigate("/strategies"); 
//     } catch (error) {
//       console.error("Save Error:", error);
//       alert("❌ Failed to save strategy.");
//     } finally {
//       setLoading(false); 
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 text-gray-900 dark:text-white min-h-screen bg-gray-100 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300 animate-in fade-in">
//       {/* HEADER */}
//       <div className="mx-auto border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex justify-between items-center transition-colors">
//         <div className="flex items-center gap-4">
//              {isEditMode && (
//                  <button onClick={() => navigate("/strategies")} className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-bold">
//                      <ArrowLeft size={16} /> Back
//                  </button>
//              )}
//              <h1 className="text-2xl font-bold flex items-center gap-2">
//                 {!isEditMode && <Zap className="text-blue-600 dark:text-blue-500" />} 
//                 {isEditMode ? "Edit Strategy" : "Strategy Builder"}
//              </h1>
//         </div>
//         {isEditMode && <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-gray-200 dark:border-slate-800">Editing: <span className="text-blue-600 dark:text-blue-400 font-bold">{strategyName}</span></span>}
//       </div>

//       <div className="mx-auto space-y-4">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
//             <div className="lg:col-span-6 space-y-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
//                     <StrategyTypeSection selected={selectedStrategyType} onSelect={setSelectedStrategyType} />
//                     <InstrumentSection isComingSoon={false} strategyType={selectedStrategyType} instruments={instruments} setInstruments={setInstruments} underlyingType={underlyingType} setUnderlyingType={setUnderlyingType} />
//                 </div>
                
//                 {/* ⏰ Order Config Section */}
//                 {!isEquityOrFutureMode && selectedStrategyType === "Time Based" && (
//                     <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={false} entrySettings={entrySettings} />
//                 )}
                
//                 {!isEquityOrFutureMode && (selectedStrategyType === "Indicator Based" || selectedStrategyType === "Price Action Based") && (
//                     <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={false} entrySettings={entrySettings} />
//                 )}
//             </div>

//             <div className="lg:col-span-6 h-full">
//                 {isEquityOrFutureMode ? (
//                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
//                       <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={false} entrySettings={entrySettings} />
//                    </div>
//                 ) : (
//                     <StrategyLegsSection 
//                         config={config} 
//                         legs={legs} 
//                         addLeg={addLeg} 
//                         updateLeg={updateLeg} 
//                         removeLeg={removeLeg} 
//                         isComingSoon={false} 
//                         strategyType={selectedStrategyType} 
//                         instruments={instruments} 
//                         advanceSettings={advanceSettings} 
//                         entrySettings={entrySettings} 
//                         setEntrySettings={setEntrySettings} 
//                         setAdvanceSettings={setAdvanceSettings} 
//                     />
//                 )}
//             </div>
//         </div>

//         {/* 📉 Indicator Logic UI */}
//         {selectedStrategyType === "Indicator Based" && (
//             <EntryConditionSection 
//                 entrySettings={entrySettings} 
//                 setEntrySettings={setEntrySettings} 
//                 transactionType={config.transactionType} 
//             />
//         )}

//         {/* 📈 NEW: Price Action / SMC Logic UI */}
//         {selectedStrategyType === "Price Action Based" && (
//             <PriceActionConditionSection 
//                 priceActionSettings={priceActionSettings}
//                 setPriceActionSettings={setPriceActionSettings}
//             />
//         )}

//         {/* 🛡️ Risk Management & Advance Features */}
//         {selectedStrategyType === "Indicator Based" || selectedStrategyType === "Price Action Based" ? (
//             <RiskManagementSection 
//                 riskSettings={riskSettings} 
//                 setRiskSettings={setRiskSettings} 
//                 isComingSoon={false} 
//                 strategyType={selectedStrategyType}
//             />
//         ) : (
//             <div className={`grid grid-cols-1 ${selectedStrategyType === "Time Based" ? 'lg:grid-cols-2 gap-6' : 'lg:grid-cols-1 gap-6'}`}>
//                 <RiskManagementSection 
//                     riskSettings={riskSettings} 
//                     setRiskSettings={setRiskSettings} 
//                     isComingSoon={false} 
//                     strategyType={selectedStrategyType}
//                 />
//                 {selectedStrategyType === "Time Based" && (<AdvanceFeaturesSection advanceSettings={advanceSettings} setAdvanceSettings={setAdvanceSettings} legs={legs} addLeg={addLeg} removeLeg={removeLeg}/>)}
//             </div>
//         )}

//         <StrategyFooter 
//             name={strategyName} 
//             setName={setStrategyName} 
//             onSave={handleSaveStrategy} 
//             isEditMode={isEditMode} 
//             loading={loading}
//         />
//       </div>
//     </div>
//   );
// };

// export default StrategyBuilder;




import React, { useState, useEffect } from "react";
import { Zap, ArrowLeft, Loader2 } from "lucide-react"; 
import { useNavigate, useLocation } from "react-router-dom"; 

// ✅ Service Import
import { createStrategy, updateStrategy } from '../../data/AlogoTrade/strategyService';

// Components Import
import StrategyTypeSection from "../../components/algoComponents/StrategyBuilder/StrategyTypeSection";
import InstrumentSection from "../../components/algoComponents/StrategyBuilder/InstrumentSection";
import OrderConfigSection from "../../components/algoComponents/StrategyBuilder/OrderConfigSection";
import StrategyLegsSection from "../../components/algoComponents/StrategyBuilder/StrategyLegsSection";
import RiskManagementSection from "../../components/algoComponents/StrategyBuilder/RiskManagementSection";
import AdvanceFeaturesSection from "../../components/algoComponents/StrategyBuilder/AdvanceFeaturesSection";
import EntryConditionSection from "../../components/algoComponents/StrategyBuilder/EntryConditionSection";
import StrategyFooter from "../../components/algoComponents/StrategyBuilder/StrategyFooter";

import PriceActionConditionSection from "../../components/algoComponents/StrategyBuilder/PriceActionConditionSection";

const StrategyBuilder = () => {
  const navigate = useNavigate(); 
  const location = useLocation();

  // ✅ Safe Access to Edit Data
  const incomingData = location.state?.strategyData;
  const backendData = incomingData?.data || incomingData || null; 
  const isEditing = !!incomingData;

  // --- STATES ---
  const [selectedStrategyType, setSelectedStrategyType] = useState(incomingData?.type || "Time Based");
  const [instruments, setInstruments] = useState(backendData?.instruments || []);
  const [strategyName, setStrategyName] = useState(incomingData?.name || "");
  const [loading, setLoading] = useState(false); 

  // 🔥 THE FIX: Edit mode me purana (Spot/Future) data load karo
  const [underlyingType, setUnderlyingType] = useState(backendData?.config?.underlying || "Spot");

  const [priceActionSettings, setPriceActionSettings] = useState(backendData?.priceActionSettings || {
    masterTimeframe: "15 min",
    entryTimeframe: "1 min",
    setupType: "BOS (Break of Structure)",
    entryTrigger: "Candle Close",
    volumeConfirmation: false,
    startingTrend: "AUTO"
});
  
  const [legs, setLegs] = useState(backendData?.legs && backendData.legs.length > 0 ? backendData.legs : [
    { id: 1, action: "BUY", optionType: "Call", quantity: 65, expiry: "WEEKLY", strikeCriteria: "ATM pt", strikeType: "ATM", slType: "SL%", slValue: 30, tpType: "TP%", tpValue: 0 }
  ]);

  const [config, setConfig] = useState(backendData?.config || {
    underlying: "Spot",
    orderType: "MIS", 
    days: ["MON", "TUE", "WED", "THU", "FRI"], 
    interval: "1 min", 
    transactionType: "Both Side", 
    chartType: "Candle", 
    cncEntryDays: 4, 
    cncExitDays: 0,
    startTime: "09:45",       // 🔥 THE FIX: Ab hamesha default save hoga!
    squareOffTime: "15:15",    // 🔥 THE FIX: Square Off bhi!
    nextDaySquareOff: "09:15" // 🔥 THE NEW FIX: BTST Default time
  });

  const [advanceSettings, setAdvanceSettings] = useState(backendData?.advanceSettings || {
    moveSLToCost: false, exitAllOnSLTgt: false, prePunchSL: false, waitAndTrade: false, premiumDifference: false, reEntryExecute: false, trailSL: false
  });

  const [entrySettings, setEntrySettings] = useState(backendData?.entrySettings || {
    useCombinedChart: false, useOptionsChart: false, entryConditions: []
  });

  // ✅ NEW: Risk Management State
  const [riskSettings, setRiskSettings] = useState(backendData?.riskManagement || {
      maxProfit: 0,
      maxLoss: 0,
      maxTradeCycle: 1,
      noTradeAfter: "15:15",
      profitTrailing: "No Trailing", // Radio button value
      lockFixProfit: 0,
      trailProfit: 0
  });

  // --- EDIT MODE FLAGS ---
  const [isEditMode, setIsEditMode] = useState(isEditing);

  const [editingId, setEditingId] = useState(incomingData?._id || incomingData?.id || null);

  // --- FORCE DATA RELOAD ---
  useEffect(() => {
    if (isEditMode && backendData) {
        setInstruments(backendData.instruments || []);
        setSelectedStrategyType(incomingData.type || "Time Based");
        
        // 🔥 THE FIX: InstrumentSection ke reset karne ke baad, yahan se wapas Data restore karo!
        setUnderlyingType(backendData.config?.underlying || "Spot");

        if(backendData.legs && backendData.legs.length > 0) {
            setLegs(backendData.legs);
        }
    }
  }, []);

  // --- RESET EFFECTS ---
  useEffect(() => {
    if (!isEditMode) {
        setAdvanceSettings({ moveSLToCost: false, exitAllOnSLTgt: false, prePunchSL: false, waitAndTrade: false, premiumDifference: false, reEntryExecute: false, trailSL: false });
    }
  }, [selectedStrategyType]);

  // Combined Chart Automation
  useEffect(() => {
    if (entrySettings.useCombinedChart) {
      if (legs.length === 1) {
        const firstLeg = legs[0];
        const newLeg = { ...firstLeg, id: Date.now(), optionType: firstLeg.optionType === 'Call' ? 'Put' : 'Call', longCondition: firstLeg.longCondition === 'CE' ? 'PE' : 'CE', shortCondition: firstLeg.shortCondition === 'PE' ? 'CE' : 'PE', action: firstLeg.action };
        setLegs(prev => [...prev, newLeg]);
      }
    } else {
      if (legs.length === 2 && !isEditMode) setLegs(prev => [prev[0]]);
    }
  }, [entrySettings.useCombinedChart]);

  // Auto-Reset Transaction Type
  useEffect(() => {
    const isSpecialChart = entrySettings.useCombinedChart || entrySettings.useOptionsChart;
    if (isSpecialChart && config.transactionType === 'Both Side') setConfig(prev => ({ ...prev, transactionType: 'Long' }));
  }, [entrySettings.useCombinedChart, entrySettings.useOptionsChart, config.transactionType]);

  // --- HANDLERS ---
  const addLeg = (legToCopy = null) => {
    const defaultLeg = { action: 'BUY', optionType: 'Call', quantity: instruments.length > 0 ? (instruments[0].lot || 1) : 1, expiry: 'WEEKLY', strikeCriteria: 'ATM pt', strikeType: 'ATM', slType: 'SL%', tpType: 'TP%', slValue: 0, tpValue: 0, priceMovement: 0, trailValue: 0, longCondition: 'CE', shortCondition: 'PE' };
    const dataToUse = (legToCopy && legToCopy.action) ? legToCopy : defaultLeg;
    const newLeg = { ...dataToUse, id: Date.now() };
    setLegs([...legs, newLeg]);
  };
  const updateLeg = (id, field, value) => { setLegs(prevLegs => prevLegs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg)); };
  const removeLeg = (id) => setLegs(legs.filter((l) => l.id !== id));
  
  const isEquityOrFutureMode = (selectedStrategyType === "Indicator Based" || selectedStrategyType === "Price Action Based") && instruments.length > 0 && (instruments[0].segment === "Equity" || instruments[0].segment === "Future");

  // ✅ NEW SAVE LOGIC (Handles Create AND Update)
  const handleSaveStrategy = async () => {
    // 1. Validation 
    if (!strategyName.trim()) { alert("⚠️ Please enter a Strategy Name!"); return; }
    if (instruments.length === 0) { alert("⚠️ Please select at least one Instrument!"); return; }
    if (!isEquityOrFutureMode && legs.length === 0) { alert("⚠️ Please add at least one Strategy Leg!"); return; }

    setLoading(true);

    // 🔥 THE FIX: Indicator Based Strategy me 'longCondition' se 'optionType' sync karein 🔥
    const legsToSave = isEquityOrFutureMode ? [] : legs.map(leg => {
        let updatedLeg = { ...leg };
        
        if (selectedStrategyType === "Indicator Based") {
            // User ne jo UI me chuna (PE ya CE), wahi asli Option Type ban jayega
            updatedLeg.optionType = leg.longCondition === "PE" ? "Put" : "Call";
        }
        
        return updatedLeg;
    });

    const strategyPayload = {
      name: strategyName,
      type: selectedStrategyType,
      status: "Inactive",
      data: {
          type: selectedStrategyType,
          instruments: instruments,
          legs: legsToSave, 
          // 🔥 THE FIX: Payload bhejte waqt state se fresh 'underlying' add kardo
          config: { ...config, underlying: underlyingType }, 
          advanceSettings: advanceSettings,
          entrySettings: entrySettings,
          riskManagement: riskSettings, 
          priceActionSettings: selectedStrategyType === "Price Action Based" ? priceActionSettings : undefined,
          
      }
    };

    try {
      if (isEditMode) {
          await updateStrategy(editingId, strategyPayload);
          alert("✅ Strategy Updated Successfully!");
      } else {
          await createStrategy(strategyPayload);
          alert("✅ Strategy Created Successfully!");
      }
      navigate("/strategies"); 
    } catch (error) {
      console.error("Save Error:", error);
      alert("❌ Failed to save strategy.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="p-4 md:p-6 text-gray-900 dark:text-white min-h-screen bg-gray-100 dark:bg-slate-950 font-sans pb-24 transition-colors duration-300 animate-in fade-in">
      {/* HEADER */}
      <div className="mx-auto border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-4">
             {isEditMode && (
                 <button onClick={() => navigate("/strategies")} className="text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-bold">
                     <ArrowLeft size={16} /> Back
                 </button>
             )}
             <h1 className="text-2xl font-bold flex items-center gap-2">
                {!isEditMode && <Zap className="text-blue-600 dark:text-blue-500" />} 
                {isEditMode ? "Edit Strategy" : "Strategy Builder"}
             </h1>
        </div>
        {isEditMode && <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 px-3 py-1 rounded border border-gray-200 dark:border-slate-800">Editing: <span className="text-blue-600 dark:text-blue-400 font-bold">{strategyName}</span></span>}
      </div>

      <div className="mx-auto space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <StrategyTypeSection selected={selectedStrategyType} onSelect={setSelectedStrategyType} />
                    <InstrumentSection isComingSoon={false} strategyType={selectedStrategyType} instruments={instruments} setInstruments={setInstruments} underlyingType={underlyingType} setUnderlyingType={setUnderlyingType} />
                </div>
                
                {!isEquityOrFutureMode && selectedStrategyType === "Time Based" && (
                    <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={selectedStrategyType === "Price Action Based"} entrySettings={entrySettings} />
                )}
                
                {!isEquityOrFutureMode && (selectedStrategyType === "Indicator Based" || selectedStrategyType === "Price Action Based") && (
                    <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={false} entrySettings={entrySettings} />
                )}
            </div>

            <div className="lg:col-span-6 h-full">
                {isEquityOrFutureMode ? (
                   <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <OrderConfigSection config={config} setConfig={setConfig} strategyType={selectedStrategyType} isComingSoon={false} entrySettings={entrySettings} />
                   </div>
                ) : (
                    // <StrategyLegsSection legs={legs} addLeg={addLeg} updateLeg={updateLeg} removeLeg={removeLeg} isComingSoon={selectedStrategyType === 'Price Action Based'} strategyType={selectedStrategyType} instruments={instruments} advanceSettings={advanceSettings} entrySettings={entrySettings} />
                    <StrategyLegsSection 
                        config={config} 
                        legs={legs} 
                        addLeg={addLeg} 
                        updateLeg={updateLeg} 
                        removeLeg={removeLeg} 
                        isComingSoon={false} 
                        strategyType={selectedStrategyType} 
                        instruments={instruments} 
                        advanceSettings={advanceSettings} 
                        entrySettings={entrySettings} 
                        setEntrySettings={setEntrySettings} 
                        setAdvanceSettings={setAdvanceSettings}
                    />
                
                )}
            </div>
        </div>

        
        {selectedStrategyType === "Indicator Based" && (
            <EntryConditionSection 
                entrySettings={entrySettings} 
                setEntrySettings={setEntrySettings} 
                transactionType={config.transactionType} 
            />
        )}

        {/* 📈 NEW: Price Action / SMC Logic UI */}
        {selectedStrategyType === "Price Action Based" && (
            <PriceActionConditionSection 
                priceActionSettings={priceActionSettings}
                setPriceActionSettings={setPriceActionSettings}
            />
        )}

        {/* ✅ PASSING PROPS TO RISK MANAGEMENT */}
        {selectedStrategyType === "Indicator Based" || selectedStrategyType === "Price Action Based" ? (
            <RiskManagementSection 
                riskSettings={riskSettings} 
                setRiskSettings={setRiskSettings} 
                isComingSoon={false} 
                strategyType={selectedStrategyType}
            />
        ) : (
            <div className={`grid grid-cols-1 ${selectedStrategyType === "Time Based" ? 'lg:grid-cols-2 gap-6' : 'lg:grid-cols-1 gap-6'}`}>
                <RiskManagementSection 
                    riskSettings={riskSettings} 
                    setRiskSettings={setRiskSettings} 
                    isComingSoon={false} 
                    strategyType={selectedStrategyType}
                />
                {selectedStrategyType === "Time Based" && (<AdvanceFeaturesSection advanceSettings={advanceSettings} setAdvanceSettings={setAdvanceSettings} legs={legs} addLeg={addLeg} removeLeg={removeLeg}/>)}
            </div>
        )}

        <StrategyFooter 
            name={strategyName} 
            setName={setStrategyName} 
            onSave={handleSaveStrategy} 
            isEditMode={isEditMode} 
            loading={loading}
        />
      </div>
    </div>
  );
};

export default StrategyBuilder;
