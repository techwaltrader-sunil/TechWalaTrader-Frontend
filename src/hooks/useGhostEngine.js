// import { useState, useCallback } from 'react';

// export const useGhostEngine = (chartRef, symbol, setToastData) => {
//     // 🌟 सिर्फ Alert का State अभी हुक में ला रहे हैं
//     const [priceAlerts, setPriceAlerts] = useState([]);

//     // 🎯 नया और क्लीन Add Alert फंक्शन
//     const handleAddAlert = useCallback((payload) => {
//         const targetPrice = Number(payload.price);
//         const alertId = payload.id || `alert_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

//         const newAlert = {
//             id: alertId,
//             symbol: symbol,
//             price: targetPrice,
//             isTriggered: false,
//             isAutoTrade: payload.isAutoTrade === true,
//             tradeConfig: payload.tradeConfig 
//         };

//         // 1. स्टेट में सेव करें
//         setPriceAlerts(prev => [...prev, newAlert]);

//         // 2. चार्ट पर लाइन ड्रा करें
//         if (chartRef.current) {
//             chartRef.current.createOverlay({
//                 name: 'alertLine',
//                 id: alertId,
//                 groupId: alertId, // 👈 Group Id डालना ज़रूरी है
//                 extendData: { price: targetPrice, symbol: symbol, isHovered: false },
//                 points: [{ value: targetPrice }]
//             });
//         }

//         // 3. टोस्ट मैसेज
//         if (setToastData) setToastData({ title: "Ghost Alarm Set!", message: `${symbol} @ ${targetPrice.toFixed(2)}`, type: 'info' });

//     }, [symbol, setToastData, chartRef]);

//     // जो चीज़ें CustomChart को चाहिए, वो वापस (Return) कर दें
//     return {
//         priceAlerts,
//         setPriceAlerts,
//         handleAddAlert
//     };
// };



import { useState, useCallback } from 'react';

// 🌟 1. नए पैरामीटर्स (Sniper) यहाँ जोड़ दिए गए हैं
export const useGhostEngine = (chartRef, symbol, setToastData, sniperMode, sniperRules, maxShiftPts, setAlertConfigModal, setDeleteAlertModal, chartContainerRef) => {
    const [priceAlerts, setPriceAlerts] = useState([]);
    
    // 🌟 2. Open Positions का स्टेट भी अब इंजन संभालेगा!
    const [openPositions, setOpenPositions] = useState([]); 

    const handleAddAlert = useCallback((payload) => {
        const targetPrice = Number(payload.price);
        const alertId = payload.id || `alert_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const newAlert = {
            id: alertId, symbol: symbol, price: targetPrice, isTriggered: false,
            isAutoTrade: payload.isAutoTrade === true, tradeConfig: payload.tradeConfig 
        };

        setPriceAlerts(prev => [...prev, newAlert]);

        if (chartRef.current) {
            chartRef.current.createOverlay({
                name: 'alertLine', 
                id: alertId, 
                groupId: alertId,
                lock: false, // 🔓 ड्रैग आइकॉन के लिए
                extendData: { 
                    price: targetPrice, 
                    symbol: symbol, 
                    isHovered: false, 
                    // 🚀 FIX 1: इनिशियल टेक्स्ट को डायनामिक रखें
                    text: `${symbol} Crossing ${targetPrice.toFixed(2)}` 
                },
                points: [{ value: targetPrice }],
                
                onMouseEnter: function(event) {
                    chartRef.current.overrideOverlay({ id: event.overlay.id, extendData: { ...event.overlay.extendData, isHovered: true } });
                    return true;
                },
                
                onMouseLeave: function(event) {
                    chartRef.current.overrideOverlay({ id: event.overlay.id, extendData: { ...event.overlay.extendData, isHovered: false } });
                    return true;
                },

                // 🚨 अब onDragging की ज़रूरत नहीं है, ओवरले खुद-ब-खुद लाइव प्राइस दिखाएगा!

                onDragEnd: function(event) {
                    const newPrice = event.overlay.points[0].value;
                    setPriceAlerts(prev => prev.map(a => a.id === event.overlay.id ? { ...a, price: newPrice } : a));
                    chartRef.current.overrideOverlay({ id: event.overlay.id, extendData: { ...event.overlay.extendData, price: newPrice } });
                    return true;
                },
                
                // 🚀 THE MAGIC FIX 3: सिर्फ X वाले डब्बे पर क्लिक होगा तभी Delete खुलेगा
                onClick: function(event) {
                    const clickX = event.x;
                    let paneWidth = 1000;
                    
                    if (chartContainerRef && chartContainerRef.current) {
                        paneWidth = chartContainerRef.current.clientWidth + 50;
                    } else if (chartRef.current && chartRef.current.getWidth) {
                        paneWidth = chartRef.current.getWidth();
                    }
                    
                    const centerX = paneWidth / 2;
                    
                    // 🎯 अगर क्लिक '✖' वाले पिक्सल एरिया में हुआ है
                    if (clickX > centerX + 40 && clickX < centerX + 110) {
                        if (setDeleteAlertModal) {
                            setDeleteAlertModal({
                                visible: true,
                                alertId: event.overlay.id,
                                price: event.overlay.points[0].value,
                                symbol: symbol
                            });
                        }
                        
                        if (chartContainerRef && chartContainerRef.current) {
                            const canvases = chartContainerRef.current.querySelectorAll('canvas');
                            canvases.forEach(c => c.style.removeProperty('cursor'));
                        }
                        return true; // क्लिक को यहीं रोक लें 
                    }
                    return false; // अगर लाइन पर क्लिक हुआ है, तो इग्नोर करें
                },

                onDoubleClick: function(event) {
                    if (setAlertConfigModal) {
                        const currentPrice = event.overlay.points[0].value;
                        setAlertConfigModal({
                            visible: true,
                            mode: 'edit',
                            id: event.overlay.id,
                            price: currentPrice, 
                            symbol: symbol,
                            condition: 'Crossing', 
                            trigger: 'Only Once',
                            isAutoTrade: payload.isAutoTrade === true,
                            tradeConfig: payload.tradeConfig || null,
                            alertName: payload.alertName || '',
                            message: payload.message || ''
                        });
                    }
                    return true;
                }
            });
        }
        if (setToastData) setToastData({ title: "Ghost Alarm Set!", message: `${symbol} @ ${targetPrice.toFixed(2)}`, type: 'info' });

    }, [symbol, setToastData, chartRef, setAlertConfigModal]);


    // 🕺 3. THE DANCING P&L ENGINE (Phase 3 यहाँ आ गया)
    const processPnL = useCallback((currentLtp) => {
        if (!chartRef.current) return;
        
        const chart = chartRef.current;
        const dataList = chart.getDataList();
        if (!dataList || dataList.length === 0) return;

        // लेटेस्ट कैंडल और लाइव टिक (LTP) को मिलाकर High/Low बनाएँ
        const latestCandle = dataList[dataList.length - 1];
        const currentSpot = currentLtp; 
        const currentHigh = Math.max(latestCandle.high, currentLtp);
        const currentLow = Math.min(latestCandle.low, currentLtp);

        setOpenPositions(prevPositions => {
            if (prevPositions.length === 0) return prevPositions;
            let positionsChanged = false;
            
            const updatedPositions = prevPositions.map(pos => {
                if (pos.status === 'CLOSED') return pos;

                const isBullishTrade = pos.isBullish === true;
                const isBearishTrade = pos.isBullish === false;

                // ----------------------------------------------------
                // ⏳ 1. PENDING STATE: Advanced Sniper Gatekeeper 🎯
                // ----------------------------------------------------
                if (pos.status === 'PENDING') {
                    let isAocAllowed = true;
                    if (sniperMode && sniperRules) {
                        if (isBullishTrade && sniperRules.ceAction === 'BLOCKED') isAocAllowed = false;
                        if (isBearishTrade && sniperRules.peAction === 'BLOCKED') isAocAllowed = false;
                    }

                    if (pos.isAocPending) {
                        const isSlHitWhileWaiting = isBullishTrade ? currentLow <= pos.slSpot : currentHigh >= pos.slSpot;

                        if (isSlHitWhileWaiting) {
                            chart.removeOverlay({ groupId: pos.id });
                            setTimeout(() => { if(setToastData) setToastData({ title: "🛡️ Saved by Sniper!", message: "AOC mismatch tha! Aaj apka SL hit hone se Bach Gaya 😌", type: 'success' }); }, 0);
                            positionsChanged = true;
                            return { ...pos, status: 'CLOSED', exitSpot: currentSpot, pnl: 0 };
                        }

                        const maxDeviation = maxShiftPts || 20; 
                        const isTooFar = isBullishTrade ? currentSpot > (pos.entrySpot + maxDeviation) : currentSpot < (pos.entrySpot - maxDeviation);

                        if (isTooFar) {
                            chart.removeOverlay({ groupId: pos.id });
                            setTimeout(() => { if(setToastData) setToastData({ title: "🚄 Missed the Train!", message: `Market moved ${maxDeviation}+ pts away without AOC Signal.`, type: 'info' }); }, 0);
                            positionsChanged = true;
                            return { ...pos, status: 'CLOSED', exitSpot: currentSpot, pnl: 0 };
                        }

                        if (isAocAllowed) {
                            const originalRiskPoints = Math.abs(pos.entrySpot - pos.slSpot);
                            let originalRewardPoints = pos.tpSpot ? Math.abs(pos.tpSpot - pos.entrySpot) : 0;
                            
                            const newEntrySpot = currentSpot; 
                            const newSlSpot = isBullishTrade ? (newEntrySpot - originalRiskPoints) : (newEntrySpot + originalRiskPoints);
                            let newTpSpot = pos.tpSpot ? (isBullishTrade ? (newEntrySpot + originalRewardPoints) : (newEntrySpot - originalRewardPoints)) : 0;

                            setTimeout(() => { if(setToastData) setToastData({ title: "🎯 Sniper Triggered!", message: `Signal Matched! Executed @ ${newEntrySpot.toFixed(2)}.`, type: 'success' }); }, 0);

                            chart.overrideOverlay({ id: `${pos.id}_entry`, points: [{ value: newEntrySpot }], extendData: { qty: pos.qty, price: newEntrySpot, pnl: '₹ 0.00' } });
                            chart.overrideOverlay({ id: `${pos.id}_sl`, points: [{ value: newSlSpot }], extendData: { type: 'SL', price: newSlSpot, entryPrice: newEntrySpot, entrySpot: newEntrySpot, qty: pos.qty, pts: originalRiskPoints, pnl: originalRiskPoints * pos.qty } });
                            if (newTpSpot) chart.overrideOverlay({ id: `${pos.id}_tp`, points: [{ value: newTpSpot }], extendData: { type: 'TP', price: newTpSpot, entryPrice: newEntrySpot, entrySpot: newEntrySpot, qty: pos.qty, pts: originalRewardPoints, pnl: originalRewardPoints * pos.qty } });

                            positionsChanged = true;
                            return { ...pos, status: 'OPEN', entrySpot: newEntrySpot, entryPrice: newEntrySpot, slSpot: newSlSpot, slPrice: newSlSpot, tpSpot: newTpSpot, tpPrice: newTpSpot, isAocPending: false };
                        }
                        return pos; 
                    }

                    const isEntryTouched = pos.entrySpot <= currentHigh && pos.entrySpot >= currentLow;
                    if (isEntryTouched) {
                        if (!isAocAllowed) {
                            setTimeout(() => { if(setToastData) setToastData({ title: "⏳ Trade on AOC Hold", message: "Mismatch! Engine is watching AOC.", type: 'alarm' }); }, 0);
                            chart.overrideOverlay({ id: `${pos.id}_entry`, extendData: { qty: pos.qty, pnl: '⏳ AOC HOLD' } });
                            positionsChanged = true;
                            return { ...pos, isAocPending: true };
                        } else {
                            setTimeout(() => { if(setToastData) setToastData({ title: "✅ Sniper Order Executed!", message: `${pos.side} ${pos.qty} Executed @ Spot ${pos.entrySpot.toFixed(2)}`, type: 'success' }); }, 0);
                            chart.overrideOverlay({ id: `${pos.id}_entry`, extendData: { qty: pos.qty, pnl: '₹ 0.00' } });
                            positionsChanged = true;
                            return { ...pos, status: 'OPEN' };
                        }
                    }
                }

                // ----------------------------------------------------
                // 🏃‍♂️ 2. OPEN STATE: The Dancing P&L & Auto Square-Off
                // ----------------------------------------------------
                if (pos.status === 'OPEN') {
                    const pointsMoved = currentSpot - pos.entrySpot;
                    const livePnl = isBullishTrade ? (pointsMoved * pos.qty) : (-pointsMoved * pos.qty);

                    let liveSlLevel = pos.slSpot;
                    let liveTpLevel = pos.tpSpot;

                    const slOverlays = chart.getOverlays({ id: `${pos.id}_sl` });
                    if (slOverlays && slOverlays.length > 0 && slOverlays[0].points) liveSlLevel = slOverlays[0].points[0].value;

                    const tpOverlays = chart.getOverlays({ id: `${pos.id}_tp` });
                    if (tpOverlays && tpOverlays.length > 0 && tpOverlays[0].points) liveTpLevel = tpOverlays[0].points[0].value;

                    let hitSL = false;
                    let hitTP = false;

                    if (isBullishTrade) {
                        if (liveSlLevel > 0 && currentLow <= liveSlLevel) hitSL = true; 
                        if (liveTpLevel > 0 && currentHigh >= liveTpLevel) hitTP = true; 
                    } else {
                        if (liveSlLevel > 0 && currentHigh >= liveSlLevel) hitSL = true; 
                        if (liveTpLevel > 0 && currentLow <= liveTpLevel) hitTP = true; 
                    }

                    if (hitSL || hitTP) {
                        chart.removeOverlay({ groupId: pos.id });
                        setTimeout(() => { if(setToastData) setToastData({ title: hitTP ? "🎯 Target Hit!" : "🔴 Stop Loss Hit!", message: `${pos.side} ${pos.qty} closed @ ${currentSpot.toFixed(2)}. P&L: ${livePnl >= 0 ? '+' : '-'} ₹ ${Math.abs(livePnl).toFixed(0)}`, type: hitTP ? 'success' : 'error' }); }, 0);
                        positionsChanged = true;
                        return { ...pos, status: 'CLOSED', pnl: livePnl, exitSpot: currentSpot };
                    }

                    const pnlText = `${livePnl >= 0 ? '+' : '-'} ₹ ${Math.abs(livePnl).toFixed(0)}`;
                    chart.overrideOverlay({ id: `${pos.id}_entry`, extendData: { qty: pos.qty, pnl: pnlText } });

                    if (pos.slSpot !== liveSlLevel || pos.tpSpot !== liveTpLevel) positionsChanged = true;
                    return { ...pos, pnl: livePnl, slSpot: liveSlLevel, tpSpot: liveTpLevel };
                }

                return pos;
            });

            if (positionsChanged) return updatedPositions.filter(p => p.status !== 'CLOSED');
            return updatedPositions;
        });

    }, [chartRef, sniperMode, sniperRules, maxShiftPts, setToastData]); // 👈 Dependencies updated

    return {
        priceAlerts,
        setPriceAlerts,
        handleAddAlert,
        openPositions,     // 🌟 CustomChart को वापस दे रहे हैं
        setOpenPositions,  // 🌟 CustomChart को वापस दे रहे हैं
        processPnL         // 🌟 नया फंक्शन दे रहे हैं
    };
};