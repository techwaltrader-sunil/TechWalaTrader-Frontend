import React from 'react';
import { Activity, Clock, Target, BarChart2, CheckSquare } from 'lucide-react';

const PriceActionConditionSection = ({ priceActionSettings, setPriceActionSettings }) => {

    const handleTrendChange = (e) => {
        setPriceActionSettings({
            ...priceActionSettings,
            startingTrend: e.target.value
        });
    };
    
    // Fallback values if state is not initialized properly yet
    const settings = priceActionSettings || {
        masterTimeframe: "15 min",
        entryTimeframe: "1 min",
        setupType: "BOS (Break of Structure)",
        entryTrigger: "Candle Close",
        volumeConfirmation: false
    };

    const handleChange = (field, value) => {
        setPriceActionSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const timeframes = ["1 min", "3 min", "5 min", "15 min", "30 min", "1H", "4H", "1D"];
    const setupTypes = [
        "BOS (Break of Structure)", 
        "CHoCH (Change of Character)", 
        "FVG Pullback (Fair Value Gap)", 
        "Order Block Mitigation", 
        "Inside Bar Breakout", 
        "Engulfing Pattern"
    ];
    const entryTriggers = ["Candle Close", "Wick Sweep (Liquidity Grab)", "Touch / Limit Order"];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm space-y-6 animate-in fade-in zoom-in duration-300">
            
            {/* 🏷️ Header */}
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
                <Activity className="text-blue-600 dark:text-blue-500" size={20} />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Price Action & SMC Setup
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ⏱️ LEFT COLUMN: Timeframe Settings */}
                <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" /> Timeframe Alignment
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Master Trend (HTF)
                            </label>
                            <select 
                                value={settings.masterTimeframe}
                                onChange={(e) => handleChange('masterTimeframe', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                            </select>
                            <p className="text-[10px] text-gray-400">Used for Structure/Trend</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Entry Trigger (LTF)
                            </label>
                            <select 
                                value={settings.entryTimeframe}
                                onChange={(e) => handleChange('entryTimeframe', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                            </select>
                            <p className="text-[10px] text-gray-400">Used for Trade Execution</p>
                        </div>
                    </div>

                    {/* 🔥 NEW: Initial Market Trend Dropdown */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Initial Market Trend (Cold Start)
                    </label>
                    <select
                        value={priceActionSettings.startingTrend || "AUTO"}
                        onChange={handleTrendChange}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    >
                        <option value="AUTO">🤖 Auto Identify (Smart Flip)</option>
                        <option value="BULLISH">📈 Force Bullish (Find HH/HL)</option>
                        <option value="BEARISH">📉 Force Bearish (Find LL/LH)</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Choose how the engine assumes the trend at the start of backtesting.
                    </p>
                </div>
                {/* 🔥 NEW: Counter Structure History Dropdown */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Counter Structure History
                    </label>
                    <select 
                        className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={priceActionSettings.counterStructureDepth || 0}
                        onChange={(e) => setPriceActionSettings({ ...priceActionSettings, counterStructureDepth: Number(e.target.value) })}
                    >
                        <option value={0}>0 (Strict - No History)</option>
                        <option value={1}>1 (Keep 1 Previous Wave)</option>
                        <option value={2}>2 (Keep 2 Previous Waves)</option>
                    </select>
                </div>
                </div>

                

                {/* 🎯 RIGHT COLUMN: Strategy & Trigger Logic */}
                <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Target size={16} className="text-gray-400" /> Execution Logic
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Primary Setup Type
                            </label>
                            <select 
                                value={settings.setupType}
                                onChange={(e) => handleChange('setupType', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                {setupTypes.map(setup => <option key={setup} value={setup}>{setup}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                                Confirmation Trigger
                            </label>
                            <select 
                                value={settings.entryTrigger}
                                onChange={(e) => handleChange('entryTrigger', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                {entryTriggers.map(trigger => <option key={trigger} value={trigger}>{trigger}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🛡️ BOTTOM SECTION: Additional Confirmations */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                    <CheckSquare size={16} className="text-gray-400" /> Additional Confirmations
                </h3>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input 
                            type="checkbox" 
                            className="sr-only"
                            checked={settings.volumeConfirmation}
                            onChange={(e) => handleChange('volumeConfirmation', e.target.checked)}
                        />
                        <div className={`w-5 h-5 rounded border ${settings.volumeConfirmation ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-700'} flex items-center justify-center transition-colors group-hover:border-blue-500`}>
                            {settings.volumeConfirmation && <CheckSquare size={14} className="text-white" />}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1.5">
                            <BarChart2 size={14} className="text-blue-500" /> Require Volume Confirmation
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            Entry candle volume must be strictly greater than the previous candle's volume.
                        </span>
                    </div>
                </label>
            </div>

        </div>
    );
};

export default PriceActionConditionSection;