import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { init, dispose, registerOverlay } from 'klinecharts';
import { 
    MousePointer2, Slash, Minus, ArrowRight, Square, Circle, 
    GripHorizontal, Trash2, Loader2, X, Pencil, PaintBucket, Type,
    MoreHorizontal, Copy, EyeOff, Layers, Settings, ChevronDown // 🎯 ये 4 नए आइकन्स जोड़े हैं
} from 'lucide-react';

import { registerAllDrawingTools } from './DrawingPanel';
import { hexToRgba, TV_COLORS, aggregateCandles } from './DrawingPanel/utils';

import { textOverlay } from './DrawingPanel/text';
import { SettingsModal } from './ui/SettingsModal';
import { EditPanel } from './ui/EditPanel';
import { LeftToolbar } from './ui/LeftToolbar';

import ToastNotification from '../../../components/ToastNotification';


registerAllDrawingTools();


// ==========================================
// 📊 MAIN CHART COMPONENT
// ==========================================
const CustomChart = ({ symbol = 'NIFTY', date, timeframe, dataRange, time, playbackSpeed }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [base1mData, setBase1mData] = useState([]);
    const [activeTool, setActiveTool] = useState('cursor');
    const [selectedOverlay, setSelectedOverlay] = useState(null); 
    const [priceAlerts, setPriceAlerts] = useState([]);

    const [toastData, setToastData] = useState(null);



    // 🌟 KLineCharts 10.x के Live Update Callback को सेव करने के लिए
    const liveUpdateCallbackRef = useRef(null);


    // 🌟 अलार्म्स को लाइव एनिमेशन में ट्रैक करने के लिए
    const activeAlertsRef = useRef(priceAlerts);
    useEffect(() => {
        activeAlertsRef.current = priceAlerts;
    }, [priceAlerts]);

    
    // API को सही टाइमफ्रेम भेजने के लिए Ref
    const timeframeRef = useRef(timeframe);
    useEffect(() => { timeframeRef.current = timeframe; }, [timeframe]);

    // 🌟 टाइम और डेट का एकदम Live डेटा रखने के लिए Refs
    const timeRef = useRef(time);
    useEffect(() => { timeRef.current = time; }, [time]);

    const dateRef = useRef(date);
    useEffect(() => { dateRef.current = date; }, [date]);

  
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    
    // TradingView वाले डिफ़ॉल्ट फिबोनाची लेवल्स और कलर्स
    const [fibSettings, setFibSettings] = useState({
        trendLine: { checked: true, color: '#787b86', style: 'dashed' },
        extend: 'Don\'t extend',
        useOneColor: false,
        oneColor: '#787b86',
        showBackground: true,
        backgroundOpacity: 0.2,
        reverse: false,
        showPrices: true,
        showLevels: true,
        textAlign: 'left',
        textBaseline: 'middle',
        fontSize: 12,
        levels: [
            { id: '0', value: 0, checked: true, color: '#787b86' },
            { id: '0.236', value: 0.236, checked: false, color: '#f23645' },
            { id: '0.382', value: 0.382, checked: false, color: '#ff9800' },
            { id: '0.5', value: 0.5, checked: true, color: '#4caf50' },
            { id: '0.618', value: 0.618, checked: true, color: '#089981' },
            { id: '0.786', value: 0.786, checked: false, color: '#00bcd4' },
            { id: '1', value: 1, checked: true, color: '#787b86' },
            { id: '1.618', value: 1.618, checked: false, color: '#2962ff' },
            { id: '2.618', value: 2.618, checked: false, color: '#e91e63' },
            { id: '3.618', value: 3.618, checked: false, color: '#9c27b0' },
            { id: '4.236', value: 4.236, checked: false, color: '#e91e63' },
            { id: '1.272', value: 1.272, checked: false, color: '#ff9800' },
            { id: '1.414', value: 1.414, checked: false, color: '#f23645' },
            { id: '2.272', value: 2.272, checked: false, color: '#ff9800' },
        ]
    });


    const isOverlayClickedRef = useRef(false);
    
    const [activeColorPicker, setActiveColorPicker] = useState(null); 

    const [drawingConfig, setDrawingConfig] = useState({
        borderColor: '#2962FF',
        fillColor: '#2962FF',
        lineWidth: 2,
        fillOpacity: 0.2, 
        borderOpacity: 1,
        text: '',
        textColor: '#2962FF',
        textSize: 14
    });

    const drawingConfigRef = useRef(drawingConfig);
    useEffect(() => { drawingConfigRef.current = drawingConfig; }, [drawingConfig]);

    const selectedOverlayRef = useRef(null);
    useEffect(() => { selectedOverlayRef.current = selectedOverlay; }, [selectedOverlay]);

    const activeOverlayInstanceRef = useRef(null);

    const closeEditPanel = () => {
        const currentSelected = selectedOverlayRef.current;
        if (currentSelected && currentSelected.id && chartRef.current) {
            const currentConfig = drawingConfigRef.current;
            chartRef.current.overrideOverlay({ 
                id: currentSelected.id, 
                groupId: currentSelected.id, // 🎯 Maintain isolated group during override
                extendData: { 
                    fillHex: currentConfig.fillColor, 
                    borderHex: currentConfig.borderColor, 
                    lineWidth: Number(currentConfig.lineWidth),
                    fillOpacity: Number(currentConfig.fillOpacity), 
                    borderOpacity: Number(currentConfig.borderOpacity),
                    text: currentConfig.text, 
                    textColor: currentConfig.textColor, 
                    textSize: currentConfig.textSize,
                    isSelected: false 
                } 
            });
        }
        setSelectedOverlay(null);
        setActiveColorPicker(null);
    };

    useEffect(() => {
        const handleGlobalClick = (e) => {
            // 🎯 अगर यूजर सेटिंग्स मोडल, एडिट पैनल या टूलबार पर क्लिक कर रहा है, तो इग्नोर करें
            if (e.target.closest('.settings-modal') || e.target.closest('.edit-panel') || e.target.closest('.left-toolbar')) return;

            // 🌟 फिक्स: यहाँ से setShowTimeframeMenu हटा दिया गया है!
            
            setTimeout(() => {
                if (!isOverlayClickedRef.current) {
                    setShowSettingsModal(false); 
                    closeEditPanel(); // 🎯 अब यह लाइन बिना क्रैश हुए चलेगी और पैनल बंद हो जाएगा!
                }
                isOverlayClickedRef.current = false; 
            }, 100);
        };

        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            const currentSelected = selectedOverlayRef.current;
            
            // 🗑️ Delete (Backspace / Delete Key)
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (currentSelected && typeof currentSelected.id === 'string' && chartRef.current) {
                    chartRef.current.removeOverlay({ id: currentSelected.id });
                    closeEditPanel();
                }
            }

            // 📋 Copy (Ctrl + C)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
                if (currentSelected && chartRef.current) {
                    const overlayInfo = activeOverlayInstanceRef.current; 
                    if (overlayInfo && overlayInfo.id === currentSelected.id) {
                        localStorage.setItem('tradeMaster_copiedShape', JSON.stringify({
                            name: overlayInfo.name,
                            extendData: { ...overlayInfo.extendData, isSelected: false },
                            styles: overlayInfo.styles,
                            points: overlayInfo.points
                        }));
                    }
                }
            }

            // 📝 Paste (Ctrl + V)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                const copiedDataStr = localStorage.getItem('tradeMaster_copiedShape');
                if (copiedDataStr && chartRef.current) {
                    const copiedData = JSON.parse(copiedDataStr);
                    duplicateOverlay(copiedData, true); 
                }
            }
        };

        // Event listeners को जोड़ना
        document.addEventListener('mousedown', handleGlobalClick, true);
        document.addEventListener('keydown', handleKeyDown);
        
        return () => { 
            // Cleanup
            document.removeEventListener('mousedown', handleGlobalClick, true); 
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
                
                const [year, month, day] = date.split('-');
                const [hour, minute] = time.split(':');
                const cutoffTime = new Date(year, parseInt(month) - 1, day, hour, minute).getTime();

                const slicedData = base1mData.filter(candle => candle.timestamp <= cutoffTime);
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
            // 🚨 THE GENIUS 10.x FIX: यहाँ से लाइव डेटा भेजने का रास्ता (Callback) चुरा लो!
            subscribeBar: ({ callback }) => {
                liveUpdateCallbackRef.current = callback;
            },
            unsubscribeBar: () => {
                liveUpdateCallbackRef.current = null;
            }
        });

        const handleResize = () => { if (chartRef.current) chartRef.current.resize(); };
        window.addEventListener('resize', handleResize);

        return () => { window.removeEventListener('resize', handleResize); if (domElement) dispose(domElement); chartRef.current = null; };
    }, [symbol, base1mData, timeframe]);
    

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

    // ==========================================
    // ⚡ LIVE PREVIEW EFFECT (TradingView Style) - FIXED
    // ==========================================
    useEffect(() => {
        // जब सेटिंग्स मोडल खुला हो, तब हर बदलाव को सीधा चार्ट पर अप्लाई करें
        if (showSettingsModal && selectedOverlay && chartRef.current) {
            
            // 🌟 फिक्स: chartRef.current.getOverlayById की जगह activeOverlayInstanceRef का इस्तेमाल किया!
            const currentExtData = activeOverlayInstanceRef.current?.extendData || {};
            
            chartRef.current.overrideOverlay({
                id: selectedOverlay.id,
                groupId: selectedOverlay.id,
                extendData: { 
                    ...currentExtData, 
                    fibSettings: fibSettings 
                }
            });
        }
    }, [fibSettings]);


   // ==========================================
    // 🚀 SIMULATOR DATA FEEDER (PRO-LEVEL LIVE ANIMATION ⚡)
    // ==========================================
    useEffect(() => {
        if (!chartRef.current || base1mData.length === 0 || !liveUpdateCallbackRef.current) return;

        try {
            // 1. कटऑफ टाइम निकालें
            const [year, month, day] = date.split('-');
            const [hour, minute] = time.split(':');
            const cutoffTime = new Date(year, parseInt(month) - 1, day, hour, minute).getTime();

            const slicedData = base1mData.filter(candle => candle.timestamp <= cutoffTime);
            if (slicedData.length === 0) return;

            // 2. टाइमफ्रेम के हिसाब से डेटा एग्रीगेट करें
            const aggregatedData = aggregateCandles(slicedData, timeframe.value, timeframe.unit);
            if (aggregatedData.length === 0) return;

            // 3. KLineCharts के Strict फॉर्मेट में डेटा तैयार करें (यहाँ Timestamp पहले से Snapped है)
            const sanitizedData = aggregatedData.map(c => ({
                timestamp: new Date(c.timestamp).getTime(),
                open: Number(c.open),
                high: Number(c.high),
                low: Number(c.low),
                close: Number(c.close),
                volume: Number(c.volume) || 0
            }));

            // 🚨 4. THE ULTIMATE FIX: BROKEN SHAPE + HACKER ANIMATION 🚨
        const existingData = chartRef.current.getDataList();
        
        if (existingData.length === 0) {
            sanitizedData.forEach(candle => liveUpdateCallbackRef.current(candle));
        } else {
            const lastChartTimestamp = existingData[existingData.length - 1].timestamp;
            const candlesToUpdate = sanitizedData.filter(c => c.timestamp >= lastChartTimestamp);

            if (candlesToUpdate.length > 0) {
                // STEP A: पुरानी कैंडल्स Complete करें
                for (let i = 0; i < candlesToUpdate.length - 1; i++) {
                    liveUpdateCallbackRef.current(candlesToUpdate[i]);
                }

                // STEP B: Hacker Animation
                const latestCandle = candlesToUpdate[candlesToUpdate.length - 1];
                const { timestamp, open, high, low, close, volume } = latestCandle;

                const isBullish = close >= open;
                const path = isBullish ? [open, low, high, close] : [open, high, low, close];

                // 🎯 THE SAFETY FIX: Number में कन्वर्ट करें ताकि कोई गलती न हो
                const totalDuration = Number(playbackSpeed) || 3000; 
                
                // अगर 60 सेकंड (60000ms) है, तो 250ms का स्मूथ टिक दें, वरना 100ms
                const updateInterval = totalDuration >= 60000 ? 250 : 100; 
                
                const totalSteps = totalDuration / updateInterval;
                
                let currentStep = 0;
                let dynamicHigh = open;
                let dynamicLow = open;

                if (window.liveCandleTimer) clearInterval(window.liveCandleTimer);

                    // लाइव एनीमेशन शुरू!
                    window.liveCandleTimer = setInterval(() => {
                        currentStep++;
                        const progress = currentStep / totalSteps;

                        let currentPrice = open;

                        // प्राइस पाथ कैलकुलेशन
                        if (progress < 0.33) {
                            const subProgress = progress / 0.33;
                            currentPrice = open + (path[1] - open) * subProgress;
                        } else if (progress < 0.66) {
                            const subProgress = (progress - 0.33) / 0.33;
                            currentPrice = path[1] + (path[2] - path[1]) * subProgress;
                        } else {
                            const subProgress = (progress - 0.66) / 0.34;
                            currentPrice = path[2] + (path[3] - path[2]) * subProgress;
                        }

                        // असली मार्केट जैसी Noise
                        const noise = (Math.random() - 0.5) * ((high - low) * 0.15); 
                        let simulatedPrice = currentPrice + noise;

                        // High/Low को पार न करे
                        if (simulatedPrice > high) simulatedPrice = high;
                        if (simulatedPrice < low) simulatedPrice = low;
                        if (simulatedPrice > dynamicHigh) dynamicHigh = simulatedPrice;
                        if (simulatedPrice < dynamicLow) dynamicLow = simulatedPrice;

                        // KLineCharts को लाइव टिक भेजें
                        liveUpdateCallbackRef.current({
                            timestamp: timestamp,
                            open: open,
                            high: dynamicHigh,
                            low: dynamicLow,
                            close: simulatedPrice,
                            volume: Math.floor(volume * progress) || 0
                        });

                        // THE REALTIME VISUAL ALARM (Tick-by-Tick) 🚨
                        activeAlertsRef.current.forEach(alertItem => {
                            if (!alertItem.isTriggered) {
                                const targetPrice = Number(alertItem.price);
                                
                                // 🎯 अब हम असली (Historical) High/Low नहीं, 
                                // बल्कि स्क्रीन पर बन रहे डायनामिक (Animated) High/Low को चेक कर रहे हैं!
                                const isHit = (dynamicLow <= targetPrice) && (dynamicHigh >= targetPrice);
                                
                                if (isHit) {
                                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                                    audio.play().catch(e => console.log(e));
                                    
                                    setToastData({
                                        title: `Alert on ${symbol || 'NIFTY'}`, 
                                        message: `${symbol || 'NIFTY'} Crossing ${targetPrice.toFixed(2)} at ${time}`, 
                                        type: 'alarm' // 🌟 यहाँ 'success' की जगह 'alarm' कर दिया!
                                    });
                                    
                                    setPriceAlerts(prev => prev.map(a => a.id === alertItem.id ? { ...a, isTriggered: true } : a));
                                    
                                    const overlay = chartRef.current.getOverlayById(alertItem.id);
                                    if (overlay) {
                                        chartRef.current.overrideOverlay({
                                            id: alertItem.id,
                                            extendData: { ...overlay.extendData, borderColor: '#2962FF', lineWidth: 2 }
                                        });
                                    }
                                }
                            }
                        });

                        // एनीमेशन खत्म होने पर असली क्लोजिंग डेटा सेट करें
                        if (currentStep >= totalSteps) {
                            clearInterval(window.liveCandleTimer);
                            liveUpdateCallbackRef.current({
                                timestamp: timestamp,
                                open: open,
                                high: high,
                                low: low,
                                close: close,
                                volume: volume || 0
                            });
                        }
                    }, updateInterval);
                }
            }
        } catch (err) {
            console.error("Simulator Tick Error:", err);
        }
    }, [time, date, base1mData, timeframe, priceAlerts]);


    const handleToolClick = (toolId) => {
        setActiveTool(toolId);
        setSelectedOverlay(null); 
        setActiveColorPicker(null);
        setDrawingConfig(prev => ({ ...prev, text: '' }));

        if (!chartRef.current) return;
        if (toolId === 'cursor') { } 
        else if (toolId === 'clear') { 
            chartRef.current.removeOverlay(); 
            setActiveTool('cursor'); 
        } 
        else {
            // 🎯 THE MASTER FIX: Giving a strictly unique ID AND unique Group ID to separate every shape!
            const isolatedId = `shape_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

            chartRef.current.createOverlay({ 
                name: toolId,
                id: isolatedId, 
                groupId: isolatedId, 
                
                // 🌟 यहाँ हमने सिर्फ एक ही extendData रखा है (सब कुछ मिलाकर)
                extendData: {
                    fillHex: drawingConfig.fillColor, borderHex: drawingConfig.borderColor, lineWidth: Number(drawingConfig.lineWidth),
                    fillOpacity: Number(drawingConfig.fillOpacity), borderOpacity: Number(drawingConfig.borderOpacity),
                    text: '', textColor: drawingConfig.textColor, textSize: drawingConfig.textSize, isSelected: false,
                    customPoints: null, // 🎯 इसे इनिशियलाइज़ करना ज़रूरी है
                    fibSettings: typeof fibSettings !== 'undefined' ? fibSettings : null // 🌟 डिफ़ॉल्ट सेटिंग्स
                },
                
                styles: { line: { color: hexToRgba(drawingConfig.borderColor, drawingConfig.borderOpacity), size: Number(drawingConfig.lineWidth) } },
                
                onDrawEnd: function (event) { 
                    if (event && event.overlay) {
                        const overlay = event.overlay;
                        const ext = overlay.extendData || {};
                        
                        // 🎯 1. आपका पुराना लॉजिक: ड्रॉ होने पर पॉइंट्स सेव करें (Clone फीचर के लिए)
                        if (overlay.points) {
                            chartRef.current.overrideOverlay({
                                id: overlay.id, 
                                groupId: overlay.id,
                                extendData: { ...ext, customPoints: overlay.points } 
                            });
                            activeOverlayInstanceRef.current = overlay;
                        }

                        // 🌟 2. नया लॉजिक: अगर 'Text' टूल है, तो तुरंत Modal खोलें
                        if (overlay.name === 'text') {
                            selectedOverlayRef.current = overlay;
                            setSelectedOverlay(overlay);
                            
                            // डिफ़ॉल्ट डेटा सेट करें ताकि Modal में सही दिखे
                            setDrawingConfig({
                                text: ext.text || 'Text',
                                textColor: ext.textColor || '#2962FF',
                                textSize: ext.textSize || 14,
                                showBackground: ext.showBackground !== undefined ? ext.showBackground : true,
                                showBorder: ext.showBorder !== undefined ? ext.showBorder : true,
                                fillColor: ext.fillColor || '#2962FF',
                                borderColor: ext.borderColor || '#2962FF',
                            });

                            setShowSettingsModal(true); // तुरंत Popup खोलें
                            setActiveColorPicker(null); // छोटा पैनल बंद रखें
                        }
                    }
                    
                    // टूल को वापस कर्सर पर सेट करें
                    setActiveTool('cursor'); 
                    return true; 
                },

                onPressedMoveEnd: function (event) {
                    if (event && event.overlay && event.overlay.points) {
                        const ext = event.overlay.extendData || {};
                        chartRef.current.overrideOverlay({
                            id: event.overlay.id, groupId: event.overlay.id,
                            extendData: { ...ext, customPoints: event.overlay.points } // 🎯 ड्रैग होने पर अपडेट करें
                        });
                        activeOverlayInstanceRef.current = event.overlay;
                    }
                    return false;
                },
                
                onRightClick: function (event) {
                    event.preventDefault(); 
                    return false;
                },
                
                onRemoved: function (event) {
                    if (selectedOverlayRef.current?.id === event.overlay.id) {
                        setSelectedOverlay(null);
                        setActiveColorPicker(null);
                        activeOverlayInstanceRef.current = null;
                    }
                },
                
                // (🚨 यहाँ से डुप्लीकेट extendData हटा दिया गया है)
                
                onClick: function (event) {
                    isOverlayClickedRef.current = true; 
                    if (event && event.overlay) {
                        // 🌟 मैजिक फिक्स: अगर पॉइंट्स गायब हैं तो रिस्टोर करें
                        if (!event.overlay.points && event.overlay.extendData?.customPoints) {
                            event.overlay.points = event.overlay.extendData.customPoints;
                        }

                        activeOverlayInstanceRef.current = event.overlay;
                        setSelectedOverlay({ id: event.overlay.id, name: event.overlay.name });
                        
                        if (event.overlay.name === 'rect') setActiveColorPicker('text');
                        else setActiveColorPicker(null);
                        
                        const ext = event.overlay.extendData || {};
                        chartRef.current.overrideOverlay({ 
                            id: event.overlay.id, groupId: event.overlay.id,
                            extendData: { ...ext, isSelected: true } 
                        });

                        if (ext.fibSettings) {
                            setFibSettings(ext.fibSettings);
                        }

                        setDrawingConfig({
                            fillColor: ext.fillHex || '#2962FF', borderColor: ext.borderHex || '#2962FF', lineWidth: ext.lineWidth || 2,
                            fillOpacity: ext.fillOpacity !== undefined ? ext.fillOpacity : 0.2, borderOpacity: ext.borderOpacity !== undefined ? ext.borderOpacity : 1,
                            text: ext.text || '', textColor: ext.textColor || '#2962FF', textSize: ext.textSize || 14
                        });
                    }
                    return true; 
                }
            });
        }
    };

    const updateOverlayStyle = (type, value) => {
        if (!selectedOverlay || !selectedOverlay.id || !chartRef.current) return;
        
        const newConfig = { ...drawingConfig, [type]: value };
        setDrawingConfig(newConfig);

        const { id, name } = selectedOverlay;

        // 🌟 1. यहाँ 'text' को भी शामिल कर लिया है!
        if (name === 'rect' || name === 'circle' || name === 'text' || name === 'horizontalLine') {
            chartRef.current.overrideOverlay({ 
                id, 
                groupId: id, 
                extendData: {
                    // पुराने टूल्स के लिए
                    fillHex: newConfig.fillColor, 
                    borderHex: newConfig.borderColor, 
                    lineWidth: Number(newConfig.lineWidth),
                    fillOpacity: Number(newConfig.fillOpacity), 
                    borderOpacity: Number(newConfig.borderOpacity),
                    
                    // 🌟 2. Text टूल के लिए ज़रूरी सेटिंग्स
                    text: newConfig.text, 
                    textColor: newConfig.textColor, 
                    textSize: newConfig.textSize,
                    showBackground: newConfig.showBackground, 
                    showBorder: newConfig.showBorder,
                    fillColor: newConfig.fillColor, 
                    borderColor: newConfig.borderColor,
                    
                    isSelected: true
                }
            });
        } else {
            chartRef.current.overrideOverlay({ 
                id, 
                groupId: id, 
                styles: { line: { color: hexToRgba(newConfig.borderColor, newConfig.borderOpacity), size: Number(newConfig.lineWidth) } } 
            });
        }
    };

    const deleteActiveOverlay = () => {
        if (selectedOverlay && typeof selectedOverlay.id === 'string' && chartRef.current) {
            // 🎯 यहाँ ऑब्जेक्ट फिल्टर का इस्तेमाल करें
            chartRef.current.removeOverlay({ id: selectedOverlay.id });
            setSelectedOverlay(null);
            setActiveColorPicker(null);
        }
    };


    // ==========================================
    // 🛠️ MORE OPTIONS FUNCTIONS (FIXED)
    // ==========================================

    // 🌟 नया हेल्पर फंक्शन: यह क्लोन और पेस्ट दोनों को हैंडल करेगा
    const duplicateOverlay = (overlayData, applyOffset = false) => {
        // 🎯 KLineCharts बग फिक्स: अगर .points नहीं मिला, तो हमारे बैकअप customPoints से डेटा लो
        const sourcePoints = overlayData.points || (overlayData.extendData?.customPoints);
        
        if (!chartRef.current || !overlayData || !sourcePoints) return;

        const newIsolatedId = `shape_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        
        let finalPoints = sourcePoints;
        if (applyOffset) {
            finalPoints = finalPoints.map(p => {
                const offsetPoint = { ...p };
                if (offsetPoint.timestamp) offsetPoint.timestamp += (10 * 60 * 1000); 
                if (offsetPoint.dataIndex !== undefined) offsetPoint.dataIndex += 2;
                return offsetPoint;
            });
        }

        chartRef.current.createOverlay({
            name: overlayData.name,
            id: newIsolatedId,
            groupId: newIsolatedId,
            extendData: { ...overlayData.extendData, isSelected: false, customPoints: finalPoints }, // 🎯 पॉइंट्स बैकअप में डालें
            styles: overlayData.styles,
            points: finalPoints,
            
            // 🎯 जब शेप ड्रॉ हो जाए
            onDrawEnd: function (event) {
                if (event && event.overlay && event.overlay.points) {
                    const ext = event.overlay.extendData || {};
                    chartRef.current.overrideOverlay({
                        id: event.overlay.id, groupId: event.overlay.id,
                        extendData: { ...ext, customPoints: event.overlay.points }
                    });
                    activeOverlayInstanceRef.current = event.overlay;
                }
                return true;
            },
            
            // 🎯 जब शेप को ड्रैग करके छोड़ें (ताकि नई पोजीशन सेव हो जाए)
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
            },
            
            onRightClick: function (event) {
                event.preventDefault(); 
                return false;
            },
            
            onRemoved: function (event) {
                if (selectedOverlayRef.current?.id === event.overlay.id) {
                    setSelectedOverlay(null);
                    setActiveColorPicker(null);
                    activeOverlayInstanceRef.current = null;
                }
            },
            
            onClick: function (event) {
                isOverlayClickedRef.current = true; 
                if (event && event.overlay) {
                    // 🌟 मैजिक फिक्स: अगर क्लिक पर पॉइंट्स गायब हैं, तो उन्हें वापस डाल दो!
                    if (!event.overlay.points && event.overlay.extendData?.customPoints) {
                        event.overlay.points = event.overlay.extendData.customPoints;
                    }
                    
                    activeOverlayInstanceRef.current = event.overlay; 
                    
                    setSelectedOverlay({ id: event.overlay.id, name: event.overlay.name });
                    if (event.overlay.name === 'rect') setActiveColorPicker('text');
                    else setActiveColorPicker(null);
                    
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
            }
        });
    };

    // 1. CLONE
    const cloneActiveOverlay = () => {
        if (!selectedOverlay || !chartRef.current) return;
        // 🎯 चार्ट से माँगने के बजाय सीधे अपने Ref से डेटा लें
        const overlayInfo = activeOverlayInstanceRef.current; 
        if (overlayInfo && overlayInfo.id === selectedOverlay.id) {
            duplicateOverlay(overlayInfo, true); 
            closeEditPanel();
        }
    };

    // 2. COPY
    const copyActiveOverlay = () => {
        if (!selectedOverlay || !chartRef.current) return;
        // 🎯 यहाँ भी Ref से डेटा लें
        const overlayInfo = activeOverlayInstanceRef.current; 
        if (overlayInfo && overlayInfo.id === selectedOverlay.id) {
            localStorage.setItem('tradeMaster_copiedShape', JSON.stringify({
                name: overlayInfo.name,
                extendData: { ...overlayInfo.extendData, isSelected: false },
                styles: overlayInfo.styles,
                points: overlayInfo.points
            }));
            closeEditPanel();
        }
    };

    // 3. HIDE
    const hideActiveOverlay = () => {
        if (!selectedOverlay || !chartRef.current) return;
        chartRef.current.overrideOverlay({
            id: selectedOverlay.id,
            groupId: selectedOverlay.id, // 🎯 यहाँ groupId देना बहुत ज़रूरी था!
            visible: false
        });
        closeEditPanel();
    };


    // ==========================================
    // 🔔 ADD ALERT LOGIC
    // ==========================================
    const handleAddAlert = (overlay) => {
        if (!overlay || overlay.name !== 'horizontalLine') {
            alert("Alerts can only be set on Horizontal Lines for now!");
            return;
        }

        // 🎯 JADOO: अब KLineCharts से मांगने की ज़रूरत नहीं, सीधे ब्राउज़र की मेमोरी से प्राइस निकालो!
        const targetPrice = window.alertPrices ? window.alertPrices[overlay.id] : undefined;

        if (targetPrice === undefined) {
            alert("Error: Price not found in memory. Please move the line slightly and try again.");
            return;
        }

        // Alert State में सेव करें
        setPriceAlerts(prev => [...prev, { id: overlay.id, price: targetPrice, isTriggered: false }]);

        // 🌟 Visual Feedback: लाइन का कलर ऑरेंज कर दें
        if (chartRef.current) {
            chartRef.current.overrideOverlay({
                id: overlay.id,
                extendData: { borderColor: '#FF9800', lineWidth: 3 } 
            });
        }

        // शानदार सक्सेस मैसेज!
        alert(`🔔 Alert Successfully Set at Price: ${targetPrice.toFixed(2)}`);
    };


    // ==========================================
    // 🎛️ APPLY SETTINGS TO CHART
    // ==========================================
    const applySettingsToChart = () => {
        if (!selectedOverlay || !chartRef.current) return;

        const overlayName = selectedOverlay.name;
        const overlayId = selectedOverlay.id;

        if (overlayName === 'customFib') {
            // 🎯 1. सिर्फ Fibonacci के लिए सेटिंग्स
            chartRef.current.overrideOverlay({
                id: overlayId,
                groupId: overlayId,
                extendData: { 
                    ...selectedOverlay.extendData, 
                    fibSettings: fibSettings 
                },
                styles: {
                    line: {
                        color: fibSettings.trendLine.color,
                        style: fibSettings.trendLine.style
                    }
                }
            });
        } else {
            // 🎯 2. Rect, Circle और Text के लिए सेटिंग्स
            chartRef.current.overrideOverlay({
                id: overlayId,
                groupId: overlayId,
                extendData: {
                    fillHex: drawingConfig.fillColor, 
                    borderHex: drawingConfig.borderColor, 
                    lineWidth: Number(drawingConfig.lineWidth),
                    fillOpacity: Number(drawingConfig.fillOpacity), 
                    borderOpacity: Number(drawingConfig.borderOpacity),
                    
                    // Text की सेटिंग्स
                    text: drawingConfig.text, 
                    textColor: drawingConfig.textColor, 
                    textSize: drawingConfig.textSize,
                    showBackground: drawingConfig.showBackground, 
                    showBorder: drawingConfig.showBorder,
                    fillColor: drawingConfig.fillColor, 
                    borderColor: drawingConfig.borderColor,
                    
                    isSelected: true
                }
            });
        }

        // पॉपअप बंद करें
        setShowSettingsModal(false);
    };


    const drawingTools = [
        { id: 'cursor', icon: MousePointer2, title: 'Cursor' },
        { id: 'segment', icon: Slash, title: 'Trendline' },
        { id: 'horizontalLine', icon: Minus, title: 'Horizontal Line' },
        { id: 'rayLine', icon: ArrowRight, title: 'Ray Line' },
        // { id: 'fibonacciLine', icon: GripHorizontal, title: 'Fibonacci' },
        { id: 'customFib', icon: GripHorizontal, title: 'Fibonacci' },
        { id: 'rect', icon: Square, title: 'Rectangle (Order Block)' },
        { id: 'circle', icon: Circle, title: 'Circle' },
        { id: 'text', icon: Type, title: 'Text' },
    ];

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
                    />
                )}
            </div>
            
        </div>
    );
};

export default CustomChart;