
import React, { useEffect } from 'react';
import { Layers } from 'lucide-react';

const AdvanceFeaturesSection = ({ advanceSettings, setAdvanceSettings, legs }) => {
  
  const features = [
    { key: 'moveSLToCost', label: 'Move SL to Cost' },
    { key: 'exitAllOnSLTgt', label: 'Exit All on SL/Tgt' },
    { key: 'prePunchSL', label: 'Pre Punch SL' },
    { key: 'waitAndTrade', label: 'Wait & Trade' },
    { key: 'premiumDifference', label: 'Premium Difference' }, // Needs 2+ Legs
    { key: 'reEntryExecute', label: 'Re Entry/Execute' },
    { key: 'trailSL', label: 'Trail SL' },
  ];

  // Safety Check: If legs < 2 and Premium Diff is ON, turn it OFF
  useEffect(() => {
    if (legs && legs.length < 2 && advanceSettings.premiumDifference) {
        setAdvanceSettings(prev => ({ ...prev, premiumDifference: false }));
    }
  }, [legs]);

  const handleToggle = (key) => {
    setAdvanceSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    // ✅ Main Container: Light (White) | Dark (Slate-800)
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 shadow-sm dark:shadow-none transition-colors duration-300">
       
       <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
          <Layers className="text-purple-600 dark:text-purple-500" size={18}/> Advance Features
       </h3>
       
       <p className="text-[14px] mb-4 text-gray-500 dark:text-gray-400 mt-0.5 font-medium leading-tight">
          Utilize advanced execution controls for dynamic stop-loss movement and exit synchronization.
       </p>
       
       <div className="grid grid-cols-2 gap-4">
          {features.map((feat) => {
             
             const isPremDiff = feat.key === 'premiumDifference';
             const isDisabled = isPremDiff && legs.length < 2;

             return (
                 <label 
                    key={feat.key} 
                    className={`flex items-center gap-2 p-2 rounded border transition-all duration-200 
                        ${isDisabled 
                            ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-800' 
                            : 'cursor-pointer'} 
                        ${!isDisabled && advanceSettings[feat.key] 
                            ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/50' 
                            : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-gray-500'}
                    `}
                 >
                    <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 accent-purple-600 dark:accent-purple-500 rounded cursor-pointer disabled:cursor-not-allowed" 
                        checked={!!advanceSettings[feat.key]}
                        onChange={() => !isDisabled && handleToggle(feat.key)}
                        disabled={isDisabled} 
                    />
                    
                    <span className={`text-xs font-medium 
                        ${advanceSettings[feat.key] 
                            ? 'text-purple-900 dark:text-white' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                        {feat.label}
                    </span>

                    {/* Disabled Badge */}
                    {isDisabled && (
                        <span className="ml-auto text-[9px] text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded">
                            Needs 2 Legs
                        </span>
                    )}
                 </label>
             );
          })}
       </div>
    </div>
  );
};

export default AdvanceFeaturesSection;