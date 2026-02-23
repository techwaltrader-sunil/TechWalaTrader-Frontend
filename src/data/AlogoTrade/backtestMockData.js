// // src/data/backtestMockData.js

// export const fetchBacktestData = (period, strategyIds) => {
//   // Return a Promise to simulate API Network Delay (Real Feel)
//   return new Promise((resolve) => {
    
//     setTimeout(() => {
//       // --- 1. Determine Date Range ---
//       let days = 30;
//       if (period === '3M') days = 90;
//       if (period === '6M') days = 180;
//       if (period === '1Y') days = 365;
//       if (period === '2Y') days = 730;
//       if (period === 'Custom') days = 45;

//       // --- 2. Simulation Variables ---
//       let totalPnL = 0;
//       let wins = 0;
//       let losses = 0;
//       let totalWinAmt = 0;
//       let totalLossAmt = 0;
//       const transactions = [];

//       // --- 3. Loop Logic ---
//       for (let i = 0; i < days; i++) {
//         const currentDate = new Date(Date.now() - (days - i) * 86400000);

//         // A. Skip Weekends
//         if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

//         // B. STRATEGY ACTIVITY RATE (60% days active)
//         // Agar strategyIds zyada hain to activity rate badha sakte ho
//         const activityRate = strategyIds.length > 1 ? 0.7 : 0.4; 
        
//         if (Math.random() > (1 - activityRate)) {
            
//             // C. VOLUME VARIATION (1 to 6 trades per day)
//             const tradesToday = Math.floor(Math.random() * 6) + 1;

//             for (let j = 0; j < tradesToday; j++) {
//                 const isProfit = Math.random() > 0.48; // 52% Win Rate
//                 const pnl = isProfit
//                     ? Math.floor(Math.random() * 2500) + 500
//                     : -Math.floor(Math.random() * 1500) - 200;

//                 totalPnL += pnl;
//                 if (pnl > 0) { wins++; totalWinAmt += pnl; }
//                 else { losses++; totalLossAmt += pnl; }

//                 // Entry Time Randomness
//                 const entryHour = 9 + Math.floor(Math.random() * 6);
//                 const entryMin = Math.floor(Math.random() * 60);

//                 transactions.push({
//                     id: `${Math.random().toString(36).substr(2, 9)}`, // Random ID
//                     date: currentDate.toLocaleDateString('en-GB'), // DD/MM/YYYY
//                     pnl: pnl,
//                     symbol: "NIFTY 50",
//                     quantity: 50,
//                     entryPrice: 22000 + Math.floor(Math.random() * 200),
//                     exitPrice: 22000 + Math.floor(Math.random() * 200),
//                     details: {
//                         entryTime: `${entryHour.toString().padStart(2, '0')}:${entryMin.toString().padStart(2, '0')}`,
//                         exitTime: "15:15",
//                         quantity: 50
//                     }
//                 });
//             }
//         }
//       }

//       // --- 4. Final Calculations ---
//       const totalTrades = transactions.length;
//       const uniqueDates = new Set(transactions.map(t => t.date)).size;

//       const result = {
//         summary: {
//             totalPnL,
//             winRate: totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0,
//             maxDrawdown: -14500, // Mocked
//             totalTrades: totalTrades,
//             tradingDays: uniqueDates, // Actual unique days
//             wins,
//             losses,
//             avgProfit: wins > 0 ? Math.round(totalWinAmt / wins) : 0,
//             avgLoss: losses > 0 ? Math.round(totalLossAmt / losses) : 0,
//         },
//         transactions: transactions.reverse() // Newest first
//       };

//       // Resolve the promise (Return Data)
//       resolve(result);

//     }, 1500); // 1.5 Second delay (Loading spinner dikhane ke liye)
//   });
// };

// export const fetchBacktestData = (period, strategyIds) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
      
//       // 1. CONFIGURATION
//       let daysToGen = 30;
//       if (period === '3M') daysToGen = 90;
//       if (period === '6M') daysToGen = 180;
//       if (period === '1Y') daysToGen = 365;
//       if (period === '2Y') daysToGen = 730; // 2 Years Real Data
//       if (period === 'Custom') daysToGen = 45;

//       const initialCapital = 500000; // 5 Lakh Start
//       let currentBalance = initialCapital;
      
//       // Containers
//       const transactions = [];
//       const equityCurve = [];
//       const dailyStats = [];

//       let totalPnL = 0;
//       let wins = 0;
//       let losses = 0;
//       let totalWinAmt = 0;
//       let totalLossAmt = 0;
//       let winStreak = 0;
//       let lossStreak = 0;
//       let maxWinStreak = 0;
//       let maxLossStreak = 0;
//       let peakBalance = initialCapital;
//       let maxDrawdown = 0;

//       // 2. GENERATION LOOP (Oldest Date -> Today)
//       for (let i = daysToGen; i >= 0; i--) {
//         const dateObj = new Date();
//         dateObj.setDate(dateObj.getDate() - i);
//         const dateStr = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY

//         // Skip Weekends
//         const dayNum = dateObj.getDay();
//         if (dayNum === 0 || dayNum === 6) continue;

//         // Skip Random Days (Strategy not active every day)
//         // 2 Year data me thoda realistic feel ke liye 60% days active
//         if (Math.random() > 0.4) {
          
//           let dayPnL = 0;
//           let dayTradesCount = 0;
          
//           // Trades per day (1 to 5)
//           const tradesToday = Math.floor(Math.random() * 5) + 1;

//           for (let t = 0; t < tradesToday; t++) {
//              const isWin = Math.random() > 0.45; // 55% Win rate approx
//              const tradePnL = isWin 
//                 ? Math.floor(Math.random() * 3000) + 500 
//                 : -Math.floor(Math.random() * 2000) - 500;

//              // Update Aggregates
//              dayPnL += tradePnL;
//              totalPnL += tradePnL;
//              dayTradesCount++;

//              if (tradePnL > 0) {
//                wins++;
//                totalWinAmt += tradePnL;
//                winStreak++;
//                lossStreak = 0;
//                if(winStreak > maxWinStreak) maxWinStreak = winStreak;
//              } else {
//                losses++;
//                totalLossAmt += Math.abs(tradePnL);
//                lossStreak++;
//                winStreak = 0;
//                if(lossStreak > maxLossStreak) maxLossStreak = lossStreak;
//              }

//              // Add Transaction
//              transactions.push({
//                id: `TX-${Date.now()}-${i}-${t}`,
//                date: dateStr,
//                symbol: "NIFTY 50",
//                type: tradePnL > 0 ? "BUY" : "SELL", // Mock logic
//                qty: 50,
//                entryPrice: 22000 + (Math.random() * 100),
//                exitPrice: 22000 + (Math.random() * 100),
//                pnl: tradePnL,
//                details: {
//                  entryTime: "09:30",
//                  exitTime: "15:15"
//                }
//              });
//           }

//           // Daily Stats Update
//           dailyStats.push({
//             date: dateStr,
//             pnl: dayPnL,
//             tradeCount: dayTradesCount,
//             isProfit: dayPnL >= 0
//           });

//           // Equity Curve Update
//           currentBalance += dayPnL;
//           equityCurve.push({
//             date: dateStr,
//             balance: currentBalance,
//             pnl: dayPnL
//           });

//           // Drawdown Calc
//           if (currentBalance > peakBalance) {
//             peakBalance = currentBalance;
//           }
//           const currentDrawdown = currentBalance - peakBalance;
//           if (currentDrawdown < maxDrawdown) {
//             maxDrawdown = currentDrawdown;
//           }
//         }
//       }

//       // 3. FINAL OBJECT CONSTRUCTION (MongoDB Schema Style)
//       const finalData = {
//         meta: {
//           period,
//           strategyCount: strategyIds.length,
//           generatedAt: new Date().toISOString()
//         },
//         summary: {
//           totalPnL,
//           roi: ((totalPnL / initialCapital) * 100).toFixed(2),
//           maxDrawdown,
//           winRate: Math.round((wins / (wins + losses)) * 100),
//           totalTrades: wins + losses,
//           tradingDays: dailyStats.length,
//           wins,
//           losses,
//           avgProfit: wins > 0 ? Math.round(totalWinAmt / wins) : 0,
//           avgLoss: losses > 0 ? Math.round(totalLossAmt / losses) : 0,
//           maxWinStreak,
//           maxLossStreak
//         },
//         // Reverse arrays for Tables (Newest First) but keep Charts (Oldest First) if needed
//         transactions: transactions.reverse(), 
//         dailyStats: dailyStats, // For Heatmap
//         equityCurve: equityCurve // For Chart
//       };

//       resolve(finalData);

//     }, 1000); // 1 sec loading simulation
//   });
// };


export const fetchBacktestData = (period, strategyIds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      
      // 1. CONFIGURATION
      let daysToGen = 30;
      if (period === '3M') daysToGen = 90;
      if (period === '6M') daysToGen = 180;
      if (period === '1Y') daysToGen = 365;
      if (period === '2Y') daysToGen = 730; 
      if (period === 'Custom') daysToGen = 60;

      const initialCapital = 500000;
      let currentBalance = initialCapital;
      
      const transactions = [];
      const equityCurve = [];
      const dailyStats = [];

      let totalPnL = 0;
      let wins = 0;
      let losses = 0;
      let totalWinAmt = 0;
      let totalLossAmt = 0;
      let winStreak = 0;
      let lossStreak = 0;
      let maxWinStreak = 0;
      let maxLossStreak = 0;
      let peakBalance = initialCapital;
      let maxDrawdown = 0;

      // 2. GENERATION LOOP (Days)
      for (let i = daysToGen; i >= 0; i--) {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - i);
        const dateStr = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY

        // Skip Weekends
        const dayNum = dateObj.getDay();
        if (dayNum === 0 || dayNum === 6) continue;

        // ✅ LOGIC 1: Activity Rate (60% active days)
        if (Math.random() > 0.4) {
          
          let dayPnL = 0;
          let dayTradesCount = 0;
          
          // ✅ LOGIC 2: FORCE MULTIPLE TRADES
          // Math.random() * 5 gives 0-4. + 2 ensures 2 to 6 trades.
          // Isse Trading Days aur Total Trades kabhi barabar nahi honge.
          const tradesToday = Math.floor(Math.random() * 5) + 2; 

          // --- INNER LOOP (Trades per Day) ---
          for (let t = 0; t < tradesToday; t++) {
             const isWin = Math.random() > 0.48; 
             const tradePnL = isWin 
                ? Math.floor(Math.random() * 3000) + 500 
                : -Math.floor(Math.random() * 2000) - 500;

             dayPnL += tradePnL;
             totalPnL += tradePnL;
             dayTradesCount++;

             if (tradePnL > 0) {
               wins++;
               totalWinAmt += tradePnL;
               winStreak++;
               lossStreak = 0;
               if(winStreak > maxWinStreak) maxWinStreak = winStreak;
             } else {
               losses++;
               totalLossAmt += Math.abs(tradePnL);
               lossStreak++;
               winStreak = 0;
               if(lossStreak > maxLossStreak) maxLossStreak = lossStreak;
             }

             transactions.push({
               id: `TX-${Date.now()}-${i}-${t}`,
               date: dateStr,
               symbol: "NIFTY 50",
               type: tradePnL > 0 ? "BUY" : "SELL", 
               qty: 50,
               entryPrice: 22000 + (Math.random() * 100),
               exitPrice: 22000 + (Math.random() * 100),
               pnl: tradePnL,
               details: {
                 entryTime: `${9 + Math.floor(Math.random() * 6)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
                 exitTime: "15:15"
               }
             });
          }

          dailyStats.push({
            date: dateStr,
            pnl: dayPnL,
            tradeCount: dayTradesCount,
            isProfit: dayPnL >= 0
          });

          currentBalance += dayPnL;
          equityCurve.push({
            date: dateStr,
            balance: currentBalance,
            pnl: dayPnL
          });

          if (currentBalance > peakBalance) peakBalance = currentBalance;
          const currentDrawdown = currentBalance - peakBalance;
          if (currentDrawdown < maxDrawdown) maxDrawdown = currentDrawdown;
        }
      }

      // 3. STRICT RE-CALCULATION
      // Total Trades = List ki puri lambai
      const finalTotalTrades = transactions.length;

      // Trading Days = Unique Dates ki ginti (Set use karke duplicate dates hat jayengi)
      const uniqueDates = new Set(transactions.map(t => t.date));
      const finalTradingDays = uniqueDates.size;

      const finalData = {
        meta: { period, generatedAt: new Date().toISOString() },
        summary: {
          totalPnL,
          roi: ((totalPnL / initialCapital) * 100).toFixed(2),
          maxDrawdown,
          winRate: finalTotalTrades > 0 ? Math.round((wins / finalTotalTrades) * 100) : 0,
          
          // ✅ Values Assigned Here
          totalTrades: finalTotalTrades, 
          tradingDays: finalTradingDays, 

          wins, losses,
          avgProfit: wins > 0 ? Math.round(totalWinAmt / wins) : 0,
          avgLoss: losses > 0 ? Math.round(totalLossAmt / losses) : 0,
          maxWinStreak, maxLossStreak
        },
        transactions: transactions.reverse(), 
        dailyStats: dailyStats, 
        equityCurve: equityCurve 
      };

      resolve(finalData);

    }, 800); 
  });
};