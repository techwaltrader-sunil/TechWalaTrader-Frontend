import React from "react";
import { TRADE_DATA } from "../../../data/tradeLogic"; // ✅ Make sure path is correct

const FilterPanel = ({
  currentFilter,
  setFilter,
  selectedYear,
  setYear,
  viewMode,
  setViewMode,
  axisView,
  setAxisView,
  selectedPair,
  setPair,
  selectedTimeframe,
  setTimeframe,
  // ✅ New Props for Cascading Filters
  tradeType,
  setTradeType,
  setup,
  setSetup,
  entryType,
  setEntryType,
}) => {
  // Hardcoded options for basic filters (You can also move these to a config file)
  const timeframes = ["ALL", "5M", "15M", "1H", "4H", "Daily"];
  const pairs = ["ALL", "NIFTY", "BANKNIFTY", "MIDCPNIFTY"]; // Example pairs

  return (
    <div className="bg-[#111827] text-white p-4 rounded-2xl shadow-lg h-full flex flex-col justify-between">
      {/* --- TOP SECTION: General Filters --- */}
      <div>
          <h2 className="text-lg font-bold text-gray-200">Filters</h2>
        <div className="flex justify-between items-center mb-4">

          {/* Axis Selector */}
          <div className="flex items-center p-2 gap-2 mt-2 text-xs text-gray-400">
            <span className="font-bold text-gray-500 uppercase text-[10px]">
              Axis View:
            </span>
            {["month", "quarter", "day"].map((axis) => (
              <label
                key={axis}
                className="flex items-center gap-1 cursor-pointer hover:text-white"
              >
                <input
                  type="radio"
                  name="axis"
                  checked={axisView === axis}
                  onChange={() => setAxisView(axis)}
                  className="accent-yellow-500"
                />
                <span className="capitalize">{axis}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("value")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === "value" ? "bg-yellow-500 text-black shadow" : "text-gray-400 hover:text-white"}`}
            >
              Value
            </button>
            <button
              onClick={() => setViewMode("count")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === "count" ? "bg-yellow-500 text-black shadow" : "text-gray-400 hover:text-white"}`}
            >
              Count
            </button>
          </div>
        </div>

        {/* Date Presets */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[
            "this_month",
            "last_month",
            "this_quarter",
            "last_quarter",
            "ytd",
            "all_time",
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                currentFilter === f
                  ? "bg-yellow-500 text-black border-yellow-500 shadow-md"
                  : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
              }`}
            >
              {f.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Pair & Year & Timeframe Row */}
        <div className="grid grid-cols-3 gap-3 mb-1">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Pair
            </label>
            <select
              value={selectedPair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-yellow-500"
            >
              {pairs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-yellow-500"
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">
              Timeframe
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-yellow-500"
            >
              {timeframes.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- 🔥 NEW BOTTOM SECTION: Trade Logic Filters --- */}
      {/* Border Top added to separate sections */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex flex-wrap justify-end gap-3">
          {/* 1. Trade Type */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 ml-1">
              Trade Type
            </label>
            <select
              value={tradeType}
              onChange={(e) => setTradeType(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-yellow-500 min-w-[120px]"
            >
              <option value="">All Types</option>
              {TRADE_DATA.tradeTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Setup (Dependent) */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 ml-1">
              Trade Setup
            </label>
            <select
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              disabled={!tradeType}
              className={`bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-yellow-500 min-w-[120px] 
                        ${!tradeType ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <option value="">All Setups</option>
              {tradeType &&
                TRADE_DATA.setups[tradeType]?.map((s, index) => (
                  <option key={index} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>

          {/* 3. Entry Type (Dependent) */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-[9px] uppercase font-bold text-gray-500 mb-1 ml-1">
              Entry Type
            </label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              disabled={!setup}
              className={`bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-yellow-500 min-w-[120px] 
                        ${!setup ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <option value="">All Entries</option>
              {setup &&
                TRADE_DATA.entryRules[setup]?.map((e, index) => (
                  <option key={index} value={e}>
                    {e}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
