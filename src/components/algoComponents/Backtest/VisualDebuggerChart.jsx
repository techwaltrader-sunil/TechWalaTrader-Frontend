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