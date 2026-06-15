
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
//           // 🔥 .includes() को हटाकर सीधा === यूज़ किया है
//           const isPoiZone = sig.type === "E-OF" || sig.type === "E-OB" || sig.type === "D-OF" || sig.type === "D-OB";

//           if (isPoiZone) {
//               const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
//               if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;

//               const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               if (isNaN(topPrice) || isNaN(bottomPrice)) return;

//               const typeName = String(sig.displayName || sig.type || "");

//               // 🔥 1. एकदम साफ़ और अलग-अलग चेक (No .includes!)
//               const isS2D = typeName === "E-S2D(OF)" || typeName === "E-S2D(OB)" || typeName === "D-S2D(OF)" || typeName === "D-S2D(OB)";
//               const isD2S = typeName === "E-D2S(OF)" || typeName === "E-D2S(OB)" || typeName === "D-D2S(OF)" || typeName === "D-D2S(OB)";

//               let boxColor = "rgba(156, 163, 175, 0.2)"; // Default Gray
//               let textColor = "#4b5563"; 

//               if (isS2D) {
//                   boxColor = "rgba(59, 130, 246, 0.2)"; // 🔵 Light Blue (Counter Bullish S2D के लिए)
//                   textColor = "#1e3a8a";
//               } else if (isD2S) {
//                   boxColor = "rgba(249, 115, 22, 0.2)"; // 🟠 Orange (Counter Bearish D2S के लिए)
//                   textColor = "#9a3412";
//               } else {
//                   // Main Structure Zones
//                   if (sig.trend === "BULLISH") {
//                       boxColor = "rgba(34, 197, 94, 0.2)"; // 🟢 Green
//                       textColor = "#166534";
//                   } else if (sig.trend === "BEARISH") {
//                       boxColor = "rgba(239, 68, 68, 0.2)"; // 🔴 Red
//                       textColor = "#991b1b";
//                   }
//               }

//               const zoneData = [];
//               const centerData = []; 
//               const textAnchorPrice = topPrice; 
              
//               // 🔥 VISUAL CENTER FIX: Timestamps की जगह Candle Index का इस्तेमाल!
//               let startIndex = -1;
//               let endIndex = -1;

//               for (let i = 0; i < formattedCandles.length; i++) {
//                   const t = formattedCandles[i].time;
//                   if (t >= startSec && startIndex === -1) startIndex = i;
//                   if (t <= endSec) endIndex = i;
//               }

//               let centerTimeSec = endSec;
//               if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                   // एकदम बीच वाली कैंडल का इंडेक्स निकालो
//                   const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                   centerTimeSec = formattedCandles[centerIndex].time;

//                   for (let i = startIndex; i <= endIndex; i++) {
//                       zoneData.push({ time: formattedCandles[i].time, value: topPrice });
//                       centerData.push({ time: formattedCandles[i].time, value: textAnchorPrice }); 
//                   }
//               }

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

//                   createSeriesMarkers(textSeries, [{
//                     time: centerTimeSec, 
//                     position: 'inBar', 
//                     color: textColor,
//                     text: typeName,
//                   }]);
//               }
              
//               return; 
//           }

//           // ==========================================
//           // 📏 NORMAL LINES (BOS, CHoCH, IDM, X, BOS(C), X(C))
//           // ==========================================
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          
//           if (!sig.price || isNaN(parseFloat(sig.price))) return; 
//           const linePrice = parseFloat(sig.price);

//           const isBullish = sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER";
//           const safeType = String(sig.type || "");

//           const isMainIDM = safeType === "IDM";
//           const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
//           const isAnyIDM = isMainIDM || isCounterIDM;

//           let lineColor = "#71717a"; 
          
//           // 🔥 BOS(C) को भी मेन BOS की तरह कलर मिलेगा
//           if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
          
//           if (isAnyIDM) {
//               lineColor = "#9ca3af"; 
//           }

//           // 🔥 X(C) को भी X की तरह कलर मिलेगा
//           if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
//               lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
//           }

//           if (startSec && endSec && startSec < endSec) {
//              const segmentData = [];
             
//              // 🔥 VISUAL CENTER FIX FOR LINES
//              let startIndex = -1;
//              let endIndex = -1;

//              for (let i = 0; i < formattedCandles.length; i++) {
//                  const t = formattedCandles[i].time;
//                  if (t >= startSec && startIndex === -1) startIndex = i;
//                  if (t <= endSec) endIndex = i;
//              }

//              let centerTimeSec = endSec;
//              if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                  // एकदम बीच वाली कैंडल का इंडेक्स निकालो
//                  const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                  centerTimeSec = formattedCandles[centerIndex].time;

//                  for (let i = startIndex; i <= endIndex; i++) {
//                      segmentData.push({ time: formattedCandles[i].time, value: linePrice });
//                  }
//              }

//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: isAnyIDM ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              // 🔥 Text Position Logic
//              let markerPos = "aboveBar"; 
//              if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
//                  markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
//              } else if (safeType === "IDM(S2D)") {
//                  markerPos = "belowBar"; 
//              } else if (safeType === "IDM(D2S)") {
//                  markerPos = "aboveBar"; 
//              } else {
//                  if (sig.trend === "BEARISH" || sig.trend === "BEARISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "belowBar" : "aboveBar";
//                  } else if (sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "aboveBar" : "belowBar";
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
//           // 🔥 .includes() को हटाकर सीधा === यूज़ किया है
//           const isPoiZone = sig.type === "E-OF" || sig.type === "E-OB" || sig.type === "D-OF" || sig.type === "D-OB" || sig.type === "IDM-OF";
//           if (isPoiZone) {
//               const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
//               if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;

//               const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               if (isNaN(topPrice) || isNaN(bottomPrice)) return;

//               const typeName = String(sig.displayName || sig.type || "");

//               // 🔥 1. एकदम साफ़ और अलग-अलग चेक (No .includes!)
//               const isS2D = typeName === "E-S2D(OF)" || typeName === "E-S2D(OB)" || typeName === "D-S2D(OF)" || typeName === "D-S2D(OB)";
//               const isD2S = typeName === "E-D2S(OF)" || typeName === "E-D2S(OB)" || typeName === "D-D2S(OF)" || typeName === "D-D2S(OB)";
//               const isIdmOf = typeName === "IDM OF" || sig.type === "IDM-OF"; // 🔥 NAYA: IDM-OF को पहचानने के लिए

//               // 🔥 THE OPACITY MAGIC: Agar historical hai, to color ko fade kar do
//               let boxColor = "rgba(156, 163, 175, 0.2)"; 
//               let textColor = "#4b5563"; 

//               if (isS2D) {
//                   boxColor = sig.isHistorical ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(30, 58, 138, 0.4)" : "#1e3a8a";
//               } else if (isD2S) {
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(154, 52, 18, 0.4)" : "#9a3412";
//               } else if (isIdmOf) {
//                   // 🔥 NAYA: IDM-OF के लिए ऑरेंज (Orange) कलर
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(194, 65, 12, 0.4)" : "#c2410c"; 
//               } else {
//                   // Main Structure Zones
//                   if (sig.trend === "BULLISH") {
//                       boxColor = "rgba(34, 197, 94, 0.2)"; // 🟢 Green
//                       textColor = "#166534";
//                   } else if (sig.trend === "BEARISH") {
//                       boxColor = "rgba(239, 68, 68, 0.2)"; // 🔴 Red
//                       textColor = "#991b1b";
//                   }
//               }

//               const zoneData = [];
//               const centerData = []; 
//               const textAnchorPrice = topPrice; 
              
//               // 🔥 VISUAL CENTER FIX: Timestamps की जगह Candle Index का इस्तेमाल!
//               let startIndex = -1;
//               let endIndex = -1;

//               for (let i = 0; i < formattedCandles.length; i++) {
//                   const t = formattedCandles[i].time;
//                   if (t >= startSec && startIndex === -1) startIndex = i;
//                   if (t <= endSec) endIndex = i;
//               }

//               let centerTimeSec = endSec;
//               if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                   // एकदम बीच वाली कैंडल का इंडेक्स निकालो
//                   const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                   centerTimeSec = formattedCandles[centerIndex].time;

//                   for (let i = startIndex; i <= endIndex; i++) {
//                       zoneData.push({ time: formattedCandles[i].time, value: topPrice });
//                       centerData.push({ time: formattedCandles[i].time, value: textAnchorPrice }); 
//                   }
//               }

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

//                   createSeriesMarkers(textSeries, [{
//                     time: centerTimeSec, 
//                     position: 'inBar', 
//                     color: textColor,
//                     text: typeName,
//                   }]);
//               }
              
//               return; 
//           }

//           // ==========================================
//           // 📏 NORMAL LINES (BOS, CHoCH, IDM, X, BOS(C), X(C))
//           // ==========================================
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          
//           if (!sig.price || isNaN(parseFloat(sig.price))) return; 
//           const linePrice = parseFloat(sig.price);

//           const isBullish = sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER";
//           const safeType = String(sig.type || "");

//           const isMainIDM = safeType === "IDM" || safeType === "IDM(T)";
//           const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
//           const isAnyIDM = isMainIDM || isCounterIDM;

//           let lineColor = "#71717a"; 
          
//           // 🔥 BOS(C) को भी मेन BOS की तरह कलर मिलेगा
//           if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
          
//           if (isAnyIDM) {
//               lineColor = "#9ca3af"; 
//           }

//           // 🔥 X(C) को भी X की तरह कलर मिलेगा
//           if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
//               lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
//           }

//           // 🔥 NAYA: McM(X) के लिए ब्लैक (Black) कलर
//           if (safeType === "McM(X)") {
//               lineColor = "#000000"; // Pure Black
//           }

//           // 🔥 LINE FADE MAGIC: Agar line history ki hai, to uska color halka (RGBA) kar do
//           if (sig.isHistorical) {
//               if (lineColor === "#22c55e") lineColor = "rgba(34, 197, 94, 0.3)"; // Faded Green
//               else if (lineColor === "#ef4444") lineColor = "rgba(239, 68, 68, 0.3)"; // Faded Red
//               else if (lineColor === "#9ca3af") lineColor = "rgba(156, 163, 175, 0.3)"; // Faded Gray
//               else if (lineColor === "#000000") lineColor = "rgba(0, 0, 0, 0.3)"; // 🔥 NAYA: Faded Black
//               else lineColor = "rgba(113, 113, 122, 0.3)";
//           }

//           if (startSec && endSec && startSec < endSec) {
//              const segmentData = [];
             
//              // 🔥 VISUAL CENTER FIX FOR LINES
//              let startIndex = -1;
//              let endIndex = -1;

//              for (let i = 0; i < formattedCandles.length; i++) {
//                  const t = formattedCandles[i].time;
//                  if (t >= startSec && startIndex === -1) startIndex = i;
//                  if (t <= endSec) endIndex = i;
//              }

//              let centerTimeSec = endSec;
//              if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                  // एकदम बीच वाली कैंडल का इंडेक्स निकालो
//                  const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                  centerTimeSec = formattedCandles[centerIndex].time;

//                  for (let i = startIndex; i <= endIndex; i++) {
//                      segmentData.push({ time: formattedCandles[i].time, value: linePrice });
//                  }
//              }

//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: isAnyIDM ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              // 🔥 Text Position Logic
//              let markerPos = "aboveBar"; 
//              // 🔥 NAYA: McM(X) को भी X की तरह प्लेसमेंट मिलेगी
//              if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)" || safeType === "McM(X)") {
//                  markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
//              } else if (safeType === "IDM(S2D)") {
//                  markerPos = "belowBar"; 
//              } else if (safeType === "IDM(D2S)") {
//                  markerPos = "aboveBar"; 
//              } else {
//                  if (sig.trend === "BEARISH" || sig.trend === "BEARISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "belowBar" : "aboveBar";
//                  } else if (sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "aboveBar" : "belowBar";
//                  }
//              }

//              let typeName = sig.displayName || safeType;
             
//              try {
//                  createSeriesMarkers(lineSeries, [{
//                     time: centerTimeSec, 
//                     position: markerPos, 
//                     color: lineColor,
//                     text: typeName,
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
//           // 🔥 .includes() को हटाकर सीधा === यूज़ किया है
//           const isPoiZone = sig.type === "E-OF" || sig.type === "E-OB" || sig.type === "D-OF" || sig.type === "D-OB" || sig.type === "IDM-OF";
//           if (isPoiZone) {
//               const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
//               if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;

//               const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               if (isNaN(topPrice) || isNaN(bottomPrice)) return;

//               const typeName = String(sig.displayName || sig.type || "");

//               // 🔥 1. एकदम साफ़ और अलग-अलग चेक (No .includes!)
//               const isS2D = typeName === "E-S2D(OF)" || typeName === "E-S2D(OB)" || typeName === "D-S2D(OF)" || typeName === "D-S2D(OB)";
//               const isD2S = typeName === "E-D2S(OF)" || typeName === "E-D2S(OB)" || typeName === "D-D2S(OF)" || typeName === "D-D2S(OB)";
//               const isIdmOf = typeName === "IDM OF" || sig.type === "IDM-OF"; // 🔥 NAYA: IDM-OF को पहचानने के लिए

//               // 🔥 THE OPACITY MAGIC: Agar historical hai, to color ko fade kar do
//               let boxColor = "rgba(156, 163, 175, 0.2)"; 
//               let textColor = "#4b5563"; 

//               if (isS2D) {
//                   boxColor = sig.isHistorical ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(30, 58, 138, 0.4)" : "#1e3a8a";
//               } else if (isD2S) {
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(154, 52, 18, 0.4)" : "#9a3412";
//               } else if (isIdmOf) {
//                   // 🔥 NAYA: IDM-OF के लिए ऑरेंज (Orange) कलर
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(194, 65, 12, 0.4)" : "#c2410c"; 
//               } else {
//                   // Main Structure Zones
//                   if (sig.trend === "BULLISH") {
//                       boxColor = "rgba(34, 197, 94, 0.2)"; // 🟢 Green
//                       textColor = "#166534";
//                   } else if (sig.trend === "BEARISH") {
//                       boxColor = "rgba(239, 68, 68, 0.2)"; // 🔴 Red
//                       textColor = "#991b1b";
//                   }
//               }

//               const zoneData = [];
//               const centerData = []; 
//               const textAnchorPrice = topPrice; 
              
//               // 🔥 VISUAL CENTER FIX: Timestamps की जगह Candle Index का इस्तेमाल!
//               let startIndex = -1;
//               let endIndex = -1;

//               for (let i = 0; i < formattedCandles.length; i++) {
//                   const t = formattedCandles[i].time;
//                   if (t >= startSec && startIndex === -1) startIndex = i;
//                   if (t <= endSec) endIndex = i;
//               }

//               let centerTimeSec = endSec;
//               if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                   // एकदम बीच वाली कैंडल का इंडेक्स निकालो
//                   const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                   centerTimeSec = formattedCandles[centerIndex].time;

//                   for (let i = startIndex; i <= endIndex; i++) {
//                       zoneData.push({ time: formattedCandles[i].time, value: topPrice });
//                       centerData.push({ time: formattedCandles[i].time, value: textAnchorPrice }); 
//                   }
//               }

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

//                   createSeriesMarkers(textSeries, [{
//                     time: centerTimeSec, 
//                     position: 'inBar', 
//                     color: textColor,
//                     text: sig.displayName || safeType,
//                   }]);
//               }
              
//               return; 
//           }

//           // ==========================================
//           // 🔥 THE FIX: ANCHOR MARKERS (Circles for Swing HL/LL)
//           // ==========================================
//           if (sig.type === "ANCHOR") {
//               const timeSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               if (!isNaN(timeSec)) {
//                   chartMarkers.push({
//                       time: timeSec,
//                       position: sig.position, // Backend se 'aboveBar' ya 'belowBar' aayega
//                       color: sig.trend === "BULLISH" ? "#2563eb" : "#d97706", // Blue for Bullish, Orange for Bearish
//                       shape: "circle",
//                       text: sig.displayName,
//                   });
//               }
//               return; // 🎯 इसे प्रोसेस करके अगले सिग्नल पर चले जाओ
//           }

//           // ==========================================
//           // 📏 NORMAL LINES (BOS, CHoCH, IDM, X, BOS(C), X(C))
//           // ==========================================
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          
//           if (!sig.price || isNaN(parseFloat(sig.price))) return; 
//           const linePrice = parseFloat(sig.price);

//           const isBullish = sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER";
//           const safeType = String(sig.type || "");

//           const isMainIDM = safeType === "IDM" || safeType === "IDM(T)";
//           const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
//           const isAnyIDM = isMainIDM || isCounterIDM;

//           let lineColor = "#71717a"; 
          
//           // 🔥 BOS(C) को भी मेन BOS की तरह कलर मिलेगा
//           if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
          
//           if (isAnyIDM) {
//               lineColor = "#9ca3af"; 
//           }

//           // 🔥 X(C) को भी X की तरह कलर मिलेगा
//           if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
//               lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
//           }

//           // 🔥 NAYA: McM(X) के लिए ब्लैक (Black) कलर
//           if (safeType === "McM(X)") {
//               lineColor = "#000000"; // Pure Black
//           }

//           // 🔥 LINE FADE MAGIC: Agar line history ki hai, to uska color halka (RGBA) kar do
//           if (sig.isHistorical) {
//               if (lineColor === "#22c55e") lineColor = "rgba(34, 197, 94, 0.3)"; // Faded Green
//               else if (lineColor === "#ef4444") lineColor = "rgba(239, 68, 68, 0.3)"; // Faded Red
//               else if (lineColor === "#9ca3af") lineColor = "rgba(156, 163, 175, 0.3)"; // Faded Gray
//               else if (lineColor === "#000000") lineColor = "rgba(0, 0, 0, 0.3)"; // 🔥 NAYA: Faded Black
//               else lineColor = "rgba(113, 113, 122, 0.3)";
//           }

//           if (startSec && endSec && startSec < endSec) {
//              const segmentData = [];
             
//              // 🔥 VISUAL CENTER FIX FOR LINES
//              let startIndex = -1;
//              let endIndex = -1;

//              for (let i = 0; i < formattedCandles.length; i++) {
//                  const t = formattedCandles[i].time;
//                  if (t >= startSec && startIndex === -1) startIndex = i;
//                  if (t <= endSec) endIndex = i;
//              }

//              let centerTimeSec = endSec;
//              if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                  // एकदम बीच वाली कैंडल का इंडेक्स निकालो
//                  const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                  centerTimeSec = formattedCandles[centerIndex].time;

//                  for (let i = startIndex; i <= endIndex; i++) {
//                      segmentData.push({ time: formattedCandles[i].time, value: linePrice });
//                  }
//              }

//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: isAnyIDM ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              // 🔥 Text Position Logic
//              let markerPos = "aboveBar"; 
//              // 🔥 NAYA: McM(X) को भी X की तरह प्लेसमेंट मिलेगी
//              if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)" || safeType === "McM(X)") {
//                  markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
//              } else if (safeType === "IDM(S2D)") {
//                  markerPos = "belowBar"; 
//              } else if (safeType === "IDM(D2S)") {
//                  markerPos = "aboveBar"; 
//              } else {
//                  if (sig.trend === "BEARISH" || sig.trend === "BEARISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "belowBar" : "aboveBar";
//                  } else if (sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "aboveBar" : "belowBar";
//                  }
//              }

//             let markerShape = "text"; 

//             if (safeType === "ANCHOR") {
//                 markerShape = "circle"; // इसे सर्कल बना देगा
//                 lineColor = sig.trend === "BULLISH" ? "#2563eb" : "#d97706"; // ब्लू और ऑरेंज कलर
//             }
             
//              try {
//                  createSeriesMarkers(lineSeries, [{
//                     time: centerTimeSec, 
//                     position: markerPos, 
//                     color: lineColor,
//                     text: sig.displayName || safeType,
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



// import React, { useEffect, useRef, useState } from "react";
// import { Maximize, Minimize } from "lucide-react"; // 🔥 NAYA: Icons import kiye
// import { createChart, ColorType, CandlestickSeries, LineSeries, BaselineSeries, createSeriesMarkers } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades, theme = "dark" }) => {
//   const chartContainerRef = useRef(null);
//   const [isFullScreen, setIsFullScreen] = useState(false); // 🔥 NAYA: Fullscreen State

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
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: chartContainerRef.current.clientHeight || 450, // 🔥 NAYA: Height अब डायनामिक है!
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
//           const isPoiZone = sig.type === "E-OF" || sig.type === "E-OB" || sig.type === "D-OF" || sig.type === "D-OB" || sig.type === "IDM-OF";
//           if (isPoiZone) {
//               const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
//               if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;

//               const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               if (isNaN(topPrice) || isNaN(bottomPrice)) return;

//               const typeName = String(sig.displayName || sig.type || "");

//               const isS2D = typeName === "E-S2D(OF)" || typeName === "E-S2D(OB)" || typeName === "D-S2D(OF)" || typeName === "D-S2D(OB)";
//               const isD2S = typeName === "E-D2S(OF)" || typeName === "E-D2S(OB)" || typeName === "D-D2S(OF)" || typeName === "D-D2S(OB)";
//               const isIdmOf = typeName === "IDM OF" || sig.type === "IDM-OF"; 

//               let boxColor = "rgba(156, 163, 175, 0.2)"; 
//               let textColor = "#4b5563"; 

//               if (isS2D) {
//                   boxColor = sig.isHistorical ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(30, 58, 138, 0.4)" : "#1e3a8a";
//               } else if (isD2S) {
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(154, 52, 18, 0.4)" : "#9a3412";
//               } else if (isIdmOf) {
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(194, 65, 12, 0.4)" : "#c2410c"; 
//               } else {
//                   if (sig.trend === "BULLISH") {
//                       boxColor = "rgba(34, 197, 94, 0.2)"; // 🟢 Green
//                       textColor = "#166534";
//                   } else if (sig.trend === "BEARISH") {
//                       boxColor = "rgba(239, 68, 68, 0.2)"; // 🔴 Red
//                       textColor = "#991b1b";
//                   }
//               }

//               const zoneData = [];
//               const centerData = []; 
//               const textAnchorPrice = topPrice; 
              
//               let startIndex = -1;
//               let endIndex = -1;

//               for (let i = 0; i < formattedCandles.length; i++) {
//                   const t = formattedCandles[i].time;
//                   if (t >= startSec && startIndex === -1) startIndex = i;
//                   if (t <= endSec) endIndex = i;
//               }

//               let centerTimeSec = endSec;
//               if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                   const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                   centerTimeSec = formattedCandles[centerIndex].time;

//                   for (let i = startIndex; i <= endIndex; i++) {
//                       zoneData.push({ time: formattedCandles[i].time, value: topPrice });
//                       centerData.push({ time: formattedCandles[i].time, value: textAnchorPrice }); 
//                   }
//               }

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

//                   createSeriesMarkers(textSeries, [{
//                     time: centerTimeSec, 
//                     position: 'inBar', 
//                     color: textColor,
//                     text: sig.displayName || safeType,
//                   }]);
//               }
              
//               return; 
//           }

//           // ==========================================
//           // 🔥 ANCHOR MARKERS (Circles for Swing HL/LL)
//           // ==========================================
//           if (sig.type === "ANCHOR") {
//               const timeSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               if (!isNaN(timeSec)) {
//                   chartMarkers.push({
//                       time: timeSec,
//                       position: sig.position, 
//                       color: sig.trend === "BULLISH" ? "#2563eb" : "#d97706", 
//                       shape: "circle",
//                       text: sig.displayName,
//                   });
//               }
//               return; 
//           }

//           // ==========================================
//           // 📏 NORMAL LINES (BOS, CHoCH, IDM, X, BOS(C), X(C))
//           // ==========================================
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          
//           if (!sig.price || isNaN(parseFloat(sig.price))) return; 
//           const linePrice = parseFloat(sig.price);

//           const isBullish = sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER";
//           const safeType = String(sig.type || "");

//           const isMainIDM = safeType === "IDM" || safeType === "IDM(T)";
//           const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
//           const isAnyIDM = isMainIDM || isCounterIDM;

//           let lineColor = "#71717a"; 
          
//           if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
          
//           if (isAnyIDM) {
//               lineColor = "#9ca3af"; 
//           }

//           if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
//               lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
//           }

//           if (safeType === "McM(X)") {
//               lineColor = "#000000"; 
//           }

//           if (sig.isHistorical) {
//               if (lineColor === "#22c55e") lineColor = "rgba(34, 197, 94, 0.3)"; 
//               else if (lineColor === "#ef4444") lineColor = "rgba(239, 68, 68, 0.3)"; 
//               else if (lineColor === "#9ca3af") lineColor = "rgba(156, 163, 175, 0.3)"; 
//               else if (lineColor === "#000000") lineColor = "rgba(0, 0, 0, 0.3)"; 
//               else lineColor = "rgba(113, 113, 122, 0.3)";
//           }

//           if (startSec && endSec && startSec < endSec) {
//              const segmentData = [];
             
//              let startIndex = -1;
//              let endIndex = -1;

//              for (let i = 0; i < formattedCandles.length; i++) {
//                  const t = formattedCandles[i].time;
//                  if (t >= startSec && startIndex === -1) startIndex = i;
//                  if (t <= endSec) endIndex = i;
//              }

//              let centerTimeSec = endSec;
//              if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                  const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                  centerTimeSec = formattedCandles[centerIndex].time;

//                  for (let i = startIndex; i <= endIndex; i++) {
//                      segmentData.push({ time: formattedCandles[i].time, value: linePrice });
//                  }
//              }

//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: isAnyIDM ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              let markerPos = "aboveBar"; 
//              if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)" || safeType === "McM(X)") {
//                  markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
//              } else if (safeType === "IDM(S2D)") {
//                  markerPos = "belowBar"; 
//              } else if (safeType === "IDM(D2S)") {
//                  markerPos = "aboveBar"; 
//              } else {
//                  if (sig.trend === "BEARISH" || sig.trend === "BEARISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "belowBar" : "aboveBar";
//                  } else if (sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "aboveBar" : "belowBar";
//                  }
//              }

//             let markerShape = "text"; 

//             if (safeType === "ANCHOR") {
//                 markerShape = "circle"; 
//                 lineColor = sig.trend === "BULLISH" ? "#2563eb" : "#d97706"; 
//             }
             
//              try {
//                  createSeriesMarkers(lineSeries, [{
//                     time: centerTimeSec, 
//                     position: markerPos, 
//                     color: lineColor,
//                     text: sig.displayName || safeType,
//                  }]);
//              } catch(err) {
//                  console.log("Marker render skipped for:", safeType);
//              }
//           }
//         });
//       }

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
//   }, [candleData, smcSignals, executedTrades, theme, isFullScreen]); // 🔥 NAYA: isFullScreen को dependency array में ऐड किया

//   // 🔥 NAYA: UI Wrapper with Tailwind Classes for Full Screen
//   return (
//     <div
//       className={
//         isFullScreen
//           ? `fixed inset-0 z-[9999] w-screen h-screen p-4 ${theme === 'light' ? 'bg-white' : 'bg-[#0b0f19]'}`
//           : "relative w-full h-[450px]"
//       }
//     >
//       {/* 🔘 THE FULLSCREEN TOGGLE BUTTON */}
//       <button
//         onClick={() => setIsFullScreen(!isFullScreen)}
//         className="absolute top-6 right-6 z-10 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg transition-all duration-300 flex items-center justify-center opacity-80 hover:opacity-100"
//         title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
//       >
//         {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
//       </button>

//       {/* 📈 THE ACTUAL CHART CONTAINER */}
//       <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
//     </div>
//   );
// };

// export default VisualDebuggerChart;


// import React, { useEffect, useRef, useState } from "react";
// import { Maximize, Minimize } from "lucide-react"; 
// import { createChart, ColorType, CandlestickSeries, LineSeries, BaselineSeries, createSeriesMarkers } from "lightweight-charts";

// // 🔥 THE FIX: isReplayMode को props में रिसीव किया
// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades, theme = "dark", isReplayMode = false }) => {
//   const chartContainerRef = useRef(null);
//   const [isFullScreen, setIsFullScreen] = useState(false); 

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     // ==========================================
//     // 🎨 THEME LOGIC
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

//     // 1. Chart Initialization
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: chartContainerRef.current.clientHeight || 450, 
//       layout: activeTheme.layout,
//       grid: activeTheme.grid,    
//       timeScale: {
//           timeVisible: true,     
//           secondsVisible: false, 
//       },
//     });

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

//       // 2. SMC Signals Mapping
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
          
//           // 🟩 POI ZONES RECTANGLES
//           const isPoiZone = sig.type === "E-OF" || sig.type === "E-OB" || sig.type === "D-OF" || sig.type === "D-OB" || sig.type === "IDM-OF";
//           if (isPoiZone) {
//               const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
//               if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;

//               const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
//               if (isNaN(topPrice) || isNaN(bottomPrice)) return;

//               const typeName = String(sig.displayName || sig.type || "");

//               const isS2D = typeName === "E-S2D(OF)" || typeName === "E-S2D(OB)" || typeName === "D-S2D(OF)" || typeName === "D-S2D(OB)";
//               const isD2S = typeName === "E-D2S(OF)" || typeName === "E-D2S(OB)" || typeName === "D-D2S(OF)" || typeName === "D-D2S(OB)";
//               const isIdmOf = typeName === "IDM OF" || sig.type === "IDM-OF"; 

//               let boxColor = "rgba(156, 163, 175, 0.2)"; 
//               let textColor = "#4b5563"; 

//               if (isS2D) {
//                   boxColor = sig.isHistorical ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(30, 58, 138, 0.4)" : "#1e3a8a";
//               } else if (isD2S) {
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(154, 52, 18, 0.4)" : "#9a3412";
//               } else if (isIdmOf) {
//                   boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
//                   textColor = sig.isHistorical ? "rgba(194, 65, 12, 0.4)" : "#c2410c"; 
//               } else {
//                   if (sig.trend === "BULLISH") {
//                       boxColor = "rgba(34, 197, 94, 0.2)"; 
//                       textColor = "#166534";
//                   } else if (sig.trend === "BEARISH") {
//                       boxColor = "rgba(239, 68, 68, 0.2)"; 
//                       textColor = "#991b1b";
//                   }
//               }

//               const zoneData = [];
//               const centerData = []; 
//               const textAnchorPrice = topPrice; 
              
//               let startIndex = -1;
//               let endIndex = -1;

//               for (let i = 0; i < formattedCandles.length; i++) {
//                   const t = formattedCandles[i].time;
//                   if (t >= startSec && startIndex === -1) startIndex = i;
//                   if (t <= endSec) endIndex = i;
//               }

//               let centerTimeSec = endSec;
//               if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                   const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                   centerTimeSec = formattedCandles[centerIndex].time;

//                   for (let i = startIndex; i <= endIndex; i++) {
//                       zoneData.push({ time: formattedCandles[i].time, value: topPrice });
//                       centerData.push({ time: formattedCandles[i].time, value: textAnchorPrice }); 
//                   }
//               }

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

//                   createSeriesMarkers(textSeries, [{
//                     time: centerTimeSec, 
//                     position: 'inBar', 
//                     color: textColor,
//                     text: sig.displayName || safeType,
//                   }]);
//               }
//               return; 
//           }

//           // 🔥 ANCHOR MARKERS
//           if (sig.type === "ANCHOR") {
//               const timeSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//               if (!isNaN(timeSec)) {
//                   chartMarkers.push({
//                       time: timeSec,
//                       position: sig.position, 
//                       color: sig.trend === "BULLISH" ? "#2563eb" : "#d97706", 
//                       shape: "circle",
//                       text: sig.displayName,
//                   });
//               }
//               return; 
//           }

//           // 📏 NORMAL LINES
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          
//           if (!sig.price || isNaN(parseFloat(sig.price))) return; 
//           const linePrice = parseFloat(sig.price);

//           const isBullish = sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER";
//           const safeType = String(sig.type || "");

//           const isMainIDM = safeType === "IDM" || safeType === "IDM(T)";
//           const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
//           const isAnyIDM = isMainIDM || isCounterIDM;

//           let lineColor = "#71717a"; 
          
//           if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
          
//           if (isAnyIDM) {
//               lineColor = "#9ca3af"; 
//           }

//           if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") {
//               lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
//           }

//           if (safeType === "McM(X)") {
//               lineColor = "#000000"; 
//           }

//           if (sig.isHistorical) {
//               if (lineColor === "#22c55e") lineColor = "rgba(34, 197, 94, 0.3)"; 
//               else if (lineColor === "#ef4444") lineColor = "rgba(239, 68, 68, 0.3)"; 
//               else if (lineColor === "#9ca3af") lineColor = "rgba(156, 163, 175, 0.3)"; 
//               else if (lineColor === "#000000") lineColor = "rgba(0, 0, 0, 0.3)"; 
//               else lineColor = "rgba(113, 113, 122, 0.3)";
//           }

//           if (startSec && endSec && startSec < endSec) {
//              const segmentData = [];
//              let startIndex = -1;
//              let endIndex = -1;

//              for (let i = 0; i < formattedCandles.length; i++) {
//                  const t = formattedCandles[i].time;
//                  if (t >= startSec && startIndex === -1) startIndex = i;
//                  if (t <= endSec) endIndex = i;
//              }

//              let centerTimeSec = endSec;
//              if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
//                  const centerIndex = Math.floor((startIndex + endIndex) / 2);
//                  centerTimeSec = formattedCandles[centerIndex].time;

//                  for (let i = startIndex; i <= endIndex; i++) {
//                      segmentData.push({ time: formattedCandles[i].time, value: linePrice });
//                  }
//              }

//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: isAnyIDM ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              let markerPos = "aboveBar"; 
//              if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)" || safeType === "McM(X)") {
//                  markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
//              } else if (safeType === "IDM(S2D)") {
//                  markerPos = "belowBar"; 
//              } else if (safeType === "IDM(D2S)") {
//                  markerPos = "aboveBar"; 
//              } else {
//                  if (sig.trend === "BEARISH" || sig.trend === "BEARISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "belowBar" : "aboveBar";
//                  } else if (sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER") {
//                      markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "aboveBar" : "belowBar";
//                  }
//              }
             
//              try {
//                  createSeriesMarkers(lineSeries, [{
//                     time: centerTimeSec, 
//                     position: markerPos, 
//                     color: lineColor,
//                     text: sig.displayName || safeType,
//                  }]);
//              } catch(err) {}
//           }
//         });
//       }

//       // 3. Executed Trades
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

//       // =========================================================================
//       // 🔥 THE SMART AUTO-SCROLL ZOOM LOGIC 🔥
//       // =========================================================================
//       const totalCandles = formattedCandles.length;

//       if (isReplayMode) {
//           // 🎬 Replay Mode: सिर्फ आख़िरी 120 कैंडल दिखाओ और साथ-साथ खिसकाते रहो
//           chart.timeScale().setVisibleLogicalRange({
//               from: Math.max(0, totalCandles - 120),
//               to: totalCandles + 5 // राइट साइड में 5 कैंडल की खाली जगह ताकि अच्छा लगे
//           });
//       } else {
//           // 📊 Normal Mode: अगर कैंडल बहुत ज़्यादा हैं, तो सिकुड़ने मत दो
//           if (totalCandles > 400) {
//               chart.timeScale().setVisibleLogicalRange({
//                   from: Math.max(0, totalCandles - 300), // बाय-डिफ़ॉल्ट आख़िरी 300 कैंडल पर ज़ूम रखो
//                   to: totalCandles + 15
//               });
//           } else {
//               // अगर कम डेटा है, तो सबको फिट कर दो
//               chart.timeScale().fitContent();
//           }
//       }
//       // =========================================================================
//     }

//     return () => chart.remove();
//   }, [candleData, smcSignals, executedTrades, theme, isFullScreen, isReplayMode]); // 🔥 isReplayMode dependency में जोड़ा

//   return (
//     <div
//       className={
//         isFullScreen
//           ? `fixed inset-0 z-[9999] w-screen h-screen p-4 ${theme === 'light' ? 'bg-white' : 'bg-[#0b0f19]'}`
//           : "relative w-full h-[450px]"
//       }
//     >
//       <button
//         onClick={() => setIsFullScreen(!isFullScreen)}
//         className="absolute top-6 right-6 z-10 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg transition-all duration-300 flex items-center justify-center opacity-80 hover:opacity-100"
//         title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
//       >
//         {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
//       </button>

//       <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
//     </div>
//   );
// };

// export default VisualDebuggerChart;





import React, { useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react"; 
import { createChart, ColorType, CandlestickSeries, LineSeries, BaselineSeries, createSeriesMarkers } from "lightweight-charts";

// 🔥 props में isSelectingStartPoint, onChartClick रिसीव किया
const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades, theme = "dark", isReplayMode = false, isSelectingStartPoint = false, onChartClick }) => {
  const chartContainerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false); 

  // 🔥 refs use करेंगे click callback के अंदर props की लेटेस्ट वैल्यू पाने के लिए
  const onChartClickRef = useRef(onChartClick);
  const isSelectingStartPointRef = useRef(isSelectingStartPoint);

  // 🔥 refs को sync करो Props के साथ
  useEffect(() => {
    onChartClickRef.current = onChartClick;
    isSelectingStartPointRef.current = isSelectingStartPoint;
  }, [onChartClick, isSelectingStartPoint]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // ==========================================
    // 🎨 THEME LOGIC
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

    // 1. Chart Initialization
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 800,
      height: chartContainerRef.current.clientHeight || 450, 
      layout: activeTheme.layout,
      grid: activeTheme.grid,    
      timeScale: {
          timeVisible: true,     
          secondsVisible: false, 
      },
    });

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

      // ==========================================
      // 📊 SMC & Trades Rendering Logic (Unchanged)
      // ==========================================
      if (smcSignals?.length > 0) {
        smcSignals.forEach((sig) => {
          const isPoiZone = sig.type === "E-OF" || sig.type === "E-OB" || sig.type === "D-OF" || sig.type === "D-OB" || sig.type === "IDM-OF";
          if (isPoiZone) {
              const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
              const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
              
              if (!startSec || !endSec || isNaN(startSec) || isNaN(endSec)) return;
              const topPrice = Math.max(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
              const bottomPrice = Math.min(parseFloat(sig.priceTop), parseFloat(sig.priceBottom));
              if (isNaN(topPrice) || isNaN(bottomPrice)) return;

              const typeName = String(sig.displayName || sig.type || "");
              const isS2D = typeName === "E-S2D(OF)" || typeName === "E-S2D(OB)" || typeName === "D-S2D(OF)" || typeName === "D-S2D(OB)";
              const isD2S = typeName === "E-D2S(OF)" || typeName === "E-D2S(OB)" || typeName === "D-D2S(OF)" || typeName === "D-D2S(OB)";
              const isIdmOf = typeName === "IDM OF" || sig.type === "IDM-OF"; 

              let boxColor = "rgba(156, 163, 175, 0.2)"; 
              let textColor = "#4b5563"; 

              if (isS2D) {
                  boxColor = sig.isHistorical ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.2)"; 
                  textColor = sig.isHistorical ? "rgba(30, 58, 138, 0.4)" : "#1e3a8a";
              } else if (isD2S) {
                  boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
                  textColor = sig.isHistorical ? "rgba(154, 52, 18, 0.4)" : "#9a3412";
              } else if (isIdmOf) {
                  boxColor = sig.isHistorical ? "rgba(249, 115, 22, 0.05)" : "rgba(249, 115, 22, 0.2)"; 
                  textColor = sig.isHistorical ? "rgba(194, 65, 12, 0.4)" : "#c2410c"; 
              } else {
                  if (sig.trend === "BULLISH") {
                      boxColor = "rgba(34, 197, 94, 0.2)"; 
                      textColor = "#166534";
                  } else if (sig.trend === "BEARISH") {
                      boxColor = "rgba(239, 68, 68, 0.2)"; 
                      textColor = "#991b1b";
                  }
              }

              const zoneData = [];
              const centerData = []; 
              const textAnchorPrice = (topPrice + bottomPrice) / 2; 
              
              let startIndex = -1;
              let endIndex = -1;

              for (let i = 0; i < formattedCandles.length; i++) {
                  const t = formattedCandles[i].time;
                  if (t >= startSec && startIndex === -1) startIndex = i;
                  if (t <= endSec) endIndex = i;
              }

              let centerTimeSec = endSec;
              if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
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
                    text: sig.displayName || safeType,
                  }]);
              }
              return; 
          }

          if (sig.type === "ANCHOR") {
              const timeSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
              if (!isNaN(timeSec)) {
                  chartMarkers.push({
                      time: timeSec,
                      position: sig.position, 
                      color: sig.trend === "BULLISH" ? "#2563eb" : "#d97706", 
                      shape: "circle",
                      text: sig.displayName,
                  });
              }
              return; 
          }

          const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
          const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          if (!sig.price || isNaN(parseFloat(sig.price))) return; 
          const linePrice = parseFloat(sig.price);
          const isBullish = sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER";
          const safeType = String(sig.type || "");
          const isMainIDM = safeType === "IDM" || safeType === "IDM(T)";
          const isCounterIDM = safeType === "IDM(S2D)" || safeType === "IDM(D2S)";
          const isAnyIDM = isMainIDM || isCounterIDM;
          let lineColor = "#71717a"; 
          
          if (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") {
              lineColor = isBullish ? "#22c55e" : "#ef4444"; 
          }
          if (isAnyIDM) { lineColor = "#9ca3af"; }
          if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)") { lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; }
          if (safeType === "McM(X)") { lineColor = "#000000"; }
          if (sig.isHistorical) {
              if (lineColor === "#22c55e") lineColor = "rgba(34, 197, 94, 0.3)"; 
              else if (lineColor === "#ef4444") lineColor = "rgba(239, 68, 68, 0.3)"; 
              else if (lineColor === "#9ca3af") lineColor = "rgba(156, 163, 175, 0.3)"; 
              else if (lineColor === "#000000") lineColor = "rgba(0, 0, 0, 0.3)"; 
              else lineColor = "rgba(113, 113, 122, 0.3)";
          }

          if (startSec && endSec && startSec < endSec) {
             const segmentData = [];
             let startIndex = -1, endIndex = -1;
             for (let i = 0; i < formattedCandles.length; i++) {
                 const t = formattedCandles[i].time;
                 if (t >= startSec && startIndex === -1) startIndex = i;
                 if (t <= endSec) endIndex = i;
             }
             let centerTimeSec = endSec;
             if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
                 const centerIndex = Math.floor((startIndex + endIndex) / 2);
                 centerTimeSec = formattedCandles[centerIndex].time;
                 for (let i = startIndex; i <= endIndex; i++) { segmentData.push({ time: formattedCandles[i].time, value: linePrice }); }
             }
             const lineSeries = chart.addSeries(LineSeries, { color: lineColor, lineWidth: 2, lineStyle: isAnyIDM ? 1 : 2, crosshairMarkerVisible: false, lastValueVisible: false, priceLineVisible: false });
             if (segmentData.length > 0) { lineSeries.setData(segmentData); }

             let markerPos = "aboveBar"; 
             if (safeType === "X" || safeType === "Ref X" || safeType === "X(C)" || safeType === "McM(X)") { markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar"; } 
             else if (safeType === "IDM(S2D)") { markerPos = "belowBar"; } 
             else if (safeType === "IDM(D2S)") { markerPos = "aboveBar"; } 
             else {
                 if (sig.trend === "BEARISH" || sig.trend === "BEARISH_COUNTER") { markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "belowBar" : "aboveBar"; } 
                 else if (sig.trend === "BULLISH" || sig.trend === "BULLISH_COUNTER") { markerPos = (safeType === "BOS" || safeType === "CHoCH" || safeType === "BOS(C)") ? "aboveBar" : "belowBar"; }
             }
             try { createSeriesMarkers(lineSeries, [{ time: centerTimeSec, position: markerPos, color: lineColor, text: sig.displayName || safeType }]); } catch(err) {}
          }
        });
      }

      if (executedTrades?.length > 0) {
        executedTrades.forEach((trade) => {
          const entryTime = Math.floor(new Date(trade.entryTime).getTime() / 1000) + 19800;
          if(!isNaN(entryTime)) {
             chartMarkers.push({ time: entryTime, position: trade.transaction === "BUY" ? "belowBar" : "aboveBar", color: "#2563eb", shape: "circle", text: `Trade: ${trade.transaction}` });
          }
        });
      }
      if (chartMarkers.length > 0) { createSeriesMarkers(mainSeries, chartMarkers); }

      // ==========================================
      // 🔭 THE SMART AUTO-SCROLL ZOOM LOGIC 🔭
      // ==========================================
      const totalCandles = formattedCandles.length;

      // 🔥 THE FIX: अगर 'कैंची' (Trim Mode) ऑन है, तो हम ज़ूम को लॉक नहीं करेंगे! 
      // चार्ट पूरी तरह यूज़र के कंट्रोल में रहेगा ताकि वो माउस से ज़ूम-इन/ज़ूम-आउट करके डेट ढूँढ सके।
      if (!isSelectingStartPointRef.current) { 
          if (isReplayMode) {
              // 🎬 Replay Mode (Playing/Paused): आख़िरी 120 कैंडल दिखाओ और साथ-साथ खिसकाते रहो
              chart.timeScale().setVisibleLogicalRange({ 
                  from: Math.max(0, totalCandles - 120), 
                  to: totalCandles + 5 
              });
          } else {
              // 📊 Normal Mode:
              if (totalCandles > 400) {
                  // कैंडल ज़्यादा हैं तो सिकुड़ने मत दो, बस आख़िरी 300 दिखाओ
                  chart.timeScale().setVisibleLogicalRange({ 
                      from: Math.max(0, totalCandles - 300), 
                      to: totalCandles + 15 
                  });
              } else { 
                  chart.timeScale().fitContent(); 
              }
          }
      }

      // ==========================================
      // 🖱️ THE FIX: CLICK TO CUT ENGINE 🔥
      // ==========================================
      chart.subscribeClick((param) => {
          // 1. Check if user is in 'Scissors/Select' mode and clicked on a valid data point
          if (isSelectingStartPointRef.current && param.time && onChartClickRef.current) {
              
              // 2. We get chart time (seconds), the main series gives us the data object for that time
              const candleDataPoint = param.seriesData.get(mainSeries);
              
              if(candleDataPoint) {
                  // 3. हम पैरेंट फ़ाइल को वापस भेज देंगे कि यूज़र ने इस कैंडल (टाइम) पर क्लिक किया है
                  // हम क्लिक किया हुआ 'seconds' टाइम वापस भेजेंगे क्योंकि पैरेंट पूरे डेटा में सर्च करेगा
                  onChartClickRef.current(param.time);
              }
          }
      });
      // ==========================================
    }

    return () => chart.remove();
  }, [candleData, smcSignals, executedTrades, theme, isFullScreen, isReplayMode]); // 🔥 No dependency needed for subscribeClick as callback uses Ref

  return (
    <div
      className={
        isFullScreen
          ? `fixed inset-0 z-[9999] w-screen h-screen p-4 ${theme === 'light' ? 'bg-white' : 'bg-[#0b0f19]'}`
          : "relative w-full h-[450px]"
      }
      // 🔥 THE FIX: जब कैंची वाला मोड ON होगा, तब क्रॉसहेयर (Scissors) कर्सर दिखाओ
      style={{ cursor: isSelectingStartPoint ? 'crosshair' : 'default' }}
    >
      <button
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="absolute top-6 right-6 z-10 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg transition-all duration-300 flex items-center justify-center opacity-80 hover:opacity-100"
        title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
      >
        {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default VisualDebuggerChart;