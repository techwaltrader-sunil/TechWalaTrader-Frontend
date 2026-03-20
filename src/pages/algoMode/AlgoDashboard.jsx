

// import React, { useState, useEffect, useRef } from 'react';
// import { Box, ChevronDown, Check, ArrowRight, Phone, Plus } from 'lucide-react';
// import { FaTelegramPlane, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client'; // ✅ Import Socket Client

// import { getConnectedBrokers, updateBrokerStatus } from '../../data/AlogoTrade/brokerService';

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

//   // --- 1. FETCH DATA & SOCKET LISTENER ---
//   useEffect(() => {
//     const fetchData = async () => {
//         try {
//             const data = await getConnectedBrokers();
//             setBrokers(data);
//             if (data && data.length > 0) {
//                 setActiveBroker(data[0]); 
//             }
//         } catch (error) {
//             console.error("Error loading dashboard data:", error);
//         } finally {
//             setLoading(false);
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

//   // Dropdown Logic... (Same as before)
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ... (handleTerminalToggle, handleEngineToggle, handleBrokerSwitch SAME rahenge) ...
//   // Mai code short rakh raha hu, purana logic copy kar lena agar miss ho jaye
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
//             setTotalPnL(0); // Disconnect hone par P&L 0 kar do
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
//         {/* Header Skeleton */}
//         <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded mb-6 animate-pulse"></div>

//         {/* Grid Skeleton */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
//           {/* Card 1 */}
//           <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//           {/* Card 2 */}
//           <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//           {/* Card 3 */}
//           <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//         </div>

//         {/* Templates Skeleton */}
//         <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded mb-4 animate-pulse"></div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//            <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//            <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//            <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
//         {isBrokerConnected ? (
//             <>
//                 {/* A. TOTAL P&L CARD (LIVE DATA) */}
//                 <div className="lg:col-span-4 bg-blue-600 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden min-h-[220px]">
//                     <div className="p-6 relative z-10">
//                         <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total P&L</p>
                        
//                         {/* ✅ LIVE P&L DISPLAY */}
//                         <h2 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${totalPnL >= 0 ? 'text-white' : 'text-red-200'}`}>
//                             {totalPnL >= 0 ? `+₹${totalPnL}` : `-₹${Math.abs(totalPnL)}`}
//                         </h2>
                        
//                         <p className="text-blue-200 text-xs font-medium flex items-center gap-2">
//                             <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//                             Live Market Data
//                         </p>
//                     </div>
                    
//                     <div className="bg-blue-700/40 backdrop-blur-sm p-4 flex justify-between items-center border-t border-blue-500/20">
//                         <span className="text-white text-sm font-bold capitalize">Sunil Kumar</span>
//                         <div className="flex -space-x-3">
//                             {brokers.slice(0, 3).map((b, idx) => (
//                                 <div key={idx} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-white p-0.5 z-10 shadow-sm relative" style={{ zIndex: 30 - idx }}>
//                                     <img src={b.logo} alt={b.name} className="w-full h-full object-contain rounded-full" />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* B. BROKER STATUS CARD (Same as before) */}
//                 <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-colors min-h-[220px] relative">
//                     {/* ... (Pura code same copy kar lena) ... */}
//                     {/* Mai bas changes highlight kar raha hu */}
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
//                         {/* Dropdown same rahega... */}
//                         <div className="relative">
//                             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
//                                 <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}/>
//                             </button>
//                             {isDropdownOpen && (
//                                 <div className="absolute right-0 top-8 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
//                                     <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
//                                         {brokers.map((b) => (
//                                             <div key={b.id || b._id} onClick={() => handleBrokerSwitch(b)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${(activeBroker.id === b.id || activeBroker._id === b._id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
//                                                 <div className="w-6 h-6 rounded-full border border-gray-200 dark:border-slate-700 bg-white p-0.5 flex items-center justify-center shrink-0">
//                                                     <img src={b.logo} alt="" className="w-full h-full object-contain rounded-full"/>
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className={`text-xs font-bold truncate ${(activeBroker.id === b.id || activeBroker._id === b._id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{b.name}</p>
//                                                     <p className="text-[10px] text-gray-500 truncate">{b.clientId}</p>
//                                                 </div>
//                                                 {(activeBroker.id === b.id || activeBroker._id === b._id) && <Check size={14} className="text-blue-600 dark:text-blue-400"/>}
//                                             </div>
//                                         ))}
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
//             // SCENARIO 1: NO BROKER
//             <div className="lg:col-span-8 bg-blue-600 rounded-xl shadow-lg flex flex-col justify-between overflow-hidden relative group p-8 min-h-[220px]">
//                 {/* ... Same as before ... */}
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
//                 <div className="relative z-10">
//                     <h2 className="text-2xl font-bold text-white mb-2">Connect to your broker</h2>
//                     <p className="text-blue-100 text-sm mb-6 max-w-lg leading-relaxed">Deploy, Manage & Track Your Strategies, All From One Broker Account.</p>
//                     <button onClick={() => navigate('/add-brokers')} className="bg-white text-blue-600 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-all shadow-md active:scale-95"><Plus size={16} strokeWidth={3} /> Add Broker</button>
//                 </div>
//                 <div className="absolute bottom-0 left-0 w-full bg-blue-700/50 backdrop-blur-sm p-3 px-8 text-white text-sm font-medium border-t border-blue-500/30 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                     Welcome, Sunil Kumar
//                 </div>
//             </div>
//         )}

//         {/* RIGHT: Strategy Deployed (Same) */}
//         <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg p-6 flex flex-col transition-colors min-h-[220px]">
//             {/* ... Same Code ... */}
//             <div className="flex justify-between items-start mb-6">
//                 <h3 className="font-bold text-gray-700 dark:text-gray-200">Strategy Deployed</h3>
//                 <button className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors">
//                     {isBrokerConnected ? activeBroker?.name : 'No broker selected'} <ChevronDown size={12}/>
//                 </button>
//             </div>
//             <div className="flex-1 flex flex-col items-center justify-center text-center">
//                 <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-slate-500"><Box size={28} /></div>
//                 <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">No Strategies Deployed</h4>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 px-4">You haven't deployed any trading strategies yet.</p>
//                 <button onClick={() => navigate('/strategy-builder')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">Create Strategy</button>
//             </div>
//         </div>
//       </div>

//       {/* Templates & Footer (Same as before) */}
//       {/* ... */}
//       <div className="mb-8">
//         <div className="flex justify-between items-end mb-4">
//             <h3 className="text-lg font-bold text-gray-800 dark:text-white">Strategy Templates</h3>
//             <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">See All <ArrowRight size={12}/></button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {templates.map((_, idx) => (
//                 <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer">
//                     <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-3/4 mb-3 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors"></div>
//                     <div className="h-20 bg-gray-50 dark:bg-slate-800/50 rounded w-full mb-4 border border-dashed border-gray-200 dark:border-slate-800"></div>
//                     <div className="flex justify-between items-center"><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/3"></div><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/4"></div></div>
//                 </div>
//             ))}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
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
//         <div className="lg:col-span-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-8 flex flex-col justify-center relative overflow-hidden">
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
import { Box, ChevronDown, Check, ArrowRight, Phone, Plus } from 'lucide-react';
import { FaTelegramPlane, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; 

import { getConnectedBrokers, updateBrokerStatus } from '../../data/AlogoTrade/brokerService';

// ✅ Connect to Backend Socket
const socket = io.connect(import.meta.env.VITE_SOCKET_URL);

const AlgoDashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [brokers, setBrokers] = useState([]);
  const [activeBroker, setActiveBroker] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // ✅ Live P&L State
  const [totalPnL, setTotalPnL] = useState(0.00); 

  // --- 1. FETCH DATA & SOCKET LISTENER ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getConnectedBrokers();
            setBrokers(data);
            if (data && data.length > 0) {
                setActiveBroker(data[0]); 
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();

    // ✅ LIVE MARKET DATA LISTENER
    socket.on("market-update", (data) => {
        // Agar broker connected hai tabhi P&L update karo
        setTotalPnL(data.pnl);
    });

    // Cleanup
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
            setTotalPnL(0); 
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
  const templates = [1, 2, 3]; 

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          <div className="lg:col-span-4 h-[220px] bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
           <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
           <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {isBrokerConnected ? (
            <>
                {/* A. TOTAL P&L CARD (LIVE DATA) */}
                <div className="lg:col-span-4 bg-blue-600 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                    <div className="p-6 relative z-10">
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total P&L</p>
                        <h2 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${totalPnL >= 0 ? 'text-white' : 'text-red-200'}`}>
                            {totalPnL >= 0 ? `+₹${totalPnL}` : `-₹${Math.abs(totalPnL)}`}
                        </h2>
                        <p className="text-blue-200 text-xs font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Live Market Data
                        </p>
                    </div>
                    
                    <div className="bg-blue-700/40 backdrop-blur-sm p-4 flex justify-between items-center border-t border-blue-500/20">
                        <span className="text-white text-sm font-bold capitalize">Sunil Kumar</span>
                        <div className="flex -space-x-3">
                            {brokers.slice(0, 3).map((b, idx) => (
                                <div key={idx} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-white p-0.5 z-10 shadow-sm relative" style={{ zIndex: 30 - idx }}>
                                    <img src={b.logo} alt={b.name} className="w-full h-full object-contain rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* B. BROKER STATUS CARD */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col justify-between transition-colors min-h-[220px] relative">
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
                                        {brokers.map((b) => (
                                            <div key={b.id || b._id} onClick={() => handleBrokerSwitch(b)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${(activeBroker.id === b.id || activeBroker._id === b._id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                                                <div className="w-6 h-6 rounded-full border border-gray-200 dark:border-slate-700 bg-white p-0.5 flex items-center justify-center shrink-0">
                                                    <img src={b.logo} alt="" className="w-full h-full object-contain rounded-full"/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-bold truncate ${(activeBroker.id === b.id || activeBroker._id === b._id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{b.name}</p>
                                                    <p className="text-[10px] text-gray-500 truncate">{b.clientId}</p>
                                                </div>
                                                {(activeBroker.id === b.id || activeBroker._id === b._id) && <Check size={14} className="text-blue-600 dark:text-blue-400"/>}
                                            </div>
                                        ))}
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
            // ✅ SCENARIO 1: NO BROKER (FIXED)
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
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg p-6 flex flex-col transition-colors min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-gray-700 dark:text-gray-200">Strategy Deployed</h3>
                <button className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {isBrokerConnected ? activeBroker?.name : 'No broker selected'} <ChevronDown size={12}/>
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-slate-500"><Box size={28} /></div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">No Strategies Deployed</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 px-4">You haven't deployed any trading strategies yet.</p>
                <button onClick={() => navigate('/strategy-builder')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">Create Strategy</button>
            </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Strategy Templates</h3>
            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">See All <ArrowRight size={12}/></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((_, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-3/4 mb-3 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 transition-colors"></div>
                    <div className="h-20 bg-gray-50 dark:bg-slate-800/50 rounded w-full mb-4 border border-dashed border-gray-200 dark:border-slate-800"></div>
                    <div className="flex justify-between items-center"><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/3"></div><div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/4"></div></div>
                </div>
            ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
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
        <div className="lg:col-span-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-8 flex flex-col justify-center relative overflow-hidden">
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