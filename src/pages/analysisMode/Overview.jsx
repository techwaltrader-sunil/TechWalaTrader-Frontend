import React, { useState, useMemo, useEffect } from "react";
import StatCard from "../../components/analyticsComponents/OverviewPage/StatCard";
import FilterPanel from "../../components/analyticsComponents/OverviewPage/FilterPanel";
import TradeChart from "../../components/analyticsComponents/OverviewPage/TradeChart";
import { Laptop, History, Activity } from "lucide-react";
import { useTradeContext } from "../../context/TradeContext";

// ✅ CUSTOM HOOK: To Persist State in LocalStorage
// यह हुक चेक करता है कि क्या पहले से कोई वैल्यू सेव है? अगर है तो वो यूज़ करो, नहीं तो Default.
const usePersistState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      // अगर Default Value नंबर है (जैसे Year 2025), तो सेव्ड स्ट्रिंग को नंबर में बदलो
      return typeof defaultValue === "number" ? Number(saved) : saved;
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
};

const Overview = () => {
  const { allTrades: trades, loading } = useTradeContext();

  // --- STATES (Now with Persistence) ---
  // ✅ useState की जगह अब usePersistState यूज़ कर रहे हैं ताकि रिफ्रेश पर डेटा न उड़े
  const [dateFilter, setDateFilter] = usePersistState(
    "ov_dateFilter",
    "this_month",
  );
  const [selectedYear, setSelectedYear] = usePersistState(
    "ov_selectedYear",
    2025,
  );
  const [viewMode, setViewMode] = usePersistState("ov_viewMode", "value");
  const [axisView, setAxisView] = usePersistState("ov_axisView", "month");
  const [tradingMode, setTradingMode] = usePersistState(
    "ov_tradingMode",
    "live",
  );

  // Existing Filters (Persisted)
  const [selectedPair, setSelectedPair] = usePersistState(
    "ov_selectedPair",
    "ALL",
  );
  const [selectedTimeframe, setSelectedTimeframe] = usePersistState(
    "ov_selectedTimeframe",
    "ALL",
  );

  // ✅ Advanced Filters (Persisted)
  const [tradeType, setTradeType] = usePersistState("ov_tradeType", "");
  const [setup, setSetup] = usePersistState("ov_setup", "");
  const [entryType, setEntryType] = usePersistState("ov_entryType", "");

  // ✅ Handlers for Cascading Logic
  const handleTradeTypeChange = (val) => {
    setTradeType(val);
    setSetup(""); // Trade Type change hone par Setup reset
    setEntryType(""); // Entry Type bhi reset
  };

  const handleSetupChange = (val) => {
    setSetup(val);
    setEntryType(""); // Setup change hone par Entry reset
  };

  // --- 🔥 MAIN CALCULATION ENGINE ---
  const dashboardData = useMemo(() => {
    if (!trades || trades.length === 0) return null;

    // 1. Base Filter (Mode)
    let filtered = trades.filter((t) => t.mode === tradingMode.toUpperCase());

    // ✅ Pair Filter
    if (selectedPair !== "ALL")
      filtered = filtered.filter((t) => t.pair === selectedPair);

    // ✅ Timeframe Filter
    if (selectedTimeframe !== "ALL")
      filtered = filtered.filter((t) => t.timeframe === selectedTimeframe);

    // ✅ NEW: Trade Type Filter
    if (tradeType) filtered = filtered.filter((t) => t.tradeType === tradeType);

    // ✅ NEW: Setup Filter
    if (setup) filtered = filtered.filter((t) => t.setup === setup);

    // ✅ NEW: Entry Type Filter
    if (entryType) filtered = filtered.filter((t) => t.entryType === entryType);

    // 2. Initialize Containers
    const currentStats = {
      pnl: 0,
      winCount: 0,
      totalTrades: 0,
      rrSum: 0,
      runningPnL: 0,
      maxPeak: -Infinity,
      maxDD: 0,
    };
    const prevStats = {
      pnl: 0,
      winCount: 0,
      totalTrades: 0,
      rrSum: 0,
      runningPnL: 0,
      maxPeak: -Infinity,
      maxDD: 0,
    };

    // Charts Arrays
    const monthlyData = Array(12)
      .fill(0)
      .map((_, i) => ({
        name: new Date(0, i).toLocaleString("default", { month: "short" }),
        current: 0,
        previous: 0,
        growth: 0,
      }));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayData = days.map((day) => ({
      name: day,
      current: 0,
      previous: 0,
      growth: 0,
    }));

    // 3. Helper to Check Filter Period
    const today = new Date();
    const currentMonthIdx = today.getMonth();
    const currentQuarter = Math.floor(currentMonthIdx / 3);

    const isMonthInFilter = (monthIndex) => {
      switch (dateFilter) {
        case "this_month":
          return monthIndex === currentMonthIdx;
        case "last_month":
          return monthIndex === currentMonthIdx - 1;
        case "this_quarter":
          return Math.floor(monthIndex / 3) === currentQuarter;
        case "last_quarter":
          return Math.floor(monthIndex / 3) === currentQuarter - 1;
        case "ytd":
          return monthIndex <= currentMonthIdx;
        default:
          return true; // all_time
      }
    };

    // 4. Sort Trades
    const sortedTrades = [...filtered].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // 5. PROCESS LOOP
    sortedTrades.forEach((trade) => {
      const tDate = new Date(trade.date);
      const tYear = tDate.getFullYear();
      const tMonth = tDate.getMonth();
      const tDay = tDate.getDay();

      let pnl = trade.netPnL || 0;
      if (!pnl) {
        pnl =
          trade.direction?.includes("Short") || trade.direction === "Put"
            ? trade.entryPrice - trade.exitPrice
            : trade.exitPrice - trade.entryPrice;
      }

      const isWin =
        trade.result === "TARGET HIT" || trade.result === "Win" || pnl > 0;
      const rr = trade.rr || 0;

      // Populate Charts
      if (tYear === selectedYear) {
        monthlyData[tMonth].current += pnl;
        dayData[tDay].current += pnl;
      } else if (tYear === selectedYear - 1) {
        monthlyData[tMonth].previous += pnl;
        dayData[tDay].previous += pnl;
      }

      // Populate KPIs
      if (isMonthInFilter(tMonth)) {
        const updateStats = (statsObj) => {
          statsObj.pnl += pnl;
          statsObj.totalTrades += 1;
          if (isWin) statsObj.winCount += 1;
          statsObj.rrSum += rr;

          // DD Logic
          statsObj.runningPnL += pnl;
          if (statsObj.runningPnL > statsObj.maxPeak)
            statsObj.maxPeak = statsObj.runningPnL;
          const dd = statsObj.maxPeak - statsObj.runningPnL;
          if (dd > statsObj.maxDD) statsObj.maxDD = dd;
        };

        if (tYear === selectedYear) updateStats(currentStats);
        else if (tYear === selectedYear - 1) updateStats(prevStats);
      }
    });

    // 6. Final Calc (Fixed Floating Point Issue)
    const calcFinal = (s) => ({
      pnl: parseFloat(s.pnl.toFixed(2)),
      trades: s.totalTrades,
      winRate:
        s.totalTrades > 0 ? ((s.winCount / s.totalTrades) * 100).toFixed(2) : 0,
      rr: s.totalTrades > 0 ? (s.rrSum / s.totalTrades).toFixed(2) : 0,
      drawdown: parseFloat(s.maxDD.toFixed(2)),
    });

    const calculateGrowth = (arr) =>
      arr.map((item) => {
        let growth = 0;
        if (item.previous !== 0) {
          growth =
            ((item.current - item.previous) / Math.abs(item.previous)) * 100;
        } else if (item.current !== 0) {
          growth = 100;
        }
        return { ...item, growth: parseFloat(growth.toFixed(2)) };
      });

    return {
      kpi: {
        pnl: { curr: currentStats.pnl, prev: prevStats.pnl },
        trades: { curr: currentStats.totalTrades, prev: prevStats.totalTrades },
        winRate: {
          curr: calcFinal(currentStats).winRate,
          prev: calcFinal(prevStats).winRate,
        },
        rr: { curr: calcFinal(currentStats).rr, prev: calcFinal(prevStats).rr },
        drawdown: {
          curr: calcFinal(currentStats).drawdown,
          prev: calcFinal(prevStats).drawdown,
        },
      },
      chart: calculateGrowth(monthlyData),
      dayChart: calculateGrowth(dayData),
    };
  }, [
    trades,
    selectedYear,
    tradingMode,
    selectedPair,
    selectedTimeframe,
    dateFilter,
    tradeType,
    setup,
    entryType,
  ]);

  // --- CHART AXIS LOGIC ---
  const chartData = useMemo(() => {
    if (!dashboardData) return [];
    const { chart: monthlyRaw, dayChart } = dashboardData;

    if (axisView === "day") {
      if (dayChart && dayChart.length > 0)
        return [...dayChart.slice(1), dayChart[0]];
      return [];
    }
    if (axisView === "quarter") {
      const quarters = [
        { name: "Q1", months: [0, 1, 2] },
        { name: "Q2", months: [3, 4, 5] },
        { name: "Q3", months: [6, 7, 8] },
        { name: "Q4", months: [9, 10, 11] },
      ];
      return quarters.map((q) => {
        const currentSum = q.months.reduce(
          (acc, idx) => acc + (monthlyRaw[idx]?.current || 0),
          0,
        );
        const prevSum = q.months.reduce(
          (acc, idx) => acc + (monthlyRaw[idx]?.previous || 0),
          0,
        );
        let growth = 0;
        if (prevSum !== 0)
          growth = ((currentSum - prevSum) / Math.abs(prevSum)) * 100;
        else if (currentSum !== 0) growth = 100;
        return {
          name: q.name,
          current: currentSum,
          previous: prevSum,
          growth: parseFloat(growth.toFixed(2)),
        };
      });
    }
    return monthlyRaw;
  }, [dashboardData, axisView]);

  // --- LABELS ---
  const getLabel = (filter) => {
    switch (filter) {
      case "this_month":
        return "This Month";
      case "last_month":
        return "Last Month";
      case "this_quarter":
        return "This Quarter";
      case "last_quarter":
        return "Last Quarter";
      case "ytd":
        return "YTD";
      case "all_time":
        return "All Time";
      default:
        return "Selected Period";
    }
  };
  const currentLabel = getLabel(dateFilter);

  // --- LOADING ---
  if (loading && (!trades || trades.length === 0)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-400 animate-pulse flex flex-col items-center gap-2">
          <Activity className="animate-spin text-yellow-500" size={32} />
          Analyzing Data...
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { kpi } = dashboardData;
  const mainCardConfig =
    viewMode === "value"
      ? {
          title: "Net Profit",
          curr: kpi.pnl.curr,
          prev: kpi.pnl.prev,
          isCurrency: true,
          labelType: "Value",
        }
      : {
          title: "Total Trades",
          curr: kpi.trades.curr,
          prev: kpi.trades.prev,
          isCurrency: false,
          labelType: "Count",
        };

  const avgPnlCurr = kpi.trades.curr
    ? (kpi.pnl.curr / kpi.trades.curr).toFixed(0)
    : 0;
  const avgPnlPrev = kpi.trades.prev
    ? (kpi.pnl.prev / kpi.trades.prev).toFixed(0)
    : 0;

  const secondaryCardConfig =
    viewMode === "value"
      ? {
          title: "Total Trades",
          curr: kpi.trades.curr,
          prev: kpi.trades.prev,
          valueLabel: "Count",
          isCurrency: false,
        }
      : {
          title: "Avg P&L",
          curr: Number(avgPnlCurr),
          prev: Number(avgPnlPrev),
          valueLabel: "Avg",
          isCurrency: true,
        };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            Trade Overview
            <span
              className={`text-xs px-2 py-1 rounded-full border ${tradingMode === "live" ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"}`}
            >
              {tradingMode === "live" ? "● LIVE" : "● BACKTEST"}
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Performance of{" "}
            <span className="font-bold text-black">{selectedYear}</span> vs{" "}
            <span className="font-bold text-gray-400">{selectedYear - 1}</span>
          </p>
        </div>

        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <button
            onClick={() => setTradingMode("live")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${tradingMode === "live" ? "bg-green-500 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <Laptop size={16} /> Live
          </button>
          <button
            onClick={() => setTradingMode("backtest")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${tradingMode === "backtest" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <History size={16} /> Backtest
          </button>
        </div>
      </div>

      {/* CARDS & FILTER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
        <div className="lg:col-span-5 flex w-full">
          <div className="w-full h-full">
            <StatCard
              title={mainCardConfig.title}
              currentValue={mainCardConfig.curr}
              previousValue={mainCardConfig.prev}
              selectedYear={selectedYear}
              periodLabel={currentLabel}
              isCurrency={mainCardConfig.isCurrency}
              valueLabel={mainCardConfig.labelType}
            />
          </div>
        </div>
        <div className="lg:col-span-7 flex w-full">
          <div className="w-full h-full">
            <FilterPanel
              currentFilter={dateFilter}
              setFilter={setDateFilter}
              selectedYear={selectedYear}
              setYear={setSelectedYear}
              viewMode={viewMode}
              setViewMode={setViewMode}
              axisView={axisView}
              setAxisView={setAxisView}
              selectedPair={selectedPair}
              setPair={setSelectedPair}
              selectedTimeframe={selectedTimeframe}
              setTimeframe={setSelectedTimeframe}
              tradeType={tradeType}
              setTradeType={handleTradeTypeChange}
              setup={setup}
              setSetup={handleSetupChange}
              entryType={entryType}
              setEntryType={setEntryType}
            />
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="mb-8">
        <TradeChart data={chartData} selectedYear={selectedYear} />
      </div>

      {/* BOTTOM KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Win Rate"
          currentValue={kpi.winRate.curr}
          previousValue={kpi.winRate.prev}
          selectedYear={selectedYear}
          periodLabel={currentLabel}
          valueLabel="Win%"
          isPercent={true}
        />
        <StatCard
          title={secondaryCardConfig.title}
          currentValue={secondaryCardConfig.curr}
          previousValue={secondaryCardConfig.prev}
          selectedYear={selectedYear}
          periodLabel={currentLabel}
          valueLabel={secondaryCardConfig.valueLabel}
          isCurrency={secondaryCardConfig.isCurrency}
        />
        <StatCard
          title="Risk Reward"
          currentValue={kpi.rr.curr}
          previousValue={kpi.rr.prev}
          selectedYear={selectedYear}
          periodLabel={currentLabel}
          valueLabel="R:R"
        />
        <StatCard
          title="Max Drawdown"
          currentValue={kpi.drawdown.curr}
          previousValue={kpi.drawdown.prev}
          selectedYear={selectedYear}
          periodLabel={currentLabel}
          isReverse={true}
          valueLabel="Max DD"
          isCurrency={true}
          isPercent={false}
        />
      </div>
    </div>
  );
};

export default Overview;
