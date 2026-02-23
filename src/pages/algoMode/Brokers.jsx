
import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Power, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// ✅ 1. APNA CUSTOM TOAST IMPORT KAREIN (Path apne folder ke hisab se check kar lein)
import ToastNotification from '../../components/ToastNotification'; 

import { 
  getConnectedBrokers, 
  deleteBroker, 
  squareOffBroker, 
  updateEngineStatus,
  updateBrokerStatus 
} from '../../data/AlogoTrade/brokerService';

const Brokers = () => {
  const navigate = useNavigate();
  const [connectedBrokers, setConnectedBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null); 

  // ✅ 2. CUSTOM TOAST STATE
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: 'success', id: 0 });

  // Toast dikhane ka helper function
  const showToast = (message, type = 'success') => {
      // id me Date.now() isliye diya taaki agar lagaatar 2 baar error aaye to animation dobara chale
      setToastConfig({ show: true, message, type, id: Date.now() });
  };

  const closeToast = () => {
      setToastConfig(prev => ({ ...prev, show: false }));
  };

  // --- LOAD DATA ---
  const fetchBrokers = async () => {
      try {
          const data = await getConnectedBrokers();
          setConnectedBrokers(data);
      } catch (error) {
          console.error("Failed to load brokers", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  // --- CLICK OUTSIDE TO CLOSE MENU ---
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- HANDLERS ---

  // ✅ 3. TRADING ENGINE LOGIC
  const handleEngineToggle = async (broker) => {
      const brokerId = broker._id || broker.id;
      const newEngineStatus = !broker.engineOn; 

      try {
          const updatedList = await updateEngineStatus(brokerId, newEngineStatus);
          setConnectedBrokers(updatedList);
          showToast(`Trading Engine ${newEngineStatus ? 'Started 🚀' : 'Stopped 🛑'}`, 'success');
      } catch (error) {
          showToast("Engine status update fail ho gaya.", 'error');
      }
  };

  // ✅ 4. DELETE BROKER LOGIC
  const handleDelete = async (id) => {
      if(window.confirm("Are you sure? This will remove the broker API keys permanently.")) {
          try {
              await deleteBroker(id); 
              setConnectedBrokers(prev => prev.filter(b => b._id !== id && b.id !== id));
              setActiveMenu(null);
              showToast("Broker deleted successfully! 🗑️", 'success');
          } catch (error) {
              showToast("Failed to delete broker.", 'error');
          }
      }
  };

  // ✅ 5. SQUARE OFF LOGIC
  const handleSquareOff = async (id) => {
      if(window.confirm("🚨 EMERGENCY: Square off ALL positions for this broker?")) {
          try {
              const res = await squareOffBroker(id);
              if(res.success) {
                  showToast(res.message || "All positions squared off! ✅", 'success');
              }
              setActiveMenu(null);
          } catch (error) {
              showToast("Failed to square off.", 'error');
          }
      }
  };

  // ✅ 6. TERMINAL TOGGLE LOGIC
  const handleTerminalToggle = async (broker) => {
      const brokerId = broker._id || broker.id;
      if (!broker.terminalOn) {
          navigate(`/broker-login/${brokerId}`);
      } else {
          if(window.confirm(`Disconnect ${broker.name}?`)) {
              try {
                  const updatedList = await updateBrokerStatus(brokerId, false);
                  setConnectedBrokers(updatedList);
                  showToast("Terminal Disconnected.", 'success');
              } catch (error) {
                  showToast("Failed to disconnect.", 'error');
              }
          }
      }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-300 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Broker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your connected brokers</p>
        </div>
        <button 
            onClick={() => navigate('/add-brokers')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
            <Plus size={18} strokeWidth={3} /> Add Broker
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
            // SKELETON LOADER
            [1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 animate-pulse">
                    <div className="flex items-center gap-4 w-full md:w-auto min-w-[200px]">
                        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-slate-800"></div>
                        <div className="space-y-2">
                            <div className="h-5 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                            <div className="h-3 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div>
                        </div>
                    </div>
                    <div className="flex-1 w-full md:w-auto flex flex-col items-center">
                        <div className="h-3 w-24 bg-gray-200 dark:bg-slate-800 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="h-8 w-32 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    </div>
                </div>
            ))
        ) : connectedBrokers.length > 0 ? (
            // REAL DATA CARDS
            connectedBrokers.map((broker) => {
                const brokerId = broker._id || broker.id; 

                return (
                    <div key={brokerId} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 transition-colors relative">
                        
                        {/* A. Identity */}
                        <div className="flex items-center gap-4 w-full md:w-auto min-w-[200px]">
                            <div className="w-14 h-14 rounded-full border border-gray-100 dark:border-slate-800 p-2 shadow-sm flex items-center justify-center bg-white dark:bg-slate-800">
                                <img src={broker.logo} alt={broker.name} className="w-full h-full object-contain rounded-full" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{broker.name}</h3>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">{broker.clientId}</p>
                                <p className={`text-[11px] font-bold uppercase tracking-wide ${broker.terminalOn ? 'text-green-500' : 'text-red-500'}`}>
                                    {broker.terminalOn ? 'Connected' : 'Not Connected'}
                                </p>
                            </div>
                        </div>

                        {/* B. Performance */}
                        <div className="flex-1 text-center border-t md:border-t-0 md:border-l md:border-r border-gray-100 dark:border-slate-800 py-4 md:py-0 w-full md:w-auto">
                            <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-1">Strategy Performance</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{broker.performance || '0.00'}</p>
                        </div>

                        {/* C. Toggles & Actions */}
                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end relative">
                            
                            {/* Terminal Switch */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Terminal</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={broker.terminalOn || false} onChange={() => handleTerminalToggle(broker)} />
                                    <div className="w-10 h-5 bg-gray-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                </label>
                            </div>

                            {/* Trading Engine Switch */}
                            <div className="flex flex-col items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${broker.terminalOn ? 'text-gray-400' : 'text-gray-300'}`}>Trading Engine</span>
                                <label className={`relative inline-flex items-center cursor-pointer ${!broker.terminalOn ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={broker.engineOn || false} 
                                        onChange={() => handleEngineToggle(broker)} 
                                        disabled={!broker.terminalOn} 
                                    />
                                    <div className="w-10 h-5 bg-gray-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                </label>
                            </div>

                            {/* MENU BUTTON */}
                            <div className="relative">
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setActiveMenu(activeMenu === brokerId ? null : brokerId); 
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {/* DROPDOWN */}
                                {activeMenu === brokerId && (
                                    <div className="absolute right-0 top-10 w-40 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                        <button 
                                            onClick={() => handleSquareOff(brokerId)}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
                                        >
                                            <Power size={14} className="text-orange-500"/> Square Off
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(brokerId)}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-slate-800"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-800">
                <p className="text-gray-500">No brokers connected yet. Click "Add Broker" to start.</p>
            </div>
        )}
      </div>

      {/* ✅ CUSTOM TOAST COMPONENT RENDER HOGA YAHAN */}
      {toastConfig.show && (
          <ToastNotification 
              key={toastConfig.id} // Key zaruri hai taaki naya toast hamesha animate ho
              message={toastConfig.message} 
              type={toastConfig.type} 
              onClose={closeToast} 
          />
      )}
      
    </div>
  );
};

export default Brokers;