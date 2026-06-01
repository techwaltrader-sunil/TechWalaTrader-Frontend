
// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, CandlestickSeries, LineSeries, BaselineSeries, createSeriesMarkers } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades, theme = "dark" }) => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     // 🔥 द थीम लॉजिक (Light/Dark Colors)
//     // ==========================================
//     const chartThemes = {
//         dark: {
//             layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
//             grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
//         },
//         light: {
//             layout: { background: { type: ColorType.Solid, color: "#ffffff" }, textColor: "#1f2937" },
//             grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } }, 
//         }
//     };

//     const activeTheme = theme === "light" ? chartThemes.light : chartThemes.dark;

//     // 1. चार्ट को इनिशियलाइज़ करें
//    const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: activeTheme.layout,
//       grid: activeTheme.grid,    
//       timeScale: {
//           timeVisible: true,     
//           secondsVisible: false, 
//       },
//     });

//     // 2. मेन कैंडलस्टिक सीरीज़ बनाएं
//     const mainSeries = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e", downColor: "#ef4444",
//       wickUpColor: "#22c55e", wickDownColor: "#ef4444",
//     });

//     if (candleData?.length > 0) {
//       const formattedCandles = candleData.map((c) => ({
//         time: Math.floor(new Date(c.timestamp).getTime() / 1000) + 19800,
//         open: parseFloat(c.open),
//         high: parseFloat(c.high),
//         low: parseFloat(c.low),
//         close: parseFloat(c.close),
//       })).sort((a, b) => a.time - b.time);
      
//       mainSeries.setData(formattedCandles);

//       let chartMarkers = [];

//      // 3. SMC सिग्नल्स (Segment Lines, Markers + 🔥 RECTANGLES 🔥)
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
          
//           // ==========================================
//           // 🟩 POI ZONES (E-OF, E-OB, D-OF, D-OB) RECTANGLES (FILLED)
//           // ==========================================
//           if (["E-OF", "E-OB", "D-OF", "D-OB"].includes(sig.type)) {
              
//               const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
//               if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;

//               const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               if (isNaN(topPrice) || isNaN(bottomPrice)) return;

//               let boxColor = "";
//               let textColor = "#9333ea"; 
              
//               if (sig.type === "E-OF" || sig.type === "D-OF") {
//                   boxColor = sig.trend === "BULLISH" ? "rgba(249, 115, 22, 0.2)" : "rgba(255, 153, 28, 0.2)";
//               } else if (sig.type === "E-OB" || sig.type === "D-OB") {
//                   boxColor = sig.trend === "BULLISH" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)";
//               }

//               const zoneData = [];
//               const centerData = []; 
              
//               // 🔥 THE MAGIC TRICK: हम लाइन को बीच में नहीं, बल्कि बॉक्स की छत (topPrice) पर रखेंगे!
//               const textAnchorPrice = topPrice; 
              
//               const targetCenterTime = (startSec + endSec) / 2;
//               let centerTimeSec = endSec;
//               let minDiff = Infinity;

//               formattedCandles.forEach((c) => {
//                   if (c.time >= startSec && c.time <= endSec) {
//                       zoneData.push({ time: c.time, value: topPrice });
//                       centerData.push({ time: c.time, value: textAnchorPrice }); // छत वाला डेटा
                      
//                       const diff = Math.abs(c.time - targetCenterTime);
//                       if (diff < minDiff) {
//                           minDiff = diff;
//                           centerTimeSec = c.time;
//                       }
//                   }
//               });

//               if (zoneData.length > 0) {
//                   const zoneSeries = chart.addSeries(BaselineSeries, {
//                       baseValue: { type: 'price', price: bottomPrice },
//                       topFillColor1: boxColor,
//                       topFillColor2: boxColor,
//                       topLineColor: boxColor.replace("0.2", "0.5"),
//                       bottomFillColor1: 'transparent',
//                       bottomFillColor2: 'transparent',
//                       bottomLineColor: 'transparent',
//                       lineWidth: 1,
//                       crosshairMarkerVisible: false,
//                       lastValueVisible: false,
//                       priceLineVisible: false,
//                   });
//                   zoneSeries.setData(zoneData);

//                   const textSeries = chart.addSeries(LineSeries, {
//                       color: 'transparent',
//                       lineWidth: 0,
//                       crosshairMarkerVisible: false,
//                       lastValueVisible: false,
//                       priceLineVisible: false,
//                   });
//                   textSeries.setData(centerData);

//                   // 🏷️ छत से टेक्स्ट को नीचे लटकाना
//                   createSeriesMarkers(textSeries, [{
//                     time: centerTimeSec, 
//                     position: 'inBar', // यह छत (topPrice) पर रहकर टेक्स्ट को बॉक्स के अंदर लटका देगा!
//                     color: textColor,
//                     text: sig.displayName || sig.type,
//                   }]);
//               }
              
//               return; 
//           }

//           // ==========================================
//           // 📏 NORMAL LINES (BOS, CHoCH, IDM, X)
//           // ==========================================
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          
//           if (!sig.price || isNaN(parseFloat(sig.price))) return; 
//           const linePrice = parseFloat(sig.price);

//           const isBullish = sig.trend === "BULLISH";
//           const safeType = String(sig.type || "");

//           // 🔥 1. एकदम साफ़ और अलग-अलग चेक (No .includes!)
//           const isMainIDM = safeType === "IDM";
//           const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
//           const isAnyIDM = isMainIDM || isCounterIDM;

//           let lineColor = "#71717a"; 
//           if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
          
//           // 🔥 2. सीधा और स्पष्ट कलर असाइनमेंट
//           if (isAnyIDM) {
//               lineColor = "#9ca3af"; // ग्रे कलर
//           }

//           if (safeType === "X" || safeType === "Ref X") {
//               lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
//           }

//           if (startSec && endSec && startSec < endSec) {
//              const segmentData = [];
//              const targetCenterTime = (startSec + endSec) / 2;
//              let centerTimeSec = endSec;
//              let minDiff = Infinity;

//              formattedCandles.forEach((c) => {
//                  if (c.time >= startSec && c.time <= endSec) {
//                      segmentData.push({ time: c.time, value: linePrice });
//                      const diff = Math.abs(c.time - targetCenterTime);
//                      if (diff < minDiff) {
//                          minDiff = diff;
//                          centerTimeSec = c.time;
//                      }
//                  }
//              });

//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  // 🔥 3. स्टाइल के लिए भी साफ़ चेक
//                  lineStyle: isAnyIDM ? 1 : 2, // 1 = Dotted (IDM के लिए), 2 = Dashed
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              // 🔥 Text Position Logic (आपका एकदम सही वाला लॉजिक)
//              let markerPos = "aboveBar"; 
//              if (safeType === "X" || safeType === "Ref X") {
//                  markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
//              } else if (safeType === "IDM(S2D)") {
//                  markerPos = "belowBar"; // 🎯 S2D लाइन के नीचे
//              } else if (safeType === "IDM(D2S)") {
//                  markerPos = "aboveBar"; // 🎯 D2S लाइन के ऊपर
//              } else {
//                  if (sig.trend === "BEARISH") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH") ? "belowBar" : "aboveBar";
//                  } else if (sig.trend === "BULLISH") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH") ? "aboveBar" : "belowBar";
//                  }
//              }
             
//              try {
//                  createSeriesMarkers(lineSeries, [{
//                     time: centerTimeSec, 
//                     position: markerPos, 
//                     color: lineColor,
//                     text: safeType,
//                  }]);
//              } catch(err) {
//                  console.log("Marker render skipped for:", safeType);
//              }
//           }
//         });
//       }


//       // 4. एग्जीक्यूटेड ट्रेड्स के लिए मार्कर्स
//       if (executedTrades?.length > 0) {
//         executedTrades.forEach((trade) => {
//           const entryTime = Math.floor(new Date(trade.entryTime).getTime() / 1000) + 19800;
//           if(!isNaN(entryTime)) {
//              chartMarkers.push({
//                time: entryTime,
//                position: trade.transaction === "BUY" ? "belowBar" : "aboveBar",
//                color: "#2563eb",
//                shape: "circle",
//                text: `Trade: ${trade.transaction}`,
//              });
//           }
//         });
//       }

//       if (chartMarkers.length > 0) {
//         createSeriesMarkers(mainSeries, chartMarkers);
//       }
//     }

//     chart.timeScale().fitContent();

//     return () => chart.remove();
//   }, [candleData, smcSignals, executedTrades, theme]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default VisualDebuggerChart;






import React, { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, LineSeries, BaselineSeries, createSeriesMarkers } from "lightweight-charts";

const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades, theme = "dark" }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 🔥 द थीम लॉजिक (Light/Dark Colors)
    // ==========================================
    const chartThemes = {
        dark: {
            layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
            grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
        },
        light: {
            layout: { background: { type: ColorType.Solid, color: "#ffffff" }, textColor: "#1f2937" },
            grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } }, 
        }
    };

    const activeTheme = theme === "light" ? chartThemes.light : chartThemes.dark;

    // 1. चार्ट को इनिशियलाइज़ करें
   const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 800,
      height: 450,
      layout: activeTheme.layout,
      grid: activeTheme.grid,    
      timeScale: {
          timeVisible: true,     
          secondsVisible: false, 
      },
    });

    // 2. मेन कैंडलस्टिक सीरीज़ बनाएं
    const mainSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e", downColor: "#ef4444",
      wickUpColor: "#22c55e", wickDownColor: "#ef4444",
    });

    if (candleData?.length > 0) {
      const formattedCandles = candleData.map((c) => ({
        time: Math.floor(new Date(c.timestamp).getTime() / 1000) + 19800,
        open: parseFloat(c.open),
        high: parseFloat(c.high),
        low: parseFloat(c.low),
        close: parseFloat(c.close),
      })).sort((a, b) => a.time - b.time);
      
      mainSeries.setData(formattedCandles);

      let chartMarkers = [];

     // 3. SMC सिग्नल्स (Segment Lines, Markers + 🔥 RECTANGLES 🔥)
      if (smcSignals?.length > 0) {
        smcSignals.forEach((sig) => {
          
          // ==========================================
          // 🟩 POI ZONES (E-OF, E-OB, D-OF, D-OB) RECTANGLES (FILLED)
          // ==========================================
          // 🔥 .includes() को हटाकर सीधा === यूज़ किया है
          const isPoiZone = sig.type === "E-OF" || sig.type === "E-OB" || sig.type === "D-OF" || sig.type === "D-OB";

          if (isPoiZone) {
              const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
              const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
              if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;

              const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
              const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
              if (isNaN(topPrice) || isNaN(bottomPrice)) return;

              const typeName = String(sig.displayName || sig.type || "");

              // 🔥 1. एकदम साफ़ और अलग-अलग चेक (No .includes!)
              const isS2D = typeName === "E-S2D(OF)" || typeName === "E-S2D(OB)" || typeName === "D-S2D(OF)" || typeName === "D-S2D(OB)";
              const isD2S = typeName === "E-D2S(OF)" || typeName === "E-D2S(OB)" || typeName === "D-D2S(OF)" || typeName === "D-D2S(OB)";

              let boxColor = "rgba(156, 163, 175, 0.2)"; // Default Gray
              let textColor = "#4b5563"; 

              if (isS2D) {
                  boxColor = "rgba(59, 130, 246, 0.2)"; // 🔵 Light Blue (Counter Bullish S2D के लिए)
                  textColor = "#1e3a8a";
              } else if (isD2S) {
                  boxColor = "rgba(249, 115, 22, 0.2)"; // 🟠 Orange (Counter Bearish D2S के लिए)
                  textColor = "#9a3412";
              } else {
                  // Main Structure Zones
                  if (sig.trend === "BULLISH") {
                      boxColor = "rgba(34, 197, 94, 0.2)"; // 🟢 Green
                      textColor = "#166534";
                  } else if (sig.trend === "BEARISH") {
                      boxColor = "rgba(239, 68, 68, 0.2)"; // 🔴 Red
                      textColor = "#991b1b";
                  }
              }

              const zoneData = [];
              const centerData = []; 
              const textAnchorPrice = topPrice; 
              
              // 🔥 VISUAL CENTER FIX: Timestamps की जगह Candle Index का इस्तेमाल!
              let startIndex = -1;
              let endIndex = -1;

              for (let i = 0; i < formattedCandles.length; i++) {
                  const t = formattedCandles[i].time;
                  if (t >= startSec && startIndex === -1) startIndex = i;
                  if (t <= endSec) endIndex = i;
              }

              let centerTimeSec = endSec;
              if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
                  // एकदम बीच वाली कैंडल का इंडेक्स निकालो
                  const centerIndex = Math.floor((startIndex + endIndex) / 2);
                  centerTimeSec = formattedCandles[centerIndex].time;

                  for (let i = startIndex; i <= endIndex; i++) {
                      zoneData.push({ time: formattedCandles[i].time, value: topPrice });
                      centerData.push({ time: formattedCandles[i].time, value: textAnchorPrice }); 
                  }
              }

              if (zoneData.length > 0) {
                  const zoneSeries = chart.addSeries(BaselineSeries, {
                      baseValue: { type: 'price', price: bottomPrice },
                      topFillColor1: boxColor,
                      topFillColor2: boxColor,
                      topLineColor: boxColor.replace("0.2", "0.5"),
                      bottomFillColor1: 'transparent',
                      bottomFillColor2: 'transparent',
                      bottomLineColor: 'transparent',
                      lineWidth: 1,
                      crosshairMarkerVisible: false,
                      lastValueVisible: false,
                      priceLineVisible: false,
                  });
                  zoneSeries.setData(zoneData);

                  const textSeries = chart.addSeries(LineSeries, {
                      color: 'transparent',
                      lineWidth: 0,
                      crosshairMarkerVisible: false,
                      lastValueVisible: false,
                      priceLineVisible: false,
                  });
                  textSeries.setData(centerData);

                  createSeriesMarkers(textSeries, [{
                    time: centerTimeSec, 
                    position: 'inBar', 
                    color: textColor,
                    text: typeName,
                  }]);
              }
              
              return; 
          }

          // ==========================================
          // 📏 NORMAL LINES (BOS, CHoCH, IDM, X, BOS(C), X(C))
          // ==========================================
          const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
          const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          
          if (!sig.price || isNaN(parseFloat(sig.price))) return; 
          const linePrice = parseFloat(sig.price);

          const isBullish = sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER";
          const safeType = String(sig.type || "");

          const isMainIDM = safeType === "IDM";
          const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
          const isAnyIDM = isMainIDM || isCounterIDM;

          let lineColor = "#71717a"; 
          
          // 🔥 BOS(C) को भी मेन BOS की तरह कलर मिलेगा
          if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
              lineColor = isBullish ? "#22c55e" : "#ef4444"; 
          }
          
          if (isAnyIDM) {
              lineColor = "#9ca3af"; 
          }

          // 🔥 X(C) को भी X की तरह कलर मिलेगा
          if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
              lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
          }

          if (startSec && endSec && startSec < endSec) {
             const segmentData = [];
             
             // 🔥 VISUAL CENTER FIX FOR LINES
             let startIndex = -1;
             let endIndex = -1;

             for (let i = 0; i < formattedCandles.length; i++) {
                 const t = formattedCandles[i].time;
                 if (t >= startSec && startIndex === -1) startIndex = i;
                 if (t <= endSec) endIndex = i;
             }

             let centerTimeSec = endSec;
             if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
                 // एकदम बीच वाली कैंडल का इंडेक्स निकालो
                 const centerIndex = Math.floor((startIndex + endIndex) / 2);
                 centerTimeSec = formattedCandles[centerIndex].time;

                 for (let i = startIndex; i <= endIndex; i++) {
                     segmentData.push({ time: formattedCandles[i].time, value: linePrice });
                 }
             }

             const lineSeries = chart.addSeries(LineSeries, {
                 color: lineColor,
                 lineWidth: 2,
                 lineStyle: isAnyIDM ? 1 : 2, 
                 crosshairMarkerVisible: false,
                 lastValueVisible: false, 
                 priceLineVisible: false,
             });

             if (segmentData.length > 0) {
                 lineSeries.setData(segmentData);
             }

             // 🔥 Text Position Logic
             let markerPos = "aboveBar"; 
             if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
                 markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
             } else if (safeType === "IDM(S2D)") {
                 markerPos = "belowBar"; 
             } else if (safeType === "IDM(D2S)") {
                 markerPos = "aboveBar"; 
             } else {
                 if (sig.trend === "BEARISH" || sig.trend === "BEARISH_COUNTER") {
                     markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "belowBar" : "aboveBar";
                 } else if (sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER") {
                     markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "aboveBar" : "belowBar";
                 }
             }
             
             try {
                 createSeriesMarkers(lineSeries, [{
                    time: centerTimeSec, 
                    position: markerPos, 
                    color: lineColor,
                    text: safeType,
                 }]);
             } catch(err) {
                 console.log("Marker render skipped for:", safeType);
             }
          }
        });
      }


      // 4. एग्जीक्यूटेड ट्रेड्स के लिए मार्कर्स
      if (executedTrades?.length > 0) {
        executedTrades.forEach((trade) => {
          const entryTime = Math.floor(new Date(trade.entryTime).getTime() / 1000) + 19800;
          if(!isNaN(entryTime)) {
             chartMarkers.push({
               time: entryTime,
               position: trade.transaction === "BUY" ? "belowBar" : "aboveBar",
               color: "#2563eb",
               shape: "circle",
               text: `Trade: ${trade.transaction}`,
             });
          }
        });
      }

      if (chartMarkers.length > 0) {
        createSeriesMarkers(mainSeries, chartMarkers);
      }
    }

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [candleData, smcSignals, executedTrades, theme]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
};

export default VisualDebuggerChart;