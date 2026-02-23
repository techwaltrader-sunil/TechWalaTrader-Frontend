

import React, { useState, useEffect } from 'react';
import { Link2, X, CheckCircle2, ShieldAlert } from 'lucide-react';

const ApiConnectModal = ({ isOpen, onClose, brokerName, existingData, onSave }) => {
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    broker: 'dhan',
    clientId: '',
    apiKey: '',
    secretKey: ''
  });

  // --- PRE-FILL DATA (When Modal Opens) ---
  useEffect(() => {
    if (isOpen) {
      setFormData({
        // Agar brokerName parent se aaya hai to use select karo, nahi to default 'dhan'
        broker: brokerName ? brokerName.toLowerCase().replace(/\s/g, '') : 'dhan', 
        clientId: existingData?.clientId || '',
        apiKey: existingData?.apiKey || '',
        secretKey: '' // Secret key security ke liye hamesha blank rakhte hain ya existing hash dikhate hain
      });
    }
  }, [isOpen, brokerName, existingData]);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = () => {
    if (!formData.clientId || !formData.apiKey) {
      alert("Client ID and API Key are required!");
      return;
    }
    // Parent component (Brokers.jsx) ko data bhejo
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-800/50 px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Link2 className="text-blue-500" size={20} /> 
            {existingData?.clientId ? 'Update Broker Keys' : 'Connect Trading Account'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-md hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 space-y-5">
          
          {/* Select Broker */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Broker</label>
            <div className="relative">
                <select 
                    name="broker"
                    value={formData.broker}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    disabled={!!existingData?.clientId} // Agar edit kar rahe hain to broker change mat karne do
                >
                    <option value="dhan">Dhan HQ</option>
                    <option value="zerodha">Zerodha Kite</option>
                    <option value="fyers">Fyers</option>
                    <option value="angelone">Angel One</option>
                </select>
                {/* Custom Arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Client ID / User ID</label>
            <input 
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              type="text" 
              placeholder="e.g. 1100223344"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 transition-colors"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">API Key</label>
            <input 
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              type="password" 
              placeholder="Paste your API Key here"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-mono tracking-wider transition-colors"
            />
          </div>

          {/* Secret Key (Optional UI) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Secret Key / Totp (If required)</label>
            <input 
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              type="password" 
              placeholder="Paste your Secret Key here"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-mono tracking-wider transition-colors"
            />
          </div>
            
          {/* Security Note */}
          <div className="flex gap-2 items-start bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
             <ShieldAlert className="text-blue-500 shrink-0" size={16} />
             <p className="text-[10px] text-blue-300 leading-relaxed">
                Credentials are encrypted before being stored. Ensure you are copying keys from the official broker portal.
             </p>
          </div>

        </div>

        {/* Modal Footer (Buttons) */}
        <div className="bg-slate-800/50 px-6 py-4 flex justify-end gap-3 border-t border-slate-800">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-lg font-bold text-xs transition-all border border-slate-700"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit} // ✅ Calls handleSubmit -> onSave
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
          >
            <CheckCircle2 size={16} /> {existingData?.clientId ? 'Update Connection' : 'Connect Account'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApiConnectModal;