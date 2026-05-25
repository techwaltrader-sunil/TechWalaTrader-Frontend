// import React, { useEffect, useRef } from "react";
// // v5.2.0 के लिए सही इम्पोर्ट्स
// import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades }) => {
//   const chartContainerRef = useRef(null);
//   const chartInstance = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     // चार्ट इनिशियलाइज़ करें
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
//       grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
//     });
    
//     chartInstance.current = chart;

//     // 🔥 v5.2.0 का सही तरीका: chart.addSeries का उपयोग करें
//     const series = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e",
//       downColor: "#ef4444",
//       wickUpColor: "#22c55e",
//       wickDownColor: "#ef4444",
//     });

//     // डेटा को सुरक्षित तरीके से रेंडर करें
//     if (candleData && candleData.length > 0) {
//       const formattedCandles = candleData.map((c) => ({
//         time: Math.floor(new Date(c.timestamp).getTime() / 1000),
//         open: parseFloat(c.open),
//         high: parseFloat(c.high),
//         low: parseFloat(c.low),
//         close: parseFloat(c.close),
//       })).sort((a, b) => a.time - b.time);
      
//       series.setData(formattedCandles);
//     }

//     chart.timeScale().fitContent();

//     return () => {
//       chart.remove();
//     };
//   }, [candleData]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default VisualDebuggerChart;




// import React, { useEffect, useRef } from "react";
// // 🔥 createSeriesMarkers ko yaha import karein
// import { createChart, ColorType, CandlestickSeries, createSeriesMarkers } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades }) => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
//       grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
//     });

//     const series = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e", downColor: "#ef4444",
//       wickUpColor: "#22c55e", wickDownColor: "#ef4444",
//     });

//     if (candleData?.length > 0) {
//       const formattedCandles = candleData.map((c) => ({
//         time: Math.floor(new Date(c.timestamp).getTime() / 1000),
//         open: parseFloat(c.open),
//         high: parseFloat(c.high),
//         low: parseFloat(c.low),
//         close: parseFloat(c.close),
//       })).sort((a, b) => a.time - b.time);
      
//       series.setData(formattedCandles);

//       // 🔥 FIX: v5.0+ method: createSeriesMarkers(series, markers)
//       let chartMarkers = [];
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
//           chartMarkers.push({
//             time: Math.floor(new Date(sig.timestamp).getTime() / 1000),
//             position: sig.trend === "BULLISH" ? "belowBar" : "aboveBar",
//             color: sig.type === "CHoCH" ? "#eab308" : (sig.trend === "BULLISH" ? "#22c55e" : "#ef4444"),
//             shape: sig.type === "CHoCH" ? "circle" : "arrowDown",
//             text: sig.type,
//           });
//         });
//       }

//       if (chartMarkers.length > 0) {
//         // Yaha hum series.setMarkers() ki jagah ye use karenge:
//         createSeriesMarkers(series, chartMarkers);
//       }
//     }

//     chart.timeScale().fitContent();

//     return () => chart.remove();
//   }, [candleData, smcSignals]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default VisualDebuggerChart;


// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades }) => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     // 1. चार्ट को इनिशियलाइज़ करें
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
//       grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
//     });

//     // 2. मेन कैंडलस्टिक सीरीज़ बनाएं
//     const mainSeries = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e", downColor: "#ef4444",
//       wickUpColor: "#22c55e", wickDownColor: "#ef4444",
//     });

//     if (candleData?.length > 0) {
//       const formattedCandles = candleData.map((c) => ({
//         time: Math.floor(new Date(c.timestamp).getTime() / 1000),
//         open: parseFloat(c.open),
//         high: parseFloat(c.high),
//         low: parseFloat(c.low),
//         close: parseFloat(c.close),
//       })).sort((a, b) => a.time - b.time);
      
//       mainSeries.setData(formattedCandles);

//       let chartMarkers = [];

//       // 3. SMC सिग्नल्स (Segment Lines + Centered Markers)
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000);
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000);
//           const isBullish = sig.trend === "BULLISH";

//           // कलर सेटिंग्स
//           let lineColor = "#71717a"; 
//           if (sig.type === "BOS") lineColor = isBullish ? "#22c55e" : "#ef4444";
//           if (sig.type === "CHoCH") lineColor = "#eab308";
//           if (sig.type === "IDM") lineColor = "#9ca3af";

//           if (startSec && endSec && !isNaN(startSec) && !isNaN(endSec) && startSec < endSec) {
//              // A. Segment Line बनाना
//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: sig.type === "IDM" ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              lineSeries.setData([
//                  { time: startSec, value: parseFloat(sig.price) },
//                  { time: endSec, value: parseFloat(sig.price) }
//              ]);

//              // 🔥 B. टेक्स्ट को सेंटर में लाने का लॉजिक (Midpoint Calculation)
//              // पहले start और end कैंडल का इंडेक्स निकालें
//              const startIndex = formattedCandles.findIndex(c => c.time === startSec);
//              const endIndex = formattedCandles.findIndex(c => c.time === endSec);

//              let markerTimeSec = endSec; // डिफ़ॉल्ट (अगर कुछ गड़बड़ हो)
             
//              if (startIndex !== -1 && endIndex !== -1) {
//                  // बिल्कुल बीच वाली कैंडल का इंडेक्स निकालें
//                  const midIndex = Math.floor((startIndex + endIndex) / 2);
//                  markerTimeSec = formattedCandles[midIndex].time;
//              }

//              // C. मार्कर (बीच वाली कैंडल पर)
//              chartMarkers.push({
//                 time: markerTimeSec, // अब ये ब्रेकआउट पर नहीं, लाइन के बीच में दिखेगा!
//                 position: isBullish ? "belowBar" : "aboveBar",
//                 color: lineColor,
//                 // 'arrow' की जगह 'circle' यूज़ कर रहे हैं ताकि वो बस एक छोटे डॉट जैसा दिखे और टेक्स्ट फोकस में रहे
//                 shape: "circle", 
//                 text: sig.type,
//              });
//           }
//         });
//       }

//       // 4. एग्जीक्यूटेड ट्रेड्स के लिए मार्कर्स
//       if (executedTrades?.length > 0) {
//         executedTrades.forEach((trade) => {
//           const entryTime = Math.floor(new Date(trade.entryTime).getTime() / 1000);
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
//   }, [candleData, smcSignals, executedTrades]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default VisualDebuggerChart;



// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades }) => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     // 1. चार्ट को इनिशियलाइज़ करें
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
//       grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
//     });

//     // 2. मेन कैंडलस्टिक सीरीज़ बनाएं
//     const mainSeries = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e", downColor: "#ef4444",
//       wickUpColor: "#22c55e", wickDownColor: "#ef4444",
//     });

//     if (candleData?.length > 0) {
//       const formattedCandles = candleData.map((c) => ({
//         time: Math.floor(new Date(c.timestamp).getTime() / 1000),
//         open: parseFloat(c.open),
//         high: parseFloat(c.high),
//         low: parseFloat(c.low),
//         close: parseFloat(c.close),
//       })).sort((a, b) => a.time - b.time);
      
//       mainSeries.setData(formattedCandles);

//       let chartMarkers = [];

//       // 3. SMC सिग्नल्स (Segment Lines + Centered Markers)
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000);
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000);
//           const isBullish = sig.trend === "BULLISH";

//           // कलर सेटिंग्स
//           let lineColor = "#71717a"; 
//           if (sig.type === "BOS") lineColor = isBullish ? "#22c55e" : "#ef4444";
//           if (sig.type === "CHoCH") lineColor = "#eab308";
//           if (sig.type === "IDM") lineColor = "#9ca3af";

//           if (startSec && endSec && !isNaN(startSec) && !isNaN(endSec) && startSec < endSec) {
//              // A. Segment Line बनाना
//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: sig.type === "IDM" ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              lineSeries.setData([
//                  { time: startSec, value: parseFloat(sig.price) },
//                  { time: endSec, value: parseFloat(sig.price) }
//              ]);

             

//              // 🔥 B. टेक्स्ट को सेंटर में लाने का लॉजिक (Midpoint Calculation)
//              // पहले start और end कैंडल का इंडेक्स निकालें
//              const startIndex = formattedCandles.findIndex(c => c.time === startSec);
//              const endIndex = formattedCandles.findIndex(c => c.time === endSec);

//              let markerTimeSec = endSec; // डिफ़ॉल्ट (अगर कुछ गड़बड़ हो)
             
//              if (startIndex !== -1 && endIndex !== -1) {
//                  // बिल्कुल बीच वाली कैंडल का इंडेक्स निकालें
//                  const midIndex = Math.floor((startIndex + endIndex) / 2);
//                  markerTimeSec = formattedCandles[midIndex].time;
//              }

//              // 🔥 1. एकदम सटीक पोजीशन का लॉजिक (Bearish/Bullish के रूल्स)
//              let markerPos = "aboveBar"; // डिफ़ॉल्ट
             
//              if (sig.trend === "BEARISH") {
//                  // Bearish में: BOS कैंडल के नीचे, IDM कैंडल के ऊपर
//                  markerPos = sig.type === "BOS" ? "belowBar" : "aboveBar";
//              } else if (sig.trend === "BULLISH") {
//                  // Bullish में: BOS कैंडल के ऊपर, IDM कैंडल के नीचे
//                  markerPos = sig.type === "BOS" ? "aboveBar" : "belowBar";
//              }

//              // 🔥 2. मार्कर को ठीक ब्रेकआउट पॉइंट (endSec) पर लगाना
//              chartMarkers.push({
//                 time: endSec,  // <-- मिडपॉइंट हटा दिया, अब सीधे ब्रेकआउट कैंडल पर!
//                 position: markerPos, 
//                 color: lineColor,
//                 shape: "circle", // ये वो सबसे छोटा डॉट है जो टेक्स्ट को होल्ड करेगा
//                 text: sig.type,
//              });
//           }
//         });
//       }

//       // 4. एग्जीक्यूटेड ट्रेड्स के लिए मार्कर्स
//       if (executedTrades?.length > 0) {
//         executedTrades.forEach((trade) => {
//           const entryTime = Math.floor(new Date(trade.entryTime).getTime() / 1000);
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
//   }, [candleData, smcSignals, executedTrades]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default VisualDebuggerChart;





// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades }) => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     // 1. चार्ट को इनिशियलाइज़ करें
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
//       grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
//     });

//     // 2. मेन कैंडलस्टिक सीरीज़ बनाएं
//     const mainSeries = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e", downColor: "#ef4444",
//       wickUpColor: "#22c55e", wickDownColor: "#ef4444",
//     });

//     if (candleData?.length > 0) {
//       const formattedCandles = candleData.map((c) => ({
//         time: Math.floor(new Date(c.timestamp).getTime() / 1000),
//         open: parseFloat(c.open),
//         high: parseFloat(c.high),
//         low: parseFloat(c.low),
//         close: parseFloat(c.close),
//       })).sort((a, b) => a.time - b.time);
      
//       mainSeries.setData(formattedCandles);

//       let chartMarkers = [];

//       // 3. SMC सिग्नल्स (Segment Lines + Centered Markers)
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000);
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000);
//           const isBullish = sig.trend === "BULLISH";

//           // कलर सेटिंग्स
//           let lineColor = "#71717a"; 
//           if (sig.type === "BOS") lineColor = isBullish ? "#22c55e" : "#ef4444";
//           if (sig.type === "CHoCH") lineColor = "#eab308";
//           if (sig.type === "IDM") lineColor = "#9ca3af";

//           if (startSec && endSec && !isNaN(startSec) && !isNaN(endSec) && startSec < endSec) {
//              // A. Segment Line बनाना
//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: sig.type === "IDM" ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              lineSeries.setData([
//                  { time: startSec, value: parseFloat(sig.price) },
//                  { time: endSec, value: parseFloat(sig.price) }
//              ]);

             

//              // 🔥 B. टेक्स्ट को सेंटर में लाने का लॉजिक (Midpoint Calculation)
//              // पहले start और end कैंडल का इंडेक्स निकालें
//              const startIndex = formattedCandles.findIndex(c => c.time === startSec);
//              const endIndex = formattedCandles.findIndex(c => c.time === endSec);

//              let markerTimeSec = endSec; // डिफ़ॉल्ट (अगर कुछ गड़बड़ हो)
             
//              if (startIndex !== -1 && endIndex !== -1) {
//                  // बिल्कुल बीच वाली कैंडल का इंडेक्स निकालें
//                  const midIndex = Math.floor((startIndex + endIndex) / 2);
//                  markerTimeSec = formattedCandles[midIndex].time;
//              }

//              // 🔥 1. एकदम सटीक पोजीशन का लॉजिक (Bearish/Bullish के रूल्स)
//              let markerPos = "aboveBar"; // डिफ़ॉल्ट
             
//              if (sig.trend === "BEARISH") {
//                  // Bearish में: BOS कैंडल के नीचे, IDM कैंडल के ऊपर
//                  markerPos = sig.type === "BOS" ? "belowBar" : "aboveBar";
//              } else if (sig.trend === "BULLISH") {
//                  // Bullish में: BOS कैंडल के ऊपर, IDM कैंडल के नीचे
//                  markerPos = sig.type === "BOS" ? "aboveBar" : "belowBar";
//              }

//              // 🔥 2. मार्कर को ठीक ब्रेकआउट पॉइंट (endSec) पर लगाना
//              chartMarkers.push({
//                 time: endSec,  // <-- मिडपॉइंट हटा दिया, अब सीधे ब्रेकआउट कैंडल पर!
//                 position: markerPos, 
//                 color: lineColor,
//                 shape: "circle", // ये वो सबसे छोटा डॉट है जो टेक्स्ट को होल्ड करेगा
//                 text: sig.type,
//              });
//           }
//         });
//       }

//       // 4. एग्जीक्यूटेड ट्रेड्स के लिए मार्कर्स
//       if (executedTrades?.length > 0) {
//         executedTrades.forEach((trade) => {
//           const entryTime = Math.floor(new Date(trade.entryTime).getTime() / 1000);
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
//   }, [candleData, smcSignals, executedTrades]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default VisualDebuggerChart;





// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";

// const VisualDebuggerChart = ({ candleData, smcSignals, executedTrades }) => {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     // 1. चार्ट को इनिशियलाइज़ करें
//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: { background: { type: ColorType.Solid, color: "#0b0f19" }, textColor: "#d1d5db" },
//       grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
//       timeScale: {timeVisible: true, secondsVisible: false}
//     });

//     // 2. मेन कैंडलस्टिक सीरीज़ बनाएं
//     const mainSeries = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e", downColor: "#ef4444",
//       wickUpColor: "#22c55e", wickDownColor: "#ef4444",
//     });

//     if (candleData?.length > 0) {
//       const formattedCandles = candleData.map((c) => ({
//         time: Math.floor(new Date(c.timestamp).getTime() / 1000),
//         open: parseFloat(c.open),
//         high: parseFloat(c.high),
//         low: parseFloat(c.low),
//         close: parseFloat(c.close),
//       })).sort((a, b) => a.time - b.time);
      
//       mainSeries.setData(formattedCandles);

//       let chartMarkers = [];

//      // 3. SMC सिग्नल्स (Segment Lines + Centered Markers)
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000);
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000);
//           const isBullish = sig.trend === "BULLISH";

//           let lineColor = "#71717a"; 
//           if (sig.type === "BOS" || sig.type === "CHoCH") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
//           if (sig.type === "IDM") lineColor = "#9ca3af";

//           if (startSec && endSec && !isNaN(startSec) && !isNaN(endSec) && startSec < endSec) {
             
//              // 🔥 सबसे बड़ा सुधार: 'Rubber Band Bug' को खत्म करने के लिए 
//              // हम स्टार्ट से एंड तक की हर कैंडल का टाइम 'segmentData' में भरेंगे
//              const segmentData = [];
//              const targetCenterTime = (startSec + endSec) / 2;
//              let centerTimeSec = endSec;
//              let minDiff = Infinity;

//              formattedCandles.forEach((c) => {
//                  // सिर्फ वही कैंडल लें जो इस लाइन के दायरे (Start to End) में आती हों
//                  if (c.time >= startSec && c.time <= endSec) {
//                      // लाइन के लिए डेटा पॉइंट पुश करें
//                      segmentData.push({ time: c.time, value: parseFloat(sig.price) });
                     
//                      // साथ ही बिल्कुल सेंटर वाली कैंडल भी खोज लें
//                      const diff = Math.abs(c.time - targetCenterTime);
//                      if (diff < minDiff) {
//                          minDiff = diff;
//                          centerTimeSec = c.time;
//                      }
//                  }
//              });

//              // 2. Line Series बनाना
//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: sig.type === "IDM" ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              // 🔥 अब लाइन के पास पूरे पॉइंट्स हैं, कोई रबर बैंड इफ़ेक्ट नहीं होगा!
//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              // 3. पोजीशन का लॉजिक
//              let markerPos = "aboveBar"; 
//              if (sig.trend === "BEARISH") {
//                  markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "belowBar" : "aboveBar";
//              } else if (sig.trend === "BULLISH") {
//                  markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "aboveBar" : "belowBar";
//              }

//              // 4. मार्कर लगाना (अब ये परफेक्ट सेंटर और सही साइज में आएगा)
//              createSeriesMarkers(lineSeries, [{
//                 time: centerTimeSec, 
//                 position: markerPos, 
//                 color: lineColor,
//                 // shape: "circle", 
//                 text: sig.type,
//              }]);
//           }
//         });
//       }


//       // 4. एग्जीक्यूटेड ट्रेड्स के लिए मार्कर्स
//       if (executedTrades?.length > 0) {
//         executedTrades.forEach((trade) => {
//           const entryTime = Math.floor(new Date(trade.entryTime).getTime() / 1000);
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
//   }, [candleData, smcSignals, executedTrades]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />;
// };

// export default VisualDebuggerChart;




// import React, { useEffect, useRef } from "react";
// import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";

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
//             grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } }, // हल्का ग्रे ग्रिड
//         }
//     };

//     // जो थीम पैरेंट से आएगी, उसका कलर सेलेक्ट करें
//     const activeTheme = theme === "light" ? chartThemes.light : chartThemes.dark;

//     // 1. चार्ट को इनिशियलाइज़ करें
//    const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: activeTheme.layout, // 🔥 डायनामिक लेआउट
//       grid: activeTheme.grid,     // 🔥 डायनामिक ग्रिड
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

//      // 3. SMC सिग्नल्स (Segment Lines + Centered Markers)
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
//           const isBullish = sig.trend === "BULLISH";

//           let lineColor = "#71717a"; 
//           if (sig.type === "BOS" || sig.type === "CHoCH") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
//           if (sig.type === "IDM") lineColor = "#9ca3af";

//           if (startSec && endSec && !isNaN(startSec) && !isNaN(endSec) && startSec < endSec) {
             
//              // 🔥 सबसे बड़ा सुधार: 'Rubber Band Bug' को खत्म करने के लिए 
//              // हम स्टार्ट से एंड तक की हर कैंडल का टाइम 'segmentData' में भरेंगे
//              const segmentData = [];
//              const targetCenterTime = (startSec + endSec) / 2;
//              let centerTimeSec = endSec;
//              let minDiff = Infinity;

//              formattedCandles.forEach((c) => {
//                  // सिर्फ वही कैंडल लें जो इस लाइन के दायरे (Start to End) में आती हों
//                  if (c.time >= startSec && c.time <= endSec) {
//                      // लाइन के लिए डेटा पॉइंट पुश करें
//                      segmentData.push({ time: c.time, value: parseFloat(sig.price) });
                     
//                      // साथ ही बिल्कुल सेंटर वाली कैंडल भी खोज लें
//                      const diff = Math.abs(c.time - targetCenterTime);
//                      if (diff < minDiff) {
//                          minDiff = diff;
//                          centerTimeSec = c.time;
//                      }
//                  }
//              });

//              // 2. Line Series बनाना
//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: sig.type === "IDM" ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              // 🔥 अब लाइन के पास पूरे पॉइंट्स हैं, कोई रबर बैंड इफ़ेक्ट नहीं होगा!
//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              // 3. पोजीशन का लॉजिक
//              let markerPos = "aboveBar"; 
//              if (sig.trend === "BEARISH") {
//                  markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "belowBar" : "aboveBar";
//              } else if (sig.trend === "BULLISH") {
//                  markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "aboveBar" : "belowBar";
//              }

//              // 4. मार्कर लगाना (अब ये परफेक्ट सेंटर और सही साइज में आएगा)
//              createSeriesMarkers(lineSeries, [{
//                 time: centerTimeSec, 
//                 position: markerPos, 
//                 color: lineColor,
//                 // shape: "circle", 
//                 text: sig.type,
//              }]);
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
// import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";

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
//             grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } }, // हल्का ग्रे ग्रिड
//         }
//     };

//     // जो थीम पैरेंट से आएगी, उसका कलर सेलेक्ट करें
//     const activeTheme = theme === "light" ? chartThemes.light : chartThemes.dark;

//     // 1. चार्ट को इनिशियलाइज़ करें
//    const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth || 800,
//       height: 450,
//       layout: activeTheme.layout, // 🔥 डायनामिक लेआउट
//       grid: activeTheme.grid,     // 🔥 डायनामिक ग्रिड
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

//      // 3. SMC सिग्नल्स (Segment Lines + Centered Markers)
//       if (smcSignals?.length > 0) {
//         smcSignals.forEach((sig) => {
//           const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
//           const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
//           const isBullish = sig.trend === "BULLISH";

//           let lineColor = "#71717a"; 
//           if (sig.type === "BOS" || sig.type === "CHoCH") {
//               lineColor = isBullish ? "#22c55e" : "#ef4444"; 
//           }
//           if (sig.type === "IDM") lineColor = "#9ca3af";


//           if (sig.type === "X") {
//               lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444";
//           }

//           if (startSec && endSec && !isNaN(startSec) && !isNaN(endSec) && startSec < endSec) {
             
//              // 🔥 सबसे बड़ा सुधार: 'Rubber Band Bug' को खत्म करने के लिए 
//              // हम स्टार्ट से एंड तक की हर कैंडल का टाइम 'segmentData' में भरेंगे
//              const segmentData = [];
//              const targetCenterTime = (startSec + endSec) / 2;
//              let centerTimeSec = endSec;
//              let minDiff = Infinity;

//              formattedCandles.forEach((c) => {
//                  // सिर्फ वही कैंडल लें जो इस लाइन के दायरे (Start to End) में आती हों
//                  if (c.time >= startSec && c.time <= endSec) {
//                      // लाइन के लिए डेटा पॉइंट पुश करें
//                      segmentData.push({ time: c.time, value: parseFloat(sig.price) });
                     
//                      // साथ ही बिल्कुल सेंटर वाली कैंडल भी खोज लें
//                      const diff = Math.abs(c.time - targetCenterTime);
//                      if (diff < minDiff) {
//                          minDiff = diff;
//                          centerTimeSec = c.time;
//                      }
//                  }
//              });

//              // 2. Line Series बनाना
//              const lineSeries = chart.addSeries(LineSeries, {
//                  color: lineColor,
//                  lineWidth: 2,
//                  lineStyle: sig.type === "IDM" ? 1 : 2, 
//                  crosshairMarkerVisible: false,
//                  lastValueVisible: false, 
//                  priceLineVisible: false,
//              });

//              // 🔥 अब लाइन के पास पूरे पॉइंट्स हैं, कोई रबर बैंड इफ़ेक्ट नहीं होगा!
//              if (segmentData.length > 0) {
//                  lineSeries.setData(segmentData);
//              }

//              // 3. पोजीशन का लॉजिक
//              let markerPos = "aboveBar"; 
//              if (sig.type === "X") {
//                  // 🔥 सुधार: 'X' की पोजीशन भी 'sweptSide' पर निर्भर करती है!
//                  // HIGH स्वीप -> 'X' लाइन के ऊपर!
//                  // LOW स्वीप -> 'X' लाइन के नीचे!
//                  markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
//              } else {
//                  // Standard logic for BOS, IDM, CHoCH
//                  if (sig.trend === "BEARISH") {
//                      markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "belowBar" : "aboveBar";
//                  } else if (sig.trend === "BULLISH") {
//                      markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "aboveBar" : "belowBar";
//                  }
//              }
             
//              // 3. मार्कर लगाना 
//              createSeriesMarkers(lineSeries, [{
//                 time: centerTimeSec, 
//                 position: markerPos, 
//                 color: lineColor,
//                 // shape: "circle", 
//                 text: sig.type,
//              }]);
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
import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";

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
            grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } }, // हल्का ग्रे ग्रिड
        }
    };

    // जो थीम पैरेंट से आएगी, उसका कलर सेलेक्ट करें
    const activeTheme = theme === "light" ? chartThemes.light : chartThemes.dark;

    // 1. चार्ट को इनिशियलाइज़ करें
   const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 800,
      height: 450,
      layout: activeTheme.layout, // 🔥 डायनामिक लेआउट
      grid: activeTheme.grid,     // 🔥 डायनामिक ग्रिड
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

     // 3. SMC सिग्नल्स (Segment Lines + Centered Markers)
      if (smcSignals?.length > 0) {
        smcSignals.forEach((sig) => {
          const startSec = Math.floor(new Date(sig.startTime).getTime() / 1000) + 19800;
          const endSec = Math.floor(new Date(sig.endTime).getTime() / 1000) + 19800;
          const isBullish = sig.trend === "BULLISH";

          let lineColor = "#71717a"; 
          if (sig.type === "BOS" || sig.type === "CHoCH") {
              lineColor = isBullish ? "#22c55e" : "#ef4444"; 
          }
          if (sig.type === "IDM") lineColor = "#9ca3af";


          if (sig.type === "X" || sig.type === "Ref X") {
              lineColor = sig.sweptSide === "HIGH" ? "#22c55e" : "#ef4444"; 
          }

          if (startSec && endSec && !isNaN(startSec) && !isNaN(endSec) && startSec < endSec) {
             
             // 🔥 सबसे बड़ा सुधार: 'Rubber Band Bug' को खत्म करने के लिए 
             // हम स्टार्ट से एंड तक की हर कैंडल का टाइम 'segmentData' में भरेंगे
             const segmentData = [];
             const targetCenterTime = (startSec + endSec) / 2;
             let centerTimeSec = endSec;
             let minDiff = Infinity;

             formattedCandles.forEach((c) => {
                 // सिर्फ वही कैंडल लें जो इस लाइन के दायरे (Start to End) में आती हों
                 if (c.time >= startSec && c.time <= endSec) {
                     // लाइन के लिए डेटा पॉइंट पुश करें
                     segmentData.push({ time: c.time, value: parseFloat(sig.price) });
                     
                     // साथ ही बिल्कुल सेंटर वाली कैंडल भी खोज लें
                     const diff = Math.abs(c.time - targetCenterTime);
                     if (diff < minDiff) {
                         minDiff = diff;
                         centerTimeSec = c.time;
                     }
                 }
             });

             // 2. Line Series बनाना
             const lineSeries = chart.addSeries(LineSeries, {
                 color: lineColor,
                 lineWidth: 2,
                 lineStyle: sig.type === "IDM" ? 1 : 2, 
                 crosshairMarkerVisible: false,
                 lastValueVisible: false, 
                 priceLineVisible: false,
             });

             // 🔥 अब लाइन के पास पूरे पॉइंट्स हैं, कोई रबर बैंड इफ़ेक्ट नहीं होगा!
             if (segmentData.length > 0) {
                 lineSeries.setData(segmentData);
             }

             // 3. पोजीशन का लॉजिक
             let markerPos = "aboveBar"; 
             if (sig.type === "X" || sig.type === "Ref X") {
                 // 🔥 सुधार: 'X' की पोजीशन भी 'sweptSide' पर निर्भर करती है!
                 // HIGH स्वीप -> 'X' लाइन के ऊपर!
                 // LOW स्वीप -> 'X' लाइन के नीचे!
                 markerPos = sig.sweptSide === "HIGH" ? "aboveBar" : "belowBar";
             } else {
                 // Standard logic for BOS, IDM, CHoCH
                 if (sig.trend === "BEARISH") {
                     markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "belowBar" : "aboveBar";
                 } else if (sig.trend === "BULLISH") {
                     markerPos = (sig.type === "BOS" || sig.type === "CHoCH") ? "aboveBar" : "belowBar";
                 }
             }
             
             // 3. मार्कर लगाना 
             createSeriesMarkers(lineSeries, [{
                time: centerTimeSec, 
                position: markerPos, 
                color: lineColor,
                // shape: "circle", 
                text: sig.type,
             }]);
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