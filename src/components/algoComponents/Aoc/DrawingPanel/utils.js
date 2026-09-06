export const hexToRgba = (hex, alpha = 0.2) => {
    if(!hex || !hex.startsWith('#')) return hex || `rgba(41, 98, 255, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


// ==========================================
// 🎨 TRADINGVIEW COLOR PALETTE
// ==========================================
export const TV_COLORS = [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827',
    '#fca5a5', '#fdba74', '#fcd34d', '#86efac', '#67e8f9', '#93c5fd', '#c4b5fd', '#f9a8d4',
    '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#b91c1c', '#c2410c', '#b45309', '#15803d', '#0e7490', '#1d4ed8', '#6d28d9', '#be185d',
];



// ==========================================
// 🧮 CANDLE AGGREGATION LOGIC (1m -> 5m, 15m, 1H)
// ==========================================
export const aggregateCandles = (data1m, tfValue, tfUnit) => {
    // अगर टाइमफ्रेम 1 मिनट है, तो सीधा वही डेटा वापस कर दें
    if (tfValue === 1 && tfUnit === 'minute') return data1m;
    
    // टाइमफ्रेम को मिनटों में बदलें
    let tfMinutes = tfValue;
    if (tfUnit === 'hour') tfMinutes = tfValue * 60;
    if (tfUnit === 'day') tfMinutes = tfValue * 1440;

    const tfMs = tfMinutes * 60 * 1000;
    const aggregated = [];
    let currentCandle = null;
    // 🇮🇳 IST Timezone Offset (+5:30) -> 19800000 ms
    // भारतीय समय के हिसाब से कैंडल्स को सही जगह ग्रुप करने के लिए यह बहुत ज़रूरी है
    const IST_OFFSET = 19800000; 
    data1m.forEach(candle => {
        // समय को टाइमफ्रेम के ब्लॉक (Chunk) में सेट करें (जैसे 9:15 से 9:20)
        const alignedTime = Math.floor((candle.timestamp + IST_OFFSET) / tfMs) * tfMs - IST_OFFSET;
        
        if (!currentCandle || currentCandle.timestamp !== alignedTime) {
            if (currentCandle) aggregated.push(currentCandle);
            currentCandle = { ...candle, timestamp: alignedTime };
        } else {
            // 🎯 जो लॉजिक आपने सोचा था, वही यहाँ लागू हो रहा है!
            currentCandle.high = Math.max(currentCandle.high, candle.high);
            currentCandle.low = Math.min(currentCandle.low, candle.low);
            currentCandle.close = candle.close;
            currentCandle.volume += candle.volume;
        }
    });
    
    if (currentCandle) aggregated.push(currentCandle);
    return aggregated;
};