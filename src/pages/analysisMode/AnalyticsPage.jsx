
import React, { useState, useMemo, useEffect } from "react";
import {
  Filter,
  DollarSign,
  Hash,
  BrainCircuit,
  Activity,
  X,
} from "lucide-react";
import TradeForm from "../../components/forms/TradeForm";
import { useTradeContext } from "../../context/TradeContext";
import { TRADE_DATA } from "../../data/tradeLogic";

// ✅ IMPORT NEW COMPONENTS
import TradeLogPanel from "../../components/analyticsComponents//AnalyticsPage/TradeLogPanel";
import SetupChart from "../../components/analyticsComponents/AnalyticsPage/SetupChart";
import EntryChart from "../../components/analyticsComponents/AnalyticsPage/EntryChart";
import TradeMixChart from "../../components/analyticsComponents/AnalyticsPage/TradeMixChart";

// CUSTOM HOOK
const usePersistState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved : defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);
  return [state, setState];
};

const AnalyticsPage = () => {
  const { allTrades: trades, loading, refreshTrades } = useTradeContext();

  // --- STATES ---
  const [viewMode, setViewMode] = usePersistState("an_viewMode", "LIVE");
  const [metricMode, setMetricMode] = usePersistState("an_metricMode", "VALUE");
  const [selectedTrade, setSelectedTrade] = useState(null);

  // --- FILTERS ---
  const [selectedYear, setSelectedYear] = usePersistState(
    "an_selectedYear",
    new Date().getFullYear().toString(),
  );
  const [selectedRange, setSelectedRange] = usePersistState(
    "an_selectedRange",
    "All",
  );
  const [selectedPair, setSelectedPair] = usePersistState(
    "an_selectedPair",
    "All",
  );
  const [selectedTimeframe, setSelectedTimeframe] = usePersistState(
    "an_selectedTimeframe",
    "All",
  );
  const [resultFilter, setResultFilter] = usePersistState(
    "an_resultFilter",
    "All",
  );
  const [tradeType, setTradeType] = usePersistState("an_tradeType", "All");
  const [setup, setSetup] = usePersistState("an_setup", "All");
  const [entryType, setEntryType] = usePersistState("an_entryType", "All");

  const handleTradeTypeChange = (val) => {
    setTradeType(val);
    setSetup("All");
    setEntryType("All");
  };
  const handleSetupChange = (val) => {
    setSetup(val);
    setEntryType("All");
  };

  // --- FILTER DATA ENGINE ---
  const filteredData = useMemo(() => {
    if (!trades) return [];
    let data = [...trades];
    const now = new Date();

    data = data.filter((t) => t.mode === viewMode);

    if (selectedYear !== "All")
      data = data.filter(
        (t) => new Date(t.date).getFullYear() === parseInt(selectedYear),
      );
    if (selectedPair !== "All")
      data = data.filter((t) => t.pair === selectedPair);
    if (selectedTimeframe !== "All")
      data = data.filter((t) => t.timeframe === selectedTimeframe);

    if (selectedRange === "This Month") {
      data = data.filter(
        (t) =>
          new Date(t.date).getMonth() === now.getMonth() &&
          new Date(t.date).getFullYear() === now.getFullYear(),
      );
    } else if (selectedRange === "Last Month") {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      data = data.filter(
        (t) =>
          new Date(t.date).getMonth() === lastMonth.getMonth() &&
          new Date(t.date).getFullYear() === lastMonth.getFullYear(),
      );
    } else if (
      ["Last 3 Months", "Last 6 Months", "Last 9 Months"].includes(
        selectedRange,
      )
    ) {
      const monthsToSubtract = parseInt(selectedRange.split(" ")[1]);
      const cutoffDate = new Date();
      cutoffDate.setMonth(now.getMonth() - monthsToSubtract);
      data = data.filter((t) => new Date(t.date) >= cutoffDate);
    }

    if (resultFilter === "Profit")
      data = data.filter(
        (t) => t.result.includes("TARGET") || t.result === "Win",
      );
    else if (resultFilter === "Loss")
      data = data.filter(
        (t) => t.result.includes("STOPLOSS") || t.result === "Loss",
      );

    if (tradeType !== "All")
      data = data.filter((t) => t.tradeType === tradeType);
    if (setup !== "All") data = data.filter((t) => t.setup === setup);
    if (entryType !== "All")
      data = data.filter((t) => t.entryType === entryType);

    return data;
  }, [
    trades,
    viewMode,
    selectedYear,
    selectedRange,
    selectedPair,
    selectedTimeframe,
    resultFilter,
    tradeType,
    setup,
    entryType,
  ]);

  const calculateValue = (trade) => {
    if (resultFilter === "Brokerage")
      return trade.brokerage ? parseFloat(trade.brokerage) : 0;
    if (trade.netPnL) return parseFloat(trade.netPnL);
    return trade.direction?.includes("Short") || trade.direction === "Put"
      ? trade.entryPrice - trade.exitPrice
      : trade.exitPrice - trade.entryPrice;
  };

  const recentTrades = useMemo(() => {
    return [...filteredData].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }, [filteredData]);

  // --- CHART DATA PREPARATION ---
  const setupData = useMemo(() => {
    const map = {};
    filteredData.forEach((t) => {
      const setupName = t.setup || "Unknown";
      if (!map[setupName]) map[setupName] = 0;
      map[setupName] += metricMode === "COUNT" ? 1 : calculateValue(t);
    });
    return Object.keys(map)
      .map((k) => ({ name: k, realValue: map[k], plotValue: Math.abs(map[k]) }))
      .sort((a, b) => b.plotValue - a.plotValue)
      .slice(0, 5);
  }, [filteredData, resultFilter, metricMode]);

  const entryData = useMemo(() => {
    const map = {};
    filteredData.forEach((t) => {
      const setup = t.setup || "Misc";
      const entry = t.entryType || "Unknown";
      const uniqueKey = `${setup} ➤ ${entry}`;
      if (!map[uniqueKey]) map[uniqueKey] = 0;
      map[uniqueKey] += metricMode === "COUNT" ? 1 : calculateValue(t);
    });
    return Object.keys(map)
      .map((k) => ({ name: k, realValue: map[k], plotValue: Math.abs(map[k]) }))
      .sort((a, b) => b.plotValue - a.plotValue)
      .slice(0, 8);
  }, [filteredData, resultFilter, metricMode]);

  const typeData = useMemo(() => {
    const map = {};
    filteredData.forEach((t) => {
      const type = t.tradeType || "Exact Trade";
      if (!map[type]) map[type] = 0;
      map[type] += 1;
    });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] }));
  }, [filteredData]);

  const totalValue = filteredData.reduce(
    (acc, t) => acc + calculateValue(t),
    0,
  );

  // Constants for Filters
  const DATE_RANGES = [
    "All",
    "This Month",
    "Last Month",
    "Last 3 Months",
    "Last 6 Months",
    "Last 9 Months",
  ];
  const PAIRS_LIST = [
    "All",
    "NIFTY",
    "BANKNIFTY",
    "FINNIFTY",
    "MIDCPNIFTY",
    "XAUUSD",
    "EURUSD",
  ];
  const TIMEFRAMES = ["All", "5M", "15M", "1H", "4H", "Daily"];
  const RESULTS_LIST = ["All", "Profit", "Loss", "Brokerage"];

  if (loading && trades.length === 0)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Deep Analytics
          </h1>
          <p className="text-slate-500 text-sm">
            Analyze your edge with precision.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:items-center gap-3 w-full md:w-auto">
          <div className="bg-white border border-slate-300 p-1 rounded-lg inline-flex shadow-sm self-start">
            <button
              onClick={() => setViewMode("LIVE")}
              className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === "LIVE" ? "bg-purple-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Activity size={16} /> Live
            </button>
            <button
              onClick={() => setViewMode("BACKTEST")}
              className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${viewMode === "BACKTEST" ? "bg-purple-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <BrainCircuit size={16} /> Backtest
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg self-start">
            <button
              onClick={() => setMetricMode("VALUE")}
              className={`p-1.5 rounded-md transition ${metricMode === "VALUE" ? "bg-white text-green-600 shadow-sm" : "text-slate-400"}`}
              title="Sort by P&L Value"
            >
              <DollarSign size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setMetricMode("COUNT")}
              className={`p-1.5 rounded-md transition ${metricMode === "COUNT" ? "bg-white text-purple-600 shadow-sm" : "text-slate-400"}`}
              title="Sort by Trade Count"
            >
              <Hash size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-8 overflow-x-auto">
        <div className="flex flex-wrap items-center gap-3 min-w-max">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mr-2">
            <Filter size={14} /> Filters
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              YEAR
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[80px]"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="All">All</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              PERIOD
            </label>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[110px]"
            >
              {DATE_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              PAIR
            </label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[100px]"
            >
              {PAIRS_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              TIMEFRAME
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[80px]"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[1px] h-8 bg-slate-200 mx-1 hidden md:block"></div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              TRADE TYPE
            </label>
            <select
              value={tradeType}
              onChange={(e) => handleTradeTypeChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[120px]"
            >
              <option value="All">All Types</option>
              {TRADE_DATA.tradeTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              SETUP
            </label>
            <select
              value={setup}
              onChange={(e) => handleSetupChange(e.target.value)}
              disabled={tradeType === "All"}
              className={`bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[120px] ${tradeType === "All" ? "opacity-50" : ""}`}
            >
              <option value="All">All Setups</option>
              {tradeType !== "All" &&
                TRADE_DATA.setups[tradeType]?.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              ENTRY TYPE
            </label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              disabled={setup === "All"}
              className={`bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[120px] ${setup === "All" ? "opacity-50" : ""}`}
            >
              <option value="All">All Entries</option>
              {setup !== "All" &&
                TRADE_DATA.entryRules[setup]?.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[1px] h-8 bg-slate-200 mx-1 hidden md:block"></div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">
              RESULT
            </label>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 font-semibold focus:outline-none min-w-[100px]"
            >
              {RESULTS_LIST.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT: TRADE LOG */}
        <TradeLogPanel
          viewMode={viewMode}
          resultFilter={resultFilter}
          totalValue={totalValue}
          recentTrades={recentTrades}
          calculateValue={calculateValue}
          onTradeSelect={setSelectedTrade}
        />

        {/* RIGHT: CHARTS */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SetupChart
            data={setupData}
            metricMode={metricMode}
            resultFilter={resultFilter}
          />
          <EntryChart
            data={entryData}
            metricMode={metricMode}
            resultFilter={resultFilter}
          />
          <TradeMixChart data={typeData} />
        </div>
      </div>

      {/* MODAL */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTrade(null)}
              className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <div className="p-1">
              <TradeForm
                mode={viewMode}
                initialData={selectedTrade}
                isReadOnly={true}
                onSuccess={() => {
                  setSelectedTrade(null);
                  refreshTrades();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
