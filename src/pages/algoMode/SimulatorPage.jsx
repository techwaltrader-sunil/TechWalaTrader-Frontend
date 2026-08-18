// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Play, SkipBack, SkipForward, FastForward, Rewind } from 'lucide-react';

// const SimulatorPage = () => {
//     // State management
//     const [date, setDate] = useState('2026-08-17'); // Abhi hardcoded, baad me dynamic picker laga sakte ho
//     const [time, setTime] = useState('09:15');
//     const [data, setData] = useState({ spotPrice: 0, chain: [] });
//     const [loading, setLoading] = useState(false);

//     // Fetch data from backend API
//     const fetchSimulatorData = async (selectedTime) => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`http://localhost:5500/api/simulator/data`, {
//                 params: { date: date, time: selectedTime }
//             });
//             if (res.data.success) {
//                 setData({
//                     spotPrice: res.data.spotPrice,
//                     chain: res.data.chain
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching simulator data:", error);
//         }
//         setLoading(false);
//     };

//     // Jab bhi time change ho, data fetch karo
//     useEffect(() => {
//         fetchSimulatorData(time);
//     }, [time, date]);

//     // Time Travel Logic (Time Machine)
//     const handleTimeChange = (minutesToAdd) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         let newDate = new Date();
//         newDate.setHours(hours, minutes + minutesToAdd, 0, 0);

//         let newHours = newDate.getHours();
//         let newMins = newDate.getMinutes();

//         // Market limits check (09:15 to 15:30)
//         if (newHours < 9 || (newHours === 9 && newMins < 15)) {
//             newHours = 9; newMins = 15;
//         } else if (newHours > 15 || (newHours === 15 && newMins > 30)) {
//             newHours = 15; newMins = 30;
//         }

//         const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
//         setTime(formattedTime);
//     };

//     // Calculate ATM Strike
//     const getAtmStrike = () => {
//         if (!data.spotPrice || data.chain.length === 0) return null;
//         // Find the strike closest to Spot Price
//         return data.chain.reduce((prev, curr) =>
//             Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
//         ).strike;
//     };

//     const atmStrike = getAtmStrike();

//     return (
//         <div className="p-4 md:p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">

//             {/* Top Navigation & Time Controls (Stockmock Style) */}
//             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-4">

//                 {/* Spot Price Info */}
//                 <div className="flex flex-col">
//                     <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">Nifty Spot Price</span>
//                     <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                         {data.spotPrice ? data.spotPrice.toFixed(2) : '---'}
//                     </span>
//                 </div>

//                 {/* Time Machine Buttons */}
//                 <div className="flex items-center space-x-1 md:space-x-2 bg-gray-100 dark:bg-slate-900 p-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
//                     <button onClick={() => handleTimeChange(-30)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm">-30m</button>
//                     <button onClick={() => handleTimeChange(-5)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm">-5m</button>
//                     <button onClick={() => handleTimeChange(-1)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm">-1m</button>

//                     <div className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-md flex items-center gap-2 shadow-md">
//                         {date} <span className="opacity-50">|</span> {time}
//                     </div>

//                     <button onClick={() => handleTimeChange(1)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm">+1m</button>
//                     <button onClick={() => handleTimeChange(5)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm">+5m</button>
//                     <button onClick={() => handleTimeChange(30)} className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm">+30m</button>
//                 </div>
//             </div>

//             {/* Option Chain Table */}
//             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-center">
//                         <thead className="bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 uppercase font-semibold">
//                             <tr>
//                                 <th className="px-4 py-3 border-r border-gray-200 dark:border-slate-700" colSpan="3">CALLS</th>
//                                 <th className="px-4 py-3 bg-gray-200 dark:bg-slate-800 border-r border-gray-300 dark:border-slate-600 w-32">STRIKE</th>
//                                 <th className="px-4 py-3" colSpan="3">PUTS</th>
//                             </tr>
//                             <tr className="text-xs text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700">
//                                 <th className="px-2 py-2">Volume</th>
//                                 <th className="px-2 py-2">Delta</th>
//                                 <th className="px-2 py-2 border-r border-gray-200 dark:border-slate-700">LTP</th>
//                                 <th className="px-4 py-2 bg-gray-50 dark:bg-slate-800 border-r border-gray-300 dark:border-slate-600">ATM: {atmStrike || '---'}</th>
//                                 <th className="px-2 py-2">LTP</th>
//                                 <th className="px-2 py-2">Delta</th>
//                                 <th className="px-2 py-2">Volume</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {loading ? (
//                                 <tr><td colSpan="7" className="py-10 text-gray-500 font-medium">Fetching 1-min data via Time Machine... ⏳</td></tr>
//                             ) : data.chain.map((row, idx) => {
//                                 const isATM = row.strike === atmStrike;
//                                 const isCallITM = row.strike < atmStrike;
//                                 const isPutITM = row.strike > atmStrike;

//                                 // Stockmock jaisa Background Color Logic
//                                 const callBg = isCallITM ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-slate-800';
//                                 const putBg = isPutITM ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-white dark:bg-slate-800';
//                                 const strikeBg = isATM ? 'bg-blue-100 dark:bg-blue-900/40 font-bold border-y-2 border-blue-400' : 'bg-gray-50 dark:bg-slate-900';

//                                 return (
//                                     <tr key={idx} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
//                                         {/* CE Data */}
//                                         <td className={`px-2 py-2 text-gray-500 ${callBg}`}>{row.CE?.volume || '-'}</td>
//                                         <td className={`px-2 py-2 text-gray-500 ${callBg}`}>{row.CE?.delta ? parseFloat(row.CE.delta).toFixed(2) : '-'}</td>
//                                         <td className={`px-2 py-2 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-slate-700 ${callBg}`}>
//                                             {row.CE?.ltp || '-'}
//                                         </td>

//                                         {/* Strike */}
//                                         <td className={`px-4 py-2 text-sm text-gray-800 dark:text-slate-200 border-r border-gray-300 dark:border-slate-600 ${strikeBg}`}>
//                                             {row.strike}
//                                             {isATM && <span className="block text-[10px] text-blue-600 dark:text-blue-400 -mt-1">(ATM)</span>}
//                                         </td>

//                                         {/* PE Data */}
//                                         <td className={`px-2 py-2 font-semibold text-gray-900 dark:text-white ${putBg}`}>
//                                             {row.PE?.ltp || '-'}
//                                         </td>
//                                         <td className={`px-2 py-2 text-gray-500 ${putBg}`}>{row.PE?.delta ? parseFloat(row.PE.delta).toFixed(2) : '-'}</td>
//                                         <td className={`px-2 py-2 text-gray-500 ${putBg}`}>{row.PE?.volume || '-'}</td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SimulatorPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Camera, Search, Save, Download, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

// const SimulatorPage = () => {
//     // --- STATE MANAGEMENT ---
//     const [date, setDate] = useState('2026-08-17');
//     const [time, setTime] = useState('09:15');
//     const [data, setData] = useState({ spotPrice: 0, chain: [] });
//     const [loading, setLoading] = useState(false);
//     const [activeStrategyTab, setActiveStrategyTab] = useState('Neutral');

//     // --- FETCH DATA ---
//     const fetchSimulatorData = async (selectedTime) => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`http://localhost:5500/api/simulator/data`, {
//                 params: { date: date, time: selectedTime }
//             });
//             if (res.data.success) {
//                 setData({
//                     spotPrice: res.data.spotPrice,
//                     chain: res.data.chain
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching simulator data:", error);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchSimulatorData(time);
//     }, [time, date]);

//     // --- TIME TRAVEL LOGIC ---
//     const handleTimeChange = (minutesToAdd) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         let newDate = new Date();
//         newDate.setHours(hours, minutes + minutesToAdd, 0, 0);

//         let newHours = newDate.getHours();
//         let newMins = newDate.getMinutes();

//         // Market limits check (09:15 to 15:30)
//         if (newHours < 9 || (newHours === 9 && newMins < 15)) {
//             newHours = 9; newMins = 15;
//         } else if (newHours > 15 || (newHours === 15 && newMins > 30)) {
//             newHours = 15; newMins = 30;
//         }

//         const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
//         setTime(formattedTime);
//     };

//     const getAtmStrike = () => {
//         if (!data.spotPrice || data.chain.length === 0) return null;
//         return data.chain.reduce((prev, curr) =>
//             Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
//         ).strike;
//     };

//     const atmStrike = getAtmStrike();

//     // --- MOCK PRE-BUILT STRATEGIES ---
//     const preBuiltStrategies = [
//         { name: "Short Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Short_Straddle.svg/300px-Short_Straddle.svg.png" },
//         { name: "Long Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Long_Straddle.svg/300px-Long_Straddle.svg.png" },
//         { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
//         { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
//         { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//         { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" }, // Reusing for UI mockup
//     ];

//     return (
//         <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">

//             {/* ========================================== */}
//             {/* 1. TOP BAR: Instrument & Time Controls */}
//             {/* ========================================== */}
//             <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">

//                 {/* Left: Instrument Selector */}
//                 <div className="w-full xl:w-auto flex justify-between xl:justify-start items-center">
//                     <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 focus:outline-none focus:border-blue-500">
//                         <option>Nifty</option>
//                         <option>BankNifty</option>
//                         <option>FinNifty</option>
//                     </select>
//                     {/* Mobile Snapshot Icon */}
//                     <button className="xl:hidden text-gray-500 hover:text-gray-700 flex items-center gap-1">
//                         <Camera size={16} /> Snapshot
//                     </button>
//                 </div>

//                 {/* Center: Time Controls (Stockmock Style Row) */}
//                 <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 w-full xl:w-auto">
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">&lt;&lt; Day</button>
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">SOD</button>

//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-2h</button>
//                     <button onClick={() => handleTimeChange(-30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-30m</button>
//                     <button onClick={() => handleTimeChange(-15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-15m</button>
//                     <button onClick={() => handleTimeChange(-5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-5m</button>
//                     <button onClick={() => handleTimeChange(-1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-1m</button>

//                     {/* Date & Time Display */}
//                     <div className="flex items-center gap-2 mx-1">
//                         <div className="border border-gray-300 px-3 py-1 bg-white font-medium rounded shadow-inner">
//                             Mon, Aug 17, 2026
//                         </div>
//                         <div className="flex gap-1">
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[0]} readOnly>
//                                 <option>{time.split(':')[0]}</option>
//                             </select>
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[1]} readOnly>
//                                 <option>{time.split(':')[1]}</option>
//                             </select>
//                         </div>
//                     </div>

//                     <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">1m+</button>
//                     <button onClick={() => handleTimeChange(5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">5m+</button>
//                     <button onClick={() => handleTimeChange(15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">15m+</button>
//                     <button onClick={() => handleTimeChange(30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">30m+</button>
//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">2h+</button>

//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">EOD</button>
//                     <button className="px-2 py-1 text-gray-300 cursor-not-allowed rounded">Day &gt;&gt;</button>
//                 </div>

//                 {/* Right: Snapshot (Desktop) */}
//                 <div className="hidden xl:flex w-40 justify-end">
//                     <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
//                         <Camera size={16} /> Snapshot
//                     </button>
//                 </div>
//             </div>

//             {/* ========================================== */}
//             {/* 2. STATS & ACTION BUTTONS */}
//             {/* ========================================== */}
//             <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">

//                 {/* Stats Row */}
//                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 font-medium">
//                     <div className="flex items-center gap-2 text-green-600">
//                         <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">+</span> Add Futures
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Day Open:</span> 24343.5 <span className="text-red-500">(-23pt, -0.1%)</span>
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Spot:</span> {data.spotPrice ? data.spotPrice : '---'} <span className="text-red-500">(-36pt, -0.1%)</span>
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Fut:</span> 24361.4
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Synth Fut:</span> 24320.8 <span className="text-gray-400 font-normal">(18 AUG)</span>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap items-center justify-center gap-2">
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded font-medium transition-colors">
//                         <Search size={14} /> Strategy Finder
//                     </button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded font-medium transition-colors">
//                         Saved Strategies
//                     </button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-gray-900 font-medium transition-colors">
//                         <Download size={14} /> Import Strategy
//                     </button>
//                 </div>
//             </div>

//             {/* ========================================== */}
//             {/* 3. MAIN GRID: Option Chain & Pre-Built Strategies */}
//             {/* ========================================== */}
//             <div className="p-2 md:p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">

//                 {/* --- LEFT: OPTION CHAIN (col-span 7) --- */}
//                 <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col">
//                     {/* Header */}
//                     <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50">
//                         <div className="flex items-center gap-1 text-gray-600 cursor-pointer">
//                             <Settings size={14} /> Add ons <span className="text-[10px]">▼</span>
//                         </div>
//                         <div className="font-semibold text-gray-800">Option Chain <span className="font-normal text-gray-500">(18 AUG 2026)</span></div>
//                         <div className="w-16"></div> {/* Spacer for center alignment */}
//                     </div>

//                     {/* Expiry Tabs */}
//                     <div className="flex items-center border-b border-gray-200 overflow-x-auto custom-scrollbar">
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronLeft size={16}/></button>
//                         <div className="flex-1 flex min-w-max">
//                             <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 bg-blue-50 text-center cursor-pointer">
//                                 <div className="font-semibold">18 AUG '26</div>
//                                 <div className="text-[10px] text-gray-500">(CW: 1 DTE)</div>
//                             </div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-center cursor-pointer">
//                                 <div className="font-medium">25 AUG '26</div>
//                                 <div className="text-[10px] text-gray-400">(NW/CM: 8 DTE)</div>
//                             </div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center cursor-pointer">
//                                 <span className="font-medium">1 SEP '26</span>
//                             </div>
//                         </div>
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronRight size={16}/></button>
//                     </div>

//                     {/* IV / PCR / Max Pain Stats */}
//                     <div className="p-3 border-b border-gray-200 text-[12px] space-y-2">
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-600">ATM IV: <span className="font-semibold text-gray-900">11.8</span></span>
//                             <span className="text-gray-600">Straddle Prem: <span className="font-semibold text-gray-900">137</span></span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-600">PCR: <span className="font-semibold text-gray-900">0.82</span></span>
//                             <span className="text-gray-600">Max Pain: <span className="font-semibold text-gray-900">24350</span></span>
//                         </div>
//                         <div className="flex justify-center items-center gap-4 text-gray-600">
//                             ATM:
//                             <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" /> Spot</label>
//                             <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" defaultChecked /> Fut</label>
//                             <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" /> Synth Fut</label>
//                         </div>
//                     </div>

//                     {/* Table Data */}
//                     <div className="flex-1 overflow-x-auto bg-white">
//                         <table className="w-full text-center">
//                             <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-10">
//                                 <tr>
//                                     <th className="py-2 px-2 font-medium">Call LTP (Δ)</th>
//                                     <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200">Strike</th>
//                                     <th className="py-2 px-2 font-medium">Put LTP (Δ)</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr><td colSpan="3" className="py-10 text-gray-400">Loading Option Chain...</td></tr>
//                                 ) : data.chain.map((row, idx) => {
//                                     const isATM = row.strike === atmStrike;
//                                     const isCallITM = row.strike < atmStrike;
//                                     const isPutITM = row.strike > atmStrike;

//                                     const callBg = isCallITM ? 'bg-[#fffde7]' : 'bg-white';
//                                     const putBg = isPutITM ? 'bg-[#e0f7fa]' : 'bg-white';
//                                     const strikeBg = isATM ? 'bg-[#e3f2fd]' : 'bg-gray-50';

//                                     return (
//                                         <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 group">
//                                             {/* CALLS */}
//                                             <td className={`py-1.5 px-2 relative ${callBg}`}>
//                                                 <div className="font-semibold text-gray-800">{row.CE?.ltp || '-'} <span className="font-normal text-gray-400">({row.CE?.delta ? parseFloat(row.CE.delta).toFixed(2) : '-'})</span></div>
//                                                 {/* Hidden B/S Buttons on Hover */}
//                                                 <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold">B</button>
//                                                     <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold">S</button>
//                                                 </div>
//                                             </td>

//                                             {/* STRIKE */}
//                                             <td className={`py-1.5 px-2 border-x border-gray-200 ${strikeBg}`}>
//                                                 <div className="font-semibold text-gray-700">{row.strike}</div>
//                                                 {isATM && <div className="text-[10px] text-gray-500 leading-none -mt-0.5">(ATM)</div>}
//                                                 {!isATM && <div className="text-[10px] text-gray-400 leading-none -mt-0.5">(ATM {row.strike > atmStrike ? '+' : ''}{row.strike - atmStrike})</div>}
//                                             </td>

//                                             {/* PUTS */}
//                                             <td className={`py-1.5 px-2 relative ${putBg}`}>
//                                                 <div className="font-semibold text-gray-800">{row.PE?.ltp || '-'} <span className="font-normal text-gray-400">({row.PE?.delta ? parseFloat(row.PE.delta).toFixed(2) : '-'})</span></div>
//                                                 {/* Hidden B/S Buttons on Hover */}
//                                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold">B</button>
//                                                     <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold">S</button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* --- RIGHT: PRE-BUILT STRATEGIES (col-span 5) --- */}
//                 <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-full">

//                     {/* Header */}
//                     <div className="flex items-center px-4 py-2.5 border-b border-gray-200">
//                         <div className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2.5 -mb-2.5 mr-6 cursor-pointer">Pre Built Strategies</div>
//                         <div className="text-gray-500 hover:text-gray-700 cursor-pointer flex items-center gap-1">Rolling Straddle <span className="text-[10px]">📈</span></div>
//                     </div>

//                     {/* Market View Tabs */}
//                     <div className="px-4 py-3 flex gap-2">
//                         <button
//                             onClick={() => setActiveStrategyTab('Neutral')}
//                             className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Neutral' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
//                         >Neutral</button>
//                         <button
//                             onClick={() => setActiveStrategyTab('Bearish')}
//                             className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bearish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
//                         >Bearish</button>
//                         <button
//                             onClick={() => setActiveStrategyTab('Bullish')}
//                             className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bullish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
//                         >Bullish</button>
//                     </div>

//                     {/* Expiry & Filters */}
//                     <div className="px-4 py-2 flex flex-wrap items-center justify-between border-b border-gray-100 gap-2">
//                         <div className="flex items-center gap-2">
//                             <span className="text-gray-500">Expiry</span>
//                             <select className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none">
//                                 <option>18 AUG 2026</option>
//                             </select>
//                         </div>
//                         <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
//                             <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">All</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Risk Defined</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Undefined Risk</button>
//                         </div>
//                     </div>

//                     {/* Strategy Cards Grid */}
//                     <div className="p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
//                         {preBuiltStrategies.map((strategy, idx) => (
//                             <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white group">
//                                 <div className="h-16 w-full mb-3 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
//                                     {/* Placeholder for SVG Payoff charts */}
//                                     <img src={strategy.image} alt={strategy.name} className="h-full object-contain filter grayscale group-hover:grayscale-0" />
//                                 </div>
//                                 <div className="text-center font-semibold text-gray-700 text-xs">
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

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Camera, Search, Download, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

// const SimulatorPage = () => {
//     // --- STATE MANAGEMENT ---
//     const [date, setDate] = useState('2026-08-17');
//     const [time, setTime] = useState('09:15');
//     const [data, setData] = useState({ spotPrice: 0, chain: [] });
//     const [loading, setLoading] = useState(false);
//     const [activeStrategyTab, setActiveStrategyTab] = useState('Neutral');

//     // --- FETCH DATA ---
//     const fetchSimulatorData = async (selectedTime) => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`http://localhost:5500/api/simulator/data`, {
//                 params: { date: date, time: selectedTime }
//             });
//             if (res.data.success) {
//                 setData({
//                     spotPrice: res.data.spotPrice,
//                     chain: res.data.chain
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching simulator data:", error);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchSimulatorData(time);
//     }, [time, date]);

//     // --- TIME TRAVEL LOGIC ---
//     const handleTimeChange = (minutesToAdd) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         let newDate = new Date();
//         newDate.setHours(hours, minutes + minutesToAdd, 0, 0);

//         let newHours = newDate.getHours();
//         let newMins = newDate.getMinutes();

//         if (newHours < 9 || (newHours === 9 && newMins < 15)) {
//             newHours = 9; newMins = 15;
//         } else if (newHours > 15 || (newHours === 15 && newMins > 30)) {
//             newHours = 15; newMins = 30;
//         }

//         const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
//         setTime(formattedTime);
//     };

//     const getAtmStrike = () => {
//         if (!data.spotPrice || data.chain.length === 0) return null;
//         return data.chain.reduce((prev, curr) =>
//             Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
//         ).strike;
//     };

//     const atmStrike = getAtmStrike();

//     // --- MOCK PRE-BUILT STRATEGIES ---
//     const preBuiltStrategies = [
//         { name: "Short Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Short_Straddle.svg/300px-Short_Straddle.svg.png" },
//         { name: "Long Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Long_Straddle.svg/300px-Long_Straddle.svg.png" },
//         { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
//         { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
//         { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//         { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//     ];

//     return (
//         <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">

//             {/* ========================================== */}
//             {/* 1. TOP BAR: Instrument & Time Controls */}
//             {/* ========================================== */}
//             <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">

//                 <div className="w-full xl:w-auto flex justify-between xl:justify-start items-center">
//                     <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 focus:outline-none focus:border-blue-500">
//                         <option>Nifty</option>
//                         <option>BankNifty</option>
//                         <option>FinNifty</option>
//                     </select>
//                     <button className="xl:hidden text-gray-500 hover:text-gray-700 flex items-center gap-1">
//                         <Camera size={16} /> Snapshot
//                     </button>
//                 </div>

//                 <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 w-full xl:w-auto">
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">&lt;&lt; Day</button>
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">SOD</button>

//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-2h</button>
//                     <button onClick={() => handleTimeChange(-30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-30m</button>
//                     <button onClick={() => handleTimeChange(-15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-15m</button>
//                     <button onClick={() => handleTimeChange(-5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-5m</button>
//                     <button onClick={() => handleTimeChange(-1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-1m</button>

//                     <div className="flex items-center gap-2 mx-1">
//                         <div className="border border-gray-300 px-3 py-1 bg-white font-medium rounded shadow-inner">
//                             Mon, Aug 17, 2026
//                         </div>
//                         <div className="flex gap-1">
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[0]} readOnly>
//                                 <option>{time.split(':')[0]}</option>
//                             </select>
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[1]} readOnly>
//                                 <option>{time.split(':')[1]}</option>
//                             </select>
//                         </div>
//                     </div>

//                     <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">1m+</button>
//                     <button onClick={() => handleTimeChange(5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">5m+</button>
//                     <button onClick={() => handleTimeChange(15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">15m+</button>
//                     <button onClick={() => handleTimeChange(30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">30m+</button>
//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">2h+</button>

//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">EOD</button>
//                     <button className="px-2 py-1 text-gray-300 cursor-not-allowed rounded">Day &gt;&gt;</button>
//                 </div>

//                 <div className="hidden xl:flex w-40 justify-end">
//                     <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
//                         <Camera size={16} /> Snapshot
//                     </button>
//                 </div>
//             </div>

//             {/* ========================================== */}
//             {/* 2. STATS & ACTION BUTTONS */}
//             {/* ========================================== */}
//             <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">

//                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 font-medium">
//                     <div className="flex items-center gap-2 text-green-600">
//                         <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">+</span> Add Futures
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Day Open:</span> 24343.5 <span className="text-red-500">(-23pt, -0.1%)</span>
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Spot:</span> {data.spotPrice ? data.spotPrice : '---'} <span className="text-red-500">(-36pt, -0.1%)</span>
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Fut:</span> 24361.4
//                     </div>
//                     <div>
//                         <span className="text-gray-500">Synth Fut:</span> 24320.8 <span className="text-gray-400 font-normal">(18 AUG)</span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap items-center justify-center gap-2">
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded font-medium transition-colors">
//                         <Search size={14} /> Strategy Finder
//                     </button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded font-medium transition-colors">
//                         Saved Strategies
//                     </button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-gray-900 font-medium transition-colors">
//                         <Download size={14} /> Import Strategy
//                     </button>
//                 </div>
//             </div>

//             {/* ========================================== */}
//             {/* 3. MAIN GRID: Option Chain & Pre-Built Strategies */}
//             {/* ========================================== */}
//             <div className="p-2 md:p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">

//                 {/* --- LEFT: OPTION CHAIN (col-span 6) --- */}
//                 <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">

//                     {/* Header */}
//                     <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0">
//                         <div className="flex items-center gap-1 text-gray-600 cursor-pointer">
//                             <Settings size={14} /> Add ons <span className="text-[10px]">▼</span>
//                         </div>
//                         <div className="font-semibold text-gray-800">Option Chain <span className="font-normal text-gray-500">(18 AUG 2026)</span></div>
//                         <div className="w-16"></div>
//                     </div>

//                     {/* Expiry Tabs */}
//                     <div className="flex items-center border-b border-gray-200 overflow-x-auto custom-scrollbar shrink-0">
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronLeft size={16}/></button>
//                         <div className="flex-1 flex min-w-max">
//                             <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 bg-blue-50 text-center cursor-pointer">
//                                 <div className="font-semibold">18 AUG '26</div>
//                                 <div className="text-[10px] text-gray-500">(CW: 1 DTE)</div>
//                             </div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-center cursor-pointer">
//                                 <div className="font-medium">25 AUG '26</div>
//                                 <div className="text-[10px] text-gray-400">(NW/CM: 8 DTE)</div>
//                             </div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center cursor-pointer">
//                                 <span className="font-medium">1 SEP '26</span>
//                             </div>
//                         </div>
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronRight size={16}/></button>
//                     </div>

//                     {/* 🎯 FIXED: IV / PCR / Max Pain / OI Stats (Stockmock Style) */}
//                     <div className="p-3 border-b border-gray-200 text-[12px] space-y-3 bg-white shrink-0">
//                         {/* Row 1: ATM IV | Radio Buttons | Straddle Prem */}
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

//                         {/* Row 2: PCR | OI Data | Max Pain */}
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-600 w-1/4">PCR: <span className="font-semibold text-gray-900">0.82</span></span>

//                             <div className="flex justify-center items-center text-[11px] w-2/4 bg-gray-50 py-1 px-2 rounded">
//                                 <span className="text-gray-900 font-semibold mr-1">16.8Cr</span>
//                                 <span className="text-green-500 font-medium mr-2">(+1.5Cr)</span>
//                                 <span className="text-gray-300 mx-1">—</span>
//                                 <span className="text-gray-400 font-medium">OI</span>
//                                 <span className="text-gray-300 mx-1">—</span>
//                                 <span className="text-gray-900 font-semibold mr-1">13.8Cr</span>
//                                 <span className="text-green-500 font-medium">(+33.8L)</span>
//                             </div>

//                             <span className="text-gray-600 w-1/4 text-right">Max Pain: <span className="font-semibold text-gray-900">24350</span></span>
//                         </div>
//                     </div>

//                     {/* 🎯 FIXED: Scrollable Table Data */}
//                     <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
//                         <table className="w-full text-center">
//                             <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-10">
//                                 <tr>
//                                     <th className="py-2 px-2 font-medium">Call LTP (Δ)</th>
//                                     <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200 shadow-[inset_0_-1px_0_0_#e5e7eb]">Strike</th>
//                                     <th className="py-2 px-2 font-medium">Put LTP (Δ)</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr><td colSpan="3" className="py-10 text-gray-400">Loading Option Chain...</td></tr>
//                                 ) : data.chain.map((row, idx) => {
//                                     const isATM = row.strike === atmStrike;
//                                     const isCallITM = row.strike < atmStrike; // Call In-The-Money
//                                     const isPutITM = row.strike > atmStrike;  // Put In-The-Money

//                                     // 🎨 THE STOCKMOCK COLOR LOGIC
//                                     // 1. OTM (Out of The Money) = Light Yellow/Orange (bg-yellow-50)
//                                     // 2. ITM (In The Money) = White (bg-white)
//                                     // 3. ATM Row (Strike, Call, Put) = Light Blue (bg-[#e3f2fd])

//                                     let callBg = isCallITM ? 'bg-white' : 'bg-[#fffde7]';
//                                     let putBg = isPutITM ? 'bg-white' : 'bg-[#fffde7]';
//                                     let strikeBg = 'bg-gray-50';

//                                     // If row is ATM, override all backgrounds to light blue
//                                     if (isATM) {
//                                         callBg = 'bg-[#e3f2fd]';
//                                         putBg = 'bg-[#e3f2fd]';
//                                         strikeBg = 'bg-[#e3f2fd]';
//                                     }

//                                     return (
//                                         <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 group">
//                                             {/* CALLS */}
//                                             <td className={`py-1.5 px-2 relative ${callBg}`}>
//                                                 <div className="font-semibold text-gray-800">{row.CE?.ltp || '-'} <span className="font-normal text-gray-400">({row.CE?.delta ? parseFloat(row.CE.delta).toFixed(2) : '-'})</span></div>
//                                                 <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
//                                                     <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
//                                                 </div>
//                                             </td>

//                                             {/* STRIKE */}
//                                             <td className={`py-1.5 px-2 border-x border-gray-200 ${strikeBg}`}>
//                                                 <div className={`font-semibold ${isATM ? 'text-blue-700' : 'text-gray-700'}`}>{row.strike}</div>
//                                                 {isATM && <div className="text-[10px] text-blue-600 leading-none -mt-0.5">(ATM)</div>}
//                                                 {!isATM && <div className="text-[10px] text-gray-400 leading-none -mt-0.5">(ATM {row.strike > atmStrike ? '+' : ''}{row.strike - atmStrike})</div>}
//                                             </td>

//                                             {/* PUTS */}
//                                             <td className={`py-1.5 px-2 relative ${putBg}`}>
//                                                 <div className="font-semibold text-gray-800">{row.PE?.ltp || '-'} <span className="font-normal text-gray-400">({row.PE?.delta ? parseFloat(row.PE.delta).toFixed(2) : '-'})</span></div>
//                                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

//                 {/* --- RIGHT: PRE-BUILT STRATEGIES (col-span 6) --- */}
//                 <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">

//                     <div className="flex items-center px-4 py-2.5 border-b border-gray-200 shrink-0">
//                         <div className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2.5 -mb-2.5 mr-6 cursor-pointer">Pre Built Strategies</div>
//                         <div className="text-gray-500 hover:text-gray-700 cursor-pointer flex items-center gap-1">Rolling Straddle <span className="text-[10px]">📈</span></div>
//                     </div>

//                     <div className="px-4 py-3 flex gap-2 shrink-0">
//                         <button
//                             onClick={() => setActiveStrategyTab('Neutral')}
//                             className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Neutral' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
//                         >Neutral</button>
//                         <button
//                             onClick={() => setActiveStrategyTab('Bearish')}
//                             className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bearish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
//                         >Bearish</button>
//                         <button
//                             onClick={() => setActiveStrategyTab('Bullish')}
//                             className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === 'Bullish' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
//                         >Bullish</button>
//                     </div>

//                     <div className="px-4 py-2 flex flex-wrap items-center justify-between border-b border-gray-100 gap-2 shrink-0">
//                         <div className="flex items-center gap-2">
//                             <span className="text-gray-500">Expiry</span>
//                             <select className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none">
//                                 <option>18 AUG 2026</option>
//                             </select>
//                         </div>
//                         <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
//                             <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">All</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Risk Defined</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Undefined Risk</button>
//                         </div>
//                     </div>

//                     {/* Scrollable Strategies Container */}
//                     <div className="p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar flex-1">
//                         {preBuiltStrategies.map((strategy, idx) => (
//                             <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white group">
//                                 <div className="h-16 w-full mb-3 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
//                                     <img src={strategy.image} alt={strategy.name} className="h-full object-contain filter grayscale group-hover:grayscale-0" />
//                                 </div>
//                                 <div className="text-center font-semibold text-gray-700 text-xs">
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







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Camera,
//   Search,
//   Download,
//   ChevronLeft,
//   ChevronRight,
//   Settings,
// } from "lucide-react";

// const formatOI = (value) => {
//   if (!value || isNaN(value)) return "";
//   let num = parseFloat(value);
//   if (num === 0) return "";
//   if (num >= 10000000)
//     return (num / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
//   if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, "") + "L";
//   if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
//   return num.toString();
// };

// const SimulatorPage = () => {
//   const [date, setDate] = useState("2026-08-17");
//   const [time, setTime] = useState("09:15");
//   const [data, setData] = useState({ spotPrice: 0, chain: [] });
//   const [loading, setLoading] = useState(false);
//   const [activeStrategyTab, setActiveStrategyTab] = useState("Neutral");

//   const [isAddonsOpen, setIsAddonsOpen] = useState(false);
//   const [addons, setAddons] = useState({
//     delta: true,
//     iv: false,
//     oi: true,
//     showAllOi: false,
//     atm: false, // By default off rakha hai taki screen clean rahe
//   });

//   const fetchSimulatorData = async (selectedTime) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:5500/api/simulator/data`, {
//         params: { date: date, time: selectedTime },
//       });
//       if (res.data.success) {
//         setData({
//           spotPrice: res.data.spotPrice,
//           chain: res.data.chain,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching simulator data:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchSimulatorData(time);
//   }, [time, date]);

//   const handleTimeChange = (minutesToAdd) => {
//     const [hours, minutes] = time.split(":").map(Number);
//     let newDate = new Date();
//     newDate.setHours(hours, minutes + minutesToAdd, 0, 0);

//     let newHours = newDate.getHours();
//     let newMins = newDate.getMinutes();

//     if (newHours < 9 || (newHours === 9 && newMins < 15)) {
//       newHours = 9;
//       newMins = 15;
//     } else if (newHours > 15 || (newHours === 15 && newMins > 30)) {
//       newHours = 15;
//       newMins = 30;
//     }

//     const formattedTime = `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
//     setTime(formattedTime);
//   };

//   const getAtmStrike = () => {
//     if (!data.spotPrice || data.chain.length === 0) return null;
//     return data.chain.reduce((prev, curr) =>
//       Math.abs(curr.strike - data.spotPrice) <
//       Math.abs(prev.strike - data.spotPrice)
//         ? curr
//         : prev,
//     ).strike;
//   };

//   const atmStrike = getAtmStrike();

//   const maxOI = data.chain.reduce((max, row) => {
//     const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
//     const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
//     return Math.max(max, ceOI, peOI);
//   }, 1);

//   const preBuiltStrategies = [
//     {
//       name: "Short Straddle",
//       type: "Neutral",
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Short_Straddle.svg/300px-Short_Straddle.svg.png",
//     },
//     {
//       name: "Long Straddle",
//       type: "Neutral",
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Long_Straddle.svg/300px-Long_Straddle.svg.png",
//     },
//     {
//       name: "Short Strangle",
//       type: "Neutral",
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png",
//     },
//     {
//       name: "Long Strangle",
//       type: "Neutral",
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png",
//     },
//     {
//       name: "Long Iron Condor",
//       type: "Neutral",
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png",
//     },
//     {
//       name: "Short Iron Condor",
//       type: "Neutral",
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png",
//     },
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">
//       {/* 1. TOP BAR */}
//       <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">
//         <div className="w-full xl:w-auto flex justify-between xl:justify-start items-center">
//           <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 focus:outline-none focus:border-blue-500">
//             <option>Nifty</option>
//             <option>BankNifty</option>
//             <option>FinNifty</option>
//           </select>
//           <button className="xl:hidden text-gray-500 hover:text-gray-700 flex items-center gap-1">
//             <Camera size={16} /> Snapshot
//           </button>
//         </div>
//         <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 w-full xl:w-auto">
//           <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">
//             &lt;&lt; Day
//           </button>
//           <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">
//             SOD
//           </button>
//           <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">
//             -2h
//           </button>
//           <button
//             onClick={() => handleTimeChange(-30)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             -30m
//           </button>
//           <button
//             onClick={() => handleTimeChange(-15)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             -15m
//           </button>
//           <button
//             onClick={() => handleTimeChange(-5)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             -5m
//           </button>
//           <button
//             onClick={() => handleTimeChange(-1)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             -1m
//           </button>
//           <div className="flex items-center gap-2 mx-1">
//             <div className="border border-gray-300 px-3 py-1 bg-white font-medium rounded shadow-inner">
//               Mon, Aug 17, 2026
//             </div>
//             <div className="flex gap-1">
//               <select
//                 className="border border-gray-300 px-2 py-1 bg-white rounded font-medium"
//                 value={time.split(":")[0]}
//                 readOnly
//               >
//                 <option>{time.split(":")[0]}</option>
//               </select>
//               <select
//                 className="border border-gray-300 px-2 py-1 bg-white rounded font-medium"
//                 value={time.split(":")[1]}
//                 readOnly
//               >
//                 <option>{time.split(":")[1]}</option>
//               </select>
//             </div>
//           </div>
//           <button
//             onClick={() => handleTimeChange(1)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             1m+
//           </button>
//           <button
//             onClick={() => handleTimeChange(5)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             5m+
//           </button>
//           <button
//             onClick={() => handleTimeChange(15)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             15m+
//           </button>
//           <button
//             onClick={() => handleTimeChange(30)}
//             className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600"
//           >
//             30m+
//           </button>
//           <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">
//             2h+
//           </button>
//           <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">
//             EOD
//           </button>
//           <button className="px-2 py-1 text-gray-300 cursor-not-allowed rounded">
//             Day &gt;&gt;
//           </button>
//         </div>
//         <div className="hidden xl:flex w-40 justify-end">
//           <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
//             <Camera size={16} /> Snapshot
//           </button>
//         </div>
//       </div>

//       {/* 2. STATS BAR */}
//       <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
//         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 font-medium">
//           <div className="flex items-center gap-2 text-green-600">
//             <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
//               +
//             </span>{" "}
//             Add Futures
//           </div>
//           <div>
//             <span className="text-gray-500">Day Open:</span> 24343.5{" "}
//             <span className="text-red-500">(-23pt, -0.1%)</span>
//           </div>
//           <div>
//             <span className="text-gray-500">Spot:</span>{" "}
//             {data.spotPrice ? data.spotPrice : "---"}{" "}
//             <span className="text-red-500">(-36pt, -0.1%)</span>
//           </div>
//           <div>
//             <span className="text-gray-500">Fut:</span> 24361.4
//           </div>
//           <div>
//             <span className="text-gray-500">Synth Fut:</span> 24320.8{" "}
//             <span className="text-gray-400 font-normal">(18 AUG)</span>
//           </div>
//         </div>
//         <div className="flex flex-wrap items-center justify-center gap-2">
//           <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded font-medium transition-colors">
//             <Search size={14} /> Strategy Finder
//           </button>
//           <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded font-medium transition-colors">
//             Saved Strategies
//           </button>
//           <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-gray-900 font-medium transition-colors">
//             <Download size={14} /> Import Strategy
//           </button>
//         </div>
//       </div>

//       {/* 3. MAIN GRID */}
//       <div className="p-2 md:p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
//         {/* --- LEFT: OPTION CHAIN --- */}
//         <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">
//           <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0 relative">
//             <div>
//               <div
//                 className="flex items-center gap-1 text-gray-600 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded transition-colors"
//                 onClick={() => setIsAddonsOpen(!isAddonsOpen)}
//               >
//                 <Settings size={14} /> Add ons{" "}
//                 <span className="text-[10px]">▼</span>
//               </div>
//               {isAddonsOpen && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-40"
//                     onClick={() => setIsAddonsOpen(false)}
//                   ></div>
//                   <div className="absolute top-full left-2 mt-1 w-44 bg-white border border-gray-200 shadow-xl rounded-md z-50 py-2 text-sm text-gray-700">
//                     <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="accent-blue-500 rounded-sm"
//                         checked={addons.delta}
//                         onChange={(e) =>
//                           setAddons({ ...addons, delta: e.target.checked })
//                         }
//                       />{" "}
//                       Delta(Δ)
//                     </label>
//                     <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="accent-blue-500 rounded-sm"
//                         checked={addons.iv}
//                         onChange={(e) =>
//                           setAddons({ ...addons, iv: e.target.checked })
//                         }
//                       />{" "}
//                       Call & Put IV
//                     </label>
//                     <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="accent-blue-500 rounded-sm"
//                         checked={addons.oi}
//                         onChange={(e) =>
//                           setAddons({ ...addons, oi: e.target.checked })
//                         }
//                       />{" "}
//                       OI
//                     </label>
//                     {addons.oi && (
//                       <label className="flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-100 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           className="accent-blue-500 rounded-sm"
//                           checked={addons.showAllOi}
//                           onChange={(e) =>
//                             setAddons({
//                               ...addons,
//                               showAllOi: e.target.checked,
//                             })
//                           }
//                         />{" "}
//                         Show All OI
//                       </label>
//                     )}
//                     <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="accent-blue-500 rounded-sm"
//                         checked={addons.atm}
//                         onChange={(e) =>
//                           setAddons({ ...addons, atm: e.target.checked })
//                         }
//                       />{" "}
//                       ATM
//                     </label>
//                   </div>
//                 </>
//               )}
//             </div>
//             <div className="font-semibold text-gray-800">
//               Option Chain{" "}
//               <span className="font-normal text-gray-500">(18 AUG 2026)</span>
//             </div>
//             <div className="w-16"></div>
//           </div>

//           <div className="flex items-center border-b border-gray-200 overflow-x-auto custom-scrollbar shrink-0">
//             <button className="p-2 text-gray-400 hover:text-gray-600">
//               <ChevronLeft size={16} />
//             </button>
//             <div className="flex-1 flex min-w-max">
//               <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 bg-blue-50 text-center cursor-pointer">
//                 <div className="font-semibold">18 AUG '26</div>
//                 <div className="text-[10px] text-gray-500">(CW: 1 DTE)</div>
//               </div>
//               <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-center cursor-pointer">
//                 <div className="font-medium">25 AUG '26</div>
//                 <div className="text-[10px] text-gray-400">(NW/CM: 8 DTE)</div>
//               </div>
//               <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center cursor-pointer">
//                 <span className="font-medium">1 SEP '26</span>
//               </div>
//             </div>
//             <button className="p-2 text-gray-400 hover:text-gray-600">
//               <ChevronRight size={16} />
//             </button>
//           </div>

//           <div className="p-3 border-b border-gray-200 text-[12px] space-y-3 bg-white shrink-0">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600 w-1/4">
//                 ATM IV:{" "}
//                 <span className="font-semibold text-gray-900">11.8</span>
//               </span>
//               <div className="flex justify-center items-center gap-3 text-gray-600 w-2/4">
//                 <span>ATM:</span>
//                 <label className="flex items-center gap-1 cursor-pointer">
//                   <input type="radio" name="atm" className="accent-blue-500" />{" "}
//                   Spot
//                 </label>
//                 <label className="flex items-center gap-1 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="atm"
//                     className="accent-blue-500"
//                     defaultChecked
//                   />{" "}
//                   Fut
//                 </label>
//                 <label className="flex items-center gap-1 cursor-pointer">
//                   <input type="radio" name="atm" className="accent-blue-500" />{" "}
//                   Synth Fut
//                 </label>
//               </div>
//               <span className="text-gray-600 w-1/4 text-right">
//                 Straddle Prem:{" "}
//                 <span className="font-semibold text-gray-900">137</span>
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600 w-1/4">
//                 PCR: <span className="font-semibold text-gray-900">0.82</span>
//               </span>
//               <div className="flex justify-center items-center text-[11px] w-2/4 bg-gray-50 py-1 px-2 rounded">
//                 <span className="text-gray-900 font-semibold mr-1">16.8Cr</span>
//                 <span className="text-green-500 font-medium mr-2">
//                   (+1.5Cr)
//                 </span>
//                 <span className="text-gray-300 mx-1">—</span>
//                 <span className="text-gray-400 font-medium">OI</span>
//                 <span className="text-gray-300 mx-1">—</span>
//                 <span className="text-gray-900 font-semibold mr-1">13.8Cr</span>
//                 <span className="text-green-500 font-medium">(+33.8L)</span>
//               </div>
//               <span className="text-gray-600 w-1/4 text-right">
//                 Max Pain:{" "}
//                 <span className="font-semibold text-gray-900">24350</span>
//               </span>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
//             <table className="w-full text-center">
//               <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-30">
//                 <tr>
//                   <th className="py-2 px-2 font-medium w-[25%]">
//                     Call LTP {addons.delta && "(Δ)"}
//                   </th>
//                   {addons.oi && (
//                     <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>
//                   )}
//                   {addons.iv && (
//                     <th className="py-2 px-2 font-medium text-gray-400">IV</th>
//                   )}
//                   <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200 shadow-[inset_0_-1px_0_0_#e5e7eb] w-[20%]">
//                     Strike
//                   </th>
//                   {addons.iv && (
//                     <th className="py-2 px-2 font-medium text-gray-400">IV</th>
//                   )}
//                   {addons.oi && (
//                     <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>
//                   )}
//                   <th className="py-2 px-2 font-medium w-[25%]">
//                     Put LTP {addons.delta && "(Δ)"}
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="7" className="py-10 text-gray-400">
//                       Loading Option Chain...
//                     </td>
//                   </tr>
//                 ) : (
//                   data.chain.map((row, idx) => {
//                     const isATM = row.strike === atmStrike;
//                     const isCallITM = row.strike < atmStrike;
//                     const isPutITM = row.strike > atmStrike;

//                     let callBg = isCallITM ? "bg-white" : "bg-[#fffde7]";
//                     let putBg = isPutITM ? "bg-white" : "bg-[#fffde7]";
//                     let strikeBg = "bg-gray-50";

//                     if (isATM) {
//                       callBg = "bg-[#e3f2fd]";
//                       putBg = "bg-[#e3f2fd]";
//                       strikeBg = "bg-[#e3f2fd]";
//                     }

//                     const callOiRaw = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
//                     const putOiRaw = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
//                     const callOiWidth = (callOiRaw / maxOI) * 100;
//                     const putOiWidth = (putOiRaw / maxOI) * 100;

//                     return (
//                       <tr
//                         key={idx}
//                         className={`border-b border-gray-100 hover:bg-gray-50 group ${addons.atm && isATM ? "border-2 border-blue-400 shadow-md relative z-10" : ""}`}
//                       >
//                         <td className={`py-1.5 px-2 relative ${callBg}`}>
//                           <div className="font-semibold text-gray-800">
//                             {row.CE?.ltp || "-"}{" "}
//                             {addons.delta && (
//                               <span className="font-normal text-gray-400 text-[11px] ml-1">
//                                 (
//                                 {row.CE?.delta
//                                   ? parseFloat(row.CE.delta).toFixed(2)
//                                   : "-"}
//                                 )
//                               </span>
//                             )}
//                           </div>
//                           <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
//                             <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">
//                               B
//                             </button>
//                             <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">
//                               S
//                             </button>
//                           </div>
//                         </td>
//                         {addons.oi && (
//                           <td className={`relative p-0 h-full ${callBg}`}>
//                             <div className="flex items-center justify-end w-full h-full min-h-[28px] relative group-hover/oi">
//                               <div
//                                 className="absolute right-0 top-[15%] bottom-[15%] bg-[#fce4e4] dark:bg-red-900/30 rounded-l-sm transition-all z-0"
//                                 style={{ width: `${callOiWidth}%` }}
//                               ></div>
//                               <div
//                                 className={`absolute right-2 z-10 text-[11px] font-medium text-red-400 ${addons.showAllOi ? "opacity-100" : "opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100 transition-opacity"}`}
//                               >
//                                 {formatOI(callOiRaw)}
//                               </div>
//                             </div>
//                           </td>
//                         )}
//                         {addons.iv && (
//                           <td
//                             className={`py-1.5 px-2 text-gray-400 text-[11px] ${callBg}`}
//                           >
//                             -
//                           </td>
//                         )}

//                         {/* 🎯 FIXED STRIKE COLUMN (No Jitter) */}
//                         <td
//                           className={`py-1.5 px-2 border-x border-gray-200 ${strikeBg}`}
//                         >
//                           {/* 👇 Container ko ek minimum height (min-h) aur flexbox de diya taki cell hamesha same height ka rahe */}
//                           <div className="flex flex-col items-center justify-center min-h-[32px]">
//                             {/* The Main Strike Price */}
//                             <div
//                               className={`font-semibold ${isATM ? "text-blue-700" : "text-gray-700"}`}
//                             >
//                               {row.strike}
//                             </div>

//                             {/* ATM humesha dikhega agar strike ATM hai */}
//                             {isATM && (
//                               <div className="text-[10px] text-blue-600 leading-none -mt-0.5">
//                                 (ATM)
//                               </div>
//                             )}

//                             {/* Baaki strikes ke niche (ATM +/- 50). Invisible if addons.atm is false! */}
//                             {!isATM && (
//                               <div
//                                 className={`text-[10px] text-gray-400 leading-none -mt-0.5 transition-opacity ${addons.atm ? "opacity-100" : "opacity-0"}`}
//                               >
//                                 (ATM {row.strike > atmStrike ? "+" : ""}
//                                 {row.strike - atmStrike})
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         {addons.iv && (
//                           <td
//                             className={`py-1.5 px-2 text-gray-400 text-[11px] ${putBg}`}
//                           >
//                             -
//                           </td>
//                         )}
//                         {addons.oi && (
//                           <td className={`relative p-0 h-full ${putBg}`}>
//                             <div className="flex items-center justify-start w-full h-full min-h-[28px] relative group-hover/oi">
//                               <div
//                                 className="absolute left-0 top-[15%] bottom-[15%] bg-[#e6f4ea] dark:bg-green-900/30 rounded-r-sm transition-all z-0"
//                                 style={{ width: `${putOiWidth}%` }}
//                               ></div>
//                               <div
//                                 className={`absolute left-2 z-10 text-[11px] font-medium text-green-500 ${addons.showAllOi ? "opacity-100" : "opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100 transition-opacity"}`}
//                               >
//                                 {formatOI(putOiRaw)}
//                               </div>
//                             </div>
//                           </td>
//                         )}
//                         <td className={`py-1.5 px-2 relative ${putBg}`}>
//                           <div className="font-semibold text-gray-800">
//                             {row.PE?.ltp || "-"}{" "}
//                             {addons.delta && (
//                               <span className="font-normal text-gray-400 text-[11px] ml-1">
//                                 (
//                                 {row.PE?.delta
//                                   ? parseFloat(row.PE.delta).toFixed(2)
//                                   : "-"}
//                                 )
//                               </span>
//                             )}
//                           </div>
//                           <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
//                             <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">
//                               B
//                             </button>
//                             <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">
//                               S
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* --- RIGHT: PRE-BUILT STRATEGIES --- */}
//         <div className="xl:col-span-6 bg-white border border-gray-200 rounded shadow-sm flex flex-col h-[650px]">
//           <div className="flex items-center px-4 py-2.5 border-b border-gray-200 shrink-0">
//             <div className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2.5 -mb-2.5 mr-6 cursor-pointer">
//               Pre Built Strategies
//             </div>
//             <div className="text-gray-500 hover:text-gray-700 cursor-pointer flex items-center gap-1">
//               Rolling Straddle <span className="text-[10px]">📈</span>
//             </div>
//           </div>
//           <div className="px-4 py-3 flex gap-2 shrink-0">
//             <button
//               onClick={() => setActiveStrategyTab("Neutral")}
//               className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === "Neutral" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}
//             >
//               Neutral
//             </button>
//             <button
//               onClick={() => setActiveStrategyTab("Bearish")}
//               className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === "Bearish" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}
//             >
//               Bearish
//             </button>
//             <button
//               onClick={() => setActiveStrategyTab("Bullish")}
//               className={`px-4 py-1.5 rounded font-medium transition-colors ${activeStrategyTab === "Bullish" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}
//             >
//               Bullish
//             </button>
//           </div>
//           <div className="px-4 py-2 flex flex-wrap items-center justify-between border-b border-gray-100 gap-2 shrink-0">
//             <div className="flex items-center gap-2">
//               <span className="text-gray-500">Expiry</span>
//               <select className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none">
//                 <option>18 AUG 2026</option>
//               </select>
//             </div>
//             <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
//               <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">
//                 All
//               </button>
//               <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">
//                 Risk Defined
//               </button>
//               <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">
//                 Undefined Risk
//               </button>
//             </div>
//           </div>
//           <div className="p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar flex-1">
//             {preBuiltStrategies.map((strategy, idx) => (
//               <div
//                 key={idx}
//                 className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white group"
//               >
//                 <div className="h-16 w-full mb-3 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
//                   <img
//                     src={strategy.image}
//                     alt={strategy.name}
//                     className="h-full object-contain filter grayscale group-hover:grayscale-0"
//                   />
//                 </div>
//                 <div className="text-center font-semibold text-gray-700 text-xs">
//                   {strategy.name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimulatorPage;




// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Camera, Search, Download, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

// const formatOI = (value) => {
//     if (!value || isNaN(value)) return '';
//     let num = parseFloat(value);
//     if (num === 0) return '';
//     if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
//     if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
//     if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
//     return num.toString();
// };

// const SimulatorPage = () => {
//     const [date, setDate] = useState('2026-08-17');
//     const [time, setTime] = useState('09:15');
//     const [data, setData] = useState({ spotPrice: 0, chain: [] });
//     const [loading, setLoading] = useState(false);
//     const [activeStrategyTab, setActiveStrategyTab] = useState('Neutral');

//     const [isAddonsOpen, setIsAddonsOpen] = useState(false);
//     const [addons, setAddons] = useState({
//         delta: true,      
//         iv: false,
//         oi: true, 
//         showAllOi: false,
//         atm: false 
//     });

//     // 🎯 NEW: Ref for targeting the ATM Row
//     const atmRowRef = useRef(null);

//     const fetchSimulatorData = async (selectedTime) => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`http://localhost:5500/api/simulator/data`, {
//                 params: { date: date, time: selectedTime }
//             });
//             if (res.data.success) {
//                 setData({
//                     spotPrice: res.data.spotPrice,
//                     chain: res.data.chain
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching simulator data:", error);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchSimulatorData(time);
//     }, [time, date]);

//     // 🎯 NEW: Auto Scroll to ATM whenever data changes
//     useEffect(() => {
//         if (atmRowRef.current) {
//             // 'block: center' ensures it scrolls exactly to the middle of the table
//             atmRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     }, [data]); // Yeh effect tab chalega jab naya data aayega

//     const handleTimeChange = (minutesToAdd) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         let newDate = new Date();
//         newDate.setHours(hours, minutes + minutesToAdd, 0, 0);

//         let newHours = newDate.getHours();
//         let newMins = newDate.getMinutes();

//         if (newHours < 9 || (newHours === 9 && newMins < 15)) {
//             newHours = 9; newMins = 15;
//         } else if (newHours > 15 || (newHours === 15 && newMins > 30)) {
//             newHours = 15; newMins = 30;
//         }

//         const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
//         setTime(formattedTime);
//     };

//     const getAtmStrike = () => {
//         if (!data.spotPrice || data.chain.length === 0) return null;
//         return data.chain.reduce((prev, curr) => 
//             Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
//         ).strike;
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

//     const preBuiltStrategies = [
//         { name: "Short Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Short_Straddle.svg/300px-Short_Straddle.svg.png" },
//         { name: "Long Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Long_Straddle.svg/300px-Long_Straddle.svg.png" },
//         { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
//         { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
//         { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//         { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//     ];

//     return (
//         <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">
//             {/* 1. TOP BAR */}
//             <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">
//                 <div className="w-full xl:w-auto flex justify-between xl:justify-start items-center">
//                     <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 focus:outline-none focus:border-blue-500">
//                         <option>Nifty</option>
//                         <option>BankNifty</option>
//                         <option>FinNifty</option>
//                     </select>
//                     <button className="xl:hidden text-gray-500 hover:text-gray-700 flex items-center gap-1">
//                         <Camera size={16} /> Snapshot
//                     </button>
//                 </div>
//                 <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 w-full xl:w-auto">
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">&lt;&lt; Day</button>
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">SOD</button>
//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-2h</button>
//                     <button onClick={() => handleTimeChange(-30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-30m</button>
//                     <button onClick={() => handleTimeChange(-15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-15m</button>
//                     <button onClick={() => handleTimeChange(-5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-5m</button>
//                     <button onClick={() => handleTimeChange(-1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-1m</button>
//                     <div className="flex items-center gap-2 mx-1">
//                         <div className="border border-gray-300 px-3 py-1 bg-white font-medium rounded shadow-inner">Mon, Aug 17, 2026</div>
//                         <div className="flex gap-1">
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[0]} readOnly><option>{time.split(':')[0]}</option></select>
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[1]} readOnly><option>{time.split(':')[1]}</option></select>
//                         </div>
//                     </div>
//                     <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">1m+</button>
//                     <button onClick={() => handleTimeChange(5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">5m+</button>
//                     <button onClick={() => handleTimeChange(15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">15m+</button>
//                     <button onClick={() => handleTimeChange(30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">30m+</button>
//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">2h+</button>
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">EOD</button>
//                     <button className="px-2 py-1 text-gray-300 cursor-not-allowed rounded">Day &gt;&gt;</button>
//                 </div>
//                 <div className="hidden xl:flex w-40 justify-end">
//                     <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1"><Camera size={16} /> Snapshot</button>
//                 </div>
//             </div>

//             {/* 2. STATS BAR */}
//             <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
//                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 font-medium">
//                     <div className="flex items-center gap-2 text-green-600">
//                         <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">+</span> Add Futures
//                     </div>
//                     <div><span className="text-gray-500">Day Open:</span> 24343.5 <span className="text-red-500">(-23pt, -0.1%)</span></div>
//                     <div><span className="text-gray-500">Spot:</span> {data.spotPrice ? data.spotPrice : '---'} <span className="text-red-500">(-36pt, -0.1%)</span></div>
//                     <div><span className="text-gray-500">Fut:</span> 24361.4</div>
//                     <div><span className="text-gray-500">Synth Fut:</span> 24320.8 <span className="text-gray-400 font-normal">(18 AUG)</span></div>
//                 </div>
//                 <div className="flex flex-wrap items-center justify-center gap-2">
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded font-medium transition-colors"><Search size={14} /> Strategy Finder</button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded font-medium transition-colors">Saved Strategies</button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"><Download size={14} /> Import Strategy</button>
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
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.iv} onChange={(e) => setAddons({...addons, iv: e.target.checked})} /> Call & Put IV</label>
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.oi} onChange={(e) => setAddons({...addons, oi: e.target.checked})} /> OI</label>
//                                         {addons.oi && (
//                                             <label className="flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.showAllOi} onChange={(e) => setAddons({...addons, showAllOi: e.target.checked})} /> Show All OI</label>
//                                         )}
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.atm} onChange={(e) => setAddons({...addons, atm: e.target.checked})} /> ATM</label>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                         <div className="font-semibold text-gray-800">Option Chain <span className="font-normal text-gray-500">(18 AUG 2026)</span></div>
//                         <div className="w-16"></div> 
//                     </div>

//                     <div className="flex items-center border-b border-gray-200 overflow-x-auto custom-scrollbar shrink-0">
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronLeft size={16}/></button>
//                         <div className="flex-1 flex min-w-max">
//                             <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 bg-blue-50 text-center cursor-pointer"><div className="font-semibold">18 AUG '26</div><div className="text-[10px] text-gray-500">(CW: 1 DTE)</div></div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-center cursor-pointer"><div className="font-medium">25 AUG '26</div><div className="text-[10px] text-gray-400">(NW/CM: 8 DTE)</div></div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center cursor-pointer"><span className="font-medium">1 SEP '26</span></div>
//                         </div>
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronRight size={16}/></button>
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

//                     <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
//                         <table className="w-full text-center">
//                             <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-30">
//                                 <tr>
//                                     <th className="py-2 px-2 font-medium w-[25%]">Call LTP {addons.delta && '(Δ)'}</th>
//                                     {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
//                                     {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
//                                     <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200 shadow-[inset_0_-1px_0_0_#e5e7eb] w-[20%]">Strike</th>
//                                     {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
//                                     {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
//                                     <th className="py-2 px-2 font-medium w-[25%]">Put LTP {addons.delta && '(Δ)'}</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr><td colSpan="7" className="py-10 text-gray-400">Loading Option Chain...</td></tr>
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

//                                     return (
//                                         // 🎯 NEW: Attach the atmRowRef exactly to the ATM row
//                                         <tr 
//                                             key={idx} 
//                                             ref={isATM ? atmRowRef : null} 
//                                             className={`border-b border-gray-100 hover:bg-gray-50 group ${addons.atm && isATM ? 'border-2 border-blue-400 shadow-md relative z-10' : ''}`}
//                                         >
//                                             <td className={`py-1.5 px-2 relative ${callBg}`}>
//                                                 <div className="font-semibold text-gray-800">
//                                                     {row.CE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({row.CE?.delta ? parseFloat(row.CE.delta).toFixed(2) : '-'})</span>}
//                                                 </div>
//                                                 <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
//                                                     <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
//                                                     <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
//                                                 </div>
//                                             </td>

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

//                                             {addons.iv && <td className={`py-1.5 px-2 text-gray-400 text-[11px] ${callBg}`}>-</td>}
                                            
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

//                                             {addons.iv && <td className={`py-1.5 px-2 text-gray-400 text-[11px] ${putBg}`}>-</td>}
                                            
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

//                                             <td className={`py-1.5 px-2 relative ${putBg}`}>
//                                                 <div className="font-semibold text-gray-800">
//                                                     {row.PE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({row.PE?.delta ? parseFloat(row.PE.delta).toFixed(2) : '-'})</span>}
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
//                             <span className="text-gray-500">Expiry</span>
//                             <select className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none"><option>18 AUG 2026</option></select>
//                         </div>
//                         <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
//                             <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">All</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Risk Defined</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Undefined Risk</button>
//                         </div>
//                     </div>
//                     <div className="p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar flex-1">
//                         {preBuiltStrategies.map((strategy, idx) => (
//                             <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white group">
//                                 <div className="h-16 w-full mb-3 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
//                                     <img src={strategy.image} alt={strategy.name} className="h-full object-contain filter grayscale group-hover:grayscale-0" />
//                                 </div>
//                                 <div className="text-center font-semibold text-gray-700 text-xs">{strategy.name}</div>
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

// const formatOI = (value) => {
//     if (!value || isNaN(value)) return '';
//     let num = parseFloat(value);
//     if (num === 0) return '';
//     if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
//     if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
//     if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
//     return num.toString();
// };

// const SimulatorPage = () => {
//     const [date, setDate] = useState('2026-08-17');
//     const [time, setTime] = useState('09:15');
//     const [data, setData] = useState({ spotPrice: 0, chain: [] });
//     const [loading, setLoading] = useState(false);
//     const [activeStrategyTab, setActiveStrategyTab] = useState('Neutral');

//     const [isAddonsOpen, setIsAddonsOpen] = useState(false);
//     const [addons, setAddons] = useState({
//         delta: true,      
//         iv: false,
//         oi: true, 
//         showAllOi: false,
//         atm: false 
//     });

//     // 🎯 REFS FOR SMART SCROLLING
//     const tableContainerRef = useRef(null);
//     const atmRowRef = useRef(null);

//     const fetchSimulatorData = async (selectedTime) => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`http://localhost:5500/api/simulator/data`, {
//                 params: { date: date, time: selectedTime }
//             });
//             if (res.data.success) {
//                 setData({
//                     spotPrice: res.data.spotPrice,
//                     chain: res.data.chain
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching simulator data:", error);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchSimulatorData(time);
//     }, [time, date]);

//     // 🎯 THE SMART SCROLL LOGIC
//     useEffect(() => {
//         if (atmRowRef.current && tableContainerRef.current) {
//             const container = tableContainerRef.current;
//             const row = atmRowRef.current;

//             const containerRect = container.getBoundingClientRect();
//             const rowRect = row.getBoundingClientRect();

//             // Check if ATM row is clearly visible inside the user's viewport
//             const isVisible = (rowRect.top >= containerRect.top) && (rowRect.bottom <= containerRect.bottom);

//             // Agar ATM nahi dikh raha hai (e.g. user 22000 dekh raha hai), to smooth scroll karo.
//             // Agar ATM already dikh raha hai, to screen ko bilkul mat hilao!
//             if (!isVisible) {
//                 row.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             }
//         }
//     }, [data.chain]); // Run this after table updates

//     const handleTimeChange = (minutesToAdd) => {
//         const [hours, minutes] = time.split(':').map(Number);
//         let newDate = new Date();
//         newDate.setHours(hours, minutes + minutesToAdd, 0, 0);

//         let newHours = newDate.getHours();
//         let newMins = newDate.getMinutes();

//         if (newHours < 9 || (newHours === 9 && newMins < 15)) {
//             newHours = 9; newMins = 15;
//         } else if (newHours > 15 || (newHours === 15 && newMins > 30)) {
//             newHours = 15; newMins = 30;
//         }

//         const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
//         setTime(formattedTime);
//     };

//     const getAtmStrike = () => {
//         if (!data.spotPrice || data.chain.length === 0) return null;
//         return data.chain.reduce((prev, curr) => 
//             Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
//         ).strike;
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

//     const preBuiltStrategies = [
//         { name: "Short Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Short_Straddle.svg/300px-Short_Straddle.svg.png" },
//         { name: "Long Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Long_Straddle.svg/300px-Long_Straddle.svg.png" },
//         { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
//         { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
//         { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//         { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
//     ];

//     return (
//         <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">
//             {/* 1. TOP BAR */}
//             <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">
//                 <div className="w-full xl:w-auto flex justify-between xl:justify-start items-center">
//                     <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 focus:outline-none focus:border-blue-500">
//                         <option>Nifty</option>
//                         <option>BankNifty</option>
//                         <option>FinNifty</option>
//                     </select>
//                     <button className="xl:hidden text-gray-500 hover:text-gray-700 flex items-center gap-1">
//                         <Camera size={16} /> Snapshot
//                     </button>
//                 </div>
//                 <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 w-full xl:w-auto">
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">&lt;&lt; Day</button>
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">SOD</button>
//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-2h</button>
//                     <button onClick={() => handleTimeChange(-30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-30m</button>
//                     <button onClick={() => handleTimeChange(-15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-15m</button>
//                     <button onClick={() => handleTimeChange(-5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-5m</button>
//                     <button onClick={() => handleTimeChange(-1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-1m</button>
//                     <div className="flex items-center gap-2 mx-1">
//                         <div className="border border-gray-300 px-3 py-1 bg-white font-medium rounded shadow-inner">Mon, Aug 17, 2026</div>
//                         <div className="flex gap-1">
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[0]} readOnly><option>{time.split(':')[0]}</option></select>
//                             <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[1]} readOnly><option>{time.split(':')[1]}</option></select>
//                         </div>
//                     </div>
//                     <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">1m+</button>
//                     <button onClick={() => handleTimeChange(5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">5m+</button>
//                     <button onClick={() => handleTimeChange(15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">15m+</button>
//                     <button onClick={() => handleTimeChange(30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">30m+</button>
//                     <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">2h+</button>
//                     <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">EOD</button>
//                     <button className="px-2 py-1 text-gray-300 cursor-not-allowed rounded">Day &gt;&gt;</button>
//                 </div>
//                 <div className="hidden xl:flex w-40 justify-end">
//                     <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1"><Camera size={16} /> Snapshot</button>
//                 </div>
//             </div>

//             {/* 2. STATS BAR */}
//             <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
//                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 font-medium">
//                     <div className="flex items-center gap-2 text-green-600">
//                         <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">+</span> Add Futures
//                     </div>
//                     <div><span className="text-gray-500">Day Open:</span> 24343.5 <span className="text-red-500">(-23pt, -0.1%)</span></div>
//                     <div><span className="text-gray-500">Spot:</span> {data.spotPrice ? data.spotPrice : '---'} <span className="text-red-500">(-36pt, -0.1%)</span></div>
//                     <div><span className="text-gray-500">Fut:</span> 24361.4</div>
//                     <div><span className="text-gray-500">Synth Fut:</span> 24320.8 <span className="text-gray-400 font-normal">(18 AUG)</span></div>
//                 </div>
//                 <div className="flex flex-wrap items-center justify-center gap-2">
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded font-medium transition-colors"><Search size={14} /> Strategy Finder</button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded font-medium transition-colors">Saved Strategies</button>
//                     <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"><Download size={14} /> Import Strategy</button>
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
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.iv} onChange={(e) => setAddons({...addons, iv: e.target.checked})} /> Call & Put IV</label>
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.oi} onChange={(e) => setAddons({...addons, oi: e.target.checked})} /> OI</label>
//                                         {addons.oi && (
//                                             <label className="flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.showAllOi} onChange={(e) => setAddons({...addons, showAllOi: e.target.checked})} /> Show All OI</label>
//                                         )}
//                                         <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.atm} onChange={(e) => setAddons({...addons, atm: e.target.checked})} /> ATM</label>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                         <div className="font-semibold text-gray-800">Option Chain <span className="font-normal text-gray-500">(18 AUG 2026)</span></div>
//                         <div className="w-16"></div> 
//                     </div>

//                     <div className="flex items-center border-b border-gray-200 overflow-x-auto custom-scrollbar shrink-0">
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronLeft size={16}/></button>
//                         <div className="flex-1 flex min-w-max">
//                             <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 bg-blue-50 text-center cursor-pointer"><div className="font-semibold">18 AUG '26</div><div className="text-[10px] text-gray-500">(CW: 1 DTE)</div></div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-center cursor-pointer"><div className="font-medium">25 AUG '26</div><div className="text-[10px] text-gray-400">(NW/CM: 8 DTE)</div></div>
//                             <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center cursor-pointer"><span className="font-medium">1 SEP '26</span></div>
//                         </div>
//                         <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronRight size={16}/></button>
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

//                     {/* 🎯 TABLE CONTAINER REF (For Smart Scrolling) */}
//                     <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
//                         <table className="w-full text-center">
//                             <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-30">
//                                 <tr>
//                                     <th className="py-2 px-2 font-medium w-[25%]">Call LTP {addons.delta && '(Δ)'}</th>
//                                     {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
//                                     {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
//                                     <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200 shadow-[inset_0_-1px_0_0_#e5e7eb] w-[20%]">Strike</th>
//                                     {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
//                                     {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
//                                     <th className="py-2 px-2 font-medium w-[25%]">Put LTP {addons.delta && '(Δ)'}</th>
//                                 </tr>
//                             </thead>
                            
//                             {/* 🎯 SEAMLESS LOADING: opacity-50 used instead of deleting the table */}
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

//                                     return (
//                                         <tr 
//                                             key={idx} 
//                                             ref={isATM ? atmRowRef : null} 
//                                             className={`border-b border-gray-100 hover:bg-gray-50 group ${addons.atm && isATM ? 'border-2 border-blue-400 shadow-md relative z-10' : ''}`}
//                                         >
//                                             <td className={`py-1.5 px-2 relative ${callBg}`}>
//                                                 <div className="font-semibold text-gray-800">
//                                                     {row.CE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({row.CE?.delta ? parseFloat(row.CE.delta).toFixed(2) : '-'})</span>}
//                                                 </div>
//                                                 <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
//                                                     <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
//                                                     <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
//                                                 </div>
//                                             </td>

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

//                                             {addons.iv && <td className={`py-1.5 px-2 text-gray-400 text-[11px] ${callBg}`}>-</td>}
                                            
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

//                                             {addons.iv && <td className={`py-1.5 px-2 text-gray-400 text-[11px] ${putBg}`}>-</td>}
                                            
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

//                                             <td className={`py-1.5 px-2 relative ${putBg}`}>
//                                                 <div className="font-semibold text-gray-800">
//                                                     {row.PE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({row.PE?.delta ? parseFloat(row.PE.delta).toFixed(2) : '-'})</span>}
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
//                             <span className="text-gray-500">Expiry</span>
//                             <select className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none"><option>18 AUG 2026</option></select>
//                         </div>
//                         <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
//                             <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">All</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Risk Defined</button>
//                             <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Undefined Risk</button>
//                         </div>
//                     </div>
//                     <div className="p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar flex-1">
//                         {preBuiltStrategies.map((strategy, idx) => (
//                             <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white group">
//                                 <div className="h-16 w-full mb-3 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
//                                     <img src={strategy.image} alt={strategy.name} className="h-full object-contain filter grayscale group-hover:grayscale-0" />
//                                 </div>
//                                 <div className="text-center font-semibold text-gray-700 text-xs">{strategy.name}</div>
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

const formatOI = (value) => {
    if (!value || isNaN(value)) return '';
    let num = parseFloat(value);
    if (num === 0) return '';
    if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
};

const SimulatorPage = () => {
    const [date, setDate] = useState('2026-08-17');
    const [time, setTime] = useState('09:15');
    const [data, setData] = useState({ spotPrice: 0, chain: [] });
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

    const fetchSimulatorData = async (selectedTime) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5500/api/simulator/data`, {
                params: { date: date, time: selectedTime }
            });
            if (res.data.success) {
                setData({
                    spotPrice: res.data.spotPrice,
                    chain: res.data.chain
                });
            }
        } catch (error) {
            console.error("Error fetching simulator data:", error);
        }
        setLoading(false);
    };

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

    const handleTimeChange = (minutesToAdd) => {
        const [hours, minutes] = time.split(':').map(Number);
        let newDate = new Date();
        newDate.setHours(hours, minutes + minutesToAdd, 0, 0);

        let newHours = newDate.getHours();
        let newMins = newDate.getMinutes();

        if (newHours < 9 || (newHours === 9 && newMins < 15)) {
            newHours = 9; newMins = 15;
        } else if (newHours > 15 || (newHours === 15 && newMins > 30)) {
            newHours = 15; newMins = 30;
        }

        const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
        setTime(formattedTime);
    };

    const getAtmStrike = () => {
        if (!data.spotPrice || data.chain.length === 0) return null;
        return data.chain.reduce((prev, curr) => 
            Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev
        ).strike;
    };

    const atmStrike = getAtmStrike();

    let maxOverallOI = 1;
    let maxCallOI = 0;
    let maxPutOI = 0;

    data.chain.forEach(row => {
        const ceOI = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
        const peOI = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
        
        if (ceOI > maxCallOI) maxCallOI = ceOI;
        if (peOI > maxPutOI) maxPutOI = peOI;
        if (ceOI > maxOverallOI) maxOverallOI = ceOI;
        if (peOI > maxOverallOI) maxOverallOI = peOI;
    });

    const preBuiltStrategies = [
        { name: "Short Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Short_Straddle.svg/300px-Short_Straddle.svg.png" },
        { name: "Long Straddle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Long_Straddle.svg/300px-Long_Straddle.svg.png" },
        { name: "Short Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Short_Strangle.svg/300px-Short_Strangle.svg.png" },
        { name: "Long Strangle", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Long_Strangle.svg/300px-Long_Strangle.svg.png" },
        { name: "Long Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
        { name: "Short Iron Condor", type: "Neutral", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Iron_Condor.png/300px-Iron_Condor.png" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen text-[13px] font-sans text-gray-800">
            {/* 1. TOP BAR */}
            <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="w-full xl:w-auto flex justify-between xl:justify-start items-center">
                    <select className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 font-medium w-40 focus:outline-none focus:border-blue-500">
                        <option>Nifty</option>
                        <option>BankNifty</option>
                        <option>FinNifty</option>
                    </select>
                    <button className="xl:hidden text-gray-500 hover:text-gray-700 flex items-center gap-1">
                        <Camera size={16} /> Snapshot
                    </button>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-2 w-full xl:w-auto">
                    <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">&lt;&lt; Day</button>
                    <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">SOD</button>
                    <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-2h</button>
                    <button onClick={() => handleTimeChange(-30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-30m</button>
                    <button onClick={() => handleTimeChange(-15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-15m</button>
                    <button onClick={() => handleTimeChange(-5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-5m</button>
                    <button onClick={() => handleTimeChange(-1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">-1m</button>
                    <div className="flex items-center gap-2 mx-1">
                        <div className="border border-gray-300 px-3 py-1 bg-white font-medium rounded shadow-inner">Mon, Aug 17, 2026</div>
                        <div className="flex gap-1">
                            <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[0]} readOnly><option>{time.split(':')[0]}</option></select>
                            <select className="border border-gray-300 px-2 py-1 bg-white rounded font-medium" value={time.split(':')[1]} readOnly><option>{time.split(':')[1]}</option></select>
                        </div>
                    </div>
                    <button onClick={() => handleTimeChange(1)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">1m+</button>
                    <button onClick={() => handleTimeChange(5)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">5m+</button>
                    <button onClick={() => handleTimeChange(15)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">15m+</button>
                    <button onClick={() => handleTimeChange(30)} className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">30m+</button>
                    <button className="px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm rounded text-gray-600">2h+</button>
                    <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded">EOD</button>
                    <button className="px-2 py-1 text-gray-300 cursor-not-allowed rounded">Day &gt;&gt;</button>
                </div>
                <div className="hidden xl:flex w-40 justify-end">
                    <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1"><Camera size={16} /> Snapshot</button>
                </div>
            </div>

            {/* 2. STATS BAR */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 font-medium">
                    <div className="flex items-center gap-2 text-green-600">
                        <span className="bg-green-100 text-green-700 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">+</span> Add Futures
                    </div>
                    <div><span className="text-gray-500">Day Open:</span> 24343.5 <span className="text-red-500">(-23pt, -0.1%)</span></div>
                    <div><span className="text-gray-500">Spot:</span> {data.spotPrice ? data.spotPrice : '---'} <span className="text-red-500">(-36pt, -0.1%)</span></div>
                    <div><span className="text-gray-500">Fut:</span> 24361.4</div>
                    <div><span className="text-gray-500">Synth Fut:</span> 24320.8 <span className="text-gray-400 font-normal">(18 AUG)</span></div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded font-medium transition-colors"><Search size={14} /> Strategy Finder</button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded font-medium transition-colors">Saved Strategies</button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"><Download size={14} /> Import Strategy</button>
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
                                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.iv} onChange={(e) => setAddons({...addons, iv: e.target.checked})} /> Call & Put IV</label>
                                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.oi} onChange={(e) => setAddons({...addons, oi: e.target.checked})} /> OI</label>
                                        {addons.oi && (
                                            <label className="flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.showAllOi} onChange={(e) => setAddons({...addons, showAllOi: e.target.checked})} /> Show All OI</label>
                                        )}
                                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"><input type="checkbox" className="accent-blue-500 rounded-sm" checked={addons.atm} onChange={(e) => setAddons({...addons, atm: e.target.checked})} /> ATM</label>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="font-semibold text-gray-800">Option Chain <span className="font-normal text-gray-500">(18 AUG 2026)</span></div>
                        <div className="w-16"></div> 
                    </div>

                    <div className="flex items-center border-b border-gray-200 overflow-x-auto custom-scrollbar shrink-0">
                        <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronLeft size={16}/></button>
                        <div className="flex-1 flex min-w-max">
                            <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 bg-blue-50 text-center cursor-pointer"><div className="font-semibold">18 AUG '26</div><div className="text-[10px] text-gray-500">(CW: 1 DTE)</div></div>
                            <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 text-center cursor-pointer"><div className="font-medium">25 AUG '26</div><div className="text-[10px] text-gray-400">(NW/CM: 8 DTE)</div></div>
                            <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 flex items-center justify-center cursor-pointer"><span className="font-medium">1 SEP '26</span></div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600"><ChevronRight size={16}/></button>
                    </div>

                    <div className="p-3 border-b border-gray-200 text-[12px] space-y-3 bg-white shrink-0">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 w-1/4">ATM IV: <span className="font-semibold text-gray-900">11.8</span></span>
                            <div className="flex justify-center items-center gap-3 text-gray-600 w-2/4">
                                <span>ATM:</span>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Spot</label>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" defaultChecked /> Fut</label>
                                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="atm" className="accent-blue-500" /> Synth Fut</label>
                            </div>
                            <span className="text-gray-600 w-1/4 text-right">Straddle Prem: <span className="font-semibold text-gray-900">137</span></span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 w-1/4">PCR: <span className="font-semibold text-gray-900">0.82</span></span>
                            <div className="flex justify-center items-center text-[11px] w-2/4 bg-gray-50 py-1 px-2 rounded">
                                <span className="text-gray-900 font-semibold mr-1">16.8Cr</span><span className="text-green-500 font-medium mr-2">(+1.5Cr)</span>
                                <span className="text-gray-300 mx-1">—</span><span className="text-gray-400 font-medium">OI</span><span className="text-gray-300 mx-1">—</span>
                                <span className="text-gray-900 font-semibold mr-1">13.8Cr</span><span className="text-green-500 font-medium">(+33.8L)</span>
                            </div>
                            <span className="text-gray-600 w-1/4 text-right">Max Pain: <span className="font-semibold text-gray-900">24350</span></span>
                        </div>
                    </div>

                    <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
                        <table className="w-full text-center">
                            <thead className="border-b border-gray-200 text-gray-500 sticky top-0 bg-white shadow-sm z-30">
                                <tr>
                                    <th className="py-2 px-2 font-medium w-[25%]">Call LTP {addons.delta && '(Δ)'}</th>
                                    {addons.oi && <th className="py-2 px-2 font-medium text-gray-400 w-[15%]"></th>}
                                    {addons.iv && <th className="py-2 px-2 font-medium text-gray-400">IV</th>}
                                    <th className="py-2 px-2 font-medium bg-gray-50 border-x border-gray-200 shadow-[inset_0_-1px_0_0_#e5e7eb] w-[20%]">Strike</th>
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
                                    
                                    const isMaxCallOI = callOiRaw === maxCallOI && callOiRaw > 0;
                                    const isMaxPutOI = putOiRaw === maxPutOI && putOiRaw > 0;

                                    const callOiWidth = (callOiRaw / maxOverallOI) * 100;
                                    const putOiWidth = (putOiRaw / maxOverallOI) * 100;

                                    return (
                                        <tr 
                                            key={idx} 
                                            ref={isATM ? atmRowRef : null} 
                                            className={`border-b border-gray-100 hover:bg-gray-50 group ${addons.atm && isATM ? 'border-2 border-blue-400 shadow-md relative z-10' : ''}`}
                                        >
                                            <td className={`py-1.5 px-2 relative ${callBg}`}>
                                                <div className="font-semibold text-gray-800">
                                                    {row.CE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({row.CE?.delta ? parseFloat(row.CE.delta).toFixed(2) : '-'})</span>}
                                                </div>
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <button className="border border-blue-400 text-blue-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">B</button>
                                                    <button className="border border-red-400 text-red-600 bg-white px-1.5 rounded text-[10px] font-bold shadow-sm">S</button>
                                                </div>
                                            </td>

                                            {addons.oi && (
                                                <td className={`relative p-0 h-full ${callBg}`}>
                                                    <div className="flex items-center justify-end w-full h-full min-h-[28px] relative group-hover/oi">
                                                        <div className={`absolute right-0 top-[15%] bottom-[15%] rounded-l-sm transition-all z-0 ${isMaxCallOI ? 'bg-red-200 border-l border-red-400' : 'bg-[#fce4e4] dark:bg-red-900/30'}`} style={{ width: `${callOiWidth}%` }}></div>
                                                        <div className={`absolute right-2 z-10 text-[11px] font-medium ${isMaxCallOI ? 'text-red-500 opacity-100 font-bold' : 'text-red-400 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
                                                            {formatOI(callOiRaw)}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}

                                            {/* 🎯 FIXED: DISPLAY ACTUAL IV DATA */}
                                            {addons.iv && <td className={`py-1.5 px-2 text-gray-500 font-medium text-[11px] ${callBg}`}>{row.CE?.iv ? parseFloat(row.CE.iv).toFixed(1) : '-'}</td>}
                                            
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

                                            {/* 🎯 FIXED: DISPLAY ACTUAL IV DATA */}
                                            {addons.iv && <td className={`py-1.5 px-2 text-gray-500 font-medium text-[11px] ${putBg}`}>{row.PE?.iv ? parseFloat(row.PE.iv).toFixed(1) : '-'}</td>}
                                            
                                            {addons.oi && (
                                                <td className={`relative p-0 h-full ${putBg}`}>
                                                    <div className="flex items-center justify-start w-full h-full min-h-[28px] relative group-hover/oi">
                                                        <div className={`absolute left-0 top-[15%] bottom-[15%] rounded-r-sm transition-all z-0 ${isMaxPutOI ? 'bg-green-200 border-r border-green-500' : 'bg-[#e6f4ea] dark:bg-green-900/30'}`} style={{ width: `${putOiWidth}%` }}></div>
                                                        <div className={`absolute left-2 z-10 text-[11px] font-medium ${isMaxPutOI ? 'text-green-600 opacity-100 font-bold' : 'text-green-500 opacity-0 group-hover/oi:opacity-100 group-hover:opacity-100'} ${addons.showAllOi ? 'opacity-100' : ''} transition-opacity`}>
                                                            {formatOI(putOiRaw)}
                                                        </div>
                                                    </div>
                                                </td>
                                            )}

                                            <td className={`py-1.5 px-2 relative ${putBg}`}>
                                                <div className="font-semibold text-gray-800">
                                                    {row.PE?.ltp || '-'} {addons.delta && <span className="font-normal text-gray-400 text-[11px] ml-1">({row.PE?.delta ? parseFloat(row.PE.delta).toFixed(2) : '-'})</span>}
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
                            <span className="text-gray-500">Expiry</span>
                            <select className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none"><option>18 AUG 2026</option></select>
                        </div>
                        <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
                            <button className="px-3 py-1 bg-white text-gray-800 shadow-sm rounded font-medium text-xs">All</button>
                            <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Risk Defined</button>
                            <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium text-xs">Undefined Risk</button>
                        </div>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar flex-1">
                        {preBuiltStrategies.map((strategy, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white group">
                                <div className="h-16 w-full mb-3 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                    <img src={strategy.image} alt={strategy.name} className="h-full object-contain filter grayscale group-hover:grayscale-0" />
                                </div>
                                <div className="text-center font-semibold text-gray-700 text-xs">{strategy.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulatorPage;