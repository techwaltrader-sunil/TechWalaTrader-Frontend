
// import React, { useState } from 'react';
// import { X, Rocket, ShieldCheck, AlertTriangle } from 'lucide-react';

// const DeployModal = ({ isOpen, onClose, strategy, onConfirmDeploy }) => {
//   const [executionType, setExecutionType] = useState('PAPER'); // 'PAPER' or 'LIVE'
//   const [multiplier, setMultiplier] = useState(1);
//   const [broker, setBroker] = useState('Angel One'); // Default Broker

//   if (!isOpen || !strategy) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm animate-in fade-in transition-colors">
//         {/* ✅ Modal Content: Light (White) | Dark (Slate-950) */}
//         <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl w-[450px] shadow-2xl relative transition-colors duration-300">
            
//             {/* Header */}
//             <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900 rounded-t-xl transition-colors">
//                 <div>
//                     <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                         <Rocket className="text-blue-600 dark:text-blue-500" size={20}/>
//                         Deploy Strategy
//                     </h2>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">{strategy.name}</p>
//                 </div>
//                 <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
//                     <X size={20}/>
//                 </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 space-y-5">
                
//                 {/* 1. Execution Mode */}
//                 <div>
//                     <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Execution Mode</label>
//                     <div className="grid grid-cols-2 gap-3">
//                         <button 
//                             onClick={() => setExecutionType('PAPER')}
//                             className={`py-2.5 px-4 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2
//                                 ${executionType === 'PAPER' 
//                                     ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' 
//                                     : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'}
//                             `}
//                         >
//                             <ShieldCheck size={14} /> Paper Trading
//                         </button>
//                         <button 
//                             onClick={() => setExecutionType('LIVE')}
//                             className={`py-2.5 px-4 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2
//                                 ${executionType === 'LIVE' 
//                                     ? 'bg-green-50 dark:bg-green-500/10 border-green-500 text-green-600 dark:text-green-400' 
//                                     : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'}
//                             `}
//                         >
//                             <Rocket size={14} /> Live Trading
//                         </button>
//                     </div>
//                 </div>

//                 {/* 2. Broker Selection (Only if LIVE) */}
//                 {executionType === 'LIVE' && (
//                     <div className="animate-in fade-in slide-in-from-top-2">
//                         <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Select Broker</label>
//                         <select 
//                             value={broker} 
//                             onChange={(e) => setBroker(e.target.value)}
//                             className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
//                         >
//                             <option>Angel One</option>
//                             <option>Zerodha</option>
//                             <option>Dhan</option>
//                             <option>Fyers</option>
//                         </select>
//                     </div>
//                 )}

//                 {/* 3. Multiplier */}
//                 <div>
//                     <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Quantity Multiplier (x)</label>
//                     <div className="flex items-center gap-3">
//                         <button onClick={() => setMultiplier(Math.max(1, multiplier - 1))} className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-bold transition-colors">-</button>
//                         <input 
//                             type="number" 
//                             value={multiplier}
//                             readOnly
//                             className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 h-10 text-center text-gray-900 dark:text-white font-bold rounded outline-none transition-colors"
//                         />
//                         <button onClick={() => setMultiplier(multiplier + 1)} className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-bold transition-colors">+</button>
//                     </div>
//                     <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
//                         Base Qty: {strategy.legs?.[0]?.qty || 1} x {multiplier} = <span className="text-gray-900 dark:text-white font-bold">{(strategy.legs?.[0]?.qty || 1) * multiplier}</span>
//                     </p>
//                 </div>

//                 {/* Warning */}
//                 {executionType === 'LIVE' && (
//                     <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 p-3 rounded-lg flex gap-3 items-start transition-colors">
//                         <AlertTriangle className="text-yellow-600 dark:text-yellow-500 shrink-0" size={16} />
//                         <p className="text-[10px] text-gray-600 dark:text-gray-400">
//                             You are about to deploy in <b className="text-yellow-600 dark:text-yellow-500">LIVE</b> mode. Real money will be used for trades.
//                         </p>
//                     </div>
//                 )}
//             </div>

//             {/* Footer */}
//             <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3 transition-colors">
//                 <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg transition-colors">Cancel</button>
//                 <button 
//                     onClick={() => onConfirmDeploy({ strategyId: strategy.id, executionType, broker, multiplier })}
//                     className={`px-6 py-2 text-xs font-bold text-white rounded-lg shadow-lg transition-all active:scale-95
//                         ${executionType === 'LIVE' 
//                             ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20' 
//                             : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'}
//                     `}
//                 >
//                     {executionType === 'LIVE' ? 'Go Live' : 'Start Paper Trade'}
//                 </button>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default DeployModal;


import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const DeployModal = ({ isOpen, onClose, strategy, onConfirmDeploy }) => {
  // --- STATE MANAGEMENT ---
  const [isLive, setIsLive] = useState(true); // true = Live, false = Forward Test
  const [multiplier, setMultiplier] = useState(1);
  const [maxProfit, setMaxProfit] = useState(0);
  const [maxLoss, setMaxLoss] = useState(0);
  const [squareOffTime, setSquareOffTime] = useState('15:15'); // 03:15 PM
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // 💡 DUMMY BROKERS (Aap ise props ya API se replace kar sakte hain)
  const availableBrokers = [
      { id: '1', name: 'Groww', clientId: '7010511859' },
      { id: '2', name: 'Dhan', clientId: '1000728652' }
  ];
  
  const [selectedBrokers, setSelectedBrokers] = useState([]);

  // Reset states when modal opens
  useEffect(() => {
      if (isOpen) {
          setIsLive(true);
          setMultiplier(1);
          setMaxProfit(0);
          setMaxLoss(0);
          setSquareOffTime('15:15');
          setAcceptedTerms(false);
          // Auto-select all brokers by default
          setSelectedBrokers(availableBrokers.map(b => b.id));
      }
  }, [isOpen]);

  if (!isOpen || !strategy) return null;

  // --- HANDLERS ---
  const handleSelectAllBrokers = () => {
      if (selectedBrokers.length === availableBrokers.length) {
          setSelectedBrokers([]); // Deselect All
      } else {
          setSelectedBrokers(availableBrokers.map(b => b.id)); // Select All
      }
  };

  const handleToggleBroker = (id) => {
      if (selectedBrokers.includes(id)) {
          setSelectedBrokers(selectedBrokers.filter(bId => bId !== id));
      } else {
          setSelectedBrokers([...selectedBrokers, id]);
      }
  };

  const handleDeploy = () => {
      if (!acceptedTerms) return;
      
      const payload = {
          strategyId: strategy._id || strategy.id,
          executionType: isLive ? 'LIVE' : 'FORWARD_TEST',
          brokers: selectedBrokers,
          multiplier: Number(multiplier),
          maxProfit: Number(maxProfit),
          maxLoss: Number(maxLoss),
          squareOffTime
      };
      
      onConfirmDeploy(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm animate-in fade-in duration-200 transition-colors">
        
        {/* ✅ Modal Container (Matches Algorooms Style) */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl w-[550px] shadow-2xl relative transition-colors duration-300">
            
            {/* Header */}
            <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-100 dark:border-slate-800 transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Deploy Strategy</h2>
                <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                    Close
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
                
                {/* 1. Deployment Type & Brokers Grid */}
                <div className="grid grid-cols-2 gap-6">
                    
                    {/* Left: Toggle Switch */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Deployment Type</label>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold transition-colors ${isLive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>Live</span>
                            
                            {/* Switch */}
                            <div 
                                onClick={() => setIsLive(!isLive)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${!isLive ? 'bg-gray-300 dark:bg-slate-600' : 'bg-blue-600 dark:bg-blue-500'}`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${!isLive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            
                            <span className={`text-sm font-bold transition-colors ${!isLive ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Forward Test</span>
                        </div>
                    </div>

                    {/* Right: Brokers List */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Brokers</label>
                        <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 space-y-3 bg-gray-50 dark:bg-slate-900/50 max-h-32 overflow-y-auto custom-scrollbar transition-colors">
                            
                            {/* Select All Checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={selectedBrokers.length === availableBrokers.length}
                                    onChange={handleSelectAllBrokers}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer accent-blue-600"
                                />
                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">Select All</span>
                            </label>
                            
                            {/* Individual Brokers */}
                            {availableBrokers.map(b => (
                                <label key={b.id} className="flex items-center gap-2 cursor-pointer group pl-1">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedBrokers.includes(b.id)}
                                        onChange={() => handleToggleBroker(b.id)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer accent-blue-600"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        {b.name} ({b.clientId})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Inputs Grid (2x2) */}
                <div className="grid grid-cols-2 gap-5">
                    
                    {/* Qty Multiplier */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Qty Multiplier</label>
                        <input 
                            type="number" 
                            min="1"
                            value={multiplier}
                            onChange={(e) => setMultiplier(e.target.value)}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Max Profit */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Max Profit (optional)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={maxProfit}
                            onChange={(e) => setMaxProfit(e.target.value)}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Max Loss */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Max Loss (optional)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={maxLoss}
                            onChange={(e) => setMaxLoss(e.target.value)}
                            className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Auto Square Off Time */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Auto Square Off Time</label>
                        <div className="relative">
                            <input 
                                type="time" 
                                value={squareOffTime}
                                onChange={(e) => setSquareOffTime(e.target.value)}
                                className="w-full border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                            />
                            <Clock className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                </div>

                {/* 3. Terms & Conditions */}
                <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group w-fit">
                        <input 
                            type="checkbox" 
                            checked={acceptedTerms}
                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer accent-blue-600"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            I accept all the <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">terms & conditions</a>
                        </span>
                    </label>
                </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-6 pt-0 flex justify-end gap-3 transition-colors">
                <button 
                    onClick={onClose} 
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleDeploy}
                    disabled={!acceptedTerms || selectedBrokers.length === 0}
                    className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    Deploy
                </button>
            </div>

        </div>
    </div>
  );
};

export default DeployModal;