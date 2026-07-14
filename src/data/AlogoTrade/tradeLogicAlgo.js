export const TRADE_DATA_ALGO = {
  // Section 1: Market Trend (Updated as per your advanced logic)
  trends: ["Auto Identify (Smart Flip)", "Force Bullish (Find HH/HL)", "Force Bearish (Find LL/LH)"],

  // Section 2: Directions
  directions: ["Call", "Put", "Fut Buy", "Fut Sell", "Call Write", "Put Write"],
  
  // Section 3: Trade Types
  tradeTypes: ["Exact Trade", "Protected Trade", "Counter Trade", "Only Protected Trade"],

  // Section 3.1: Setups (Mapped by Trade Type)
  setups: {
    "Exact Trade": ["IDM-SWEEP", "D-OB", "D-OF", "E-OB", "Breaker Block"],
    "Protected Trade": ["Demand Zone", "Supply Zone", "Order Flow (Demand)", "Order Flow (Supply)"],
    "Counter Trade": ["IDM-SWEEP (Counter)", "Major LQD Sweep", "Tap on D-OB"],
    "Only Protected Trade": ["Order Flow", "Internal Supply Zone"]
  },

  // Section 4: Entry Triggers (Mapped by Setup)
  entryRules: {
    "D-OB": ["POI ENTRY", "ENTRY on POI 50%", "SCOB ENTRY"], 
    "IDM-SWEEP": ["DIRECT ENTRY", "POI ENTRY", "SCOB ENTRY", "CHOCH BASE ENTRY"],
    "D-OF": ["POI ENTRY", "ENTRY on POI 50%"],
    "E-OB": ["DIRECT ENTRY","POI ENTRY", "ENTRY on POI 50%", "SCOB ENTRY"],
    "IDM-SWEEP (Counter)": ["DIRECT ENTRY", "SCOB ENTRY"],
    "Tap on D-OB": ["POI ENTRY", "ENTRY on POI 50%"],
    // ... baki setups ke liye yaha logic add karein
  },

  // Section 5: Exit Reasons (Based on Trade Type)
  exitRules: {
    "Exact Trade": [
      "CREATE BOS", "CREATE CHoCH", "FIRST DZ after CHoCH", 
      "Touch Fib 1.618", "MAJOR-LQD SWEEP"
    ],
    "Counter Trade": [
      "IDM-SWEEP", "ENG-LQD SWEEP", "Tap on D-OB", "Tap on E-OF"
    ],
    "Protected Trade": ["SL Hit", "Structure Shift", "Zone Failure", "Liquidity Grab"],
    "Only Protected Trade": ["SL Hit", "Structure Shift", "Zone Failure"]
  }
};

export default TRADE_DATA_ALGO;