
import React from 'react';

const StrategyTypeSection = ({ selected, onSelect }) => {
  
  const strategies = ['Time Based', 'Indicator Based', 'Price Action Based'];

  return (
    // ✅ Container: Light (White + Gray Border) | Dark (Slate-800 + Slate-700 Border)
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors duration-300">
      
      {/* Heading: Light (Gray-500) | Dark (Gray-400) */}
      <h3 className="font-bold mb-3 text-sm text-gray-500 dark:text-gray-400">Strategy Type</h3>
      
      <div className="space-y-3">
        {strategies.map(type => (
          <label key={type} className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="strategyType" 
              className="w-4 h-4 accent-blue-600 dark:accent-blue-500" 
              checked={selected === type}
              onChange={() => onSelect(type)}
            />
            
            {/* Text Logic:
                - Selected: Blue-600 (Light) | Blue-400 (Dark)
                - Unselected: Gray-600 (Light) | Gray-400 (Dark)
                - Hover: Gray-900 (Light) | White (Dark)
            */}
            <span className={`text-sm font-medium transition-colors duration-200 
              ${selected === type 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
              }`}
            >
              {type}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StrategyTypeSection;