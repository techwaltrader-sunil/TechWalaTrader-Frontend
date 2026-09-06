import { useEffect } from 'react';

export const useOptionsCalculator = (tradeConfig, setTradeConfig, chainData) => {
    
    // ==========================================
    // 🚀 1. THE STRIKE CALCULATOR (ITM/OTM/ATM)
    // ==========================================
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

            // 🛡️ स्टेट को सिर्फ तभी अपडेट करें जब स्ट्राइक सच में बदली हो (Infinite Loop से बचने के लिए)
            setTradeConfig(prev => {
                if (prev.nearestStrike !== calcStrike) {
                    return { ...prev, nearestStrike: calcStrike };
                }
                return prev;
            });
        }
    }, [tradeConfig.clickedPrice, tradeConfig.strikeCriteria, tradeConfig.strikeType, tradeConfig.optionType, tradeConfig.instrument, setTradeConfig]);


    // ==========================================
    // 🚀 2. THE LIVE PREMIUM FETCHING ENGINE
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
                
                // 3. स्टेट को अपडेट करें
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
    }, [tradeConfig.nearestStrike, tradeConfig.optionType, tradeConfig.instrument, chainData, setTradeConfig]);

};