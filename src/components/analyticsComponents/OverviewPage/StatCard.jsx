// components/StatCard.jsx
import React from 'react';
// import { calculateGrowth } from '../utils/calculateGrowth'; // ❌ Agar ye file nahi hai to niche wala function use karo
import { TrendingUp, TrendingDown, GripVertical } from 'lucide-react';

// ✅ Helper Function for Growth (File dependency hatane ke liye yahi add kar diya)
const calculateGrowth = (current, previous) => {
  if (previous === 0) return { percent: 0, isPositive: current >= 0 };
  const diff = current - previous;
  const growth = (diff / Math.abs(previous)) * 100;
  return {
    percent: Math.abs(growth).toFixed(1), // Percent hamesha positive dikhana better lagta hai UI me
    isPositive: growth >= 0
  };
};

const StatCard = ({ 
  title, 
  currentValue, 
  previousValue, 
  selectedYear, 
  periodLabel, 
  isCurrency = false, 
  isReverse = false, 
  valueLabel = "Value",
  isPercent = false 
}) => {
  
  const growth = calculateGrowth(currentValue, previousValue);
  
  // Logic: Agar isReverse true hai (e.g. Drawdown), to growth positive hona buri baat hai
  let isGood = growth.isPositive;
  if (isReverse) isGood = !growth.isPositive;

  const growthColor = isGood ? "text-green-800" : "text-red-800";
  const badgeBg = isGood ? "bg-green-100" : "bg-red-100";
  const Icon = growth.isPositive ? TrendingUp : TrendingDown;

  // ✅ Updated Formatting Logic
  const formatVal = (val) => {
    if (val === undefined || val === null || isNaN(val)) return 0;

    const num = Number(val);

    // 1. Agar value 'k' (Thousand) me convert karni hai (Positive or Negative dono ke liye)
    if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }

    // 2. Agar choti value hai to max 1 decimal dikhao (e.g. 52.8099 -> 52.8)
    // Number.isInteger check karta hai ki point ke baad value hai ya nahi
    return Number.isInteger(num) ? num : num.toFixed(1);
  };

  return (
    <div className="bg-yellow-400 p-4 rounded-3xl shadow-lg relative flex flex-col justify-between h-full ">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <div>
           <h3 className="text-black font-extrabold text-xl tracking-tight leading-none">
             {title.split(' ')[0]}<span className="text-gray-700">{title.split(' ')[1] ? ` ${title.split(' ')[1]}` : ''}</span>
           </h3>
           <p className="text-xs font-semibold text-gray-800 opacity-60 mt-1">SMC Trading Journal</p>
        </div>
        <div className="opacity-20 text-black">
            <GripVertical size={24} />
        </div>
      </div>

      {/* BODY */}
      <div className="flex items-end justify-between mt-4">
        
        {/* Growth Badge */}
        <div className={`flex flex-col justify-center items-center px-3 py-2 rounded-xl ${badgeBg} shadow-sm`}>
          <span className={`text-lg font-bold ${growthColor}`}>
              {growth.percent}%
          </span>
          <div className={`flex items-center gap-1 text-xs font-bold uppercase ${growthColor}`}>
              <span>{growth.isPositive ? 'Growth' : 'Dip'}</span>
              <Icon size={12} />
          </div>
        </div>

        {/* Data Columns */}
        <div className="flex gap-1 sm:gap-4 text-right overflow-hidden">
          
          {/* Current Year Column */}
          <div>
            <p className="text-xs text-gray-700 font-bold mb-1">{valueLabel} {selectedYear}</p>
            <div className="flex items-center justify-end gap-2">
               <div className="w-1 h-4 bg-black rounded-full opacity-20"></div> 
               <p className="text-xl font-extrabold text-black">
                 {isCurrency ? "₹" : ""}
                 {formatVal(currentValue)}
                 {isPercent ? "%" : ""} 
               </p>
            </div>
            <p className="text-[10px] text-gray-600 font-medium opacity-70">
              {periodLabel}
            </p>
          </div>

          {/* Previous Year Column */}
          <div>
            <p className="text-xs text-gray-700 font-bold mb-1">{valueLabel} {selectedYear - 1}</p>
            <div className="flex items-center justify-end gap-2">
               <div className="w-1 h-4 bg-black rounded-full opacity-10"></div>
               <p className="text-xl font-bold text-black opacity-60">
                 {isCurrency ? "₹" : ""}
                 {formatVal(previousValue)}
                 {isPercent ? "%" : ""} 
               </p>
            </div>
             <p className="text-[10px] text-gray-600 font-medium opacity-70">
               {periodLabel}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StatCard;