
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import ComingSoonOverlay from './ComingSoonOverlay';

// ✅ Props receive kiye: riskSettings & setRiskSettings
const RiskManagementSection = ({ riskSettings, setRiskSettings, isComingSoon }) => {
  
  const inputClass = "w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-xs focus:border-blue-500 outline-none transition-colors";

  // ✅ Helper Function: State Update karne ke liye
  const handleChange = (field, value) => {
    // Agar number field hai to Number() me convert karo, nahi to string rakho
    const finalValue = (field === 'noTradeAfter' || field === 'profitTrailing') ? value : Number(value);
    
    setRiskSettings(prev => ({
        ...prev,
        [field]: finalValue
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative shadow-sm dark:shadow-none transition-colors duration-300">
       
       {isComingSoon && <ComingSoonOverlay />}
       
       <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
          <ShieldCheck className="text-orange-500" size={18}/> Risk Management
       </h3>
       
       <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-relaxed">
          Control your trading outcomes by setting global limits on losses and profits on the strategy, and automating how gains are protected (trailing).
       </p>
       
       <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Profit (₹)</label>
                    <input 
                        type="number" 
                        placeholder="5000" 
                        // ✅ Value bind ki
                        value={riskSettings?.maxProfit || ''} 
                        // ✅ onChange lagaya
                        onChange={(e) => handleChange('maxProfit', e.target.value)}
                        className={`${inputClass} text-green-600 dark:text-green-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
                    />
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Loss (₹)</label>
                    <input 
                        type="number" 
                        placeholder="2000" 
                        value={riskSettings?.maxLoss || ''} 
                        onChange={(e) => handleChange('maxLoss', e.target.value)}
                        className={`${inputClass} text-red-600 dark:text-red-400 font-bold placeholder-gray-400 dark:placeholder-gray-600`} 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">Max Trade Cycle</label>
                    <input 
                        type="number" 
                        value={riskSettings?.maxTradeCycle || ''} 
                        onChange={(e) => handleChange('maxTradeCycle', e.target.value)}
                        className={`${inputClass} text-gray-900 dark:text-white`} 
                    />
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1 font-bold">No Trade After</label>
                    <input 
                        type="time" 
                        value={riskSettings?.noTradeAfter || '15:15'} 
                        onChange={(e) => handleChange('noTradeAfter', e.target.value)}
                        className={`${inputClass} text-gray-900 dark:text-white`} 
                    />
                 </div>
              </div>
              
              <div>
                  <label className="text-[10px] text-gray-500 dark:text-gray-400 block mb-2 font-bold uppercase">Profit Trailing</label>
                  <div className="flex flex-wrap gap-4">
                     {['No Trailing', 'Lock Fix Profit', 'Trail Profit', 'Lock and Trail'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                           <input 
                                type="radio" 
                                name="risk_trailing" 
                                className="accent-blue-600 dark:accent-blue-500 w-3.5 h-3.5" 
                                // ✅ Checked Logic
                                checked={riskSettings?.profitTrailing === opt}
                                // ✅ onChange Logic
                                onChange={() => handleChange('profitTrailing', opt)}
                           />
                           <span className="text-xs text-gray-600 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {opt}
                           </span>
                        </label>
                     ))}
                  </div>
              </div>
       </div>
    </div>
  );
};
export default RiskManagementSection;