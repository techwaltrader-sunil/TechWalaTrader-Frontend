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