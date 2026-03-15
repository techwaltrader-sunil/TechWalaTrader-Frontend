import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { getAlgoLogs } from "../../../data/AlogoTrade/brokerService";
import io from "socket.io-client"; // 🔥 SOCKET IMPORT KIYA

const TradeEngineLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Pehle purane logs fetch karo
    const fetchLogs = async () => {
      setLoading(true);
      const data = await getAlgoLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();

    // 🔥 2. Socket Connect karo (Dhyan dein: Apne backend ka port daalein, usually 5500 ya 6000)
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

    // 🔥 3. Jaise hi naya log aaye, usko state me sabse aage (top par) jod do
    socket.on("new-trade-log", (newLog) => {
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    });

    // Cleanup function: Component unmount hone par socket disconnect kar do
    return () => {
      socket.disconnect();
    };
  }, []);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatErrorMessage = (rawMessage) => {
    if (!rawMessage) return "Order Failed";
    try {
      let cleanMsg = String(rawMessage)
        .replace(/^"|"$/g, "")
        .replace(/\\"/g, '"')
        .trim();
      let lowerMsg = cleanMsg.toLowerCase();

      if (cleanMsg.startsWith("{") || cleanMsg.startsWith("[")) {
        try {
          const parsedError = JSON.parse(cleanMsg);
          return (
            parsedError.internalErrorMessage ||
            parsedError.errorMessage ||
            "Broker API Error"
          );
        } catch (e) {}
      }

      if (
        lowerMsg.includes("reference chain") ||
        lowerMsg.includes("co.dhan") ||
        lowerMsg.includes("exchangesegment")
      ) {
        return "Broker Error: Invalid Exchange Segment sent to API. (Expected NSE_FNO)";
      }

      // 🔥 NAYA FIX: Access Token Error ko human-readable banaya 🔥
      if (
        lowerMsg.includes("access-token") &&
        lowerMsg.includes("not present")
      ) {
        return "Broker Error: API Secret (Access Token) is missing. Please update your Broker credentials in settings.";
      }

      if (cleanMsg.length > 120) return cleanMsg.substring(0, 120) + "...";
      return cleanMsg;
    } catch (error) {
      return "System Validation Error";
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
      <style>{`
          .custom-scrollbar::-webkit-scrollbar { height: 12px; display: block !important; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 0px 0px 10px 10px; border-top: 1px solid #e2e8f0; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; border: 2px solid #f1f5f9; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
          .dark .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; border-top: 1px solid #1e293b; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border: 2px solid #0f172a; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none text-gray-900 dark:text-white transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer">
            All Logs
          </span>
          <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors">
            Rejected / Failed
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-lg transition-colors overflow-hidden relative z-0">
        <div className="overflow-x-auto custom-scrollbar min-h-[160px]">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-slate-700 transition-colors">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Time / Order ID
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Symbol
                </th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">
                  Broker
                </th>
                <th className="px-6 py-4 font-medium text-center whitespace-nowrap">
                  Action
                </th>
                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">
                  Price & Qty
                </th>
                <th className="px-6 py-4 font-medium text-center whitespace-nowrap">
                  Status
                </th>
                {/* <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Net P&L</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50 transition-colors">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    Loading Trade Logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No algorithm trades executed yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all text-sm"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900 dark:text-white font-medium flex items-center gap-1.5">
                        <Clock
                          size={14}
                          className="text-gray-400 dark:text-gray-500"
                        />{" "}
                        {formatTime(log.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {log.orderId && log.orderId !== "N/A"
                          ? log.orderId
                          : "N/A"}{" "}
                        • {formatDate(log.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {log.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded text-[11px] font-bold uppercase text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 transition-colors">
                        {log.brokerName || "System"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {log.action === "BUY" ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-md font-bold text-[10px] uppercase border border-green-200 dark:border-green-500/20">
                          <ArrowUpRight size={14} /> BUY
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-md font-bold text-[10px] uppercase border border-red-200 dark:border-red-500/20">
                          <ArrowDownRight size={14} /> SELL
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <p className="text-gray-900 dark:text-white font-bold text-[11px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded inline-block transition-colors">
                        MKT
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Qty: {log.quantity}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {log.status === "SUCCESS" ? (
                        <span className="text-green-600 dark:text-green-400 flex justify-center">
                          <CheckCircle2 size={18} />
                        </span>
                      ) : (
                        <div className="inline-flex items-center relative group/tooltip cursor-help">
                          <span className="text-red-600 dark:text-red-400">
                            <XCircle size={18} />
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 text-xs px-3 py-2.5 rounded shadow-lg dark:shadow-xl z-50 border border-gray-200 dark:border-slate-700 w-max max-w-[250px] whitespace-normal break-words text-left leading-relaxed transition-colors">
                            <span className="font-bold text-red-600 dark:text-red-400 block mb-1 border-b border-gray-200 dark:border-slate-700 pb-1 transition-colors">
                              Error Reason:
                            </span>
                            {formatErrorMessage(log.message)}
                          </div>
                        </div>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 text-right font-bold text-gray-400 italic whitespace-nowrap">N/A</td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeEngineLogsTab;
