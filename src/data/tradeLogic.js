

export const TRADE_DATA = {
  trends: ["Bullish", "Bearish", "Sideways"],
  directions: ["Call", "Put", "Fut Buy", "Fut Sell", "Call Write", "Put Write"],
  
  // Section 4: Trade Types
  tradeTypes: ["Exact Trade", "Protected Trade", "Counter Trade", "Only Protected Trade"],

  // Section 4.1: Setups (Mapped by Trade Type)
  setups: {
    "Exact Trade": ["IDM-SWEEP", "D-OB", "D-OF", "ENG-LQD SWEEP", "Breaker Block"],
    "Protected Trade": ["Demand Zone", "Supply Zone", "Order Flow (Demand)", "Order Flow (Supply)"],
    "Counter Trade": ["IDM-SWEEP (Counter)", "Major LQD Sweep", "Tap on D-OB"],
    "Only Protected Trade": ["Order Flow", "Internal Supply Zone"]
  },

  // Section 5: Entry Types (Mapped by Setup)
  // Logic: Agar user ne 'D-OB' chuna, to sirf ye buttons dikhenge
  entryRules: {
    "D-OB": ["POI ENTRY", "ENTRY on POI 50%", "SCOB ENTRY"], 
    "IDM-SWEEP": ["DIRECT ENTRY", "POI ENTRY", "SCOB ENTRY", "CHOCH BASE ENTRY"],
    "D-OF": ["POI ENTRY", "ENTRY on POI 50%"],
    // ... baki setups ke liye yaha logic add karein
  },

  // Section 6: Exit Reasons (Based on Trade Type - Image 1000245810.png se)
  exitRules: {
    "Exact Trade": [
      "SL Hit", "CREATE BOS", "CREATE CHoCH", "FIRST DZ after CHoCH", 
      "Touch Fib 1.618", "MAJOR-LQD SWEEP"
    ],
    "Counter Trade": [
      "SL Hit", "IDM-SWEEP", "ENG-LQD SWEEP", "Tap on D-OB", "Tap on E-OF"
    ],
    "Protected Trade": ["SL Hit", "Structure Shift", "Zone Failure", "Liquidity Grab"], // Default items
    "Only Protected Trade": ["SL Hit", "Structure Shift", "Zone Failure"]
  },

  // Section 7: Result
  results: ["TARGET HIT", "STOPLOSS HIT", "COST 2 COST", "RUNNING"],
  
  // Extra: Agar Target Hit hua to kaunsa?
  targets: ["1st TARGET HIT", "2nd TARGET HIT", "3rd TARGET HIT"]


};


export default TRADE_DATA;