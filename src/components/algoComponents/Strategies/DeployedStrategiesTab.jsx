import React, { useState, useEffect } from 'react';
import { PlayCircle, StopCircle, Activity, AlertCircle } from 'lucide-react';
import { fetchActiveDeployments } from './path-to-your-service'; // Apna path daalein

const DeployedStrategiesTab = () => {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);

    // API se data mangwana
    useEffect(() => {
        const loadDeployments = async () => {
            setLoading(true);
            const data = await fetchActiveDeployments();
            setDeployments(data);
            setLoading(false);
        };
        loadDeployments();

        // Optional: Har 10 second me P&L update karne ke liye interval laga sakte hain
        // const interval = setInterval(loadDeployments, 10000);
        // return () => clearInterval(interval);
    }, []);

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {deployments.map((dep) => {
                const strategyName = dep.strategyId?.name || 'Unknown Strategy';
                const isLive = dep.executionType === 'LIVE';

                return (
                    <div key={dep._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                        
                        {/* Green Glowing Indicator for Active Status */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                        <div className="p-5 border-b border-gray-100 dark:border-slate-700">
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
                        </div>

                        {/* Live P&L Section */}
                        <div className="p-5 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
                            <div>
                                <p className="text-xs font-bold text-gray-500 mb-1">Live P&L</p>
                                {/* Abhi ke liye dummy PnL, baad me backend se aayega */}
                                <p className={`text-xl font-bold flex items-center gap-1 ${dep.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ₹ {dep.pnl >= 0 ? `+${dep.pnl.toFixed(2)}` : dep.pnl.toFixed(2)}
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => alert("Stop Logic Backend mein banayenge!")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-200 dark:border-red-500/30 transition-colors"
                            >
                                <StopCircle size={16} /> Stop Algo
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DeployedStrategiesTab;