// src/context/TradingModeContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. Context क्रिएट करें
const TradingModeContext = createContext();

// 2. Provider कम्पोनेंट बनाएँ
export const TradingModeProvider = ({ children }) => {
    // डिफ़ॉल्ट रूप से टर्मिनल 'historical' मोड में खुलेगा
    const [appMode, setAppMode] = useState('historical'); 

    const toggleMode = () => {
        setAppMode((prevMode) => (prevMode === 'historical' ? 'live' : 'historical'));
    };

    return (
        <TradingModeContext.Provider value={{ appMode, toggleMode }}>
            {children}
        </TradingModeContext.Provider>
    );
};

// 3. Custom Hook (Easy access के लिए)
export const useTradingMode = () => {
    const context = useContext(TradingModeContext);
    if (!context) {
        throw new Error("useTradingMode must be used within a TradingModeProvider");
    }
    return context;
};