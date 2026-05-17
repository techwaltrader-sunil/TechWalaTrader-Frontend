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


// export const INDICATOR_LIST = [
//     // 1. CANDLE PROPERTY (Sabse zaroori - Price ko indicator se compare karne ke liye)
//     { 
//         id: 'candle', 
//         label: 'Candle Price (LTP/Close/Open)', 
//         params: [
//             { name: 'Source', value: 'Close', type: 'select', options: ['Close', 'Open', 'High', 'Low'] }
//         ] 
//     },
//     // 2. VOLUME
//     { 
//         id: 'volume', 
//         label: 'Volume', 
//         params: [] // Volume ka koi period nahi hota, wo direct candle se aata hai
//     },
//     // 3. MOVING AVERAGES
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
//     // 4. MOMENTUM & TREND
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
//             { name: 'Signal', value: 9, type: 'number' },
//             // 🔥 MACD me 3 lines hoti hain, user ko select karne do
//             { name: 'Line', value: 'MACD Line', type: 'select', options: ['MACD Line', 'Signal Line', 'Histogram'] }
//         ] 
//     },
//     // 5. VOLATILITY & BANDS (New Additions)
//     { 
//         id: 'bb', 
//         label: 'Bollinger Bands', 
//         params: [
//             { name: 'Period', value: 20, type: 'number' },
//             { name: 'StdDev', value: 2, type: 'number' },
//             { name: 'Line', value: 'Upper', type: 'select', options: ['Upper', 'Lower', 'Middle'] }
//         ] 
//     },
//     { 
//         id: 'atr', 
//         label: 'Average True Range (ATR)', 
//         params: [
//             { name: 'Period', value: 14, type: 'number' }
//         ] 
//     },
//     // 6. OTHERS
//     { 
//         id: 'vwap', 
//         label: 'VWAP', 
//         params: [] 
//     },
//     {
//         id: 'number',
//         label: 'Number (Static Value)',
//         params: [
//           { name: 'Value', type: 'number', value: 50 } 
//         ]
//     }
// ];

// File: data/indicatorList.js

// export const INDICATOR_LIST = [
//     { 
//         id: 'moving_average', 
//         label: 'Moving Average', 
//         params: [
//             { name: 'MovingAverage1', type: 'number', value: 10 },
//             { 
//                 name: 'MovingAverageType', 
//                 type: 'select', 
//                 value: 'SMA', 
//                 options: ['SMA', 'TEMA', 'DEMA', 'WMA', 'TRIMA', 'KAMA', 'MAMA', 'T3', 'EMA'] 
//             },
//             { name: 'Interval', type: 'number', value: 0 }
//         ] 
//     },
//     { 
//         id: 'vwap', 
//         label: 'VWAP', 
//         params: [
//             { 
//                 name: 'VWAP_Type', 
//                 type: 'select', 
//                 value: 'VWAP', 
//                 options: ['VWAP', 'SDPlus1', 'SDMinus1'] 
//             },
//             { name: 'Interval', type: 'number', value: 0 }
//         ] 
//     },
//     { 
//         id: 'macd', 
//         label: 'MACD', 
//         params: [
//             { name: 'FastMA', type: 'number', value: 12 },
//             { name: 'SlowMA', type: 'number', value: 26 },
//             { name: 'Signal', type: 'number', value: 9 }
//         ] 
//     },
//     { 
//         id: 'rsi', 
//         label: 'RSI', 
//         params: [
//             { name: 'Period', type: 'number', value: 14 }
//         ] 
//     },
//     { 
//         id: 'supertrend', 
//         label: 'SuperTrend', 
//         params: [
//             { name: 'PERIOD', type: 'number', value: 7 },
//             { name: 'MULTIPLIER', type: 'number', value: 3 },
//             { name: 'Interval', type: 'number', value: 0 }
//         ] 
//     },
//     { 
//         id: 'macd_signal', 
//         label: 'MACD-Signal', 
//         params: [
//             { name: 'FastMA', type: 'number', value: 12 },
//             { name: 'SlowMA', type: 'number', value: 26 },
//             { name: 'Signal', type: 'number', value: 9 }
//         ] 
//     },
//     { 
//         id: 'candle', 
//         label: 'Candle', 
//         params: [
//             { 
//                 name: 'Candle_Price', 
//                 type: 'select', 
//                 value: 'Open', 
//                 options: ['Open', 'High', 'Low', 'Close'] 
//             }
//         ] 
//     },
//     { 
//         id: 'number', 
//         label: 'Number', 
//         params: [
//             { name: 'Number', type: 'number', value: 0 }
//         ] 
//     },
    
//     // 🔥 PENDING INDICATORS (Inko abhi khali rakha hai, jab aap screenshot bhejenge tab inke parameters add kar denge)
//     { 
//         id: 'camrila', 
//         label: 'Camrila', 
//         params: [] 
//     },
//     { 
//         id: 'pivot_point', 
//         label: 'Pivot Point', 
//         params: [] 
//     }
// ];



// File: data/indicatorList.js

export const INDICATOR_LIST = [
    // ==========================================
    // 📊 TREND & AVERAGES
    // ==========================================
    { 
        id: 'moving_average', 
        label: 'Moving Average', 
        params: [
            { name: 'MovingAverage1', type: 'number', value: 10 },
            { name: 'MovingAverageType', type: 'select', value: 'SMA', options: ['SMA', 'TEMA', 'DEMA', 'WMA', 'TRIMA', 'KAMA', 'MAMA', 'T3', 'EMA'] },
            { name: 'Interval', type: 'number', value: 0 }
        ] 
    },
    { 
        id: 'wma', 
        label: 'WMA', 
        params: [
            { name: 'Period', type: 'number', value: 20 }
        ] 
    },
    { 
        id: 'tema', 
        label: 'TEMA', 
        params: [
            { name: 'Period', type: 'number', value: 30 }
        ] 
    },
    { 
        id: 'vwap', 
        label: 'VWAP', 
        params: [
            { name: 'VWAP_Type', type: 'select', value: 'VWAP', options: ['VWAP', 'SDPlus1', 'SDMinus1'] },
            { name: 'Interval', type: 'number', value: 0 }
        ] 
    },
    { 
        id: 'supertrend', 
        label: 'SuperTrend', 
        params: [
            { name: 'PERIOD', type: 'number', value: 7 },
            { name: 'MULTIPLIER', type: 'number', value: 3 },
            { name: 'Interval', type: 'number', value: 0 }
        ] 
    },
    { 
        id: 'parabolic_sar', 
        label: 'Parabolic SAR', 
        params: [
            { name: 'Minimum_AF', type: 'number', value: 0.02 },
            { name: 'Maximum_AF', type: 'number', value: 0.2 }
        ] 
    },
    { 
        id: 'linear_regression', 
        label: 'Linear Regression', 
        params: [
            { name: 'Length', type: 'number', value: 14 }
        ] 
    },
    { 
        id: 'linear_regression_intercept', 
        label: 'Linear Regression Intercept', 
        params: [
            { name: 'Length', type: 'number', value: 14 }
        ] 
    },

    // ==========================================
    // 📈 MOMENTUM, OSCILLATORS & DIRECTIONAL
    // ==========================================
    { 
        id: 'macd', 
        label: 'MACD', 
        params: [
            { name: 'FastMA', type: 'number', value: 12 },
            { name: 'SlowMA', type: 'number', value: 26 },
            { name: 'Signal', type: 'number', value: 9 }
        ] 
    },
    { 
        id: 'macd_signal', 
        label: 'MACD-Signal', 
        params: [
            { name: 'FastMA', type: 'number', value: 12 },
            { name: 'SlowMA', type: 'number', value: 26 },
            { name: 'Signal', type: 'number', value: 9 }
        ] 
    },
    { 
        id: 'rsi', 
        label: 'RSI', 
        params: [
            { name: 'Period', type: 'number', value: 14 }
        ] 
    },
    { 
        id: 'stochastic', 
        label: 'Stochastic', 
        params: [
            { name: 'Period', type: 'number', value: 14 },
            { name: 'Type', type: 'select', value: 'Fast', options: ['Fast', 'Slow'] }
        ] 
    },
    { 
        id: 'adx', 
        label: 'ADX', 
        params: [
            { name: 'Period', type: 'number', value: 14 }
        ] 
    },
    { 
        id: '+di', 
        label: '+DI', 
        params: [
            { name: 'Period', type: 'number', value: 14 }
        ] 
    },
    { 
        id: '-di', 
        label: '-DI', 
        params: [
            { name: 'Period', type: 'number', value: 14 }
        ] 
    },

    // ==========================================
    // 🎯 SUPPORT & RESISTANCE (Pivot Levels)
    // ==========================================
    { 
        id: 'camrila', 
        label: 'Camrila', 
        params: [
            { name: 'Signal', type: 'select', value: 'R5', options: ['R5', 'R4', 'R3', 'R2', 'R1', 'PP', 'S1', 'S2', 'S3', 'S4', 'S5'] }
        ] 
    },
    { 
        id: 'pivot_point', 
        label: 'Pivot Point', 
        params: [
            { name: 'Signal', type: 'select', value: 'R3', options: ['R3', 'R2', 'R1', 'PP', 'S1', 'S2', 'S3'] }
        ] 
    },

    // ==========================================
    // 🌐 VOLATILITY & BANDS
    // ==========================================
    { 
        id: 'atr', 
        label: 'ATR', 
        params: [
            { name: 'Period', type: 'number', value: 14 }
        ] 
    },
    { 
        id: 'true_range', 
        label: 'True Range', 
        params: [
            { name: 'Panel', type: 'select', value: 'Auto', options: ['Auto', 'Main Chart'] } // Usually plotted below or on chart
        ] 
    },
    { 
        id: 'bband_upper', 
        label: 'Bband Upper', 
        params: [
            { name: 'Period', type: 'number', value: 20 },
            { name: 'Standard Deviations', type: 'number', value: 2 },
            { name: 'MA Type', type: 'select', value: 'SMA', options: ['SMA', 'EMA'] }
        ] 
    },
    { 
        id: 'bband_middle', 
        label: 'Bband Middle', 
        params: [
            { name: 'Period', type: 'number', value: 20 },
            { name: 'Standard Deviations', type: 'number', value: 2 },
            { name: 'MA Type', type: 'select', value: 'SMA', options: ['SMA', 'EMA'] }
        ] 
    },
    { 
        id: 'bband_bottom', 
        label: 'Bband Bottom', 
        params: [
            { name: 'Period', type: 'number', value: 20 },
            { name: 'Standard Deviations', type: 'number', value: 2 },
            { name: 'MA Type', type: 'select', value: 'SMA', options: ['SMA', 'EMA'] }
        ] 
    },
    { 
        id: 'bollinger_band', 
        label: 'Bollinger Band', 
        params: [
            { name: 'Band Type', type: 'select', value: 'Lower', options: ['Lower', 'Middle', 'Upper'] },
            { name: 'Period', type: 'number', value: 20 },
            { name: 'Standard Deviations', type: 'number', value: 2 },
            { name: 'MA Type', type: 'select', value: 'SMA', options: ['SMA', 'EMA'] }
        ] 
    },

    // ==========================================
    // 🔢 PRICE & STATIC VALUES
    // ==========================================
    { 
        id: 'candle', 
        label: 'Candle', 
        params: [
            { name: 'Candle_Price', type: 'select', value: 'Open', options: ['Open', 'High', 'Low', 'Close'] }
        ] 
    },
    { 
        id: 'number', 
        label: 'Number', 
        params: [
            { name: 'Number', type: 'number', value: 0 }
        ] 
    }
];