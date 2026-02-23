import React from 'react';
import { MoreHorizontal, TrendingUp, ArrowUp } from 'lucide-react';
// ✅ FIX: Removed invalid imports (defs, linearGradient, stop)
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- MOCK DATA FOR SPARKLINE CHART ---
const sparklineData = [
  { value: 10 }, { value: 35 }, { value: 20 }, { value: 55 }, { value: 40 }, { value: 70 }, { value: 60 }, { value: 85 }
];

const MetricCard = ({ title, mainValue, status, footerLeft, footerRight, chartColor = "#8b5cf6" }) => {
  
  // Unique ID for gradient (Zaroori hai taki har card ka gradient alag ho)
  const gradientId = `color-${title ? title.replace(/\s+/g, '') : 'metric'}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group flex flex-col h-full">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title || "Metric"}</h3>
        <button className="text-gray-600 hover:text-white transition p-1 rounded hover:bg-slate-800">
            <MoreHorizontal size={18} />
        </button>
      </div>

      {/* 2. MAIN VALUE */}
      <div className="flex items-baseline gap-3 mb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {mainValue || "0"}
        </h1>
        {status && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold mb-2">
                <TrendingUp size={10} /> {status}
            </div>
        )}
      </div>

      {/* 3. SPARKLINE CHART AREA (Recharts) */}
      <div className="h-24 w-full -mx-2 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            {/* ✅ HTML SVG Tags used directly inside Recharts */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#${gradientId})`} 
                isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4. FOOTER (Split Section) */}
      <div className="flex items-center border-t border-slate-800 pt-4 mt-auto">
        
        {/* Left Footer Metric */}
        <div className="flex-1 pr-4 border-r border-slate-800">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                {footerLeft?.label || "Total"}
            </p>
            <p className="text-sm font-bold text-gray-300">
                {footerLeft?.value || "0"}
            </p>
        </div>

        {/* Right Footer Metric */}
        <div className="flex-1 pl-4">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">
                {footerRight?.label || "Today"}
            </p>
            <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-300">
                    {footerRight?.value || "0"}
                </p>
                <span className="text-green-400 bg-green-500/10 p-0.5 rounded-full"><ArrowUp size={12}/></span>
            </div>
        </div>
      </div>

    </div>
  );
};

export default MetricCard;