export const INDICATOR_LIST = [
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
            { name: 'Signal', value: 9, type: 'number' }
        ] 
    },
    { 
        id: 'vwap', 
        label: 'VWAP', 
        params: [] // No params usually
    },
    { 
        id: 'number', 
        label: 'Number (Static Value)', 
        params: [
            { name: 'Value', value: 0, type: 'number' }
        ] 
    }
];