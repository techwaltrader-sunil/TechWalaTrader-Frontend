
// import React, { useState, useMemo } from 'react';
// import { 
//   BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
// } from 'recharts';

// const MaxProfitLossChart = ({ transactions, summary }) => {
//   const [filter, setFilter] = useState('all'); 

//   // --- 1. FILTER LOGIC ---
//   const chartData = useMemo(() => {
//     if (!transactions) return [];

//     let data = [...transactions];

//     if (filter !== 'all') {
//       // Sort by absolute value to find biggest wins/losses
//       data.sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl));
//       data = data.slice(0, parseInt(filter));
//     }

//     return data;
//   }, [transactions, filter]);

//   // --- 2. CUSTOM TOOLTIP (FIXED LOGIC) ---
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       const pnl = data.pnl; // Raw value (e.g., -2487 or 3324)
//       const isLoss = pnl < 0; // Check specifically if it is negative

//       return (
//         // ✅ Tooltip: Light (White) | Dark (Slate-900)
//         <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-3 rounded-lg shadow-xl z-50 transition-colors">
//           <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{data.date}</p>
//           <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">
//             {data.symbol}
//           </p>
//           {/* ✅ FIXED: Logic for Color and Sign */}
//           <p className={`text-sm font-bold ${isLoss ? 'text-rose-600 dark:text-red-400' : 'text-emerald-600 dark:text-green-400'}`}>
//             {isLoss ? '-' : '+'}₹{Math.abs(pnl).toLocaleString()}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Helper formatting for Header Stats
//   const fmt = (num) => `₹${Math.abs(num || 0).toLocaleString()}`;

//   return (
//     // ✅ Main Container
//     <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-lg transition-colors duration-300">
      
//       {/* --- HEADER SECTION --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        
//         {/* Left: Title & Avg Stats */}
//         <div>
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white">Max Profit and Loss</h3>
//           <div className="flex gap-3 text-xs mt-1">
//             <span className="text-gray-500 dark:text-gray-400">
//               Avg Profit: <span className="text-emerald-600 dark:text-green-400 font-bold">+{fmt(summary?.avgProfit)}</span>
//             </span>
//             <span className="text-gray-300 dark:text-gray-600">|</span>
//             <span className="text-gray-500 dark:text-gray-400">
//               Avg Loss: <span className="text-rose-600 dark:text-red-400 font-bold">-{fmt(summary?.avgLoss)}</span>
//             </span>
//           </div>
//         </div>

//         {/* Right: Filters */}
//         <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-950 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-800 transition-colors">
//            {['10', '20', '30', 'all'].map((val) => (
//              <label key={val} className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
//                <input 
//                  type="radio" 
//                  name="chartFilter" 
//                  value={val} 
//                  checked={filter === val}
//                  onChange={() => setFilter(val)}
//                  className="accent-blue-600 dark:accent-blue-500 w-3 h-3 cursor-pointer"
//                />
//                <span className={filter === val ? "text-blue-600 dark:text-blue-400 font-bold" : ""}>
//                  {val === 'all' ? 'All' : `Top ${val}`}
//                </span>
//              </label>
//            ))}
//         </div>
//       </div>

//       {/* --- CHART SECTION --- */}
//       <div className="h-[350px] w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
            
//             {/* Grid */}
//             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
            
//             <XAxis 
//               dataKey="date" 
//               hide={true} 
//             />
            
//             <YAxis 
//               stroke="#94a3b8" 
//               tick={{ fontSize: 10, fill: '#64748b' }} 
//               tickLine={false} 
//               axisLine={false}
//               // Y-Axis labels formatting
//               tickFormatter={(value) => `${value < 0 ? '-' : ''}₹${Math.abs(value)/1000}k`}
//             />
            
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: '#94a3b8', opacity: 0.1 }} />
            
//             <ReferenceLine y={0} stroke="#94a3b8" />

//             <Bar dataKey="pnl" radius={[2, 2, 0, 0]} animationDuration={1000}>
//               {chartData.map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   // Fill: Emerald (Profit) / Rose (Loss)
//                   fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} 
//                   stroke={entry.pnl >= 0 ? '#059669' : '#dc2626'}
//                   strokeWidth={1}
//                 />
//               ))}
//             </Bar>

//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//     </div>
//   );
// };

// export default MaxProfitLossChart;


import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

const MaxProfitLossChart = ({ transactions, summary }) => {
  const [filter, setFilter] = useState('all'); 

  // --- 🔥 NAYA LOGIC: Calculate Exact Averages from Transactions 🔥 ---
  const { avgProfit, avgLoss } = useMemo(() => {
    if (!transactions || transactions.length === 0) return { avgProfit: 0, avgLoss: 0 };
    
    let totalProfit = 0, winCount = 0;
    let totalLoss = 0, lossCount = 0;

    transactions.forEach(t => {
        if (t.pnl > 0) {
            totalProfit += t.pnl;
            winCount++;
        } else if (t.pnl < 0) {
            totalLoss += Math.abs(t.pnl); // Calculation ke liye positive kar lete hain
            lossCount++;
        }
    });

    return {
        avgProfit: winCount > 0 ? Math.round(totalProfit / winCount) : 0,
        avgLoss: lossCount > 0 ? Math.round(totalLoss / lossCount) : 0
    };
  }, [transactions]);


  // --- 1. FILTER LOGIC ---
  const chartData = useMemo(() => {
    if (!transactions) return [];

    let data = [...transactions];

    if (filter !== 'all') {
      // Sort by absolute value to find biggest wins/losses
      data.sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl));
      data = data.slice(0, parseInt(filter));
    }

    return data;
  }, [transactions, filter]);

  // --- 2. CUSTOM TOOLTIP ---
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pnl = data.pnl; 
      const isLoss = pnl < 0; 

      // ✅ NAYA: Date ko Indian Format (DD/MM/YY) me convert karna
      const formatDate = (dateStr) => {
          if(!dateStr) return '';
          const [year, month, day] = dateStr.split('-');
          return `${day}/${month}/${year.slice(-2)}`; // Ex: 17/10/25
      };

      return (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-3 rounded-lg shadow-xl z-50 transition-colors">
          {/* ✅ NAYA: Yahan data.date ki jagah formatDate(data.date) kar diya */}
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{formatDate(data.date)}</p>
          <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">
            {data.symbol || 'Daily P&L'}
          </p>
          <p className={`text-sm font-bold ${isLoss ? 'text-rose-600 dark:text-red-400' : 'text-emerald-600 dark:text-green-400'}`}>
            {isLoss ? '-' : '+'}₹{Math.abs(pnl).toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  const fmt = (num) => `₹${Math.abs(num || 0).toLocaleString('en-IN')}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-lg transition-colors duration-300">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        
        {/* Left: Title & Avg Stats */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Max Profit and Loss</h3>
          <div className="flex gap-3 text-xs mt-1">
            <span className="text-gray-500 dark:text-gray-400">
              {/* ✅ FIXED: Use newly calculated avgProfit and avgLoss */}
              Avg Profit: <span className="text-emerald-600 dark:text-green-400 font-bold">+{fmt(avgProfit)}</span>
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="text-gray-500 dark:text-gray-400">
              Avg Loss: <span className="text-rose-600 dark:text-red-400 font-bold">-{fmt(avgLoss)}</span>
            </span>
          </div>
        </div>

        {/* Right: Filters */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-950 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-800 transition-colors">
           {['10', '20', '30', 'all'].map((val) => (
             <label key={val} className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
               <input 
                 type="radio" 
                 name="chartFilter" 
                 value={val} 
                 checked={filter === val}
                 onChange={() => setFilter(val)}
                 className="accent-blue-600 dark:accent-blue-500 w-3 h-3 cursor-pointer"
               />
               <span className={filter === val ? "text-blue-600 dark:text-blue-400 font-bold" : ""}>
                 {val === 'all' ? 'All' : `Top ${val}`}
               </span>
             </label>
           ))}
        </div>
      </div>

      {/* --- CHART SECTION --- */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
            <XAxis dataKey="date" hide={true} />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fontSize: 10, fill: '#64748b' }} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${value < 0 ? '-' : ''}₹${Math.abs(value)/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#94a3b8', opacity: 0.1 }} />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar dataKey="pnl" radius={[2, 2, 0, 0]} animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} 
                  stroke={entry.pnl >= 0 ? '#059669' : '#dc2626'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default MaxProfitLossChart;