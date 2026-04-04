// export const INDICATOR_LIST = [
//     { 
//         id: 'sma', 
//         label: 'Simple Moving Average (SMA)', 
//         params: [
//             { name: 'Period', value: 14, type: 'number' },
//             { name: 'Source', value: 'Close', type: 'select', options: ['Close', 'Open', 'High', 'Low'] }
//         ] 
//     },
//     { 
//         id: 'ema', 
//         label: 'Exponential Moving Average (EMA)', 
//         params: [
//             { name: 'Period', value: 9, type: 'number' },
//             { name: 'Source', value: 'Close', type: 'select', options: ['Close', 'Open', 'High', 'Low'] }
//         ] 
//     },
//     { 
//         id: 'rsi', 
//         label: 'RSI', 
//         params: [
//             { name: 'Period', value: 14, type: 'number' }
//         ] 
//     },
//     { 
//         id: 'supertrend', 
//         label: 'SuperTrend', 
//         params: [
//             { name: 'Period', value: 7, type: 'number' },
//             { name: 'Multiplier', value: 3, type: 'number' }
//         ] 
//     },
//     { 
//         id: 'macd', 
//         label: 'MACD', 
//         params: [
//             { name: 'Fast MA', value: 12, type: 'number' },
//             { name: 'Slow MA', value: 26, type: 'number' },
//             { name: 'Signal', value: 9, type: 'number' }
//         ] 
//     },
//     { 
//         id: 'vwap', 
//         label: 'VWAP', 
//         params: [] // No params usually
//     },
//     { 
//         id: 'number', 
//         label: 'Number (Static Value)', 
//         params: [
//             { name: 'Value', value: 0, type: 'number' }
//         ] 
//     }
// ];


export const INDICATOR_LIST = [
    // 1. CANDLE PROPERTY (Sabse zaroori - Price ko indicator se compare karne ke liye)
    { 
        id: 'candle', 
        label: 'Candle Price (LTP/Close/Open)', 
        params: [
            { name: 'Source', value: 'Close', type: 'select', options: ['Close', 'Open', 'High', 'Low'] }
        ] 
    },
    // 2. VOLUME
    { 
        id: 'volume', 
        label: 'Volume', 
        params: [] // Volume ka koi period nahi hota, wo direct candle se aata hai
    },
    // 3. MOVING AVERAGES
    { 
        id: 'sma', 
        label: 'Simple Moving Average (SMA)', 
        params: [
            { name: 'Period', value: 14, type: 'number' },
            { name: 'Source', value: 'Close', type: 'select', options: ['Close', 'Open', 'High', 'Low'] }
        ] 
    },
    { 
        id: 'ema', 
        label: 'Exponential Moving Average (EMA)', 
        params: [
            { name: 'Period', value: 9, type: 'number' },
            { name: 'Source', value: 'Close', type: 'select', options: ['Close', 'Open', 'High', 'Low'] }
        ] 
    },
    // 4. MOMENTUM & TREND
    { 
        id: 'rsi', 
        label: 'RSI', 
        params: [
            { name: 'Period', value: 14, type: 'number' }
        ] 
    },
    { 
        id: 'supertrend', 
        label: 'SuperTrend', 
        params: [
            { name: 'Period', value: 7, type: 'number' },
            { name: 'Multiplier', value: 3, type: 'number' }
        ] 
    },
    { 
        id: 'macd', 
        label: 'MACD', 
        params: [
            { name: 'Fast MA', value: 12, type: 'number' },
            { name: 'Slow MA', value: 26, type: 'number' },
            { name: 'Signal', value: 9, type: 'number' },
            // 🔥 MACD me 3 lines hoti hain, user ko select karne do
            { name: 'Line', value: 'MACD Line', type: 'select', options: ['MACD Line', 'Signal Line', 'Histogram'] }
        ] 
    },
    // 5. VOLATILITY & BANDS (New Additions)
    { 
        id: 'bb', 
        label: 'Bollinger Bands', 
        params: [
            { name: 'Period', value: 20, type: 'number' },
            { name: 'StdDev', value: 2, type: 'number' },
            { name: 'Line', value: 'Upper', type: 'select', options: ['Upper', 'Lower', 'Middle'] }
        ] 
    },
    { 
        id: 'atr', 
        label: 'Average True Range (ATR)', 
        params: [
            { name: 'Period', value: 14, type: 'number' }
        ] 
    },
    // 6. OTHERS
    { 
        id: 'vwap', 
        label: 'VWAP', 
        params: [] 
    },
    {
        id: 'number',
        label: 'Number (Static Value)',
        params: [
          { name: 'Value', type: 'number', value: 50 } 
        ]
    }
];