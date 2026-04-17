// import React, { useState, useEffect } from 'react';
// // 🔥 FIX 1: Loader2 ko import me add kar diya
// import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2 } from 'lucide-react'; 
// import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService'; 

// const DeployedStrategiesTab = () => {
//     const [deployments, setDeployments] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     // 🔥 FIX 2: Ye line miss ho gayi thi, jiske wajah se "stoppingId not defined" aa raha tha
//     const [stoppingId, setStoppingId] = useState(null); 

//     // API se data mangwana
//     useEffect(() => {
//         const loadDeployments = async () => {
//             setLoading(true);
//             const data = await fetchActiveDeployments();
//             setDeployments(data);
//             setLoading(false);
//         };
//         loadDeployments();
//     }, []); // 🔥 FIX 3: useEffect ko yahin close kar diya

//     // 🔥 FIX 4: handleStopAlgo ko useEffect ke BAHAR nikal diya
//     const handleStopAlgo = async (deploymentId) => {
//         if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
//             setStoppingId(deploymentId); // Button pe loading start
//             try {
//                 await stopDeployment(deploymentId); // Backend API call
                
//                 // UI se us card ko hata do kyunki ab wo ACTIVE nahi hai
//                 setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
//                 alert("Algo Stopped Successfully!");
                
//             } catch (error) {
//                 console.error("Failed to stop algo:", error);
//                 alert("Failed to stop algo. Please try again.");
//             } finally {
//                 setStoppingId(null); // Loading stop
//             }
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;
//     }

//     if (deployments.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
//                 <AlertCircle size={48} className="text-gray-400 mb-4" />
//                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
//                 <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {deployments.map((dep) => {
//                 const strategyName = dep.strategyId?.name || 'Unknown Strategy';
//                 const isLive = dep.executionType === 'LIVE';
//                 const isStopping = stoppingId === dep._id;

//                 return (
//                     <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                        
//                         {/* Green Glowing Indicator for Active Status */}
//                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

//                         <div className="p-5 border-b border-gray-100 dark:border-slate-700">
//                             <div className="flex justify-between items-start mb-3">
//                                 <div>
//                                     <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
//                                     <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
//                                         <PlayCircle size={12} className="text-green-500" />
//                                         Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </p>
//                                 </div>
//                                 <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
//                                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
//                                     {dep.executionType}
//                                 </span>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4 mt-4">
//                                 <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                     <p className="text-[10px] text-gray-500 mb-1 font-bold">Multiplier</p>
//                                     <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
//                                 </div>
//                                 <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                     <p className="text-[10px] text-gray-500 mb-1 font-bold">Target Time</p>
//                                     <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Live P&L Section */}
//                         <div className="p-5 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
//                             <div>
//                                 <p className="text-xs font-bold text-gray-500 mb-1">Live P&L</p>
//                                 {/* 🔥 FIX 5: dep.pnl agar null ho to error na aaye isliye ?. lagaya */}
//                                 <p className={`text-xl font-bold flex items-center gap-1 ${dep.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                     ₹ {dep.pnl >= 0 ? `+${dep.pnl?.toFixed(2) || '0.00'}` : dep.pnl?.toFixed(2) || '0.00'}
//                                 </p>
//                             </div>
                            
//                             {/* ✅ STOP BUTTON UPDATE */}
//                             <button 
//                                 onClick={() => handleStopAlgo(dep._id)}
//                                 disabled={isStopping}
//                                 className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/30 transition-all active:scale-95"
//                             >
//                                 {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
//                                 {isStopping ? 'Stopping...' : 'Stop Algo'}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default DeployedStrategiesTab;


// import React, { useState, useEffect } from 'react';
// // 🔥 FIX 1: Loader2 ko import me add kar diya
// import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2 } from 'lucide-react'; 
// import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService';
 

// const DeployedStrategiesTab = () => {
//     const [deployments, setDeployments] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     // 🔥 FIX 2: Ye line miss ho gayi thi, jiske wajah se "stoppingId not defined" aa raha tha
//     const [stoppingId, setStoppingId] = useState(null); 

//     // API se data mangwana
//     useEffect(() => {
//         const loadDeployments = async () => {
//             setLoading(true);
//             const data = await fetchActiveDeployments();
//             setDeployments(data);
//             setLoading(false);
//         };
//         loadDeployments();
//     }, []); // 🔥 FIX 3: useEffect ko yahin close kar diya

//     // 🔥 FIX 4: handleStopAlgo ko useEffect ke BAHAR nikal diya
//     const handleStopAlgo = async (deploymentId) => {
//         if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
//             setStoppingId(deploymentId); // Button pe loading start
//             try {
//                 await stopDeployment(deploymentId); // Backend API call
                
//                 // UI se us card ko hata do kyunki ab wo ACTIVE nahi hai
//                 setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
//                 alert("Algo Stopped Successfully!");
                
//             } catch (error) {
//                 console.error("Failed to stop algo:", error);
//                 alert("Failed to stop algo. Please try again.");
//             } finally {
//                 setStoppingId(null); // Loading stop
//             }
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;
//     }

//     if (deployments.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
//                 <AlertCircle size={48} className="text-gray-400 mb-4" />
//                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
//                 <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {deployments.map((dep) => {
//                 const strategyName = dep.strategyId?.name || 'Unknown Strategy';
//                 const isLive = dep.executionType === 'LIVE';
//                 const isStopping = stoppingId === dep._id;

//                 return (
//                     <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                        
//                         {/* Green Glowing Indicator for Active Status */}
//                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

//                         <div className="p-5 border-b border-gray-100 dark:border-slate-700">
//                             <div className="flex justify-between items-start mb-3">
//                                 <div>
//                                     <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
//                                     <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
//                                         <PlayCircle size={12} className="text-green-500" />
//                                         Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </p>
//                                 </div>
//                                 <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
//                                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
//                                     {dep.executionType}
//                                 </span>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4 mt-4">
//                                 <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                     <p className="text-[10px] text-gray-500 mb-1 font-bold">Multiplier</p>
//                                     <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
//                                 </div>
//                                 <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                     <p className="text-[10px] text-gray-500 mb-1 font-bold">Target Time</p>
//                                     <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Live P&L Section */}
//                         <div className="p-5 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
//                             <div>
//                                 <p className="text-xs font-bold text-gray-500 mb-1">Live P&L</p>
//                                 {/* 🔥 FIX 5: dep.pnl agar null ho to error na aaye isliye ?. lagaya */}
//                                 <p className={`text-xl font-bold flex items-center gap-1 ${dep.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                     ₹ {dep.pnl >= 0 ? `+${dep.pnl?.toFixed(2) || '0.00'}` : dep.pnl?.toFixed(2) || '0.00'}
//                                 </p>
//                             </div>
                            
//                             {/* ✅ STOP BUTTON UPDATE */}
//                             <button 
//                                 onClick={() => handleStopAlgo(dep._id)}
//                                 disabled={isStopping}
//                                 className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/30 transition-all active:scale-95"
//                             >
//                                 {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
//                                 {isStopping ? 'Stopping...' : 'Stop Algo'}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default DeployedStrategiesTab;



// import React, { useState, useEffect } from 'react';
// // 🔥 FIX 1: Loader2 ko import me add kar diya
// import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2 } from 'lucide-react'; 
// import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService';
// import io from 'socket.io-client'; // 🔥 NAYA: Socket client import kiya

// const DeployedStrategiesTab = () => {
//     const [deployments, setDeployments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [stoppingId, setStoppingId] = useState(null); 

//     // 🔥 NAYA: Live P&L ko store karne ke liye state (Format: { deploymentId: pnlValue })
//     const [livePnls, setLivePnls] = useState({});

//     // API se data mangwana
//     useEffect(() => {
//         const loadDeployments = async () => {
//             setLoading(true);
//             const data = await fetchActiveDeployments();
//             setDeployments(data);
//             setLoading(false);
//         };
//         loadDeployments();
//     }, []); 

//     // 🔥 NAYA: Socket.io Connection for Live P&L
//     useEffect(() => {
//         // Backend ke URL se connect karo
//         const socket = io(`${import.meta.env.VITE_API_URL || 'https://techwalatrader-algobackend.onrender.com'}`);

//         // Backend se aane wale P&L data ko suno aur state update karo
//         socket.on('live-pnl-update', (pnlData) => {
//             setLivePnls(pnlData); 
//         });

//         // Component unmount hone par socket disconnect kar do
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     // Algo Stop Logic
//     const handleStopAlgo = async (deploymentId) => {
//         if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
//             setStoppingId(deploymentId); 
//             try {
//                 await stopDeployment(deploymentId); 
                
//                 // UI se us card ko hata do kyunki ab wo ACTIVE nahi hai
//                 setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
//                 alert("Algo Stopped Successfully!");
                
//             } catch (error) {
//                 console.error("Failed to stop algo:", error);
//                 alert("Failed to stop algo. Please try again.");
//             } finally {
//                 setStoppingId(null); 
//             }
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;
//     }

//     if (deployments.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
//                 <AlertCircle size={48} className="text-gray-400 mb-4" />
//                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
//                 <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {deployments.map((dep) => {
//                 const strategyName = dep.strategyId?.name || 'Unknown Strategy';
//                 const isLive = dep.executionType === 'LIVE';
//                 const isStopping = stoppingId === dep._id;

//                 // 🔥 NAYA: P&L ki value socket state se lo, agar nahi hai to 0 dikhao
//                 const currentPnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : (dep.pnl || 0);

//                 return (
//                     <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                        
//                         {/* Green Glowing Indicator for Active Status */}
//                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

//                         <div className="p-5 border-b border-gray-100 dark:border-slate-700">
//                             <div className="flex justify-between items-start mb-3">
//                                 <div>
//                                     <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
//                                     <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
//                                         <PlayCircle size={12} className="text-green-500" />
//                                         Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </p>
//                                 </div>
//                                 <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
//                                     <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
//                                     {dep.executionType}
//                                 </span>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4 mt-4">
//                                 <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                     <p className="text-[10px] text-gray-500 mb-1 font-bold">Multiplier</p>
//                                     <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
//                                 </div>
//                                 <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                     <p className="text-[10px] text-gray-500 mb-1 font-bold">Target Time</p>
//                                     <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Live P&L Section */}
//                         <div className="p-5 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
//                             <div>
//                                 <p className="text-xs font-bold text-gray-500 mb-1">Live P&L</p>
//                                 {/* 🔥 FIX 5: Dynamic Color aur Live Data (transition-colors add kiya taaki smooth change ho) */}
//                                 <p className={`text-xl font-bold flex items-center gap-1 transition-colors duration-300 ${currentPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                     ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
//                                 </p>
//                             </div>
                            
//                             {/* ✅ STOP BUTTON UPDATE */}
//                             <button 
//                                 onClick={() => handleStopAlgo(dep._id)}
//                                 disabled={isStopping}
//                                 className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/30 transition-all active:scale-95"
//                             >
//                                 {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
//                                 {isStopping ? 'Stopping...' : 'Stop Algo'}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default DeployedStrategiesTab;


// import React, { useState, useEffect } from 'react';
// // 🔥 FIX: Wallet aur BarChart2 icons add kiye MTM Dashboard ke liye
// import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2, Wallet, BarChart2 } from 'lucide-react'; 
// import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService';
// import io from 'socket.io-client'; 

// const DeployedStrategiesTab = () => {
//     const [deployments, setDeployments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [stoppingId, setStoppingId] = useState(null); 
//     const [livePnls, setLivePnls] = useState({});

//     // API se data mangwana
//     useEffect(() => {
//         const loadDeployments = async () => {
//             setLoading(true);
//             const data = await fetchActiveDeployments();
//             setDeployments(data);
//             setLoading(false);
//         };
//         loadDeployments();
//     }, []); 

//     // Socket.io Connection
//     useEffect(() => {
//         const socket = io(`${import.meta.env.VITE_API_URL || 'https://techwalatrader-algobackend.onrender.com'}`);

//         socket.on('live-pnl-update', (pnlData) => {
//             setLivePnls(pnlData); 
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     // Algo Stop Logic
//     const handleStopAlgo = async (deploymentId) => {
//         if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
//             setStoppingId(deploymentId); 
//             try {
//                 await stopDeployment(deploymentId); 
//                 setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
//                 alert("Algo Stopped Successfully!");
//             } catch (error) {
//                 console.error("Failed to stop algo:", error);
//                 alert("Failed to stop algo. Please try again.");
//             } finally {
//                 setStoppingId(null); 
//             }
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;
//     }

//     if (deployments.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
//                 <AlertCircle size={48} className="text-gray-400 mb-4" />
//                 <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
//                 <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
//             </div>
//         );
//     }

//     // 🔥 NAYA: Total MTM Calculate karna (Saare active cards ke P&L ka jodh)
//     const totalMTM = deployments.reduce((acc, dep) => {
//         const pnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : (dep.pnl || 0);
//         return acc + parseFloat(pnl);
//     }, 0);

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
//             {/* ========================================== */}
//             {/* 🌟 TOTAL MTM DASHBOARD (NEW) 🌟 */}
//             {/* ========================================== */}
//             <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
                
//                 {/* Left Side: Live MTM */}
//                 <div className="flex items-center gap-5">
//                     <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${totalMTM >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
//                         <Wallet size={28} />
//                     </div>
//                     <div>
//                         <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Live MTM</p>
//                         <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold transition-colors duration-300 tracking-tight ${totalMTM >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                             ₹ {totalMTM >= 0 ? `+${totalMTM.toFixed(2)}` : totalMTM.toFixed(2)}
//                         </h1>
//                     </div>
//                 </div>

//                 {/* Right Side: Quick Stats */}
//                 <div className="flex gap-4 w-full md:w-auto">
//                     <div className="flex-1 md:flex-none bg-gray-50 dark:bg-slate-900/50 px-6 py-4 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center transition-colors">
//                         <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5"><Activity size={12}/> Active Algos</p>
//                         <p className="text-2xl font-black text-gray-800 dark:text-white">{deployments.length}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* ========================================== */}
//             {/* 🃏 STRATEGY CARDS GRID */}
//             {/* ========================================== */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {deployments.map((dep) => {
//                     const strategyName = dep.strategyId?.name || 'Unknown Strategy';
//                     const isLive = dep.executionType === 'LIVE';
//                     const isStopping = stoppingId === dep._id;

//                     const currentPnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : (dep.pnl || 0);

//                     return (
//                         <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
                            
//                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

//                             <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex-1">
//                                 <div className="flex justify-between items-start mb-3">
//                                     <div>
//                                         <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
//                                         <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
//                                             <PlayCircle size={12} className="text-green-500" />
//                                             Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                         </p>
//                                     </div>
//                                     <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
//                                         <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
//                                         {dep.executionType}
//                                     </span>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4 mt-4">
//                                     <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                         <p className="text-[10px] text-gray-500 mb-1 font-bold">Multiplier</p>
//                                         <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
//                                     </div>
//                                     <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
//                                         <p className="text-[10px] text-gray-500 mb-1 font-bold">Target Time</p>
//                                         <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="p-5 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 mt-auto">
//                                 <div>
//                                     <p className="text-xs font-bold text-gray-500 mb-1">Live P&L</p>
//                                     <p className={`text-xl font-bold flex items-center gap-1 transition-colors duration-300 ${currentPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                                         ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
//                                     </p>
//                                 </div>
                                
//                                 <button 
//                                     onClick={() => handleStopAlgo(dep._id)}
//                                     disabled={isStopping}
//                                     className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/30 transition-all active:scale-95"
//                                 >
//                                     {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
//                                     {isStopping ? 'Stopping...' : 'Stop Algo'}
//                                 </button>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default DeployedStrategiesTab;



import React, { useState, useEffect } from 'react';
import { PlayCircle, StopCircle, Activity, AlertCircle, Loader2, Wallet, BarChart2 } from 'lucide-react'; 
import { fetchActiveDeployments, stopDeployment } from '../../../data/AlogoTrade/deploymentService';
import io from 'socket.io-client'; 

const DeployedStrategiesTab = () => {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stoppingId, setStoppingId] = useState(null); 
    const [livePnls, setLivePnls] = useState({});

    // API se data mangwana
    useEffect(() => {
        const loadDeployments = async () => {
            setLoading(true);
            const data = await fetchActiveDeployments();
            setDeployments(data);
            setLoading(false);
        };
        loadDeployments();
    }, []); 

    // Socket.io Connection
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_API_URL || 'https://techwalatrader-algobackend.onrender.com'}`);

        socket.on('live-pnl-update', (pnlData) => {
            setLivePnls(pnlData); 
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Algo Stop Logic
    const handleStopAlgo = async (deploymentId) => {
        if (window.confirm("Are you sure you want to stop this algorithm? All active monitoring will halt.")) {
            setStoppingId(deploymentId); 
            try {
                await stopDeployment(deploymentId); 
                setDeployments(prev => prev.filter(dep => dep._id !== deploymentId));
                alert("Algo Stopped Successfully!");
            } catch (error) {
                console.error("Failed to stop algo:", error);
                alert("Failed to stop algo. Please try again.");
            } finally {
                setStoppingId(null); 
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center py-10"><Activity className="animate-spin text-blue-500" size={32} /></div>;
    }

    if (deployments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <AlertCircle size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Active Strategies</h3>
                <p className="text-sm text-gray-500 mt-2">Deploy a strategy from 'My Strategies' tab to see it running here.</p>
            </div>
        );
    }

    // 🔥 NAYA: Total MTM Calculate karna (Saare legs ka live PnL jod kar)
    const totalMTM = deployments.reduce((acc, dep) => {
        // 1. Is deployment ke saare legs ka PnL jodo
        let legSumPnl = 0;
        if (dep.executedLegs && dep.executedLegs.length > 0) {
            legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
        }
        
        // 2. Socket data lo, warna legSumPnl use karo
        const pnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;
        return acc + parseFloat(pnl);
    }, 0);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* ========================================== */}
            {/* 🌟 TOTAL MTM DASHBOARD 🌟 */}
            {/* ========================================== */}
            <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
                
                {/* Left Side: Live MTM */}
                <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${totalMTM >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                        <Wallet size={28} />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Live MTM</p>
                        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold transition-colors duration-300 tracking-tight ${totalMTM >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            ₹ {totalMTM >= 0 ? `+${totalMTM.toFixed(2)}` : totalMTM.toFixed(2)}
                        </h1>
                    </div>
                </div>

                {/* Right Side: Quick Stats */}
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-gray-50 dark:bg-slate-900/50 px-6 py-4 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center transition-colors">
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5"><Activity size={12}/> Active Algos</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-white">{deployments.length}</p>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* 🃏 STRATEGY CARDS GRID */}
            {/* ========================================== */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deployments.map((dep) => {
                    const strategyName = dep.strategyId?.name || 'Unknown Strategy';
                    const isLive = dep.executionType === 'LIVE';
                    const isStopping = stoppingId === dep._id;

                    // 🔥 FIX: Card ka Total P&L nikalne ke liye saare legs ko jodo
                    let legSumPnl = 0;
                    if (dep.executedLegs && dep.executedLegs.length > 0) {
                        legSumPnl = dep.executedLegs.reduce((sum, leg) => sum + (leg.livePnl || 0), 0);
                    }
                    
                    const currentPnl = livePnls[dep._id] !== undefined ? livePnls[dep._id] : legSumPnl;

                    return (
                        <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
                            
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                            <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{strategyName}</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                                            <PlayCircle size={12} className="text-green-500" />
                                            Running since {new Date(dep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 ${isLive ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                        {dep.executionType}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
                                        <p className="text-[10px] text-gray-500 mb-1 font-bold">Multiplier</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.multiplier}x</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-700">
                                        <p className="text-[10px] text-gray-500 mb-1 font-bold">Target Time</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{dep.squareOffTime}</p>
                                    </div>
                                </div>

                                {/* 🔥 NEW: INDIVIDUAL LEG P&L BREAKDOWN 🔥 */}
                                {dep.executedLegs && dep.executedLegs.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Leg Status</p>
                                        {dep.executedLegs.map((leg, idx) => {
                                            const legPnl = leg.livePnl || 0;
                                            const isLegProfit = legPnl >= 0;
                                            const isCompleted = leg.status === 'COMPLETED';

                                            return (
                                                <div key={idx} className={`flex justify-between items-center p-2.5 rounded border transition-colors ${isCompleted ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 opacity-60' : 'bg-gray-50 dark:bg-slate-900/40 border-gray-100 dark:border-slate-700'}`}>
                                                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 line-clamp-1 pr-2 flex items-center gap-1.5">
                                                        <span className={`font-bold ${leg.action === 'BUY' ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>{leg.action}</span>
                                                        {leg.symbol}
                                                    </span>
                                                    <div className="flex flex-col items-end">
                                                        <span className={`text-[11px] font-bold whitespace-nowrap ${isLegProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                            ₹ {isLegProfit ? `+${legPnl.toFixed(2)}` : legPnl.toFixed(2)}
                                                        </span>
                                                        {isCompleted && <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Closed</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 mt-auto">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-1">Total Live P&L</p>
                                    <p className={`text-xl font-bold flex items-center gap-1 transition-colors duration-300 ${currentPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        ₹ {currentPnl >= 0 ? `+${currentPnl.toFixed(2)}` : currentPnl.toFixed(2)}
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => handleStopAlgo(dep._id)}
                                    disabled={isStopping}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/30 transition-all active:scale-95"
                                >
                                    {isStopping ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />} 
                                    {isStopping ? 'Stopping...' : 'Stop Algo'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeployedStrategiesTab;