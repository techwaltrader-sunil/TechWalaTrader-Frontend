// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Camera, Search, Download, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// import shortStraddleImg from '../../assets/strategiesImage/ShortStraddle.png';
// import longStraddleImg from '../../assets/strategiesImage/LongStraddle.png';

// // 🧮 BSM Delta Calculator Logic
// const normalCDF = (x) => {
//     let t = 1 / (1 + 0.2316419 * Math.abs(x));
//     let d = 0.3989423 * Math.exp(-x * x / 2);
//     let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
//     return x > 0 ? 1 - prob : prob;
// };


// const calculateLiveDelta = (spot, strike, dte, iv, type = 'CE') => {
//     if (!spot || !strike || !iv || iv <= 0) return '-';
//     const t = dte === 0 ? 0.001 : dte / 365; 
//     const v = iv / 100;
    
//     // 🎯 NAYA UPDATE: Stockmock se 100% match karne ke liye Rate ko 0.0 kiya
//     const r = 0.0; 
    
//     const d1 = (Math.log(spot / strike) + (r + (v * v) / 2) * t) / (v * Math.sqrt(t));
//     const delta = type === 'CE' ? normalCDF(d1) : normalCDF(d1) - 1;
//     return delta.toFixed(2);
// };

// const formatOI = (value) => {
//     if (!value || isNaN(value)) return '';
//     let num = parseFloat(value);
//     if (num === 0) return '';
//     if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
//     if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
//     if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
//     return num.toString();
// };

// const formatChgOI = (value) => {
//     if (!value || isNaN(value) || value === 0) return '';
//     const isPositive = value > 0;
//     const absVal = Math.abs(value);
//     let formatted = '';
    
//     if (absVal >= 10000000) formatted = (absVal / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
//     else if (absVal >= 100000) formatted = (absVal / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
//     else if (absVal >= 1000) formatted = (absVal / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
//     else formatted = absVal.toString();

//     return isPositive ? `(+${formatted})` : `(-${formatted})`;
// };

// // 🎯 SMART HELPER: Weekend (Sat/Sun) ko automatically Friday me convert karne ke liye
// const getValidTradingDate = (inputDate = new Date()) => {
//     let dateObj = new Date(inputDate);
//     const day = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    
//     if (day === 0) dateObj.setDate(dateObj.getDate() - 2); // Sunday hai to 2 din pichhe (Friday)
//     else if (day === 6) dateObj.setDate(dateObj.getDate() - 1); // Saturday hai to 1 din pichhe (Friday)
    
//     const yyyy = dateObj.getFullYear();
//     const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const dd = String(dateObj.getDate()).padStart(2, '0');
//     return `${yyyy}-${mm}-${dd}`;
// };

// const SimulatorPage = () => {
//     const [date, setDate] = useState(() => {
//         const today = new Date();
//         const yyyy = today.getFullYear();
//         const mm = String(today.getMonth() + 1).padStart(2, '0');
//         const dd = String(today.getDate()).padStart(2, '0');
//         return `${yyyy}-${mm}-${dd}`;
//     });
//     const [time, setTime] = useState('09:16');
//     const [data, setData] = useState({ spotPrice: 0, chain: [] });
//     const [sodChain, setSodChain] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [activeStrategyTab, setActiveStrategyTab] = useState('Neutral');

//     const [isAddonsOpen, setIsAddonsOpen] = useState(false);
//     const [addons, setAddons] = useState({
//         delta: true,      
//         iv: true, // Auto check for IV testing
//         oi: true, 
//         showAllOi: false,
//         atm: false 
//     });

//     const tableContainerRef = useRef(null);
//     const atmRowRef = useRef(null);


//     const [expiryDates, setExpiryDates] = useState([]);
//     const [currentMonth, setCurrentMonth] = useState(new Date());

//     // 🎯 SMART TRADER: Expiry manage karne ke liye naye states
//     const [availableExpiries, setAvailableExpiries] = useState([]);
//     const [selectedExpiry, setSelectedExpiry] = useState("");

//     // 🎯 SMART UI: Expiry Slider ke states
//     const [expiryStartIndex, setExpiryStartIndex] = useState(0);
//     const [visibleExpiriesCount, setVisibleExpiriesCount] = useState(5); // Default for desktop

//     // Screen size ke hisab se visible dates set karna
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth < 768) {
//                 setVisibleExpiriesCount(3); // Mobile
//             } else {
//                 setVisibleExpiriesCount(5); // Desktop
//             }
//         };

//         handleResize(); // Initial check
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     // Jab nayi list aaye, toh index reset kar do
//     useEffect(() => {
//         setExpiryStartIndex(0);
//     }, [availableExpiries]);

//     const handlePrevExpiries = () => {
//         if (expiryStartIndex > 0) {
//             setExpiryStartIndex(prev => prev - 1);
//         }
//     };

//     const handleNextExpiries = () => {
//         if (expiryStartIndex + visibleExpiriesCount < availableExpiries.length) {
//             setExpiryStartIndex(prev => prev + 1);
//         }
//     };

//     const fetchMonthExpiries = async (dateObj, symbol = 'NIFTY') => {
//         try {
//             const year = dateObj.getFullYear();
//             const month = dateObj.getMonth() + 1; // JS me month 0 se shuru hota hai
            
//             const API_BASE_URL = window.location.hostname === 'localhost' 
//                 ? 'http://localhost:5500' 
//                 : 'http://65.0.164.229:5500';

//             const res = await axios.get(`${API_BASE_URL}/api/simulator/expiries?year=${year}&month=${month}&symbol=${symbol}`);
//             if (res.data.success) {
//                 setExpiryDates(res.data.expiries);
//             }
//         } catch (error) {
//             console.error("Error fetching expiries:", error);
//         }
//     };
    

//     useEffect(() => {
//         fetchMonthExpiries(currentMonth);
//     }, [currentMonth]);


//     const fetchSimulatorData = async (selectedTime, currentExpiry = selectedExpiry) => {
//     setLoading(true);
//     try {
//         const API_BASE_URL = window.location.hostname === 'localhost' 
//             ? 'http://localhost:5500' 
//             : 'http://65.0.164.229:5500';

//         const res = await axios.get(`${API_BASE_URL}/api/simulator/data`, {
//             params: { date: date, time: selectedTime, expiry: currentExpiry }
//         });
        
//         if (res.data.success) {
//             setData({
//                 spotPrice: res.data.spotPrice,
//                 chain: res.data.chain,
//                 dte: res.data.dte
//             });

//             // 🎯 THE FIX: Hamesha naye din ki expiries list ko update karo
//             if (res.data.availableExpiries) {
//                 setAvailableExpiries(res.data.availableExpiries);
                
//                 // Agar 'currentExpiry' list me nahi hai (yani user ne date change ki hai), 
//                 // toh list ki pehli (nearest) expiry ko auto-select kar lo
//                 if (!currentExpiry || !res.data.availableExpiries.includes(currentExpiry)) {
//                     setSelectedExpiry(res.data.availableExpiries[0] || "");
//                 }
//             }
//         }
//     } catch (error) {
//         console.error("Error fetching simulator data:", error);
//     }
//     setLoading(false);
// };

// // 🎯 NAYA: Har naye din ya expiry par SOD (Start of Day) ka reference data lana
// const fetchSodData = async (currentDate, currentExpiry) => {
//     if (!currentDate || !currentExpiry) return;
//     try {
//         const API_BASE_URL = window.location.hostname === 'localhost' 
//             ? 'http://localhost:5500' 
//             : 'http://65.0.164.229:5500';

//         // Pehle 09:15 AM ka data mang kar dekho
//         let res = await axios.get(`${API_BASE_URL}/api/simulator/data`, {
//             params: { date: currentDate, time: '09:15', expiry: currentExpiry }
//         });
        
//         // 🎯 FIX: Agar 09:15 par market ka data empty hai, toh 09:16 ka data try karo
//         if (res.data.success && res.data.chain.length === 0) {
//             res = await axios.get(`${API_BASE_URL}/api/simulator/data`, {
//                 params: { date: currentDate, time: '09:26', expiry: currentExpiry }
//             });
//         }

//         if (res.data.success) {
//             setSodChain(res.data.chain);
//         }
//     } catch (error) {
//         console.error("Error fetching SOD data:", error);
//     }
// };

// useEffect(() => {
//     if (date && selectedExpiry) {
//         fetchSodData(date, selectedExpiry);
//     }
// }, [date, selectedExpiry]);

//     useEffect(() => {
//         fetchSimulatorData(time);
//     }, [time, date]);

//     useEffect(() => {
//         if (atmRowRef.current && tableContainerRef.current) {
//             const container = tableContainerRef.current;
//             const row = atmRowRef.current;

//             const containerRect = container.getBoundingClientRect();
//             const rowRect = row.getBoundingClientRect();

//             const isVisible = (rowRect.top >= containerRect.top) && (rowRect.bottom <= containerRect.bottom);

//             if (!isVisible) {
//                 row.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             }
//         }
//     }, [data.chain]);

//     const handleDayChange = (daysToAdd) => {
//         let currentDate = new Date(date);
//         currentDate.setDate(currentDate.getDate() + daysToAdd);
        
//         // Skip Weekends (0 = Sunday, 6 = Saturday)
//         if (currentDate.getDay() === 6) { 
//             currentDate.setDate(currentDate.getDate() + (daysToAdd > 0 ? 2 : -1));
//         } else if (currentDate.getDay() === 0) { 
//             currentDate.setDate(currentDate.getDate() + (daysToAdd > 0 ? 1 : -2));
//         }

//         // Format manually to YYYY-MM-DD
//         const yyyy = currentDate.getFullYear();
//         const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(currentDate.getDate()).padStart(2, '0');
        
//         setDate(`${yyyy}-${mm}-${dd}`);
//         setTime('09:15'); // Reset time to SOD
//     };

//     // 🎯 UPDATED: Advanced Time Handling (Auto Rollover to Next Day)
//     const handleTimeChange = (minutesToAdd) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         let newDateObj = new Date();
//         newDateObj.setHours(hours, minutes + minutesToAdd, 0, 0);

//         let newHours = newDateObj.getHours();
//         let newMins = newDateObj.getMinutes();

//         // If time crosses 15:30 -> Go to NEXT day 09:15
//         if (newHours > 15 || (newHours === 15 && newMins > 30)) {
//             handleDayChange(1);
//             return;
//         } 
//         // If time goes behind 09:15 -> Go to PREVIOUS day 15:30
//         else if (newHours < 9 || (newHours === 9 && newMins < 15)) {
//             let prevDate = new Date(date);
//             prevDate.setDate(prevDate.getDate() - 1);
            
//             if (prevDate.getDay() === 0) prevDate.setDate(prevDate.getDate() - 2); // Skip Sunday
//             if (prevDate.getDay() === 6) prevDate.setDate(prevDate.getDate() - 1); // Skip Saturday
            
//             const yyyy = prevDate.getFullYear();
//             const mm = String(prevDate.getMonth() + 1).padStart(2, '0');
//             const dd = String(prevDate.getDate()).padStart(2, '0');
            
//             setDate(`${yyyy}-${mm}-${dd}`);
//             setTime('15:30');
//             return;
//         }

//         const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
//         setTime(formattedTime);
//     };

//     // 🎯 NEW: Manual Dropdown Time Handling (with Market Hours Safety)
//     const handleManualTimeChange = (type, value) => {
//         let [hours, minutes] = time.split(':').map(Number);
        
//         if (type === 'hour') hours = Number(value);
//         if (type === 'minute') minutes = Number(value);

//         // Smart Safety: Constraint to Indian Market Hours (09:15 to 15:30)
//         if (hours === 9 && minutes < 15) minutes = 15;
//         if (hours === 15 && minutes > 30) minutes = 30;

//         const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
//         setTime(formattedTime);
//     };

//     const getAtmStrike = () => {
//         if (!data.spotPrice || data.chain.length === 0) return null;
//         return data.chain.reduce((prev, curr) => 
//             Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
//         ).strike;
//     };

//     // 🎯 SMART FILTER: Sirf Monday (1) se Friday (5) tak enable rakhega, Sat(6) aur Sun(0) ko disable karega
//     const isWeekday = (date) => {
//         const day = date.getDay();
//         return day !== 0 && day !== 6; 
//     };


//     // 🎯 SMART HIGHLIGHTER: Backend se aayi dates ko match karega
//     const highlightExpiry = (renderDate) => {
//         const yyyy = renderDate.getFullYear();
//         const mm = String(renderDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(renderDate.getDate()).padStart(2, '0');
//         const dateString = `${yyyy}-${mm}-${dd}`;

//         if (expiryDates.includes(dateString)) {
//             // Agar calendar ka render ho raha din, user ke selected 'date' state ke barabar hai
//             if (dateString === date) {
//                 return "!text-white font-bold"; // 🎯 Selected din par safed text
//             } else {
//                 return "!text-blue-600 font-bold"; // 🎯 Baki expiry din par blue text
//             }
//         }
//         return "";
//     };

//     const atmStrike = getAtmStrike();

//     let maxOverallOI = 1;
//     let maxCallOI = 0;
//     let maxPutOI = 0;

//     // 🎯 NAYA LOGIC: Header Stats ke liye variables
//     let totalCallOI = 0;
//     let totalPutOI = 0;
//     let totalCallOiChg = 0;
//     let totalPutOiChg = 0;

//     data.chain.forEach(row => {
//         const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
//         const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
        
//         // Max OI calculation (Tumhara purana logic jo zaroori hai)
//         if (ceOI > maxCallOI) maxCallOI = ceOI;
//         if (peOI > maxPutOI) maxPutOI = peOI;
//         if (ceOI > maxOverallOI) maxOverallOI = ceOI;
//         if (peOI > maxOverallOI) maxOverallOI = peOI;

//         // 🎯 Header Totals Calculation (Naya logic)
//         totalCallOI += ceOI;
//         totalPutOI += peOI;

//         // SOD (09:15) data nikal kar Change in OI ka Total karna
//         const sodRow = sodChain.find(s => Number(s.strike) === Number(row.strike)) || {};
//         const sodCallOi = sodRow.CE?.oi ? parseFloat(sodRow.CE.oi) : ceOI;
//         const sodPutOi = sodRow.PE?.oi ? parseFloat(sodRow.PE.oi) : peOI;

//         totalCallOiChg += (ceOI - sodCallOi);
//         totalPutOiChg += (peOI - sodPutOi);
//     });


//     // 🎯 MAX PAIN CALCULATION LOGIC
//     let maxPainStrike = 0;
//     let minTotalLoss = Infinity;

//     // Har strike ko as a "Potential Expiry" test karenge
//     data.chain.forEach(expiryRow => {
//         const assumedExpiry = expiryRow.strike;
//         let totalLossAtThisStrike = 0;

//         // Is assumed expiry par baki sabhi strikes ka loss calculate karna
//         data.chain.forEach(row => {
//             const strike = row.strike;
//             const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
//             const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;

//             // Call sellers tab loss karte hain jab market upar band ho
//             if (assumedExpiry > strike) {
//                 totalLossAtThisStrike += (assumedExpiry - strike) * ceOI;
//             }
            
//             // Put sellers tab loss karte hain jab market niche band ho
//             if (assumedExpiry < strike) {
//                 totalLossAtThisStrike += (strike - assumedExpiry) * peOI;
//             }
//         });

//         // Agar is strike par loss sabse kam hai, toh yehi Max Pain banega
//         if (totalLossAtThisStrike < minTotalLoss) {
//             minTotalLoss = totalLossAtThisStrike;
//             maxPainStrike = assumedExpiry;
//         }
//     });

//     // 🎯 PCR (Put-Call Ratio) Calculation
//     const pcr = totalCallOI > 0 ? (totalPutOI / totalCallOI).toFixed(2) : "0.00";

//     // 🎯 NAYA LOGIC: Header Bars ki Width Calculation (Max OI ko 50% width assign karna hai)
//     const maxHeaderOI = Math.max(totalCallOI, totalPutOI) || 1;
//     const callHeaderBarWidth = (totalCallOI / maxHeaderOI) * 50; // Center se Left ki taraf jayega
//     const putHeaderBarWidth = (totalPutOI / maxHeaderOI) * 50;   // Center se Right ki taraf jayega


//     // 🎯 ATM IV & STRADDLE PREM CALCULATION
//     let headerAtmIV = "-";
//     let headerStraddlePrem = "-";

//     if (atmStrike && data.chain.length > 0) {
//         const atmRow = data.chain.find(row => row.strike === atmStrike);
        
//         if (atmRow) {
//             // Straddle Premium = ATM Call LTP + ATM Put LTP
//             const ceLtp = atmRow.CE?.ltp ? parseFloat(atmRow.CE.ltp) : 0;
//             const peLtp = atmRow.PE?.ltp ? parseFloat(atmRow.PE.ltp) : 0;
//             if (ceLtp || peLtp) {
//                 headerStraddlePrem = (ceLtp + peLtp).toFixed(1);
//             }

//             // ATM IV = Average of ATM Call IV & ATM Put IV
//             const ceIV = atmRow.CE?.iv ? parseFloat(atmRow.CE.iv) : 0;
//             const peIV = atmRow.PE?.iv ? parseFloat(atmRow.PE.iv) : 0;
            
//             if (ceIV > 0 && peIV > 0) {
//                 headerAtmIV = ((ceIV + peIV) / 2).toFixed(1);
//             } else if (ceIV > 0) {
//                 headerAtmIV = ceIV.toFixed(1);
//             } else if (peIV > 0) {
//                 headerAtmIV = peIV.toFixed(1);
//             }
//         }
//     }

//     // 🎯 HELPER: '2026-08-18' ko '18 AUG 2026' me badalne ke liye
//     const formatExpiryDisplay = (dateString) => {
//         if (!dateString) return "";
//         const dateObj = new Date(dateString);
//         const day = dateObj.getDate();
//         const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
//         const year = dateObj.getFullYear();
//         return `${day} ${month} ${year}`; 
//     };

//     // 🎯 HELPER 2: Option Chain Header ke liye (e.g., "18 AUG '26")
//     const formatHeaderDate = (dateString) => {
//         if (!dateString) return "";
//         const dateObj = new Date(dateString);
//         const day = dateObj.getDate();
//         const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
//         const year = dateObj.getFullYear().toString().slice(-2); // Sirf last 2 digit ('26')
//         return `${day} ${month} '${year}`; 
//     };

//     // 🎯 HELPER 3: Har tab ke liye alag DTE aur Label (CW/NW/CM/NM) nikalne ke liye
//     const getTabDteInfo = (simDateStr, expDateStr) => {
//         if (!simDateStr || !expDateStr) return { dte: 0, label: 'CW' };
        
//         const simDate = new Date(simDateStr);
//         const expDate = new Date(expDateStr);
        
//         // 1. Dino (Days) ka difference nikalna
//         const diffTime = expDate.getTime() - simDate.getTime();
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
//         // 2. Mahino (Months) ka difference nikalna (Saal badalne par bhi sahi kaam karega)
//         const monthDiff = (expDate.getFullYear() - simDate.getFullYear()) * 12 + (expDate.getMonth() - simDate.getMonth());
        
//         let label = 'CW';
//         if (diffDays <= 7) {
//             label = 'CW'; // Current Week (0 se 7 din)
//         } else if (diffDays <= 14) {
//             label = 'NW'; // Next Week (8 se 14 din)
//         } else {
//             // Agar expiry 2 mahine aage ki hai (jaise August se October), toh wo Next Month (NM) hogi
//             if (monthDiff >= 2) {
//                 label = 'NM'; 
//             } else {
//                 label = 'CM'; // Current Month
//             }
//         }
        
//         return { dte: diffDays, label };
//     };

//     const preBuiltStrategies = [
//         { name: "Short Straddle", type: "Neutral", image: shortStraddleImg },
//         { name: "Long Straddle", type: "Neutral", image: longStraddleImg },
//         { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
//         { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
//         { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//         { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//     ];

//     return (
//         <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">
//             {/* 1. TOP BAR */}
//             <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm relative z-50">
                
//                 {/* Nifty Dropdown & Snapshot */}
//                 <div className="w-full xl:w-auto flex justify-between items-center">
//                     <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 md:w-48 focus:outline-none focus:border-blue-500">
//                         <option>Nifty</option>
//                         <option>BankNifty</option>
//                         <option>FinNifty</option>
//                     </select>
//                     <button className="xl:hidden text-gray-500 hover:text-gray-800 flex items-center gap-1.5 text-sm font-medium px-2 py-1 bg-gray-50 rounded border border-gray-200">
//                         <Camera size={14} /> Snapshot
//                     </button>
//                 </div>

//                 {/* 🎯 FIX: Time Controls Keypad (Stacked on Mobile, Inline on Desktop) */}
//                 <div className="flex flex-col xl:flex-row justify-center items-center gap-2.5 md:gap-3 w-full xl:w-auto bg-gray-50 xl:bg-transparent p-2 xl:p-0 rounded-lg border border-gray-200 xl:border-0">
                    
//                     {/* Minus Controls Row */}
//                     <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2">
//                         <button onClick={() => handleDayChange(-1)} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium">&lt;&lt; Day</button>
//                         <button onClick={() => setTime('09:16')} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium">SOD</button>
//                         <button onClick={() => handleTimeChange(-120)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-2h</button>
//                         <button onClick={() => handleTimeChange(-30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-30m</button>
//                         <button onClick={() => handleTimeChange(-15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-15m</button>
//                         <button onClick={() => handleTimeChange(-5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-5m</button>
//                         <button onClick={() => handleTimeChange(-1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-1m</button>
//                     </div>
                    
//                     {/* Date & Time Selectors Row */}
//                     <div className="flex justify-center items-center gap-2 my-1 w-full md:w-auto">
//                         <DatePicker
//                             selected={new Date(date)}
//                             onChange={(selectedDate) => {
//                                 const yyyy = selectedDate.getFullYear();
//                                 const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
//                                 const dd = String(selectedDate.getDate()).padStart(2, '0');
//                                 setDate(`${yyyy}-${mm}-${dd}`);
//                                 setTime('09:16'); 
//                             }}
//                             filterDate={isWeekday} 
//                             maxDate={new Date()}   
//                             dateFormat="yyyy-MM-dd"
//                             dayClassName={highlightExpiry}
//                             onMonthChange={(date) => setCurrentMonth(date)}
//                             className="border border-gray-300 px-2 py-1.5 bg-white font-bold rounded shadow-inner outline-none cursor-pointer text-gray-800 uppercase w-[130px] md:w-[140px] text-center text-[13px] md:text-sm"
                            
//                             renderCustomHeader={({
//                                 date: headerDate, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled,
//                             }) => (
//                                 <div className="flex justify-between items-center px-2 py-2 bg-gray-50 border-b border-gray-200">
//                                     <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="text-gray-500 hover:text-gray-800 disabled:opacity-30 font-bold px-2 cursor-pointer">{"<"}</button>
//                                     <div className="flex gap-1">
//                                         <select value={headerDate.getMonth()} onChange={({ target: { value } }) => changeMonth(Number(value))} className="border border-gray-300 bg-white text-gray-700 font-medium rounded px-1 py-0.5 outline-none cursor-pointer text-sm hover:border-blue-400">
//                                             {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
//                                                 <option key={month} value={index}>{month}</option>
//                                             ))}
//                                         </select>
//                                         <select value={headerDate.getFullYear()} onChange={({ target: { value } }) => changeYear(Number(value))} className="border border-gray-300 bg-white text-gray-700 font-medium rounded px-1 py-0.5 outline-none cursor-pointer text-sm hover:border-blue-400">
//                                             {Array.from({ length: new Date().getFullYear() - 2018 + 1 }, (_, i) => 2018 + i).map((year) => (
//                                                 <option key={year} value={year}>{year}</option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="text-gray-500 hover:text-gray-800 disabled:opacity-30 font-bold px-2 cursor-pointer">{">"}</button>
//                                 </div>
//                             )}
//                         />

//                         <div className="flex gap-1">
//                             <select className="border border-gray-300 px-1.5 py-1.5 bg-white rounded font-bold text-gray-800 outline-none cursor-pointer hover:border-blue-400 text-[13px] md:text-sm" value={parseInt(time.split(':')[0])} onChange={(e) => handleManualTimeChange('hour', e.target.value)}>
//                                 {[9, 10, 11, 12, 13, 14, 15].map(h => (<option key={h} value={h}>{h}</option>))}
//                             </select>
//                             <select className="border border-gray-300 px-1.5 py-1.5 bg-white rounded font-bold text-gray-800 outline-none cursor-pointer hover:border-blue-400 text-[13px] md:text-sm custom-scrollbar" value={time.split(':')[1]} onChange={(e) => handleManualTimeChange('minute', e.target.value)}>
//                                 {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => (<option key={m} value={m}>{m}</option>))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Plus Controls Row */}
//                     <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2">
//                         <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">1m+</button>
//                         <button onClick={() => handleTimeChange(5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">5m+</button>
//                         <button onClick={() => handleTimeChange(15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">15m+</button>
//                         <button onClick={() => handleTimeChange(30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">30m+</button>
//                         <button onClick={() => handleTimeChange(120)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">2h+</button>
//                         <button onClick={() => setTime('15:30')} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium">EOD</button>
//                         <button onClick={() => handleDayChange(1)} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium cursor-pointer">Day &gt;&gt;</button>
//                     </div>
//                 </div>
                
//                 {/* Desktop Snapshot (Hidden on mobile) */}
//                 <div className="hidden xl:flex w-32 justify-end">
//                     <button className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"><Camera size={16} /> Snapshot</button>
//                 </div>
//             </div>

//             {/* 2. STATS BAR (Stockmock Clean Mobile View) */}
//             <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                
//                 {/* Stats Wrapper */}
//                 <div className="flex flex-col xl:flex-row w-full xl:w-auto gap-3 xl:gap-8 font-medium">
                    
//                     {/* Add Futures Button */}
//                     <div className="flex justify-start">
//                         <button className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-md border border-green-100 xl:border-0 xl:bg-transparent xl:p-0">
//                             <span className="bg-green-100 xl:bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">+</span> Add Futures
//                         </button>
//                     </div>

//                     {/* 🎯 FIX: Mobile List View (Label Left, Value Right), Inline on Desktop */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-row gap-x-6 gap-y-0 xl:gap-y-0 text-[13px] bg-gray-50 xl:bg-transparent px-3 py-1 xl:p-0 rounded-lg border border-gray-200 xl:border-0 w-full xl:w-auto">
                        
//                         <div className="flex justify-between xl:justify-start items-center gap-2 border-b border-gray-200 xl:border-0 py-2 xl:py-0">
//                             <span className="text-gray-500">Day Open:</span> 
//                             <span className="text-gray-800 font-bold">24343.5 <span className="text-red-500 font-medium">(-23pt, -0.1%)</span></span>
//                         </div>
                        
//                         <div className="flex justify-between xl:justify-start items-center gap-2 border-b border-gray-200 md:border-b-0 xl:border-0 py-2 xl:py-0">
//                             <span className="text-gray-500">Spot:</span> 
//                             <span className="text-gray-800 font-bold">{data.spotPrice ? data.spotPrice : '---'} <span className="text-red-500 font-medium">(-36pt, -0.1%)</span></span>
//                         </div>
                        
//                         <div className="flex justify-between xl:justify-start items-center gap-2 border-b border-gray-200 md:border-b-0 xl:border-0 py-2 xl:py-0">
//                             <span className="text-gray-500">Fut:</span> 
//                             <span className="text-gray-800 font-bold">24361.4</span>
//                         </div>
                        
//                         <div className="flex justify-between xl:justify-start items-center gap-2 py-2 xl:py-0">
//                             <span className="text-gray-500">Synth Fut:</span> 
//                             <span className="text-gray-800 font-bold">24320.8 <span className="text-gray-400 font-normal text-[11px]">(18 AUG)</span></span>
//                         </div>

//                     </div>
//                 </div>

//                 {/* Strategy Buttons */}
//                 <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-2 w-full xl:w-auto mt-1 xl:mt-0">
//                     <button className="flex justify-center items-center gap-1.5 px-3 py-2 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-md font-bold transition-colors w-full md:w-auto text-[13px]">
//                         <Search size={14} /> Strategy Finder
//                     </button>
//                     <button className="flex justify-center items-center gap-1.5 px-3 py-2 text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-md font-bold transition-colors w-full md:w-auto text-[13px]">
//                         Saved Strategies
//                     </button>
//                     <button className="col-span-2 md:col-span-1 flex justify-center items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-bold transition-colors w-full md:w-auto text-[13px] border border-gray-200 xl:border-0">
//                         <Download size={14} /> Import Strategy
//                     </button>
//                 </div>
//             </div>

//             {/* 3. MAIN GRID */}
//             <div className="p-2 md:p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
//                 {/* --- LEFT: OPTION CHAIN --- */}
//                 <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">
//                     <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0 relative">
//                         <div>
//                             <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded transition-colors" onClick={() => setIsAddonsOpen(!isAddonsOpen)}>
//                                 <Settings size={14} /> Add ons <span className="text-[10px]">▼</span>
//                             </div>
//                             {isAddonsOpen && (
//                                 <>
//                                     <div className="fixed inset-0 z-40" onClick={() => setIsAddonsOpen(false)}></div>
//                                     <div className="absolute top-full left-2 mt-1 w-44 bg-white border border-gray-200 shadow-xl rounded-md z-50 py-2 text-sm text-gray-700">
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.delta} onChange={(e) => setAddons({...addons, delta: e.target.checked})} /> Delta(Δ)</label>
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.iv} onChange={(e) => setAddons({...addons, iv: e.target.checked})} /> Smart IV</label>
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.oi} onChange={(e) => setAddons({...addons, oi: e.target.checked})} /> OI</label>
//                                         {addons.oi && (
//                                             <label className="flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.showAllOi} onChange={(e) => setAddons({...addons, showAllOi: e.target.checked})} /> Show All OI</label>
//                                         )}
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.atm} onChange={(e) => setAddons({...addons, atm: e.target.checked})} /> ATM</label>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                         <div className="font-semibold text-gray-800">
//                             Option Chain <span className="font-normal text-gray-500">
//                                 {selectedExpiry ? formatHeaderDate(selectedExpiry).replace("'", "") : ""}
//                             </span>
//                         </div>
//                         <div className="w-16"></div> 
//                     </div>

//                     <div className="flex items-center border-b border-gray-200 overflow-hidden shrink-0 w-full">
//                         {/* LEFT ARROW */}
//                         <button 
//                             onClick={handlePrevExpiries}
//                             disabled={expiryStartIndex === 0}
//                             className={`p-2 transition-colors ${expiryStartIndex === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-200'}`}
//                         >
//                             <ChevronLeft size={16}/>
//                         </button>
                        
//                         {/* 🎯 FIX: 'justify-center' हटाया और 'w-full' लगाया */}
//                         <div className="flex-1 flex w-full transition-all duration-300">
//                             {/* Sliced Expiry Dates Loop */}
//                             {availableExpiries
//                                 .slice(expiryStartIndex, expiryStartIndex + visibleExpiriesCount)
//                                 .map((expDate, idx) => {
//                                 const tabInfo = getTabDteInfo(date, expDate); 

//                                 return (
//                                     <div 
//                                         key={idx}
//                                         onClick={() => {
//                                             setSelectedExpiry(expDate);
//                                             fetchSimulatorData(time, expDate);
//                                         }}
//                                         // 🎯 FIX: Fixed width हटाकर 'flex-1' लगाया ताकि ये पूरा स्पेस बराबर बाँट लें
//                                         className={`flex-1 px-1 md:px-2 py-2 flex flex-col items-center justify-center cursor-pointer transition-colors
//                                             ${selectedExpiry === expDate 
//                                                 ? 'border-b-2 border-blue-500 bg-blue-50' 
//                                                 : 'hover:bg-gray-50 border-b-2 border-transparent'
//                                             }`}
//                                     >
//                                         <span className={`font-semibold text-sm ${selectedExpiry === expDate ? 'text-blue-600' : 'text-gray-500 font-medium'}`}>
//                                             {formatHeaderDate(expDate)}
//                                         </span>
                                        
//                                         <span className={`text-[10px] ${selectedExpiry === expDate ? 'text-gray-500' : 'text-gray-400'}`}>
//                                             ({tabInfo.label}: {tabInfo.dte} DTE)
//                                         </span>
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* RIGHT ARROW */}
//                         <button 
//                             onClick={handleNextExpiries}
//                             disabled={expiryStartIndex + visibleExpiriesCount >= availableExpiries.length}
//                             className={`p-2 transition-colors ${expiryStartIndex + visibleExpiriesCount >= availableExpiries.length ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-200'}`}
//                         >
//                             <ChevronRight size={16}/>
//                         </button>
//                     </div>

//                     <div className="p-3 border-b border-gray-200 text-[12px] space-y-3 bg-white shrink-0">
//                         <div className="flex justify-between items-center">
//                             {/* 🎯 DYNAMIC ATM IV */}
//                             <span className="text-gray-600 w-1/4">ATM IV: <span className="font-semibold text-gray-900">{headerAtmIV}</span></span>
                            
//                             <div className="flex justify-center items-center gap-3 text-gray-600 w-2/4">
//                                 <span>ATM:</span>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Spot</label>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" defaultChecked /> Fut</label>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Synth Fut</label>
//                             </div>
                            
//                             {/* 🎯 DYNAMIC STRADDLE PREM */}
//                             <span className="text-gray-600 w-1/4 text-right">Straddle Prem: <span className="font-semibold text-gray-900">{headerStraddlePrem}</span></span>
//                         </div>
                        
//                         <div className="flex justify-between items-center">
//                             {/* 🎯 DYNAMIC PCR */}
//                             <span className="text-gray-600 w-1/4">PCR: <span className="font-semibold text-gray-900">{pcr}</span></span>
                            
//                             {/* 🎯 DYNAMIC TOTAL OI & CHANGE WITH COLORED BARS */}
//                             <div className="flex justify-center items-center text-[11px] w-2/4 bg-gray-50 py-1 rounded relative overflow-hidden z-0 border border-gray-100">
                                
//                                 {/* 🎯 Background Bars (Originating from center 'OI') */}
//                                 <div className="absolute right-1/2 top-0 bottom-0 bg-[#fce4e4] transition-all duration-300 z-[-1]" style={{ width: `${callHeaderBarWidth}%` }}></div>
//                                 <div className="absolute left-1/2 top-0 bottom-0 bg-[#e6f4ea] transition-all duration-300 z-[-1]" style={{ width: `${putHeaderBarWidth}%` }}></div>

//                                 {/* Foreground Text */}
//                                 <div className="flex items-center w-full justify-between z-10 px-2">
                                    
//                                     {/* Left: Call OI */}
//                                     <div className="flex-1 flex justify-end items-center">
//                                         <span className="text-gray-900 font-semibold mr-1">{formatOI(totalCallOI)}</span>
//                                         {totalCallOiChg !== 0 && (
//                                             <span className={`font-medium ${totalCallOiChg > 0 ? 'text-green-500' : 'text-red-500'}`}>
//                                                 {formatChgOI(totalCallOiChg)}
//                                             </span>
//                                         )}
//                                     </div>
                                    
//                                     {/* Center: OI Label */}
//                                     <div className="text-gray-400 font-medium px-2 shrink-0 flex items-center">
//                                         <span className="text-gray-300 mr-1">—</span>OI<span className="text-gray-300 ml-1">—</span>
//                                     </div>
                                    
//                                     {/* Right: Put OI */}
//                                     <div className="flex-1 flex justify-start items-center">
//                                         <span className="text-gray-900 font-semibold mr-1">{formatOI(totalPutOI)}</span>
//                                         {totalPutOiChg !== 0 && (
//                                             <span className={`font-medium ${totalPutOiChg > 0 ? 'text-green-500' : 'text-red-500'}`}>
//                                                 {formatChgOI(totalPutOiChg)}
//                                             </span>
//                                         )}
//                                     </div>
                                    
//                                 </div>
//                             </div>
                            
//                             <span className="text-gray-600 w-1/4 text-right">Max Pain: <span className="font-semibold text-gray-900">{maxPainStrike > 0 ? maxPainStrike : '---'}</span></span>
//                         </div>
//                     </div>

//                     <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
//                         <table className="w-full text-center">
//                             <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-30">
//                                 <tr>
//                                     <th className="py-2 px-2 font-medium w-[25%]">Call LTP {addons.delta && '(Δ)'}</th>
//                                     {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
                                    
//                                     <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200 shadow-[inset_0_-1px_0_0_#e5e7eb] w-[20%]">Strike</th>
                                    
//                                     {/* 🎯 SINGLE SMART IV COLUMN */}
//                                     {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
                                    
//                                     {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
//                                     <th className="py-2 px-2 font-medium w-[25%]">Put LTP {addons.delta && '(Δ)'}</th>
//                                 </tr>
//                             </thead>
                            
//                             <tbody className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
//                                 {data.chain.length === 0 && loading ? (
//                                     <tr><td colSpan="7" className="py-10 text-gray-400 font-medium">Loading Option Chain...</td></tr>
//                                 ) : data.chain.map((row, idx) => {
//                                     const isATM = row.strike === atmStrike;
//                                     const isCallITM = row.strike < atmStrike;
//                                     const isPutITM = row.strike > atmStrike;

//                                     let callBg = isCallITM ? 'bg-white' : 'bg-[#fffde7]';
//                                     let putBg = isPutITM ? 'bg-white' : 'bg-[#fffde7]';
//                                     let strikeBg = 'bg-gray-50';

//                                     if (isATM) {
//                                         callBg = 'bg-[#e3f2fd]';
//                                         putBg = 'bg-[#e3f2fd]';
//                                         strikeBg = 'bg-[#e3f2fd]';
//                                     }
                                    
//                                     const callOiRaw = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
//                                     const putOiRaw = row.PE?.oi ? parseFloat(row.PE.oi) : 0;

//                                     // 🎯 09:15 AM (SOD) ke mukable Change in OI nikalne ka logic
//                                     const sodRow = sodChain.find(s => Number(s.strike) === Number(row.strike)) || {};
//                                     const sodCallOi = sodRow.CE?.oi ? parseFloat(sodRow.CE.oi) : callOiRaw;
//                                     const sodPutOi = sodRow.PE?.oi ? parseFloat(sodRow.PE.oi) : putOiRaw;

//                                     const callOiChg = callOiRaw - sodCallOi;
//                                     const putOiChg = putOiRaw - sodPutOi;
                                    
//                                     const isMaxCallOI = callOiRaw === maxCallOI && callOiRaw > 0;
//                                     const isMaxPutOI = putOiRaw === maxPutOI && putOiRaw > 0;

//                                     const callOiWidth = (callOiRaw / maxOverallOI) * 100;
//                                     const putOiWidth = (putOiRaw / maxOverallOI) * 100;

//                                     // 🎯 NAYA LOGIC: SMART IV CALCULATION YAHAN ADD KIYA HAI
//                                     let smartIV = '-';
//                                     if (addons.iv) {
//                                         const ceIV = row.CE?.iv ? parseFloat(row.CE.iv) : 0;
//                                         const peIV = row.PE?.iv ? parseFloat(row.PE.iv) : 0;

//                                         if (isATM) {
//                                             if (ceIV && peIV) smartIV = ((ceIV + peIV) / 2).toFixed(1);
//                                             else if (ceIV) smartIV = ceIV.toFixed(1);
//                                             else if (peIV) smartIV = peIV.toFixed(1);
//                                         } else if (row.strike < atmStrike) {
//                                             smartIV = peIV ? peIV.toFixed(1) : '-';
//                                         } else {
//                                             smartIV = ceIV ? ceIV.toFixed(1) : '-';
//                                         }
//                                     }

                                  
//                                    // 🎯 LIVE & SMART DELTA CALCULATION (Hybrid Logic)
//                                     const dte = data.dte || 0; // Abhi ke liye DTE = 4 maan rahe hain

//                                     const getSmartDelta = (optData, type) => {
//                                         if (!optData) return '-';
                                        
//                                         const dbDelta = parseFloat(optData.delta || 0);
//                                         if (dbDelta !== 0) return dbDelta.toFixed(2);
                                        
//                                         return calculateLiveDelta(data.spotPrice, row.strike, dte, parseFloat(optData.iv || 0), type);
//                                     };

//                                     const ceDeltaLive = addons.delta ? getSmartDelta(row.CE, 'CE') : '-';
//                                     const peDeltaLive = addons.delta ? getSmartDelta(row.PE, 'PE') : '-';

//                                     return (
//                                         <tr 
//                                             key={idx} 
//                                             ref={isATM ? atmRowRef : null} 
//                                             className={`border-b border-gray-100 hover:bg-gray-50 group ${addons.atm && isATM ? 'border-2 border-blue-400 shadow-md relative z-10' : ''}`}
//                                         >
//                                             {/* CALL LTP */}
//                                             <td className={`py-1.5 px-2 relative ${callBg}`}>
//                                                 <div className="font-semibold text-gray-800">
//                                                     {/* 🎯 NAYA LIVE CALL DELTA YAHAN UPDATE KIYA HAI */}
//                                                     {row.CE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({ceDeltaLive})</span>}
//                                                 </div>
//                                                 <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
//                                                     <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
//                                                     <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
//                                                 </div>
//                                             </td>

//                                             {/* CALL OI GRAPH */}
//                                             {addons.oi && (
//                                                 <td className={`relative p-0 h-full ${callBg}`}>
//                                                     <div className="flex items-center justify-end w-full h-full min-h-[28px] relative group-hover/oi">
//                                                         <div className={`absolute right-0 top-[15%] bottom-[15%] rounded-l-sm transition-all z-0 ${isMaxCallOI ? 'bg-red-200 border-l border-red-400' : 'bg-[#fce4e4] dark:bg-red-900/30'}`} style={{ width: `${callOiWidth}%` }}></div>
                                                        
//                                                         {/* 🎯 Ye wahi hissa hai jo Max OI ya Show All OI par dikhega, ab isme Change in OI bhi jud gaya hai */}
//                                                         <div className={`absolute right-2 z-10 text-[11px] font-medium flex items-center gap-1 ${isMaxCallOI ? 'text-gray-500 opacity-100 font-bold' : 'text-red-400 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
//                                                             <span>{formatOI(callOiRaw)}</span>
//                                                             {callOiChg !== 0 && (
//                                                                 <span className={callOiChg > 0 ? "text-green-500 font-medium text-[10px]" : "text-red-500 font-medium text-[10px]"}>
//                                                                     {formatChgOI(callOiChg)}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                             )}
                                            
//                                             {/* STRIKE */}
//                                             <td className={`py-1.5 px-2 border-x border-gray-200 ${strikeBg}`}>
//                                                 <div className="flex flex-col items-center justify-center min-h-[32px]">
//                                                     <div className={`font-semibold ${isATM ? 'text-blue-700' : 'text-gray-700'}`}>{row.strike}</div>
//                                                     {isATM && <div className="text-[10px] text-blue-600 leading-none -mt-0.5">(ATM)</div>}
//                                                     {!isATM && (
//                                                         <div className={`text-[10px] text-gray-400 leading-none -mt-0.5 transition-opacity ${addons.atm ? 'opacity-100' : 'opacity-0'}`}>
//                                                             (ATM {row.strike > atmStrike ? '+' : ''}{row.strike - atmStrike})
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </td>

//                                             {/* SMART IV COLUMN */}
//                                             {addons.iv && <td className={`py-1.5 px-2 text-gray-500 font-medium text-[11px] ${strikeBg}`}>{smartIV}</td>}
                                            
//                                             {/* PUT OI GRAPH */}
//                                             {addons.oi && (
//                                                 <td className={`relative p-0 h-full ${putBg}`}>
//                                                     <div className="flex items-center justify-start w-full h-full min-h-[28px] relative group-hover/oi">
//                                                         <div className={`absolute left-0 top-[15%] bottom-[15%] rounded-r-sm transition-all z-0 ${isMaxPutOI ? 'bg-green-200 border-r border-green-500' : 'bg-[#e6f4ea] dark:bg-green-900/30'}`} style={{ width: `${putOiWidth}%` }}></div>
                                                        
//                                                         <div className={`absolute left-2 z-10 text-[11px] font-medium flex items-center gap-1 ${isMaxPutOI ? 'text-gray-500 opacity-100 font-bold' : 'text-green-500 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
//                                                             <span>{formatOI(putOiRaw)}</span>
//                                                             {putOiChg !== 0 && (
//                                                                 <span className={putOiChg > 0 ? "text-green-500 font-medium text-[10px]" : "text-red-500 font-medium text-[10px]"}>
//                                                                     {formatChgOI(putOiChg)}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                             )}
//                                             {/* PUT LTP */}
//                                             <td className={`py-1.5 px-2 relative ${putBg}`}>
//                                                 <div className="font-semibold text-gray-800">
//                                                     {/* 🎯 NAYA LIVE PUT DELTA YAHAN UPDATE KIYA HAI */}
//                                                     {row.PE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({peDeltaLive})</span>}
//                                                 </div>
//                                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
//                                                     <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
//                                                     <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* --- RIGHT: PRE-BUILT STRATEGIES --- */}
//                 <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">
//                     <div className="flex items-center px-4 py-2.5 border-b border-gray-200 shrink-0">
//                         <div className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2.5 -mb-2.5 mr-6 cursor-pointer">Pre Built Strategies</div>
//                         <div className="text-gray-500 hover:text-gray-700 cursor-pointer flex items-center gap-1">Rolling Straddle <span className="text-[10px]">📈</span></div>
//                     </div>
//                     <div className="px-4 py-3 flex gap-2 shrink-0">
//                         <button onClick={() => setActiveStrategyTab('Neutral')} className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Neutral' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Neutral</button>
//                         <button onClick={() => setActiveStrategyTab('Bearish')} className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bearish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Bearish</button>
//                         <button onClick={() => setActiveStrategyTab('Bullish')} className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bullish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Bullish</button>
//                     </div>
//                     <div className="px-4 py-2 flex flex-wrap items-center justify-between border-b border-gray-100 gap-2 shrink-0">
//                         <div className="flex items-center gap-2">
//                             {/* <span className="text-gray-500">Expiry</span> */}
//                             {/* 🎯 DYNAMIC EXPIRY DROPDOWN */}
//                             <div className="flex items-center gap-2 mb-4">
//                                 <span className="text-gray-500 text-sm font-medium">Expiry</span>
//                                 <select 
//                                     value={selectedExpiry}
//                                     onChange={(e) => setSelectedExpiry(e.target.value)}
//                                     className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 font-medium outline-none cursor-pointer focus:border-blue-500"
//                                 >
//                                     {availableExpiries.map((exp, index) => (
//                                         <option key={index} value={exp}>
//                                             {formatExpiryDisplay(exp)}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                         <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
//                             <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">All</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Risk Defined</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Undefined Risk</button>
//                         </div>
//                     </div>
//                     <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto custom-scrollbar flex-1 content-start">
//                         {preBuiltStrategies.map((strategy, idx) => (
//                             <div key={idx} className="border border-gray-200 rounded-md p-2 flex flex-col items-center justify-between hover:shadow-md hover:border-blue-400 transition-all cursor-pointer bg-white group">
//                                 {/* 🎯 FIX: Image ki height h-24 (96px) se ghata kar h-14 (56px) kar di, aur margin (mb-3 -> mb-1) kam kiya */}
//                                 <div className="w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 mb-2 mt-1">
//                                     <img 
//                                         src={strategy.image} 
//                                         alt={strategy.name} 
//                                         className="h-full max-w-[95%] object-contain" 
//                                     />
//                                 </div>

//                                 {/* 🎯 FIX: Text ko thoda compact (text-[11px]) aur medium font me kiya */}
//                                 <div className="text-center font-semibold text-gray-700 text-[11px] leading-tight">
//                                     {strategy.name}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SimulatorPage;




import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera, Search, Download, ChevronLeft, ChevronRight, Settings, Trash, CirclePower, TimerReset, Ban} from 'lucide-react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import shortStraddleImg from '../../assets/strategiesImage/ShortStraddle.png';
import longStraddleImg from '../../assets/strategiesImage/LongStraddle.png';

import { calculateBSPrice, normalCDF } from '../../utils/blackScholes';
import { calculateApproxBasketMargin } from '../../utils/marginCalculator';
import { calculateDTE } from '../../utils/expiryCalculator';



import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, ReferenceArea, Line } from 'recharts';


const calculateLiveDelta = (spot, strike, dte, iv, type = 'CE') => {
    if (!spot || !strike || !iv || iv <= 0) return '-';
    const t = dte === 0 ? 0.001 : dte / 365; 
    const v = iv / 100;
    
    // 🎯 NAYA UPDATE: Stockmock se 100% match karne ke liye Rate ko 0.0 kiya
    const r = 0.0; 
    
    const d1 = (Math.log(spot / strike) + (r + (v * v) / 2) * t) / (v * Math.sqrt(t));
    const delta = type === 'CE' ? normalCDF(d1) : normalCDF(d1) - 1;
    return delta.toFixed(2);
};

const formatOI = (value) => {
    if (!value || isNaN(value)) return '0';
    let num = parseFloat(value);
    if (num === 0) return '0';
    if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
};

const formatChgOI = (value) => {
    if (!value || isNaN(value) || value === 0) return '';
    const isPositive = value > 0;
    const absVal = Math.abs(value);
    let formatted = '';
    
    if (absVal >= 10000000) formatted = (absVal / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    else if (absVal >= 100000) formatted = (absVal / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    else if (absVal >= 1000) formatted = (absVal / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    else formatted = absVal.toString();

    return isPositive ? `(+${formatted})` : `(-${formatted})`;
};

// 🎯 SMART HELPER: Weekend (Sat/Sun) ko automatically Friday me convert karne ke liye
const getValidTradingDate = (inputDate = new Date()) => {
    let dateObj = new Date(inputDate);
    const day = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    
    if (day === 0) dateObj.setDate(dateObj.getDate() - 2); // Sunday hai to 2 din pichhe (Friday)
    else if (day === 6) dateObj.setDate(dateObj.getDate() - 1); // Saturday hai to 1 din pichhe (Friday)
    
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const SimulatorPage = () => {
    const [date, setDate] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [time, setTime] = useState('09:16');
    const [data, setData] = useState({ spotPrice: 0, chain: [] });
    const [sodChain, setSodChain] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeStrategyTab, setActiveStrategyTab] = useState('Neutral');

    const [isAddonsOpen, setIsAddonsOpen] = useState(false);
    const [addons, setAddons] = useState({
        delta: true,      
        iv: true, // Auto check for IV testing
        oi: true, 
        showAllOi: false,
        atm: false 
    });

    const tableContainerRef = useRef(null);
    const atmRowRef = useRef(null);
    const fallbackAttempts = useRef(0);
    const forceNearestRef = useRef(false);

    const expiryScrollRef = useRef(null);


    const [expiryDates, setExpiryDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 🎯 SMART TRADER: Expiry manage karne ke liye naye states
    const [availableExpiries, setAvailableExpiries] = useState([]);
    const [selectedExpiry, setSelectedExpiry] = useState("");

    // 🎯 SMART UI: Expiry Slider ke states
    const [expiryStartIndex, setExpiryStartIndex] = useState(0);
    const [visibleExpiriesCount, setVisibleExpiriesCount] = useState(5); // Default for desktop


    const [positions, setPositions] = useState([]);
    const [lotSize, setLotSize] = useState(65); 
    const [openPositionDropdown, setOpenPositionDropdown] = useState(null);


    // 🎯 NAYA: Mouse se drag (swipe) scroll karne ke states
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);


    // 🎯 NAYA: Arrow buttons ko hide/show karne ke states
    const [showLeftArrow, setShowLeftArrow] = useState(false); // Shuru me left arrow hide rahega
    const [showRightArrow, setShowRightArrow] = useState(true);


    // 🎯 NAYA: Quant Engine Modal & Settings States
    const [isQuantModalOpen, setIsQuantModalOpen] = useState(false);
    const [quantSettings, setQuantSettings] = useState({
        selectionBase: 'MULTI_LEG',
        legsConfiguration: [],
        ensureNetCredit: true,     // 🎯 NAYA: Credit Seeker on/off
        minSpreadWidth: 300,       // 🎯 NAYA: Minimum gap (Plan B trigger)
        premiumMin: 300,
        slMin: 0.9, slMax: 1.3,
        tpMin: 2.1, tpMax: 2.5,
        eodExitTime: "15:20",
        eodThreshold: -0.5
    });

    // Screen size ke hisab se visible dates set karna
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setVisibleExpiriesCount(3); // Mobile
            } else {
                setVisibleExpiriesCount(5); // Desktop
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Jab nayi list aaye, toh index reset kar do
    useEffect(() => {
        setExpiryStartIndex(0);
    }, [availableExpiries]);

    const handlePrevExpiries = () => {
        if (expiryStartIndex > 0) {
            setExpiryStartIndex(prev => prev - 1);
        }
    };

    const handleNextExpiries = () => {
        if (expiryStartIndex + visibleExpiriesCount < availableExpiries.length) {
            setExpiryStartIndex(prev => prev + 1);
        }
    };

    const fetchMonthExpiries = async (dateObj, symbol = 'NIFTY') => {
        try {
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // JS me month 0 se shuru hota hai
            
            const API_BASE_URL = window.location.hostname === 'localhost' 
                ? 'http://localhost:5500' 
                : 'http://65.0.164.229:5500';

            const res = await axios.get(`${API_BASE_URL}/api/simulator/expiries?year=${year}&month=${month}&symbol=${symbol}`);
            if (res.data.success) {
                setExpiryDates(res.data.expiries);
            }
        } catch (error) {
            console.error("Error fetching expiries:", error);
        }
    };
    

    useEffect(() => {
        fetchMonthExpiries(currentMonth);
    }, [currentMonth]);


    const fetchSimulatorData = async (selectedTime, currentExpiry = selectedExpiry) => {
        setLoading(true);
        try {
            const API_BASE_URL = window.location.hostname === 'localhost' 
                ? 'http://localhost:5500' 
                : 'http://65.0.164.229:5500';

            const res = await axios.get(`${API_BASE_URL}/api/simulator/data`, {
                params: { date: date, time: selectedTime, expiry: currentExpiry }
            });
            
            if (res.data.success) {
                // 🎯 FIX 1: Expiry Checking Logic KO UPAR LAYA GAYA 
                let correctExpiry = currentExpiry;

                if (res.data.availableExpiries && res.data.availableExpiries.length > 0) {
                    setAvailableExpiries(res.data.availableExpiries);
                    
                    const isCurrentInvalid = !currentExpiry || !res.data.availableExpiries.includes(currentExpiry);
                    const shouldForceNearest = forceNearestRef.current;
                    
                    const currentSimDate = new Date(date); 
                    currentSimDate.setHours(0,0,0,0);
                    
                    const currentExpDateObj = new Date(currentExpiry || 0);
                    currentExpDateObj.setHours(0,0,0,0);

                    // Pehli valid expiry dhundho jo aaj ya aaj ke baad ki ho
                    let nearestExp = res.data.availableExpiries[0] || ""; 
                    for (let i = 0; i < res.data.availableExpiries.length; i++) {
                        const expDateObj = new Date(res.data.availableExpiries[i]);
                        expDateObj.setHours(0,0,0,0);
                        if (expDateObj.getTime() >= currentSimDate.getTime()) {
                            nearestExp = res.data.availableExpiries[i];
                            break; 
                        }
                    }

                    // Agar Expiry purani ho chuki hai (Past Date) YA user ne date jump kiya hai
                    if (shouldForceNearest || isCurrentInvalid || currentExpDateObj.getTime() < currentSimDate.getTime()) {
                        correctExpiry = nearestExp;
                        setSelectedExpiry(nearestExp);
                        forceNearestRef.current = false;
                        
                        // Expiry fix karne ke baad naya data manga lo, aage ka fallback skip kar do
                        if (nearestExp !== currentExpiry) {
                            fetchSimulatorData(selectedTime, nearestExp); 
                            return; 
                        }
                    }
                }



                // 🎯 FIX 2: Auto-Fallback aab Expiry fix hone ke BAAD chalega
                // Agar Expiry bilkul sahi hai, phir bhi chain empty hai (Yani Market Holiday hai) tabhi din pichhe jayega
                if (res.data.chain.length === 0 && fallbackAttempts.current < 10) {
                    console.log(`No data found for ${date}. Auto-shifting to previous day...`);
                    fallbackAttempts.current += 1;
                    
                    let prevDate = new Date(date);
                    prevDate.setDate(prevDate.getDate() - 1);
                    
                    if (prevDate.getDay() === 0) prevDate.setDate(prevDate.getDate() - 2); // Sunday -> Friday
                    if (prevDate.getDay() === 6) prevDate.setDate(prevDate.getDate() - 1); // Saturday -> Friday
                    
                    const yyyy = prevDate.getFullYear();
                    const mm = String(prevDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(prevDate.getDate()).padStart(2, '0');
                    
                    setDate(`${yyyy}-${mm}-${dd}`); 
                    return; 
                }

                fallbackAttempts.current = 0;

                setData({
                    spotPrice: res.data.spotPrice,
                    chain: res.data.chain,
                    dte: res.data.dte
                });
            }
        } catch (error) {
            console.error("Error fetching simulator data:", error);
        }
        setLoading(false);
    };

// 🎯 NAYA: Har naye din ya expiry par SOD (Start of Day) ka reference data lana
const fetchSodData = async (currentDate, currentExpiry) => {
    if (!currentDate || !currentExpiry) return;
    try {
        const API_BASE_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:5500' 
            : 'http://65.0.164.229:5500';

        // Pehle 09:15 AM ka data mang kar dekho
        let res = await axios.get(`${API_BASE_URL}/api/simulator/data`, {
            params: { date: currentDate, time: '09:15', expiry: currentExpiry }
        });
        
        // 🎯 FIX: Agar 09:15 par market ka data empty hai, toh 09:16 ka data try karo
        if (res.data.success && res.data.chain.length === 0) {
            res = await axios.get(`${API_BASE_URL}/api/simulator/data`, {
                params: { date: currentDate, time: '09:26', expiry: currentExpiry }
            });
        }

        if (res.data.success) {
            setSodChain(res.data.chain);
        }
    } catch (error) {
        console.error("Error fetching SOD data:", error);
    }
};

useEffect(() => {
    if (date && selectedExpiry) {
        fetchSodData(date, selectedExpiry);
    }
}, [date, selectedExpiry]);

    useEffect(() => {
        fetchSimulatorData(time);
    }, [time, date]);

    useEffect(() => {
        if (atmRowRef.current && tableContainerRef.current) {
            const container = tableContainerRef.current;
            const row = atmRowRef.current;

            const containerRect = container.getBoundingClientRect();
            const rowRect = row.getBoundingClientRect();

            const isVisible = (rowRect.top >= containerRect.top) && (rowRect.bottom <= containerRect.bottom);

            if (!isVisible) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [data.chain]);

    const handleDayChange = (daysToAdd) => {
        let currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + daysToAdd);
        
        // Skip Weekends (0 = Sunday, 6 = Saturday)
        if (currentDate.getDay() === 6) { 
            currentDate.setDate(currentDate.getDate() + (daysToAdd > 0 ? 2 : -1));
        } else if (currentDate.getDay() === 0) { 
            currentDate.setDate(currentDate.getDate() + (daysToAdd > 0 ? 1 : -2));
        }

        // Format manually to YYYY-MM-DD
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(currentDate.getDate()).padStart(2, '0');
        
        setDate(`${yyyy}-${mm}-${dd}`);
        setTime('09:15'); // Reset time to SOD
    };

    // 🎯 UPDATED: Advanced Time Handling (Auto Rollover to Next Day)
    const handleTimeChange = (minutesToAdd) => {
        const [hours, minutes] = time.split(':').map(Number);
        let newDateObj = new Date();
        newDateObj.setHours(hours, minutes + minutesToAdd, 0, 0);

        let newHours = newDateObj.getHours();
        let newMins = newDateObj.getMinutes();

        // If time crosses 15:30 -> Go to NEXT day 09:15
        if (newHours > 15 || (newHours === 15 && newMins > 30)) {
            handleDayChange(1);
            return;
        } 
        // If time goes behind 09:15 -> Go to PREVIOUS day 15:30
        else if (newHours < 9 || (newHours === 9 && newMins < 15)) {
            let prevDate = new Date(date);
            prevDate.setDate(prevDate.getDate() - 1);
            
            if (prevDate.getDay() === 0) prevDate.setDate(prevDate.getDate() - 2); // Skip Sunday
            if (prevDate.getDay() === 6) prevDate.setDate(prevDate.getDate() - 1); // Skip Saturday
            
            const yyyy = prevDate.getFullYear();
            const mm = String(prevDate.getMonth() + 1).padStart(2, '0');
            const dd = String(prevDate.getDate()).padStart(2, '0');
            
            setDate(`${yyyy}-${mm}-${dd}`);
            setTime('15:30');
            return;
        }

        const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
        setTime(formattedTime);
    };

    // 🎯 NEW: Manual Dropdown Time Handling (with Market Hours Safety)
    const handleManualTimeChange = (type, value) => {
        let [hours, minutes] = time.split(':').map(Number);
        
        if (type === 'hour') hours = Number(value);
        if (type === 'minute') minutes = Number(value);

        // Smart Safety: Constraint to Indian Market Hours (09:15 to 15:30)
        if (hours === 9 && minutes < 15) minutes = 15;
        if (hours === 15 && minutes > 30) minutes = 30;

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        setTime(formattedTime);
    };

    const getAtmStrike = () => {
        if (!data.spotPrice || data.chain.length === 0) return null;
        return data.chain.reduce((prev, curr) => 
            Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
        ).strike;
    };

    // 🎯 SMART FILTER: Sirf Monday (1) se Friday (5) tak enable rakhega, Sat(6) aur Sun(0) ko disable karega
    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6; 
    };


    // 🎯 SMART HIGHLIGHTER: Backend se aayi dates ko match karega
    const highlightExpiry = (renderDate) => {
        const yyyy = renderDate.getFullYear();
        const mm = String(renderDate.getMonth() + 1).padStart(2, '0');
        const dd = String(renderDate.getDate()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd}`;

        if (expiryDates.includes(dateString)) {
            // Agar calendar ka render ho raha din, user ke selected 'date' state ke barabar hai
            if (dateString === date) {
                return "!text-white font-bold"; // 🎯 Selected din par safed text
            } else {
                return "!text-blue-600 font-bold"; // 🎯 Baki expiry din par blue text
            }
        }
        return "";
    };

    const atmStrike = getAtmStrike();

    let maxOverallOI = 1;
    let maxCallOI = 0;
    let maxPutOI = 0;

    // 🎯 NAYA LOGIC: Header Stats ke liye variables
    let totalCallOI = 0;
    let totalPutOI = 0;
    let totalCallOiChg = 0;
    let totalPutOiChg = 0;

    data.chain.forEach(row => {
        const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
        const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
        
        // Max OI calculation (Tumhara purana logic jo zaroori hai)
        if (ceOI > maxCallOI) maxCallOI = ceOI;
        if (peOI > maxPutOI) maxPutOI = peOI;
        if (ceOI > maxOverallOI) maxOverallOI = ceOI;
        if (peOI > maxOverallOI) maxOverallOI = peOI;

        // 🎯 Header Totals Calculation (Naya logic)
        totalCallOI += ceOI;
        totalPutOI += peOI;

        // SOD (09:15) data nikal kar Change in OI ka Total karna
        const sodRow = sodChain.find(s => Number(s.strike) === Number(row.strike)) || {};
        const sodCallOi = sodRow.CE?.oi ? parseFloat(sodRow.CE.oi) : ceOI;
        const sodPutOi = sodRow.PE?.oi ? parseFloat(sodRow.PE.oi) : peOI;

        totalCallOiChg += (ceOI - sodCallOi);
        totalPutOiChg += (peOI - sodPutOi);
    });


    // 🎯 MAX PAIN CALCULATION LOGIC
    let maxPainStrike = 0;
    let minTotalLoss = Infinity;

    // Har strike ko as a "Potential Expiry" test karenge
    data.chain.forEach(expiryRow => {
        const assumedExpiry = expiryRow.strike;
        let totalLossAtThisStrike = 0;

        // Is assumed expiry par baki sabhi strikes ka loss calculate karna
        data.chain.forEach(row => {
            const strike = row.strike;
            const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
            const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;

            // Call sellers tab loss karte hain jab market upar band ho
            if (assumedExpiry > strike) {
                totalLossAtThisStrike += (assumedExpiry - strike) * ceOI;
            }
            
            // Put sellers tab loss karte hain jab market niche band ho
            if (assumedExpiry < strike) {
                totalLossAtThisStrike += (strike - assumedExpiry) * peOI;
            }
        });

        // Agar is strike par loss sabse kam hai, toh yehi Max Pain banega
        if (totalLossAtThisStrike < minTotalLoss) {
            minTotalLoss = totalLossAtThisStrike;
            maxPainStrike = assumedExpiry;
        }
    });

    // 🎯 PCR (Put-Call Ratio) Calculation
    const pcr = totalCallOI > 0 ? (totalPutOI / totalCallOI).toFixed(2) : "0.00";

    // 🎯 NAYA LOGIC: Header Bars ki Width Calculation (Max OI ko 50% width assign karna hai)
    const maxHeaderOI = Math.max(totalCallOI, totalPutOI) || 1;
    const callHeaderBarWidth = (totalCallOI / maxHeaderOI) * 50; // Center se Left ki taraf jayega
    const putHeaderBarWidth = (totalPutOI / maxHeaderOI) * 50;   // Center se Right ki taraf jayega


    // 🎯 ATM IV & STRADDLE PREM CALCULATION
    let headerAtmIV = "-";
    let headerStraddlePrem = "-";

    if (atmStrike && data.chain.length > 0) {
        const atmRow = data.chain.find(row => row.strike === atmStrike);
        
        if (atmRow) {
            // Straddle Premium = ATM Call LTP + ATM Put LTP
            const ceLtp = atmRow.CE?.ltp ? parseFloat(atmRow.CE.ltp) : 0;
            const peLtp = atmRow.PE?.ltp ? parseFloat(atmRow.PE.ltp) : 0;
            if (ceLtp || peLtp) {
                headerStraddlePrem = (ceLtp + peLtp).toFixed(1);
            }

            // ATM IV = Average of ATM Call IV & ATM Put IV
            const ceIV = atmRow.CE?.iv ? parseFloat(atmRow.CE.iv) : 0;
            const peIV = atmRow.PE?.iv ? parseFloat(atmRow.PE.iv) : 0;
            
            if (ceIV > 0 && peIV > 0) {
                headerAtmIV = ((ceIV + peIV) / 2).toFixed(1);
            } else if (ceIV > 0) {
                headerAtmIV = ceIV.toFixed(1);
            } else if (peIV > 0) {
                headerAtmIV = peIV.toFixed(1);
            }
        }
    }

    // 🎯 HELPER: '2026-08-18' ko '18 AUG 2026' me badalne ke liye
    const formatExpiryDisplay = (dateString) => {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = dateObj.getFullYear();
        return `${day} ${month} ${year}`; 
    };

    // 🎯 HELPER 2: Option Chain Header ke liye (e.g., "18 AUG '26")
    const formatHeaderDate = (dateString) => {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = dateObj.getFullYear().toString().slice(-2); // Sirf last 2 digit ('26')
        return `${day} ${month} '${year}`; 
    };

    // 🎯 HELPER 3: Har tab ke liye alag DTE aur Label (CW/NW/CM/NM) nikalne ke liye
    const getTabDteInfo = (simDateStr, expDateStr, index, allExpiries) => {
        if (!simDateStr || !expDateStr || !allExpiries) return null;
        
        const simDate = new Date(simDateStr);
        const expDate = new Date(expDateStr);
        const diffDays = Math.ceil((expDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let label = null;

        if (index === 0) {
            label = 'CW'; // Pehli expiry hamesha Current Week
        } else if (index === 1) {
            label = 'NW'; // Dusri hamesha Next Week
        } else {
            // Check karna ki kya ye us mahine ki aakhri expiry hai?
            const currentExpMonth = expDate.getMonth();
            const nextExpStr = allExpiries[index + 1];
            const isLastOfMonth = !nextExpStr || new Date(nextExpStr).getMonth() !== currentExpMonth;

            if (isLastOfMonth) {
                const cwMonth = new Date(allExpiries[0]).getMonth();
                
                if (currentExpMonth === cwMonth) {
                    label = 'CM'; // Current Month ki aakhri expiry
                } else {
                    // Next Month ki aakhri expiry dhundhne ke liye
                    const nextMonthExpiries = allExpiries.filter(d => new Date(d).getMonth() !== cwMonth);
                    if (nextMonthExpiries.length > 0) {
                        const nmMonth = new Date(nextMonthExpiries[0]).getMonth();
                        if (currentExpMonth === nmMonth) {
                            label = 'NM'; // Next Month ki aakhri expiry
                        }
                    }
                }
            }
        }

        if (label) {
            return { dte: diffDays, label };
        }
        return null; // Baki sabhi expiries ke liye hide kar do
    };

    const preBuiltStrategies = [
        { name: "Short Straddle", type: "Neutral", image: shortStraddleImg },
        { name: "Long Straddle", type: "Neutral", image: longStraddleImg },
        { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
        { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
        { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
        { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
    ];


    // 🎯 SMART TRADER: Position Handle Logic
    const handleActionClick = (strike, optType, side, ltp) => {
        if (!ltp || ltp === '-') return;

        setPositions((prev) => {
            // 🎯 FIX: Yahan 'side' ko bhi match karne ke liye add kiya hai
            const existingPosIndex = prev.findIndex(p => 
                p.strike === strike && 
                p.type === optType && 
                p.expiry === selectedExpiry && 
                p.side === side
            );
            
            if (existingPosIndex >= 0) {
                const newPos = [...prev];
                const currentPos = newPos[existingPosIndex];
                
                // Kyunki ab Buy aur Sell alag-alag track ho rahe hain, hum seedha Lots badhayenge
                newPos[existingPosIndex] = { ...currentPos, lots: currentPos.lots + 1 };
                return newPos;
            }

            // Nayi position add karo (ID me 'side' bhi jod diya hai taki clash na ho)
            return [...prev, {
                id: `${strike}_${optType}_${selectedExpiry}_${side}`,
                strike: strike,
                type: optType,
                side: side,
                expiry: selectedExpiry,
                lots: 1,
                entryPrice: parseFloat(ltp)
            }];
        });
    };

    const removePosition = (id) => {
        setPositions(prev => prev.filter(p => p.id !== id));
    };

    // 🎯 Helper: Live P&L aur current LTP calculate karne ke liye
    const getLivePositionLTP = (pos) => {
        const row = data.chain.find(r => r.strike === pos.strike);
        if (!row) return pos.entryPrice;
        const ltp = pos.type === 'CE' ? row.CE?.ltp : row.PE?.ltp;
        return ltp ? parseFloat(ltp) : pos.entryPrice;
    };


    // 🎯 PAYOFF CHART DATA GENERATOR
    const generatePayoffData = () => {
        const spot = data.spotPrice || 24000;
        if (!positions || positions.length === 0) return { chartData: [], maxPnl: 0, minPnl: 0 };
        
        let maxDistanceFromSpot = 0;
        positions.forEach(pos => {
            const dist = Math.abs(pos.strike - spot);
            if (dist > maxDistanceFromSpot) maxDistanceFromSpot = dist;
        });
        
        if (maxDistanceFromSpot === 0) maxDistanceFromSpot = 1000; 
        const buffer = 500; 

        const startPoint = Math.floor(spot - maxDistanceFromSpot - buffer);
        const endPoint = Math.ceil(spot + maxDistanceFromSpot + buffer);
        const step = Math.max(1, Math.floor((endPoint - startPoint) / 100)); 
        
        let chartData = [];
        let maxPnl = -Infinity;
        let minPnl = Infinity;

        const riskFreeRate = 0.10; 
        const today = new Date();

        // 🎯 MAIN LOOP: 'i' yahan se shuru hota hai (Spot Prices ki range)
        for (let i = startPoint; i <= endPoint; i += step) {
            let pnl = 0;       
            let tZeroPnl = 0;  

            // INNER LOOP: Har position ko is 'i' (spot price) par test karna
            positions.forEach(pos => {
                const qty = pos.lots * lotSize;
                const isCall = pos.type.toUpperCase().includes('CE') || pos.type.toUpperCase().includes('CALL');
                
                // 1. EXPIRY P&L
                let intrinsicValue = isCall ? Math.max(0, i - pos.strike) : Math.max(0, pos.strike - i);
                
                // 2. T+0 P&L (Black-Scholes Math)
                const dte = calculateDTE(today, pos.expiry); 
                const timeInYears = dte / 365;
                const iv = (pos.iv || 15) / 100; 
                
                const bsType = isCall ? 'call' : 'put';
                const targetBSPrice = calculateBSPrice(i, pos.strike, timeInYears, iv, riskFreeRate, bsType);

                if (pos.side === 'B') {
                    pnl += (intrinsicValue - pos.entryPrice) * qty;
                    tZeroPnl += (targetBSPrice - pos.entryPrice) * qty;
                } else { 
                    pnl += (pos.entryPrice - intrinsicValue) * qty;
                    tZeroPnl += (pos.entryPrice - targetBSPrice) * qty;
                }
            });

            // Loop ke andar hi data chart me push karna hai
            chartData.push({ spot: i, pnl: pnl, tZeroPnl: tZeroPnl });
            if (pnl > maxPnl) maxPnl = pnl;
            if (pnl < minPnl) minPnl = pnl;
        }
        
        return { chartData, maxPnl, minPnl };
    };

    const { chartData, maxPnl, minPnl } = generatePayoffData();

    // 🎯 NAYA LOGIC: X-Axis par 500 ke gap (interval) ke liye Ticks nikalna
    const xAxisTicks = [];
    if (chartData.length > 0) {
        const minSpot = chartData[0].spot;
        const maxSpot = chartData[chartData.length - 1].spot;
        
        // 500 ke multiple me round figures set karna (Jaise 23500, 24000, 24500)
        const startTick = Math.ceil(minSpot / 500) * 500;
        const endTick = Math.floor(maxSpot / 500) * 500;

        for (let i = startTick; i <= endTick; i += 500) {
            xAxisTicks.push(i);
        }
    }

    // 🎯 NEW: DYNAMIC STATS CALCULATION LOGIC
    const calculateStrategyStats = () => {
        if (!positions || positions.length === 0 || chartData.length === 0) {
            return {
                estMargin: 0, pnl: 0, pnlPercent: 0, maxProfit: 0, isMaxProfitInfinite: false,
                maxLoss: 0, isMaxLossInfinite: false, netCredit: 0, breakevens: [], pop: 0, rr: "NA"
            };
        }

        const spot = data.spotPrice || 24000;
        let currentPnl = 0;
        let netPremium = 0;
        let totalInvestment = 0;

        // 🎯 FIX 1: Strict Number Casting to prevent NaN in Margin Calculator
        const formattedPositions = positions.map(p => ({
            ...p,
            action: p.side === 'B' ? 'BUY' : 'SELL',
            type: p.type.toUpperCase().includes('CE') ? 'CE' : 'PE',
            strike: Number(p.strike),
            lots: Number(p.lots),
            lotSize: Number(lotSize)
        }));

        const estMargin = calculateApproxBasketMargin(formattedPositions, "NIFTY 50", false);

        positions.forEach(pos => {
            const currentLTP = getLivePositionLTP(pos); 
            const qty = Number(pos.lots) * Number(lotSize);
            const entry = Number(pos.entryPrice);
            
            if (pos.side === 'B') {
                currentPnl += (currentLTP - entry) * qty;
                netPremium -= entry * qty; 
                totalInvestment += entry * qty;
            } else {
                currentPnl += (entry - currentLTP) * qty;
                netPremium += entry * qty; 
                totalInvestment += 100000 * Number(pos.lots); 
            }
        });

        const pnlPercent = totalInvestment > 0 ? ((currentPnl / totalInvestment) * 100).toFixed(1) : 0;

        let isMaxProfitInfinite = false;
        let isMaxLossInfinite = false;
        const firstPoint = chartData[0].pnl;
        const secondPoint = chartData[1]?.pnl;
        const lastPoint = chartData[chartData.length - 1].pnl;
        const secondLastPoint = chartData[chartData.length - 2]?.pnl;

        if ((maxPnl === firstPoint && firstPoint > secondPoint) || (maxPnl === lastPoint && lastPoint > secondLastPoint)) {
            isMaxProfitInfinite = true;
        }
        if ((minPnl === firstPoint && firstPoint < secondPoint) || (minPnl === lastPoint && lastPoint < secondLastPoint)) {
            isMaxLossInfinite = true;
        }

        let breakevens = [];
        for (let i = 1; i < chartData.length; i++) {
            if ((chartData[i-1].pnl <= 0 && chartData[i].pnl > 0) || (chartData[i-1].pnl >= 0 && chartData[i].pnl < 0)) {
                const spot1 = chartData[i-1].spot, pnl1 = chartData[i-1].pnl;
                const spot2 = chartData[i].spot, pnl2 = chartData[i].pnl;
                const exactSpot = spot1 - pnl1 * ((spot2 - spot1) / (pnl2 - pnl1));
                breakevens.push(exactSpot);
            }
        }

        // 🎯 FIX 2: Advanced POP Logic for Multiple Breakevens
        let exactPop = 50; 
        if (breakevens.length > 0) {
            const dte = calculateDTE(new Date(), positions[0]?.expiry) / 365;
            const avgIv = positions.reduce((acc, p) => acc + Number(p.iv || 15), 0) / positions.length / 100;
            
            // Helper: Target price ke upar market expire hone ki probability
            const getProbAbove = (target) => {
                if (dte <= 0 || avgIv <= 0) return spot > target ? 100 : 0;
                const d2 = (Math.log(spot / target) + (0.10 - (avgIv * avgIv) / 2) * dte) / (avgIv * Math.sqrt(dte));
                return normalCDF(d2) * 100;
            };

            if (breakevens.length === 1) {
                // Directional Trade (1 Breakeven)
                const probAbove = getProbAbove(breakevens[0]);
                const isBullish = chartData[chartData.length - 1].pnl > 0;
                exactPop = isBullish ? probAbove : (100 - probAbove);
            } else if (breakevens.length >= 2) {
                // Range Trade (Butterfly, Condor, Strangle - 2 Breakevens)
                const be1 = Math.min(breakevens[0], breakevens[1]);
                const be2 = Math.max(breakevens[0], breakevens[1]);
                
                // Dono ke beech me rahne ki probability (Prob > BE1) - (Prob > BE2)
                const probBetween = Math.abs(getProbAbove(be1) - getProbAbove(be2));
                
                // Check karna ki profit dono lines ke andar hai ya bahar
                const midPoint = (be1 + be2) / 2;
                const isProfitableInside = chartData.reduce((prev, curr) => 
                    Math.abs(curr.spot - midPoint) < Math.abs(prev.spot - midPoint) ? curr : prev
                ).pnl > 0;

                exactPop = isProfitableInside ? probBetween : (100 - probBetween);
            }
        }

        let rr = "NA";
        if (!isMaxProfitInfinite && !isMaxLossInfinite && minPnl < 0 && maxPnl > 0) {
            // Stockmock Format: Risk (1) : Reward (x)
            rr = "1 : " + (maxPnl / Math.abs(minPnl)).toFixed(2);
        } else if (isMaxProfitInfinite && minPnl < 0) {
            rr = "Infinite";
        } else if (minPnl >= 0) {
            rr = "No Risk";
        }

        return {
            estMargin,
            pnl: currentPnl,
            pnlPercent,
            maxProfit: maxPnl,
            isMaxProfitInfinite,
            maxLoss: minPnl,
            isMaxLossInfinite,
            netCredit: netPremium,
            breakevens,
            pop: exactPop.toFixed(2),
            rr
        };
    };

    const stats = calculateStrategyStats();
    const spotPrice = data.spotPrice || 24000;

    // 🎯 ZOOM LOGIC STATES
    const [refAreaLeft, setRefAreaLeft] = useState(null);
    const [refAreaRight, setRefAreaRight] = useState(null);
    const [xDomain, setXDomain] = useState(['dataMin', 'dataMax']);

    const handleZoom = () => {
        if (refAreaLeft === refAreaRight || refAreaLeft === null || refAreaRight === null) {
            setRefAreaLeft(null);
            setRefAreaRight(null);
            return;
        }

        // Left aur Right bounds ko set karna
        let left = refAreaLeft;
        let right = refAreaRight;

        if (left > right) [left, right] = [right, left];

        setXDomain([left, right]);
        setRefAreaLeft(null);
        setRefAreaRight(null);
    };

    const resetZoom = () => {
        setXDomain(['dataMin', 'dataMax']);
    };

    // 🎯 GREEN/RED GRADIENT OFFSET LOGIC (0 ke upar Green, 0 ke niche Red)
    const gradientOffset = () => {
        if (maxPnl <= 0) return 0;
        if (minPnl >= 0) return 1;
        return maxPnl / (maxPnl - minPnl);
    };
    const off = gradientOffset();

    // 🎯 FIX: Strike price ko + ya - karne ka function
    const handleStrikeChange = (index, changeValue) => {
        const updatedPositions = [...positions];
        // 50 points ka gap (Nifty ke liye), agar BankNifty ho to isko 100 kar sakte hain
        updatedPositions[index].strike += changeValue;
        setPositions(updatedPositions);
    };

    // 🎯 FIX: Square Off aur Reset logic
    const handleSquareOffToggle = (index, currentLTP) => {
        const updatedPositions = [...positions];
        const pos = updatedPositions[index];
        
        // 🎯 FIX: 'hour:minute' ko hatakar aapka asli state variable 'time' laga diya
        const currentTimeStr = time; 

        if (!pos.isSquaredOff) {
            pos.isSquaredOff = true;
            pos.exitPrice = currentLTP;
            pos.squaredOffTime = currentTimeStr; 
        } else if (pos.squaredOffTime === currentTimeStr) {
            pos.isSquaredOff = false;
            delete pos.exitPrice;
            delete pos.squaredOffTime;
        }
        
        setPositions(updatedPositions);
    };

    // 🎯 FIX: Lot size ko + ya - karne ka function
    const handleLotChange = (index, changeValue) => {
        const updatedPositions = [...positions];
        const newLots = updatedPositions[index].lots + changeValue;
        
        // Lot hamesha 1 ya usse zyada hona chahiye
        if (newLots >= 1) {
            updatedPositions[index].lots = newLots;
            setPositions(updatedPositions);
        }
    };

    
    // 🎯 STOCKMOCK ADVANCED LIQUIDITY & FREAK TRADE FILTER (Center-Out Approach)
    const LOW_OI_THRESHOLD = 50; 
    
    // 1. Sabse pehle ATM Strike ka Index dhundho
    // const spotPrice = data.spotPrice || 24000;
    let atmIndex = -1;
    let minDiff = Infinity;
    
    data.chain.forEach((row, idx) => {
        const diff = Math.abs(row.strike - spotPrice);
        if (diff < minDiff) {
            minDiff = diff;
            atmIndex = idx;
        }
    });

    // 2. Strike ke beech ka gap nikalo (Jaise Nifty me 50 hota hai)
    const strikeDiff = data.chain.length > 1 ? Math.abs(data.chain[1].strike - data.chain[0].strike) : 50;

    // 3. Pehle sabhi rows ko default values de do
    let processedOptionChain = data.chain.map(row => ({
        ...row,
        isCeFreak: false,
        isPeFreak: false,
        isCeFaded: false,
        isPeFaded: false
    }));

    if (atmIndex !== -1) {
        let atmCeLtp = processedOptionChain[atmIndex].CE?.ltp ? parseFloat(processedOptionChain[atmIndex].CE.ltp) : Math.max(0, spotPrice - processedOptionChain[atmIndex].strike) || 10;
        let atmPeLtp = processedOptionChain[atmIndex].PE?.ltp ? parseFloat(processedOptionChain[atmIndex].PE.ltp) : Math.max(0, processedOptionChain[atmIndex].strike - spotPrice) || 10;

        // 🎯 NAYA FIX: ATM row (Center) ke liye bhi OI check karke fade logic apply karein
        const atmCeOI = processedOptionChain[atmIndex].CE?.oi ? parseFloat(processedOptionChain[atmIndex].CE.oi) : 0;
        const atmPeOI = processedOptionChain[atmIndex].PE?.oi ? parseFloat(processedOptionChain[atmIndex].PE.oi) : 0;
        
        processedOptionChain[atmIndex].isCeFaded = atmCeOI < LOW_OI_THRESHOLD;
        processedOptionChain[atmIndex].isPeFaded = atmPeOI < LOW_OI_THRESHOLD;

        // 🚀 STEP A: ATM se OTM ki taraf (Niche jana - Higher Strikes)
        let lastValidCE = atmCeLtp;
        let lastValidPE = atmPeLtp;
        let lastValidPEStrike = processedOptionChain[atmIndex].strike;

        for (let i = atmIndex + 1; i < processedOptionChain.length; i++) {
            const row = processedOptionChain[i];
            const ceLTP = row.CE?.ltp ? parseFloat(row.CE.ltp) : 0;
            const peLTP = row.PE?.ltp ? parseFloat(row.PE.ltp) : 0;
            const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
            const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;

            // Call OTM Check: Price strictly ghatna chahiye
            if (ceLTP > lastValidCE) {
                row.isCeFreak = true; 
            } else if (ceLTP > 0) {
                lastValidCE = ceLTP; 
            }

            // Put ITM Check: Price badhna chahiye, par strike diff (x1.5 buffer) se zyada nahi
            const peGap = row.strike - lastValidPEStrike;
            const maxPeIncrease = peGap * 1.5;
            if (peLTP < lastValidPE || peLTP > lastValidPE + maxPeIncrease) {
                row.isPeFreak = true;
            } else if (peLTP > 0) {
                lastValidPE = peLTP;
                lastValidPEStrike = row.strike;
            }

            row.isCeFaded = ceOI < LOW_OI_THRESHOLD && !row.isCeFreak;
            row.isPeFaded = peOI < LOW_OI_THRESHOLD && !row.isPeFreak;
        }

        // 🚀 STEP B: ATM se ITM ki taraf (Upar jana - Lower Strikes)
        lastValidCE = atmCeLtp;
        lastValidPE = atmPeLtp;
        let lastValidCEStrike = processedOptionChain[atmIndex].strike;

        for (let i = atmIndex - 1; i >= 0; i--) {
            const row = processedOptionChain[i];
            const ceLTP = row.CE?.ltp ? parseFloat(row.CE.ltp) : 0;
            const peLTP = row.PE?.ltp ? parseFloat(row.PE.ltp) : 0;
            const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
            const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;

            // Call ITM Check: Price badhna chahiye, par strike diff se bahut zyada nahi
            const ceGap = lastValidCEStrike - row.strike;
            const maxCeIncrease = ceGap * 1.5;
            
            // 🎯 Yehi fix karega aapke 22750 CE (678.6) wale Freak High issue ko!
            if (ceLTP < lastValidCE || ceLTP > lastValidCE + maxCeIncrease) {
                row.isCeFreak = true;
            } else if (ceLTP > 0) {
                lastValidCE = ceLTP;
                lastValidCEStrike = row.strike;
            }

            // Put OTM Check: Price strictly ghatna chahiye
            if (peLTP > lastValidPE) {
                row.isPeFreak = true;
            } else if (peLTP > 0) {
                lastValidPE = peLTP;
            }

            row.isCeFaded = ceOI < LOW_OI_THRESHOLD && !row.isCeFreak;
            row.isPeFaded = peOI < LOW_OI_THRESHOLD && !row.isPeFreak;
        }
    }


    // 🎯 NAYA: Drag-to-Scroll logic
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - expiryScrollRef.current.offsetLeft);
        setScrollLeft(expiryScrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - expiryScrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // 2 ka matlab hai thoda fast scroll hoga
        expiryScrollRef.current.scrollLeft = scrollLeft - walk;
    };
    

    // 🎯 NAYA: Check karega ki scroll kahan tak pahuncha hai
    const handleScroll = () => {
        if (expiryScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = expiryScrollRef.current;
            
            // Agar scrollLeft 0 se bada hai to Left Arrow dikhao
            setShowLeftArrow(scrollLeft > 0);
            
            // Agar scroll aur screen width milakar total width se kam hai, to Right Arrow dikhao
            // Math.ceil isliye lagaya taaki browser rounding issues na aayein
            setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    // 🎯 NAYA: Dropdown se Expiry badalne par Auto-Scroll karne ka logic
    useEffect(() => {
        if (selectedExpiry && expiryScrollRef.current) {
            const activeTab = document.getElementById(`expiry-tab-${selectedExpiry}`);
            if (activeTab) {
                // Smooth tarike se tab ko center me scroll kar dega
                activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [selectedExpiry]);

    // 🎯 NAYA: Jab naya data aaye ya window resize ho, tab arrows ko update karo
    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, [availableExpiries]);


    // 🧠 THE MAGIC OBSERVER: User ke trades ko padhna aur pattern nikalna
    const analyzeUserPattern = () => {
    if (!positions || positions.length === 0) {
        alert("Please take at least 1 trade in the simulator to analyze the pattern!");
        return;
    }

    const spot = data.spotPrice || 24000;
    const atmStrike = getAtmStrike();
    
    // ATM Straddle Premium (Base multiplier ke liye)
    const atmRow = data.chain.find(r => r.strike === atmStrike);
    let atmPremium = 300; 
    if (atmRow) {
        const ceLtp = atmRow.CE?.ltp ? parseFloat(atmRow.CE.ltp) : 0;
        const peLtp = atmRow.PE?.ltp ? parseFloat(atmRow.PE.ltp) : 0;
        atmPremium = (ceLtp + peLtp) || 300;
    }

    // 1. पोजीशंस को ATM से दूरी के हिसाब से सॉर्ट करें (ताकि Leg 1, Leg 2 सही क्रम में आएं)
    let sortedPositions = [...positions].sort((a, b) => 
        Math.abs(a.strike - atmStrike) - Math.abs(b.strike - atmStrike)
    );

    let detectedLegs = [];
    let previousStrike = atmStrike;

    // 2. हर लेग का पैटर्न निकालें
    sortedPositions.forEach((pos, index) => {
        const distanceFromAtm = Math.abs(pos.strike - atmStrike);
        const distanceFromPrev = Math.abs(pos.strike - previousStrike);

        // मल्टीप्लायर = (दूरी / ATM प्रीमियम)
        const multiplier = index === 0 
            ? (distanceFromAtm / atmPremium).toFixed(1) 
            : (distanceFromPrev / atmPremium).toFixed(1);

        detectedLegs.push({
            id: index + 1,
            type: pos.type, // CE / PE
            side: pos.side, // B / S
            lots: pos.lots,
            reference: index === 0 ? 'ATM' : `Leg ${index}`, // पहला ATM से, बाकी पिछले लेग से
            multiplier: parseFloat(multiplier),
            rawDistance: index === 0 ? distanceFromAtm : distanceFromPrev // सिर्फ UI में दिखाने के लिए
        });

        previousStrike = pos.strike; // अगले लेग के लिए इसे बेस बना दें
    });

    // 3. स्टेट अपडेट करें और पॉपअप खोलें
    setQuantSettings(prev => ({
        ...prev,
        selectionBase: 'MULTI_LEG',
        legsConfiguration: detectedLegs,
        atmPremiumCache: atmPremium.toFixed(0) // UI me dikhane ke liye
    }));

    setIsQuantModalOpen(true);
};


    const saveQuantBehaviorRule = async () => {
    try {
        // 1. JSON Payload तैयार करें
        const rulePayload = {
            strategyName: "Weekend Theta Spread", 
            strikeSelection: {
                selectionBase: quantSettings.selectionBase,
                
                // ✅ 100% PERFECT ARRAY (Hardcoded Test)
                legsConfiguration: [
                    { id: 1, type: 'CE', side: 'B', lots: 1, reference: 'ATM', multiplier: 0.6, rawDistance: 450 },
                    { id: 2, type: 'CE', side: 'S', lots: 2, reference: 'Leg 1', multiplier: 0.5, rawDistance: 400 },
                    { id: 3, type: 'CE', side: 'B', lots: 1, reference: 'Leg 2', multiplier: 1.6, rawDistance: 1200 }
                ],
                
                ensureNetCredit: quantSettings.ensureNetCredit,
                minSpreadWidth: quantSettings.minSpreadWidth,

                // 🛡️ Safety Fallbacks added (|| 0)
                targetDelta: { 
                    min: Number(quantSettings.minDelta || 0), 
                    max: Number(quantSettings.maxDelta || 0) 
                },
                dynamicPremiumOffset: { 
                    enabled: quantSettings.selectionBase === 'PREMIUM', 
                    multiplier: Number(quantSettings.premiumMultiplier || 1.5) 
                }
            },
            timingRules: { 
                relativeExpiry: "NW", 
                preferredEntryDay: "Friday" 
            },
            riskManagement: {
                slPercent: { 
                    min: Number(quantSettings.slMin || 0), 
                    max: Number(quantSettings.slMax || 0) 
                },
                tpPercent: { 
                    min: Number(quantSettings.tpMin || 0), 
                    max: Number(quantSettings.tpMax || 0) 
                },
                emergencyEodExit: {
                    enabled: true,
                    startTime: "15:00",
                    endTime: quantSettings.eodExitTime || "15:20",
                    mtmThresholdPercent: Number(quantSettings.eodThreshold || -0.5)
                }
            },
            liquidityFilter: { enforceRoundStrikes: true, roundMultiple: 100, shiftDirection: "OTM" },
            isActive: true
        };

        // 2. Smart Backend URL
        const API_BASE_URL = window.location.hostname === 'localhost' 
                ? 'http://localhost:5500' 
                : 'http://65.0.164.229:5500';

        // 3. API POST Request 
        const response = await axios.post(`${API_BASE_URL}/api/behavior-rule`, rulePayload);

        if (response.data.success) {
            alert("✅ Multi-Leg Quant Strategy Successfully Saved to MongoDB!");
            setIsQuantModalOpen(false); 
        }
    } catch (error) {
        console.error("❌ Error saving rule:", error);
        alert("Failed to save rule. Check console.");
    }
};

    return (
        <div className="bg-gray-50 flex flex-col xl:h-screen xl:overflow-hidden text-[13px] font-sans text-gray-800">
            <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm relative z-50 shrink-0">
                
                {/* Nifty Dropdown & Snapshot */}
                <div className="w-full xl:w-auto flex justify-between items-center">
                    <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 md:w-48 focus:outline-none focus:border-blue-500">
                        <option>Nifty</option>
                        <option>BankNifty</option>
                        <option>FinNifty</option>
                    </select>
                    <button className="xl:hidden text-gray-500 hover:text-gray-800 flex items-center gap-1.5 text-sm font-medium px-2 py-1 bg-gray-50 rounded border border-gray-200">
                        <Camera size={14} /> Snapshot
                    </button>
                </div>

                {/* 🎯 FIX: Time Controls Keypad (Stacked on Mobile, Inline on Desktop) */}
                <div className="flex flex-col xl:flex-row justify-center items-center gap-2.5 md:gap-3 w-full xl:w-auto bg-gray-50 xl:bg-transparent p-2 xl:p-0 rounded-lg border border-gray-200 xl:border-0">
                    
                    {/* Minus Controls Row */}
                    <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2">
                        <button onClick={() => handleDayChange(-1)} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium">&lt;&lt; Day</button>
                        <button onClick={() => setTime('09:16')} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium">SOD</button>
                        <button onClick={() => handleTimeChange(-120)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-2h</button>
                        <button onClick={() => handleTimeChange(-30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-30m</button>
                        <button onClick={() => handleTimeChange(-15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-15m</button>
                        <button onClick={() => handleTimeChange(-5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-5m</button>
                        <button onClick={() => handleTimeChange(-1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">-1m</button>
                    </div>
                    
                    {/* Date & Time Selectors Row */}
                    <div className="flex justify-center items-center gap-2 my-1 w-full md:w-auto">
                        <DatePicker
                            selected={new Date(date)}
                            onChange={(selectedDate) => {
                                const yyyy = selectedDate.getFullYear();
                                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                const dd = String(selectedDate.getDate()).padStart(2, '0');

                                forceNearestRef.current = true;

                                setDate(`${yyyy}-${mm}-${dd}`);
                                setTime('09:16'); 
                            }}
                            filterDate={isWeekday} 
                            maxDate={new Date()}   
                            dateFormat="yyyy-MM-dd"
                            dayClassName={highlightExpiry}
                            onMonthChange={(date) => setCurrentMonth(date)}
                            className="border border-gray-300 px-2 py-1.5 bg-white font-bold rounded shadow-inner outline-none cursor-pointer text-gray-800 uppercase w-[130px] md:w-[140px] text-center text-[13px] md:text-sm"
                            
                            renderCustomHeader={({
                                date: headerDate, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled,
                            }) => (
                                <div className="flex justify-between items-center px-2 py-2 bg-gray-50 border-b border-gray-200">
                                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="text-gray-500 hover:text-gray-800 disabled:opacity-30 font-bold px-2 cursor-pointer">{"<"}</button>
                                    <div className="flex gap-1">
                                        <select value={headerDate.getMonth()} onChange={({ target: { value } }) => changeMonth(Number(value))} className="border border-gray-300 bg-white text-gray-700 font-medium rounded px-1 py-0.5 outline-none cursor-pointer text-sm hover:border-blue-400">
                                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                                                <option key={month} value={index}>{month}</option>
                                            ))}
                                        </select>
                                        <select value={headerDate.getFullYear()} onChange={({ target: { value } }) => changeYear(Number(value))} className="border border-gray-300 bg-white text-gray-700 font-medium rounded px-1 py-0.5 outline-none cursor-pointer text-sm hover:border-blue-400">
                                            {Array.from({ length: new Date().getFullYear() - 2018 + 1 }, (_, i) => 2018 + i).map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="text-gray-500 hover:text-gray-800 disabled:opacity-30 font-bold px-2 cursor-pointer">{">"}</button>
                                </div>
                            )}
                        />

                        <div className="flex gap-1">
                            <select className="border border-gray-300 px-1.5 py-1.5 bg-white rounded font-bold text-gray-800 outline-none cursor-pointer hover:border-blue-400 text-[13px] md:text-sm" value={parseInt(time.split(':')[0])} onChange={(e) => handleManualTimeChange('hour', e.target.value)}>
                                {[9, 10, 11, 12, 13, 14, 15].map(h => (<option key={h} value={h}>{h}</option>))}
                            </select>
                            <select className="border border-gray-300 px-1.5 py-1.5 bg-white rounded font-bold text-gray-800 outline-none cursor-pointer hover:border-blue-400 text-[13px] md:text-sm custom-scrollbar" value={time.split(':')[1]} onChange={(e) => handleManualTimeChange('minute', e.target.value)}>
                                {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => (<option key={m} value={m}>{m}</option>))}
                            </select>
                        </div>
                    </div>

                    {/* Plus Controls Row */}
                    <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2">
                        <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center outline-none focus:outline-none">1m+</button>
                        <button onClick={() => handleTimeChange(5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">5m+</button>
                        <button onClick={() => handleTimeChange(15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">15m+</button>
                        <button onClick={() => handleTimeChange(30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">30m+</button>
                        <button onClick={() => handleTimeChange(120)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">2h+</button>
                        <button onClick={() => setTime('15:30')} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium">EOD</button>
                        <button onClick={() => handleDayChange(1)} className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-[11px] md:text-sm font-medium cursor-pointer">Day &gt;&gt;</button>
                    </div>
                </div>
                
                {/* Desktop Snapshot (Hidden on mobile) */}
                <div className="hidden xl:flex w-32 justify-end">
                    <button className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"><Camera size={16} /> Snapshot</button>
                </div>
            </div>

            {/* 2. STATS BAR (Stockmock Clean Mobile View) */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shrink-0">
                
                {/* Stats Wrapper */}
                <div className="flex flex-col xl:flex-row w-full xl:w-auto gap-3 xl:gap-8 font-medium">
                    
                    {/* Add Futures Button */}
                    <div className="flex justify-start">
                        <button className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-md border border-green-100 xl:border-0 xl:bg-transparent xl:p-0">
                            <span className="bg-green-100 xl:bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">+</span> Add Futures
                        </button>
                    </div>

                    {/* 🎯 FIX: Mobile List View (Label Left, Value Right), Inline on Desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-row gap-x-6 gap-y-0 xl:gap-y-0 text-[13px] bg-gray-50 xl:bg-transparent px-3 py-1 xl:p-0 rounded-lg border border-gray-200 xl:border-0 w-full xl:w-auto">
                        
                        <div className="flex justify-between xl:justify-start items-center gap-2 border-b border-gray-200 xl:border-0 py-2 xl:py-0">
                            <span className="text-gray-500">Day Open:</span> 
                            <span className="text-gray-800 font-bold">24343.5 <span className="text-red-500 font-medium">(-23pt, -0.1%)</span></span>
                        </div>
                        
                        <div className="flex justify-between xl:justify-start items-center gap-2 border-b border-gray-200 md:border-b-0 xl:border-0 py-2 xl:py-0">
                            <span className="text-gray-500">Spot:</span> 
                            <span className="text-gray-800 font-bold">{data.spotPrice ? data.spotPrice : '---'} <span className="text-red-500 font-medium">(-36pt, -0.1%)</span></span>
                        </div>
                        
                        <div className="flex justify-between xl:justify-start items-center gap-2 border-b border-gray-200 md:border-b-0 xl:border-0 py-2 xl:py-0">
                            <span className="text-gray-500">Fut:</span> 
                            <span className="text-gray-800 font-bold">24361.4</span>
                        </div>
                        
                        <div className="flex justify-between xl:justify-start items-center gap-2 py-2 xl:py-0">
                            <span className="text-gray-500">Synth Fut:</span> 
                            <span className="text-gray-800 font-bold">24320.8 <span className="text-gray-400 font-normal text-[11px]">(18 AUG)</span></span>
                        </div>

                    </div>
                </div>

                {/* Strategy Buttons */}
                <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-2 w-full xl:w-auto mt-1 xl:mt-0">
                    <button className="flex justify-center items-center gap-1.5 px-3 py-2 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-md font-bold transition-colors w-full md:w-auto text-[13px]">
                        <Search size={14} /> Strategy Finder
                    </button>
                    <button className="flex justify-center items-center gap-1.5 px-3 py-2 text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-md font-bold transition-colors w-full md:w-auto text-[13px]">
                        Saved Strategies
                    </button>
                    <button className="col-span-2 md:col-span-1 flex justify-center items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-bold transition-colors w-full md:w-auto text-[13px] border border-gray-200 xl:border-0">
                        <Download size={14} /> Import Strategy
                    </button>
                </div>
            </div>

            {/* 3. MAIN GRID */}
            <div className="p-2 md:p-2 grid grid-cols-1 xl:grid-cols-14 gap-4 xl:gap-2 flex-1 xl:min-h-0">
                {/* --- LEFT: OPTION CHAIN --- */}
                <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[550px] xl:h-full min-h-0 overflow-hidden">
                    <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0 relative">
                        <div>
                            <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded transition-colors" onClick={() => setIsAddonsOpen(!isAddonsOpen)}>
                                <Settings size={14} /> Add ons <span className="text-[10px]">▼</span>
                            </div>
                            {isAddonsOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsAddonsOpen(false)}></div>
                                    <div className="absolute top-full left-2 mt-1 w-44 bg-white border border-gray-200 shadow-xl rounded-md z-50 py-2 text-sm text-gray-700">
                                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.delta} onChange={(e) => setAddons({...addons, delta: e.target.checked})} /> Delta(Δ)</label>
                                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.iv} onChange={(e) => setAddons({...addons, iv: e.target.checked})} /> Smart IV</label>
                                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.oi} onChange={(e) => setAddons({...addons, oi: e.target.checked})} /> OI</label>
                                        {addons.oi && (
                                            <label className="flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.showAllOi} onChange={(e) => setAddons({...addons, showAllOi: e.target.checked})} /> Show All OI</label>
                                        )}
                                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.atm} onChange={(e) => setAddons({...addons, atm: e.target.checked})} /> ATM</label>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="font-bold text-[14px] text-gray-800">
                            Option Chain <span className="font-bold text-gray-500">
                                {selectedExpiry ? formatHeaderDate(selectedExpiry).replace("'", "") : ""}
                            </span>
                        </div>
                        <div className="w-16"></div> 
                    </div>

                    <div className="flex items-center border-b border-gray-300 shadow-sm shrink-0 w-full bg-white relative">
        
                        {/* 🎯 LEFT ARROW (Condition ke sath) */}
                        {showLeftArrow && (
                            <button 
                                onClick={() => expiryScrollRef.current?.scrollBy({ left: -150, behavior: 'smooth' })}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors z-10 shrink-0"
                            >
                                <ChevronLeft size={16}/>
                            </button>
                        )}
                        
                        {/* 🎯 MIDDLE: Scrollable Container me onScroll add kiya */}
                        <div 
                            ref={expiryScrollRef} 
                            onScroll={handleScroll} 
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}

                            style={{ 
                                scrollBehavior: isDragging ? 'auto' : 'smooth', 
                                WebkitOverflowScrolling: 'touch' 
                            }}
                            
                            className={`flex-1 flex overflow-x-auto no-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        >
                            {/* Ab slice() hata diya hai taaki saari expiries DOM me rahein aur smoothly swipe ho sakein */}
                            {availableExpiries.map((expDate, idx) => {
                                const tabInfo = getTabDteInfo(date, expDate, idx, availableExpiries); 

                                return (
                                    <div 
                                        key={idx}
                                        id={`expiry-tab-${expDate}`} // 🎯 NAYA: Tab ko pehchanne ke liye ID add kiya
                                        onClick={() => {
                                            setSelectedExpiry(expDate);
                                            fetchSimulatorData(time, expDate);
                                        }}
                                        className={`min-w-[105px] md:min-w-[110px] flex-1 px-1 py-2 flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0
                                            ${selectedExpiry === expDate 
                                                ? 'border-b-2 border-blue-500 bg-blue-50' 
                                                : 'hover:bg-gray-50 border-b-2 border-transparent'
                                            }`}
                                    >
                                        <span className={`font-semibold text-[13px] whitespace-nowrap ${selectedExpiry === expDate ? 'text-blue-600' : 'text-gray-600 font-medium'}`}>
                                            {formatHeaderDate(expDate)}
                                        </span>
                                        
                                        <span className={`text-[10px] min-h-[15px] block whitespace-nowrap ${selectedExpiry === expDate ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {tabInfo ? `(${tabInfo.label}: ${tabInfo.dte} DTE)` : '\u00A0'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 🎯 RIGHT ARROW */}
                        {showRightArrow && (
                            <button 
                                onClick={() => expiryScrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' })}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors z-10 shrink-0"
                            >
                                <ChevronRight size={16}/>
                            </button>
                        )}
                    </div>

                    <div className="p-2 border-b border-gray-200 text-[12px] space-y-3 bg-white shrink-0">
                        <div className="flex justify-between items-center">
                            {/* 🎯 DYNAMIC ATM IV */}
                            <span className="text-gray-600 w-1/4">ATM IV: <span className="font-semibold text-gray-900">{headerAtmIV}</span></span>
                            
                            <div className="flex justify-center items-center gap-3 text-gray-600 w-2/4">
                                <span>ATM:</span>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Spot</label>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" defaultChecked /> Fut</label>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Synth Fut</label>
                            </div>
                            
                            {/* 🎯 DYNAMIC STRADDLE PREM */}
                            <span className="text-gray-600 w-1/4 text-right">Straddle Prem: <span className="font-semibold text-gray-900">{headerStraddlePrem}</span></span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            {/* 🎯 DYNAMIC PCR */}
                            <span className="text-gray-600 w-1/4">PCR: <span className="font-semibold text-gray-900">{pcr}</span></span>
                            
                            {/* 🎯 DYNAMIC TOTAL OI & CHANGE WITH COLORED BARS */}
                            <div className="flex justify-center items-center text-[11px] w-2/4 bg-gray-50 py-1 rounded relative overflow-hidden z-0 border border-gray-100">
                                
                                {/* 🎯 Background Bars (Originating from center 'OI') */}
                                <div className="absolute right-1/2 top-0 bottom-0 bg-[#fce4e4] transition-all duration-300 z-[-1]" style={{ width: `${callHeaderBarWidth}%` }}></div>
                                <div className="absolute left-1/2 top-0 bottom-0 bg-[#e6f4ea] transition-all duration-300 z-[-1]" style={{ width: `${putHeaderBarWidth}%` }}></div>

                                {/* Foreground Text */}
                                <div className="flex items-center w-full justify-between z-10 px-2">
                                    
                                    {/* Left: Call OI */}
                                    <div className="flex-1 flex justify-end items-center">
                                        <span className="text-gray-900 font-semibold mr-1">{formatOI(totalCallOI)}</span>
                                        {totalCallOiChg !== 0 && (
                                            <span className={`font-medium ${totalCallOiChg > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {formatChgOI(totalCallOiChg)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Center: OI Label */}
                                    <div className="text-gray-400 font-medium px-2 shrink-0 flex items-center">
                                        <span className="text-gray-300 mr-1">—</span>OI<span className="text-gray-300 ml-1">—</span>
                                    </div>
                                    
                                    {/* Right: Put OI */}
                                    <div className="flex-1 flex justify-start items-center">
                                        <span className="text-gray-900 font-semibold mr-1">{formatOI(totalPutOI)}</span>
                                        {totalPutOiChg !== 0 && (
                                            <span className={`font-medium ${totalPutOiChg > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {formatChgOI(totalPutOiChg)}
                                            </span>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <span className="text-gray-600 w-1/4 text-right">Max Pain: <span className="font-semibold text-gray-900">{maxPainStrike > 0 ? maxPainStrike : '---'}</span></span>
                        </div>
                    </div>

                    <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
                        <table className="w-full text-center">
                            <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-gray-100 z-30">
                                <tr>
                                    <th className="py-2 px-2 font-medium w-[25%] text-right pr-4 md:pr-6">Call LTP {addons.delta && '(Δ)'}</th>
                                    
                                    {/* 🎯 FIX: OI Header ko mobile par hide kiya */}
                                    {addons.oi && <th className="hidden md:table-cell py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
                                    
                                    <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-300 shadow-[inset_0_-1px_0_0_#e5e7eb] w-[20%]">Strike</th>
                                    
                                    {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
                                    
                                    {/* 🎯 FIX: OI Header ko mobile par hide kiya */}
                                    {addons.oi && <th className="hidden md:table-cell py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
                                    
                                    <th className="py-2 px-2 font-medium w-[25%] text-left pl-4 md:pl-6">Put LTP {addons.delta && '(Δ)'}</th>
                                </tr>
                            </thead>
                            
                            <tbody className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                {data.chain.length === 0 && loading ? (
                                    <tr><td colSpan="7" className="py-10 text-gray-400 font-medium">Loading Option Chain...</td></tr>
                                ) : processedOptionChain.map((row, idx) => {
                                    const isATM = row.strike === atmStrike;
                                    const isCallITM = row.strike < atmStrike;
                                    const isPutITM = row.strike > atmStrike;

                                    let callBg = isCallITM ? 'bg-white' : 'bg-[#fffde7]';
                                    let putBg = isPutITM ? 'bg-white' : 'bg-[#fffde7]';
                                    let strikeBg = 'bg-gray-50';

                                    if (isATM) {
                                        callBg = 'bg-[#e3f2fd]';
                                        putBg = 'bg-[#e3f2fd]';
                                        strikeBg = 'bg-[#e3f2fd]';
                                    }
                                    
                                    const callOiRaw = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
                                    const putOiRaw = row.PE?.oi ? parseFloat(row.PE.oi) : 0;

                                    // 🎯 09:15 AM (SOD) ke mukable Change in OI nikalne ka logic
                                    const sodRow = sodChain.find(s => Number(s.strike) === Number(row.strike)) || {};
                                    const sodCallOi = sodRow.CE?.oi ? parseFloat(sodRow.CE.oi) : callOiRaw;
                                    const sodPutOi = sodRow.PE?.oi ? parseFloat(sodRow.PE.oi) : putOiRaw;

                                    const callOiChg = callOiRaw - sodCallOi;
                                    const putOiChg = putOiRaw - sodPutOi;
                                    
                                    const isMaxCallOI = callOiRaw === maxCallOI && callOiRaw > 0;
                                    const isMaxPutOI = putOiRaw === maxPutOI && putOiRaw > 0;

                                    const callOiWidth = (callOiRaw / maxOverallOI) * 100;
                                    const putOiWidth = (putOiRaw / maxOverallOI) * 100;

                                    // 🎯 NAYA LOGIC: SMART IV CALCULATION YAHAN ADD KIYA HAI
                                    let smartIV = '-';
                                    if (addons.iv) {
                                        const ceIV = row.CE?.iv ? parseFloat(row.CE.iv) : 0;
                                        const peIV = row.PE?.iv ? parseFloat(row.PE.iv) : 0;

                                        if (isATM) {
                                            if (ceIV && peIV) smartIV = ((ceIV + peIV) / 2).toFixed(1);
                                            else if (ceIV) smartIV = ceIV.toFixed(1);
                                            else if (peIV) smartIV = peIV.toFixed(1);
                                        } else if (row.strike < atmStrike) {
                                            smartIV = peIV ? peIV.toFixed(1) : '-';
                                        } else {
                                            smartIV = ceIV ? ceIV.toFixed(1) : '-';
                                        }
                                    }

                                  
                                   // 🎯 LIVE & SMART DELTA CALCULATION (Hybrid Logic)
                                    const dte = data.dte || 0; // Abhi ke liye DTE = 4 maan rahe hain

                                    const getSmartDelta = (optData, type) => {
                                        if (!optData) return '-';
                                        
                                        const dbDelta = parseFloat(optData.delta || 0);
                                        if (dbDelta !== 0) return dbDelta.toFixed(2);
                                        
                                        return calculateLiveDelta(data.spotPrice, row.strike, dte, parseFloat(optData.iv || 0), type);
                                    };

                                    const ceDeltaLive = addons.delta ? getSmartDelta(row.CE, 'CE') : '-';
                                    const peDeltaLive = addons.delta ? getSmartDelta(row.PE, 'PE') : '-';

                                    return (
                                        <tr 
                                            key={idx} 
                                            ref={isATM ? atmRowRef : null} 
                                            className={`border-b border-gray-100 hover:bg-gray-50 group ${addons.atm && isATM ? 'border-2 border-blue-400 shadow-md relative z-10' : ''}`}
                                        >
                                            {/* CALL LTP */}
                                            <td className={`py-1.5 px-2 relative ${callBg}`}>
                                                {/* 🎯 FIX: flex-col lagaya taaki mobile me text niche aa sake */}
                                                <div className="flex flex-col items-end justify-center pr-2 md:pr-4 pl-10 md:pl-12">
                                                    
                                                    <div className={`font-semibold ${row.isCeFreak ? 'text-gray-400' : row.isCeFaded ? 'text-gray-400 opacity-60' : 'text-gray-800'}`}>
                                                        {row.isCeFreak ? '-' : (row.CE?.ltp || '-')} 
                                                        {addons.delta && !row.isCeFreak && <span className="font-normal text-gray-400 text-[11px] ml-1">({ceDeltaLive})</span>}
                                                    </div>

                                                    {/* 🎯 NAYA: Mobile me OI data LTP ke theek niche dikhega (md:hidden) */}
                                                    {addons.oi && !row.isCeFreak && (
                                                        <div className={`flex md:hidden items-center gap-1 text-[10px] mt-0.5 transition-opacity duration-200 ${isMaxCallOI || addons.showAllOi ? 'opacity-100' : 'opacity-0'}`}>
                                                            <span className={`${isMaxCallOI ? 'text-gray-700 font-bold' : 'text-gray-500 font-medium'}`}>{formatOI(callOiRaw)}</span>
                                                            {callOiChg !== 0 && (
                                                                <span className={callOiChg > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                                                    {formatChgOI(callOiChg)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* 🎯 NAYA: Agar Freak Trade hai to Buy/Sell button hide ho jayenge */}
                                                {!row.isCeFreak && (() => {
                                                    const buyPos = positions.find(p => p.strike === row.strike && p.type === 'CE' && p.expiry === selectedExpiry && p.side === 'B');
                                                    const sellPos = positions.find(p => p.strike === row.strike && p.type === 'CE' && p.expiry === selectedExpiry && p.side === 'S');
                                                    const isBuyOpen = openPositionDropdown === `${row.strike}_CE_B`;
                                                    const isSellOpen = openPositionDropdown === `${row.strike}_CE_S`;

                                                    return (
                                                        <div className={`absolute left-1 md:left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20 transition-opacity ${(buyPos || sellPos) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                            
                                                            {/* BUY BUTTON / INDICATOR */}
                                                            {buyPos ? (
                                                                <div className="relative">
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); setOpenPositionDropdown(isBuyOpen ? null : `${row.strike}_CE_B`); }}
                                                                        className="flex flex-col items-center justify-center border text-green-600 border-green-500 bg-green-50 rounded px-1 min-w-[24px] h-[32px] text-[10px] font-bold shadow-sm"
                                                                    >
                                                                        <span className="leading-none">{buyPos.lots}</span>
                                                                        <span className="leading-none border-t border-current w-full pt-[2px] mt-[1px]">B</span>
                                                                    </button>
                                                                    {isBuyOpen && (
                                                                        <div className="absolute left-full ml-1 top-0 bg-white border border-gray-200 shadow-md rounded flex flex-col whitespace-nowrap z-50 overflow-hidden py-1 min-w-[80px]">
                                                                            <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'CE', 'B', row.CE?.ltp); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-green-600 hover:bg-green-50 text-left font-medium">Buy +</button>
                                                                            <button onClick={(e) => { e.stopPropagation(); removePosition(buyPos.id); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-gray-500 hover:bg-gray-50 text-left flex justify-between items-center">Remove <span className="text-[10px]">✕</span></button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'CE', 'B', row.CE?.ltp); }} className="border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center transition-colors">B</button>
                                                            )}

                                                            {/* SELL BUTTON / INDICATOR */}
                                                            {sellPos ? (
                                                                <div className="relative">
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); setOpenPositionDropdown(isSellOpen ? null : `${row.strike}_CE_S`); }}
                                                                        className="flex flex-col items-center justify-center border text-red-500 border-red-500 bg-red-50 rounded px-1 min-w-[24px] h-[32px] text-[10px] font-bold shadow-sm"
                                                                    >
                                                                        <span className="leading-none">{sellPos.lots}</span>
                                                                        <span className="leading-none border-t border-current w-full pt-[2px] mt-[1px]">S</span>
                                                                    </button>
                                                                    {isSellOpen && (
                                                                        <div className="absolute left-full ml-1 top-0 bg-white border border-gray-200 shadow-md rounded flex flex-col whitespace-nowrap z-50 overflow-hidden py-1 min-w-[80px]">
                                                                            <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'CE', 'S', row.CE?.ltp); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-red-500 hover:bg-red-50 text-left font-medium">Sell +</button>
                                                                            <button onClick={(e) => { e.stopPropagation(); removePosition(sellPos.id); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-gray-500 hover:bg-gray-50 text-left flex justify-between items-center">Remove <span className="text-[10px]">✕</span></button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'CE', 'S', row.CE?.ltp); }} className="border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center transition-colors">S</button>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </td>

                                            {/* CALL OI GRAPH */}
                                            {addons.oi && (
                                                <td className={`hidden md:table-cell relative p-0 h-full ${callBg}`}>
                                                    <div className="flex items-center justify-end w-full h-full min-h-[28px] relative group-hover/oi">
                                                        <div className={`absolute right-0 top-[15%] bottom-[15%] rounded-l-sm transition-all z-0 ${isMaxCallOI ? 'bg-red-200 border-l border-red-400' : 'bg-[#fce4e4] dark:bg-red-900/30'}`} style={{ width: `${callOiWidth}%` }}></div>
                                                        
                                                        {/* 🎯 Ye wahi hissa hai jo Max OI ya Show All OI par dikhega, ab isme Change in OI bhi jud gaya hai */}
                                                        <div className={`absolute right-2 z-10 text-[11px] font-medium flex items-center gap-1 ${isMaxCallOI ? 'text-gray-500 opacity-100 font-bold' : 'text-red-400 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
                                                            <span>{formatOI(callOiRaw)}</span>
                                                            {callOiChg !== 0 && (
                                                                <span className={callOiChg > 0 ? "text-green-500 font-medium text-[10px]" : "text-red-500 font-medium text-[10px]"}>
                                                                    {formatChgOI(callOiChg)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            
                                            {/* STRIKE */}
                                            <td className={`py-1.5 px-2 border-x border-gray-200 ${strikeBg}`}>
                                                <div className="flex flex-col items-center justify-center min-h-[32px]">
                                                    <div className={`font-semibold ${isATM ? 'text-blue-700' : 'text-gray-700'}`}>{row.strike}</div>
                                                    {isATM && <div className="text-[10px] text-blue-600 leading-none -mt-0.5">(ATM)</div>}
                                                    {!isATM && (
                                                        <div className={`text-[10px] text-gray-400 leading-none -mt-0.5 transition-opacity ${addons.atm ? 'opacity-100' : 'opacity-0'}`}>
                                                            (ATM {row.strike > atmStrike ? '+' : ''}{row.strike - atmStrike})
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* SMART IV COLUMN */}
                                            {addons.iv && <td className={`py-1.5 px-2 text-gray-500 font-medium text-[11px] ${strikeBg}`}>{smartIV}</td>}
                                            
                                            {/* PUT OI GRAPH */}
                                            {addons.oi && (
                                                <td className={`hidden md:table-cell relative p-0 h-full ${putBg}`}>
                                                    <div className="flex items-center justify-start w-full h-full min-h-[28px] relative group-hover/oi">
                                                        <div className={`absolute left-0 top-[15%] bottom-[15%] rounded-r-sm transition-all z-0 ${isMaxPutOI ? 'bg-green-200 border-r border-green-500' : 'bg-[#e6f4ea] dark:bg-green-900/30'}`} style={{ width: `${putOiWidth}%` }}></div>
                                                        
                                                        <div className={`absolute left-2 z-10 text-[11px] font-medium flex items-center gap-1 ${isMaxPutOI ? 'text-gray-500 opacity-100 font-bold' : 'text-green-500 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
                                                            <span>{formatOI(putOiRaw)}</span>
                                                            {putOiChg !== 0 && (
                                                                <span className={putOiChg > 0 ? "text-green-500 font-medium text-[10px]" : "text-red-500 font-medium text-[10px]"}>
                                                                    {formatChgOI(putOiChg)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            {/* PUT LTP */}
                                            <td className={`py-1.5 px-2 relative ${putBg}`}>
                                                {/* 🎯 FIX: flex-col lagaya taaki mobile me text niche aa sake */}
                                                <div className="flex flex-col items-start justify-center pl-2 md:pl-4 pr-10 md:pr-12">
                                                    
                                                    <div className={`font-semibold ${row.isPeFreak ? 'text-gray-400' : row.isPeFaded ? 'text-gray-400 opacity-60' : 'text-gray-800'}`}>
                                                        {row.isPeFreak ? '-' : (row.PE?.ltp || '-')} 
                                                        {addons.delta && !row.isPeFreak && <span className="font-normal text-gray-400 text-[11px] ml-1">({peDeltaLive})</span>}
                                                    </div>

                                                    {/* 🎯 NAYA: Mobile me OI data LTP ke theek niche dikhega (md:hidden) */}
                                                    {addons.oi && !row.isPeFreak && (
                                                        <div className={`flex md:hidden items-center gap-1 text-[10px] mt-0.5 transition-opacity duration-200 ${isMaxPutOI || addons.showAllOi ? 'opacity-100' : 'opacity-0'}`}>
                                                            <span className={`${isMaxPutOI ? 'text-gray-700 font-bold' : 'text-gray-500 font-medium'}`}>{formatOI(putOiRaw)}</span>
                                                            {putOiChg !== 0 && (
                                                                <span className={putOiChg > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                                                    {formatChgOI(putOiChg)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                            {/* 🎯 NAYA: Agar Freak Trade hai to Buy/Sell button hide ho jayenge */}
                                            {!row.isPeFreak && (() => {
                                                const buyPos = positions.find(p => p.strike === row.strike && p.type === 'PE' && p.expiry === selectedExpiry && p.side === 'B');
                                                const sellPos = positions.find(p => p.strike === row.strike && p.type === 'PE' && p.expiry === selectedExpiry && p.side === 'S');
                                                const isBuyOpen = openPositionDropdown === `${row.strike}_PE_B`;
                                                const isSellOpen = openPositionDropdown === `${row.strike}_PE_S`;

                                                    return (
                                                        <div className={`absolute right-1 md:right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20 transition-opacity ${(buyPos || sellPos) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                            
                                                            {/* BUY BUTTON / INDICATOR */}
                                                            {buyPos ? (
                                                                <div className="relative">
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); setOpenPositionDropdown(isBuyOpen ? null : `${row.strike}_PE_B`); }}
                                                                        className="flex flex-col items-center justify-center border text-green-600 border-green-500 bg-green-50 rounded px-1 min-w-[24px] h-[32px] text-[10px] font-bold shadow-sm"
                                                                    >
                                                                        <span className="leading-none">{buyPos.lots}</span>
                                                                        <span className="leading-none border-t border-current w-full pt-[2px] mt-[1px]">B</span>
                                                                    </button>
                                                                    {isBuyOpen && (
                                                                        <div className="absolute right-full mr-1 top-0 bg-white border border-gray-200 shadow-md rounded flex flex-col whitespace-nowrap z-50 overflow-hidden py-1 min-w-[80px]">
                                                                            <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'PE', 'B', row.PE?.ltp); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-green-600 hover:bg-green-50 text-left font-medium">Buy +</button>
                                                                            <button onClick={(e) => { e.stopPropagation(); removePosition(buyPos.id); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-gray-500 hover:bg-gray-50 text-left flex justify-between items-center">Remove <span className="text-[10px]">✕</span></button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'PE', 'B', row.PE?.ltp); }} className="border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center transition-colors">B</button>
                                                            )}

                                                            {/* SELL BUTTON / INDICATOR */}
                                                            {sellPos ? (
                                                                <div className="relative">
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); setOpenPositionDropdown(isSellOpen ? null : `${row.strike}_PE_S`); }}
                                                                        className="flex flex-col items-center justify-center border text-red-500 border-red-500 bg-red-50 rounded px-1 min-w-[24px] h-[32px] text-[10px] font-bold shadow-sm"
                                                                    >
                                                                        <span className="leading-none">{sellPos.lots}</span>
                                                                        <span className="leading-none border-t border-current w-full pt-[2px] mt-[1px]">S</span>
                                                                    </button>
                                                                    {isSellOpen && (
                                                                        <div className="absolute right-full mr-1 top-0 bg-white border border-gray-200 shadow-md rounded flex flex-col whitespace-nowrap z-50 overflow-hidden py-1 min-w-[80px]">
                                                                            <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'PE', 'S', row.PE?.ltp); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-red-500 hover:bg-red-50 text-left font-medium">Sell +</button>
                                                                            <button onClick={(e) => { e.stopPropagation(); removePosition(sellPos.id); setOpenPositionDropdown(null); }} className="px-3 py-1 text-[11px] text-gray-500 hover:bg-gray-50 text-left flex justify-between items-center">Remove <span className="text-[10px]">✕</span></button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <button onClick={(e) => { e.stopPropagation(); handleActionClick(row.strike, 'PE', 'S', row.PE?.ltp); }} className="border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center transition-colors">S</button>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* --- RIGHT: POSITIONS & STRATEGIES PANEL --- */}
                <div className="xl:col-span-8 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[550px] xl:h-full min-h-0 overflow-hidden">
                    {positions.length > 0 ? (
                        // 🎯 1. ACTIVE POSITIONS VIEW (Payoff Chart & Table)
                        <div className="flex flex-col h-full bg-white relative overflow-y-auto custom-scrollbar">
                            {/* Chart Top Header Controls */}
                            <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-gray-200 text-[11px] text-gray-600 bg-gray-50 shrink-0 z-20">
                                <div className="flex items-center gap-4 font-medium">
                                    <span className="text-blue-600 font-bold border-b border-blue-600 pb-0.5">Payoff Chart</span>
                                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-500" /> MTM</label>
                                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-500" /> Strategy</label>
                                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-500" /> OI</label>
                                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-500" /> Rolling Straddle</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-1 cursor-pointer font-medium"><input type="checkbox" className="accent-blue-500" /> Payoff Settings</label>
                                    <button className="text-blue-600 flex items-center gap-0.5 font-bold">⌃ Hide</button>
                                </div>
                            </div>

                            {/* Strategy Stats (Est. Margin, Max Profit etc) */}
                            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 text-[12px] shrink-0 z-20 bg-white">
        
                                {/* Est Margin (Lakh format) */}
                                <div className="flex flex-col">
                                    <span className="text-gray-500">Est. Margin:</span>
                                    <span className="font-bold text-gray-800 flex items-center gap-1">
                                        {stats.estMargin >= 100000 ? `₹${(stats.estMargin / 100000).toFixed(2)}L` : `₹${stats.estMargin.toLocaleString('en-IN')}`} 
                                        <span className="cursor-pointer hover:text-blue-500 text-[14px]">⟳</span>
                                    </span>
                                </div>
                                
                                {/* P&L */}
                                <div className="flex flex-col text-center">
                                    <span className="text-gray-500">P&L:</span>
                                    <span className={`font-bold ${stats.pnl > 0 ? 'text-green-500' : stats.pnl < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                                        ₹{stats.pnl.toLocaleString('en-IN')} <span className="text-[10px] font-medium">({stats.pnlPercent}%)</span>
                                    </span>
                                </div>
                                
                                {/* Max Profit with % */}
                                <div className="flex flex-col text-center">
                                    <span className="text-gray-500">Max Profit:</span>
                                    {stats.isMaxProfitInfinite ? (
                                        <span className="font-bold text-green-500">Undefined</span>
                                    ) : (
                                        <span className={`font-bold ${stats.maxProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            ₹{stats.maxProfit.toLocaleString('en-IN')} 
                                            {stats.estMargin > 0 && <span className="text-[10px] font-medium ml-1">({((stats.maxProfit / stats.estMargin) * 100).toFixed(1)}%)</span>}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Max Loss with % */}
                                <div className="flex flex-col text-center">
                                    <span className="text-gray-500">Max Loss:</span>
                                    {stats.isMaxLossInfinite ? (
                                        <span className="font-bold text-red-500">Undefined</span>
                                    ) : (
                                        <span className={`font-bold ${stats.maxLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            ₹{stats.maxLoss.toLocaleString('en-IN')}
                                            {stats.estMargin > 0 && <span className="text-[10px] font-medium ml-1">({((stats.maxLoss / stats.estMargin) * 100).toFixed(1)}%)</span>}
                                        </span>
                                    )}
                                </div>

                                {/* 🎯 NEW: R:R (Risk to Reward) */}
                                <div className="flex flex-col text-center">
                                    <span className="text-gray-500">R:R:</span>
                                    <span className="font-bold text-gray-800">{stats.rr}</span>
                                </div>
                                
                                {/* POP */}
                                <div className="flex flex-col text-center">
                                    <span className="text-gray-500">POP:</span>
                                    <span className="font-bold text-gray-800">{stats.pop}%</span>
                                </div>
                                
                                {/* Net Credit / Debit */}
                                <div className="flex flex-col text-center">
                                    <span className="text-gray-500">{stats.netCredit >= 0 ? 'Net Credit:' : 'Net Debit:'}</span>
                                    <span className={`font-bold ${stats.netCredit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        ₹{Math.abs(stats.netCredit).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                
                                {/* Breakevens (Dashed Format) */}
                                <div className="flex flex-col text-right">
                                    <span className="text-gray-500">Breakevens:</span>
                                    <div className="flex gap-1 justify-end font-bold text-gray-800">
                                        {stats.breakevens.length > 0 ? stats.breakevens.map((be, idx) => {
                                            const diffPercent = (((be - spotPrice) / spotPrice) * 100).toFixed(1);
                                            return (
                                                <span key={idx}>
                                                    {be.toFixed(0)} <span className="text-[10px] text-gray-500 font-medium">({diffPercent > 0 ? '+' : ''}{diffPercent}%)</span>
                                                    {/* 🎯 FIX: Comma ki jagah Dash laga diya */}
                                                    {idx !== stats.breakevens.length - 1 && ' - '}
                                                </span>
                                            );
                                        }) : '-'}
                                    </div>
                                </div>

                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

                            {/* 🎯 Payoff Chart Area */}
                            <div className="flex-1 min-h-[300px] border-b border-gray-200 relative bg-white shrink-0 flex items-center justify-center">
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.10] pointer-events-none select-none z-0">
                                    <span className="text-blue-400">TM</span> TradeMaster
                                </div>
                                {/* 🎯 RECHARTS PAYOFF GRAPH */}
                                {chartData.length > 0 && (
                                    // 🎯 FIX: Tailwind ki classes se outer aur inner sabhi focus outlines ko block kar diya hai
                                    <div className="w-full h-full relative z-10 pt-6 pb-2 pr-4 outline-none focus:outline-none [&_.recharts-wrapper]:!outline-none [&_svg]:!outline-none">
                                        
                                        {/* 🎯 RESET ZOOM BUTTON */}
                                        {xDomain[0] !== 'dataMin' && (
                                            <button 
                                                onClick={resetZoom} 
                                                className="absolute top-2 right-6 z-50 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded shadow-sm text-[11px] font-semibold hover:bg-gray-50 transition-colors outline-none focus:outline-none"
                                            >
                                                Reset zoom
                                            </button>
                                        )}

                                        {/* 🎯 FIX: ResponsiveContainer par bhi style add kiya */}
                                        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                                            <AreaChart 
                                                data={chartData} 
                                                margin={{ top: 25, right: 10, left: 10, bottom: 0 }}
                                                onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
                                                onMouseMove={(e) => refAreaLeft && e && setRefAreaRight(e.activeLabel)}
                                                onMouseUp={handleZoom}
                                                style={{ userSelect: 'none', outline: 'none' }} 
                                            >
                                                <defs>
                                                    {/* 🎯 FIX 1: FILL COLOR - Vibrant Green aur Red (Opacity badha di gayi hai) */}
                                                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset={off} stopColor="#10b981" stopOpacity={0.6} /> {/* Bright Emerald Green */}
                                                        <stop offset={off} stopColor="#ef4444" stopOpacity={0.4} /> {/* Bright Red */}
                                                    </linearGradient>

                                                    {/* 🎯 FIX 2: STROKE COLOR - Line bhi Profit me Green aur Loss me Red hogi */}
                                                    <linearGradient id="splitStroke" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset={off} stopColor="#059669" stopOpacity={1} /> {/* Dark Green Line */}
                                                        <stop offset={off} stopColor="#dc2626" stopOpacity={1} /> {/* Dark Red Line */}
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                
                                                <XAxis 
                                                    dataKey="spot" 
                                                    type="number" 
                                                    domain={xDomain} 
                                                    allowDataOverflow={true} // 🎯 Zooming ke liye data ko overflow allow karna zaroori hai
                                                    ticks={xAxisTicks} 
                                                    tick={{fontSize: 10, fill: '#6b7280'}} 
                                                    tickFormatter={(val) => val.toFixed(0)}
                                                    axisLine={{ stroke: '#d1d5db' }} 
                                                    tickLine={{ stroke: '#d1d5db' }}
                                                    tickMargin={5}
                                                />
                                                
                                                <YAxis 
                                                    domain={['auto', 'auto']} // 🎯 Zoom karne par Y-Axis ko automatically adjust karne ke liye
                                                    allowDataOverflow={true}
                                                    tick={{fontSize: 10, fill: '#6b7280'}} 
                                                    tickFormatter={(val) => val.toLocaleString('en-IN')} 
                                                    axisLine={{ stroke: '#d1d5db' }} 
                                                    tickLine={false}
                                                    tickMargin={10} 
                                                    width={70}      
                                                />
                                                
                                                <Tooltip 
                                                                    formatter={(value) => [`₹${value.toFixed(2)}`, 'P&L']} 
                                                    labelFormatter={(label) => `Nifty Spot: ${label.toFixed(2)}`}
                                                    contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e5e7eb' }}
                                                />
                                                
                                                <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
                                                
                                                {data.spotPrice && (
                                                    <ReferenceLine 
                                                        x={data.spotPrice} 
                                                        stroke="#3b82f6" 
                                                        strokeDasharray="4 4" 
                                                        label={{ position: 'top', value: `Nifty Spot: ${data.spotPrice}`, fill: '#374151', fontSize: 11, fontWeight: 'bold' }} 
                                                    />
                                                )}

                                                <Area 
                                                    type="linear" 
                                                    dataKey="pnl" 
                                                    stroke="url(#splitStroke)" 
                                                    strokeWidth={2} 
                                                    fill="url(#splitColor)" 
                                                    isAnimationActive={false} 
                                                    activeDot={false} 
                                                />

                                                {/* 🎯 NAYI: T+0 Blue Dotted Line */}
                                                <Line type="monotone" dataKey="tZeroPnl" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />

                                                {/* 🎯 ZOOM SELECTION HIGHLIGHT */}
                                                {refAreaLeft && refAreaRight ? (
                                                    <ReferenceArea 
                                                        x1={refAreaLeft} 
                                                        x2={refAreaRight} 
                                                        strokeOpacity={0.3} 
                                                        fill="#3b82f6" 
                                                        fillOpacity={0.2} 
                                                    />
                                                ) : null}

                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                            

                            {/* 🎯 Positions Table */}
                            <div className="flex flex-col shrink-0 h-[200px]">
                                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50 text-[12px] font-medium">
                                    <div className="flex gap-4">
                                        <span className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-2 cursor-pointer">Positions</span>
                                        <span className="text-gray-500 hover:text-gray-700 cursor-pointer">Greeks</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1"><span className="text-[14px]">+</span> Add Notes</button>
                                        <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1"><Settings size={12}/> Add ons ⌄</button>
                                    </div>
                                </div>

                                <div className="flex-1 ">
                                    <table className="w-full text-left border-collapse">
                                        {/* 🎯 FIX: Header aur Body columns ko barabar (10) kiya gaya aur text-center lagaya */}
                                        <thead className="text-[11px] text-gray-500 bg-white border-b border-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="py-2 px-2 font-medium w-8 text-left"><input type="checkbox" defaultChecked className="accent-blue-500"/></th>
                                                <th className="py-2 px-1 font-medium w-6 text-center"></th> {/* B/S Badge ke liye khali column */}
                                                <th className="py-2 px-2 font-medium text-center">Lots</th>
                                                <th className="py-2 px-2 font-medium text-center">Qty</th>
                                                <th className="py-2 px-2 font-medium text-center">Strike ⇕</th>
                                                <th className="py-2 px-2 font-medium text-center">Expiry</th>
                                                <th className="py-2 px-2 font-medium text-center">Entry</th>
                                                <th className="py-2 px-2 font-medium text-center">LTP</th>
                                                <th className="py-2 px-2 font-medium text-center">P&L</th>
                                                <th className="py-2 px-2 font-medium text-right">Lots Exit ≏</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody className="text-[12px]">
                                            {positions.map((pos, index) => {
                                                const currentLTP = pos.isSquaredOff ? pos.exitPrice : getLivePositionLTP(pos);
                                                const qty = pos.lots * lotSize;
                                                const pnl = pos.side === 'B' 
                                                    ? (currentLTP - pos.entryPrice) * qty 
                                                    : (pos.entryPrice - currentLTP) * qty;

                                                // 🎯 FIX: Yahan bhi asli state variable 'time' ka use kiya gaya hai
                                                const currentTimeStr = time; 
                                                
                                                const isTimeAdvanced = pos.isSquaredOff && pos.squaredOffTime !== currentTimeStr;

                                                return (
                                                    <tr key={pos.id} className="border-b border-gray-50 hover:bg-gray-50 group">
                                                        
                                                        {/* 1. Checkbox */}
                                                        <td className="py-2 px-2 text-left"><input type="checkbox" defaultChecked className="accent-blue-500"/></td>
                                                        
                                                        {/* 2. Side (B/S) */}
                                                        <td className="py-2 px-1 text-center">
                                                            <span className={`px-1.5 py-0.5 border rounded text-[10px] font-bold ${pos.side === 'B' ? 'text-green-600 border-green-500 bg-green-50' : 'text-red-500 border-red-500 bg-red-50'}`}>
                                                                {pos.side}
                                                            </span>
                                                        </td>
                                                        
                                                        {/* 3. Lots (+/- hover) */}
                                                        <td className="py-2 px-2 font-semibold text-gray-800">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button onClick={() => handleLotChange(index, -1)} className="text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-1.5 select-none">-</button>
                                                                <span className="w-[20px] text-center">{pos.lots}</span>
                                                                <button onClick={() => handleLotChange(index, 1)} className="text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-1.5 select-none">+</button>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* 4. Qty */}
                                                        <td className="py-2 px-2 text-gray-600 text-center">{qty}</td>
                                                        
                                                        {/* 5. Strike (+/- hover) */}
                                                        <td className="py-2 px-2 font-semibold text-gray-800">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button onClick={() => handleStrikeChange(index, -50)} className="text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-1 select-none">-</button>
                                                                <span className="w-[65px] text-center">{pos.strike} {pos.type}</span>
                                                                <button onClick={() => handleStrikeChange(index, 50)} className="text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-1 select-none">+</button>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* 6. Expiry */}
                                                        <td className="py-2 px-2 text-gray-600 text-center">{formatHeaderDate(pos.expiry)} ⌄</td>
                                                        
                                                        {/* 7. Entry */}
                                                        <td className="py-2 px-2 text-gray-600 text-center">{pos.entryPrice.toFixed(1)}</td>
                                                        
                                                        {/* 8. LTP */}
                                                        <td className="py-2 px-2 font-medium text-center">
                                                            {pos.isSquaredOff ? (
                                                                <span className="text-gray-400 line-through mr-1 text-[11px]">{getLivePositionLTP(pos).toFixed(1)}</span>
                                                            ) : null}
                                                            <span>{currentLTP.toFixed(1)}</span>
                                                        </td>
                                                        
                                                        {/* 9. P&L */}
                                                        <td className={`py-2 px-2 font-bold text-center ${pnl > 0 ? 'text-green-500' : pnl < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                                            ₹{pnl.toFixed(0)} <span className="font-medium text-[10px] text-gray-400">({(pnl/(pos.entryPrice*qty)*100).toFixed(0)}%)</span>
                                                        </td>
                                                        
                                                        {/* 10. Exit Actions */}
                                                        <td className="py-2 px-2">
                                                            {/* 🎯 FIX: gap-4 lagaya aur Select ko action buttons se alag kiya */}
                                                            <div className="flex items-center justify-end gap-5">
                                                                <select className="border border-gray-200 rounded px-1 py-0.5 text-gray-600 bg-white outline-none cursor-pointer">
                                                                    <option>{pos.lots}</option>
                                                                </select>
                                                                
                                                                {/* 🎯 FIX: Icons ka ek alag group banaya jisse wo ek sath rahein */}
                                                                <div className="flex items-center gap-3">
                                                                    {!pos.isSquaredOff ? (
                                                                        <button onClick={() => handleSquareOffToggle(index, currentLTP)} className="text-gray-400 hover:text-red-500 font-bold" title="Square Off"><CirclePower size={18} strokeWidth={1} color="#FF2C2C"/></button>
                                                                    ) : !isTimeAdvanced ? (
                                                                        <button onClick={() => handleSquareOffToggle(index, currentLTP)} className="text-green-500 hover:text-green-600 font-bold text-[16px]" title="Reset Trade"> <TimerReset size={14} strokeWidth={1.5} color="#00CF00"/> </button>
                                                                    ) : (
                                                                        <span className="text-gray-400 font-bold text-[10px]" title="Trade Closed"><Ban size={14} strokeWidth={1.5} color="#6B6B6B"/></span>
                                                                    )}

                                                                    <button onClick={() => removePosition(pos.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash size={14} strokeWidth={1.5} color="#2E2E2E"/></button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                                </div>

                                {/* Footer Controls (Multiplier, Save, Share) */}
                                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 text-[12px] shrink-0 z-20">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500">Multiplier:</span>
                                        <div className="flex items-center border border-gray-300 rounded bg-white">
                                            <button className="px-2 py-0.5 hover:bg-gray-100 text-gray-500">-</button>
                                            <span className="px-3 py-0.5 font-bold border-x border-gray-300">1</span>
                                            <button className="px-2 py-0.5 hover:bg-gray-100 text-gray-500">+</button>
                                            
                                            <button 
                                                onClick={analyzeUserPattern}
                                                className="px-3 py-1 bg-purple-600 text-white rounded font-medium shadow-sm flex items-center gap-1 hover:bg-purple-700 transition-colors"
                                            >
                                                🚀 Push to Quant Engine
                                            </button>

                                        </div>
                                        <span className="text-gray-400 ml-2">Lot Size: {lotSize}</span>
                                        <button className="text-blue-600 font-medium ml-4">Add Alert</button>
                                        <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded font-medium shadow-sm hover:bg-blue-50">Save</button>
                                        <button className="px-3 py-1 bg-blue-500 text-white rounded font-medium shadow-sm flex items-center gap-1 hover:bg-blue-600">🔗 Share</button>
                                    </div>
                                    <div className="flex items-center gap-4 font-medium">
                                        <button className="text-red-500 hover:text-red-600">Exit</button>
                                        <button onClick={() => setPositions([])} className="text-gray-600 hover:text-gray-800">Clear</button>
                                    </div>
                                </div>
                                
                            
                        </div>
                    ) : (
                        // 🎯 2. PRE BUILT STRATEGIES VIEW (Yehi gayab ho gaya tha!)
                        <div className="flex flex-col h-full bg-white relative">
                            <div className="flex items-center px-4 py-2.5 border-b border-gray-200 shrink-0">
                                <div className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2.5 -mb-2.5 mr-6 cursor-pointer">Pre Built Strategies</div>
                                <div className="text-gray-500 hover:text-gray-700 cursor-pointer flex items-center gap-1">Rolling Straddle <span className="text-[10px]">📈</span></div>
                            </div>
                            
                            <div className="px-4 py-3 flex gap-2 shrink-0">
                                <button onClick={() => setActiveStrategyTab('Neutral')} className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Neutral' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Neutral</button>
                                <button onClick={() => setActiveStrategyTab('Bearish')} className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bearish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Bearish</button>
                                <button onClick={() => setActiveStrategyTab('Bullish')} className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bullish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Bullish</button>
                            </div>
                            
                            <div className="px-4 py-2 flex flex-wrap items-center justify-between border-b border-gray-100 gap-2 shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm font-medium">Expiry</span>
                                    <select 
                                        value={selectedExpiry}
                                        onChange={(e) => {
                                            const newExpiry = e.target.value;
                                            setSelectedExpiry(newExpiry); // 1. Tab ka header update karega
                                            fetchSimulatorData(time, newExpiry); // 🎯 NAYA FIX: 2. Option chain ka naya data mangayega!
                                        }}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 font-medium outline-none cursor-pointer focus:border-blue-500"
                                    >
                                        {availableExpiries.map((exp, index) => (
                                            <option key={index} value={exp}>
                                                {formatExpiryDisplay(exp)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
                                    <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">All</button>
                                    <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Risk Defined</button>
                                    <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Undefined Risk</button>
                                </div>
                            </div>
                            
                            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto custom-scrollbar flex-1 content-start">
                                {preBuiltStrategies.map((strategy, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-md p-2 flex flex-col items-center justify-between hover:shadow-md hover:border-blue-400 transition-all cursor-pointer bg-white group">
                                        <div className="w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 mb-2 mt-1">
                                            <img 
                                                src={strategy.image} 
                                                alt={strategy.name} 
                                                className="h-full max-w-[95%] object-contain" 
                                            />
                                        </div>
                                        <div className="text-center font-semibold text-gray-700 text-[11px] leading-tight">
                                            {strategy.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 🎯 NAYA: Quant Settings Modal */}
            {isQuantModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                ⚙️ Quant Engine Settings
                            </h2>
                            <button onClick={() => setIsQuantModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                        </div>

                        {/* Body (Inputs) */}
                        <div className="p-4 space-y-4 text-[13px] text-gray-700">
                            
                            {/* 🎯 NEW: Multi-Leg Strategy Pattern UI */}
                            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                                <div className="font-bold text-blue-800 text-xs mb-2 flex justify-between items-center">
                                    <span>🤖 AI Pattern Detected: Multi-Leg Strategy</span>
                                    <span className="text-gray-500 font-medium text-[10px]">Base ATM Premium: ₹{quantSettings.atmPremiumCache}</span>
                                </div>
                                
                                <div className="space-y-2 mt-3">
                                    <div className="text-[10px] font-bold text-gray-500 grid grid-cols-12 gap-2 px-2 border-b border-blue-200 pb-1">
                                        <div className="col-span-2">LEG</div>
                                        <div className="col-span-3">ACTION</div>
                                        <div className="col-span-7">DISTANCE FORMULA (Auto-Adjusting)</div>
                                    </div>
                                    
                                    {quantSettings.legsConfiguration.map((leg, idx) => (
                                        <div key={idx} className="bg-white border border-gray-200 rounded p-2 text-xs grid grid-cols-12 gap-2 items-center shadow-sm">
                                            <div className="col-span-2 font-bold text-gray-700">Leg {leg.id}</div>
                                            
                                            <div className="col-span-3">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${leg.side === 'B' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {leg.side === 'B' ? 'BUY' : 'SELL'}
                                                </span>
                                                <span className="ml-1 font-semibold">{leg.lots}x {leg.type}</span>
                                            </div>
                                            
                                            <div className="col-span-7 flex items-center gap-1 text-[11px] text-gray-600 whitespace-nowrap">
                                                <span className="font-semibold bg-gray-100 px-1 rounded">{leg.reference}</span>
                                                <span>± (</span>
                                                <input 
                                                    type="number" step="0.1" 
                                                    value={leg.multiplier} 
                                                    onChange={(e) => {
                                                        const newLegs = [...quantSettings.legsConfiguration];
                                                        newLegs[idx].multiplier = parseFloat(e.target.value) || 0;
                                                        setQuantSettings({...quantSettings, legsConfiguration: newLegs});
                                                    }}
                                                    className="border border-gray-300 rounded px-1 py-0.5 w-12 text-center outline-none focus:border-blue-500 font-bold" 
                                                />
                                                <span>× ATM Prem)</span>
                                                
                                                {/* 🎯 NAYA CODE: Yahan Points dikhenge */}
                                                <span className="ml-1 font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                    ≈ {Math.round(leg.multiplier * quantSettings.atmPremiumCache)} pts
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-[10px] text-gray-500 mt-2 text-right italic">
                                    * Engine will automatically round off strikes to nearest 100 for liquidity.
                                </div>
                            </div>

                            {/* 🧠 NAYA: Smart Credit Seeker UI */}
                            <div className="mb-4 bg-green-50 border border-green-200 rounded p-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={quantSettings.ensureNetCredit} 
                                        onChange={(e) => setQuantSettings({...quantSettings, ensureNetCredit: e.target.checked})} 
                                        className="accent-green-600 w-4 h-4" 
                                    />
                                    <span className="text-xs font-bold text-green-800">Ensure Net Credit Entry (Smart Auto-Adjust)</span>
                                </label>
                                
                                {quantSettings.ensureNetCredit && (
                                    <div className="ml-6 mt-2 flex items-center gap-2 border-t border-green-100 pt-2">
                                        <span className="text-[11px] text-gray-600 font-medium">Minimum Spread Width (Leg 1 & 2):</span>
                                        <input 
                                            type="number" step="50" 
                                            value={quantSettings.minSpreadWidth} 
                                            onChange={(e) => setQuantSettings({...quantSettings, minSpreadWidth: parseInt(e.target.value) || 0})} 
                                            className="border border-gray-300 rounded px-2 py-0.5 w-16 text-xs outline-none focus:border-green-500 text-center font-bold" 
                                        />
                                        <span className="text-[11px] text-gray-600">Points</span>
                                    </div>
                                )}
                            </div>

                            {/* SL & TP Rule */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold block mb-1">SL % Range</label>
                                    <div className="flex gap-1">
                                        <input type="number" step="0.1" value={quantSettings.slMin} onChange={e => setQuantSettings({...quantSettings, slMin: e.target.value})} className="border border-gray-300 rounded px-2 py-1.5 w-full outline-none" />
                                        <input type="number" step="0.1" value={quantSettings.slMax} onChange={e => setQuantSettings({...quantSettings, slMax: e.target.value})} className="border border-gray-300 rounded px-2 py-1.5 w-full outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">TP % Range</label>
                                    <div className="flex gap-1">
                                        <input type="number" step="0.1" value={quantSettings.tpMin} onChange={e => setQuantSettings({...quantSettings, tpMin: e.target.value})} className="border border-gray-300 rounded px-2 py-1.5 w-full outline-none" />
                                        <input type="number" step="0.1" value={quantSettings.tpMax} onChange={e => setQuantSettings({...quantSettings, tpMax: e.target.value})} className="border border-gray-300 rounded px-2 py-1.5 w-full outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Premium & EOD */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold block mb-1">Min Premium (₹)</label>
                                    <input type="number" value={quantSettings.premiumMin} onChange={e => setQuantSettings({...quantSettings, premiumMin: e.target.value})} className="border border-gray-300 rounded px-2 py-1.5 w-full outline-none" />
                                </div>
                                <div>
                                    <label className="font-semibold block mb-1">Expiry Day Exit Time</label>
                                    <input type="time" value={quantSettings.eodExitTime} onChange={e => setQuantSettings({...quantSettings, eodExitTime: e.target.value})} className="border border-gray-300 rounded px-2 py-1.5 w-full outline-none" />
                                </div>
                            </div>

                        </div>

                        {/* Footer Buttons */}
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                            <button onClick={() => setIsQuantModalOpen(false)} className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-100 font-medium text-[13px]">Cancel</button>
                            <button onClick={saveQuantBehaviorRule} className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-[13px] flex items-center gap-1">
                                💾 Save to Database
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulatorPage;