
import React, { useState } from "react";
import { Menu, X, Bell, ShieldAlert } from "lucide-react";
import Sidebar from "./Sidebar"; // ✅ Import Sidebar Component

const Layout = ({ children }) => {
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Algo Mode State (Lifted up so both Sidebar and Layout know about it)
  const [isAlgoMode, setIsAlgoMode] = useState(false);

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-300 ${isAlgoMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      
      {/* ================================================= */}
      {/* 1. MOBILE OVERLAY (Backdrop)                      */}
      {/* ================================================= */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ================================================= */}
      {/* 2. SIDEBAR CONTAINER                              */}
      {/* ================================================= */}
      <div className={`
          fixed inset-y-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0
      `}>
          {/* Mobile Close Button */}
          <div className="absolute top-2 right-[-40px] md:hidden">
            {isMobileSidebarOpen && (
               <button onClick={() => setIsMobileSidebarOpen(false)} className="bg-slate-800 text-white p-2 rounded-r-md">
                 <X size={20}/>
               </button>
            )}
          </div>

          <Sidebar 
             isAlgoMode={isAlgoMode} 
             setIsAlgoMode={setIsAlgoMode}
             isMobileOpen={isMobileSidebarOpen}
             setIsMobileOpen={setIsMobileSidebarOpen}
             onLinkClick={() => setIsMobileSidebarOpen(false)} // Close on mobile navigation
          />
      </div>

      {/* ================================================= */}
      {/* 3. MAIN CONTENT AREA                              */}
      {/* ================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* A. MOBILE HEADER (Hamburger) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 text-gray-300 hover:text-white bg-slate-800 rounded-lg">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg">TradeMaster</span>
            </div>
            <button className="p-2 text-gray-400"><Bell size={20} /></button>
        </header>

        {/* B. ALGO WARNING BAR */}
        {isAlgoMode && (
          <div className="bg-red-500 text-white px-4 py-1.5 text-xs font-bold tracking-wider flex justify-center items-center gap-2 animate-pulse shrink-0">
            <ShieldAlert size={14} /> LIVE TRADING MODE ACTIVE
          </div>
        )}

        {/* C. PAGE CONTENT "flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative" */}   
        <main className="flex-1 overflow-y-auto custom-scrollbar">   
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;