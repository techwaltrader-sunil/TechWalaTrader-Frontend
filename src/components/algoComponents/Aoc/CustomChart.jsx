import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { init, dispose, registerOverlay } from 'klinecharts';
import { 
    MousePointer2, Slash, Minus, ArrowRight, Square, Circle, 
    GripHorizontal, Loader2, Type, 
    Plus, Bell, TrendingDown, TrendingUp, X,
} from 'lucide-react';

import { registerAllDrawingTools } from './DrawingPanel';
import { hexToRgba, aggregateCandles } from './DrawingPanel/utils';

import { SettingsModal } from './ui/SettingsModal';
import { EditPanel } from './ui/EditPanel';
import { LeftToolbar } from './ui/LeftToolbar';

import ToastNotification from '../../../components/ToastNotification';

import { OPTION_INDICES } from '../../../data/instrumentData';


registerAllDrawingTools();


// 🚀 1. ALERT LINE OVERLAY
if (!window.alertLineRegistered) {
    registerOverlay({
        name: 'alertLine',
        needDefaultPointFigure: true,
        needDefaultXAxisFigure: false,
        needDefaultYAxisFigure: true,
        createPointFigures: ({ overlay, coordinates, bounding }) => {
            const y = coordinates[0].y;
            const ext = overlay.extendData || {};
            const isHovered = ext.isHovered || false;
            const price = ext.price || 0;
            const symbol = ext.symbol || 'NIFTY';

            const figures = [
                {
                    type: 'line',
                    attrs: { coordinates: [{ x: 0, y }, { x: bounding.width, y }] },
                    styles: { style: 'dashed', color: '#3b3b3b', size: 1.5, dashedValue: [5, 5] }
                },
                {
                    type: 'text',
                    attrs: { x: bounding.width - 22, y: y - 10, text: '⮞' },
                    styles: { color: 'black', backgroundColor: 'transparent', size: 20, paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3, borderRadius: 4 }
                }
            ];

            if (isHovered) {
                figures.push({
                    type: 'text',
                    attrs: {
                        x: bounding.width / 2,
                        y: y - 12,
                        text: `${symbol} Crossing ${parseFloat(price).toFixed(2)}    ✖`,
                    },
                    styles: {
                        style: 'stroke_fill',
                        color: '#000000',
                        backgroundColor: '#ffffff',
                        borderColor: '#000000',
                        borderSize: 1,
                        borderStyle: 'solid',
                        borderRadius: 4,
                        paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
                        size: 12,
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        weight: '500',
                        align: 'center',
                        baseline: 'bottom'
                    }
                });
            }
            return figures;
        }
    });
    window.alertLineRegistered = true;
}


// 🚀 2. TRADING POSITION OVERLAY (Buy/Sell Line)
if (!window.positionLineRegistered) {
    registerOverlay({
        name: 'positionLine',
        needDefaultPointFigure: true,
        needDefaultXAxisFigure: true,
        needDefaultYAxisFigure: true,
        createPointFigures: ({ overlay, coordinates, bounding }) => {
            const y = coordinates[0].y;
            const ext = overlay.extendData || {};
            const isBuy = ext.type === 'BUY';
            const themeColor = isBuy ? '#26a69a' : '#ef5350';
            const pnl = ext.pnl || 0;
            
            return [
                {
                    type: 'line',
                    attrs: { coordinates: [{ x: 0, y }, { x: bounding.width, y }] },
                    styles: { style: 'solid', color: themeColor, size: 1.5 }
                },
                {
                    type: 'text',
                    attrs: {
                        x: bounding.width - 150,
                        y: y - 6,
                        text: ` ${ext.qty} ${ext.symbol} ${ext.type} @ ${ext.price}  |  ₹${pnl.toFixed(2)}   ✖ `
                    },
                    styles: {
                        style: 'stroke_fill',
                        color: '#ffffff',
                        backgroundColor: themeColor,
                        borderColor: themeColor,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderRadius: 4,
                        paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4,
                        size: 12, weight: 'bold',
                        align: 'center', baseline: 'bottom'
                    }
                }
            ];
        }
    });
    window.positionLineRegistered = true;
}


// 🚀 3. AOC MAGICAL LINES OVERLAY (Support/Resistance)
if (!window.aocLevelLineRegistered) {
    registerOverlay({
        name: 'aocLevelLine',
        lock: true, 
        needDefaultPointFigure: true,
        needDefaultXAxisFigure: false,
        needDefaultYAxisFigure: true,
        createPointFigures: ({ overlay, coordinates, bounding }) => {
            const y = coordinates[0].y;
            const ext = overlay.extendData || {};
            const labels = ext.labels || [];
            
            const figures = [
                {
                    type: 'line',
                    attrs: { coordinates: [{ x: 0, y }, { x: bounding.width, y }] },
                    styles: { style: ext.lineStyle || 'dashed', color: ext.color, size: 1.5, dashedValue: [4, 4] }
                }
            ];

            labels.forEach(lbl => {
                figures.push({
                    type: 'text',
                    attrs: { 
                        x: bounding.width - (lbl.offset || 120),
                        y: y - 8, 
                        text: ` ${lbl.text} ` 
                    },
                    styles: {
                        style: 'fill', 
                        color: '#ffffff', 
                        backgroundColor: lbl.color,
                        paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3,
                        borderRadius: 4, size: 10, weight: 'bold',
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }
                });
            });

            return figures;
        }
    });
    window.aocLevelLineRegistered = true;
}

// 🚀 4. INDEPENDENT ENTRY LINE (Perfect Center Aligned)
    if (!window.entryLineOverlayRegistered) {
        registerOverlay({
            name: 'customEntryLine',
            lock: true,
            needDefaultPointFigure: true,
            createPointFigures: ({ overlay, coordinates, bounding }) => {
                const y = coordinates[0].y;
                const ext = overlay.extendData || {};
                const startX = bounding.width - 200;
                return [
                    { type: 'line', attrs: { coordinates: [{x: 0, y}, {x: startX, y}] }, styles: { style: 'solid', color: '#2962ff', size: 1 } },
                    { type: 'text', 
                      // 🌟 THE FIX: y की वैल्यू सिर्फ 'y' रखी है (कोई +6 नहीं)
                      attrs: { x: startX, y: y - 6, text: ` ${ext.qty}  |  ${ext.pnl || '₹ 0.00'}  |  ✖ ` }, 
                      styles: { 
                          style: 'fill', color: '#ffffff', backgroundColor: '#2962ff', 
                          paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, 
                          borderRadius: 4, size: 10, weight: 'bold', 
                          align: 'start', 
                          // 🎯 THE MAGIC: यह लाइन टेक्स्ट बॉक्स को बिल्कुल बीचों-बीच खड़ा कर देगी!
                          baseline: 'middle', 
                          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
                      } 
                    }
                ];
            }
        });
        window.entryLineOverlayRegistered = true;
    }

    // 🚀 5. INDEPENDENT SL LINE (Points Display Fix)
    if (!window.slLineOverlayRegistered) {
        registerOverlay({
            name: 'customSlLine',
            lock: false, 
            needDefaultPointFigure: true,
            createPointFigures: ({ overlay, coordinates, bounding, yAxis }) => {
                let y = coordinates[0].y;
                let currentVal = overlay.points[0].value;
                const ext = overlay.extendData || {};
                const startX = bounding.width - 200;

                const spotEntry = ext.spotEntry || 0;
                const entryY = yAxis.convertToPixel(spotEntry);

                // 🛑 THE GLASS WALL LOCK
                if (ext.isBullish && currentVal > spotEntry) {
                    currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry;
                } else if (!ext.isBullish && currentVal < spotEntry) {
                    currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry;
                }

                // 🧮 1. Calculate Points Difference
                const ptsDiff = Math.abs(spotEntry - currentVal);
                const ptsText = `- ${ptsDiff.toFixed(2)} pts`; // 👈 यहाँ हमने Points बना लिए

                // 💸 2. Calculate P&L Amount
                const lossAmt = ptsDiff * (ext.qty || 1);
                const lossText = `- ₹${lossAmt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;

                return [
                    { type: 'line', attrs: { coordinates: [{x: 0, y}, {x: startX, y}] }, styles: { style: 'solid', color: '#f57c00', size: 1 } },
                    { type: 'text', 
                      // 🌟 THE FIX: Qty की जगह Points (ptsText) दिखा रहे हैं
                      attrs: { x: startX, y: y - 6, text: ` ${ptsText}  |  ${lossText}  |  ✖ ` }, 
                      styles: { 
                          style: 'fill', color: '#ffffff', backgroundColor: '#f57c00', 
                          paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, 
                          borderRadius: 4, size: 10, weight: 'bold', 
                          align: 'start', baseline: 'middle', 
                          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
                      } 
                    },
                    { type: 'line', attrs: { coordinates: [{x: startX, y: Math.min(y, entryY)}, {x: startX, y: Math.max(y, entryY)}] }, styles: { style: 'dashed', color: '#787b86', size: 1 } }
                ];
            }
        });
        window.slLineOverlayRegistered = true;
    }

    // 🚀 6. INDEPENDENT TP LINE (Points Display Fix)
    if (!window.tpLineOverlayRegistered) {
        registerOverlay({
            name: 'customTpLine',
            lock: false,
            needDefaultPointFigure: true,
            createPointFigures: ({ overlay, coordinates, bounding, yAxis }) => {
                let y = coordinates[0].y;
                let currentVal = overlay.points[0].value;
                const ext = overlay.extendData || {};
                const startX = bounding.width - 200;

                const spotEntry = ext.spotEntry || 0;
                const entryY = yAxis.convertToPixel(spotEntry);

                // 🛑 THE GLASS WALL LOCK
                if (ext.isBullish && currentVal < spotEntry) {
                    currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry;
                } else if (!ext.isBullish && currentVal > spotEntry) {
                    currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry;
                }

                // 🧮 1. Calculate Points Difference
                const ptsDiff = Math.abs(spotEntry - currentVal);
                const ptsText = `+ ${ptsDiff.toFixed(2)} pts`; // 👈 यहाँ हमने Points बना लिए

                // 💸 2. Calculate P&L Amount
                const profAmt = ptsDiff * (ext.qty || 1);
                const profText = `+ ₹${profAmt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;

                return [
                    { type: 'line', attrs: { coordinates: [{x: 0, y}, {x: startX, y}] }, styles: { style: 'solid', color: '#00b0ff', size: 1 } },
                    { type: 'text', 
                      // 🌟 THE FIX: Qty की जगह Points (ptsText) दिखा रहे हैं
                      attrs: { x: startX, y: y, text: ` ${ptsText}  |  ${profText}  |  ✖ ` }, 
                      styles: { 
                          style: 'fill', color: '#ffffff', backgroundColor: '#00b0ff', 
                          paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, 
                          borderRadius: 4, size: 10, weight: 'bold', 
                          align: 'start', baseline: 'middle',
                          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
                      } 
                    },
                    { type: 'line', attrs: { coordinates: [{x: startX, y: Math.min(y, entryY)}, {x: startX, y: Math.max(y, entryY)}] }, styles: { style: 'dashed', color: '#787b86', size: 1 } }
                ];
            }
        });
        window.tpLineOverlayRegistered = true;
    }



// ==========================================
// 📊 MAIN CHART COMPONENT
// ==========================================
const CustomChart = ({ symbol = 'NIFTY', date, timeframe, dataRange, time, playbackSpeed, aocStats, marketMetrics, chainData, showMagicalLines, showOrderLines }) => {
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

    // 🌟 Open Positions State (For Chart Trading)
    const [openPositions, setOpenPositions] = useState([]);

    useEffect(() => { tvMenuRef.current = tvMenu.visible; }, [tvMenu.visible]);

    // 🌟 अलार्म्स को लाइव एनिमेशन में ट्रैक करने के लिए
    const activeAlertsRef = useRef(priceAlerts);
    useEffect(() => {
        activeAlertsRef.current = priceAlerts;
    }, [priceAlerts]);


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
        message: ''
    });


// 🌟 TRADE PANEL VISIBILITY STATE
    const [showTradePanel, setShowTradePanel] = useState(false);
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


    const [deleteAlertModal, setDeleteAlertModal] = useState({ 
        visible: false, 
        alertId: null, 
        price: 0, 
        symbol: 'NIFTY' 
    });

  
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
                                
                                // 🎯 डायनामिक (Animated) High/Low चेक कर रहे हैं!
                                const isHit = (dynamicLow <= targetPrice) && (dynamicHigh >= targetPrice);
                                
                                if (isHit) {
                                    // 1. अलार्म बजाएं और Toast दिखाएं (तुम्हारा ओरिजिनल कोड)
                                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                                    audio.play().catch(e => console.log(e));
                                    
                                    setToastData({
                                        title: `Alert on ${symbol || 'NIFTY'}`, 
                                        message: `${symbol || 'NIFTY'} Crossing ${targetPrice.toFixed(2)} at ${time}`, 
                                        type: 'alarm' 
                                    });
                                    
                                    // 🚀 2. THE AUTO-DELETE MAGIC 🚀
                                    // A. चार्ट से डैश लाइन को तुरंत गायब करें
                                    if (chartRef.current) {
                                        chartRef.current.removeOverlay(alertItem.id);
                                    }
                                    
                                    // B. स्टेट (मेमोरी) से अलर्ट को हमेशा के लिए डिलीट कर दें ताकि दुबारा हिट न हो
                                    setPriceAlerts(prev => prev.filter(a => a.id !== alertItem.id));

                                    // C. Console Log (चेकिंग के लिए)
                                    console.log(`✅ ALERT AUTO-DELETED: ${symbol} hit ${targetPrice.toFixed(2)}`);
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




    // 🚀 1. THE STRIKE CALCULATOR (ITM/OTM बदलने पर Strike को लाइव अपडेट करेगा)
    useEffect(() => {
        if (tradeConfig.instrument === 'Options' && (tradeConfig.strikeCriteria === 'ATM pt' || tradeConfig.strikeCriteria === 'ATM %')) {
            // निफ्टी 50 के हिसाब से Base ATM निकालें
            const baseAtm = Math.round(tradeConfig.clickedPrice / 50) * 50; 
            let calcStrike = baseAtm;

            if (typeof tradeConfig.strikeType === 'string' && tradeConfig.strikeType !== 'ATM') {
                const isITM = tradeConfig.strikeType.includes('ITM');
                const isCE = tradeConfig.optionType === 'CE';
                
                // स्ट्रिंग से सिर्फ नंबर निकालें (जैसे "ITM 100" से 100)
                const val = parseFloat(tradeConfig.strikeType.replace(/[^\d.]/g, ''));
                
                let pointDiff = tradeConfig.strikeCriteria === 'ATM pt' ? val : Math.round((baseAtm * (val / 100)) / 50) * 50;

                // 🎯 Call के लिए ITM मतलब कम स्ट्राइक, Put के लिए ITM मतलब ज्यादा स्ट्राइक
                if (isITM) {
                    calcStrike = isCE ? baseAtm - pointDiff : baseAtm + pointDiff;
                } else { // OTM
                    calcStrike = isCE ? baseAtm + pointDiff : baseAtm - pointDiff;
                }
            }
            setTradeConfig(prev => ({ ...prev, nearestStrike: calcStrike }));
        }
    }, [tradeConfig.clickedPrice, tradeConfig.strikeCriteria, tradeConfig.strikeType, tradeConfig.optionType, tradeConfig.instrument]);


    // ==========================================
    // 🔮 THE AOC VISUAL CONFLUENCE ENGINE (Magical Lines)
    // ==========================================
    // ==========================================
    // 🔮 THE AOC QUANT ENGINE (6 Magical Lines with EoR & EoS)
    // ==========================================
    useEffect(() => {
        if (!chartRef.current || !aocStats || !marketMetrics || !chainData || chainData.length === 0) return;

        const chart = chartRef.current;
        
        const resStrike = aocStats.CE?.Volume?.max?.strike;
        const supStrike = aocStats.PE?.Volume?.max?.strike;
        const maxPain = marketMetrics.maxPain;

        // 🌟 1. डायनामिक Strike Gap निकालें (Nifty = 50, BankNifty = 100)
        const strikeGap = chainData.length >= 2 
            ? Math.abs(Number(chainData[1].strike) - Number(chainData[0].strike)) 
            : 50;

        // 🌟 2. Resistance (CE) और Support (PE) का लाइव प्रीमियम (LTP) निकालें
        let ceLtp = 0;
        let peLtp = 0;

        if (resStrike) {
            const resRow = chainData.find(r => Number(r.strike) === Number(resStrike));
            if (resRow) ceLtp = parseFloat(resRow.CE?.ltp || 0);
        }
        if (supStrike) {
            const supRow = chainData.find(r => Number(r.strike) === Number(supStrike));
            if (supRow) peLtp = parseFloat(supRow.PE?.ltp || 0);
        }

        // 🧮 3. THE MAGICAL MATH (Calculate Extensions)
        const eor = resStrike ? Math.round(resStrike + ceLtp) : 0; // Extension of Resistance (R Risky)
        const eos = supStrike ? Math.round(supStrike - peLtp) : 0; // Extension of Support (S Risky)
        
        const rSafe = resStrike ? resStrike + strikeGap : 0; // 1 Strike Up
        const sSafe = supStrike ? supStrike - strikeGap : 0; // 1 Strike Down

        // 🚨 THE FIX: KLineChart v10 का नया और क्लीन तरीका 🚨
        chart.removeOverlay({ groupId: 'aoc_magic_lines' });

        // 🧠 4. Grouping Logic (Collision Fix)
        const priceGroups = {};

        const addToGroup = (price, text, color, isDashed) => {
            if (!price || price === 0) return;
            
            if (!priceGroups[price]) {
                priceGroups[price] = {
                    price: price,
                    color: color, 
                    lineStyle: isDashed ? 'dashed' : 'solid',
                    labels: []
                };
            }
            
            const currentLabelsCount = priceGroups[price].labels.length;
            const offset = 120 + (currentLabelsCount * 140); // डिब्बों के बीच का गैप
            
            priceGroups[price].labels.push({ text, color, offset });
        };

        // 🔴 RESISTANCE ZONE
        addToGroup(rSafe, `R Safe: ${rSafe}`, '#b71c1c', false);           // Dark Red
        addToGroup(eor, `R Risky (EoR): ${eor}`, '#ef5350', true);         // Dashed Red (Reversal Point)
        addToGroup(resStrike, `R Moderate: ${resStrike}`, '#ef5350', false); // Solid Red (Main Strike)

        // 🔵 NEUTRAL ZONE
        addToGroup(maxPain, `Max Pain: ${maxPain}`, '#2962ff', true);      // Dashed Blue

        // 🟢 SUPPORT ZONE
        addToGroup(supStrike, `S Moderate: ${supStrike}`, '#26a69a', false); // Solid Green (Main Strike)
        addToGroup(eos, `S Risky (EoS): ${eos}`, '#26a69a', true);         // Dashed Green (Reversal Point)
        addToGroup(sSafe, `S Safe: ${sSafe}`, '#004d40', false);           // Dark Green

        // 🚀 5. चार्ट पर ड्रा करें
        Object.values(priceGroups).forEach((group, index) => {
            chart.createOverlay({
                name: 'aocLevelLine',
                id: `aoc_magic_${index}`,
                groupId: 'aoc_magic_lines',
                extendData: { 
                    color: group.color, 
                    lineStyle: group.lineStyle, 
                    labels: group.labels 
                },
                points: [{ value: group.price }]
            });
        });

    }, [aocStats, marketMetrics, chainData]); // 👈 जब भी AOC का डेटा बदलेगा, ये लाइन्स खुद-ब-खुद ऊपर-नीचे शिफ्ट हो जाएंगी!



    // ==========================================
    // 🚀 PHASE 1: THE LIVE PREMIUM FETCHING ENGINE
    // ==========================================
    useEffect(() => {
        // सिर्फ तब काम करेगा जब Options चुना हो, Strike 0 से ज्यादा हो, और chainData मौजूद हो
        if (tradeConfig.instrument === 'Options' && tradeConfig.nearestStrike > 0 && chainData && chainData.length > 0) {
            
            // 1. पूरी Option Chain में अपनी वाली Strike ढूँढें
            const targetRow = chainData.find(r => Number(r.strike) === Number(tradeConfig.nearestStrike));

            if (targetRow) {
                // 2. CE या PE के हिसाब से सही LTP (Premium) निकालें
                const liveLtp = tradeConfig.optionType === 'CE' 
                    ? parseFloat(targetRow.CE?.ltp || 0) 
                    : parseFloat(targetRow.PE?.ltp || 0);
                
                // 3. स्टेट को अपडेट करें (Infinite loop से बचने के लिए चेक लगाया है)
                setTradeConfig(prev => {
                    if (prev.premium !== liveLtp) {
                        return { ...prev, premium: liveLtp };
                    }
                    return prev;
                });
            } else {
                // अगर गलती से स्ट्राइक न मिले (बहुत दूर की OTM)
                setTradeConfig(prev => {
                    if (prev.premium !== 0) return { ...prev, premium: 0 };
                    return prev;
                });
            }
        }
    }, [tradeConfig.nearestStrike, tradeConfig.optionType, tradeConfig.instrument, chainData]);



    // 🚀 2. DROPDOWN RENDER HELPER (Strategy Builder जैसा UI)
    const renderStrikeTypeInput = () => {
        const criteria = tradeConfig.strikeCriteria;
        const stepPt = symbol === 'NIFTY BANK' ? 100 : 50; // Instrument Check
        const stepPct = symbol === 'NIFTY BANK' ? 1.0 : 0.5;

        const generateOptions = (step, max, suffix) => {
            let opts = [];
            for (let i = max; i >= step; i -= step) opts.push(`ITM ${suffix ? i.toFixed(1) + '%' : i}`);
            opts.push("ATM");
            for (let i = step; i <= max; i += step) opts.push(`OTM ${suffix ? i.toFixed(1) + '%' : i}`);
            return opts;
        };

        const inputClass = "w-full border border-gray-300 rounded px-2 py-1.5 text-[12px] outline-none focus:border-blue-500 bg-white font-medium text-gray-700";

        if (criteria === "ATM pt" || criteria === "ATM %") {
            const options = criteria === "ATM pt" ? generateOptions(stepPt, 1000, false) : generateOptions(stepPct, 10.0, true);
            return (
                <select className={inputClass} value={tradeConfig.strikeType} onChange={(e) => setTradeConfig({...tradeConfig, strikeType: e.target.value})}>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        }
        if (criteria === "Delta") return <input type="number" step="0.1" min="0" max="1" placeholder="0.5" value={tradeConfig.strikeType} onChange={(e) => setTradeConfig({...tradeConfig, strikeType: e.target.value})} className={inputClass} />;
        if (criteria.includes("CP")) return <input type="number" placeholder="Premium Value" value={tradeConfig.strikeType} onChange={(e) => setTradeConfig({...tradeConfig, strikeType: e.target.value})} className={inputClass} />;
        return null;
    };



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
            
            {/* 🚀 3. TRADINGVIEW STYLE DELETE CONFIRMATION MODAL */}
                {deleteAlertModal.visible && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity">
                        
                        {/* Modal Box */}
                        <div className="bg-white rounded-lg shadow-2xl w-[400px] max-w-[90vw] flex flex-col animate-in fade-in zoom-in duration-200">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-900">Delete this alert?</h3>
                                <button 
                                    onClick={() => setDeleteAlertModal({ ...deleteAlertModal, visible: false })}
                                    className="text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    <X size={20} strokeWidth={2} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 pb-6 text-[15px] text-gray-700">
                                Doing this will permanently delete your "{deleteAlertModal.symbol} Crossing {parseFloat(deleteAlertModal.price).toFixed(2)}" alert.
                            </div>

                            {/* Footer (Buttons) */}
                            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                                <button 
                                    onClick={() => setDeleteAlertModal({ ...deleteAlertModal, visible: false })}
                                    className="px-4 py-2 rounded text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                                >
                                    No
                                </button>
                                <button 
                                    onClick={() => {
                                        // 🎯 1. चार्ट से लाइन हटाएँ
                                        if (chartRef.current) {
                                            chartRef.current.removeOverlay(deleteAlertModal.alertId);
                                            // कर्सर को वापस नार्मल करें
                                            if (chartContainerRef.current) chartContainerRef.current.style.removeProperty('cursor');
                                        }
                                        // 🎯 2. बैकग्राउंड अलार्म्स की लिस्ट से हटाएँ
                                        setPriceAlerts(prev => prev.filter(a => a.id !== deleteAlertModal.alertId));
                                        
                                        // 🎯 3. मोडल बंद करें
                                        setDeleteAlertModal({ ...deleteAlertModal, visible: false });
                                    }}
                                    className="px-5 py-2 rounded bg-[#f23645] hover:bg-[#d62837] text-white text-sm font-medium shadow-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🚀 4. ADVANCED TRADINGVIEW ALERT CONFIG MODAL */}
                {alertConfigModal.visible && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity">
                        <div className="bg-white rounded-lg shadow-2xl w-[500px] max-w-[95vw] flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {alertConfigModal.mode === 'create' ? 'Create Alert' : 'Edit Alert'} on {alertConfigModal.symbol}
                                </h3>
                                <button onClick={() => setAlertConfigModal({ ...alertConfigModal, visible: false })} className="text-gray-400 hover:text-gray-700">
                                    <X size={20} strokeWidth={2} />
                                </button>
                            </div>

                            {/* Body (Forms) */}
                            <div className="px-6 py-5 flex flex-col gap-4 text-sm text-gray-700">
                                
                                {/* Condition Row */}
                                <div className="flex items-center gap-4">
                                    <label className="w-24 text-gray-500">Condition</label>
                                    <div className="flex-1 flex gap-2">
                                        <select className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 bg-gray-50 flex-1">
                                            <option>{alertConfigModal.symbol}</option>
                                        </select>
                                        <select 
                                            className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 bg-white flex-1"
                                            value={alertConfigModal.condition}
                                            onChange={(e) => setAlertConfigModal({...alertConfigModal, condition: e.target.value})}
                                        >
                                            <option value="Crossing">Crossing</option>
                                            <option value="Crossing Up">Crossing Up</option>
                                            <option value="Crossing Down">Crossing Down</option>
                                            <option value="Greater Than">Greater Than</option>
                                            <option value="Less Than">Less Than</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Price Value Row */}
                                <div className="flex items-center gap-4">
                                    <div className="w-24"></div>
                                    <div className="flex-1 flex gap-2">
                                        <select className="border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 w-24">
                                            <option>Value</option>
                                        </select>
                                        <input 
                                            type="number" 
                                            value={alertConfigModal.price}
                                            onChange={(e) => setAlertConfigModal({...alertConfigModal, price: parseFloat(e.target.value)})}
                                            className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 flex-1 font-semibold"
                                        />
                                    </div>
                                </div>

                                {/* Trigger Row */}
                                <div className="flex items-center gap-4 mt-2">
                                    <label className="w-24 text-gray-500">Trigger</label>
                                    <select 
                                        className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 bg-white flex-1"
                                        value={alertConfigModal.trigger}
                                        onChange={(e) => setAlertConfigModal({...alertConfigModal, trigger: e.target.value})}
                                    >
                                        <option>Only Once</option>
                                        <option>Once Per Bar</option>
                                        <option>Once Per Bar Close</option>
                                    </select>
                                </div>

                                <hr className="border-gray-100 my-2" />

                                {/* Alert Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-500">Alert name</label>
                                    <input 
                                        type="text" 
                                        value={alertConfigModal.alertName}
                                        onChange={(e) => setAlertConfigModal({...alertConfigModal, alertName: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="Optional"
                                    />
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-500">Message</label>
                                    <textarea 
                                        rows="3"
                                        value={alertConfigModal.message}
                                        onChange={(e) => setAlertConfigModal({...alertConfigModal, message: e.target.value})}
                                        className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 resize-none"
                                    ></textarea>
                                </div>

                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                                <button 
                                    onClick={() => setAlertConfigModal({ ...alertConfigModal, visible: false })}
                                    className="px-4 py-2 rounded text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        const targetPrice = alertConfigModal.price;
                                        const alertId = alertConfigModal.id;

                                        if (alertConfigModal.mode === 'create') {
                                            // 🎯 1. CREATE MODE (नया अलर्ट बनाएँ)
                                            setPriceAlerts(prev => [...prev, { 
                                                id: alertId, 
                                                price: targetPrice, 
                                                condition: alertConfigModal.condition,
                                                isTriggered: false 
                                            }]);

                                            chartRef.current.createOverlay({
                                                name: 'alertLine',
                                                id: alertId,
                                                groupId: alertId,
                                                extendData: { isHovered: false, price: targetPrice, symbol: alertConfigModal.symbol },
                                                points: [{ value: targetPrice }],
                                                
                                                onMouseEnter: function (event) {
                                                    const ext = event.overlay.extendData || {};
                                                    chartRef.current.overrideOverlay({ id: event.overlay.id, extendData: { ...ext, isHovered: true, price: event.overlay.points[0].value } });
                                                    if(chartContainerRef.current) {
                                                        const canvases = chartContainerRef.current.querySelectorAll('canvas');
                                                        canvases.forEach(c => c.style.setProperty('cursor', 'ns-resize', 'important'));
                                                    }
                                                    return true;
                                                },
                                                onMouseLeave: function (event) {
                                                    const ext = event.overlay.extendData || {};
                                                    chartRef.current.overrideOverlay({ id: event.overlay.id, extendData: { ...ext, isHovered: false } });
                                                    if(chartContainerRef.current) {
                                                        const canvases = chartContainerRef.current.querySelectorAll('canvas');
                                                        canvases.forEach(c => c.style.removeProperty('cursor'));
                                                    }
                                                    return true;
                                                },
                                                
                                                // 🌟 THE FIX 1: सिर्फ Text Box एरिया में क्लिक करने पर डिलीट मोडल खुलेगा
                                                onClick: function (event) {
                                                    const clickX = event.x;
                                                    // 🎯 Container की चौड़ाई से सटीक Center निकालें (Y-Axis के 60px हटाकर)
                                                    const paneWidth = chartContainerRef.current ? (chartContainerRef.current.clientWidth + 50) : 1000;
                                                    const centerX = paneWidth / 2;
                                                    
                                                    // 🎯 अगर क्लिक सेंटर से 40px आगे और 110px के बीच है (यहाँ हमारा ✖ होता है)
                                                    if (clickX > centerX + 40 && clickX < centerX + 110) {
                                                        const ext = event.overlay.extendData || {};
                                                        setDeleteAlertModal({ 
                                                            visible: true, 
                                                            alertId: event.overlay.id, 
                                                            price: event.overlay.points[0].value, 
                                                            symbol: ext.symbol || 'NIFTY' 
                                                        });

                                                        if (chartContainerRef.current) {
                                                            const canvases = chartContainerRef.current.querySelectorAll('canvas');
                                                            canvases.forEach(c => c.style.removeProperty('cursor'));
                                                        }
                                                        return true; 
                                                    }
                                                    return false; 
                                                },

                                                // 🌟 THE FIX 2: डबल क्लिक (डैश लाइन या मेन टेक्स्ट पर)
                                                onDoubleClick: function (event) {
                                                    const clickX = event.x;
                                                    const paneWidth = chartContainerRef.current ? (chartContainerRef.current.clientWidth - 60) : 1000;
                                                    const centerX = paneWidth / 2;

                                                    // 🎯 अगर क्लिक ✖ वाले हिस्से को छोड़कर कहीं भी (लाइन या टेक्स्ट) पर हुआ है
                                                    if (clickX <= centerX + 40 || clickX >= centerX + 110) {
                                                        const ext = event.overlay.extendData || {};
                                                        setAlertConfigModal({
                                                            visible: true,
                                                            mode: 'edit',
                                                            id: event.overlay.id,
                                                            symbol: ext.symbol || 'NIFTY',
                                                            price: event.overlay.points[0].value,
                                                            condition: 'Crossing', 
                                                            trigger: 'Only Once',
                                                            alertName: `${ext.symbol || 'NIFTY'} Alert`,
                                                            message: `${ext.symbol || 'NIFTY'} Crossing ${event.overlay.points[0].value.toFixed(2)}`
                                                        });
                                                        return true;
                                                    }
                                                    return false;
                                                },
                                                
                                                onPressedMoveEnd: function (event) {
                                                    if (event && event.overlay && event.overlay.points) {
                                                        const newPrice = event.overlay.points[0].value;
                                                        const ext = event.overlay.extendData || {};
                                                        chartRef.current.overrideOverlay({
                                                            id: event.overlay.id, groupId: event.overlay.id,
                                                            extendData: { ...ext, customPoints: event.overlay.points, price: newPrice, isHovered: false } 
                                                        });
                                                        setPriceAlerts(prev => prev.map(a => a.id === event.overlay.id ? { ...a, price: newPrice } : a));
                                                    }
                                                    return false;
                                                }
                                            });
                                        } else {
                                            // 🎯 2. EDIT MODE (अगर डबल-क्लिक करके मोडल खोला था और Save दबाया)
                                            // स्टेट को अपडेट करें
                                            setPriceAlerts(prev => prev.map(a => a.id === alertId ? { ...a, price: targetPrice, condition: alertConfigModal.condition } : a));

                                            // पुरानी वाली लाइन को नए प्राइस के साथ ओवरराइड (अपडेट) कर दें
                                            chartRef.current.overrideOverlay({
                                                id: alertId,
                                                points: [{ value: targetPrice }],
                                                extendData: { isHovered: false, price: targetPrice, symbol: alertConfigModal.symbol }
                                            });
                                        }

                                        // फॉर्म मोडल बंद करें
                                        setAlertConfigModal({ ...alertConfigModal, visible: false });
                                    }}
                                    className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors"
                                >
                                    {alertConfigModal.mode === 'create' ? 'Create' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            {/* 🚀 5. THE DELTA EXCHANGE STYLE TRADE PANEL */}
            {showTradePanel && (
                <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] animate-in slide-in-from-right duration-200 h-full"> {/* 🚨 FIX: Added h-full */}
                    
                    {/* Header: BUY / SELL */}
                    <div className="p-4 border-b border-gray-100 flex flex-col gap-3 shrink-0"> {/* 🚨 FIX: Added shrink-0 */}
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800 text-sm">Order Panel</span>
                            <button onClick={() => setShowTradePanel(false)} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-100">
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-md">
                            <button onClick={() => setTradeConfig({...tradeConfig, side: 'BUY'})} className={`flex-1 py-1.5 text-[13px] font-bold rounded ${tradeConfig.side === 'BUY' ? 'bg-white shadow text-[#26a69a]' : 'text-gray-500 hover:text-gray-700'}`}>BUY (Long)</button>
                            <button onClick={() => setTradeConfig({...tradeConfig, side: 'SELL'})} className={`flex-1 py-1.5 text-[13px] font-bold rounded ${tradeConfig.side === 'SELL' ? 'bg-white shadow text-[#ef5350]' : 'text-gray-500 hover:text-gray-700'}`}>SELL (Short)</button>
                        </div>
                    </div>

                    {/* Body: Inputs & Configuration (Scrollable Area) */}
                    <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar"> {/* 🚨 FIX: Added custom-scrollbar class for beautiful scroll */}
                        
                        {/* 🌟 THE DYNAMIC PRICE DISPLAY 🌟 */}
                        <div className="flex justify-between items-center bg-gray-50 px-3 py-2.5 rounded border border-gray-200 shadow-inner shrink-0">
                            {tradeConfig.instrument === 'Options' ? (
                                <>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Strike Selected</span>
                                        <span className="text-[15px] font-extrabold text-blue-700">{tradeConfig.nearestStrike} {tradeConfig.optionType}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Premium (LTP)</span>
                                        <span className={`text-[15px] font-extrabold ${tradeConfig.premium > 0 ? 'text-gray-800' : 'text-orange-500 animate-pulse'}`}>
                                            {tradeConfig.premium > 0 ? `₹${tradeConfig.premium.toFixed(2)}` : 'Fetching... ⏳'}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs font-semibold text-gray-500">Future Limit Price</span>
                                    <span className="text-[15px] font-bold text-gray-800">{tradeConfig.clickedPrice.toFixed(2)}</span>
                                </>
                            )}
                        </div>

                        {/* Instrument Type */}
                        <div className="shrink-0">
                            <div className="flex bg-gray-50 border border-gray-200 rounded text-[13px]">
                                <button onClick={() => setTradeConfig({...tradeConfig, instrument: 'Options'})} className={`flex-1 py-1.5 font-medium ${tradeConfig.instrument === 'Options' ? 'bg-blue-600 text-white rounded shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>Options</button>
                                <button onClick={() => setTradeConfig({...tradeConfig, instrument: 'Futures'})} className={`flex-1 py-1.5 font-medium ${tradeConfig.instrument === 'Futures' ? 'bg-blue-600 text-white rounded shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>Futures</button>
                            </div>
                        </div>

                        {/* Conditional: Option Type (Call / Put) & Strike Criteria */}
                        {tradeConfig.instrument === 'Options' && (
                            <div className="flex flex-col gap-3 shrink-0">
                                {/* Option Type Toggle */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Option Type</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setTradeConfig({...tradeConfig, optionType: 'CE'})} className={`flex-1 py-1.5 border rounded text-[13px] font-bold transition-colors ${tradeConfig.optionType === 'CE' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>CALL (CE)</button>
                                        <button onClick={() => setTradeConfig({...tradeConfig, optionType: 'PE'})} className={`flex-1 py-1.5 border rounded text-[13px] font-bold transition-colors ${tradeConfig.optionType === 'PE' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>PUT (PE)</button>
                                    </div>
                                </div>

                                {/* STRIKE CRITERIA DROPDOWNS */}
                                <div className="grid grid-cols-2 gap-3 bg-blue-50/30 p-2.5 rounded-lg border border-blue-100">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Strike Criteria</label>
                                        <select 
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-[12px] font-medium text-gray-700 outline-none focus:border-blue-500 bg-white"
                                            value={tradeConfig.strikeCriteria}
                                            onChange={(e) => {
                                                const newCri = e.target.value;
                                                let newInitial = "ATM";
                                                if(newCri === 'Delta') newInitial = 0.5;
                                                else if(newCri.includes('CP')) newInitial = "";
                                                setTradeConfig({...tradeConfig, strikeCriteria: newCri, strikeType: newInitial});
                                            }}
                                        >
                                            {["ATM pt", "ATM %", "Delta", "CP", "CP >=", "CP <="].map(cri => <option key={cri} value={cri}>{cri}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Strike Selection</label>
                                        {renderStrikeTypeInput()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expiry Dropdown */}
                        <div className="shrink-0">
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Expiry</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] font-medium text-gray-700 outline-none focus:border-blue-500 bg-white" value={tradeConfig.expiry} onChange={(e) => setTradeConfig({...tradeConfig, expiry: e.target.value})}>
                                <option value="Current Week">Current Weekly</option>
                                <option value="Next Week">Next Weekly</option>
                            </select>
                        </div>

                        {/* Quantity Selector */}
                        <div className="shrink-0">
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 flex justify-between">
                                <span>Quantity (Lots)</span>
                                <span className="text-gray-400 font-normal">Lot Size: {baseLotSize}</span>
                            </label>
                            <div className="flex border border-gray-300 rounded bg-white overflow-hidden">
                                <button 
                                    onClick={() => setTradeConfig(p => ({...p, qty: Math.max(baseLotSize, p.qty - baseLotSize)}))} 
                                    className="px-4 py-1.5 bg-gray-50 text-gray-600 font-bold border-r border-gray-300 hover:bg-gray-100 transition-colors"
                                >
                                    −
                                </button>
                                <input 
                                    type="number" 
                                    value={tradeConfig.qty} 
                                    onChange={(e) => setTradeConfig({...tradeConfig, qty: Number(e.target.value)})} 
                                    className="w-full text-center outline-none text-[14px] font-semibold" 
                                />
                                <button 
                                    onClick={() => setTradeConfig(p => ({...p, qty: p.qty + baseLotSize}))} 
                                    className="px-4 py-1.5 bg-gray-50 text-gray-600 font-bold border-l border-gray-300 hover:bg-gray-100 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* 🚨 THE MISSING SL & TP BLOCK RESTORED 🚨 */}
                        <div className="grid grid-cols-2 gap-3 mt-1 shrink-0 pb-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Stop Loss (Pts)</label>
                                <input 
                                    type="number" placeholder="e.g. 20"
                                    value={tradeConfig.slValue || ''}
                                    onChange={(e) => setTradeConfig({...tradeConfig, slValue: Number(e.target.value)})}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-red-400 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Take Profit (Pts)</label>
                                <input 
                                    type="number" placeholder="e.g. 40"
                                    value={tradeConfig.tpValue || ''}
                                    onChange={(e) => setTradeConfig({...tradeConfig, tpValue: Number(e.target.value)})}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-green-400 font-medium"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer: Dynamic Margin & Button */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0"> {/* 🚨 FIX: Added shrink-0 */}
                        <div className="flex justify-between text-[11px] text-gray-500 mb-3 px-1">
                            <span>Margin Required</span>
                            {/* 🌟 UPGRADED DYNAMIC MARGIN CALCULATION (Buy vs Sell) 🌟 */}
                            <span className="font-bold text-gray-800">
                                {tradeConfig.instrument === 'Options' 
                                    ? (tradeConfig.side === 'BUY'
                                        // 🟢 BUY OPTION: सिर्फ Premium * Qty लगेगा
                                        ? (tradeConfig.premium > 0 ? `~ ₹${(tradeConfig.qty * tradeConfig.premium).toLocaleString(undefined, {maximumFractionDigits: 2})}` : 'Calculating...')
                                        
                                        // 🔴 SELL OPTION: Naked Shorting Margin (लगभग Contract Value का 10%)
                                        : (tradeConfig.nearestStrike > 0 ? `~ ₹${(tradeConfig.qty * tradeConfig.nearestStrike * 0.1).toLocaleString(undefined, {maximumFractionDigits: 0})} (Short Margin)` : 'Calculating...')
                                    )
                                    // ⚡ FUTURES: Contract Value का 10%
                                    : `~ ₹${(tradeConfig.qty * tradeConfig.clickedPrice * 0.1).toLocaleString(undefined, {maximumFractionDigits: 0})} (10%)`
                                }
                            </span>
                        </div>
                        <button 
                            className={`w-full py-3 rounded-md text-white font-bold text-[14px] shadow-sm transition-transform active:scale-[0.98] ${tradeConfig.side === 'BUY' ? 'bg-[#26a69a] hover:bg-[#208b81]' : 'bg-[#ef5350] hover:bg-[#d84a48]'}`}
                            onClick={() => {
                                if (!chartRef.current) return;

                                const posId = `trade_${Date.now()}`;
                                const spotEntry = tradeConfig.clickedPrice;

                                const isBullish = (tradeConfig.side === 'BUY' && tradeConfig.optionType === 'CE') || 
                                                  (tradeConfig.side === 'SELL' && tradeConfig.optionType === 'PE');

                                let slSpot = 0; let tpSpot = 0;
                                if (isBullish) {
                                    slSpot = tradeConfig.slValue > 0 ? spotEntry - tradeConfig.slValue : 0;
                                    tpSpot = tradeConfig.tpValue > 0 ? spotEntry + tradeConfig.tpValue : 0;
                                } else {
                                    slSpot = tradeConfig.slValue > 0 ? spotEntry + tradeConfig.slValue : 0;
                                    tpSpot = tradeConfig.tpValue > 0 ? spotEntry - tradeConfig.tpValue : 0;
                                }

                                const hasSL = slSpot > 0; const hasTP = tpSpot > 0;
                                const estSlLoss = hasSL ? `- ₹${(Math.abs(spotEntry - slSpot) * tradeConfig.qty).toLocaleString(undefined, {maximumFractionDigits: 0})}` : '';
                                const estTpProfit = hasTP ? `+ ₹${(Math.abs(spotEntry - tpSpot) * tradeConfig.qty).toLocaleString(undefined, {maximumFractionDigits: 0})}` : '';

                                // 💾 State में सेव करें
                                setOpenPositions(prev => [...prev, {
                                    id: posId, instrument: tradeConfig.instrument, side: tradeConfig.side,
                                    optionType: tradeConfig.optionType, strike: tradeConfig.nearestStrike,
                                    qty: tradeConfig.qty, entryPremium: tradeConfig.premium, entrySpot: spotEntry,
                                    slSpot: slSpot, tpSpot: tpSpot, pnl: 0, status: 'OPEN'
                                }]);

                                const chart = chartRef.current;
                                const entryPixelY = chart.convertToPixel({ value: spotEntry }).y;

                                // 🔵 1. CREATE ENTRY LINE (Fixed)
                                chart.createOverlay({
                                    name: 'customEntryLine',
                                    id: `${posId}_entry`,
                                    groupId: posId,
                                    extendData: { qty: tradeConfig.qty, pnl: '₹ 0.00' },
                                    points: [{ value: spotEntry }]
                                });

                                // 🟡 2. CREATE SL LINE
                                if (hasSL) {
                                    chart.createOverlay({
                                        name: 'customSlLine',
                                        id: `${posId}_sl`,
                                        groupId: posId,
                                        extendData: { 
                                            qty: tradeConfig.qty, spotEntry: spotEntry, isBullish: isBullish 
                                        },
                                        points: [{ value: slSpot }],
                                        onDragEnd: function(event) {
                                            const finalSl = event.overlay.points[0].value;
                                            setOpenPositions(prev => prev.map(p => p.id === posId ? { ...p, slSpot: finalSl } : p));
                                            setToastData({ title: "SL Updated", message: `New SL: ${finalSl.toFixed(2)}`, type: 'success' });
                                            return true;
                                        }
                                    });
                                }

                                // 🟢 3. CREATE TP LINE
                                if (hasTP) {
                                    chart.createOverlay({
                                        name: 'customTpLine',
                                        id: `${posId}_tp`,
                                        groupId: posId,
                                        extendData: { 
                                            qty: tradeConfig.qty, spotEntry: spotEntry, isBullish: isBullish 
                                        },
                                        points: [{ value: tpSpot }],
                                        onDragEnd: function(event) {
                                            const finalTp = event.overlay.points[0].value;
                                            setOpenPositions(prev => prev.map(p => p.id === posId ? { ...p, tpSpot: finalTp } : p));
                                            setToastData({ title: "TP Updated", message: `New TP: ${finalTp.toFixed(2)}`, type: 'success' });
                                            return true;
                                        }
                                    });
                                }

                                // ✨ Clean UI
                                setShowTradePanel(false);
                                setToastData({ title: "Order Placed", message: `Bracket Order Active @ ${spotEntry.toFixed(2)}`, type: 'success' });
                            }}
                        >
                            {tradeConfig.side} {tradeConfig.qty} {tradeConfig.instrument === 'Options' ? `${tradeConfig.nearestStrike} ${tradeConfig.optionType}` : 'FUT'}
                        </button>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default CustomChart;