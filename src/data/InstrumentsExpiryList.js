// 🚀 CENTRALIZED EXPIRY MAP
// SEBI Guidelines: Nifty & Sensex = WEEKLY | All Others = MONTHLY
export const INSTRUMENT_EXPIRY_MAP = {
    "NIFTY 50": "WEEKLY",
    "NIFTY": "WEEKLY",
    "SENSEX": "WEEKLY",
    "BANKNIFTY": "MONTHLY",
    "FINNIFTY": "MONTHLY",
    "MIDCPNIFTY": "MONTHLY",
    "BANKEX": "MONTHLY",
};

// 🧠 Helper Function (Jise hum pure project me use kar sakte hain)
export const getDefaultExpiry = (instrumentName) => {
    if (!instrumentName) return "MONTHLY"; // Default fallback
    
    const name = instrumentName.toUpperCase();

    // 1. Direct Object Match try karega
    if (INSTRUMENT_EXPIRY_MAP[name]) {
        return INSTRUMENT_EXPIRY_MAP[name];
    }

    // 2. Substring Match (Agar name me "NIFTY 50 (NSE)" jaisa kuch lamba text aa jaye)
    if (name.includes("NIFTY 50") || name.includes("SENSEX") || name === "NIFTY") {
        return "WEEKLY";
    }

    // 3. Agar inme se kuch nahi mila (Jaise BankNifty, FinNifty, etc.), toh default Monthly
    return "MONTHLY";
};

// 🔥 THE NEW UX FIX: Dropdown me kya dikhana hai uska logic
export const getAllowedExpiries = (instrumentName) => {
    if (!instrumentName) return ["MONTHLY"]; // Fallback
    
    const name = instrumentName.toUpperCase();

    // Nifty aur Sensex ko sab options milenge
    if (name.includes("NIFTY 50") || name.includes("SENSEX") || name === "NIFTY") {
        return ["WEEKLY", "NEXT WEEKLY", "MONTHLY"]; 
    }

    // Baki sab (BankNifty, Finnifty etc.) ko sirf Monthly milega
    return ["MONTHLY"];
};