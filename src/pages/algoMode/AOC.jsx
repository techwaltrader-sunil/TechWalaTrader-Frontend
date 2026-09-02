import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {Table, Settings, Play, Pause, SkipBack, SkipForward, Clock, SlidersHorizontal, ChevronDown, BarChart2 } from 'lucide-react';

import CustomChart from '../../components/algoComponents/Aoc/CustomChart';

const AOC = () => {
    const [viewMode, setViewMode] = useState('data'); 
    const [loading, setLoading] = useState(false);
    
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    // 🕒 TIMEFRAME STATE IN AOC (PARENT)
    const [timeframe, setTimeframe] = useState({ value: 5, label: '5m', unit: 'minute' });
    const [showTimeframeMenu, setShowTimeframeMenu] = useState(false);

    // 📅 NEW: DATA RANGE STATE
    const [dataRange, setDataRange] = useState('Previous');
    const [showDataRangeMenu, setShowDataRangeMenu] = useState(false);

    // 👁️ Chart Visibility States
    const [showMagicalLines, setShowMagicalLines] = useState(true);
    const [showOrderLines, setShowOrderLines] = useState(true);

    const DATA_RANGES = [
        'Previous', 
        'Last 1 Month', 
        'Last 3 Months', 
        'Last 6 Months', 
        'Last 9 Months', 
        'Custom Date'
    ];

    const TIMEFRAMES = [
        { category: 'MINUTES', options: [
            { value: 1, label: '1m', unit: 'minute', title: '1 minute' },
            { value: 3, label: '3m', unit: 'minute', title: '3 minutes' },
            { value: 5, label: '5m', unit: 'minute', title: '5 minutes' },
            { value: 15, label: '15m', unit: 'minute', title: '15 minutes' },
            { value: 30, label: '30m', unit: 'minute', title: '30 minutes' },
            { value: 45, label: '45m', unit: 'minute', title: '45 minutes' },
        ]},
        { category: 'HOURS', options: [
            { value: 1, label: '1H', unit: 'hour', title: '1 hour' },
            { value: 2, label: '2H', unit: 'hour', title: '2 hours' },
            { value: 3, label: '3H', unit: 'hour', title: '3 hours' },
            { value: 4, label: '4H', unit: 'hour', title: '4 hours' },
        ]},
        { category: 'DAYS', options: [
            { value: 1, label: '1D', unit: 'day', title: '1 day' },
            { value: 1, label: '1W', unit: 'week', title: '1 week' },
            { value: 1, label: '1M', unit: 'month', title: '1 month' },
        ]}
    ];

    const handleTimeframeChange = (tf) => {
        setTimeframe(tf);
        setShowTimeframeMenu(false);
    };

    
    // 🎛️ NEW: Initialize state from localStorage (Browser Memory)
    const [displayConfig, setDisplayConfig] = useState(() => {
        try {
            const savedConfig = localStorage.getItem('aocDisplayConfig');
            return savedConfig ? JSON.parse(savedConfig) : {
                showGreeks: true,
                showIV: true,
                showOiBadges: true,
                showPowerMeter: true,
                showPCR: true,
                showOiInterpretation: true 
            };
        } catch (error) {
            return {
                showGreeks: true, showIV: true, showOiBadges: true,
                showPowerMeter: true, showPCR: true, showOiInterpretation: true 
            };
        }
    });

    // 🎛️ NEW: Save to localStorage whenever displayConfig changes
    useEffect(() => {
        localStorage.setItem('aocDisplayConfig', JSON.stringify(displayConfig));
    }, [displayConfig]);
    
    const [date, setDate] = useState('2026-08-28');
    const [time, setTime] = useState('09:30'); 
    const [expiry, setExpiry] = useState('');
    const [data, setData] = useState({ spotPrice: 0, chain: [] });
    const [sodChain, setSodChain] = useState([]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [stepSize, setStepSize] = useState(3); 
    const [playbackSpeed, setPlaybackSpeed] = useState(1500); 

    const [aocStats, setAocStats] = useState({
        CE: { Volume: { max: {val:0, strike:0}, secondMax: {val:0, strike:0}, percentage: 0, state: 'STRONG', phrase: 'Strong' }, 
              OI: { max: {val:0, strike:0}, secondMax: {val:0, strike:0}, percentage: 0, state: 'STRONG', phrase: 'Strong' } },
        PE: { Volume: { max: {val:0, strike:0}, secondMax: {val:0, strike:0}, percentage: 0, state: 'STRONG', phrase: 'Strong' }, 
              OI: { max: {val:0, strike:0}, secondMax: {val:0, strike:0}, percentage: 0, state: 'STRONG', phrase: 'Strong' } }
    });

    const [marketMetrics, setMarketMetrics] = useState({ pcr: 0, maxPain: 0, bearPower: 50, bullPower: 50 });

    const tableContainerRef = useRef(null);
    const atmRowRef = useRef(null);

    const toggleConfig = (key) => {
        setDisplayConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const adjustTime = (currentTime, minutesToAdd) => {
        let [hours, minutes] = currentTime.split(':').map(Number);
        let totalMinutes = (hours * 60) + minutes + minutesToAdd;
        if (totalMinutes >= 930) return "15:30"; 
        if (totalMinutes <= 555) return "09:15"; 
        let newHours = Math.floor(totalMinutes / 60);
        let newMins = totalMinutes % 60;
        return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
    };

    useEffect(() => {
        let interval;
        
        if (isPlaying) {
            // 1. टाइम बढ़ाने वाले लॉजिक को एक फंक्शन (advanceTime) में डाल लें
            const advanceTime = () => {
                setTime((prevTime) => {
                    if (prevTime >= "15:30") {
                        setIsPlaying(false);
                        return "15:30";
                    }
                    return adjustTime(prevTime, stepSize);
                });
            };

            // 🚀 2. THE MAGIC: Play दबाते ही टाइम को तुरंत 1 स्टेप आगे बढ़ाएं (No Delay!)
            advanceTime();

            // 3. उसके बाद setInterval अपना काम (60-60 सेकंड के बाद) करता रहेगा
            interval = setInterval(advanceTime, playbackSpeed);
        }
        
        return () => clearInterval(interval);
    }, [isPlaying, stepSize, playbackSpeed]);

    const fetchAOCData = async () => {
        setLoading(true);
        try {
            const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5500' : 'http://65.0.164.229:5500';
            const res = await axios.get(`${API_BASE_URL}/api/simulator/data`, { params: { date, time, expiry } });
            if (res.data.success) {
                setData({ spotPrice: res.data.spotPrice, chain: res.data.chain });
            }
        } catch (error) {
            console.error("Error fetching AOC data:", error);
        }
        setLoading(false);
    };

    const fetchSodData = async () => {
        if (!date) return;
        try {
            const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5500' : 'http://65.0.164.229:5500';
            let res = await axios.get(`${API_BASE_URL}/api/simulator/data`, { params: { date, time: '09:15', expiry } });
            if (res.data.success && res.data.chain.length === 0) {
                res = await axios.get(`${API_BASE_URL}/api/simulator/data`, { params: { date, time: '09:16', expiry } });
            }
            if (res.data.success) {
                setSodChain(res.data.chain);
            }
        } catch (error) {
            console.error("Error fetching SOD data:", error);
        }
    };

    useEffect(() => { fetchAOCData(); }, [date, time, expiry]);
    useEffect(() => { fetchSodData(); }, [date, expiry]);

    useEffect(() => {
        if (data.chain && data.chain.length > 0) {
            calculateLTPLogic(data.chain, sodChain);
            calculateMetrics(data.chain, sodChain); 
        }
        // eslint-disable-next-line
    }, [data.chain, sodChain]);

    const calculateLTPLogic = (chainData, sodData) => {
        const processColumn = (type, key) => {
            let max = { val: 0, strike: 0 };
            let secondMax = { val: 0, strike: 0 };
            
            chainData.forEach(row => {
                const val = row[type]?.[key] ? parseFloat(row[type][key]) : 0;
                if (val > max.val) max = { val, strike: row.strike };
            });
            
            chainData.forEach(row => {
                const val = row[type]?.[key] ? parseFloat(row[type][key]) : 0;
                if (val > secondMax.val && val < max.val) secondMax = { val, strike: row.strike };
            });

            let sodMax = { val: 0, strike: 0 };
            if (sodData && sodData.length > 0) {
                sodData.forEach(row => {
                    const val = row[type]?.[key] ? parseFloat(row[type][key]) : 0;
                    if (val > sodMax.val) sodMax = { val, strike: row.strike };
                });
            } else {
                sodMax = { ...max };
            }

            const percentage = max.val > 0 ? parseFloat(((secondMax.val / max.val) * 100).toFixed(2)) : 0;
            
            let state = "STRONG";
            if (percentage >= 75) {
                if (secondMax.strike > max.strike) state = "WTT";
                else if (secondMax.strike < max.strike) state = "WTB";
            }

            let phrase = "Strong";
            let shiftPhrase = "";
            let isShifted = false;

            if (sodMax.strike > 0 && max.strike !== sodMax.strike) {
                isShifted = true;
                if (max.strike > sodMax.strike) shiftPhrase = "Shifted from Bottom to Top";
                else if (max.strike < sodMax.strike) shiftPhrase = "Shifted from Top to Bottom";
            }

            if (state === "WTT") phrase = "Weak Towards Top";
            else if (state === "WTB") phrase = "Weak Towards Bottom";
            else if (isShifted) phrase = shiftPhrase;

            return { max, secondMax, percentage, state, phrase };
        };

        setAocStats({
            CE: { Volume: processColumn('CE', 'volume'), OI: processColumn('CE', 'oi') },
            PE: { Volume: processColumn('PE', 'volume'), OI: processColumn('PE', 'oi') }
        });
    };

    const calculateMetrics = (chainData, sodData) => {
        let totalCeOi = 0;
        let totalPeOi = 0;
        let totalCeOiChg = 0;
        let totalPeOiChg = 0;

        chainData.forEach(row => {
            let ceOi = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
            let peOi = row.PE?.oi ? parseFloat(row.PE.oi) : 0;

            totalCeOi += ceOi;
            totalPeOi += peOi;

            let sodRow = sodData.find(s => Number(s.strike) === Number(row.strike)) || {};
            let sodCeOi = sodRow.CE?.oi ? parseFloat(sodRow.CE.oi) : ceOi;
            let sodPeOi = sodRow.PE?.oi ? parseFloat(sodRow.PE.oi) : peOi;

            totalCeOiChg += (ceOi - sodCeOi);
            totalPeOiChg += (peOi - sodPeOi);
        });

        const pcr = totalCeOi > 0 ? (totalPeOi / totalCeOi).toFixed(2) : 0;

        const absCeChg = Math.max(0, totalCeOiChg); 
        const absPeChg = Math.max(0, totalPeOiChg); 
        const totalChg = absCeChg + absPeChg;
        
        let bearPower = 50;
        let bullPower = 50;
        if (totalChg > 0) {
            bearPower = Math.round((absCeChg / totalChg) * 100);
            bullPower = Math.round((absPeChg / totalChg) * 100);
        }

        let minLoss = Infinity;
        let maxPainStrike = 0;

        chainData.forEach(testRow => {
            let currentStrike = parseFloat(testRow.strike);
            let totalLoss = 0;

            chainData.forEach(row => {
                let ceOi = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
                let peOi = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
                let rowStrike = parseFloat(row.strike);

                if (currentStrike > rowStrike) totalLoss += (currentStrike - rowStrike) * ceOi;
                if (currentStrike < rowStrike) totalLoss += (rowStrike - currentStrike) * peOi;
            });

            if (totalLoss < minLoss) {
                minLoss = totalLoss;
                maxPainStrike = currentStrike;
            }
        });

        setMarketMetrics({ pcr, maxPain: maxPainStrike, bearPower, bullPower });
    };

    const getYellowBoxText = (vol, oi) => {
        if (!vol || !oi) return "Strong";
        if (vol.phrase?.includes("Shifted")) return vol.phrase;
        if (oi.phrase?.includes("Shifted")) return oi.phrase;
        
        if (vol.state !== 'STRONG' && oi.state === 'STRONG') return `Vol is ${vol.phrase}`;
        if (oi.state !== 'STRONG' && vol.state === 'STRONG') return `OI is ${oi.phrase}`;
        if (vol.state !== 'STRONG' && oi.state !== 'STRONG' && vol.state !== oi.state) return `Vol: ${vol.state} | OI: ${oi.state}`;
        
        return vol.phrase; 
    };

    const getOverallState = (vol, oi) => {
        if (!vol || !oi) return "STRONG";
        if (vol.state === 'WTT' || oi.state === 'WTT') return 'WTT';
        if (vol.state === 'WTB' || oi.state === 'WTB') return 'WTB';
        return 'STRONG';
    };

    const getMarketSentiment = () => {
        const ceWTB = aocStats.CE.Volume.state === 'WTB' || aocStats.CE.OI.state === 'WTB';
        const ceWTT = aocStats.CE.Volume.state === 'WTT' || aocStats.CE.OI.state === 'WTT';
        const peWTB = aocStats.PE.Volume.state === 'WTB' || aocStats.PE.OI.state === 'WTB';
        const peWTT = aocStats.PE.Volume.state === 'WTT' || aocStats.PE.OI.state === 'WTT';

        const ceShiftedTB = aocStats.CE.Volume.phrase === "Shifted from Top to Bottom" || aocStats.CE.OI.phrase === "Shifted from Top to Bottom";
        const ceShiftedBT = aocStats.CE.Volume.phrase === "Shifted from Bottom to Top" || aocStats.CE.OI.phrase === "Shifted from Bottom to Top";
        const peShiftedTB = aocStats.PE.Volume.phrase === "Shifted from Top to Bottom" || aocStats.PE.OI.phrase === "Shifted from Top to Bottom";
        const peShiftedBT = aocStats.PE.Volume.phrase === "Shifted from Bottom to Top" || aocStats.PE.OI.phrase === "Shifted from Bottom to Top";

        if (ceShiftedTB && ceWTT) return { text: "Pullback Trap! Resistance Shifted Down but trying to go Up. Sell on Rise near Max Pain ⚠️", style: "bg-orange-100 text-orange-800 border-orange-400" };
        if (peShiftedBT && peWTB) return { text: "Pullback Trap! Support Shifted Up but trying to go Down. Buy on Dip near Max Pain ⚠️", style: "bg-orange-100 text-orange-800 border-orange-400" };
        if ((ceWTB || ceShiftedTB) && (peWTB || peShiftedTB)) return { text: "Highly Bearish (Blood Bath) - Look for Supply OB to Short 📉", style: "bg-red-100 text-red-800 border-red-300" };
        if ((ceWTT || ceShiftedBT) && !ceShiftedTB && (peWTT || peShiftedBT)) return { text: "Highly Bullish (Rocket) - Look for Demand OB to Long 🚀", style: "bg-green-100 text-green-800 border-green-300" };
        if ((ceWTB || ceShiftedTB) && !peWTB && !peWTT) return { text: "Bearish Pressure - Resistance shifting down. Sell on Rise 📉", style: "bg-red-50 text-red-700 border-red-200" };
        if ((peWTB || peShiftedTB) && !ceWTB && !ceWTT) return { text: "Weak Support - Floor is breaking. Sell on Rise 📉", style: "bg-red-50 text-red-700 border-red-200" };
        if ((ceWTT || ceShiftedBT) && !peWTB && !peWTT) return { text: "Bullish Pressure - Ceiling is lifting. Buy on Dip 🚀", style: "bg-green-50 text-green-700 border-green-200" };
        if ((peWTT || peShiftedBT) && !ceWTB && !ceWTT) return { text: "Strong Support - Floor is shifting up. Buy on Dip 🚀", style: "bg-green-50 text-green-700 border-green-200" };
        if (ceWTB && peWTT) return { text: "Market Squeezing - Both sides pushing center. Wait for breakout ⚠️", style: "bg-yellow-100 text-yellow-800 border-yellow-300" };
        if (ceWTT && peWTB) return { text: "Extreme Volatility (Expanding) - Trade with strict SL ⚡", style: "bg-orange-100 text-orange-800 border-orange-300" };

        return { text: "Rangebound / Strong - Support & Resistance are intact. Trade Edge-to-Edge ⚖️", style: "bg-gray-100 text-gray-800 border-gray-300" };
    };

    const marketSentiment = getMarketSentiment();

    const getChgOISentiment = () => {
        if (marketMetrics.bullPower >= 60) return { text: 'SHORT TRADE 📉', style: 'text-red-400' };
        if (marketMetrics.bearPower >= 60) return { text: 'LONG TRADE 🚀', style: 'text-green-400' };
        return { text: 'SIDEWAYS ⚖️', style: 'text-yellow-400' };
    };
    const oiSentiment = getChgOISentiment();

    const renderOIBadge = (oiChg, ltpChg) => {
        if (!oiChg || oiChg === 0) return <span className="text-gray-400">-</span>;

        let badgeClass = "";
        let badgeText = "";
        let icon = "";

        if (oiChg > 0 && ltpChg >= 0) {
            badgeClass = "bg-green-50 text-green-700 border-green-200";
            badgeText = "Long Build Up";
            icon = "↑";
        } else if (oiChg > 0 && ltpChg < 0) {
            badgeClass = "bg-red-50 text-red-700 border-red-200";
            badgeText = "Short Build Up";
            icon = "↓";
        } else if (oiChg < 0 && ltpChg >= 0) {
            badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
            badgeText = "Short Covering";
            icon = "↑";
        } else if (oiChg < 0 && ltpChg < 0) {
            badgeClass = "bg-yellow-50 text-yellow-800 border-yellow-300";
            badgeText = "Long Unwinding";
            icon = "🏃‍♂️";
        }

        return (
            <div className="flex flex-col items-center justify-center p-0.5 gap-0.5">
                <span className={`font-extrabold ${oiChg > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {oiChg > 0 ? `+${oiChg}` : oiChg}
                </span>
                <span className={`text-[8px] font-bold px-1 py-[1px] rounded-[3px] border leading-none whitespace-nowrap shadow-sm tracking-wide ${badgeClass}`}>
                    {badgeText} {icon}
                </span>
            </div>
        );
    };

    const getCellUI = (strike, statsObj, currentValue) => {
        if (!currentValue || currentValue === 0) return <span className="text-gray-400">-</span>;
        
        if (strike === statsObj.max.strike) {
            return (
                <div className="bg-[#40E0D0] text-black font-bold h-full w-full flex flex-col items-center justify-center py-0.5 relative px-1">
                    <span className="truncate w-full">{currentValue}</span>
                    <span className="text-[9px] text-blue-800 bg-white px-1 rounded-sm border border-blue-300 mt-0.5 leading-none shadow-sm">100%</span>
                </div>
            );
        }
        if (strike === statsObj.secondMax.strike && statsObj.percentage >= 75) {
            return (
                <div className="bg-yellow-300 text-black font-bold h-full w-full flex flex-col items-center justify-center py-0.5 relative px-1">
                    <span className="truncate w-full">{currentValue}</span>
                    <span className="text-[9px] text-red-600 bg-white px-1 rounded-sm border border-red-200 mt-0.5 leading-none shadow-sm">{statsObj.percentage}%</span>
                </div>
            );
        }
        return <span className="font-medium text-gray-700 truncate px-1">{currentValue}</span>;
    };

    const getAtmStrike = () => {
        if (!data.spotPrice || data.chain.length === 0) return null;
        return data.chain.reduce((prev, curr) => Math.abs(curr.strike - data.spotPrice) < Math.abs(prev.strike - data.spotPrice) ? curr : prev).strike;
    };
    const atmStrike = getAtmStrike();

    useEffect(() => {
        if (atmRowRef.current && tableContainerRef.current && !isPlaying) {
            atmRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [data.chain, isPlaying]);

    const getBadgeColor = (state) => {
        if (state === 'WTT') return 'text-green-600';
        if (state === 'WTB') return 'text-red-600';
        return 'text-gray-800';
    };

    return (
        <div className="bg-gray-50 h-screen flex flex-col overflow-hidden font-sans text-gray-800">
            
            {/* 🚀 TOP MAIN HEADER */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm z-30 shrink-0">
                
                {/* Left: Symbol, Date & Time */}
                <div className="flex items-center gap-3 w-1/3">
                    <div className="font-extrabold text-blue-800 text-lg tracking-wide bg-blue-50 px-3 py-0.5 rounded border border-blue-200 shadow-sm flex items-center gap-2">
                        NIFTY 50
                    </div>
                    <div className="flex gap-2">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={isPlaying} className="border border-gray-300 px-2 py-1 text-sm rounded bg-gray-50 outline-none font-bold text-gray-700 disabled:opacity-50 cursor-pointer hover:bg-gray-100" />
                        <div className={`flex items-center border px-2 py-1 text-sm rounded font-bold transition-colors shadow-inner ${isPlaying ? 'bg-green-100 text-green-700 border-green-400' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
                            <Clock size={14} className="mr-1" /> {time}
                        </div>
                    </div>
                </div>

                {/* Center: Settings Toggle Menu */}
                <div className="relative flex justify-center w-1/3">
                    <button 
                        onClick={() => setShowSettingsMenu(!showSettingsMenu)} 
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold border shadow-sm transition-all ${showSettingsMenu ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                        <SlidersHorizontal size={14} /> AOC CONFIG
                    </button>

                    {/* Dropdown Menu */}
                    {showSettingsMenu && (
                        <div className="absolute top-full mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-lg p-3 flex flex-col gap-3 z-50">
                            <span className="text-[10px] uppercase font-bold text-gray-400 border-b pb-1 tracking-wider">Toggle Display Elements</span>
                            
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={displayConfig.showOiInterpretation} onChange={() => toggleConfig('showOiInterpretation')} /> 
                                🎯 Center OI Interpretation
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={displayConfig.showOiBadges} onChange={() => toggleConfig('showOiBadges')} /> 
                                🏷️ Call/Put Status Badges
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={displayConfig.showPowerMeter} onChange={() => toggleConfig('showPowerMeter')} /> 
                                📊 Live Power Meter (Bulls/Bears)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={displayConfig.showPCR} onChange={() => toggleConfig('showPCR')} /> 
                                📉 PCR & Max Pain Ribbon
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={displayConfig.showIV} onChange={() => toggleConfig('showIV')} /> 
                                ⚡ Implied Volatility (IV)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={displayConfig.showGreeks} onChange={() => toggleConfig('showGreeks')} /> 
                                Δ Greeks (Delta)
                            </label>
                        </div>
                    )}
                </div>

                {/* Right: View Modes */}
                <div className="flex justify-end w-1/3">
                    <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
                        <button onClick={() => setViewMode('chart')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${viewMode === 'chart' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><BarChart2 size={14} /> Chart</button>
                        <button onClick={() => setViewMode('split')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${viewMode === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><BarChart2 size={14} /><Table size={14} /> Split</button>
                        <button onClick={() => setViewMode('data')} className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${viewMode === 'data' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Table size={14} /> Data</button>
                    </div>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden p-2 gap-2" onClick={() => showSettingsMenu && setShowSettingsMenu(false)}>
                
                {/* 📉 LEFT PANEL: SMC CHART */}
                <div className={`bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full transition-all duration-300 ${viewMode === 'data' ? 'hidden' : viewMode === 'chart' ? 'w-full' : 'w-[55%] xl:w-[60%]'}`}>
                    
                    {/* 🌟 यहाँ हेडर में हम टाइमफ्रेम ड्रॉपडाउन सेट कर रहे हैं */}
                    <div className="px-3 py-1.5 border-b border-gray-200 bg-gray-50 shrink-0 flex justify-between items-center rounded-t-lg relative">
                        <div className="flex items-center gap-3">
                            
                            {/* 🎯 स्टेप 5 वाला टाइमफ्रेम ड्रॉपडाउन UI */}
                            <div className="timeframe-dropdown relative flex items-center">
                                <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5 mr-2">
                                    <BarChart2 size={15} className="text-blue-600" /> NIFTY
                                </span>
                                <div 
                                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 px-2 py-0.5 rounded text-xs font-semibold text-blue-600 bg-blue-50 transition-colors border border-blue-100"
                                    onClick={() => setShowTimeframeMenu(!showTimeframeMenu)}
                                >
                                    {timeframe.label}
                                    <ChevronDown size={12} className="text-blue-600" />
                                </div>

                                {/* 🔽 Dropdown Menu */}
                                {showTimeframeMenu && (
                                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 shadow-xl rounded-md py-2 text-sm z-[100] max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {TIMEFRAMES.map((group, gIdx) => (
                                            <div key={gIdx} className="mb-2 last:mb-0">
                                                <div className="px-4 py-1 text-xs font-semibold text-gray-400 tracking-wider">
                                                    {group.category}
                                                </div>
                                                {group.options.map((tf, tIdx) => (
                                                    <button
                                                        key={tIdx}
                                                        onClick={() => handleTimeframeChange(tf)}
                                                        className={`w-full text-left px-5 py-1.5 hover:bg-blue-50 transition-colors ${timeframe.label === tf.label ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
                                                    >
                                                        {tf.title}
                                                    </button>
                                                ))}
                                                {gIdx !== TIMEFRAMES.length - 1 && <div className="w-full h-px bg-gray-100 mt-2"></div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 🎯 2. NEW: Data Range Dropdown (इसे टाइमफ्रेम के ठीक बगल में लगाएँ) */}
                            <div className="data-range-dropdown relative flex items-center ml-1">
                                <div 
                                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 px-2 py-0.5 rounded text-xs font-semibold text-gray-700 bg-gray-200 transition-colors border border-gray-300"
                                    onClick={() => {
                                        setShowDataRangeMenu(!showDataRangeMenu);
                                        setShowTimeframeMenu(false); // दूसरा मेन्यू बंद करें
                                    }}
                                >
                                    {dataRange}
                                    <ChevronDown size={12} className="text-gray-500" />
                                </div>

                                {/* 🔽 Range Dropdown Menu */}
                                {showDataRangeMenu && (
                                    <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 shadow-xl rounded-md py-1 text-sm z-[100]">
                                        {DATA_RANGES.map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    setDataRange(range);
                                                    setShowDataRangeMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-1.5 hover:bg-blue-50 transition-colors ${
                                                    dataRange === range ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
                                                }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>


                        {/* 🎛️ RIGHT SIDE: CHART VISIBILITY TOGGLES */}
                        <div className="flex items-center gap-4">
                            {/* 1. AOC Magical Lines Toggle */}
                            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setShowMagicalLines(!showMagicalLines)}>
                                <span className="text-[12px] font-bold text-gray-600">Magical Lines</span>
                                <div className={`w-8 h-4 rounded-full flex items-center p-[2px] transition-colors duration-300 ${showMagicalLines ? 'bg-[#2962ff]' : 'bg-gray-300'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${showMagicalLines ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* 2. Order Lines Toggle */}
                            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setShowOrderLines(!showOrderLines)}>
                                <span className="text-[12px] font-bold text-gray-600">Order Lines</span>
                                <div className={`w-8 h-4 rounded-full flex items-center p-[2px] transition-colors duration-300 ${showOrderLines ? 'bg-[#26a69a]' : 'bg-gray-300'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${showOrderLines ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    
                    {/* 🚀 THE REAL CHART INTEGRATION */}
                    <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
                        <CustomChart symbol="NIFTY" date={date} timeframe={timeframe} dataRange={dataRange} time={time} playbackSpeed={playbackSpeed} aocStats={aocStats} 
                            marketMetrics={marketMetrics} chainData={data.chain} showMagicalLines={showMagicalLines}  showOrderLines={showOrderLines}  />
                    </div>
                </div>

                {/* ADVANCE OPTION CHAIN */}
                <div className={`bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden transition-all duration-300 ${viewMode === 'chart' ? 'hidden' : viewMode === 'data' ? 'w-full' : 'w-[45%] xl:w-[40%]'}`}>
                    
                    <div className="flex flex-col shrink-0 z-20">
                        {/* RED/GREEN BANNERS WITH CENTRAL OI INTERPRETATION BADGE */}
                        <div className="relative flex text-white font-bold text-[11px] text-center shrink-0">
                            <div className="w-1/2 bg-[#dc3545] py-2 flex flex-col items-center justify-center border-r border-white/20 gap-1.5">
                                <div className="bg-white text-green-700 px-4 py-1 rounded shadow-md text-[12px] border border-green-600 flex items-center gap-1 uppercase tracking-wide">
                                    RESISTANCE {aocStats.CE.Volume.max?.strike || '---'} - {getOverallState(aocStats.CE.Volume, aocStats.CE.OI)}
                                </div>
                                <div className="bg-[#ffeb3b] text-black px-4 py-0.5 rounded shadow-sm border border-[#fbc02d] text-[11px] font-extrabold tracking-wide">
                                    {getYellowBoxText(aocStats.CE.Volume, aocStats.CE.OI)}
                                </div>
                            </div>
                            
                            <div className="w-1/2 bg-[#28a745] py-2 flex flex-col items-center justify-center gap-1.5">
                                <div className="bg-white text-red-600 px-4 py-1 rounded shadow-md text-[12px] border border-red-50 flex items-center gap-1 uppercase tracking-wide">
                                    SUPPORT {aocStats.PE.Volume.max?.strike || '---'} - {getOverallState(aocStats.PE.Volume, aocStats.PE.OI)}
                                </div>
                                <div className="bg-[#ffeb3b] text-black px-4 py-0.5 rounded shadow-sm border border-[#fbc02d] text-[11px] font-extrabold tracking-wide">
                                    {getYellowBoxText(aocStats.PE.Volume, aocStats.PE.OI)}
                                </div>
                            </div>

                            {/* 🎛️ CONDITIONAL: THE MASTER BADGE */}
                            {displayConfig.showOiInterpretation && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-4 py-1.5 rounded-lg border-[2px] border-gray-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] z-20 flex flex-col items-center min-w-[150px]">
                                    <span className="text-[7.5px] text-gray-300 font-bold tracking-widest uppercase mb-[2px]">OI Interpretation</span>
                                    <span className={`text-[12px] font-extrabold tracking-wide ${oiSentiment.style}`}>
                                        {oiSentiment.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* ACTION BAR */}
                        <div className={`text-center py-1.5 text-[11px] font-extrabold border-b ${marketSentiment.style}`}>
                            🎯 ACTION: {marketSentiment.text}
                        </div>

                        {/* 🎛️ CONDITIONAL: LIVE POWER METER */}
                        {displayConfig.showPowerMeter && (
                            <div className="bg-white border-b border-gray-200 px-4 py-1.5 flex flex-col gap-1 shrink-0">
                                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider">
                                    <span className="text-red-600 drop-shadow-sm">Bears (CE Chg OI) : {marketMetrics.bearPower}%</span>
                                    <span className="text-gray-500 font-bold text-[9px] bg-gray-100 px-2 rounded-full border border-gray-200">Live Power Meter</span>
                                    <span className="text-green-600 drop-shadow-sm">Bulls (PE Chg OI) : {marketMetrics.bullPower}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                                    <div className="h-full bg-[#dc3545] transition-all duration-500 ease-in-out" style={{ width: `${marketMetrics.bearPower}%` }}></div>
                                    <div className="h-full bg-[#28a745] transition-all duration-500 ease-in-out" style={{ width: `${marketMetrics.bullPower}%` }}></div>
                                </div>
                            </div>
                        )}

                        {/* 🎛️ CONDITIONAL: SNIPER METRICS RIBBON */}
                        {displayConfig.showPCR && (
                            <div className="bg-gray-100 border-b border-gray-200 flex justify-center items-center px-4 py-1 text-[11px] font-bold text-gray-700 shrink-0 shadow-inner gap-6">
                                <span className="flex items-center gap-1">
                                    <span className="text-gray-500 tracking-wider">PCR:</span> 
                                    <span className={marketMetrics.pcr >= 1 ? 'text-green-600 bg-green-100 px-1.5 rounded' : 'text-red-600 bg-red-100 px-1.5 rounded'}>
                                        {marketMetrics.pcr}
                                    </span>
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className="flex items-center gap-1">
                                    <span className="text-gray-500 tracking-wider">MAX PAIN:</span> 
                                    <span className="text-blue-700 bg-blue-100 px-1.5 rounded">
                                        {marketMetrics.maxPain}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* TABLE AREA */}
                    <div ref={tableContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 relative select-none">
                        <table className="w-full text-center text-[10px] sm:text-[11px] border-collapse relative table-fixed">
                            <thead className="sticky top-0 shadow-sm z-10 bg-gray-200 text-gray-700 font-bold">
                                <tr>
                                    {/* 🎛️ FIXED WIDTH PERCENTAGES FOR PERFECT SYMMETRY */}
                                    {viewMode === 'data' && displayConfig.showGreeks && <th className="border border-gray-300 py-1.5 bg-blue-50 text-blue-800 w-[5%] sm:w-[6%]">Delta (Δ)</th>}
                                    {viewMode === 'data' && displayConfig.showIV && <th className="border border-gray-300 py-1.5 bg-purple-50 text-purple-800 w-[4%] sm:w-[5%]">IV</th>}
                                    
                                    <th className="border border-gray-300 py-1.5">OI Chg</th>
                                    <th className="border border-gray-300 py-1.5">OI</th>
                                    <th className="border border-gray-300 py-1.5">Volume</th>
                                    <th className="border border-gray-300 py-1.5 w-[7%] sm:w-[8%]">LTP</th>
                                    
                                    <th className="border border-gray-300 py-1.5 bg-[#ffb347] text-white tracking-wider w-[9%] sm:w-[10%] shadow-md z-20 relative">STRIKE</th>
                                    
                                    <th className="border border-gray-300 py-1.5 w-[7%] sm:w-[8%]">LTP</th>
                                    <th className="border border-gray-300 py-1.5">Volume</th>
                                    <th className="border border-gray-300 py-1.5">OI</th>
                                    <th className="border border-gray-300 py-1.5">OI Chg</th>
                                    
                                    {viewMode === 'data' && displayConfig.showIV && <th className="border border-gray-300 py-1.5 bg-purple-50 text-purple-800 w-[4%] sm:w-[5%]">IV</th>}
                                    {viewMode === 'data' && displayConfig.showGreeks && <th className="border border-gray-300 py-1.5 bg-blue-50 text-blue-800 w-[5%] sm:w-[6%]">Delta (Δ)</th>}
                                </tr>
                            </thead>
                            
                            <tbody className={`${loading && !isPlaying ? 'opacity-50' : 'opacity-100'}`}>
                                {data.chain.length > 0 && (() => {
                                    let spotInsertIndex = data.chain.length - 1;
                                    for (let i = 0; i < data.chain.length; i++) {
                                        if (data.chain[i].strike > data.spotPrice) {
                                            spotInsertIndex = i - 1;
                                            break;
                                        }
                                    }

                                    const renderSpotLine = (key) => {
                                        const ceOiState = aocStats.CE.OI?.state || 'STRONG';
                                        const ceOiPct = aocStats.CE.OI?.state !== 'STRONG' ? `${aocStats.CE.OI?.percentage}%` : '';
                                        const ceVolState = aocStats.CE.Volume?.state || 'STRONG';
                                        const ceVolPct = aocStats.CE.Volume?.state !== 'STRONG' ? `${aocStats.CE.Volume?.percentage}%` : '';

                                        const peVolState = aocStats.PE.Volume?.state || 'STRONG';
                                        const peVolPct = aocStats.PE.Volume?.state !== 'STRONG' ? `${aocStats.PE.Volume?.percentage}%` : '';
                                        const peOiState = aocStats.PE.OI?.state || 'STRONG';
                                        const peOiPct = aocStats.PE.OI?.state !== 'STRONG' ? `${aocStats.PE.OI?.percentage}%` : '';

                                        const renderLineWithBadge = (state, pct) => (
                                            <div className="relative w-full h-[32px] flex items-center justify-center">
                                                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#dc3545] -translate-y-1/2 z-0"></div>
                                                <span className="relative z-10 bg-white border border-gray-400 text-black px-1.5 py-0.5 rounded-sm text-[9.5px] font-bold flex gap-1 shadow-sm whitespace-nowrap">
                                                    <span className={getBadgeColor(state)}>{state}</span> {pct}
                                                </span>
                                            </div>
                                        );

                                        const renderJustLine = () => (
                                            <div className="w-full h-[32px] flex items-center justify-center">
                                                 <div className="w-full h-[2px] bg-[#dc3545]"></div>
                                            </div>
                                        );

                                        return (
                                            <tr key={key} className="bg-white">
                                                {viewMode === 'data' && displayConfig.showGreeks && <td className="p-0 align-middle">{renderJustLine()}</td>}
                                                {viewMode === 'data' && displayConfig.showIV && <td className="p-0 align-middle">{renderJustLine()}</td>}
                                                <td className="p-0 align-middle">{renderJustLine()}</td>
                                                <td className="p-0 align-middle">{renderLineWithBadge(ceOiState, ceOiPct)}</td>
                                                <td className="p-0 align-middle">{renderLineWithBadge(ceVolState, ceVolPct)}</td>
                                                <td className="p-0 align-middle">{renderJustLine()}</td>
                                                
                                                <td className="p-0 align-middle relative h-[32px] bg-gray-100">
                                                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#dc3545] -translate-y-1/2 z-0"></div>
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-[1.5px] border-[#dc3545] rounded-md text-[#dc3545] font-extrabold text-[11px] py-0.5 px-2 shadow-sm flex flex-col items-center leading-none z-10 w-[90%]">
                                                        <span className="text-[7.5px] font-bold text-gray-500 mb-[1px] tracking-wider">SPOT</span>
                                                        <span>{data.spotPrice}</span>
                                                    </div>
                                                </td>

                                                <td className="p-0 align-middle">{renderJustLine()}</td>
                                                <td className="p-0 align-middle">{renderLineWithBadge(peVolState, peVolPct)}</td>
                                                <td className="p-0 align-middle">{renderLineWithBadge(peOiState, peOiPct)}</td>
                                                <td className="p-0 align-middle">{renderJustLine()}</td>
                                                {viewMode === 'data' && displayConfig.showIV && <td className="p-0 align-middle">{renderJustLine()}</td>}
                                                {viewMode === 'data' && displayConfig.showGreeks && <td className="p-0 align-middle">{renderJustLine()}</td>}
                                            </tr>
                                        );
                                    };

                                    return data.chain.reduce((acc, row, idx) => {
                                        const isATM = row.strike === atmStrike;
                                        const isCallITM = row.strike < data.spotPrice;
                                        const isPutITM = row.strike > data.spotPrice;

                                        const callStyle = isCallITM ? 'bg-gray-100 border-gray-100' : 'bg-white border-gray-200';
                                        const putStyle = isPutITM ? 'bg-gray-100 border-gray-100' : 'bg-white border-gray-200';

                                        const sodRow = sodChain.find(s => Number(s.strike) === Number(row.strike)) || {};
                                        
                                        const ceOiCurrent = row.CE?.oi ? parseFloat(row.CE.oi) : 0;
                                        const peOiCurrent = row.PE?.oi ? parseFloat(row.PE.oi) : 0;
                                        const sodCeOi = sodRow.CE?.oi ? parseFloat(sodRow.CE.oi) : ceOiCurrent;
                                        const sodPeOi = sodRow.PE?.oi ? parseFloat(sodRow.PE.oi) : peOiCurrent;
                                        const ceOiChg = ceOiCurrent - sodCeOi;
                                        const peOiChg = peOiCurrent - sodPeOi;

                                        const ceLtpCurrent = row.CE?.ltp ? parseFloat(row.CE.ltp) : 0;
                                        const peLtpCurrent = row.PE?.ltp ? parseFloat(row.PE.ltp) : 0;
                                        const sodCeLtp = sodRow.CE?.ltp ? parseFloat(sodRow.CE.ltp) : ceLtpCurrent;
                                        const sodPeLtp = sodRow.PE?.ltp ? parseFloat(sodRow.PE.ltp) : peLtpCurrent;
                                        const ceLtpChg = ceLtpCurrent - sodCeLtp;
                                        const peLtpChg = peLtpCurrent - sodPeLtp;
                                        
                                        const rowElement = (
                                            <tr key={`strike-${idx}`} ref={isATM ? atmRowRef : null} className={`border-b hover:bg-gray-50`}>
                                                
                                                {viewMode === 'data' && displayConfig.showGreeks && <td className={`border p-0 h-[38px] font-medium text-blue-700 truncate ${isCallITM ? 'bg-gray-100 border-gray-100' : 'bg-blue-50/30 border-gray-200'}`}>{row.CE?.delta ? parseFloat(row.CE.delta).toFixed(2) : <span className="text-gray-400">-</span>}</td>}
                                                {viewMode === 'data' && displayConfig.showIV && <td className={`border p-0 h-[38px] font-medium text-purple-700 truncate ${isCallITM ? 'bg-gray-100 border-gray-100' : 'bg-purple-50/30 border-gray-200'}`}>{row.CE?.iv ? parseFloat(row.CE.iv).toFixed(1) : <span className="text-gray-400">-</span>}</td>}
                                                
                                                <td className={`border p-0 h-[38px] ${callStyle}`}>
                                                    {displayConfig.showOiBadges ? 
                                                        renderOIBadge(ceOiChg, ceLtpChg) : 
                                                        (ceOiChg !== 0 ? <span className={`font-bold ${ceOiChg > 0 ? 'text-green-600' : 'text-red-500'}`}>{ceOiChg > 0 ? `+${ceOiChg}` : ceOiChg}</span> : <span className="text-gray-400">-</span>)
                                                    }
                                                </td>

                                                <td className={`border p-0 h-[38px] overflow-hidden ${callStyle}`}>{getCellUI(row.strike, aocStats.CE.OI, row.CE?.oi)}</td>
                                                <td className={`border p-0 h-[38px] overflow-hidden ${callStyle}`}>{getCellUI(row.strike, aocStats.CE.Volume, row.CE?.volume)}</td>
                                                <td className={`border p-0 h-[38px] font-bold text-gray-800 truncate ${callStyle}`}>{row.CE?.ltp || <span className="text-gray-400">-</span>}</td>
                                                
                                                <td className={`border border-gray-300 p-0 font-extrabold text-[12px] h-[38px] truncate ${isATM ? 'bg-gray-200 text-gray-800 shadow-inner' : 'bg-gray-200 text-gray-800'}`}>{row.strike}</td>
                                                
                                                <td className={`border p-0 h-[38px] font-bold text-gray-800 truncate ${putStyle}`}>{row.PE?.ltp || <span className="text-gray-400">-</span>}</td>
                                                <td className={`border p-0 h-[38px] overflow-hidden ${putStyle}`}>{getCellUI(row.strike, aocStats.PE.Volume, row.PE?.volume)}</td>
                                                <td className={`border p-0 h-[38px] overflow-hidden ${putStyle}`}>{getCellUI(row.strike, aocStats.PE.OI, row.PE?.oi)}</td>
                                                
                                                <td className={`border p-0 h-[38px] ${putStyle}`}>
                                                    {displayConfig.showOiBadges ? 
                                                        renderOIBadge(peOiChg, peLtpChg) : 
                                                        (peOiChg !== 0 ? <span className={`font-bold ${peOiChg > 0 ? 'text-green-600' : 'text-red-500'}`}>{peOiChg > 0 ? `+${peOiChg}` : peOiChg}</span> : <span className="text-gray-400">-</span>)
                                                    }
                                                </td>

                                                {viewMode === 'data' && displayConfig.showIV && <td className={`border p-0 h-[38px] font-medium text-purple-700 truncate ${isPutITM ? 'bg-gray-100 border-gray-100' : 'bg-purple-50/30 border-gray-200'}`}>{row.PE?.iv ? parseFloat(row.PE.iv).toFixed(1) : <span className="text-gray-400">-</span>}</td>}
                                                {viewMode === 'data' && displayConfig.showGreeks && <td className={`border p-0 h-[38px] font-medium text-blue-700 truncate ${isPutITM ? 'bg-gray-100 border-gray-100' : 'bg-blue-50/30 border-gray-200'}`}>{row.PE?.delta ? parseFloat(row.PE.delta).toFixed(2) : <span className="text-gray-400">-</span>}</td>}
                                            </tr>
                                        );

                                        if (idx === 0 && data.spotPrice < row.strike) acc.push(renderSpotLine('spot-top'));
                                        acc.push(rowElement);
                                        if (idx === spotInsertIndex) acc.push(renderSpotLine('spot-line'));

                                        return acc;
                                    }, []);
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SIMULATOR CONTROL BAR */}
            <div className="bg-white border-t border-gray-300 px-4 py-2.5 flex items-center justify-center gap-6 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20 shrink-0">
                <button onClick={() => setTime(prev => adjustTime(prev, -stepSize))} disabled={isPlaying} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50">
                    <SkipBack size={18} />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)} className={`px-5 py-1.5 rounded-full font-bold text-white flex items-center gap-2 shadow-md transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isPlaying ? <><Pause size={16} className="fill-current" /> Pause</> : <><Play size={16} className="fill-current" /> Play Simulator</>}
                </button>
                <button onClick={() => setTime(prev => adjustTime(prev, stepSize))} disabled={isPlaying} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50">
                    <SkipForward size={18} />
                </button>
                <div className="h-6 w-px bg-gray-300 mx-2"></div> 
                <div className="flex items-center border border-gray-300 rounded overflow-hidden shadow-sm">
                    <span className="px-2 py-1 bg-gray-100 text-[11px] font-bold text-gray-600 border-r border-gray-300">Step</span>
                    <select value={stepSize} onChange={e => setStepSize(Number(e.target.value))} disabled={isPlaying} className="px-2 py-1 text-xs outline-none bg-white font-medium cursor-pointer disabled:bg-gray-50">
                        <option value={1}>1 Min</option>
                        <option value={3}>3 Min</option>
                        <option value={5}>5 Min</option>
                        <option value={15}>15 Min</option>
                    </select>
                </div>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden shadow-sm">
                    <span className="px-2 py-1 bg-gray-100 text-[11px] font-bold text-gray-600 border-r border-gray-300">Speed</span>
                    <select value={playbackSpeed} onChange={e => setPlaybackSpeed(Number(e.target.value))} className="px-2 py-1 text-xs outline-none bg-white font-medium cursor-pointer">
                        <option value={60000}>Realtime (60s) 🔥</option>
                        <option value={2000}>Slow</option>
                        <option value={1500}>Normal</option>
                        <option value={500}>Fast (2x)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default AOC;