import React, { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios'; // ✅ NAYA: API call ke liye Axios import kiya
import { getConnectedBrokers } from '../../../data/AlogoTrade/brokerService'; 

// ✅ NAYA prop: onDeploySuccess (Taki parent component ko pata chale ki deploy ho gaya)
const DeployModal = ({ isOpen, onClose, strategy, onDeploySuccess }) => {
  // --- STATE MANAGEMENT ---
  const [isLive, setIsLive] = useState(true); 
  const [multiplier, setMultiplier] = useState(1);
  const [maxProfit, setMaxProfit] = useState(0);
  const [maxLoss, setMaxLoss] = useState(0);
  const [squareOffTime, setSquareOffTime] = useState('15:15'); 
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [selectedBrokers, setSelectedBrokers] = useState([]);
  const [isLoadingBrokers, setIsLoadingBrokers] = useState(false);
  
  // ✅ NAYA: Deploy button par loading dikhane ke liye
  const [isDeploying, setIsDeploying] = useState(false); 

  // Reset states & Fetch Brokers when modal opens
  useEffect(() => {
      if (isOpen) {
          setIsLive(true);
          setMultiplier(1);
          setAcceptedTerms(false);
          setIsDeploying(false); // Reset loading
          
          const riskData = strategy?.data?.riskManagement || {};
          setMaxProfit(riskData.maxProfit || 0);
          setMaxLoss(riskData.maxLoss || 0);
          setSquareOffTime(riskData.noTradeAfter || '15:15'); 

          // Fetch Real Brokers
          const fetchBrokers = async () => {
              setIsLoadingBrokers(true);
              try {
                  const data = await getConnectedBrokers();
                  const activeBrokers = data.filter(b => b.terminalOn);
                  setAvailableBrokers(activeBrokers);
                  setSelectedBrokers(activeBrokers.map(b => b._id || b.id));
              } catch (error) {
                  console.error("Failed to load brokers in modal:", error);
              } finally {
                  setIsLoadingBrokers(false);
              }
          };

          fetchBrokers();
      }
  }, [isOpen, strategy]); 

  if (!isOpen || !strategy) return null;

  // --- HANDLERS ---
  const handleSelectAllBrokers = () => {
      if (selectedBrokers.length === availableBrokers.length && availableBrokers.length > 0) {
          setSelectedBrokers([]); 
      } else {
          setSelectedBrokers(availableBrokers.map(b => b._id || b.id)); 
      }
  };

  const handleToggleBroker = (id) => {
      if (selectedBrokers.includes(id)) {
          setSelectedBrokers(selectedBrokers.filter(bId => bId !== id));
      } else {
          setSelectedBrokers([...selectedBrokers, id]);
      }
  };

  // 🔥 THE NEW BACKEND CONNECTION 🔥
  const handleDeployClick = async () => {
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
      
      try {
          setIsDeploying(true); // Button pe loading chalu karo
          
          // ✅ API CALL TO BACKEND
          // Note: Apne backend ka sahi URL yahan set karein (jaise http://localhost:5000)
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await axios.post(`${API_URL}/api/deployments`, payload);

          if (response.data.success) {
              alert(response.data.message || "Strategy deployed successfully! 🎉");
              if(onDeploySuccess) onDeploySuccess(response.data.data); // Parent ko update bhej do
              onClose(); // Modal band kar do
          }
      } catch (error) {
          console.error("Deployment Error:", error);
          alert(error.response?.data?.message || "Failed to deploy strategy. Please try again.");
      } finally {
          setIsDeploying(false); // Loading band karo
      }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm animate-in fade-in duration-200 transition-colors">
        
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
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Deployment Type</label>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold transition-colors ${isLive ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>Live</span>
                            
                            <div 
                                onClick={() => setIsLive(!isLive)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${!isLive ? 'bg-gray-300 dark:bg-slate-600' : 'bg-blue-600 dark:bg-blue-500'}`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${!isLive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            
                            <span className={`text-sm font-bold transition-colors ${!isLive ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>Forward Test</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Brokers</label>
                        <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 space-y-3 bg-gray-50 dark:bg-slate-900/50 max-h-32 overflow-y-auto custom-scrollbar transition-colors">
                            
                            {isLoadingBrokers ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="animate-spin text-blue-500" size={20} />
                                </div>
                            ) : availableBrokers.length === 0 ? (
                                <div className="py-2 text-center">
                                    <AlertTriangle className="mx-auto text-yellow-500 mb-1" size={16} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">No active brokers found.</p>
                                </div>
                            ) : (
                                <>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedBrokers.length === availableBrokers.length && availableBrokers.length > 0}
                                            onChange={handleSelectAllBrokers}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer accent-blue-600"
                                        />
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors">Select All</span>
                                    </label>
                                    
                                    {availableBrokers.map(b => {
                                        const currentId = b._id || b.id;
                                        return (
                                        <label key={currentId} className="flex items-center gap-2 cursor-pointer group pl-1">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedBrokers.includes(currentId)}
                                                onChange={() => handleToggleBroker(currentId)}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer accent-blue-600"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {b.name} ({b.clientId})
                                            </span>
                                        </label>
                                    )})}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    
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

            <div className="p-6 pt-0 flex justify-end gap-3 transition-colors">
                <button 
                    onClick={onClose} 
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                    disabled={isDeploying}
                >
                    Cancel
                </button>
                <button 
                    onClick={handleDeployClick} // ✅ Ye function ab backend call karega
                    disabled={!acceptedTerms || selectedBrokers.length === 0 || isDeploying}
                    className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[120px]"
                >
                    {/* ✅ NAYA: Loading spinner logic */}
                    {isDeploying ? <Loader2 className="animate-spin text-white" size={16} /> : 'Deploy'}
                </button>
            </div>

        </div>
    </div>
  );
};

export default DeployModal;