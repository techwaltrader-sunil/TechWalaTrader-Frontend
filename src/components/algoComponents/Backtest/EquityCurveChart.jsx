
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

const EquityCurveChart = ({ transactions }) => {

  // --- 1. DATA PROCESSING ---
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const sortedTrades = [...transactions].sort((a, b) => a.id - b.id);

    let runningBalance = 0;
    
    return sortedTrades.map((trade) => {
      runningBalance += trade.pnl; 
      return {
        id: trade.id,
        date: trade.date, 
        pnl: trade.pnl,   
        equity: runningBalance 
      };
    });
  }, [transactions]);

  // --- 2. CUSTOM TOOLTIP ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        // ✅ Tooltip: Light (White) | Dark (Slate-900)
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-3 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/50 transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{data.date}</p>
          <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">
            Equity: <span className={data.equity >= 0 ? "text-emerald-600 dark:text-green-400" : "text-rose-600 dark:text-red-400"}>
              ₹{data.equity.toLocaleString()}
            </span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-500">
            Trade P&L: <span className={data.pnl >= 0 ? "text-emerald-500 dark:text-green-500" : "text-rose-500 dark:text-red-500"}>
              {data.pnl >= 0 ? '+' : ''}₹{data.pnl}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) return <div className="text-gray-400 text-sm">No data for chart</div>;

  return (
    // ✅ Main Container: Light (White) | Dark (Slate-900)
    <div className="w-full h-[350px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-lg transition-colors duration-300">
      
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
          Equity Curve (Profit Growth)
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">Net P&L Visualized</span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          
          {/* Gradients */}
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              {/* Adjusted Opacity for Light Mode visibility */}
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/> 
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/> 
            </linearGradient>
          </defs>

          {/* Grid Lines: Light (Gray-200) | Dark (Slate-800) */}
          {/* Note: stroke color needs to be static or passed via CSS var, using a neutral gray for both as compromise or opacity */}
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />

          {/* X Axis */}
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" // Neutral Gray-400
            tick={{ fontSize: 10, fill: '#64748b' }} // Neutral Slate-500
            tickLine={false} 
            axisLine={false}
            minTickGap={30} 
          />

          {/* Y Axis */}
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `₹${value/1000}k`} 
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }} />

          {/* Zero Line */}
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />

          {/* Main Line */}
          <Area 
            type="monotone" 
            dataKey="equity" 
            stroke="#10b981" // Emerald-500 works well on both
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorEquity)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityCurveChart;