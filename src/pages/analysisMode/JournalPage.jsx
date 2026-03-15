import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import axios from "axios";
import TradeForm from "../../components/forms/TradeForm";
import { Filter, Search, X } from "lucide-react";
import TradeCard from "../../components/TradeCard";
import { useTradeContext } from "../../context/TradeContext";

// ✅ CUSTOM HOOK: To Persist Object State in LocalStorage
const usePersistState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”:", error);
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const JournalPage = () => {
  // --- CONTEXT DATA (Global Store) ---
  const {
    allTrades,
    loading: contextLoading,
    refreshTrades,
  } = useTradeContext();

  // --- UI STATES ---
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // --- 🔥 FILTER STATES (Persisted) ---
  // ✅ Added "timeframe: 'All'" to default state
  const [filters, setFilters] = usePersistState("journal_filters_v2", {
    startDate: "",
    endDate: "",
    pair: "All",
    timeframe: "All", // 🔥 New Filter Key
    setup: "All",
    result: "All",
    mode: "All",
  });

  // --- 🔥 1. FILTERING LOGIC ---
  const filteredTrades = useMemo(() => {
    if (!allTrades) return [];

    let data = [...allTrades];

    // 1. Date Filter
    if (filters.startDate)
      data = data.filter(
        (t) => new Date(t.date) >= new Date(filters.startDate),
      );
    if (filters.endDate)
      data = data.filter((t) => new Date(t.date) <= new Date(filters.endDate));

    // 2. Dropdown Filters
    if (filters.pair !== "All")
      data = data.filter((t) => t.pair === filters.pair);

    // ✅ 2.1 Timeframe Filter Logic
    if (filters.timeframe !== "All")
      data = data.filter((t) => t.timeframe === filters.timeframe);

    if (filters.setup !== "All")
      data = data.filter((t) => t.setup === filters.setup);
    if (filters.mode !== "All")
      data = data.filter((t) => t.mode === filters.mode);

    // 3. Result Filter
    if (filters.result !== "All") {
      if (filters.result === "Win")
        data = data.filter(
          (t) => t.result.includes("TARGET") || t.result === "Win",
        );
      else if (filters.result === "Loss")
        data = data.filter(
          (t) => t.result.includes("STOPLOSS") || t.result === "Loss",
        );
    }

    // 4. Sort (Newest First)
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allTrades, filters]);

  // --- 🔥 2. VIRTUAL PAGINATION ---
  const visibleTrades = filteredTrades.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = visibleTrades.length < filteredTrades.length;

  // --- OBSERVER LOGIC ---
  const observer = useRef();
  const lastTradeElementRef = useCallback(
    (node) => {
      if (contextLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [contextLoading, hasMore],
  );

  // --- ACTIONS ---

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const resetFilters = () => {
    // ✅ Reset me timeframe bhi All kar diya
    setFilters({
      startDate: "",
      endDate: "",
      pair: "All",
      timeframe: "All",
      setup: "All",
      result: "All",
      mode: "All",
    });
    setPage(1);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      // await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/trades/${id}`);
      await axios.delete(
        `${import.meta.env.VITE_ANALYSIS_API}/api/trades/${id}`,
      );
      refreshTrades();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ CREATE/EDIT Success
  const handleSuccess = () => {
    setShowForm(false);
    setEditingTrade(null);
    setPage(1);
    refreshTrades();
  };

  const handleEdit = (trade) => {
    setEditingTrade(trade);
    setShowForm(true);
  };

  // --- LOADING STATE ---
  if (contextLoading && (!allTrades || allTrades.length === 0)) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-2 text-sm animate-pulse">
          Syncing Journal...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            📒 Trade Journal
          </h1>
          <p className="text-slate-500">
            Showing {visibleTrades.length} of {filteredTrades.length} trades
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTrade(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          + Add New Trade
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTrade(null);
              }}
              className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <div className="p-1">
              <TradeForm
                mode="LIVE"
                initialData={editingTrade}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Date Inputs */}
          <div className="flex gap-2">
            <div>
              <label className="text-xs pr-3 text-gray-500 font-bold ml-1">
                From
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="border p-2 rounded-lg text-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs pr-3 text-gray-500 font-bold ml-1">
                To
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="border p-2 rounded-lg text-sm bg-gray-50"
              />
            </div>
          </div>

          {/* Pair Filter */}
          <select
            name="pair"
            value={filters.pair}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg text-sm bg-gray-50 min-w-[100px]"
          >
            <option value="All">All Pairs</option>
            <option>NIFTY</option>
            <option>BANKNIFTY</option>
            <option>FINNIFTY</option>
            <option>MIDCPNIFTY</option>
            <option>EURUSD</option>
            <option>XAUUSD</option>
          </select>

          {/* 🔥 New Timeframe Filter (Next to Pair) */}
          <select
            name="timeframe"
            value={filters.timeframe}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg text-sm bg-gray-50 min-w-[80px]"
          >
            <option value="All">All TF</option>
            <option>5M</option>
            <option>15M</option>
            <option>1H</option>
            <option>4H</option>
            <option>Daily</option>
          </select>

          {/* Setup Filter */}
          <select
            name="setup"
            value={filters.setup}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg text-sm bg-gray-50 min-w-[100px]"
          >
            <option value="All">All Setups</option>
            <option>IDM-SWEEP</option>
            <option>D-OB</option>
            <option>D-OF</option>
            <option>ENG-LQD SWEEP</option>
          </select>

          {/* Result Filter */}
          <select
            name="result"
            value={filters.result}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg text-sm bg-gray-50 min-w-[100px]"
          >
            <option value="All">All Results</option>
            <option value="Win">Wins Only 🟢</option>
            <option value="Loss">Losses Only 🔴</option>
          </select>

          {/* Mode Filter */}
          <select
            name="mode"
            value={filters.mode}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg text-sm bg-gray-50 min-w-[100px]"
          >
            <option value="All">All Modes</option>
            <option value="LIVE">Live</option>
            <option value="BACKTEST">Backtest</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="bg-gray-100 p-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-red-500 transition"
            title="Reset Filters"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* TRADES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {visibleTrades.map((trade, index) => {
          if (visibleTrades.length === index + 1) {
            return (
              <div ref={lastTradeElementRef} key={trade._id}>
                <TradeCard
                  trade={trade}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onClone={handleSuccess}
                />
              </div>
            );
          } else {
            return (
              <div key={trade._id}>
                <TradeCard
                  trade={trade}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onClone={handleSuccess}
                />
              </div>
            );
          }
        })}
      </div>

      {!contextLoading && visibleTrades.length === 0 && (
        <div className="text-center p-10 bg-white rounded-lg shadow border border-dashed border-gray-300">
          <Search size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">No trades match your filters.</p>
        </div>
      )}

      {!hasMore && visibleTrades.length > 0 && (
        <p className="text-center text-gray-400 text-sm mb-10">
          🎉 End of list
        </p>
      )}
    </div>
  );
};

export default JournalPage;
