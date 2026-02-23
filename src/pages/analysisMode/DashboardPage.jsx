import React, { useState } from 'react';
import { 
  Activity, Settings2, X, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Components
import PnLCalendar from '../../components/analyticsComponents/DashboardPage/PnLCalendar';
import EquityCurve from '../../components/analyticsComponents/DashboardPage/EquityCurve'; 
import PairStats from '../../components/analyticsComponents/DashboardPage/PairStats';
import MonthlyAnalysis from '../../components/analyticsComponents/DashboardPage/MonthlyAnalysis'; 
import StrategyPerformance from '../../components/analyticsComponents/DashboardPage/StrategyPerformance';
import PsychologyAnalytics from '../../components/analyticsComponents/DashboardPage/PsychologyAnalytics'; // ✅ IMPORTED

import TradeForm from '../../components/forms/TradeForm'; 
import { useTradeContext } from '../../context/TradeContext'; 

const DashboardPage = () => {
  const { allTrades: trades, loading } = useTradeContext(); 

  const [filter, setFilter] = useState('LIVE'); 
  const [backtestType, setBacktestType] = useState('FUTURE');

  // --- MODAL STATE ---
  const [selectedDateTrades, setSelectedDateTrades] = useState([]); 
  const [currentTradeIndex, setCurrentTradeIndex] = useState(0);    
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- FILTERED DATA PREPARATION ---
  const activeData = trades.filter(t => t.mode === filter);
  
  // Handlers
  const handleCalendarDateClick = (tradesList) => {
     setSelectedDateTrades(tradesList); 
     setCurrentTradeIndex(0);           
     setIsDetailModalOpen(true);
  };

  const handleNextTrade = () => {
    if (currentTradeIndex < selectedDateTrades.length - 1) {
      setCurrentTradeIndex(prev => prev + 1);
    }
  };

  const handlePrevTrade = () => {
    if (currentTradeIndex > 0) {
      setCurrentTradeIndex(prev => prev - 1);
    }
  };

  if (loading && trades.length === 0) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">📊 Performance Dashboard</h1>
        
        <div className="flex gap-4">
            <div className="bg-white p-1 rounded-lg border shadow-sm flex gap-2">
                <button onClick={() => setFilter('LIVE')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filter === 'LIVE' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Live Trades</button>
                <button onClick={() => setFilter('BACKTEST')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filter === 'BACKTEST' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Backtesting</button>
            </div>

            {filter === 'BACKTEST' && (
                <div className="bg-white p-1 rounded-lg border shadow-sm flex gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                    <button 
                        onClick={() => setBacktestType('FUTURE')} 
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition ${backtestType === 'FUTURE' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Activity size={14} /> Future
                    </button>
                    <button 
                        onClick={() => setBacktestType('OPTION')} 
                        className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition ${backtestType === 'OPTION' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        title="Reduces Points & PnL by 50% (0.5 Delta)"
                    >
                        <Settings2 size={14} /> Option (0.5)
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
        {/* STRATEGY PERFORMANCE */}
        <StrategyPerformance 
            trades={activeData} 
            isBacktest={filter === 'BACKTEST'}
            isOptionMode={backtestType === 'OPTION'}
        />
      </div>

      {/* 🔥 PSYCHOLOGY ANALYTICS ADDED HERE */}
      <div className="mb-8">
          <PsychologyAnalytics trades={activeData} />
      </div>
      
      {/* CALENDAR */}
      <div className="mb-10">
        <PnLCalendar 
            trades={activeData} 
            onDateClick={handleCalendarDateClick}
            isOptionMode={filter === 'BACKTEST' && backtestType === 'OPTION'}
        />
      </div>

      <MonthlyAnalysis trades={activeData} />

      <EquityCurve 
         trades={activeData} 
         isBacktest={filter === 'BACKTEST'}
         isOptionMode={backtestType === 'OPTION'}
      />

      <div className="mt-8 h-96">
          <PairStats 
              trades={activeData} 
              isBacktest={filter === 'BACKTEST'}
              isOptionMode={backtestType === 'OPTION'}
          />
      </div>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedDateTrades.length > 0 && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[60] backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 rounded-t-xl">
                 {selectedDateTrades.length > 1 ? (
                   <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border shadow-sm">
                      <button onClick={handlePrevTrade} disabled={currentTradeIndex === 0} className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-30 transition"><ChevronLeft size={20} /></button>
                      <span className="text-sm font-bold text-slate-600 min-w-[80px] text-center">Trade {currentTradeIndex + 1} of {selectedDateTrades.length}</span>
                      <button onClick={handleNextTrade} disabled={currentTradeIndex === selectedDateTrades.length - 1} className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-30 transition"><ChevronRight size={20} /></button>
                   </div>
                 ) : (
                   <span className="text-sm font-bold text-slate-500">Trade Details</span>
                 )}
                 <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-200 hover:bg-red-500 hover:text-white rounded-full p-2 transition"><X size={20} /></button>
              </div>
              <div className="p-1">
                <TradeForm 
                   key={selectedDateTrades[currentTradeIndex]._id} 
                   isReadOnly={true} 
                   initialData={selectedDateTrades[currentTradeIndex]} 
                   mode={filter} 
                />
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;