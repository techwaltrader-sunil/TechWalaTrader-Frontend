

import React from 'react';
import { TrendingUp, Wallet, ArrowRight } from 'lucide-react';

const TemplateCard = ({ template, onUse }) => {
  
  return (
    // ✅ Main Container: Light (White) | Dark (Slate-800)
    <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/10 dark:hover:shadow-blue-900/10 transition-all group flex flex-col h-full animate-in fade-in relative overflow-hidden duration-300">
      
      {/* Visual Accent (Top Gradient) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      {/* 1. HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-[16px] text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {template.name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
             <span className="bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-gray-600 dark:text-gray-300 font-medium transition-colors">{template.segment}</span>
             <span>•</span>
             <span>{template.type}</span>
          </p>
        </div>
        
        {/* Risk Badge */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border 
            ${template.risk === 'Low' 
                ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' 
                : template.risk === 'High' 
                    ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' 
                    : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'}
        `}>
            {template.risk} Risk
        </span>
      </div>

      {/* 2. DESCRIPTION */}
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-5 line-clamp-2">
          {template.description}
      </p>

      {/* 3. METRICS GRID (ROI & Capital) */}
      <div className="grid grid-cols-2 gap-3 mb-5">
          {/* ROI Box */}
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-2.5 border border-gray-200 dark:border-slate-700/50 transition-colors">
              <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold flex items-center gap-1 mb-1">
                  <TrendingUp size={10} className="text-green-600 dark:text-green-500"/> Exp. ROI
              </p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">{template.roi}</p>
          </div>
          
          {/* Capital Box */}
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-2.5 border border-gray-200 dark:border-slate-700/50 transition-colors">
              <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold flex items-center gap-1 mb-1">
                  <Wallet size={10} className="text-blue-600 dark:text-blue-500"/> Min Capital
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">₹{template.capital}</p>
          </div>
      </div>

      {/* 4. FOOTER (Use Template Button) */}
      <div className="mt-auto">
          <button 
            onClick={() => onUse(template)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-lg shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group-active:scale-95"
          >
              Use This Template <ArrowRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform"/>
          </button>
      </div>

    </div>
  );
};

export default TemplateCard;