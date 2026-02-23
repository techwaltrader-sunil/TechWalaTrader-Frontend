// src/context/TradeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// 1. Context Create karein
const TradeContext = createContext();

// 2. Provider Component
export const TradeProvider = ({ children }) => {
  const [allTrades, setAllTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MASTER FUNCTION TO FETCH DATA ---
  const refreshTrades = async () => {
    try {
      // Backend se saara data mangwao (Stats ke liye)
      const res = await axios.get("http://localhost:5000/api/trades?limit=10000");
      
      // 1. State Update karo (App me dikhane ke liye)
      setAllTrades(res.data.trades);
      
      // 2. LocalStorage me Save karo (Offline/Refresh ke liye)
      localStorage.setItem("tradeMasterData", JSON.stringify(res.data.trades));
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching global trades:", error);
      setLoading(false);
    }
  };

  // --- INITIAL LOAD LOGIC (The Facebook Magic) ---
  useEffect(() => {
    // Step A: Sabse pahle check karo kya LocalStorage me purana data hai?
    const cachedData = localStorage.getItem("tradeMasterData");
    
    if (cachedData) {
      // Agar hai, to TURANT state me set kar do (User ko wait nahi karna padega)
      setAllTrades(JSON.parse(cachedData));
      setLoading(false); // Loading khatam, screen dikha do
    }

    // Step B: Ab shanti se background me NAYA data lao (Internet se)
    refreshTrades();
  }, []);

  return (
    <TradeContext.Provider value={{ allTrades, loading, refreshTrades }}>
      {children}
    </TradeContext.Provider>
  );
};

// Custom Hook (Easy access ke liye)
export const useTradeContext = () => useContext(TradeContext);