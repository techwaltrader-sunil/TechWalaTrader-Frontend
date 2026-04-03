
// import React, { useMemo } from 'react';

// const DaywiseBreakdown = ({ period = '6M' }) => {

//   // --- 1. DATA GENERATION LOGIC ---
//   const { monthsData } = useMemo(() => {
//     // Current Date (Mocking as Feb 10, 2026 to match your screenshots, or use new Date() for live)
//     // const today = new Date(); 
//     const today = new Date(2026, 1, 10); // 10 Feb 2026 (System Date Match)
    
//     // Calculate Start Month based on Filter
//     const targetDate = new Date(today);
//     // Reset to 1st of the month to avoid slipping dates
//     targetDate.setDate(1); 

//     if (period === '1M') targetDate.setMonth(today.getMonth());
//     else if (period === '3M') targetDate.setMonth(today.getMonth() - 2);
//     else if (period === '6M') targetDate.setMonth(today.getMonth() - 5); // Sep 2025
//     else targetDate.setMonth(today.getMonth() - 11);

//     const months = [];
//     // Loop Variable
//     const currentIterDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);

//     // Loop until we reach the current month
//     while (currentIterDate <= today || currentIterDate.getMonth() === today.getMonth()) {
//         const year = currentIterDate.getFullYear();
//         const month = currentIterDate.getMonth(); // 0=Jan, 8=Sep
        
//         // Month Header
//         const monthName = currentIterDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        
//         // Days in Month (e.g., 30 for Sep, 28 for Feb)
//         const daysInMonth = new Date(year, month + 1, 0).getDate();
        
//         // First Day of Month Index (0=Sun, 1=Mon, ..., 6=Sat)
//         const firstDayIndex = new Date(year, month, 1).getDay(); 
        
//         const days = [];
//         let totalPnL = 0;

//         for (let d = 1; d <= daysInMonth; d++) {
//             const dateObj = new Date(year, month, d);
//             const dateStr = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
            
//             // Check Future
//             const isFuture = dateObj > today;
//             let pnl = 0;
//             let hasTrade = false;

//             // Mock Data Logic (Only for Past)
//             if (!isFuture) {
//                 const dayOfWeek = dateObj.getDay();
//                 // Random Trade Logic
//                 if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Weekends for trades
//                     if (Math.random() > 0.3) { // 70% chance of trade
//                         hasTrade = true;
//                         pnl = Math.random() > 0.55 
//                             ? Math.floor(Math.random() * 4000) + 500 
//                             : -Math.floor(Math.random() * 2500) - 200;
//                     }
//                 }
//             }

//             if (hasTrade) totalPnL += pnl;

//             days.push({
//                 date: d,
//                 fullDate: dateStr,
//                 pnl,
//                 hasTrade,
//                 isFuture
//             });
//         }

//         months.push({
//             name: monthName,
//             year,
//             firstDayIndex, 
//             days,
//             totalPnL
//         });

//         // Break loop if we just processed the current month
//         if (currentIterDate.getMonth() === today.getMonth() && currentIterDate.getFullYear() === today.getFullYear()) {
//              break;
//         }

//         // Increment Month
//         currentIterDate.setMonth(currentIterDate.getMonth() + 1);
//     }

//     return { monthsData: months };
//   }, [period]);

//   const fmt = (num) => `₹${Math.abs(num).toLocaleString('en-IN')}`;

//   const getCellColor = (day) => {
//     // 1. Future Dates (Transparent/Faint)
//     if (day.isFuture) return "bg-gray-100 dark:bg-slate-800/20 border border-gray-200 dark:border-slate-800/30"; 
    
//     // 2. No Trade (Visible Neutral)
//     if (!day.hasTrade) return "bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700/50";   
    
//     // 3. Profit (Green)
//     if (day.pnl > 0) return "bg-emerald-500 dark:bg-emerald-600 border border-emerald-400/50";  
    
//     // 4. Loss (Red)
//     return "bg-rose-500 dark:bg-rose-600 border border-rose-400/50";                         
//   };

//   return (
//     // ✅ Main Container: Light (White) | Dark (Slate-900)
//     <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-lg transition-colors duration-300">
      
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daywise Breakdown</h3>
//            <p className="text-xs text-gray-500 dark:text-gray-400">Daily performance visualization</p>
//         </div>
        
//         {/* Legend */}
//         <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
//             <span>Less</span>
//             <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"></div>
//             <div className="w-3 h-3 rounded-sm bg-rose-500 dark:bg-rose-600"></div>
//             <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-600"></div>
//             <span>More</span>
//         </div>
//       </div>

//       <div className="flex">
        
//         {/* 1. Left Axis Labels (Su, Mo, Tu...) */}
//         <div className="flex flex-col gap-1 pt-0 mr-3 mt-\[0px\]">
//             {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
//                 <span key={i} className="text-[9px] h-4 flex items-center font-bold text-gray-400 dark:text-gray-500 uppercase">
//                     {d}
//                 </span>
//             ))}
//         </div>

//         {/* 2. Scrollable Months Area */}
//         <div className="overflow-x-auto custom-scrollbar pb-2 flex-1">
//             <div className="flex gap-8 min-w-max">
                
//                 {monthsData.map((month, mIdx) => (
//                     <div key={mIdx} className="flex flex-col">
                        
//                         {/* THE GRID */}
//                         <div className="grid grid-rows-7 grid-flow-col gap-1">
                            
//                             {/* PADDING: Invisible cells for Alignment */}
//                             {Array.from({ length: month.firstDayIndex }).map((_, i) => (
//                                 <div key={`pad-${i}`} className="w-3 h-3"></div>
//                             ))}

//                             {/* DAYS */}
//                             {month.days.map((day) => (
//                                 <div 
//                                     key={day.fullDate}
//                                     title={`${day.fullDate} ${day.isFuture ? '(Upcoming)' : (day.hasTrade ? `: ${day.pnl > 0 ? '+' : '-'}${fmt(day.pnl)}` : ': No Trade')}`}
//                                     className={`w-4 h-4 rounded-\[2px\] transition-colors cursor-pointer ${getCellColor(day)}`}
//                                 ></div>
//                             ))}
//                         </div>

//                         {/* Month Footer */}
//                         <div className="mt-2 text-left">
//                             <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{month.name}</p>
//                             <p className={`text-[9px] font-bold ${month.totalPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
//                                 {month.totalPnL >= 0 ? '+' : '-'}{fmt(month.totalPnL)}
//                             </p>
//                         </div>

//                     </div>
//                 ))}

//             </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default DaywiseBreakdown;



import React, { useMemo } from 'react';

// 🔥 FIX: Ab ye component backend se aane wale 'data' (daywiseBreakdown array) ko receive karega
const DaywiseBreakdown = ({ data = [] }) => {

  // --- 1. DYNAMIC DATA GENERATION LOGIC ---
  const { monthsData } = useMemo(() => {
    if (!data || data.length === 0) return { monthsData: [] };

    // 1. Backend ke data ko ek Map me badalna taaki fast lookup ho sake
    const tradeMap = {};
    data.forEach(item => {
        // item.date backend se "YYYY-MM-DD" format me aata hai
        tradeMap[item.date] = item; 
    });

    // 2. Data me se Start Date aur End Date nikalna
    const dates = data.map(d => new Date(d.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // 3. Calendar kahan se shuru aur kahan khatam hoga (1st of Start Month to 1st of End Month)
    const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    const months = [];
    let currentIterDate = new Date(startMonth);
    const today = new Date(); // Asli aaj ki date (taaki future dates gray ho jayein)

    // Loop through each month from Start to End
    while (currentIterDate <= endMonth) {
        const year = currentIterDate.getFullYear();
        const month = currentIterDate.getMonth(); 
        
        const monthName = currentIterDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay(); 
        
        const days = [];
        let totalPnL = 0;

        for (let d = 1; d <= daysInMonth; d++) {
            // "YYYY-MM-DD" string ban banana taaki backend ke data se match kar sakein
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(d).padStart(2, '0');
            const dateKey = `${year}-${monthStr}-${dayStr}`;
            
            const dateObj = new Date(year, month, d);
            const isFuture = dateObj > today;

            // 🔥 REAL DATA MATCHING: Check karna ki kya is date ko koi trade hua tha?
            const tradeInfo = tradeMap[dateKey];
            const hasTrade = !!tradeInfo;
            const pnl = tradeInfo ? tradeInfo.dailyPnL : 0;

            if (hasTrade) totalPnL += pnl;

            days.push({
                date: d,
                fullDate: dateKey,
                pnl,
                hasTrade,
                isFuture
            });
        }

        months.push({
            name: monthName,
            year,
            firstDayIndex, 
            days,
            totalPnL
        });

        // Increment Month
        currentIterDate.setMonth(currentIterDate.getMonth() + 1);
    }

    return { monthsData: months };
  }, [data]); // 🔥 dependency me ab 'data' hai

  const fmt = (num) => `₹${Math.abs(num).toLocaleString('en-IN')}`;

  const getCellColor = (day) => {
    if (day.isFuture) return "bg-gray-100 dark:bg-slate-800/20 border border-gray-200 dark:border-slate-800/30"; 
    if (!day.hasTrade) return "bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700/50";   
    if (day.pnl > 0) return "bg-emerald-500 dark:bg-emerald-600 border border-emerald-400/50";  
    return "bg-rose-500 dark:bg-rose-600 border border-rose-400/50";                        
  };

  if (!data || data.length === 0) {
      return (
        <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 flex justify-center items-center h-48">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Run a backtest to see the Daywise Breakdown.</p>
        </div>
      );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-lg transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daywise Breakdown</h3>
           <p className="text-xs text-gray-500 dark:text-gray-400">Daily performance visualization</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700"></div>
            <div className="w-3 h-3 rounded-sm bg-rose-500 dark:bg-rose-600"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-600"></div>
            <span>More</span>
        </div>
      </div>

      <div className="flex">
        
        {/* Left Axis Labels */}
        <div className="flex flex-col gap-1 pt-0 mr-3 mt-[0px]">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                <span key={i} className="text-[9px] h-4 flex items-center font-bold text-gray-400 dark:text-gray-500 uppercase">
                    {d}
                </span>
            ))}
        </div>

        {/* Scrollable Months Area */}
        <div className="overflow-x-auto custom-scrollbar pb-2 flex-1">
            <div className="flex gap-8 min-w-max">
                
                {monthsData.map((month, mIdx) => (
                    <div key={mIdx} className="flex flex-col">
                        
                        {/* THE GRID */}
                        <div className="grid grid-rows-7 grid-flow-col gap-1">
                            
                            {/* PADDING: Invisible cells for Alignment */}
                            {Array.from({ length: month.firstDayIndex }).map((_, i) => (
                                <div key={`pad-${i}`} className="w-3 h-3"></div>
                            ))}

                            {/* DAYS */}
                            {month.days.map((day) => (
                                <div 
                                    key={day.fullDate}
                                    title={`${day.fullDate} ${day.isFuture ? '(Upcoming)' : (day.hasTrade ? `: ${day.pnl > 0 ? '+' : '-'}${fmt(day.pnl)}` : ': No Trade')}`}
                                    className={`w-4 h-4 rounded-[2px] transition-colors cursor-pointer ${getCellColor(day)}`}
                                ></div>
                            ))}
                        </div>

                        {/* Month Footer */}
                        <div className="mt-2 text-left">
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{month.name}</p>
                            <p className={`text-[9px] font-bold ${month.totalPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {month.totalPnL >= 0 ? '+' : '-'}{fmt(month.totalPnL)}
                            </p>
                        </div>

                    </div>
                ))}

            </div>
        </div>

      </div>
    </div>
  );
};

export default DaywiseBreakdown;