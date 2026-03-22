
// import React, { useState, useEffect, useRef } from 'react';
// import { Search, Filter, Layers, Activity, Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// // IMPORTS - COMPONENTS
// import DeployModal from '../../components/algoComponents/Strategies/DeployModal';
// import TradingViewModal from '../../components/algoComponents/Strategies/TradingViewModal'; 
// import StrategyCard, { StrategyCardSkeleton } from '../../components/algoComponents/Strategies/StrategyCard'; 
// import TemplateCard from '../../components/algoComponents/Strategies/TemplateCard'; 
// import ToastNotification from '../../components/ToastNotification'; 

// // IMPORTS - SERVICES (API)
// import { getStrategies, createStrategy, updateStrategy, deleteStrategy } from '../../data/AlogoTrade/strategyService';

// const Strategies = () => {
//   const navigate = useNavigate();

//   // ✅ MOCK TEMPLATES (Static Data)
//   const templatesData = [
//       { 
//         id: 901, name: "9:20 Straddle Pro", description: "Classic market neutral strategy.", segment: "Options", type: "Time Based", risk: "Medium", roi: "~5-8% / Mo", capital: "1.5L", originalData: {} 
//       },
//       { 
//         id: 902, name: "Nifty Trend Follower", description: "Captures big moves using Supertrend.", segment: "Futures", type: "Indicator", risk: "High", roi: "~12% / Mo", capital: "2.0L", originalData: {} 
//       },
//       { 
//         id: 903, name: "BankNifty Scalper", description: "Quick entry/exit on 1-min timeframe.", segment: "Options", type: "Price Action", risk: "High", roi: "~15% / Mo", capital: "50K", originalData: {} 
//       },
//       { 
//         id: 904, name: "Safe Monthly Iron Fly", description: "Hedging strategy for professionals.", segment: "Options", type: "Positional", risk: "Low", roi: "~3-4% / Mo", capital: "3.0L", originalData: {} 
//       }
//   ];

//   // --- STATES ---
//   const [strategies, setStrategies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeMenu, setActiveMenu] = useState(null); 
  
//   const [activeTab, setActiveTab] = useState('my'); 
//   const [viewMode, setViewMode] = useState('strategies'); // 'strategies' OR 'signals'
//   const [searchQuery, setSearchQuery] = useState('');

//   // Modals State
//   const [selectedStrategyForWebhook, setSelectedStrategyForWebhook] = useState(null);
//   const [showDuplicateModal, setShowDuplicateModal] = useState(false);
//   const [strategyToDuplicate, setStrategyToDuplicate] = useState(null);
//   const [newStrategyName, setNewStrategyName] = useState("");
  
//   const [showDeployModal, setShowDeployModal] = useState(false);
//   const [strategyToDeploy, setStrategyToDeploy] = useState(null);

//   const [notification, setNotification] = useState(null); 

//   // --- CLICK OUTSIDE HANDLER ---
//   useEffect(() => {
//     const handleClickOutside = () => { setActiveMenu(null); };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // ✅ HELPER: Format Strike Display (Clean Logic)
//   const formatStrikeDisplay = (leg) => {
//       // 1. Agar User ne 'Strike Type' chuna hai (e.g. ITM 400) aur wo ATM nahi hai
//       if (leg.strikeType && leg.strikeType !== "ATM") {
//           return leg.strikeType.replace(/\s?pts?/i, "").trim(); 
//       }
//       // 2. Agar 'Strike Criteria' hai
//       if (leg.strikeCriteria) {
//           return leg.strikeCriteria.replace(/\s?pts?/i, "").trim();
//       }
//       // 3. Default
//       return "ATM";
//   };

// const fetchStrategies = async () => {
//     setLoading(true);
//     try {
//         const data = await getStrategies(); 
        
//         const formattedData = data.map(s => {
//             const coreData = s.data || {};
//             const firstInstrument = coreData.instruments?.[0];
//             let instrumentName = "NIFTY";
//             if(firstInstrument) instrumentName = firstInstrument.name || s.name;

//             return {
//                 id: s._id,
//                 name: s.name,
//                 author: "By You",
//                 type: s.type,
//                 status: s.status,
//                 createdDate: s.createdDate,
                
//                 segment: firstInstrument?.segment || "Options",
//                 startTime: coreData.config?.startTime || "09:15",
//                 endTime: coreData.config?.squareOff || "15:15",
                
//                 // 🔥 THE FIX: Smart Leg Mapping for CE/PE 🔥
//                 legs: (coreData.legs || []).map(l => {
//                     // 1. Database se alag-alag naam check karo
//                     const rawOpt = (l.optionType || l.type || l.right || l.option_type || "").toString().toUpperCase();
                    
//                     // 2. Sahi CE / PE set karo
//                     let finalOptType = "FUT";
//                     if (rawOpt === "CALL" || rawOpt === "CE") finalOptType = "CE";
//                     else if (rawOpt === "PUT" || rawOpt === "PE") finalOptType = "PE";

//                     return {
//                         action: l.action || "BUY",
//                         symbol: instrumentName,
//                         type: finalOptType, // ✅ Ab yahan hamesha dynamically sahi aayega
//                         qty: l.quantity || 1,
//                         strike: formatStrikeDisplay(l) 
//                     };
//                 }),

//                 originalData: s,
//                 data: coreData,
                
//                 // ✅ Backend Persistence Fields
//                 isSignalActive: s.isSignalActive || false,
//                 configuredAlerts: s.configuredAlerts || [] 
//             };
//         });
//         setStrategies(formattedData);
//     } catch (error) {
//         console.error("Error fetching strategies:", error);
//         setNotification({ message: "Failed to load strategies", type: "error" });
//     } finally {
//         setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStrategies();
//   }, []);

//   // --- HANDLERS ---

//   const handleUseTemplate = (template) => {
//       setStrategyToDuplicate({ originalData: template.originalData || {}, name: template.name });
//       setNewStrategyName(template.name);
//       setShowDuplicateModal(true);
//   };

//  const handleSaveSignalConfig = async (newAlertType) => {
//       if (!selectedStrategyForWebhook) return;

//       try {
//           const currentAlerts = selectedStrategyForWebhook.configuredAlerts || [];
//           const updatedAlerts = [...new Set([...currentAlerts, newAlertType])];

//           // 1. Backend Update
//           await updateStrategy(selectedStrategyForWebhook.id, { 
//               isSignalActive: true, 
//               configuredAlerts: updatedAlerts 
//           });

//           // 2. UI List Update
//           const updatedList = strategies.map(s => {
//               if (s.id === selectedStrategyForWebhook.id) {
//                   return { 
//                       ...s, 
//                       isSignalActive: true,
//                       configuredAlerts: updatedAlerts
//                   };
//               }
//               return s;
//           });

//           setStrategies(updatedList);
          
//           // 🚨 IMPORTANT FIX: 
//           // Ye line niche wali Maine HATA DI hai. 
//           // Agar ye line rahegi to Modal band hokar wapas khul jayega.
//           // setSelectedStrategyForWebhook(...);  <-- DO NOT USE THIS

//           setNotification({ 
//               message: `${newAlertType} Configured Successfully!`, 
//               type: "success" 
//           });

//       } catch (error) {
//           console.error("Signal Save Error", error);
//           setNotification({ message: "Failed to save configuration", type: "error" });
//       }
//   };

//   // ✅ 3. REMOVE SIGNAL LOGIC
//   const handleRemoveSignal = async () => {
//       if (!selectedStrategyForWebhook) return;

//       if(window.confirm("Disconnect all signals for this strategy?")) {
//         try {
//             await updateStrategy(selectedStrategyForWebhook.id, { 
//                 isSignalActive: false,
//                 configuredAlerts: [] 
//             });

//             const updatedList = strategies.map(s => {
//                 if (s.id === selectedStrategyForWebhook.id) {
//                     return { ...s, isSignalActive: false, configuredAlerts: [] };
//                 }
//                 return s;
//             });

//             setStrategies(updatedList);
//             setSelectedStrategyForWebhook(null); // Close Modal
//             setNotification({ message: "All signals disconnected. Moved to Strategies tab.", type: "info" });
            
//         } catch (error) {
//             setNotification({ message: "Failed to disconnect", type: "error" });
//         }
//       }
//   };

//   // ✅ FIXED DELETE HANDLER (Connects to Backend)
//   const handleDelete = async (id) => {
//     if(window.confirm("Are you sure you want to delete this strategy? This cannot be undone.")) {
//         try {
//             // 1. API Call to Backend
//             await deleteStrategy(id);

//             // 2. Update Local State (Remove from UI immediately)
//             const updatedList = strategies.filter(s => s.id !== id);
//             setStrategies(updatedList);
            
//             setNotification({ message: "Strategy deleted successfully", type: "success" });
//         } catch (error) {
//             console.error("Delete failed", error);
//             setNotification({ message: "Failed to delete strategy", type: "error" });
//         }
//     }
//   };

//   const handleEdit = (strategy) => {
//       navigate('/strategy-builder', { state: { strategyData: strategy.originalData } });
//   };

//   const openDuplicateModal = (strategy) => { setStrategyToDuplicate(strategy); setNewStrategyName(`${strategy.name} Copy`); setShowDuplicateModal(true); };
  
//   const handleConfirmDuplicate = async () => {
//       if(!strategyToDuplicate) return;
//       try {
//           const payload = {
//               name: newStrategyName,
//               type: strategyToDuplicate.type || "Time Based",
//               status: "Inactive",
//               data: strategyToDuplicate.data 
//           };
//           await createStrategy(payload);
//           setNotification({ message: "Strategy Duplicated Successfully!", type: "success" });
//           setShowDuplicateModal(false);
//           fetchStrategies(); 
//       } catch (error) {
//           setNotification({ message: "Failed to duplicate", type: "error" });
//       }
//   };

//   const handleBacktest = (strategyId) => navigate(`/backtest/${strategyId}`); 
//   const openDeployModal = (strategy) => { setStrategyToDeploy(strategy); setShowDeployModal(true); };
  
//   const handleConfirmDeploy = (deployConfig) => {
//       setNotification({ message: `Strategy deployed in ${deployConfig.executionType} mode.`, type: "success" });
//       setShowDeployModal(false);
//   };

//   // ✅ 4. FILTER LOGIC (Tabs & View Modes)
//   const getFilteredStrategies = () => {
//       let dataToFilter = activeTab === 'templates' ? templatesData : strategies;
      
//       return dataToFilter.filter(strat => {
//           const matchesSearch = strat.name.toLowerCase().includes(searchQuery.toLowerCase());
          
//           // Tab View Logic
//           let matchesView = true;
//           if (activeTab === 'my') {
//               if (viewMode === 'signals') {
//                   matchesView = strat.isSignalActive === true; // Show only connected strategies
//               } else {
//                   matchesView = strat.isSignalActive !== true; // Show normal strategies
//               }
//           }

//           // Deployed Tab Logic
//           const matchesTab = activeTab === 'deployed' ? (strat.status?.toLowerCase() === 'active') : true;
          
//           return matchesSearch && matchesTab && matchesView;
//       });
//   };
  
//   const displayedStrategies = getFilteredStrategies();

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans relative transition-colors duration-300"> 
      
//        <div className="flex flex-col gap-6 mb-8">
//           {/* Header */}
//           <div className="flex justify-between items-center">
//             <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
//                 <span className="bg-blue-600 w-1 h-6 rounded-full shadow-lg shadow-blue-500/50"></span>
//                 My Strategies
//             </h1>
//             <button onClick={() => navigate("/strategy-builder")} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
//                 + Create Strategy
//             </button>
//           </div>
          
//           {/* Tabs & Filters */}
//           <div className="flex flex-col md:flex-row justify-between items-end md:items-center border-b border-gray-200 dark:border-slate-800 pb-1 gap-4 transition-colors">
//               <div className="flex gap-6 text-sm font-medium w-full md:w-auto overflow-x-auto">
//                   {['my', 'deployed', 'templates'].map(tab => (
//                       <button 
//                         key={tab} 
//                         onClick={() => setActiveTab(tab)} 
//                         className={`pb-3 border-b-2 capitalize transition-colors whitespace-nowrap 
//                         ${activeTab === tab 
//                             ? 'border-blue-600 text-blue-600 dark:text-white dark:border-blue-500' 
//                             : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
//                       >
//                           {tab === 'my' ? 'My Strategies' : tab === 'deployed' ? 'Deployed Strategies' : 'Strategy Templates'}
//                       </button>
//                   ))}
//               </div>
              
//               {/* View Mode Toggle (Only on My Strategies) */}
//               {activeTab === 'my' && (
//                   <div className="bg-white dark:bg-slate-900 p-1 rounded-lg flex items-center border border-gray-200 dark:border-slate-800 transition-colors">
//                       <button 
//                         onClick={() => setViewMode('strategies')} 
//                         className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'strategies' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
//                       >
//                           <Layers size={14} /> Strategies
//                       </button>
//                       <button 
//                         onClick={() => setViewMode('signals')} 
//                         className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'signals' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
//                       >
//                           <Activity size={14} /> TradingView Signals
//                       </button>
//                   </div>
//               )}
//           </div>
          
//           {/* Search Bar */}
//           <div className="relative w-full md:w-96">
//               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Search strategies..." 
//                 value={searchQuery} 
//                 onChange={(e) => setSearchQuery(e.target.value)} 
//                 className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-600" 
//               />
//           </div>
//        </div>

//       {/* Grid Content */}
//       {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {
//                 [1, 2, 3].map((n) => (
//             <StrategyCardSkeleton key={n} />
//         ))
//               }
//           </div>
//       ) : displayedStrategies.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-800 transition-colors">
//               <div className="bg-gray-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Filter className="text-gray-400 dark:text-gray-500" size={32} />
//               </div>
//               <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-1">No Strategies Found</h3>
//               <p className="text-gray-500 dark:text-gray-500 text-xs">
//                   {viewMode === 'signals' 
//                     ? "No strategies connected to TradingView yet." 
//                     : "Try creating a new strategy or adjust filters."}
//               </p>
//           </div>
//       ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {displayedStrategies.map((strat) => (
//                 activeTab === 'templates' ? (
//                     <TemplateCard 
//                           key={strat.id} 
//                           template={strat} 
//                           onUse={handleUseTemplate}
//                       />
//                   ) : (
//                   <StrategyCard 
//                         key={strat._id || strat.id} // ✅ FIXED: key me bhi _id
//                         strategy={strat}
//                         viewMode={viewMode}
//                         isMenuOpen={activeMenu === (strat._id || strat.id)} // ✅ FIXED
//                         onToggleMenu={() => setActiveMenu(activeMenu === (strat._id || strat.id) ? null : (strat._id || strat.id))} // ✅ FIXED
//                         onEdit={() => handleEdit(strat)}
//                         onDuplicate={() => openDuplicateModal(strat)}
//                         onDelete={() => handleDelete(strat._id || strat.id)} // ✅ FIXED
//                         onOpenWebhook={() => setSelectedStrategyForWebhook(strat)}
                        
//                         // 🔥 MAIN FIX FOR BACKTEST CRASH 🔥
//                         onBacktest={() => handleBacktest(strat._id || strat.id)} 
                        
//                         onDeploy={() => openDeployModal(strat)} 
//                     />
//                   )
//             ))}
//           </div>
//       )}

//       {/* --- MODALS --- */}
      
//       {/* TradingView Modal: Handles Alerts */}
//       <TradingViewModal 
//           isOpen={!!selectedStrategyForWebhook} 
//           onClose={() => setSelectedStrategyForWebhook(null)} 
//           strategy={selectedStrategyForWebhook} 
//           onSave={handleSaveSignalConfig} // Updates DB & UI
//           onRemove={handleRemoveSignal} 
//       />

//        <DeployModal 
//            isOpen={showDeployModal} 
//            onClose={() => setShowDeployModal(false)} 
//            strategy={strategyToDeploy}
//            onConfirmDeploy={handleConfirmDeploy}
//        />

//       {/* Duplicate Modal */}
//       {showDuplicateModal && (
//         <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm animate-in fade-in">
//             <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-xl w-[400px] shadow-2xl transition-colors">
//                 <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Duplicate Strategy</h2>
//                 <input type="text" value={newStrategyName} onChange={(e) => setNewStrategyName(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded p-2.5 text-sm text-gray-900 dark:text-white mb-6 outline-none focus:border-blue-500 transition-colors" />
//                 <div className="flex gap-3 justify-end">
//                     <button onClick={() => setShowDuplicateModal(false)} className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors">Cancel</button>
//                     <button onClick={handleConfirmDuplicate} className="px-6 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 rounded shadow-md active:scale-95 transition-all">Duplicate</button>
//                 </div>
//             </div>
//         </div>
//       )}

//       {/* TOAST NOTIFICATION */}
//       {notification && (
//           <ToastNotification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
//       )}

//     </div>
//   );
// };

// export default Strategies;



import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Layers, Activity, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// IMPORTS - COMPONENTS
import DeployModal from '../../components/algoComponents/Strategies/DeployModal';
import TradingViewModal from '../../components/algoComponents/Strategies/TradingViewModal'; 
import StrategyCard, { StrategyCardSkeleton } from '../../components/algoComponents/Strategies/StrategyCard'; 
import TemplateCard from '../../components/algoComponents/Strategies/TemplateCard'; 
import ToastNotification from '../../components/ToastNotification'; 
// 🔥 NAYA: DeployedStrategiesTab ko yahan import kiya hai 🔥
import DeployedStrategiesTab from '../../components/algoComponents/Strategies/DeployedStrategiesTab'; 

// IMPORTS - SERVICES (API)
import { getStrategies, createStrategy, updateStrategy, deleteStrategy } from '../../data/AlogoTrade/strategyService';

const Strategies = () => {
  const navigate = useNavigate();

  // ✅ MOCK TEMPLATES (Static Data)
  const templatesData = [
      { 
        id: 901, name: "9:20 Straddle Pro", description: "Classic market neutral strategy.", segment: "Options", type: "Time Based", risk: "Medium", roi: "~5-8% / Mo", capital: "1.5L", originalData: {} 
      },
      { 
        id: 902, name: "Nifty Trend Follower", description: "Captures big moves using Supertrend.", segment: "Futures", type: "Indicator", risk: "High", roi: "~12% / Mo", capital: "2.0L", originalData: {} 
      },
      { 
        id: 903, name: "BankNifty Scalper", description: "Quick entry/exit on 1-min timeframe.", segment: "Options", type: "Price Action", risk: "High", roi: "~15% / Mo", capital: "50K", originalData: {} 
      },
      { 
        id: 904, name: "Safe Monthly Iron Fly", description: "Hedging strategy for professionals.", segment: "Options", type: "Positional", risk: "Low", roi: "~3-4% / Mo", capital: "3.0L", originalData: {} 
      }
  ];

  // --- STATES ---
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null); 
  
  const [activeTab, setActiveTab] = useState('my'); 
  const [viewMode, setViewMode] = useState('strategies'); // 'strategies' OR 'signals'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [selectedStrategyForWebhook, setSelectedStrategyForWebhook] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [strategyToDuplicate, setStrategyToDuplicate] = useState(null);
  const [newStrategyName, setNewStrategyName] = useState("");
  
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [strategyToDeploy, setStrategyToDeploy] = useState(null);

  const [notification, setNotification] = useState(null); 

  // --- CLICK OUTSIDE HANDLER ---
  useEffect(() => {
    const handleClickOutside = () => { setActiveMenu(null); };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ HELPER: Format Strike Display (Clean Logic)
  const formatStrikeDisplay = (leg) => {
      if (leg.strikeType && leg.strikeType !== "ATM") {
          return leg.strikeType.replace(/\s?pts?/i, "").trim(); 
      }
      if (leg.strikeCriteria) {
          return leg.strikeCriteria.replace(/\s?pts?/i, "").trim();
      }
      return "ATM";
  };

const fetchStrategies = async () => {
    setLoading(true);
    try {
        const data = await getStrategies(); 
        
        const formattedData = data.map(s => {
            const coreData = s.data || {};
            const firstInstrument = coreData.instruments?.[0];
            let instrumentName = "NIFTY";
            if(firstInstrument) instrumentName = firstInstrument.name || s.name;

            return {
                id: s._id,
                name: s.name,
                author: "By You",
                type: s.type,
                status: s.status,
                createdDate: s.createdDate,
                
                segment: firstInstrument?.segment || "Options",
                startTime: coreData.config?.startTime || "09:15",
                endTime: coreData.config?.squareOff || "15:15",
                
                legs: (coreData.legs || []).map(l => {
                    const rawOpt = (l.optionType || l.type || l.right || l.option_type || "").toString().toUpperCase();
                    let finalOptType = "FUT";
                    if (rawOpt === "CALL" || rawOpt === "CE") finalOptType = "CE";
                    else if (rawOpt === "PUT" || rawOpt === "PE") finalOptType = "PE";

                    return {
                        action: l.action || "BUY",
                        symbol: instrumentName,
                        type: finalOptType, 
                        qty: l.quantity || 1,
                        strike: formatStrikeDisplay(l) 
                    };
                }),

                originalData: s,
                data: coreData,
                
                isSignalActive: s.isSignalActive || false,
                configuredAlerts: s.configuredAlerts || [] 
            };
        });
        setStrategies(formattedData);
    } catch (error) {
        console.error("Error fetching strategies:", error);
        setNotification({ message: "Failed to load strategies", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  // --- HANDLERS ---

  const handleUseTemplate = (template) => {
      setStrategyToDuplicate({ originalData: template.originalData || {}, name: template.name });
      setNewStrategyName(template.name);
      setShowDuplicateModal(true);
  };

 const handleSaveSignalConfig = async (newAlertType) => {
      if (!selectedStrategyForWebhook) return;

      try {
          const currentAlerts = selectedStrategyForWebhook.configuredAlerts || [];
          const updatedAlerts = [...new Set([...currentAlerts, newAlertType])];

          await updateStrategy(selectedStrategyForWebhook.id, { 
              isSignalActive: true, 
              configuredAlerts: updatedAlerts 
          });

          const updatedList = strategies.map(s => {
              if (s.id === selectedStrategyForWebhook.id) {
                  return { 
                      ...s, 
                      isSignalActive: true,
                      configuredAlerts: updatedAlerts
                  };
              }
              return s;
          });

          setStrategies(updatedList);
          
          setNotification({ 
              message: `${newAlertType} Configured Successfully!`, 
              type: "success" 
          });

      } catch (error) {
          console.error("Signal Save Error", error);
          setNotification({ message: "Failed to save configuration", type: "error" });
      }
  };

  const handleRemoveSignal = async () => {
      if (!selectedStrategyForWebhook) return;

      if(window.confirm("Disconnect all signals for this strategy?")) {
        try {
            await updateStrategy(selectedStrategyForWebhook.id, { 
                isSignalActive: false,
                configuredAlerts: [] 
            });

            const updatedList = strategies.map(s => {
                if (s.id === selectedStrategyForWebhook.id) {
                    return { ...s, isSignalActive: false, configuredAlerts: [] };
                }
                return s;
            });

            setStrategies(updatedList);
            setSelectedStrategyForWebhook(null); 
            setNotification({ message: "All signals disconnected. Moved to Strategies tab.", type: "info" });
            
        } catch (error) {
            setNotification({ message: "Failed to disconnect", type: "error" });
        }
      }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this strategy? This cannot be undone.")) {
        try {
            await deleteStrategy(id);
            const updatedList = strategies.filter(s => s.id !== id);
            setStrategies(updatedList);
            setNotification({ message: "Strategy deleted successfully", type: "success" });
        } catch (error) {
            console.error("Delete failed", error);
            setNotification({ message: "Failed to delete strategy", type: "error" });
        }
    }
  };

  const handleEdit = (strategy) => {
      navigate('/strategy-builder', { state: { strategyData: strategy.originalData } });
  };

  const openDuplicateModal = (strategy) => { setStrategyToDuplicate(strategy); setNewStrategyName(`${strategy.name} Copy`); setShowDuplicateModal(true); };
  
  const handleConfirmDuplicate = async () => {
      if(!strategyToDuplicate) return;
      try {
          const payload = {
              name: newStrategyName,
              type: strategyToDuplicate.type || "Time Based",
              status: "Inactive",
              data: strategyToDuplicate.data 
          };
          await createStrategy(payload);
          setNotification({ message: "Strategy Duplicated Successfully!", type: "success" });
          setShowDuplicateModal(false);
          fetchStrategies(); 
      } catch (error) {
          setNotification({ message: "Failed to duplicate", type: "error" });
      }
  };

  const handleBacktest = (strategyId) => navigate(`/backtest/${strategyId}`); 
  const openDeployModal = (strategy) => { setStrategyToDeploy(strategy); setShowDeployModal(true); };
  
  const handleConfirmDeploy = (deployConfig) => {
      setNotification({ message: `Strategy deployed in ${deployConfig.executionType} mode.`, type: "success" });
      setShowDeployModal(false);
  };

  // ✅ FILTER LOGIC
  const getFilteredStrategies = () => {
      let dataToFilter = activeTab === 'templates' ? templatesData : strategies;
      
      return dataToFilter.filter(strat => {
          const matchesSearch = strat.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          let matchesView = true;
          if (activeTab === 'my') {
              if (viewMode === 'signals') {
                  matchesView = strat.isSignalActive === true; 
              } else {
                  matchesView = strat.isSignalActive !== true; 
              }
          }

          // Deployed Tab logic yahan se hata di gayi hai kyunki uske liye ab alag component hai
          return matchesSearch && matchesView;
      });
  };
  
  const displayedStrategies = getFilteredStrategies();

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans relative transition-colors duration-300"> 
      
       <div className="flex flex-col gap-6 mb-8">
          {/* Header */}
          {/* <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                <span className="bg-blue-600 w-1 h-6 rounded-full shadow-lg shadow-blue-500/50"></span>
                My Strategies
            </h1>
            <button onClick={() => navigate("/strategy-builder")} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                + Create Strategy
            </button>
          </div> */}
          
          {/* Tabs & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center border-b border-gray-200 dark:border-slate-800 pb-1 gap-4 transition-colors">
              <div className="flex gap-6 text-sm font-medium w-full md:w-auto overflow-x-auto">
                  {['my', 'deployed', 'templates'].map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`pb-3 border-b-2 capitalize transition-colors whitespace-nowrap 
                        ${activeTab === tab 
                            ? 'border-blue-600 text-blue-600 dark:text-white dark:border-blue-500' 
                            : 'border-transparent text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                      >
                          {tab === 'my' ? 'My Strategies' : tab === 'deployed' ? 'Deployed Strategies' : 'Strategy Templates'}
                      </button>
                  ))}
              </div>
              
              {/* View Mode Toggle (Only on My Strategies) */}
              {activeTab === 'my' && (
                  <div className="bg-white dark:bg-slate-900 p-1 rounded-lg flex items-center border border-gray-200 dark:border-slate-800 transition-colors">
                      <button 
                        onClick={() => setViewMode('strategies')} 
                        className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'strategies' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                      >
                          <Layers size={14} /> Strategies
                      </button>
                      <button 
                        onClick={() => setViewMode('signals')} 
                        className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'signals' ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                      >
                          <Activity size={14} /> TradingView Signals
                      </button>
                  </div>
              )}
          </div>
          
          {/* Search Bar */}
          {activeTab !== 'deployed' && ( // Deployed tab me search zaroorat nahi hai filhal
              <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search strategies..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-600" 
                  />
              </div>
          )}
       </div>

      {/* 🔥 THE MAIN FIX: CONDITIONAL RENDERING FOR TABS 🔥 */}
      {activeTab === 'deployed' ? (
          // Agar tab 'deployed' hai, to hamara naya component dikhao
          <DeployedStrategiesTab />
      ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                 <StrategyCardSkeleton key={n} />
              ))}
          </div>
      ) : displayedStrategies.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-800 transition-colors">
              <div className="bg-gray-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-1">No Strategies Found</h3>
              <p className="text-gray-500 dark:text-gray-500 text-xs">
                  {viewMode === 'signals' 
                    ? "No strategies connected to TradingView yet." 
                    : "Try creating a new strategy or adjust filters."}
              </p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedStrategies.map((strat) => (
                activeTab === 'templates' ? (
                    <TemplateCard 
                          key={strat.id} 
                          template={strat} 
                          onUse={handleUseTemplate}
                      />
                  ) : (
                  <StrategyCard 
                        key={strat._id || strat.id} 
                        strategy={strat}
                        viewMode={viewMode}
                        isMenuOpen={activeMenu === (strat._id || strat.id)}
                        onToggleMenu={() => setActiveMenu(activeMenu === (strat._id || strat.id) ? null : (strat._id || strat.id))}
                        onEdit={() => handleEdit(strat)}
                        onDuplicate={() => openDuplicateModal(strat)}
                        onDelete={() => handleDelete(strat._id || strat.id)}
                        onOpenWebhook={() => setSelectedStrategyForWebhook(strat)}
                        onBacktest={() => handleBacktest(strat._id || strat.id)} 
                        onDeploy={() => openDeployModal(strat)} 
                    />
                  )
            ))}
          </div>
      )}

      {/* --- MODALS --- */}
      
      <TradingViewModal 
          isOpen={!!selectedStrategyForWebhook} 
          onClose={() => setSelectedStrategyForWebhook(null)} 
          strategy={selectedStrategyForWebhook} 
          onSave={handleSaveSignalConfig} 
          onRemove={handleRemoveSignal} 
      />

       <DeployModal 
           isOpen={showDeployModal} 
           onClose={() => setShowDeployModal(false)} 
           strategy={strategyToDeploy}
           onConfirmDeploy={handleConfirmDeploy}
       />

      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-xl w-[400px] shadow-2xl transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Duplicate Strategy</h2>
                <input type="text" value={newStrategyName} onChange={(e) => setNewStrategyName(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded p-2.5 text-sm text-gray-900 dark:text-white mb-6 outline-none focus:border-blue-500 transition-colors" />
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setShowDuplicateModal(false)} className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors">Cancel</button>
                    <button onClick={handleConfirmDuplicate} className="px-6 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 rounded shadow-md active:scale-95 transition-all">Duplicate</button>
                </div>
            </div>
        </div>
      )}

      {notification && (
          <ToastNotification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

    </div>
  );
};

export default Strategies;