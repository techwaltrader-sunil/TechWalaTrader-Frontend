// import React from 'react';
// import { Terminal } from 'lucide-react';

// const LiveLogTicker = ({ logs }) => {
//   return (
//     <div className="bg-slate-950 rounded-xl p-5 shadow-inner border border-slate-800 h-[250px] flex flex-col">
//       <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
//         <Terminal size={16} className="text-green-500" />
//         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live System Logs</h3>
//       </div>
      
//       <div className="overflow-y-auto custom-scrollbar space-y-2 flex-1">
//         {logs && logs.length > 0 ? (
//           logs.map((log, idx) => (
//             <div key={idx} className="flex gap-3 text-[11px] animate-in slide-in-from-top-1 duration-300">
//               <span className="text-slate-600 font-mono shrink-0">[{log.time}]</span>
//               <span className={`font-mono ${log.type === 'SUCCESS' ? 'text-green-400' : log.type === 'FAILED' ? 'text-red-400' : 'text-blue-300'}`}>
//                 {log.message}
//               </span>
//             </div>
//           ))
//         ) : (
//           <p className="text-[10px] text-slate-600 italic">Waiting for system signals...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LiveLogTicker;



import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import io from 'socket.io-client';

const LiveLogTicker = () => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  // ==========================================
  // 1. SOCKET CONNECTION & LISTENING
  // ==========================================
  useEffect(() => {
    // Vite use kar rahe hain toh import.meta.env lagega
    const socket = io(`${import.meta.env.VITE_API_URL}`);

    socket.on('system-log', (logData) => {
      setLogs((prevLogs) => {
        const updatedLogs = [...prevLogs, logData];
        return updatedLogs.slice(-150); // Sirf last 150 logs rakhega (No Lag)
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ==========================================
  // 2. AUTO-SCROLL MAGIC
  // ==========================================
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 rounded-xl p-5 shadow-inner border border-slate-800 h-[250px] flex flex-col">
      
      {/* 🟢 HEADER SECTION */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-green-500 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live System Logs</h3>
        </div>
        
        {/* Clear Logs Button */}
        <button 
          onClick={() => setLogs([])} 
          className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors"
          title="Clear Logs"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>
      
      {/* 🔴 TERMINAL BODY */}
      <div className="overflow-y-auto custom-scrollbar space-y-2 flex-1 pr-2">
        {logs && logs.length > 0 ? (
          logs.map((log, idx) => (
            <div key={idx} className="flex gap-3 text-[11px] animate-in slide-in-from-right-2 duration-300">
              
              {/* Timestamp */}
              <span className="text-slate-600 font-mono shrink-0">
                [{new Date(log.time).toLocaleTimeString('en-IN', { hour12: false })}]
              </span>
              
              {/* Dynamic Log Message with Emoji Highlighter */}
              <span 
                className={`font-mono leading-relaxed ${log.type === 'error' ? 'text-red-400' : 'text-blue-300'}`}
                dangerouslySetInnerHTML={{ 
                  // Emojis ko thoda bada aur highlight karne ka smart hack!
                  __html: log.message.replace(/✅|❌|🔥|🚀|🔎|🛡️|🎯|🛒|🔌|🛑|⚠️|📝/g, (match) => `<span class="text-sm mr-0.5">${match}</span>`) 
                }}
              />
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] text-slate-600 italic font-mono animate-pulse">Waiting for system signals...</p>
          </div>
        )}
        
        {/* Invisible div auto-scroll ke target ke liye */}
        <div ref={logsEndRef} />
      </div>

    </div>
  );
};

export default LiveLogTicker;