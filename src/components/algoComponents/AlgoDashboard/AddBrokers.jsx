

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Copy,
  ExternalLink,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveBroker } from "../../../data/AlogoTrade/brokerService"; // ✅ Import Service

const AddBrokers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ States for Inputs
  const [selectedBrokerName, setSelectedBrokerName] = useState("Stoxkart");
  const [clientId, setClientId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  // Broker Data
  const brokers = [
    { id: 'Stoxkart', name: 'Stoxkart', color: 'text-green-500', logo: '/brokersLogo/STOXKART.png', requiresKeys: false },
    { id: 'Upstox', name: 'Upstox', color: 'text-purple-500', logo: '/brokersLogo/UPSTOX.png', requiresKeys: true },
    { id: 'Finvasia', name: 'Finvasia', color: 'text-orange-500', logo: '/brokersLogo/FINVASIA.png', requiresKeys: true },
    { id: 'Fyers', name: 'Fyers', color: 'text-blue-500', logo: '/brokersLogo/FYERS.png', requiresKeys: true },
    { id: 'Dhan', name: 'Dhan', color: 'text-green-600', logo: '/brokersLogo/DHAN.jpg', requiresKeys: true }, 
    { id: 'Groww', name: 'Groww', color: 'text-emerald-500', logo: '/brokersLogo/GROWW.png', requiresKeys: false },
    { id: 'Motilal', name: 'Motilal Oswal', color: 'text-yellow-500', logo: '/brokersLogo/MotilalOswal.png', requiresKeys: true },
    { id: 'Zerodha', name: 'Zerodha', color: 'text-red-500', logo: '/brokersLogo/ZERODHA.png', requiresKeys: true },
    { id: 'Alice', name: 'Alice Blue', color: 'text-blue-400', logo: '/brokersLogo/AliceBlue.jpg', requiresKeys: true },
    { id: 'Angel', name: 'Angel One', color: 'text-orange-600', logo: '/brokersLogo/AngelOne.png', requiresKeys: true },
    { id: 'Master', name: 'Master Trust', color: 'text-blue-700', logo: '/brokersLogo/MasterTrust.png', requiresKeys: false },
    { id: '5Paisa', name: '5Paisa', color: 'text-orange-400', logo: '/brokersLogo/5Paisa.jpg', requiresKeys: true },
  ];

  const activeBroker =
    brokers.find((b) => b.name === selectedBrokerName) || brokers[0];
  const filteredBrokers = brokers.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCopyUrl = () => {
    navigator.clipboard.writeText("https://web.trademaster.com/connect-broker");
    alert("Redirect URL Copied!");
  };

  // ✅ NEW SUBMIT LOGIC
  const handleSubmit = async () => {
    if (!clientId) {
      alert("Please enter Broker ID / Client ID");
      return;
    }

    // Loading state dikha sakte ho yahan
    const newConnection = {
      name: activeBroker.name,
      clientId: clientId,
      apiKey: apiKey, // Backend me ye fields save hongi
      apiSecret: apiSecret,
      logo: activeBroker.logo,
      status: "Not Connected",
      isConnected: false,
    };

    try {
      // ✅ Backend API Call
      await saveBroker(newConnection);

      alert("Broker Added Successfully!");
      navigate("/brokers"); // Redirect to list page
    } catch (error) {
      alert("Failed to add broker. Check console for details.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Broker List */}
        <div className="lg:col-span-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Add Your Broker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse the partner list and pick the broker you want to connect
              with TradeMaster.
            </p>
          </div>
          <div className="relative mb-6">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search broker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all shadow-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBrokers.map((broker) => (
              <div
                key={broker.id}
                onClick={() => setSelectedBrokerName(broker.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border cursor-pointer transition-all duration-200 group relative overflow-hidden ${selectedBrokerName === broker.name ? "bg-blue-50 dark:bg-blue-900/10 border-blue-500 ring-1 ring-blue-500 shadow-md" : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-lg"}`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white dark:bg-slate-800 p-2 shadow-sm border border-gray-100 dark:border-slate-700">
                  <img
                    src={broker.logo}
                    alt={broker.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span
                  className={`text-sm font-semibold ${selectedBrokerName === broker.name ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {broker.name}
                </span>
                {selectedBrokerName === broker.name && (
                  <div className="absolute top-2 right-2 text-blue-600 dark:text-blue-400 animate-in zoom-in">
                    <CheckCircle2
                      size={16}
                      fill="currentColor"
                      className="text-white dark:text-slate-900"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Form */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-lg sticky top-6 transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Add Your Broker Detail
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Enter the login information required by {selectedBrokerName} to
              finish setup.
            </p>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-3 rounded-lg mb-6">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-gray-200 dark:border-slate-600 p-2">
                <img
                  src={activeBroker.logo}
                  alt={activeBroker.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {selectedBrokerName}
                </h3>
                <a
                  href="#"
                  className="text-[10px] text-red-500 hover:underline flex items-center gap-1 font-medium"
                >
                  How to add {selectedBrokerName}? <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block">
                  Broker ID / Client ID
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder={`Enter ${selectedBrokerName} ID`}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {activeBroker.requiresKeys && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter API Key"
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block">
                      API Secret Key
                    </label>
                    <input
                      type="password"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      placeholder="Enter API Secret Key"
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    Redirect URL <Info size={12} className="cursor-help" />
                  </label>
                  <button
                    onClick={handleCopyUrl}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-[10px] flex items-center gap-1 font-bold"
                  >
                    <Copy size={10} /> Copy
                  </button>
                </div>
                <div className="bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 break-all select-all font-mono">
                  https://web.trademaster.com/connect-broker
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  Submit & Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBrokers;
