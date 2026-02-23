

import React from 'react';
import { Save, RefreshCw } from 'lucide-react';

const StrategyFooter = ({ name, setName, onSave, isEditMode }) => {

  return (
    // ✅ Container: Light (White + Gray Border) | Dark (Slate-800 + Slate-700 Border)
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-gray-200/50 dark:shadow-none transition-colors duration-300">
        
        <div className="w-full md:w-2/3">
           <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-bold">Strategy Name</label>
           
           {/* Input: Light (Gray-50) | Dark (Slate-900) */}
           <input 
             type="text" 
             placeholder="Enter Strategy Name (e.g., Nifty 9:15 Scalper)" 
             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-blue-500 outline-none font-medium transition-colors placeholder-gray-400 dark:placeholder-gray-600"
             value={name}
             onChange={(e) => setName(e.target.value)}
           />
        </div>
        
        <button 
            onClick={onSave} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
           {/* Change Icon and Text based on Mode */}
           {isEditMode ? <RefreshCw size={18} /> : <Save size={18} />}
           {isEditMode ? "Update Strategy" : "Create Strategy"}
        </button>
        
    </div>
  );
};

export default StrategyFooter;