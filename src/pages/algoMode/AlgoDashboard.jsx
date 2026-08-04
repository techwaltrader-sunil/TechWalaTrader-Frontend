
// import React, { useState, useEffect, useRef } from 'react';
// import { Box, ChevronDown, ChevronLeft, ChevronRight, Check, ArrowRight, Phone, Plus } from 'lucide-react';
// import { FaTelegramPlane, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client'; 
// import axios from 'axios'; // 🔥 NEW: Template fetch karne ke liye

// import { getConnectedBrokers, updateBrokerStatus } from '../../data/AlogoTrade/brokerService';
// import LiveLogTicker from '../../components/algoComponents/AlgoDashboard/LiveLogTicker';

// import TemplateCard from '../../components/algoComponents/Strategies/TemplateCard';

// import { fetchActiveDeployments } from '../../data/AlogoTrade/deploymentService';
// // ✅ Connect to Backend Socket
// const socket = io.connect(import.meta.env.VITE_SOCKET_URL);

// const AlgoDashboard = () => {
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
  
//   const [brokers, setBrokers] = useState([]);
//   const [activeBroker, setActiveBroker] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
  
//   // ✅ Live P&L State
//   const [totalPnL, setTotalPnL] = useState(0.00); 

//   const [userStrategies, setUserStrategies] = useState([]);

//   const [activeDeployments, setActiveDeployments] = useState([]);

//   // 🔥 NEW: Pagination State for Deployed Strategies
//   const [deployedPage, setDeployedPage] = useState(1);
//   const ITEMS_PER_PAGE = 2;

//   const [logs, setLogs] = useState([]);


//   // 🔥 NEW: Featured Templates State
//   const [featuredTemplates, setFeaturedTemplates] = useState([]);
//   const [loadingTemplates, setLoadingTemplates] = useState(true);

//   // --- 1. FETCH DATA & SOCKET LISTENER ---
//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const data = await getConnectedBrokers();
//             setBrokers(data);
//             if (data && data.length > 0) {
//                 setActiveBroker(data[0]); 
//             }
            
//             // 🔥 NEW: 2. Fetch Featured Templates
//             const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/strategy-templates`);
//             if (res.data) {
//                 // Sirf wo templates filter karo jinka showOnDashboard true hai
//                 const likedTemplates = res.data.filter(t => t.showOnDashboard === true || t.data?.templateConfig?.showOnDashboard === true);
//                 setFeaturedTemplates(likedTemplates);
//             }

//             // 🔥 NEW: 3. Fetch User Strategies directly using Axios
//             const userStratsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/strategies`);
//             if (userStratsRes.data) {
//                 setUserStrategies(userStratsRes.data);
//             }

//             // 🔥 NEW: 4. Fetch Active Deployments for the "Strategy Deployed" box
//             try {
//                 const deploymentsData = await fetchActiveDeployments();
//                 setActiveDeployments(deploymentsData || []);
//             } catch (depErr) {
//                 console.error("Failed to load active deployments", depErr);
//                 setActiveDeployments([]);
//             }

//         } catch (error) {
//             console.error("Error loading dashboard data:", error);
//             setUserStrategies([]); // 🔥 FALLBACK (Agar API fail hui to error nahi aayega)
//         } finally {
//             setLoading(false);
//             setLoadingTemplates(false); // 🔥 STOP LOADER
//         }
//     };

//     fetchData();

//     // ✅ LIVE MARKET DATA LISTENER
//     socket.on("market-update", (data) => {
//         // Agar broker connected hai tabhi P&L update karo
//         setTotalPnL(data.pnl);
//     });

//     // Cleanup
//     return () => {
//         socket.off("market-update");
//     };
//   }, []);

//   // Dropdown Logic
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

  

//     useEffect(() => {
//         // Socket Listener (Jahan aap P&L receive kar rahe hain)
//         socket.on("log-update", (newLog) => {
//             setLogs(prev => [newLog, ...prev].slice(0, 50)); // Naya log upar aur sirf 50 logs rakho
//         });
//         return () => socket.off("log-update");
//     }, []);

//   const handleTerminalToggle = async () => {
//     if (!activeBroker) return;
//     if (!activeBroker.terminalOn) {
//         navigate(`/broker-login/${activeBroker.id}?redirect=/algo-dashboard`);
//     } else {
//         const isConfirmed = window.confirm(`Disconnect ${activeBroker.name}?`);
//         if(isConfirmed) {
//             await updateBrokerStatus(activeBroker.id, false); 
//             const updatedData = await getConnectedBrokers();
//             setBrokers(updatedData);
//             const updatedActive = updatedData.find(b => b._id === activeBroker._id || b.id === activeBroker.id);
//             setActiveBroker(updatedActive);
//             setTotalPnL(0); 
//         }
//     }
//   };

//   const handleEngineToggle = () => {
//       if(!activeBroker || !activeBroker.terminalOn) return; 
//       const newEngineState = !activeBroker.engineOn;
//       const updatedBroker = { ...activeBroker, engineOn: newEngineState };
//       setActiveBroker(updatedBroker);
//       const updatedList = brokers.map(b => (b.id === activeBroker.id || b._id === activeBroker._id) ? updatedBroker : b);
//       setBrokers(updatedList);
//   };

//   const handleBrokerSwitch = (broker) => {
//       setActiveBroker(broker);
//       setIsDropdownOpen(false);
//   };

//   const isBrokerConnected = brokers.length > 0;
//   const templates = [1, 2, 3]; 

//   if (loading) {
//     return (
//       <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-300">
//         <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded mb-6 animate-pulse"></div>
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//           <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//           <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//           <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//         </div>
//         <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded mb-4 animate-pulse"></div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//            <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//            <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//            <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }

//   // 🔥 NEW: Filter deployed strategies (Exclude 'Inactive' ones)
//   const deployedStrategies = userStrategies.filter(
//       s => s.status && s.status.toUpperCase() !== 'INACTIVE'
//   );

//   // 🔥 NEW: Pagination Logic
//   const totalDeployedPages = Math.ceil(activeDeployments.length / ITEMS_PER_PAGE);
//   const paginatedDeployments = activeDeployments.slice(
//       (deployedPage - 1) * ITEMS_PER_PAGE,
//       deployedPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
//         {isBrokerConnected ? (
//             <>
//                 {/* A. PORTFOLIO P&L CARD (UPDATED DYNAMIC UI) */}
//                 <div className="lg:col-span-4 bg-gradient-to-r from-blue-700 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/30 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                    
//                     <div className="p-6 relative z-10">
//                         <div className="flex justify-between items-start mb-4">
//                             <p className="text-blue-50 text-[10px] font-bold uppercase tracking-widest opacity-90">Portfolio P&L</p>
//                             <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
//                                 <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
//                                 <span className="text-[9px] font-bold text-white uppercase">Live</span>
//                             </div>
//                         </div>

//                         <h2 className={`text-4xl font-extrabold tracking-tighter mb-4 ${totalPnL >= 0 ? 'text-white' : 'text-red-200'}`}>
//                             {totalPnL >= 0 ? `+₹${totalPnL.toFixed(2)}` : `-₹${Math.abs(totalPnL).toFixed(2)}`}
//                         </h2>

//                         <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
//                             <div>
//                                 <p className="text-[9px] text-blue-200 uppercase font-bold">Booked</p>
//                                 <p className="text-sm font-bold text-white">₹{/* Realized Data */}</p>
//                             </div>
//                             <div>
//                                 <p className="text-[9px] text-blue-200 uppercase font-bold">Running</p>
//                                 <p className="text-sm font-bold text-white">₹{/* Unrealized Data */}</p>
//                             </div>
//                         </div>
//                     </div>
                    
//                 {/* 🔥 BOTTOM SECTION: Broker Stack & Details */}
//                 <div className="bg-black/10 backdrop-blur-md p-4 flex justify-between items-center border-t border-white/5">
//                     {/* Bottom Left: Active Broker Name */}
//                     <span className="text-white text-xs font-bold uppercase tracking-wider">
//                         {activeBroker?.name || "No Broker"}
//                     </span>

//                     {/* Bottom Right: Smart Stacked Broker Logos */}
//                     <div className="flex -space-x-3">
//                         {/* 1. Sabse pehle Active Broker (Sabse aage aur upar) */}
//                         {activeBroker && (
//                             <div className="w-10 h-10 rounded-full border-2 border-purple-500 bg-white p-0.5 z-30 shadow-lg">
//                                 <img src={activeBroker.logo} alt="Active" className="w-full h-full object-contain rounded-full" />
//                             </div>
//                         )}

//                         {/* 2. Baki ke Brokers (Active ke pichhe) */}
//                         {brokers
//                             .filter(b => (b.id || b._id) !== (activeBroker?.id || activeBroker?._id))
//                             .slice(0, 2)
//                             .map((b, idx) => (
//                                 <div key={idx} className="w-8 h-8 rounded-full border-2 border-gray-400 bg-white p-0.2 z-10 shadow-sm relative" style={{ zIndex: 20 - idx }}>
//                                     <img src={b.logo} alt={b.name} className="w-full h-full object-contain rounded-full" />
//                                 </div>
//                             ))
//                         }
//                     </div>
//                 </div>
//                 </div>

//                 {/* B. BROKER STATUS CARD */}
//                 <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-colors min-h-[220px] relative">
//                     <div className="flex justify-between items-start" ref={dropdownRef}>
//                         <div className="flex-1">
//                             <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Broker</p>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 flex items-center justify-center bg-white">
//                                      <img src={activeBroker?.logo} className="w-full h-full object-contain" alt="icon"/>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="text-sm font-bold text-gray-800 dark:text-white leading-none">
//                                         {activeBroker?.name} 
//                                     </span>
//                                     <span className="text-blue-600 dark:text-blue-400 text-[10px] font-medium leading-tight">
//                                         ({activeBroker?.clientId})
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="relative">
//                             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
//                                 <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}/>
//                             </button>
//                             {isDropdownOpen && (
//                                 <div className="absolute right-0 top-8 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
//                                     <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
//                                         {brokers.map((b) => {
//                                         // 🔍 ID को साफ़ तरीके से compare करें (String में बदलकर ताकि कोई Type mismatch न हो)
//                                         const isActive = String(activeBroker?.id || activeBroker?._id) === String(b.id || b._id);
                                        
//                                         return (
//                                             <div 
//                                                 key={b.id || b._id} 
//                                                 onClick={() => handleBrokerSwitch(b)} 
//                                                 className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
//                                                     isActive 
//                                                         ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
//                                                         : 'hover:bg-gray-100 dark:hover:bg-slate-800 border border-transparent'
//                                                 }`}
//                                             >
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="w-7 h-7 rounded-full bg-white border border-gray-100 p-0.5 shadow-sm">
//                                                         <img src={b.logo} className="w-full h-full object-contain rounded-full"/>
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-xs font-bold text-gray-800 dark:text-white">{b.name}</p>
//                                                         <p className="text-[10px] text-gray-400">{b.clientId}</p>
//                                                     </div>
//                                                 </div>

//                                                 {/* ✅ Sirf active hone par hi tick dikhega */}
//                                                 {isActive && (
//                                                     <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
//                                                         <Check size={12} className="text-white"/>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                     </div>
//                                     <div className="p-2 border-t border-gray-100 dark:border-slate-800 text-center">
//                                         <button onClick={() => navigate('/add-brokers')} className="text-xs font-bold text-blue-600 hover:underline">+ Add New Broker</button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="my-4">
//                         <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Broker Login Status</p>
//                         <h3 className="text-xl font-bold flex items-center gap-2">
//                             {(activeBroker?.status === 'Connected' || activeBroker?.terminalOn) ? 
//                                 <span className="text-green-500">Connected</span> : 
//                                 <span className="text-red-500">Not Connected</span>
//                             }
//                         </h3>
//                     </div>

//                     <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800">
//                         <div className="flex flex-col gap-1">
//                             <span className="text-[10px] font-bold text-gray-400 uppercase">Terminal</span>
//                             <label className="relative inline-flex items-center cursor-pointer">
//                                 <input type="checkbox" className="sr-only peer" checked={activeBroker?.terminalOn || false} onChange={handleTerminalToggle} />
//                                 <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
//                             </label>
//                         </div>
//                         <div className="flex flex-col gap-1 items-end">
//                             <span className={`text-[10px] font-bold uppercase ${activeBroker?.terminalOn ? 'text-gray-400' : 'text-gray-300'}`}>Trading Engine</span>
//                             <label className={`relative inline-flex items-center cursor-pointer ${!activeBroker?.terminalOn ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                                 <input type="checkbox" className="sr-only peer" checked={activeBroker?.engineOn || false} onChange={handleEngineToggle} disabled={!activeBroker?.terminalOn}/>
//                                 <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
//                             </label>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         ) : (
//             // ✅ SCENARIO 1: NO BROKER (FIXED)
//             <div className="lg:col-span-8 bg-blue-600 rounded-xl shadow-lg flex flex-col justify-center items-center text-center overflow-hidden relative group p-8 min-h-[220px]">
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
//                 <div className="relative z-10 w-full max-w-lg">
//                     <h2 className="text-3xl font-bold text-white mb-3">Connect your broker</h2>
//                     <p className="text-blue-100 text-sm mb-6 leading-relaxed">
//                         Deploy, Manage & Track Your Strategies, All From One Broker Account. Get started by adding your first broker.
//                     </p>
//                     <button onClick={() => navigate('/add-brokers')} className="bg-white text-blue-600 px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:bg-gray-100 transition-all shadow-md active:scale-95">
//                         <Plus size={18} strokeWidth={3} /> Add Broker
//                     </button>
//                 </div>
//             </div>
//         )}

//         {/* RIGHT: Strategy Deployed */}
//         <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg p-6 flex flex-col transition-colors h-full min-h-[220px]">
            
//             <div className="flex justify-between items-start mb-4 shrink-0">
//                 <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-200">Strategy Deployed</h3>
//                 <button className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors">
//                     {isBrokerConnected ? activeBroker?.name : 'No broker'} <ChevronDown size={12}/>
//                 </button>
//             </div>

//             {activeDeployments.length > 0 ? (
//                 <>
//                     {/* 🔥 FIX: Removed overflow-y-auto to disable scrolling, using flex-col instead */}
//                     <div className="flex-1 flex flex-col space-y-3">
//                         {/* 🔥 FIX: Mapped over 'paginatedDeployments' instead of 'activeDeployments' */}
//                         {paginatedDeployments.map((dep) => {
//                             const strategyName = dep.strategyId?.name || 'Unknown Strategy';
//                             const isLive = dep.executionType === 'LIVE';
                            
//                             let currentPnl = 0;
//                             if (dep.executedLegs && dep.executedLegs.length > 0) {
//                                 currentPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
//                             }

//                             return (
//                                 <div 
//                                     key={dep._id || dep.id}
//                                     onClick={() => navigate('/strategies', { state: { activeTab: 'deployed' } })}
//                                     className="flex justify-between items-center p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 cursor-pointer transition-all group"
//                                 >
//                                     <div className="flex flex-col overflow-hidden">
//                                         <p className="text-[13px] font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate mb-1.5">
//                                             {strategyName}
//                                         </p>
//                                         <div className="flex items-center gap-2">
//                                             <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider
//                                                 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30' 
//                                                 : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'}`}
//                                             >
//                                                 {dep.executionType?.replace('_', ' ') || 'ACTIVE'}
//                                             </span>
//                                             <span className="text-[9px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
//                                                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_#22c55e]"></span> Running
//                                             </span>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="flex flex-col items-end shrink-0 pl-3 border-l border-gray-100 dark:border-slate-700/50">
//                                         <span className="text-[9px] text-gray-400 uppercase font-bold mb-1">Live P&L</span>
//                                         <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${currentPnl >= 0 ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'}`}>
//                                             ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
//                                         </span> 
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     {/* 🔥 NEW: Pagination Controls (Visible only if items > 3) */}
//                     {totalDeployedPages > 1 && (
//                         <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
//                             <button 
//                                 onClick={() => setDeployedPage(prev => Math.max(prev - 1, 1))}
//                                 disabled={deployedPage === 1}
//                                 className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 <ChevronLeft size={16} />
//                             </button>
//                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
//                                 Page {deployedPage} of {totalDeployedPages}
//                             </span>
//                             <button 
//                                 onClick={() => setDeployedPage(prev => Math.min(prev + 1, totalDeployedPages))}
//                                 disabled={deployedPage === totalDeployedPages}
//                                 className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 <ChevronRight size={16} />
//                             </button>
//                         </div>
//                     )}
//                 </>
//             ) : (
//                 <div className="flex-1 flex flex-col items-center justify-center text-center pb-2">
//                     <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-gray-400 dark:text-slate-500 shadow-inner">
//                         <Box size={20} />
//                     </div>
//                     <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">No Strategies Deployed</h4>
//                     <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 px-2 leading-tight">You haven't deployed any trading strategies yet.</p>
//                     <button onClick={() => navigate('/strategy-builder')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95">
//                         Create Strategy
//                     </button>
//                 </div>
//             )}
//         </div>
//       </div>

//       <div className="mb-8">
//         <div className="flex justify-between items-end mb-4">
//             <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
//                 Strategy Template <span className="text-pink-500 animate-pulse">❤️</span>
//             </h3>
//             <button onClick={() => navigate('/strategies', { state: { activeTab: 'templates' } })} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-all">
//                 See All <ArrowRight size={12}/>
//             </button>
//         </div>
        
//         {loadingTemplates ? (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {[1, 2, 3].map((_, idx) => (
//                     <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-pulse">
//                         <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
//                         <div className="h-20 bg-gray-50 dark:bg-slate-800/50 rounded w-full mb-4"></div>
//                         <div className="flex justify-between items-center"><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/3"></div><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/4"></div></div>
//                     </div>
//                 ))}
//             </div>
//         ) : featuredTemplates.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {featuredTemplates.slice(0, 3).map((template) => (
//                     <TemplateCard 
//                         key={template._id || template.id} 
//                         template={template} 
//                         isAdmin={false} // Dashboard par edit/delete nahi dikhana

//                         isAlreadyAdded={userStrategies.some(s => s.name.includes(template.name))}

//                         onUse={() => navigate('/strategies', { 
//                             state: { 
//                                 activeTab: 'templates', 
//                                 action: 'openDuplicateModal', 
//                                 templateData: template 
//                             } 
//                         })}
//                     />
//                 ))}
//             </div>
//         ) : (
//             <div className="bg-white dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-10 text-center shadow-sm">
//                 <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No featured templates yet. Admin can feature them by clicking the ❤️ icon in Strategy Templates.</p>
//             </div>
//         )}
//       </div>
      

        
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

//         <div className="lg:col-span-12">
//             <LiveLogTicker logs={logs} />
//         </div>
        
//         {/* LEFT: Join Us */}
//         <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors">
//             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-5">Join Us</h3>
//             <div className="space-y-4">
//                 {[
//                     { name: 'Telegram Channel', icon: <FaTelegramPlane size={18}/>, color: 'bg-blue-500' },
//                     { name: 'Youtube Channel', icon: <FaYoutube size={18}/>, color: 'bg-red-600' },
//                     { name: 'Instagram', icon: <FaInstagram size={18}/>, color: 'bg-pink-600' },
//                 ].map((social, i) => (
//                     <div key={i} className="flex items-center justify-between group">
//                         <div className="flex items-center gap-3">
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${social.color}`}>
//                                 {social.icon}
//                             </div>
//                             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{social.name}</span>
//                         </div>
//                         <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold transition-all shadow-sm active:scale-95">
//                             Join
//                         </button>
//                     </div>
//                 ))}
//             </div>
      
//         </div>

        

//            {/* RIGHT: Support */}
//         <div className="lg:col-span-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 flex flex-col justify-center relative overflow-hidden">
//             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
//             <div className="relative z-10">
//                 <h3 className="text-xl font-bold text-white mb-2">Need Help? We're Here for You!</h3>
//                 <p className="text-blue-100 text-sm mb-6 max-w-xl">
//                     Have questions or facing issues? Our support team is ready to assist you.
//                 </p>
//                 <div className="flex flex-wrap gap-4">
//                     <button className="bg-white text-green-600 hover:bg-green-50 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
//                         <FaWhatsapp size={18} /> WhatsApp
//                     </button>
//                     <button className="bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-400/30 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
//                         <Phone size={18} /> Call Us
//                     </button>
//                 </div>
//             </div>
//         </div>

        
//       </div>

//     </div>
//   );
// };

// export default AlgoDashboard;





import React, { useState, useEffect, useRef } from 'react';
import { Box, ChevronDown, ChevronLeft, ChevronRight, Check, ArrowRight, Phone, Plus, Eye, EyeOff } from 'lucide-react'; // 🔥 Eye, EyeOff added
import { FaTelegramPlane, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; 
import axios from 'axios'; 

import { getConnectedBrokers, updateBrokerStatus } from '../../data/AlogoTrade/brokerService';
import LiveLogTicker from '../../components/algoComponents/AlgoDashboard/LiveLogTicker';
import TemplateCard from '../../components/algoComponents/Strategies/TemplateCard';
import { fetchActiveDeployments } from '../../data/AlogoTrade/deploymentService';

// ✅ Connect to Backend Socket
const socket = io.connect(import.meta.env.VITE_SOCKET_URL);

const AlgoDashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [brokers, setBrokers] = useState([]);
  const [activeBroker, setActiveBroker] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 🔥 NEW: Advanced P&L State (Live & Paper separated with Booked/Running details)
  const [tradeMode, setTradeMode] = useState('LIVE'); // 'LIVE' or 'PAPER'
  const [isDetailsHidden, setIsDetailsHidden] = useState(false); // Eye icon toggle
  
  const [allBrokersPnl, setAllBrokersPnl] = useState({});
  
  const [userStrategies, setUserStrategies] = useState([]);
  const [activeDeployments, setActiveDeployments] = useState([]);

  // Pagination State for Deployed Strategies
  const [deployedPage, setDeployedPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  const [logs, setLogs] = useState([]);

  // Featured Templates State
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // --- 1. FETCH DATA & SOCKET LISTENER ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getConnectedBrokers();
            setBrokers(data);
            if (data && data.length > 0) {
                setActiveBroker(data[0]); 
            }
            
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/strategy-templates`);
            if (res.data) {
                const likedTemplates = res.data.filter(t => t.showOnDashboard === true || t.data?.templateConfig?.showOnDashboard === true);
                setFeaturedTemplates(likedTemplates);
            }

            const userStratsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/strategies`);
            if (userStratsRes.data) {
                setUserStrategies(userStratsRes.data);
            }

            try {
                const deploymentsData = await fetchActiveDeployments();
                setActiveDeployments(deploymentsData || []);
            } catch (depErr) {
                setActiveDeployments([]);
            }

        } catch (error) {
            console.error("Error loading dashboard data:", error);
            setUserStrategies([]); 
        } finally {
            setLoading(false);
            setLoadingTemplates(false);
        }
    };

    fetchData();

    // ✅ LIVE MARKET DATA LISTENER (Multi-Broker Update)
    socket.on("market-update", (data) => {
        // Ab data me saare brokers ka object aa raha hai: { "brokerId1": {...}, "brokerId2": {...} }
        setAllBrokersPnl(data);
    });

    return () => {
        socket.off("market-update");
    };
  }, []);

  // Dropdown Logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
      socket.on("log-update", (newLog) => {
          setLogs(prev => [newLog, ...prev].slice(0, 50)); 
      });
      return () => socket.off("log-update");
  }, []);

  const handleTerminalToggle = async () => {
    if (!activeBroker) return;
    if (!activeBroker.terminalOn) {
        navigate(`/broker-login/${activeBroker.id}?redirect=/algo-dashboard`);
    } else {
        const isConfirmed = window.confirm(`Disconnect ${activeBroker.name}?`);
        if(isConfirmed) {
            await updateBrokerStatus(activeBroker.id, false); 
            const updatedData = await getConnectedBrokers();
            setBrokers(updatedData);
            const updatedActive = updatedData.find(b => b._id === activeBroker._id || b.id === activeBroker.id);
            setActiveBroker(updatedActive);
        }
    }
  };

  const handleEngineToggle = () => {
      if(!activeBroker || !activeBroker.terminalOn) return; 
      const newEngineState = !activeBroker.engineOn;
      const updatedBroker = { ...activeBroker, engineOn: newEngineState };
      setActiveBroker(updatedBroker);
      const updatedList = brokers.map(b => (b.id === activeBroker.id || b._id === activeBroker._id) ? updatedBroker : b);
      setBrokers(updatedList);
  };

  const handleBrokerSwitch = (broker) => {
      setActiveBroker(broker);
      setIsDropdownOpen(false);
  };

  const isBrokerConnected = brokers.length > 0;
  const deployedStrategies = userStrategies.filter(s => s.status && s.status.toUpperCase() !== 'INACTIVE');

  const totalDeployedPages = Math.ceil(activeDeployments.length / ITEMS_PER_PAGE);
  const paginatedDeployments = activeDeployments.slice(
      (deployedPage - 1) * ITEMS_PER_PAGE,
      deployedPage * ITEMS_PER_PAGE
  );

  // 🔥 Smart Check: Koi trade running hai ya nahi (Blinking logic ke liye)
  const isTradeActive = activeDeployments.some(dep => dep.executionType === tradeMode && dep.status !== 'SQUARED_OFF');
  

  // 🔥 THE MAGIC: Filter data exactly for the selected Dropdown Broker
  const activeBrokerId = String(activeBroker?.id || activeBroker?._id);
  
  const brokerPnlData = allBrokersPnl[activeBrokerId] || {
      LIVE: { total: 0.00, booked: 0.00, running: 0.00, margin: 0.00 },
      PAPER: { total: 0.00, booked: 0.00, running: 0.00, margin: 1000000.00 }
  };
  
  // Current Mode ka Data (Live ya Paper)
  const currentPnlData = brokerPnlData[tradeMode];

  

  if (loading) {
      // ... (Loading Skeleton Code Same as before)
      return <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-300">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {isBrokerConnected ? (
            <>
                {/* 🌟 A. PORTFOLIO P&L CARD (ADVANCED UI) 🌟 */}
                <div className="lg:col-span-4 bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 rounded-2xl shadow-xl shadow-blue-500/20 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                    
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    <div className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-blue-100 text-[10px] font-extrabold uppercase tracking-widest opacity-90 drop-shadow-sm">
                                Portfolio P&L
                            </p>
                            
                            {/* 🔥 Switch Button: Live/Paper */}
                            <button 
                                onClick={() => setTradeMode(prev => prev === 'LIVE' ? 'PAPER' : 'LIVE')}
                                className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 transition-all px-2.5 py-1 rounded-full backdrop-blur-sm cursor-pointer border border-white/10 active:scale-95"
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${tradeMode === 'LIVE' ? 'bg-green-400' : 'bg-orange-400'} ${isTradeActive ? 'animate-pulse' : 'opacity-40'}`}></div>
                                <span className="text-[9px] font-bold text-white uppercase tracking-wider">{tradeMode}</span>
                            </button>
                        </div>

                        {/* Main MTM (Total P&L) - Hamesha Dikhega */}
                        <h2 className={`text-4xl font-extrabold tracking-tighter mb-5 drop-shadow-md ${currentPnlData.total >= 0 ? 'text-white' : 'text-red-200'}`}>
                            {currentPnlData.total >= 0 ? '+' : '-'}₹{Math.abs(currentPnlData.total).toFixed(2)}
                        </h2>

                        {/* Booked & Running Breakdown - Hamesha Dikhega */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mb-0.5">Booked</p>
                                <p className={`text-sm font-bold ${currentPnlData.booked >= 0 ? 'text-white' : 'text-red-200'}`}>
                                    ₹{currentPnlData.booked.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mb-0.5">Running</p>
                                <p className={`text-sm font-bold ${currentPnlData.running >= 0 ? 'text-white' : 'text-red-200'}`}>
                                    ₹{currentPnlData.running.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                {/* 🔥 BOTTOM SECTION: Broker Margin & Hide Icon (Eye Icon Sirf Yahan Kaam Karega) */}
                <div className="bg-black/20 backdrop-blur-md px-6 py-3 flex justify-between items-center border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-2">
                        {activeBroker && (
                            <div className="w-5 h-5 rounded-full bg-white p-0.5 flex items-center justify-center shadow-sm">
                                <img src={activeBroker.logo} alt="broker" className="w-full h-full rounded-full object-contain" />
                            </div>
                        )}
                        <span className="text-white text-[11px] font-bold uppercase tracking-wider drop-shadow-sm">
                            {activeBroker?.name || "SMART TRADER"}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[8px] text-blue-200/80 uppercase font-bold tracking-widest mb-0.5">Available Margin</p>
                            <p className="text-xs font-bold text-white tracking-wide">
                                {/* 👀 Sirf Available Margin hide/show hoga */}
                                {isDetailsHidden ? '••••••' : `₹${currentPnlData.margin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                            </p>
                        </div>
                        {/* Eye Toggle Icon */}
                        <button 
                            onClick={() => setIsDetailsHidden(!isDetailsHidden)} 
                            className="text-blue-200 hover:text-white transition-colors p-1"
                            title={isDetailsHidden ? "Show Balances" : "Hide Balances"}
                        >
                            {isDetailsHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
                </div>

                {/* B. BROKER STATUS CARD (Remains exactly the same) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-colors min-h-[220px] relative">
                    {/* ... Your Existing Broker Status Card Code ... */}
                    <div className="flex justify-between items-start" ref={dropdownRef}>
                        <div className="flex-1">
                            <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Broker</p>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 flex items-center justify-center bg-white">
                                     <img src={activeBroker?.logo} className="w-full h-full object-contain" alt="icon"/>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-800 dark:text-white leading-none">
                                        {activeBroker?.name} 
                                    </span>
                                    <span className="text-blue-600 dark:text-blue-400 text-[10px] font-medium leading-tight">
                                        ({activeBroker?.clientId})
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-8 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                                        {brokers.map((b) => {
                                        const isActive = String(activeBroker?.id || activeBroker?._id) === String(b.id || b._id);
                                        return (
                                            <div key={b.id || b._id} onClick={() => handleBrokerSwitch(b)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'hover:bg-gray-100 dark:hover:bg-slate-800 border border-transparent'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-white border border-gray-100 p-0.5 shadow-sm">
                                                        <img src={b.logo} className="w-full h-full object-contain rounded-full"/>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800 dark:text-white">{b.name}</p>
                                                        <p className="text-[10px] text-gray-400">{b.clientId}</p>
                                                    </div>
                                                </div>
                                                {isActive && (
                                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                        <Check size={12} className="text-white"/>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    </div>
                                    <div className="p-2 border-t border-gray-100 dark:border-slate-800 text-center">
                                        <button onClick={() => navigate('/add-brokers')} className="text-xs font-bold text-blue-600 hover:underline">+ Add New Broker</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="my-4">
                        <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Broker Login Status</p>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            {(activeBroker?.status === 'Connected' || activeBroker?.terminalOn) ? 
                                <span className="text-green-500">Connected</span> : 
                                <span className="text-red-500">Not Connected</span>
                            }
                        </h3>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Terminal</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={activeBroker?.terminalOn || false} onChange={handleTerminalToggle} />
                                <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                            </label>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <span className={`text-[10px] font-bold uppercase ${activeBroker?.terminalOn ? 'text-gray-400' : 'text-gray-300'}`}>Trading Engine</span>
                            <label className={`relative inline-flex items-center cursor-pointer ${!activeBroker?.terminalOn ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input type="checkbox" className="sr-only peer" checked={activeBroker?.engineOn || false} onChange={handleEngineToggle} disabled={!activeBroker?.terminalOn}/>
                                <div className="w-9 h-5 bg-gray-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            // ... (No Broker Component Remains Same)
            <div className="lg:col-span-8 bg-blue-600 rounded-xl shadow-lg flex flex-col justify-center items-center text-center overflow-hidden relative group p-8 min-h-[220px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 w-full max-w-lg">
                    <h2 className="text-3xl font-bold text-white mb-3">Connect your broker</h2>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                        Deploy, Manage & Track Your Strategies, All From One Broker Account. Get started by adding your first broker.
                    </p>
                    <button onClick={() => navigate('/add-brokers')} className="bg-white text-blue-600 px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:bg-gray-100 transition-all shadow-md active:scale-95">
                        <Plus size={18} strokeWidth={3} /> Add Broker
                    </button>
                </div>
            </div>
        )}

        {/* RIGHT: Strategy Deployed */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg p-6 flex flex-col transition-colors h-full min-h-[220px]">
            
            <div className="flex justify-between items-start mb-4 shrink-0">
                <h3 className="font-bold text-[15px] text-gray-800 dark:text-gray-200">Strategy Deployed</h3>
                <button className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {isBrokerConnected ? activeBroker?.name : 'No broker'} <ChevronDown size={12}/>
                </button>
            </div>

            {activeDeployments.length > 0 ? (
                <>
                    {/* 🔥 FIX: Removed overflow-y-auto to disable scrolling, using flex-col instead */}
                    <div className="flex-1 flex flex-col space-y-3">
                        {/* 🔥 FIX: Mapped over 'paginatedDeployments' instead of 'activeDeployments' */}
                        {paginatedDeployments.map((dep) => {
                            const strategyName = dep.strategyId?.name || 'Unknown Strategy';
                            const isLive = dep.executionType === 'LIVE';
                            
                            let currentPnl = 0;
                            if (dep.executedLegs && dep.executedLegs.length > 0) {
                                currentPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
                            }

                            return (
                                <div 
                                    key={dep._id || dep.id}
                                    onClick={() => navigate('/strategies', { state: { activeTab: 'deployed' } })}
                                    className="flex justify-between items-center p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 cursor-pointer transition-all group"
                                >
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="text-[13px] font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate mb-1.5">
                                            {strategyName}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider
                                                ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30' 
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'}`}
                                            >
                                                {dep.executionType?.replace('_', ' ') || 'ACTIVE'}
                                            </span>
                                            <span className="text-[9px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_#22c55e]"></span> Running
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end shrink-0 pl-3 border-l border-gray-100 dark:border-slate-700/50">
                                        <span className="text-[9px] text-gray-400 uppercase font-bold mb-1">Live P&L</span>
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${currentPnl >= 0 ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'}`}>
                                            ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
                                        </span> 
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 🔥 NEW: Pagination Controls (Visible only if items > 3) */}
                    {totalDeployedPages > 1 && (
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                            <button 
                                onClick={() => setDeployedPage(prev => Math.max(prev - 1, 1))}
                                disabled={deployedPage === 1}
                                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Page {deployedPage} of {totalDeployedPages}
                            </span>
                            <button 
                                onClick={() => setDeployedPage(prev => Math.min(prev + 1, totalDeployedPages))}
                                disabled={deployedPage === totalDeployedPages}
                                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center pb-2">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-gray-400 dark:text-slate-500 shadow-inner">
                        <Box size={20} />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">No Strategies Deployed</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 px-2 leading-tight">You haven't deployed any trading strategies yet.</p>
                    <button onClick={() => navigate('/strategy-builder')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95">
                        Create Strategy
                    </button>
                </div>
            )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                Strategy Template <span className="text-pink-500 animate-pulse">❤️</span>
            </h3>
            <button onClick={() => navigate('/strategies', { state: { activeTab: 'templates' } })} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-all">
                See All <ArrowRight size={12}/>
            </button>
        </div>
        
        {loadingTemplates ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                        <div className="h-20 bg-gray-50 dark:bg-slate-800/50 rounded w-full mb-4"></div>
                        <div className="flex justify-between items-center"><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/3"></div><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/4"></div></div>
                    </div>
                ))}
            </div>
        ) : featuredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTemplates.slice(0, 3).map((template) => (
                    <TemplateCard 
                        key={template._id || template.id} 
                        template={template} 
                        isAdmin={false} // Dashboard par edit/delete nahi dikhana

                        isAlreadyAdded={userStrategies.some(s => s.name.includes(template.name))}

                        onUse={() => navigate('/strategies', { 
                            state: { 
                                activeTab: 'templates', 
                                action: 'openDuplicateModal', 
                                templateData: template 
                            } 
                        })}
                    />
                ))}
            </div>
        ) : (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-10 text-center shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No featured templates yet. Admin can feature them by clicking the ❤️ icon in Strategy Templates.</p>
            </div>
        )}
      </div>
      

        
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-12">
            <LiveLogTicker logs={logs} />
        </div>
        
        {/* LEFT: Join Us */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-5">Join Us</h3>
            <div className="space-y-4">
                {[
                    { name: 'Telegram Channel', icon: <FaTelegramPlane size={18}/>, color: 'bg-blue-500' },
                    { name: 'Youtube Channel', icon: <FaYoutube size={18}/>, color: 'bg-red-600' },
                    { name: 'Instagram', icon: <FaInstagram size={18}/>, color: 'bg-pink-600' },
                ].map((social, i) => (
                    <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${social.color}`}>
                                {social.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{social.name}</span>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold transition-all shadow-sm active:scale-95">
                            Join
                        </button>
                    </div>
                ))}
            </div>
      
        </div>

        

           {/* RIGHT: Support */}
        <div className="lg:col-span-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Need Help? We're Here for You!</h3>
                <p className="text-blue-100 text-sm mb-6 max-w-xl">
                    Have questions or facing issues? Our support team is ready to assist you.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button className="bg-white text-green-600 hover:bg-green-50 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
                        <FaWhatsapp size={18} /> WhatsApp
                    </button>
                    <button className="bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-400/30 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
                        <Phone size={18} /> Call Us
                    </button>
                </div>
            </div>
        </div>

        
      </div>

    </div>
  );
};

export default AlgoDashboard;




