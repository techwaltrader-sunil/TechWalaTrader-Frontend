
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, LogOut, PieChart, Activity, Zap,
  BarChart2, Cpu, Network, History, TrendingUp, Tags,
  ChevronsLeft, ChevronsRight
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const Sidebar = ({ isAlgoMode, setIsAlgoMode, onLinkClick, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  
  // Desktop Hover/Lock States
  const [isLocked, setIsLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Logic: Mobile me 'isMobileOpen' decide karega, Desktop me 'Lock/Hover'
  const isSidebarExpanded = isMobileOpen || isLocked || isHovered;

  // --- MENU ITEMS ---
  const analysisMenuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Trade Journal", path: "/journal", icon: <BookOpen size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <PieChart size={20} /> },
    { name: "Overview", path: "/overview", icon: <Activity size={20} /> },
    { name: "ImportNotion", path: "/tradeForm", icon: <Activity size={20} /> },
  ];

  const algoMenuItems = [
    { name: "Algo Dashboard", path: "/algo-dashboard", icon: <Zap size={20} /> },
    { name: "Brokers", path: "/brokers", icon: <Network size={20} /> },
    { name: "Strategy Builder", path: "/strategy-builder", icon: <Cpu size={20} /> },
    { name: "Strategies", path: "/strategies", icon: <Cpu size={20} /> },
    { name: "Backtesting", path: "/backtest", icon: <TrendingUp size={20} /> },
    // { name: "Trade Logs", path: "/algo-logs", icon: <History size={20} /> },
    { name: "Reports", path: "/reports", icon: <History size={20} /> },
    { name: "Subscriptions", path: "/subscriptions", icon: <Tags size={20}/> },
  ];

  const currentMenuItems = isAlgoMode ? algoMenuItems : analysisMenuItems;

  return (
    <aside
      onMouseEnter={() => !isMobileOpen && setIsHovered(true)}
      onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
      className={`
        h-full flex flex-col shadow-xl z-50
        transition-all duration-300 ease-in-out
        ${isSidebarExpanded ? "w-64" : "w-20"} 
        /* ✅ Theme Classes */
        bg-white dark:bg-slate-900 
        text-gray-800 dark:text-white
        border-r border-gray-200 dark:border-slate-800
      `}
    >
      {/* --- LOGO AREA --- */}
      <div className={`flex flex-col border-b border-gray-200 dark:border-slate-800 transition-all duration-300 ${isSidebarExpanded ? "p-4" : "p-4 items-center"}`}>
        <div className="flex items-center justify-center mb-4 mt-2">
          {isSidebarExpanded ? (
            <div className="text-center w-full">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">TradeMaster</h1>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Smart Trading Suite</p>
            </div>
          ) : (
            <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">TM</div>
          )}
        </div>

        {/* --- ALGO/ANALYSIS TOGGLE --- */}
        {isSidebarExpanded ? (
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-full shadow-inner w-full">
            <button
              onClick={() => { setIsAlgoMode(false); navigate('/'); }}
              className={`flex-1 py-1.5 px-2 rounded-full font-medium transition-all duration-300 flex justify-center items-center gap-1.5 text-xs 
              ${!isAlgoMode 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <BarChart2 size={14} /> Analysis
            </button>
            <button
              onClick={() => { setIsAlgoMode(true); navigate('/algo-dashboard'); }}
              className={`flex-1 py-1.5 px-2 rounded-full font-medium transition-all duration-300 flex justify-center items-center gap-1.5 text-xs 
              ${isAlgoMode 
                ? 'bg-red-500 text-white shadow-md' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Zap size={14} /> Algo
            </button>
          </div>
        ) : (
          <button 
            onClick={() => {
                const newMode = !isAlgoMode;
                setIsAlgoMode(newMode);
                navigate(newMode ? '/algo-dashboard' : '/');
            }}
            className={`p-2 rounded-full transition-all duration-300 
            ${isAlgoMode 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'}`}
          >
            {isAlgoMode ? <Zap size={18} /> : <BarChart2 size={18} />}
          </button>
        )}
      </div>

      {/* --- MENU LINKS --- */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        {currentMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onLinkClick} 
            className={({ isActive }) => `
              flex items-center rounded-lg transition-all duration-200 group
              ${isSidebarExpanded ? "px-4 py-3 gap-3" : "px-0 py-3 justify-center"}
              ${isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white"}
            `}
          >
            <div className="shrink-0">{item.icon}</div>
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* --- FOOTER --- */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 relative bg-gray-50 dark:bg-slate-900">
        <div className={`flex items-center w-full ${isSidebarExpanded ? "justify-between p-4" : "justify-center flex-col gap-4"}`}>
            {/* Theme Toggle (Visible in both states, adjusts position) */}
            <ThemeToggle />

            {/* Logout (Text hidden when collapsed) */}
            <button className={`flex items-center text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition gap-2 ${!isSidebarExpanded && "mt-2"}`}>
                <LogOut size={20} />
                {isSidebarExpanded && <span className="font-medium">Logout</span>}
            </button>
        </div>
        

        {/* Lock Button: Desktop Only */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full border-4 items-center justify-center shadow-md cursor-pointer transition-all duration-300 hover:scale-110 z-30 
          ${isLocked 
            ? "bg-blue-600 text-white border-white dark:border-slate-900" 
            : "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-gray-100 dark:border-slate-700"}`}
        >
          {isLocked ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;