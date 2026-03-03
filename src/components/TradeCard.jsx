import React, { useState, useRef, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MoreVertical,
  Copy,
  Loader2,
} from "lucide-react";
// 👇 आपके Components को Import करें
import ImageHoverCarousel from "./ImageHoverCarousel";
import ImageModal from "./ImageModal";

// 👇 'onClone' prop यहाँ receive करना न भूलें
const TradeCard = ({ trade, onEdit, onDelete, onClone }) => {
  // 1. Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. 🔥 NEW: Menu & Clone States
  const [showMenu, setShowMenu] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const menuRef = useRef(null);

  // 3. 🔥 NEW: Menu के बाहर क्लिक करने पर उसे बंद करना
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. 🔥 NEW: Clone Function
  const handleCloneTrade = async () => {
    setIsCloning(true);
    try {
      // Backend API call to clone
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/trades/${trade._id}/clone`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        // Parent component (JournalPage) ko list refresh karne ko bolein
        if (onClone) onClone();
        setShowMenu(false); // Menu band karein
      } else {
        alert("Failed to clone trade");
      }
    } catch (error) {
      console.error(error);
      alert("Error cloning trade");
    } finally {
      setIsCloning(false);
    }
  };

  // --- पुराना Image & PnL Logic (Same as before) ---
  const images =
    trade.imageUrls && trade.imageUrls.length > 0
      ? trade.imageUrls
      : trade.imageUrl
        ? [trade.imageUrl]
        : [];

  const calculatePoints = () => {
    const entry = parseFloat(trade.entryPrice || 0);
    const exit = parseFloat(trade.exitPrice || 0);
    const dir = trade.direction;

    if (["Call", "Put", "Fut Buy"].includes(dir)) {
      return exit - entry;
    } else {
      return entry - exit;
    }
  };

  const points = calculatePoints();
  const isPositive = points >= 0;
  const isNetPositive = (trade.netPnL || 0) >= 0;

  const getResultColor = (result) => {
    if (result?.includes("TARGET") || result === "Win")
      return "bg-green-100 text-green-700 border-green-200";
    if (result?.includes("STOPLOSS") || result === "Loss")
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const displayDate = trade.date
    ? new Date(trade.date).toDateString()
    : "No Date";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition overflow-hidden group flex flex-col relative">
        {/* HEADER */}
        <div className="p-4 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {trade.pair || "Unknown Pair"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
              <Calendar size={12} /> {displayDate}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Result Badge */}
            <span
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase border tracking-wider ${getResultColor(trade.result)}`}
            >
              {trade.result || "Pending"}
            </span>

            {/* --- 🔥 3-DOT MENU (CLONE OPTION) --- */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-slate-200 rounded-full transition text-slate-400 hover:text-slate-600"
              >
                <MoreVertical size={18} />
              </button>

              {/* DROPDOWN MENU */}
              {showMenu && (
                <div className="absolute right-0 top-8 w-40 bg-white shadow-xl border border-slate-100 rounded-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={handleCloneTrade}
                    disabled={isCloning}
                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition font-medium"
                  >
                    {isCloning ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Copy size={16} />
                    )}
                    Clone Trade
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- IMAGE SECTION --- */}
        <div className="h-40 w-full object-cover bg-slate-100 border-b border-slate-50 relative z-0">
          <ImageHoverCarousel
            images={images}
            altText={trade.pair}
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* STATS GRID */}
        <div className="p-4 grid grid-cols-3 gap-y-4 gap-x-2 text-sm flex-1">
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
              Type
            </p>
            <p className="font-medium text-slate-600 leading-tight">
              {trade.tradeType || "-"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
              Setup
            </p>
            <p className="font-medium text-slate-600 leading-tight">
              {trade.setup || "-"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
              Entry
            </p>
            <p className="font-medium text-slate-600 leading-tight">
              {trade.entryType || "-"}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
              Entry / Exit
            </p>
            <p className="font-medium text-slate-600 text-xs">
              {trade.entryPrice} <span className="text-slate-500">➝</span>{" "}
              {trade.exitPrice}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
              P&L Points
            </p>
            <p
              className={`font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}
            >
              {points.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
              Net PnL
            </p>
            <p
              className={`font-extrabold ${isNetPositive ? "text-green-600" : "text-red-600"}`}
            >
              {trade.netPnL ? trade.netPnL.toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex gap-3 text-slate-400">
            <div
              className="flex items-center gap-1 text-xs font-bold"
              title="Timeframe"
            >
              <Clock size={12} /> {trade.timeframe || "15m"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${trade.mode === "LIVE" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
            >
              {trade.mode || "PAPER"}
            </span>
            <button
              onClick={() => onEdit(trade)}
              className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-blue-500 transition border border-transparent hover:border-slate-200"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(trade._id)}
              className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-red-500 transition border border-transparent hover:border-slate-200"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Image Modal --- */}
      {isModalOpen && (
        <ImageModal
          images={images}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default TradeCard;
