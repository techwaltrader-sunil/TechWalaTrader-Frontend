import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// 🎯 ध्यान दें: अगर aggregateCandles किसी और फाइल में है, तो उसे यहाँ import कर लें। 
// उदाहरण: import { aggregateCandles } from '../../utils/helpers'; 
import {aggregateCandles} from '../components/algoComponents/Aoc/DrawingPanel/utils';

export const useMarketEngine = (
    appMode, chartRef, base1mData, timeframe, date, time, playbackSpeed, 
    symbol, setPriceAlerts, setOpenPositions, processPnL, 
    setToastData, liveUpdateCallbackRef, activeAlertsRef
) => {

    const lastLiveLtpRef = useRef(null);

    // ========================================================
    // 🧠 THE CORE BRAIN: Alerts & Ghost Orders (DRY Principle)
    // ========================================================
    const processTickAlerts = (currentPrice, checkHitLogic) => {
        let newGhostPositions = [];
        let didAlertChange = false;

        activeAlertsRef.current.forEach(alertItem => {
            if (!alertItem.isTriggered) {
                const targetPrice = Number(alertItem.price);
                
                // 🎯 चेक करें कि क्या प्राइस लाइन को क्रॉस कर गया है
                if (checkHitLogic(targetPrice)) {
                    didAlertChange = true;
                    alertItem.isTriggered = true; // तुरंत ब्लॉक करें ताकि दोबारा ट्रिगर न हो

                    if (alertItem.isAutoTrade && alertItem.tradeConfig) {
                        const tc = alertItem.tradeConfig;
                        const isBullish = (tc.side === 'BUY' && tc.optionType === 'CE') || (tc.side === 'SELL' && tc.optionType === 'PE');
                        
                        const slSpot = isBullish ? targetPrice - tc.sl : targetPrice + tc.sl;
                        const tpSpot = isBullish ? targetPrice + tc.tp : targetPrice - tc.tp;
                        const ghostTradeId = `ghost_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

                        newGhostPositions.push({
                            id: ghostTradeId, 
                            status: appMode === 'live' ? 'OPEN' : 'PENDING', 
                            side: tc.side, 
                            optionType: tc.optionType, 
                            qty: tc.qty,
                            entrySpot: targetPrice, entryPrice: targetPrice,
                            slSpot: slSpot, slPrice: slSpot, 
                            tpSpot: tpSpot, tpPrice: tpSpot,
                            isBullish: isBullish, 
                            slValue: tc.sl, tpValue: tc.tp,
                            slType: 'Points', tpType: 'Points', isAocPending: false
                        });

                        if (chartRef.current) {
                            chartRef.current.createOverlay({ name: 'customEntryLine', id: `${ghostTradeId}_entry`, groupId: ghostTradeId, extendData: { type: 'ENTRY', price: targetPrice, qty: tc.qty, pnl: 'PENDING' }, points: [{ value: targetPrice }] });
                            chartRef.current.createOverlay({ name: 'customSlLine', id: `${ghostTradeId}_sl`, groupId: ghostTradeId, extendData: { type: 'SL', price: slSpot, spotEntry: targetPrice, isBullish: isBullish, qty: tc.qty, pts: tc.sl, pnl: tc.sl * tc.qty }, points: [{ value: slSpot }] });
                            if (tpSpot > 0) chartRef.current.createOverlay({ name: 'customTpLine', id: `${ghostTradeId}_tp`, groupId: ghostTradeId, extendData: { type: 'TP', price: tpSpot, spotEntry: targetPrice, isBullish: isBullish, qty: tc.qty, pts: tc.tp, pnl: tc.tp * tc.qty }, points: [{ value: tpSpot }] });
                        }

                        setTimeout(() => setToastData({ 
                            title: appMode === 'live' ? "👻 Live Ghost Order Executed!" : "👻 Ghost Order Woke Up!", 
                            message: `${tc.side} ${tc.qty} Triggered @ ${targetPrice.toFixed(2)}`, 
                            type: 'success' 
                        }), 0);
                        
                    } else {
                        // 🔔 Normal Alert
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                        audio.play().catch(e => console.log(e));
                        setTimeout(() => setToastData({ 
                            title: appMode === 'live' ? `Live Alert Hit!` : `Alert on ${symbol || 'NIFTY'}`, 
                            message: alertItem.message || `${symbol} Crossed ${targetPrice.toFixed(2)}`, 
                            type: 'alarm' 
                        }), 0);
                    }

                    if (chartRef.current) chartRef.current.removeOverlay({ id: alertItem.id });
                }
            }
        });

        // 🔄 State Updates
        if (didAlertChange) {
            setPriceAlerts(prev => prev.map(a => activeAlertsRef.current.find(ac => ac.id === a.id)?.isTriggered ? { ...a, isTriggered: true } : a));
        }
        if (newGhostPositions.length > 0) {
            setOpenPositions(prev => [...prev, ...newGhostPositions]);
        }
        if (processPnL) {
            processPnL(currentPrice);
        }
    };


    // ==========================================
    // 🚀 1. SIMULATOR DATA FEEDER
    // ==========================================
    useEffect(() => {
        if (appMode === 'live' || !chartRef.current || base1mData.length === 0 || !liveUpdateCallbackRef.current) return;

        try {
            const [year, month, day] = date.split('-');
            const [hour, minute] = time.split(':');
            const cutoffTime = new Date(year, parseInt(month) - 1, day, hour, minute).getTime();

            const slicedData = base1mData.filter(candle => candle.timestamp <= cutoffTime);
            if (slicedData.length === 0) return;

            const aggregatedData = aggregateCandles(slicedData, timeframe.value, timeframe.unit);
            if (aggregatedData.length === 0) return;

            const sanitizedData = aggregatedData.map(c => ({
                timestamp: new Date(c.timestamp).getTime(),
                open: Number(c.open), high: Number(c.high), low: Number(c.low), close: Number(c.close), volume: Number(c.volume) || 0
            }));

            const existingData = chartRef.current.getDataList();
            
            if (existingData.length === 0) {
                sanitizedData.forEach(candle => liveUpdateCallbackRef.current(candle));
            } else {
                const lastChartTimestamp = existingData[existingData.length - 1].timestamp;
                const candlesToUpdate = sanitizedData.filter(c => c.timestamp >= lastChartTimestamp);

                if (candlesToUpdate.length > 0) {
                    for (let i = 0; i < candlesToUpdate.length - 1; i++) {
                        liveUpdateCallbackRef.current(candlesToUpdate[i]);
                    }

                    const latestCandle = candlesToUpdate[candlesToUpdate.length - 1];
                    const { timestamp, open, high, low, close, volume } = latestCandle;
                    const isBullish = close >= open;
                    const path = isBullish ? [open, low, high, close] : [open, high, low, close];
                    
                    const totalDuration = Number(playbackSpeed) || 3000; 
                    const updateInterval = totalDuration >= 60000 ? 250 : 100; 
                    const totalSteps = totalDuration / updateInterval;
                    
                    let currentStep = 0;
                    let dynamicHigh = open;
                    let dynamicLow = open;

                    if (window.liveCandleTimer) clearInterval(window.liveCandleTimer);

                    window.liveCandleTimer = setInterval(() => {
                        currentStep++;
                        const progress = currentStep / totalSteps;
                        let currentPrice = open;

                        if (progress < 0.33) {
                            currentPrice = open + (path[1] - open) * (progress / 0.33);
                        } else if (progress < 0.66) {
                            currentPrice = path[1] + (path[2] - path[1]) * ((progress - 0.33) / 0.33);
                        } else {
                            currentPrice = path[2] + (path[3] - path[2]) * ((progress - 0.66) / 0.34);
                        }

                        const noise = (Math.random() - 0.5) * ((high - low) * 0.15); 
                        let simulatedPrice = currentPrice + noise;

                        if (simulatedPrice > high) simulatedPrice = high;
                        if (simulatedPrice < low) simulatedPrice = low;
                        if (simulatedPrice > dynamicHigh) dynamicHigh = simulatedPrice;
                        if (simulatedPrice < dynamicLow) dynamicLow = simulatedPrice;

                        liveUpdateCallbackRef.current({ timestamp, open, high: dynamicHigh, low: dynamicLow, close: simulatedPrice, volume: Math.floor(volume * progress) || 0 });

                        // 🎯 Call Core Engine for Simulator
                        processTickAlerts(simulatedPrice, (targetPrice) => (dynamicLow <= targetPrice && dynamicHigh >= targetPrice));

                        if (currentStep >= totalSteps) {
                            clearInterval(window.liveCandleTimer);
                            liveUpdateCallbackRef.current({ timestamp, open, high, low, close, volume: volume || 0 });
                        }
                    }, updateInterval);
                }
            }
        } catch (err) {
            console.error("Simulator Tick Error:", err);
        }
    }, [time, date, base1mData, timeframe, appMode, processPnL]);


    // ==========================================
    // 🔴 2. LIVE MARKET WEBSOCKET ENGINE
    // ==========================================
    useEffect(() => {
        if (appMode === 'historical') return;

        const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5500' : 'http://65.0.164.229:5500';
        const socket = io(SOCKET_URL, { transports: ['websocket'] });
        const tokenToSymbol = { "13": "NIFTY", "25": "BANKNIFTY", "27": "FINNIFTY", "26": "MIDCPNIFTY", "51": "SENSEX" };

        socket.on('live-spot-update', (data) => {
            const receivedSymbol = tokenToSymbol[data.symbol];
            
            if (receivedSymbol === symbol && chartRef.current && liveUpdateCallbackRef.current) {
                const dataList = chartRef.current.getDataList();
                const currentLtp = Number(data.ltp);
                const prevLtp = lastLiveLtpRef.current || currentLtp;
                
                lastLiveLtpRef.current = currentLtp;

                // Update Chart
                if (!dataList || dataList.length === 0) {
                    liveUpdateCallbackRef.current({ timestamp: new Date().getTime(), open: currentLtp, high: currentLtp, low: currentLtp, close: currentLtp, volume: 1 });
                } else {
                    const lastCandle = dataList[dataList.length - 1];
                    liveUpdateCallbackRef.current({ timestamp: lastCandle.timestamp, open: lastCandle.open, high: Math.max(lastCandle.high, currentLtp), low: Math.min(lastCandle.low, currentLtp), close: currentLtp, volume: lastCandle.volume + 1 });
                }

                // 🎯 Call Core Engine for Live WebSocket
                processTickAlerts(currentLtp, (targetPrice) => (
                    (prevLtp <= targetPrice && currentLtp >= targetPrice) || (prevLtp >= targetPrice && currentLtp <= targetPrice)
                ));
            }
        });

        return () => {
            socket.off('live-spot-update');
            socket.disconnect();
        };
    }, [appMode, symbol, processPnL]);

};