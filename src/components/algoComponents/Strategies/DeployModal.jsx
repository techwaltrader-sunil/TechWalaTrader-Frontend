
import React, { useState } from 'react';
import { X, Rocket, ShieldCheck, AlertTriangle } from 'lucide-react';

const DeployModal = ({ isOpen, onClose, strategy, onConfirmDeploy }) => {
  const [executionType, setExecutionType] = useState('PAPER'); // 'PAPER' or 'LIVE'
  const [multiplier, setMultiplier] = useState(1);
  const [broker, setBroker] = useState('Angel One'); // Default Broker

  if (!isOpen || !strategy) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm animate-in fade-in transition-colors">
        {/* ✅ Modal Content: Light (White) | Dark (Slate-950) */}
        <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl w-[450px] shadow-2xl relative transition-colors duration-300">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900 rounded-t-xl transition-colors">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Rocket className="text-blue-600 dark:text-blue-500" size={20}/>
                        Deploy Strategy
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{strategy.name}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                    <X size={20}/>
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
                
                {/* 1. Execution Mode */}
                <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Execution Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setExecutionType('PAPER')}
                            className={`py-2.5 px-4 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2
                                ${executionType === 'PAPER' 
                                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' 
                                    : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'}
                            `}
                        >
                            <ShieldCheck size={14} /> Paper Trading
                        </button>
                        <button 
                            onClick={() => setExecutionType('LIVE')}
                            className={`py-2.5 px-4 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2
                                ${executionType === 'LIVE' 
                                    ? 'bg-green-50 dark:bg-green-500/10 border-green-500 text-green-600 dark:text-green-400' 
                                    : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'}
                            `}
                        >
                            <Rocket size={14} /> Live Trading
                        </button>
                    </div>
                </div>

                {/* 2. Broker Selection (Only if LIVE) */}
                {executionType === 'LIVE' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Select Broker</label>
                        <select 
                            value={broker} 
                            onChange={(e) => setBroker(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                        >
                            <option>Angel One</option>
                            <option>Zerodha</option>
                            <option>Dhan</option>
                            <option>Fyers</option>
                        </select>
                    </div>
                )}

                {/* 3. Multiplier */}
                <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Quantity Multiplier (x)</label>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMultiplier(Math.max(1, multiplier - 1))} className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-bold transition-colors">-</button>
                        <input 
                            type="number" 
                            value={multiplier}
                            readOnly
                            className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 h-10 text-center text-gray-900 dark:text-white font-bold rounded outline-none transition-colors"
                        />
                        <button onClick={() => setMultiplier(multiplier + 1)} className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-bold transition-colors">+</button>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                        Base Qty: {strategy.legs?.[0]?.qty || 1} x {multiplier} = <span className="text-gray-900 dark:text-white font-bold">{(strategy.legs?.[0]?.qty || 1) * multiplier}</span>
                    </p>
                </div>

                {/* Warning */}
                {executionType === 'LIVE' && (
                    <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 p-3 rounded-lg flex gap-3 items-start transition-colors">
                        <AlertTriangle className="text-yellow-600 dark:text-yellow-500 shrink-0" size={16} />
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">
                            You are about to deploy in <b className="text-yellow-600 dark:text-yellow-500">LIVE</b> mode. Real money will be used for trades.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3 transition-colors">
                <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg transition-colors">Cancel</button>
                <button 
                    onClick={() => onConfirmDeploy({ strategyId: strategy.id, executionType, broker, multiplier })}
                    className={`px-6 py-2 text-xs font-bold text-white rounded-lg shadow-lg transition-all active:scale-95
                        ${executionType === 'LIVE' 
                            ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20' 
                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'}
                    `}
                >
                    {executionType === 'LIVE' ? 'Go Live' : 'Start Paper Trade'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default DeployModal;