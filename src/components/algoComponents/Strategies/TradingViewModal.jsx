
// import React, { useState } from "react";
// import {
//   X,
//   Copy,
//   Check,
//   TrendingUp,
//   TrendingDown,
//   Webhook,
//   LogOut,
//   XCircle,
//   Trash2,
//   Lock,
//   ChevronLeft,
//   Lightbulb,
//   ChevronRight,
// } from "lucide-react";

// import step1Img from "../../../assets/TradingViewSetup/step 1.png";
// import step2Img from "../../../assets/TradingViewSetup/step 2.png";
// import step3Img from "../../../assets/TradingViewSetup/step 3.png";

// const TradingViewModal = ({ isOpen, onClose, strategy, onSave, onRemove }) => {
//   const [selectedAlertType, setSelectedAlertType] = useState(null);
//   const [copiedField, setCopiedField] = useState(null);
//   const [activeGuideStep, setActiveGuideStep] = useState(0);

//   if (!isOpen || !strategy) return null;

//   // --- LOGIC ENGINE ---
//   const savedAlerts = strategy.configuredAlerts || [];

//   const isOptionDisabled = (type) => {
//     if (type === "LONG_EXIT" && !savedAlerts.includes("LONG_ENTRY")) return true;
//     if (type === "SHORT_EXIT" && !savedAlerts.includes("SHORT_ENTRY")) return true;
//     return false;
//   };

//   const handleOptionClick = (type) => {
//     if (savedAlerts.includes(type)) return;
//     if (isOptionDisabled(type)) return;
//     selectedAlertType === type ? setSelectedAlertType(null) : setSelectedAlertType(type);
//   };

//   const isSaveActive = !!selectedAlertType && !savedAlerts.includes(selectedAlertType);

//   // --- JSON GENERATION ---
//   const getJsonData = () => {
//     if (!isSaveActive) return "";
//     let action = "ENTRY";
//     let direction = "LONG";
//     switch (selectedAlertType) {
//       case "LONG_ENTRY": action = "ENTRY"; direction = "LONG"; break;
//       case "LONG_EXIT": action = "EXIT"; direction = "LONG"; break;
//       case "SHORT_ENTRY": action = "ENTRY"; direction = "SHORT"; break;
//       case "SHORT_EXIT": action = "EXIT"; direction = "SHORT"; break;
//       default: break;
//     }

//     const symbolName = strategy.data.instruments?.[0]?.name || strategy.symbol || "NIFTY";
//     const qty = strategy.legs?.[0]?.qty || 1;

//     console.log(symbolName)

//     const data = {
//       strategy_id: strategy.id,
//       symbol: symbolName,
//       action: action,
//       transaction_type: direction,
//       quantity: qty,
//       product_type: strategy.data.config?.orderType || "MIS",
//       message: `Trigger ${direction} ${action} for ${strategy.name}`,
//     };
//     return JSON.stringify(data, null, 4);
//   };

//   const jsonMessage = getJsonData();
//   const placeholderMessage = JSON.stringify({ info: "Please select an alert type above to generate JSON." }, null, 4);
//   const webhookUrl = `https://api.your-app.com/webhook/v1/trigger/${strategy.id}`;

//   const guideSteps = [
//     { id: 1, title: "Open Alert", desc: "Click 'Create Alert' in TV.", img: step1Img },
//     { id: 2, title: "Paste JSON", desc: "Paste JSON in 'Message' box.", img: step2Img },
//     { id: 3, title: "Webhook URL", desc: "Paste Webhook URL in settings.", img: step3Img },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-end sm:items-center z-50 backdrop-blur-sm animate-in fade-in py-0 sm:py-5 transition-colors">
      
//       {/* ✅ MAIN CONTAINER: Flex Column for proper layout */}
//       <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 w-full max-w-[700px] sm:rounded-xl rounded-t-2xl shadow-2xl relative flex flex-col h-[85vh] sm:h-[90vh] max-h-[800px] mx-0 sm:mx-4 transition-colors duration-300">
        
//         {/* HEADER (Fixed Top) */}
//         <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 sm:rounded-t-xl rounded-t-2xl shrink-0 transition-colors">
//           <div>
//             <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
//               <Webhook className="text-yellow-500 shrink-0 mt-0.5" size={18} />
//               Connect TradingView Alert
//             </h2>
//             <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
//               {savedAlerts.length > 0 ? `${savedAlerts.length} alerts active.` : "Configure your first alert."}
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             {savedAlerts.length > 0 && (
//               <button onClick={onRemove} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold mr-2">
//                 <Trash2 size={14} className="sm:mr-1" /> <span className="hidden sm:inline">Reset All</span>
//               </button>
//             )}
//             <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* CONTENT (Scrollable Middle Area) */}
//         <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 sm:space-y-8 flex-1">
          
//           {/* 1. ALERT TYPE GRID */}
//           <div>
//             <SectionHeader number="1" title="Choose Your Alert Type" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {["LONG_ENTRY", "LONG_EXIT", "SHORT_ENTRY", "SHORT_EXIT"].map((type) => (
//                 <AlertOption
//                   key={type}
//                   type={type}
//                   icon={getIconForType(type)}
//                   isSelected={selectedAlertType === type}
//                   isSaved={savedAlerts.includes(type)}
//                   isDisabled={isOptionDisabled(type)}
//                   onClick={() => handleOptionClick(type)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* 2. JSON COPY SECTION */}
//           <div className="transition-all">
//             <SectionHeader number="2" title="Copy Message Body (JSON)" />
//             <div className={`bg-gray-50 dark:bg-slate-950 border rounded-lg overflow-hidden group transition-colors ${isSaveActive ? "border-blue-500 dark:border-slate-700" : "border-gray-200 dark:border-slate-800/50"}`}>
//               <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-slate-800 bg-gray-100/50 dark:bg-slate-900/50">
//                 <span className="text-[10px] text-gray-500 dark:text-gray-500 font-mono">JSON Message</span>
//                 <button
//                   onClick={() => {
//                     if (isSaveActive) {
//                       navigator.clipboard.writeText(jsonMessage);
//                       setCopiedField("json");
//                       setTimeout(() => setCopiedField(null), 2000);
//                     }
//                   }}
//                   disabled={!isSaveActive}
//                   className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold transition-all ${isSaveActive ? (copiedField === "json" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 shadow-sm") : "bg-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
//                 >
//                   {copiedField === "json" ? <Check size={12} /> : <Copy size={12} />} {copiedField === "json" ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//               <div className="p-3">
//                 <textarea readOnly value={isSaveActive ? jsonMessage : placeholderMessage} className={`w-full h-24 bg-transparent text-[11px] font-mono resize-none focus:outline-none custom-scrollbar transition-colors ${isSaveActive ? "text-blue-600 dark:text-blue-300" : "text-gray-400 dark:text-gray-600 italic select-none"}`} />
//               </div>
//             </div>
//           </div>

//           {/* 3. WEBHOOK */}
//           <div>
//             <SectionHeader number="3" title="Copy Webhook URL" />
//             <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg p-1 flex items-center">
//               <div className="flex-1 px-3 py-2 overflow-hidden">
//                 <p className="text-[11px] text-gray-600 dark:text-gray-400 truncate font-mono">{webhookUrl}</p>
//               </div>
//               <button
//                 onClick={() => {
//                   navigator.clipboard.writeText(webhookUrl);
//                   setCopiedField("url");
//                   setTimeout(() => setCopiedField(null), 2000);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${copiedField === "url" ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
//               >
//                 {copiedField === "url" ? <Check size={14} /> : <Copy size={14} />} {copiedField === "url" ? "Copied" : "Copy URL"}
//               </button>
//             </div>
//           </div>

//           {/* 4. SETUP GUIDE */}
//           <div>
//             <SectionHeader number="4" title="Setup in TradingView" />
//             <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors">
//               <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto bg-white dark:bg-slate-900">
//                 {guideSteps.map((step, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setActiveGuideStep(idx)}
//                     className={`flex-1 py-3 px-2 text-[10px] font-bold text-center transition-colors border-b-2 whitespace-nowrap ${activeGuideStep === idx ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "text-gray-500 dark:text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
//                   >
//                     {step.title}
//                   </button>
//                 ))}
//               </div>
//               <div className="p-4 bg-gray-50 dark:bg-slate-950 transition-colors">
//                 <div className="flex justify-between items-center mb-3">
//                   <p className="text-xs text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
//                     <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{activeGuideStep + 1}</span>
//                     {guideSteps[activeGuideStep].desc}
//                   </p>
//                   <div className="flex gap-1">
//                     <button disabled={activeGuideStep === 0} onClick={() => setActiveGuideStep((prev) => Math.max(0, prev - 1))} className="p-1 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30"><ChevronLeft size={14} /></button>
//                     <button disabled={activeGuideStep === guideSteps.length - 1} onClick={() => setActiveGuideStep((prev) => Math.min(guideSteps.length - 1, prev + 1))} className="p-1 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30"><ChevronRight size={14} /></button>
//                   </div>
//                 </div>
//                 <div className="rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-black flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
//                   <img src={guideSteps[activeGuideStep].img} alt={`Step ${activeGuideStep + 1}`} className="w-full h-auto object-contain max-h-[250px] sm:max-h-[350px]" onError={(e) => { e.target.style.display = "none"; }} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* TIPS */}
//           <div className="bg-yellow-50 dark:bg-slate-950 border border-yellow-500/20 rounded-lg p-3 flex gap-3 items-start transition-colors">
//             <Lightbulb className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" size={18} />
//             <div>
//               <h4 className="text-xs font-bold text-yellow-700 dark:text-yellow-500 mb-1">Quick Tips</h4>
//               <ul className="text-[11px] text-yellow-800/80 dark:text-gray-400 space-y-1 list-disc pl-3">
//                 <li>Ensure the <b>Webhook URL</b> field in TradingView is checked.</li>
//                 <li>Do not modify the JSON keys.</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* FOOTER (Fixed Bottom) */}
//         <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 sm:rounded-b-xl shrink-0 transition-colors">
//           <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
          
//           <button
//             onClick={() => {
//                 if (isSaveActive) {
//                     onSave(selectedAlertType);
//                     onClose(); 
//                 }
//             }}
//             disabled={!isSaveActive}
//             className={`px-6 py-2.5 text-xs font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 ${isSaveActive ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 cursor-pointer" : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-slate-700"}`}
//           >
//             <Check size={14} /> Save <span className="hidden sm:inline">& Connect Alert</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- HELPER COMPONENTS ---
// const SectionHeader = ({ number, title }) => (
//   <div className="flex items-center gap-2 mb-3">
//     <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{number}</span>
//     <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{title}</h3>
//   </div>
// );

// const getIconForType = (type) => {
//   switch (type) {
//     case "LONG_ENTRY": return <TrendingUp className="text-green-500 dark:text-green-400" size={18} />;
//     case "LONG_EXIT": return <LogOut className="text-blue-500 dark:text-blue-400" size={18} />;
//     case "SHORT_ENTRY": return <TrendingDown className="text-red-500 dark:text-red-400" size={18} />;
//     case "SHORT_EXIT": return <XCircle className="text-orange-500 dark:text-orange-400" size={18} />;
//     default: return null;
//   }
// };

// const AlertOption = ({ type, icon, isSelected, isSaved, isDisabled, onClick }) => {
//   const title = type.replace("_", " ");
//   let containerClass = "rounded-lg p-3 border transition-all flex items-center gap-3 relative overflow-hidden group ";
//   let iconBgClass = "";
//   let textClass = "";

//   if (isDisabled) {
//     containerClass += "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800";
//     iconBgClass = "bg-gray-200 dark:bg-slate-800";
//     textClass = "text-gray-400 dark:text-gray-600";
//   } else if (isSaved) {
//     containerClass += "bg-white dark:bg-slate-950 border-green-500/50 cursor-default shadow-[0_0_10px_rgba(34,197,94,0.1)]";
//     iconBgClass = "bg-green-100 dark:bg-green-500/10";
//     textClass = "text-green-600 dark:text-green-400";
//   } else if (isSelected) {
//     containerClass += "bg-blue-50 dark:bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/50 cursor-pointer";
//     iconBgClass = "bg-blue-100 dark:bg-blue-500/20";
//     textClass = "text-blue-700 dark:text-white";
//   } else {
//     containerClass += "bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 cursor-pointer";
//     iconBgClass = "bg-gray-100 dark:bg-slate-800";
//     textClass = "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300";
//   }

//   return (
//     <div onClick={onClick} className={containerClass}>
//       {isSaved && <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-green-500/50"><Check size={10} strokeWidth={4} /></div>}
//       {isDisabled && <div className="absolute top-3 right-3 text-gray-400 dark:text-gray-600"><Lock size={12} /></div>}
//       <div className={`p-1.5 rounded ${iconBgClass}`}>{icon}</div>
//       <div>
//         <span className={`text-xs font-bold ${textClass}`}>{title}</span>
//         {isDisabled && <p className="text-[9px] text-gray-400 dark:text-gray-600 leading-tight">Entry First</p>}
//         {isSaved && <p className="text-[9px] text-green-600 dark:text-green-500/70 leading-tight">Configured</p>}
//       </div>
//     </div>
//   );
// };

// export default TradingViewModal;


import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Webhook,
  LogOut,
  XCircle,
  Trash2,
  Lock,
  ChevronLeft,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

import step1Img from "../../../assets/TradingViewSetup/step 1.png";
import step2Img from "../../../assets/TradingViewSetup/step 2.png";
import step3Img from "../../../assets/TradingViewSetup/step 3.png";

const TradingViewModal = ({ isOpen, onClose, strategy, onSave, onRemove }) => {
  const [selectedAlertType, setSelectedAlertType] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [activeGuideStep, setActiveGuideStep] = useState(0);

  if (!isOpen || !strategy) return null;

  // --- LOGIC ENGINE ---
  const savedAlerts = strategy.configuredAlerts || [];

  const isOptionDisabled = (type) => {
    if (type === "LONG_EXIT" && !savedAlerts.includes("LONG_ENTRY")) return true;
    if (type === "SHORT_EXIT" && !savedAlerts.includes("SHORT_ENTRY")) return true;
    return false;
  };

  const handleOptionClick = (type) => {
    if (savedAlerts.includes(type)) return;
    if (isOptionDisabled(type)) return;
    selectedAlertType === type ? setSelectedAlertType(null) : setSelectedAlertType(type);
  };

  const isSaveActive = !!selectedAlertType && !savedAlerts.includes(selectedAlertType);

  // --- 🔥 JSON GENERATION (UPDATED) 🔥 ---
  const getJsonData = () => {
    if (!isSaveActive) return "";
    let action = "ENTRY";
    let direction = "LONG";
    
    switch (selectedAlertType) {
      case "LONG_ENTRY": action = "ENTRY"; direction = "LONG"; break;
      case "LONG_EXIT": action = "EXIT"; direction = "LONG"; break;
      case "SHORT_ENTRY": action = "ENTRY"; direction = "SHORT"; break;
      case "SHORT_EXIT": action = "EXIT"; direction = "SHORT"; break;
      default: break;
    }

    

    // Dynamic data extraction with fallback to your specific requirements
    // const symbolName = strategy.data?.instruments?.[0]?.name || strategy.symbol ;
    let rawSymbolName = strategy.data?.instruments?.[0]?.name || strategy.symbol || "";
    
    // ✅ THE FIX: Dhan API ke hisab se Exact Symbol Mapping karein
    let finalSymbolName = rawSymbolName.toUpperCase();
    if (finalSymbolName === "NIFTY 50") finalSymbolName = "NIFTY";
    if (finalSymbolName === "NIFTY BANK") finalSymbolName = "BANKNIFTY";
    if (finalSymbolName === "NIFTY FIN SERVICE" || finalSymbolName === "FIN NIFTY") finalSymbolName = "FINNIFTY";


    const qty = strategy.legs?.[0]?.qty;
    const strikePrice = strategy.legs?.[0]?.strike;
    // const optType = strategy.legs?.[0]?.optionType;

    // ✅ THE FIX: optionType ke alag-alag naam (keys) check karega
    const optType = strategy.legs?.[0]?.optionType 
                 || strategy.legs?.[0]?.type 
                 || strategy.legs?.[0]?.right 
                 || strategy.legs?.[0]?.option_type;

    // ✅ Naya JSON Format
    const data = {
      secret_token: "TradeMaster@Algo2026",
      strategy_id: strategy.id || "",
      symbol: finalSymbolName,
      // अगर strikePrice है तो स्ट्रिंग में बदलो, नहीं तो खाली छोड़ दो
      strike: strikePrice ? strikePrice.toString() : "", 
      option_type: optType || "",
      action: action,
      transaction_type: direction,
      // अगर qty है तो Number में बदलो, नहीं तो 0 कर दो
      quantity: qty ? Number(qty) : 0, 
      product_type: strategy.data?.config?.orderType
    };
    
    return JSON.stringify(data, null, 4);
  };

  const jsonMessage = getJsonData();
  const placeholderMessage = JSON.stringify({ info: "Please select an alert type above to generate JSON." }, null, 4);
  
  // ✅ Webhook URL ko bhi Live Backend ke hisab se set kar diya hai
  const webhookUrl = `${import.meta.env.VITE_API_URL || 'https://techwalatrader-algobackend.onrender.com'}/api/webhook/tv`;

  const guideSteps = [
    { id: 1, title: "Open Alert", desc: "Click 'Create Alert' in TV.", img: step1Img },
    { id: 2, title: "Paste JSON", desc: "Paste JSON in 'Message' box.", img: step2Img },
    { id: 3, title: "Webhook URL", desc: "Paste Webhook URL in settings.", img: step3Img },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-end sm:items-center z-50 backdrop-blur-sm animate-in fade-in py-0 sm:py-5 transition-colors">
      
      {/* MAIN CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 w-full max-w-[700px] sm:rounded-xl rounded-t-2xl shadow-2xl relative flex flex-col h-[85vh] sm:h-[90vh] max-h-[800px] mx-0 sm:mx-4 transition-colors duration-300">
        
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 sm:rounded-t-xl rounded-t-2xl shrink-0 transition-colors">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Webhook className="text-yellow-500 shrink-0 mt-0.5" size={18} />
              Connect TradingView Alert
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
              {savedAlerts.length > 0 ? `${savedAlerts.length} alerts active.` : "Configure your first alert."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedAlerts.length > 0 && (
              <button onClick={onRemove} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold mr-2">
                <Trash2 size={14} className="sm:mr-1" /> <span className="hidden sm:inline">Reset All</span>
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 sm:space-y-8 flex-1">
          
          {/* 1. ALERT TYPE GRID */}
          <div>
            <SectionHeader number="1" title="Choose Your Alert Type" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["LONG_ENTRY", "LONG_EXIT", "SHORT_ENTRY", "SHORT_EXIT"].map((type) => (
                <AlertOption
                  key={type}
                  type={type}
                  icon={getIconForType(type)}
                  isSelected={selectedAlertType === type}
                  isSaved={savedAlerts.includes(type)}
                  isDisabled={isOptionDisabled(type)}
                  onClick={() => handleOptionClick(type)}
                />
              ))}
            </div>
          </div>

          {/* 2. JSON COPY SECTION */}
          <div className="transition-all">
            <SectionHeader number="2" title="Copy Message Body (JSON)" />
            <div className={`bg-gray-50 dark:bg-slate-950 border rounded-lg overflow-hidden group transition-colors ${isSaveActive ? "border-blue-500 dark:border-slate-700" : "border-gray-200 dark:border-slate-800/50"}`}>
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-slate-800 bg-gray-100/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-gray-500 dark:text-gray-500 font-mono">JSON Message</span>
                <button
                  onClick={() => {
                    if (isSaveActive) {
                      navigator.clipboard.writeText(jsonMessage);
                      setCopiedField("json");
                      setTimeout(() => setCopiedField(null), 2000);
                    }
                  }}
                  disabled={!isSaveActive}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold transition-all ${isSaveActive ? (copiedField === "json" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 shadow-sm") : "bg-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
                >
                  {copiedField === "json" ? <Check size={12} /> : <Copy size={12} />} {copiedField === "json" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="p-3">
                <textarea readOnly value={isSaveActive ? jsonMessage : placeholderMessage} className={`w-full h-44 bg-transparent text-[11px] font-mono resize-none focus:outline-none custom-scrollbar transition-colors ${isSaveActive ? "text-blue-600 dark:text-blue-300" : "text-gray-400 dark:text-gray-600 italic select-none"}`} />
              </div>
            </div>
          </div>

          {/* 3. WEBHOOK */}
          <div>
            <SectionHeader number="3" title="Copy Webhook URL" />
            <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg p-1 flex items-center">
              <div className="flex-1 px-3 py-2 overflow-hidden">
                <p className="text-[11px] text-gray-600 dark:text-gray-400 truncate font-mono">{webhookUrl}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                  setCopiedField("url");
                  setTimeout(() => setCopiedField(null), 2000);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${copiedField === "url" ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
              >
                {copiedField === "url" ? <Check size={14} /> : <Copy size={14} />} {copiedField === "url" ? "Copied" : "Copy URL"}
              </button>
            </div>
          </div>

          {/* 4. SETUP GUIDE */}
          {/* Guide Section Remains Unchanged */}
          <div>
            <SectionHeader number="4" title="Setup in TradingView" />
            <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors">
              <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto bg-white dark:bg-slate-900">
                {guideSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGuideStep(idx)}
                    className={`flex-1 py-3 px-2 text-[10px] font-bold text-center transition-colors border-b-2 whitespace-nowrap ${activeGuideStep === idx ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "text-gray-500 dark:text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                  >
                    {step.title}
                  </button>
                ))}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-950 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <span className="bg-purple-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{activeGuideStep + 1}</span>
                    {guideSteps[activeGuideStep].desc}
                  </p>
                  <div className="flex gap-1">
                    <button disabled={activeGuideStep === 0} onClick={() => setActiveGuideStep((prev) => Math.max(0, prev - 1))} className="p-1 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30"><ChevronLeft size={14} /></button>
                    <button disabled={activeGuideStep === guideSteps.length - 1} onClick={() => setActiveGuideStep((prev) => Math.min(guideSteps.length - 1, prev + 1))} className="p-1 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30"><ChevronRight size={14} /></button>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-black flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
                  <img src={guideSteps[activeGuideStep].img} alt={`Step ${activeGuideStep + 1}`} className="w-full h-auto object-contain max-h-[250px] sm:max-h-[350px]" onError={(e) => { e.target.style.display = "none"; }} />
                </div>
              </div>
            </div>
          </div>

          {/* TIPS */}
          <div className="bg-yellow-50 dark:bg-slate-950 border border-yellow-500/20 rounded-lg p-3 flex gap-3 items-start transition-colors">
            <Lightbulb className="text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-xs font-bold text-yellow-700 dark:text-yellow-500 mb-1">Quick Tips</h4>
              <ul className="text-[11px] text-yellow-800/80 dark:text-gray-400 space-y-1 list-disc pl-3">
                <li>Ensure the <b>Webhook URL</b> field in TradingView is checked.</li>
                <li>Do not modify the JSON keys.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 sm:rounded-b-xl shrink-0 transition-colors">
          <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
          
          <button
            onClick={() => {
                if (isSaveActive) {
                    onSave(selectedAlertType);
                    onClose(); 
                }
            }}
            disabled={!isSaveActive}
            className={`px-6 py-2.5 text-xs font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 ${isSaveActive ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 cursor-pointer" : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-slate-700"}`}
          >
            <Check size={14} /> Save <span className="hidden sm:inline">& Connect Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const SectionHeader = ({ number, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{number}</span>
    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{title}</h3>
  </div>
);

const getIconForType = (type) => {
  switch (type) {
    case "LONG_ENTRY": return <TrendingUp className="text-green-500 dark:text-green-400" size={18} />;
    case "LONG_EXIT": return <LogOut className="text-blue-500 dark:text-blue-400" size={18} />;
    case "SHORT_ENTRY": return <TrendingDown className="text-red-500 dark:text-red-400" size={18} />;
    case "SHORT_EXIT": return <XCircle className="text-orange-500 dark:text-orange-400" size={18} />;
    default: return null;
  }
};

const AlertOption = ({ type, icon, isSelected, isSaved, isDisabled, onClick }) => {
  const title = type.replace("_", " ");
  let containerClass = "rounded-lg p-3 border transition-all flex items-center gap-3 relative overflow-hidden group ";
  let iconBgClass = "";
  let textClass = "";

  if (isDisabled) {
    containerClass += "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800";
    iconBgClass = "bg-gray-200 dark:bg-slate-800";
    textClass = "text-gray-400 dark:text-gray-600";
  } else if (isSaved) {
    containerClass += "bg-white dark:bg-slate-950 border-green-500/50 cursor-default shadow-[0_0_10px_rgba(34,197,94,0.1)]";
    iconBgClass = "bg-green-100 dark:bg-green-500/10";
    textClass = "text-green-600 dark:text-green-400";
  } else if (isSelected) {
    containerClass += "bg-blue-50 dark:bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/50 cursor-pointer";
    iconBgClass = "bg-blue-100 dark:bg-blue-500/20";
    textClass = "text-blue-700 dark:text-white";
  } else {
    containerClass += "bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 cursor-pointer";
    iconBgClass = "bg-gray-100 dark:bg-slate-800";
    textClass = "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300";
  }

  return (
    <div onClick={onClick} className={containerClass}>
      {isSaved && <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-green-500/50"><Check size={10} strokeWidth={4} /></div>}
      {isDisabled && <div className="absolute top-3 right-3 text-gray-400 dark:text-gray-600"><Lock size={12} /></div>}
      <div className={`p-1.5 rounded ${iconBgClass}`}>{icon}</div>
      <div>
        <span className={`text-xs font-bold ${textClass}`}>{title}</span>
        {isDisabled && <p className="text-[9px] text-gray-400 dark:text-gray-600 leading-tight">Entry First</p>}
        {isSaved && <p className="text-[9px] text-green-600 dark:text-green-500/70 leading-tight">Configured</p>}
      </div>
    </div>
  );
};

export default TradingViewModal;