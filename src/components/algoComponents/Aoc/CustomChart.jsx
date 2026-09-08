import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { init, dispose, registerOverlay } from 'klinecharts';
import { 
    MousePointer2, Slash, Minus, ArrowRight, Square, Circle, 
    GripHorizontal, Loader2, Type, 
    Plus, Bell, TrendingDown, X,
} from 'lucide-react';

import { registerAllDrawingTools } from './DrawingPanel';
import { aggregateCandles } from './DrawingPanel/utils';

import { SettingsModal } from './ui/SettingsModal';
import { EditPanel } from './ui/EditPanel';
import { LeftToolbar } from './ui/LeftToolbar';

import ToastNotification from '../../../components/ToastNotification';

import { OPTION_INDICES } from '../../../data/instrumentData';

import { useTradingMode } from '../../../context/TradingModeContext';

import {useGhostEngine} from '../../../hooks/useGhostEngine';
import { useAocLines } from '../../../hooks/useAocLines';
import { useMarketEngine } from '../../../hooks/useMarketEngine';
import { useOptionsCalculator } from '../../../hooks/useOptionsCalculator';
import { useDrawingTools } from '../../../hooks/useDrawingTools'

import { AlertConfigModal } from './ui/AlertConfigModal';
import { TradePanel } from './ui/TradePanel';
import { CancelOrderModal } from './ui/CancelOrderModal';
import { DeleteAlertModal } from './ui/DeleteAlertModal';
import { TradeReportCard } from './ui/TradeReportCard';

import { registerAllCustomOverlays } from '../../../utils/KLineOverlays';




registerAllDrawingTools();

registerAllCustomOverlays();


// ==========================================
// 📊 MAIN CHART COMPONENT
// ==========================================
const CustomChart = ({ symbol = 'NIFTY', date, timeframe, dataRange, time, playbackSpeed, aocStats, marketMetrics, chainData, showMagicalLines, showOrderLines, sniperRules, sniperMode, maxShiftPts, spotPrice, showReport, setShowReport, marketActionText }) => {

    const { appMode } = useTradingMode();
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [base1mData, setBase1mData] = useState([]);
  
    
    const [toastData, setToastData] = useState(null);


    // 🌟 Advanced Alert Config Modal State
    const [alertConfigModal, setAlertConfigModal] = useState({
        visible: false,
        mode: 'create', // 'create' या 'edit'
        id: null,
        symbol: 'NIFTY',
        price: 0,
        condition: 'Crossing',
        trigger: 'Only Once',
        alertName: '',
        message: '',
        isAutoTrade: false,
        tradeSide: 'BUY',
        tradeOptionType: 'CE',
        tradeQty: 65,
        tradeSl: 20,
        tradeTp: 50
    });

    // 🌟 TRADE PANEL VISIBILITY STATE
    const [showTradePanel, setShowTradePanel] = useState(false);

    const [deleteAlertModal, setDeleteAlertModal] = useState({ visible: false, alertId: '', symbol: '', price: 0 })

    const [tradeConfig, setTradeConfig] = useState({
        instrument: 'Options', 
        side: 'BUY',           
        optionType: 'CE',      
        qty: 65,
        expiry: 'Current Week',
        slType: 'Points',
        slValue: 0,
        tpType: 'Points',
        tpValue: 0,
        clickedPrice: 0,   
        nearestStrike: 0,  
        premium: 0,
        
        // 👇 🌟 NEW PARAMS FOR STRIKE SELECTION
        strikeCriteria: 'ATM pt',
        strikeType: 'ATM'
    });


    // ==========================================
    // 👻 THE GHOST ENGINE (Alerts, Auto-Trade & P&L)
    // ==========================================
    const { 
        priceAlerts, 
        setPriceAlerts, 
        handleAddAlert,
        openPositions,      // 👈
        setOpenPositions,   // 👈
        processPnL          // 👈 
    } = useGhostEngine(chartRef, symbol, setToastData, sniperMode, sniperRules, maxShiftPts, setAlertConfigModal, setDeleteAlertModal, chartContainerRef, chainData, marketActionText);

    // ==========================================
    // 🔮 THE AOC QUANT ENGINE (6 Magical Lines)
    // ==========================================
    useAocLines(chartRef, aocStats, marketMetrics, chainData, showMagicalLines);

    
    // 🌟 KLineCharts 10.x के Live Update Callback को सेव करने के लिए
    const liveUpdateCallbackRef = useRef(null);

    // 🌟 1. State में 'x: 0' जोड़ें
    const [crosshairBtn, setCrosshairBtn] = useState({ visible: false, x: 0, y: 0, price: 0 });
    const [tvMenu, setTvMenu] = useState({ visible: false, y: 0, price: 0 });

    const tvMenuRef = useRef(false); 

    // 🌟 2. Hover को ट्रैक करने के लिए State और Ref दोनों का कॉम्बिनेशन
    const [isHoveringBtn, setIsHoveringBtn] = useState(false);
    const isHoveringBtnRef = useRef(false);

    const setHoverState = (val) => {
        setIsHoveringBtn(val);
        isHoveringBtnRef.current = val;
    };

 
    useEffect(() => { tvMenuRef.current = tvMenu.visible; }, [tvMenu.visible]);

    // 🌟 अलार्म्स को लाइव एनिमेशन में ट्रैक करने के लिए
    const activeAlertsRef = useRef(priceAlerts);
    useEffect(() => {
        activeAlertsRef.current = priceAlerts;
    }, [priceAlerts]);


    // 🌟 THE MAGIC: Symbol के हिसाब से सही लॉट साइज निकालें
    const baseLotSize = OPTION_INDICES.find(inst => inst.name === symbol)?.lot || 65;

    // जैसे ही चार्ट का Symbol बदलेगा (Nifty -> BankNifty), Trade Panel की Quantity अपने-आप अपडेट हो जाएगी!
    useEffect(() => {
        setTradeConfig(prev => ({ ...prev, qty: baseLotSize }));
    }, [symbol, baseLotSize]);

    
    // API को सही टाइमफ्रेम भेजने के लिए Ref
    const timeframeRef = useRef(timeframe);
    useEffect(() => { timeframeRef.current = timeframe; }, [timeframe]);

    // 🌟 टाइम और डेट का एकदम Live डेटा रखने के लिए Refs
    const timeRef = useRef(time);
    useEffect(() => { timeRef.current = time; }, [time]);

    const dateRef = useRef(date);
    useEffect(() => { dateRef.current = date; }, [date]);
  

    // 🛡️ Order Delete Confirmation Modal State
    const [cancelOrderModal, setCancelOrderModal] = useState({
        visible: false,
        type: '',   // 'ENTRY', 'SL', या 'TP'
        posId: ''   // ट्रेड की ID
    });  
   

    useEffect(() => {
        const domElement = chartContainerRef.current;
        if (!domElement) return;

        dispose(domElement);
        const chart = init(domElement);
        chartRef.current = chart;

        chart.setStyles({
            grid: { horizontal: { color: '#f3f4f6' }, vertical: { color: '#f3f4f6' } },
            candle: { type: 'candle_solid', bar: { upColor: '#26a69a', downColor: '#ef5350', upBorderColor: '#26a69a', downBorderColor: '#ef5350', upWickColor: '#26a69a', downWickColor: '#ef5350' } }
        });

        chart.setSymbol({ ticker: symbol });
        chart.setPeriod({ span: timeframe.value, type: timeframe.unit });

        // 🌟 KLineCharts 10.x का ऑफिशियल डेटा लोडर
        chart.setDataLoader({
            getBars: async ({ callback }) => {
                if (!date || base1mData.length === 0) { callback([]); return; }
                
                let slicedData = base1mData;

                // 🚨 THE FIX: सिर्फ Historical Mode में डेटा को टाइम (09:30) पर काटो
                // Live Mode में आज का पूरा डेटा चार्ट पर जाने दो
                if (appMode === 'historical') {
                    const [year, month, day] = date.split('-');
                    const [hour, minute] = time.split(':');
                    const cutoffTime = new Date(year, parseInt(month) - 1, day, hour, minute).getTime();
                    slicedData = base1mData.filter(candle => candle.timestamp <= cutoffTime);
                }

                const aggregatedData = aggregateCandles(slicedData, timeframe.value, timeframe.unit);
                
                const sanitizedData = aggregatedData.map(c => ({
                    timestamp: new Date(c.timestamp).getTime(),
                    open: Number(c.open),
                    high: Number(c.high),
                    low: Number(c.low),
                    close: Number(c.close),
                    volume: Number(c.volume) || 0
                }));

                callback(sanitizedData);
            },
            subscribeBar: ({ callback }) => {
                liveUpdateCallbackRef.current = callback;
            },
            unsubscribeBar: () => {
                liveUpdateCallbackRef.current = null;
            }
        });


        // ====================================================
        // 🚀 🎯 THE TRADINGVIEW '+' BUTTON TRACKER (नया कोड)
        // ====================================================
        const crosshairHandler = (data) => {
            // अगर मेनू खुला है, तो क्रॉसहेयर बटन को फ्रीज़ कर दें
            if (tvMenuRef.current || isHoveringBtnRef.current) return;

            // अगर क्रॉसहेयर गायब है या चार्ट से बाहर है
            if (!data || data.y === undefined || data.y < 0) {
                setCrosshairBtn(prev => ({ ...prev, visible: false }));
                return;
            }

            try {
                // Pixel (Y) को असली Price में बदलें
                const val = chart.convertFromPixel([{ y: data.y }], { paneId: 'candle_pane' });
                const price = val?.[0]?.value || val?.[0] || 0;

                setCrosshairBtn({
                    visible: true,
                    x: data.x,
                    y: data.y,
                    price: price
                });
            } catch (err) {}
        };

        // क्रॉसहेयर मूवमेंट को सब्सक्राइब करें
        chart.subscribeAction('onCrosshairChange', crosshairHandler);
        // ====================================================


        const handleResize = () => { if (chartRef.current) chartRef.current.resize(); };
            window.addEventListener('resize', handleResize);

            return () => { 
                window.removeEventListener('resize', handleResize); 
                
                // 🧹 🚨 Cleanup: जब चार्ट रीलोड हो तो पुराने ट्रैकर को हटा दें
                chart.unsubscribeAction('onCrosshairChange', crosshairHandler); 
                
                if (domElement) dispose(domElement); 
                chartRef.current = null; 
            };
        }, [symbol, base1mData, timeframe]);


    // ==========================================
    // 👁️ OVERLAY VISIBILITY ENFORCER ENGINE
    // ==========================================
    useEffect(() => {
        if (!chartRef.current) return;
        
        const chart = chartRef.current;

        // 1. Hide/Show Magical Lines (AOC Levels)
        chart.overrideOverlay({ 
            groupId: 'aoc_magic_lines', 
            visible: showMagicalLines 
        });

        // 2. Hide/Show ALL Active Orders (Entry, SL, TP)
        openPositions.forEach(pos => {
            chart.overrideOverlay({ 
                groupId: pos.id, 
                visible: showOrderLines 
            });
        });
        
    }, [showMagicalLines, showOrderLines, openPositions, chainData, aocStats]);
    

    // 2️⃣ API CALL: डेट, सिंबल या डेटा-रेंज बदलने पर डेटा मँगाएगा
    useEffect(() => {
        if (!date || !symbol) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5500' : 'http://65.0.164.229:5500';
                
                // 🎯 1. Start Date कैलकुलेट करने का लॉजिक
                let startDateStr = date; 
                
                if (dataRange !== 'Custom Date') {
                    const endDateObj = new Date(date);
                    
                    // 🌟 नया लॉजिक: 'Previous' के लिए पिछले 4 दिन का डेटा लाएँ (Weekend को ध्यान में रखते हुए)
                    if (dataRange === 'Previous') {
                        endDateObj.setDate(endDateObj.getDate() - 1); // 1 दिन पीछे जाओ
                        
                        // 0 = Sunday, 6 = Saturday
                        // अगर पीछे जाने पर Sunday मिले, तो 2 दिन और पीछे जाओ (Friday)
                        if (endDateObj.getDay() === 0) {
                            endDateObj.setDate(endDateObj.getDate() - 2);
                        } 
                        // अगर पीछे जाने पर Saturday मिले, तो 1 दिन और पीछे जाओ (Friday)
                        else if (endDateObj.getDay() === 6) {
                            endDateObj.setDate(endDateObj.getDate() - 1);
                        }
                    }
                    else if (dataRange === 'Last 1 Month') {
                        endDateObj.setMonth(endDateObj.getMonth() - 1);
                    }
                    else if (dataRange === 'Last 3 Months') {
                        endDateObj.setMonth(endDateObj.getMonth() - 3);
                    }
                    else if (dataRange === 'Last 6 Months') {
                        endDateObj.setMonth(endDateObj.getMonth() - 6);
                    }
                    else if (dataRange === 'Last 9 Months') {
                        endDateObj.setMonth(endDateObj.getMonth() - 9);
                    }
                    
                    // डेट को YYYY-MM-DD फॉर्मेट में बदलना
                    startDateStr = endDateObj.toISOString().split('T')[0]; 
                }

                // 🎯 2. API कॉल (यहाँ कोई बदलाव नहीं)
                const res = await axios.get(`${API_BASE_URL}/api/aoc/chart-data`, { 
                    params: { 
                        symbol: symbol, 
                        startDate: startDateStr, 
                        endDate: date            
                    } 
                });

                if (res.data.success && res.data.data && res.data.data.length > 0) {
                    const formattedData = res.data.data
                        .map(c => ({ timestamp: new Date(c.timestamp).getTime(), open: parseFloat(c.open), high: parseFloat(c.high), low: parseFloat(c.low), close: parseFloat(c.close), volume: parseFloat(c.volume) || 0 }))
                        .filter(c => !isNaN(c.open) && !isNaN(c.close))
                        .sort((a, b) => a.timestamp - b.timestamp);
                    
                    setBase1mData(formattedData); 
                } else {
                    setBase1mData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setBase1mData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol, date, dataRange]);


    // 3️⃣ MAGIC UPDATE: टाइमफ्रेम बदलते ही चार्ट का पीरियड अपडेट करेगा
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.setPeriod({ span: timeframe.value, type: timeframe.unit });
            chartRef.current.resize();
        }
    }, [timeframe]);

    

    const drawingTools = [
        { id: 'cursor', icon: MousePointer2, title: 'Cursor' },
        { id: 'segment', icon: Slash, title: 'Trendline' },
        { id: 'horizontalLine', icon: Minus, title: 'Horizontal Line' },
        { id: 'rayLine', icon: ArrowRight, title: 'Ray Line' },

        { id: 'customFib', icon: GripHorizontal, title: 'Fibonacci' },
        { id: 'rect', icon: Square, title: 'Rectangle (Order Block)' },
        { id: 'circle', icon: Circle, title: 'Circle' },
        { id: 'text', icon: Type, title: 'Text' },
    ];

    
    // ==========================================
    // 🚀 THE LIVE & SIMULATOR MARKET ENGINE (अब यह सही जगह पर है)
    // ==========================================
    useMarketEngine(
        appMode, chartRef, base1mData, timeframe, date, time, playbackSpeed, 
        symbol, setPriceAlerts, setOpenPositions, processPnL, 
        setToastData, liveUpdateCallbackRef, activeAlertsRef
    );


    // ==========================================
    // 🧮 OPTIONS CALCULATOR ENGINE (Strikes & Premiums)
    // ==========================================
    useOptionsCalculator(tradeConfig, setTradeConfig, chainData);

    // ==========================================
    // 🎨 THE DRAWING TOOLS ENGINE (Shapes, Text, Fib, Copy/Paste)
    // ==========================================
    const {
        activeTool, setActiveTool,
        selectedOverlay, setSelectedOverlay,
        activeColorPicker, setActiveColorPicker,
        showSettingsModal, setShowSettingsModal,
        fibSettings, setFibSettings,
        drawingConfig, setDrawingConfig,
        handleToolClick, updateOverlayStyle, deleteActiveOverlay, 
        cloneActiveOverlay, copyActiveOverlay, hideActiveOverlay, 
        applySettingsToChart, closeEditPanel
    } = useDrawingTools(chartRef);

    let visuallyActiveTool = activeTool;
    if (activeTool === 'cursor' && selectedOverlay) {
        visuallyActiveTool = selectedOverlay.name;
    }

    return (
        <div className="flex flex-row w-full h-full bg-white relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            
            {/* 🛠️ LEFT TOOLBAR (Imported Component) */}
            <LeftToolbar 
                drawingTools={drawingTools} 
                visuallyActiveTool={visuallyActiveTool} 
                handleToolClick={handleToolClick} 
            />

            {/* 📊 CHART CONTAINER */}
            <div className="flex-1 relative">
                
                {/* 🎛️ MAIN EDIT PANEL (Imported Component) */}
                {!showSettingsModal && (
                    <EditPanel 
                        selectedOverlay={selectedOverlay}
                        activeColorPicker={activeColorPicker}
                        setActiveColorPicker={setActiveColorPicker}
                        drawingConfig={drawingConfig}
                        updateOverlayStyle={updateOverlayStyle}
                        setShowSettingsModal={setShowSettingsModal}
                        cloneActiveOverlay={cloneActiveOverlay}
                        copyActiveOverlay={copyActiveOverlay}
                        hideActiveOverlay={hideActiveOverlay}
                        deleteActiveOverlay={deleteActiveOverlay}
                        closeEditPanel={closeEditPanel}
                        handleAddAlert={handleAddAlert}
                    />
                )}

                {/* ⏳ LOADING SPINNER */}
                {loading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
                        <Loader2 size={30} className="animate-spin text-blue-600" />
                    </div>
                )}

                
                {/* 📈 ACTUAL KLINECHART DOM NODE */}
                <div ref={chartContainerRef} className="w-full h-full cursor-crosshair"></div>

                {/* 🎛️ SETTINGS MODAL (Imported Component) */}
                {showSettingsModal && (
                    <SettingsModal 
                        selectedOverlay={selectedOverlay}
                        fibSettings={fibSettings}
                        setFibSettings={setFibSettings}
                        
                        // 🌟 ये 2 नई लाइनें जोड़ें ताकि Rectangle की सेटिंग्स काम कर सकें
                        drawingConfig={drawingConfig}       
                        updateOverlayStyle={updateOverlayStyle} 
                        
                        setShowSettingsModal={setShowSettingsModal}
                        applySettingsToChart={applySettingsToChart}
                    />
                )}

                {/* 🚀 THE MAGIC: आपका कस्टम Toast Notification यहाँ आएगा */}
                {toastData && (
                    <ToastNotification 
                        title={toastData.title}       // 👈 🌟 यह लाइन मिसिंग थी!
                        message={toastData.message} 
                        type={toastData.type} 
                        onClose={() => setToastData(null)} 
                        autoClose={false} 
                        duration={4000}     
                    />
                )}
                

                {/* 🚀 1. THE FLOATING '+' BUTTON (TradingView Style) */}
                {(isHoveringBtn || tvMenu.visible) && crosshairBtn.visible && (
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                        {/* Horizontal Dashed Line (X-Axis) */}
                        <div 
                            className="absolute left-0 border-t border-dashed border-gray-600 opacity-60"
                            style={{ top: crosshairBtn.y, width: 'calc(100% - 64px)' }} 
                        />
                        {/* Vertical Dashed Line (Y-Axis) */}
                        <div 
                            className="absolute top-0 border-l border-dashed border-gray-600 opacity-60"
                            style={{ left: crosshairBtn.x, height: '100%' }} 
                        />
                    </div>
                )}

                {/* 🚀 1. THE FLOATING '+' BUTTON & PRICE LABEL (TradingView Style) */}
                {crosshairBtn.visible && !tvMenu.visible && (
                    <div 
                        className="absolute z-40 flex items-center cursor-pointer group"
                        style={{
                            top: crosshairBtn.y - 12, 
                            right: 0, 
                        }}
                        // 🌟 Hover स्टेट को सेट करें
                        onMouseEnter={() => setHoverState(true)}
                        onMouseLeave={() => setHoverState(false)}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTvMenu({ visible: true, y: crosshairBtn.y, price: crosshairBtn.price });
                        }}
                    >
                        {/* गोल '+' आइकॉन */}
                        <div className="flex items-center justify-center w-5 h-5 mr-1.5 bg-white border border-gray-400 rounded-full shadow-sm text-gray-600 group-hover:text-blue-600 group-hover:border-blue-600 transition-colors">
                            <Plus size={14} strokeWidth={2.5} />
                        </div>
                        
                        {/* 🌟 TradingView स्टाइल डार्क प्राइस लेबल */}
                        <div 
                            className="flex items-center justify-center h-6 bg-slate-800 text-white text-[11px] font-semibold rounded-sm shadow-sm"
                            style={{ width: '64px' }} 
                        >
                            {crosshairBtn.price.toFixed(2)}
                        </div>
                    </div>
                )}

                {/* 🚀 2. THE CONTEXT MENU (Add Alert, Buy, Sell) */}
                {tvMenu.visible && (
                    <>
                        {/* Background Overlay (क्लिक करके बंद करने के लिए) */}
                        <div 
                            className="absolute inset-0 z-40 cursor-crosshair" 
                            onClick={() => {
                                setTvMenu({ ...tvMenu, visible: false });
                                setHoverState(false); // 🌟 Lock खोलें
                                setCrosshairBtn(prev => ({ ...prev, visible: false })); // 🌟 बटन को छुपाएं
                            }} 
                        />
                        
                        <div 
                            className="absolute z-50 bg-white border border-gray-200 rounded shadow-lg flex flex-col py-1 text-xs text-gray-700 w-60 animate-in fade-in zoom-in duration-150"
                            style={{
                                top: tvMenu.y - 10,
                                right: 85, // बटन के थोड़ा बाईं (Left) तरफ खुलेगा
                            }}
                        >
                            {/* Header (Price) */}
                            <div className="px-3 py-2 border-b border-gray-100 font-bold flex justify-between items-center text-blue-600 bg-blue-50/50">
                                <span className="text-[13px]">{tvMenu.price.toFixed(2)}</span>
                                <X 
                                    size={14} 
                                    className="cursor-pointer text-gray-400 hover:text-red-500" 
                                    onClick={() => {
                                        setTvMenu({ ...tvMenu, visible: false });
                                        setHoverState(false); // 🌟 Lock खोलें
                                        setCrosshairBtn(prev => ({ ...prev, visible: false })); // 🌟 बटन को छुपाएं
                                    }} 
                                />
                            </div>

                            {/* Options */}
                            <div className="hover:bg-blue-50 px-3 py-2 cursor-pointer flex items-center gap-2 transition-colors"
                                 onClick={() => {
                                     // 🎯 THE FIX: सीधा लाइन बनाने के बजाय, पहले TradingView जैसा कॉन्फ़िगरेशन मोडल खोलें
                                     setAlertConfigModal({
                                         visible: true,
                                         mode: 'create',
                                         id: `alert_${Date.now()}`,
                                         symbol: symbol || 'NIFTY',
                                         price: tvMenu.price,
                                         condition: 'Crossing',
                                         trigger: 'Only Once',
                                         alertName: `${symbol || 'NIFTY'} Alert`,
                                         message: `${symbol || 'NIFTY'} Crossing ${tvMenu.price.toFixed(2)}`
                                     });
                                     
                                     // 🌟 Clean Close for Context Menu
                                     setTvMenu({ ...tvMenu, visible: false });
                                     setHoverState(false);
                                     setCrosshairBtn(prev => ({ ...prev, visible: false }));
                                 }}>
                                <Bell size={14} className="text-orange-500" /> 
                                <span>Add alert on {symbol || 'NIFTY'} at {tvMenu.price.toFixed(2)}</span>
                            </div>

                            {/* 🔴 THE SELL BUTTON */}
                            <div className="hover:bg-red-50 px-3 py-2 cursor-pointer flex items-center gap-2 text-red-600 transition-colors"
                                 onClick={() => {
                                     const clickP = tvMenu.price;
                                     const strike = Math.round(clickP / baseLotSize) * baseLotSize; // 🎯 (ऑप्शनल: अगर स्ट्राइक गैप भी लॉट साइज जैसा है)

                                     setTradeConfig(prev => ({ 
                                         ...prev, 
                                         side: 'SELL', 
                                         clickedPrice: clickP,
                                         nearestStrike: Math.round(clickP / 50) * 50, // निफ्टी के लिए 50 ही रहेगा
                                         premium: 0 
                                     }));
                                     
                                     setShowTradePanel(true);
                                     setTvMenu({ ...tvMenu, visible: false });
                                     setHoverState(false);
                                     setCrosshairBtn(prev => ({ ...prev, visible: false }));
                                 }}>
                                <TrendingDown size={14} /> Sell {baseLotSize} {symbol || 'NIFTY'} Limit @ {tvMenu.price.toFixed(2)}
                            </div>

                            {/* 🟢 THE BUY BUTTON */}
                            <div className="hover:bg-green-50 px-3 py-2 cursor-pointer flex items-center gap-2 text-green-700 transition-colors font-medium"
                                 onClick={() => {
                                     const clickP = tvMenu.price;

                                     setTradeConfig(prev => ({ 
                                         ...prev, 
                                         side: 'BUY', 
                                         clickedPrice: clickP,
                                         nearestStrike: Math.round(clickP / 50) * 50,
                                         premium: 0 
                                     }));

                                     setShowTradePanel(true);
                                     setTvMenu({ ...tvMenu, visible: false });
                                     setHoverState(false);
                                     setCrosshairBtn(prev => ({ ...prev, visible: false }));
                                 }}>
                                <div className="flex items-center justify-center bg-[#26a69a] text-white rounded text-[10px] font-bold w-5 h-5">B</div>
                                <span>Buy {baseLotSize} {symbol || 'NIFTY'} Limit @ {tvMenu.price.toFixed(2)}</span>
                            </div>

                            <div className="border-t border-gray-100 my-1"></div>

                            <div className="hover:bg-blue-50 px-3 py-2 cursor-pointer flex items-center gap-2 transition-colors"
                                 onClick={() => {
                                     // 🎯 THE FIX: यूनिक ID और Edit Panel का जादुई onClick इवेंट
                                     const isolatedId = `shape_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

                                     chartRef.current.createOverlay({
                                         name: 'horizontalLine',
                                         id: isolatedId,
                                         groupId: isolatedId,
                                         // 🌟 डिफ़ॉल्ट सेटिंग्स पास करें ताकि Edit Panel में सही डेटा दिखे
                                         extendData: { 
                                             borderHex: '#2962FF', lineWidth: 2, fillHex: '#2962FF', 
                                             fillOpacity: 0.2, borderOpacity: 1, text: '', 
                                             textColor: '#2962FF', textSize: 14, isSelected: false 
                                         },
                                         styles: { line: { color: '#2962FF', size: 2 } }, 
                                         points: [{ value: tvMenu.price }],
                                         
                                         // 🌟 The Magic Click Handler (यही Edit Panel खोलेगा!)
                                         onClick: function (event) {
                                             isOverlayClickedRef.current = true; 
                                             if (event && event.overlay) {
                                                 activeOverlayInstanceRef.current = event.overlay;
                                                 setSelectedOverlay({ id: event.overlay.id, name: event.overlay.name });
                                                 setActiveColorPicker(null);
                                                 
                                                 const ext = event.overlay.extendData || {};
                                                 chartRef.current.overrideOverlay({ 
                                                     id: event.overlay.id, groupId: event.overlay.id,
                                                     extendData: { ...ext, isSelected: true } 
                                                 });

                                                 setDrawingConfig({
                                                     fillColor: ext.fillHex || '#2962FF', borderColor: ext.borderHex || '#2962FF', lineWidth: ext.lineWidth || 2,
                                                     fillOpacity: ext.fillOpacity !== undefined ? ext.fillOpacity : 0.2, borderOpacity: ext.borderOpacity !== undefined ? ext.borderOpacity : 1,
                                                     text: ext.text || '', textColor: ext.textColor || '#2962FF', textSize: ext.textSize || 14
                                                 });
                                             }
                                             return true; 
                                         },
                                         onPressedMoveEnd: function (event) {
                                             if (event && event.overlay && event.overlay.points) {
                                                 const ext = event.overlay.extendData || {};
                                                 chartRef.current.overrideOverlay({
                                                     id: event.overlay.id, groupId: event.overlay.id,
                                                     extendData: { ...ext, customPoints: event.overlay.points } 
                                                 });
                                                 activeOverlayInstanceRef.current = event.overlay;
                                             }
                                             return false;
                                         }
                                     });
                                     
                                     // 🌟 Clean Close
                                     setTvMenu({ ...tvMenu, visible: false });
                                     setHoverState(false);
                                     setCrosshairBtn(prev => ({ ...prev, visible: false }));
                                 }}>
                                <Minus size={14} className="text-blue-500" /> Draw horizontal line
                            </div>                          

                        </div>
                    </>
                )}
            </div>
            
            {/* 🚀 3. DELETE ALERT CONFIRMATION MODAL */}
            <DeleteAlertModal 
                deleteAlertModal={deleteAlertModal}
                setDeleteAlertModal={setDeleteAlertModal}
                chartRef={chartRef}
                chartContainerRef={chartContainerRef}
                setPriceAlerts={setPriceAlerts}
            />

            {/* 🚀 4. ORDER / SL / TP CANCEL CONFIRMATION MODAL (Cleaned UI Component) */}
            <CancelOrderModal 
                cancelOrderModal={cancelOrderModal}
                setCancelOrderModal={setCancelOrderModal}
                chartRef={chartRef}
                setOpenPositions={setOpenPositions}
                setToastData={setToastData}
            />

            {/* 🚀 4. ADVANCED TRADINGVIEW ALERT CONFIG MODAL (Cleaned UI Component) */}
            <AlertConfigModal 
                alertConfigModal={alertConfigModal}
                setAlertConfigModal={setAlertConfigModal}
                handleAddAlert={handleAddAlert}
                setPriceAlerts={setPriceAlerts}
                chartRef={chartRef}
                baseLotSize={baseLotSize}
                symbol={symbol}
            />

            {/* 🚀 5. THE DELTA EXCHANGE STYLE TRADE PANEL (Cleaned UI Component) */}
            <TradePanel 
                showTradePanel={showTradePanel}
                setShowTradePanel={setShowTradePanel}
                tradeConfig={tradeConfig}
                setTradeConfig={setTradeConfig}
                baseLotSize={baseLotSize}
                symbol={symbol}
                chartRef={chartRef}
                setOpenPositions={setOpenPositions}
                setToastData={setToastData}
                setCancelOrderModal={setCancelOrderModal}
            />      

            {/* 📊 THE TRADE REPORT MODAL */}
            {showReport && (
                <TradeReportCard 
                    positions={openPositions} 
                    onClose={() => setShowReport(false)} 
                />
            )}     
            
        </div>
    );
};

export default CustomChart;