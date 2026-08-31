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

//     data.chain.forEach(row => {
//         const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
//         const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
        
//         if (ceOI > maxCallOI) maxCallOI = ceOI;
//         if (peOI > maxPutOI) maxPutOI = peOI;
//         if (ceOI > maxOverallOI) maxOverallOI = ceOI;
//         if (peOI > maxOverallOI) maxOverallOI = peOI;
//     });


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
//                             <span className="text-gray-600 w-1/4">ATM IV: <span className="font-semibold text-gray-900">11.8</span></span>
//                             <div className="flex justify-center items-center gap-3 text-gray-600 w-2/4">
//                                 <span>ATM:</span>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Spot</label>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" defaultChecked /> Fut</label>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Synth Fut</label>
//                             </div>
//                             <span className="text-gray-600 w-1/4 text-right">Straddle Prem: <span className="font-semibold text-gray-900">137</span></span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-600 w-1/4">PCR: <span className="font-semibold text-gray-900">0.82</span></span>
//                             <div className="flex justify-center items-center text-[11px] w-2/4 bg-gray-50 py-1 px-2 rounded">
//                                 <span className="text-gray-900 font-semibold mr-1">16.8Cr</span><span className="text-green-500 font-medium mr-2">(+1.5Cr)</span>
//                                 <span className="text-gray-300 mx-1">—</span><span className="text-gray-400 font-medium">OI</span><span className="text-gray-300 mx-1">—</span>
//                                 <span className="text-gray-900 font-semibold mr-1">13.8Cr</span><span className="text-green-500 font-medium">(+33.8L)</span>
//                             </div>
//                             <span className="text-gray-600 w-1/4 text-right">Max Pain: <span className="font-semibold text-gray-900">24350</span></span>
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
//                                                         <div className={`absolute right-2 z-10 text-[11px] font-medium ${isMaxCallOI ? 'text-red-500 opacity-100 font-bold' : 'text-red-400 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
//                                                             {formatOI(callOiRaw)}
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
//                                                         <div className={`absolute left-2 z-10 text-[11px] font-medium ${isMaxPutOI ? 'text-green-600 opacity-100 font-bold' : 'text-green-500 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
//                                                             {formatOI(putOiRaw)}
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

//     data.chain.forEach(row => {
//         const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
//         const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
        
//         if (ceOI > maxCallOI) maxCallOI = ceOI;
//         if (peOI > maxPutOI) maxPutOI = peOI;
//         if (ceOI > maxOverallOI) maxOverallOI = ceOI;
//         if (peOI > maxOverallOI) maxOverallOI = peOI;
//     });


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
//                             <span className="text-gray-600 w-1/4">ATM IV: <span className="font-semibold text-gray-900">11.8</span></span>
//                             <div className="flex justify-center items-center gap-3 text-gray-600 w-2/4">
//                                 <span>ATM:</span>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Spot</label>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" defaultChecked /> Fut</label>
//                                 <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Synth Fut</label>
//                             </div>
//                             <span className="text-gray-600 w-1/4 text-right">Straddle Prem: <span className="font-semibold text-gray-900">137</span></span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-600 w-1/4">PCR: <span className="font-semibold text-gray-900">0.82</span></span>
//                             <div className="flex justify-center items-center text-[11px] w-2/4 bg-gray-50 py-1 px-2 rounded">
//                                 <span className="text-gray-900 font-semibold mr-1">16.8Cr</span><span className="text-green-500 font-medium mr-2">(+1.5Cr)</span>
//                                 <span className="text-gray-300 mx-1">—</span><span className="text-gray-400 font-medium">OI</span><span className="text-gray-300 mx-1">—</span>
//                                 <span className="text-gray-900 font-semibold mr-1">13.8Cr</span><span className="text-green-500 font-medium">(+33.8L)</span>
//                             </div>
//                             <span className="text-gray-600 w-1/4 text-right">Max Pain: <span className="font-semibold text-gray-900">24350</span></span>
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
import { Camera, Search, Download, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import shortStraddleImg from '../../assets/strategiesImage/ShortStraddle.png';
import longStraddleImg from '../../assets/strategiesImage/LongStraddle.png';

// 🧮 BSM Delta Calculator Logic
const normalCDF = (x) => {
    let t = 1 / (1 + 0.2316419 * Math.abs(x));
    let d = 0.3989423 * Math.exp(-x * x / 2);
    let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
};


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
    if (!value || isNaN(value)) return '';
    let num = parseFloat(value);
    if (num === 0) return '';
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


    const [expiryDates, setExpiryDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // 🎯 SMART TRADER: Expiry manage karne ke liye naye states
    const [availableExpiries, setAvailableExpiries] = useState([]);
    const [selectedExpiry, setSelectedExpiry] = useState("");

    // 🎯 SMART UI: Expiry Slider ke states
    const [expiryStartIndex, setExpiryStartIndex] = useState(0);
    const [visibleExpiriesCount, setVisibleExpiriesCount] = useState(5); // Default for desktop

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
            setData({
                spotPrice: res.data.spotPrice,
                chain: res.data.chain,
                dte: res.data.dte
            });

            // 🎯 THE FIX: Hamesha naye din ki expiries list ko update karo
            if (res.data.availableExpiries) {
                setAvailableExpiries(res.data.availableExpiries);
                
                // Agar 'currentExpiry' list me nahi hai (yani user ne date change ki hai), 
                // toh list ki pehli (nearest) expiry ko auto-select kar lo
                if (!currentExpiry || !res.data.availableExpiries.includes(currentExpiry)) {
                    setSelectedExpiry(res.data.availableExpiries[0] || "");
                }
            }
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
    const getTabDteInfo = (simDateStr, expDateStr) => {
        if (!simDateStr || !expDateStr) return { dte: 0, label: 'CW' };
        
        const simDate = new Date(simDateStr);
        const expDate = new Date(expDateStr);
        
        // 1. Dino (Days) ka difference nikalna
        const diffTime = expDate.getTime() - simDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // 2. Mahino (Months) ka difference nikalna (Saal badalne par bhi sahi kaam karega)
        const monthDiff = (expDate.getFullYear() - simDate.getFullYear()) * 12 + (expDate.getMonth() - simDate.getMonth());
        
        let label = 'CW';
        if (diffDays <= 7) {
            label = 'CW'; // Current Week (0 se 7 din)
        } else if (diffDays <= 14) {
            label = 'NW'; // Next Week (8 se 14 din)
        } else {
            // Agar expiry 2 mahine aage ki hai (jaise August se October), toh wo Next Month (NM) hogi
            if (monthDiff >= 2) {
                label = 'NM'; 
            } else {
                label = 'CM'; // Current Month
            }
        }
        
        return { dte: diffDays, label };
    };

    const preBuiltStrategies = [
        { name: "Short Straddle", type: "Neutral", image: shortStraddleImg },
        { name: "Long Straddle", type: "Neutral", image: longStraddleImg },
        { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
        { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
        { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
        { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">
            {/* 1. TOP BAR */}
            <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm relative z-50">
                
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
                        <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-blue-50 shadow-sm rounded text-gray-700 text-[11px] md:text-sm font-medium min-w-[36px] text-center">1m+</button>
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
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                
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
            <div className="p-2 md:p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* --- LEFT: OPTION CHAIN --- */}
                <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">
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
                        <div className="font-semibold text-gray-800">
                            Option Chain <span className="font-normal text-gray-500">
                                {selectedExpiry ? formatHeaderDate(selectedExpiry).replace("'", "") : ""}
                            </span>
                        </div>
                        <div className="w-16"></div> 
                    </div>

                    <div className="flex items-center border-b border-gray-200 overflow-hidden shrink-0 w-full">
                        {/* LEFT ARROW */}
                        <button 
                            onClick={handlePrevExpiries}
                            disabled={expiryStartIndex === 0}
                            className={`p-2 transition-colors ${expiryStartIndex === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-200'}`}
                        >
                            <ChevronLeft size={16}/>
                        </button>
                        
                        {/* 🎯 FIX: 'justify-center' हटाया और 'w-full' लगाया */}
                        <div className="flex-1 flex w-full transition-all duration-300">
                            {/* Sliced Expiry Dates Loop */}
                            {availableExpiries
                                .slice(expiryStartIndex, expiryStartIndex + visibleExpiriesCount)
                                .map((expDate, idx) => {
                                const tabInfo = getTabDteInfo(date, expDate); 

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => {
                                            setSelectedExpiry(expDate);
                                            fetchSimulatorData(time, expDate);
                                        }}
                                        // 🎯 FIX: Fixed width हटाकर 'flex-1' लगाया ताकि ये पूरा स्पेस बराबर बाँट लें
                                        className={`flex-1 px-1 md:px-2 py-2 flex flex-col items-center justify-center cursor-pointer transition-colors
                                            ${selectedExpiry === expDate 
                                                ? 'border-b-2 border-blue-500 bg-blue-50' 
                                                : 'hover:bg-gray-50 border-b-2 border-transparent'
                                            }`}
                                    >
                                        <span className={`font-semibold text-sm ${selectedExpiry === expDate ? 'text-blue-600' : 'text-gray-500 font-medium'}`}>
                                            {formatHeaderDate(expDate)}
                                        </span>
                                        
                                        <span className={`text-[10px] ${selectedExpiry === expDate ? 'text-gray-500' : 'text-gray-400'}`}>
                                            ({tabInfo.label}: {tabInfo.dte} DTE)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RIGHT ARROW */}
                        <button 
                            onClick={handleNextExpiries}
                            disabled={expiryStartIndex + visibleExpiriesCount >= availableExpiries.length}
                            className={`p-2 transition-colors ${expiryStartIndex + visibleExpiriesCount >= availableExpiries.length ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-200'}`}
                        >
                            <ChevronRight size={16}/>
                        </button>
                    </div>

                    <div className="p-3 border-b border-gray-200 text-[12px] space-y-3 bg-white shrink-0">
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
                            <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-30">
                                <tr>
                                    <th className="py-2 px-2 font-medium w-[25%]">Call LTP {addons.delta && '(Δ)'}</th>
                                    {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
                                    
                                    <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200 shadow-[inset_0_-1px_0_0_#e5e7eb] w-[20%]">Strike</th>
                                    
                                    {/* 🎯 SINGLE SMART IV COLUMN */}
                                    {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
                                    
                                    {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
                                    <th className="py-2 px-2 font-medium w-[25%]">Put LTP {addons.delta && '(Δ)'}</th>
                                </tr>
                            </thead>
                            
                            <tbody className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                {data.chain.length === 0 && loading ? (
                                    <tr><td colSpan="7" className="py-10 text-gray-400 font-medium">Loading Option Chain...</td></tr>
                                ) : data.chain.map((row, idx) => {
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
                                                <div className="font-semibold text-gray-800">
                                                    {/* 🎯 NAYA LIVE CALL DELTA YAHAN UPDATE KIYA HAI */}
                                                    {row.CE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({ceDeltaLive})</span>}
                                                </div>
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
                                                    <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
                                                </div>
                                            </td>

                                            {/* CALL OI GRAPH */}
                                            {addons.oi && (
                                                <td className={`relative p-0 h-full ${callBg}`}>
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
                                                <td className={`relative p-0 h-full ${putBg}`}>
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
                                                <div className="font-semibold text-gray-800">
                                                    {/* 🎯 NAYA LIVE PUT DELTA YAHAN UPDATE KIYA HAI */}
                                                    {row.PE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({peDeltaLive})</span>}
                                                </div>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
                                                    <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- RIGHT: PRE-BUILT STRATEGIES --- */}
                <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">
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
                            {/* <span className="text-gray-500">Expiry</span> */}
                            {/* 🎯 DYNAMIC EXPIRY DROPDOWN */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-gray-500 text-sm font-medium">Expiry</span>
                                <select 
                                    value={selectedExpiry}
                                    onChange={(e) => setSelectedExpiry(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 font-medium outline-none cursor-pointer focus:border-blue-500"
                                >
                                    {availableExpiries.map((exp, index) => (
                                        <option key={index} value={exp}>
                                            {formatExpiryDisplay(exp)}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                {/* 🎯 FIX: Image ki height h-24 (96px) se ghata kar h-14 (56px) kar di, aur margin (mb-3 -> mb-1) kam kiya */}
                                <div className="w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 mb-2 mt-1">
                                    <img 
                                        src={strategy.image} 
                                        alt={strategy.name} 
                                        className="h-full max-w-[95%] object-contain" 
                                    />
                                </div>

                                {/* 🎯 FIX: Text ko thoda compact (text-[11px]) aur medium font me kiya */}
                                <div className="text-center font-semibold text-gray-700 text-[11px] leading-tight">
                                    {strategy.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulatorPage;