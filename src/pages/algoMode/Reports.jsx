
import React, { useState } from 'react';
import { History } from 'lucide-react';
import ReportTab from '../../components/algoComponents/Reports/ReportTab';
import TradeEngineLogsTab from '../../components/algoComponents/Reports/TradeEngineLogsTab';

const Reports = () => {
  // ✅ TAB STATE: 'report' ya 'logs'
  const [activeTab, setActiveTab] = useState('report');

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <History className="text-blue-600 dark:text-blue-500" size={28} />
            Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Analyze your algorithmic trading performance and execution logs.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors overflow-hidden">
        
        {/* ✅ TABS NAVIGATION */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 px-6 pt-4">
            <button 
                onClick={() => setActiveTab('report')}
                className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'report' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
                Report
            </button>
            <button 
                onClick={() => setActiveTab('logs')}
                className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'logs' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
                Trade Engine Logs
            </button>
        </div>

        {/* ✅ DYNAMIC COMPONENT RENDERING */}
        <div className="p-6">
            {activeTab === 'report' ? <ReportTab /> : <TradeEngineLogsTab />}
        </div>
        
      </div>
    </div>
  );
};

export default Reports;
