import React, { useState } from 'react';

const ReportTab = () => {
  // Filters State
  const [fromDate, setFromDate] = useState('2026-02-22');
  const [toDate, setToDate] = useState('2026-02-22');
  const [broker, setBroker] = useState('All');

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
        {/* FILTERS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">From</span>
                    <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">To</span>
                    <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Select Broker</span>
                    <select value={broker} onChange={(e)=>setBroker(e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 min-w-[120px]">
                        <option value="All">All</option>
                        <option value="Dhan">Dhan</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-1 flex">
                    <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">Live</button>
                    <button className="px-4 py-1.5 text-xs font-bold rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Forward</button>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95">
                    Get Reports
                </button>
            </div>
        </div>

        {/* STRATEGY BREAKDOWN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] relative">
                <h3 className="absolute top-4 left-6 text-sm font-bold text-gray-700 dark:text-gray-300">Strategy Breakdown</h3>
                <div className="relative w-48 h-48 mt-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="15" className="text-gray-100 dark:text-slate-800" />
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="251.2" className="text-gray-300 dark:text-slate-700 transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total P&L</span>
                        <span className="text-2xl font-bold text-gray-800 dark:text-white mt-1">₹ 0.00</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-6">No data</p>
            </div>

            <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
                <p className="text-sm text-gray-400">No data</p>
            </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">No strategies found.</p>
    </div>
  );
};

export default ReportTab;