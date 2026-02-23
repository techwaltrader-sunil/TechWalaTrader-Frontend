// src/data/instrumentData.js

// 1. OPTION INDICES
export const OPTION_INDICES = [
  { name: "NIFTY 50", lot: 65, segment: "Option" },
  { name: "NIFTY BANK", lot: 30, segment: "Option" },
  { name: "NIFTY FIN SERVICE", lot: 60, segment: "Option" },
  { name: "SENSEX", lot: 20, segment: "Option" },
  { name: "BANKEX", lot: 30, segment: "Option" },
  { name: "MIDCPNIFTY", lot: 120, segment: "Option" }
];

// --- Helper Lists for Equity ---
// Top 10 Heavyweights (used in 50)
const nifty50List = [
  "RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "INFY", "SBIN", "BHARTIARTL", "ITC", "LT", "AXISBANK",
  "KOTAKBANK", "HCLTECH", "ADANIENT", "MARUTI", "SUNPHARMA", "TITAN", "BAJFINANCE", "ULTRACEMCO", "TATASTEEL", "NTPC",
  "ONGC", "POWERGRID", "M&M", "TATAMOTORS", "JSWSTEEL", "ADANIPORTS", "COALINDIA", "HINDUNILVR", "NESTLEIND", "GRASIM",
  "CIPLA", "WIPRO", "TECHM", "BPCL", "EICHERMOT", "HINDALCO", "DRREDDY", "HEROMOTOCO", "ASIANPAINT", "BRITANNIA",
  "BAJAJ-AUTO", "APOLLOHOSP", "DIVISLAB", "SBILIFE", "BAJAJFINSV", "INDUSINDBK", "TATACONSUM", "LTIM", "HDFCLIFE", "SHRIRAMFIN"
];

// Next 50 (used to make 100)
const next50List = [
  "ZOMATO", "JIOFIN", "DLF", "HAL", "VBL", "BEL", "TRENT", "SIEMENS", "IOC", "PFC",
  "REC", "CHOLAFIN", "TVSMOTOR", "HAVELLS", "GAIL", "CANBK", "ABB", "ADANIENSOL", "ADANIGREEN", "AMBUJACEM",
  "ATGL", "AUROPHARMA", "BANKBARODA", "BERGEPAINT", "BHARATFORG", "BHEL", "BOSCHLTD", "CUMMINSIND", "DABUR", "DMART",
  "GODREJCP", "HDFCAMC", "ICICIGI", "ICICIPRULI", "IDEA", "IDFCFIRSTB", "INDIGO", "INDUSTOWER", "IRCTC", "JINDALSTEL",
  "LICI", "LUPIN", "MARICO", "MOTHERSON", "MUTHOOTFIN", "NAUKRI", "PGHH", "PIDILITIND", "PIIND", "PNB"
];

// Midcaps (used to make 200)
const midcapList = [
  "ASHOKLEY", "ASTRAL", "BALKRISIND", "BANDHANBNK", "BANKINDIA", "BATAINDIA", "COFORGE", "CONCOR", "COROMANDEL", "CROMPTON",
  "DALBHARAT", "DEEPAKNTR", "DELHIVERY", "ESCORTS", "EXIDEIND", "FEDERALBNK", "GMRINFRA", "GUJGASLTD", "HINDPETRO", "IDFC",
  "IGL", "INDHOTEL", "IPCALAB", "JSL", "JUBLFOOD", "KEYSTONE", "LALPATHLAB", "LAURUSLABS", "LTF", "L&TFH",
  "M&MFIN", "MANAPPURAM", "MAXHEALTH", "METROPOLIS", "MFSL", "MPHASIS", "MRF", "NAM-INDIA", "NATIONALUM", "NAVINFLUOR",
  "OBEROIRLTY", "OFSS", "ORACLE", "PATANJALI", "PEL", "PERSISTENT", "PETRONET", "POLYCAB", "POONAWALLA", "PRESTIGE",
  "RAMCOCEM", "RBLBANK", "RECLTD", "SAIL", "SCHAEFFLER", "SRF", "SUNDARAM", "SUPREMEIND", "SYNGENE", "TATACOMM",
  "TATAELXSI", "TATAPOWER", "TORNTPOWER", "UBL", "UNIONBANK", "UNITEDBRA", "VOLTAS", "WHIRLPOOL", "YESBANK", "ZEEL",
  "ABCAPITAL", "ABFRL", "ACC", "ADANIPOWER", "ALKEM", "APLAPOLLO", "AUBANK", "BIOCON", "BRIGADE", "CGPOWER",
  "CLEAN", "CRISIL", "DIXON", "EMAMILTD", "FACT", "FLAIR", "GLAND", "GLENMARK", "GMMPFAUDLR", "GOCLCORP",
  "GPPL", "GSPL", "HAPPSTMNDS", "HDFCBANK", "HEG", "HFCL", "HGS", "HIKAL", "HINDCOPPER", "HINDZINC"
];

// 2. EQUITY STOCKS (Categorized Objects)
export const EQUITY_DATA = {
  "NIFTY50": nifty50List,
  "NIFTY100": [...nifty50List, ...next50List],
  "NIFTY200": [...nifty50List, ...next50List, ...midcapList],
  "ALL": [...nifty50List, ...next50List, ...midcapList] // All combined
};

// --- Helper for Futures ---
const nearMonth = "JAN FUT";
const nextMonth = "FEB FUT";
const farMonth = "MAR FUT";

// Generating Future names based on Nifty 50 stocks for demo
const generateFutures = (suffix) => nifty50List.slice(0, 30).map(name => `${name} ${suffix}`);

// 3. FUTURE STOCKS (Categorized Objects)
export const FUTURE_DATA = {
  "NEARMONTHS": generateFutures(nearMonth),
  "NEXTMONTHS": generateFutures(nextMonth),
  "FARMONTHS": generateFutures(farMonth),
  "ALL": [
    ...generateFutures(nearMonth),
    ...generateFutures(nextMonth),
    ...generateFutures(farMonth)
  ]
};


// 4. STRATEGY CONFIG DATA (New Added)
export const EXPIRY_TYPES = ["WEEKLY", "NEXT WEEKLY", "MONTHLY"];

export const STRIKE_CRITERIA = ["ATM pt", "ATM %", "Delta", "CP", "CP >=", "CP <="];

// Condition 1 Notes: ATM Point Difference
export const ATM_POINT_STEPS = {
  "NIFTY 50": 50,
  "NIFTY BANK": 100,
  "NIFTY FIN SERVICE": 50, 
  "MIDCPNIFTY": 25,
  "SENSEX": 100,
  "BANKEX": 100
};

// Condition 2 Notes: ATM % Difference
export const ATM_PERCENT_STEPS = {
  "NIFTY 50": 0.5,
  "NIFTY BANK": 1.0,
  "NIFTY FIN SERVICE": 0.5,
  "MIDCPNIFTY": 0.25,
  "SENSEX": 1.0,
  "BANKEX": 1.0
};