// src/data/mockData.js

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getGrowth = (current, previous) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous * 100).toFixed(2);
};

const getChartData = (axisView, year) => {
   // ... (Chart logic same rahega, bas numbers random hain to apne aap badal jayenge)
   // Short karne ke liye main purana code repeat nahi kar raha hu, wo same rahega.
   // Bas niche return karte waqt hum random call kar rahe hain to naya data aayega.
   
   // (Copy existing getChartData logic here)
   // ...
    let data = [];
  
  if (axisView === 'month' || axisView === 'month_yr') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    data = months.map(m => {
      const curr = getRandom(20000, 50000);
      const prev = getRandom(15000, 45000);
      return {
        name: m,
        current: curr,
        previous: prev,
        growth: Number(getGrowth(curr, prev))
      };
    });
  } 
  else if (axisView === 'quarter') {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    data = quarters.map(q => {
      const curr = getRandom(100000, 150000);
      const prev = getRandom(90000, 140000);
      return {
        name: q,
        current: curr,
        previous: prev,
        growth: Number(getGrowth(curr, prev))
      };
    });
  } 
  else if (axisView === 'day') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    data = days.map(d => {
      const curr = getRandom(2000, 8000);
      const prev = getRandom(1500, 7000);
      return {
        name: d,
        current: curr,
        previous: prev,
        growth: Number(getGrowth(curr, prev))
      };
    });
  }
  return data;
};

// ✅ UPDATED KPI GENERATOR (Mode Support ke sath)
const getKPIData = (filter, year, mode) => {
  
  let multiplier = 1;
  if (filter.includes('quarter')) multiplier = 3;
  if (filter === 'ytd' || filter === 'all_time') multiplier = 10;

  // ✨ Logic: Backtest me trades jyada hote hain par profit per trade kam ho sakta hai
  // Live me trades kam hote hain
  const isBacktest = mode === 'backtest';
  
  const baseProfit = isBacktest ? 50000 : 100000; // Live me profit jyada dikhate hain example ke liye
  const baseTrades = isBacktest ? 300 : 120;      // Backtest me trades jyada (Fast testing)

  return {
    pnl: { 
      curr: baseProfit * multiplier + getRandom(1000, 5000), 
      prev: (baseProfit * 0.8) * multiplier + getRandom(1000, 5000) 
    },
    winRate: { 
      curr: isBacktest ? getRandom(40, 55) : getRandom(60, 70), // Backtest winrate thoda real rakhte hain
      prev: getRandom(45, 60) 
    },
    trades: { 
      curr: baseTrades * multiplier, 
      prev: (baseTrades * 0.9) * multiplier 
    },
    rr: { 
      curr: isBacktest ? 3.5 : 2.5, // Backtest me RR jyada target karte hain
      prev: 2.1 
    },
    drawdown: { 
      curr: getRandom(5, 12), 
      prev: getRandom(4, 10) 
    }
  };
};

// ✅ fetchOverviewData me 'mode' argument add kiya
export const fetchOverviewData = (filter, year, axisView, mode) => {
  return {
    kpi: getKPIData(filter, year, mode),
    chart: getChartData(axisView, year) // Chart data bhi random hai to refresh hoga
  };
};