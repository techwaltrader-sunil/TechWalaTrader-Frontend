import React from 'react';
import { Terminal } from 'lucide-react';

const LiveLogTicker = ({ logs }) => {
  return (
    <div className="bg-slate-950 rounded-xl p-5 shadow-inner border border-slate-800 h-[250px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
        <Terminal size={16} className="text-green-500" />
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live System Logs</h3>
      </div>
      
      <div className="overflow-y-auto custom-scrollbar space-y-2 flex-1">
        {logs && logs.length > 0 ? (
          logs.map((log, idx) => (
            <div key={idx} className="flex gap-3 text-[11px] animate-in slide-in-from-top-1 duration-300">
              <span className="text-slate-600 font-mono shrink-0">[{log.time}]</span>
              <span className={`font-mono ${log.type === 'SUCCESS' ? 'text-green-400' : log.type === 'FAILED' ? 'text-red-400' : 'text-blue-300'}`}>
                {log.message}
              </span>
            </div>
          ))
        ) : (
          <p className="text-[10px] text-slate-600 italic">Waiting for system signals...</p>
        )}
      </div>
    </div>
  );
};

export default LiveLogTicker;