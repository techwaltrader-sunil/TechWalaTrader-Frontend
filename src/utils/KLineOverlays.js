import { registerOverlay } from 'klinecharts';

export const registerAllCustomOverlays = () => {

      // 🚀 1. ALERT LINE OVERLAY (SUPER FIXED)
      if (!window.alertLineRegistered) {
          registerOverlay({
              name: 'alertLine',
              needDefaultPointFigure: true,
              needDefaultXAxisFigure: false,
              needDefaultYAxisFigure: true,
              createPointFigures: ({ overlay, coordinates, bounding }) => {
                  const y = coordinates[0].y;
                  const ext = overlay.extendData || {};
                  const isHovered = ext.isHovered || false;
                  
                  // 🚨 THE MAGIC FIX 1: अब यह ड्रैग करते समय 'लाइव पॉइंट' से प्राइस उठाएगा!
                  const price = (overlay.points && overlay.points.length > 0) ? overlay.points[0].value : (ext.price || 0);
                  const symbol = ext.symbol || 'NIFTY';

                  const figures = [
                      {
                          type: 'line',
                          attrs: { coordinates: [{ x: 0, y }, { x: bounding.width, y }] },
                          styles: { style: 'dashed', color: '#3b3b3b', size: 1.5, dashedValue: [5, 5] }
                      },
                      {
                          type: 'text',
                          attrs: { x: bounding.width - 22, y: y - 10, text: '⮞' },
                          styles: { color: 'black', backgroundColor: 'transparent', size: 20, paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3, borderRadius: 4 }
                      }
                  ];

                  if (isHovered) {
                      figures.push({
                          key: 'delete_box', // 👈 🚨 THE MAGIC FIX 2: इस डिब्बे को पहचान (Key) दे दी
                          type: 'text',
                          attrs: {
                              x: bounding.width / 2,
                              y: y - 12,
                              text: `${symbol} Crossing ${parseFloat(price).toFixed(2)}    ✖`,
                          },
                          styles: {
                              style: 'stroke_fill',
                              color: '#000000',
                              backgroundColor: '#ffffff',
                              borderColor: '#000000',
                              borderSize: 1,
                              borderStyle: 'solid',
                              borderRadius: 4,
                              paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
                              size: 12,
                              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              weight: '500',
                              align: 'center',
                              baseline: 'bottom'
                          }
                      });
                  }
                  return figures;
              }
          });
          window.alertLineRegistered = true;
      }

      // 🚀 2. TRADING POSITION OVERLAY (Buy/Sell Line)
      if (!window.positionLineRegistered) {
          registerOverlay({
              name: 'positionLine',
              needDefaultPointFigure: true,
              needDefaultXAxisFigure: true,
              needDefaultYAxisFigure: true,
              createPointFigures: ({ overlay, coordinates, bounding }) => {
                  const y = coordinates[0].y;
                  const ext = overlay.extendData || {};
                  const isBuy = ext.type === 'BUY';
                  const themeColor = isBuy ? '#26a69a' : '#ef5350';
                  const pnl = ext.pnl || 0;
                  
                  return [
                      {
                          type: 'line',
                          attrs: { coordinates: [{ x: 0, y }, { x: bounding.width, y }] },
                          styles: { style: 'solid', color: themeColor, size: 1.5 }
                      },
                      {
                          type: 'text',
                          attrs: {
                              x: bounding.width - 150,
                              y: y - 6,
                              text: ` ${ext.qty} ${ext.symbol} ${ext.type} @ ${ext.price}  |  ₹${pnl.toFixed(2)}   ✖ `
                          },
                          styles: {
                              style: 'stroke_fill',
                              color: '#ffffff',
                              backgroundColor: themeColor,
                              borderColor: themeColor,
                              borderWidth: 1,
                              borderStyle: 'solid',
                              borderRadius: 4,
                              paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4,
                              size: 12, weight: 'bold',
                              align: 'center', baseline: 'bottom'
                          }
                      }
                  ];
              }
          });
          window.positionLineRegistered = true;
      }


      // 🚀 3. AOC MAGICAL LINES OVERLAY (Support/Resistance)
      if (!window.aocLevelLineRegistered) {
          registerOverlay({
              name: 'aocLevelLine',
              lock: true, 
              needDefaultPointFigure: true,
              needDefaultXAxisFigure: false,
              needDefaultYAxisFigure: true,
              createPointFigures: ({ overlay, coordinates, bounding }) => {
                  const y = coordinates[0].y;
                  const ext = overlay.extendData || {};
                  const labels = ext.labels || [];
                  
                  const figures = [
                      {
                          type: 'line',
                          attrs: { coordinates: [{ x: 0, y }, { x: bounding.width, y }] },
                          styles: { style: ext.lineStyle || 'dashed', color: ext.color, size: 1.5, dashedValue: [4, 4] }
                      }
                  ];

                  labels.forEach(lbl => {
                      figures.push({
                          type: 'text',
                          attrs: { 
                              x: bounding.width - (lbl.offset || 220),
                              y: y - 8, 
                              text: ` ${lbl.text} ` 
                          },
                          styles: {
                              style: 'fill', 
                              color: '#ffffff', 
                              backgroundColor: lbl.color,
                              paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3,
                              borderRadius: 4, size: 11, weight: 'bold',
                              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }
                      });
                  });

                  return figures;
              }
          });
          window.aocLevelLineRegistered = true;
      }

    //   // 🚀 4. INDEPENDENT ENTRY LINE (Real P&L Ready)
    // if (!window.entryLineOverlayRegistered) {
    //     registerOverlay({
    //         name: 'customEntryLine',
    //         lock: true,
    //         needDefaultPointFigure: true,
    //         createPointFigures: ({ overlay, coordinates, bounding }) => {
    //             const y = coordinates[0].y;
    //             const ext = overlay.extendData || {};
    //             const startX = bounding.width - 300;
                
    //             // 🎯 THE FIX: अब यह ext.realPnl दिखाएगा (जो सीधा AOC Option Chain से आएगा)
    //             const pnlText = ext.realPnl ? (ext.realPnl > 0 ? `+ ₹${ext.realPnl}` : `- ₹${Math.abs(ext.realPnl)}`) : '₹ 0.00';
    //             const pnlColor = ext.realPnl && ext.realPnl < 0 ? '#ff4d4d' : '#00e676'; // Profit हरा, Loss लाल

    //             return [
    //                 { type: 'line', attrs: { coordinates: [{x: 0, y}, {x: startX, y}] }, styles: { style: 'solid', color: '#2962ff', size: 1 } },
    //                 { type: 'text', 
    //                     attrs: { x: startX, y: y, text: ` ${ext.qty} Lot  |  ${pnlText}  |  ✖ ` }, 
    //                     styles: { 
    //                         style: 'fill', color: '#ffffff', backgroundColor: '#2962ff', 
    //                         paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, 
    //                         borderRadius: 4, size: 12, weight: 'bold', 
    //                         align: 'start', baseline: 'middle', 
    //                         family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
    //                     } 
    //                 }
    //             ];
    //         }
    //     });
    //     window.entryLineOverlayRegistered = true;
    // }

    // 🚀 4. INDEPENDENT ENTRY LINE (Real P&L & Smart Colors)
    if (!window.entryLineOverlayRegistered) {
        registerOverlay({
            name: 'customEntryLine',
            lock: true,
            needDefaultPointFigure: true,
            createPointFigures: ({ overlay, coordinates, bounding }) => {
                const y = coordinates[0].y;
                const ext = overlay.extendData || {};
                const startX = bounding.width - 300;
                
                // 🎯 THE FIX: इंजन से सीधा 'ext.pnl' पकड़ो!
                const pnlText = ext.pnl || '₹ 0.00';
                
                // 🎨 THE COLOR MAGIC: Text के हिसाब से रंग डिसाइड करो
                const isProfit = pnlText.includes('+');
                const isLoss = pnlText.includes('-');
                const bgColor = isProfit ? '#00b300' : (isLoss ? '#ff4d4d' : '#2962ff'); 

                return [
                    { type: 'line', attrs: { coordinates: [{x: 0, y}, {x: startX, y}] }, styles: { style: 'solid', color: '#2962ff', size: 1 } },
                    { type: 'text', 
                        attrs: { x: startX, y: y, text: ` ${ext.qty} Lot  |  ${pnlText}  |  ✖ ` }, 
                        styles: { 
                            style: 'fill', color: '#ffffff', 
                            backgroundColor: bgColor, // 👈 यहाँ डायनामिक कलर लगा दिया!
                            paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, 
                            borderRadius: 4, size: 12, weight: 'bold', 
                            align: 'start', baseline: 'middle', 
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
                        } 
                    }
                ];
            }
        });
        window.entryLineOverlayRegistered = true;
    }

    // 🚀 5. INDEPENDENT SL LINE (Delta Based Expected P&L)
    if (!window.slLineOverlayRegistered) {
        registerOverlay({
            name: 'customSlLine',
            lock: false, 
            needDefaultPointFigure: true,
            createPointFigures: ({ overlay, coordinates, bounding, yAxis }) => {
                let y = coordinates[0].y;
                let currentVal = overlay.points[0].value;
                const ext = overlay.extendData || {};
                const startX = bounding.width - 300;
                const spotEntry = ext.spotEntry || 0;
                const entryY = yAxis.convertToPixel(spotEntry);

                if (ext.isBullish && currentVal > spotEntry) { currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry; } 
                else if (!ext.isBullish && currentVal < spotEntry) { currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry; }

                const ptsDiff = Math.abs(spotEntry - currentVal);
                const ptsText = `${ptsDiff.toFixed(1)} pts`; 

                // 🧬 THE DELTA MAGIC: Expected Premium Loss Calculation
                const delta = ext.delta ? Math.abs(ext.delta) : 0.5; // अगर डेल्टा न मिले तो डिफ़ॉल्ट ATM 0.5 मानेंगे
                const expectedPremiumPts = ptsDiff * delta;
                const lossAmt = expectedPremiumPts * (ext.qty || 1);
                const lossText = `Exp: - ₹${lossAmt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;

                return [
                    { type: 'line', attrs: { coordinates: [{x: 0, y}, {x: startX, y}] }, styles: { style: 'solid', color: '#f57c00', size: 1 } },
                    { type: 'text', 
                        attrs: { x: startX, y: y, text: `𝐒𝐋 ${ptsText}  |  ${lossText}  |  ✖ ` }, 
                        styles: { 
                            style: 'fill', color: '#ffffff', backgroundColor: '#f57c00', 
                            paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, 
                            borderRadius: 4, size: 12, weight: 'bold', align: 'start', baseline: 'middle'
                        } 
                    },
                    { type: 'line', attrs: { coordinates: [{x: startX, y: Math.min(y, entryY)}, {x: startX, y: Math.max(y, entryY)}] }, styles: { style: 'dashed', color: '#787b86', size: 1 } }
                ];
            }
        });
        window.slLineOverlayRegistered = true;
    }

    // 🚀 6. INDEPENDENT TP LINE (Delta Based Expected P&L)
    if (!window.tpLineOverlayRegistered) {
        registerOverlay({
            name: 'customTpLine',
            lock: false,
            needDefaultPointFigure: true,
            createPointFigures: ({ overlay, coordinates, bounding, yAxis }) => {
                let y = coordinates[0].y;
                let currentVal = overlay.points[0].value;
                const ext = overlay.extendData || {};
                const startX = bounding.width - 300;
                const spotEntry = ext.spotEntry || 0;
                const entryY = yAxis.convertToPixel(spotEntry);

                if (ext.isBullish && currentVal < spotEntry) { currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry; } 
                else if (!ext.isBullish && currentVal > spotEntry) { currentVal = spotEntry; y = entryY; overlay.points[0].value = spotEntry; }

                const ptsDiff = Math.abs(spotEntry - currentVal);
                const ptsText = `${ptsDiff.toFixed(1)} pts`; 

                // 🧬 THE DELTA MAGIC: Expected Premium Profit Calculation
                const delta = ext.delta ? Math.abs(ext.delta) : 0.5;
                const expectedPremiumPts = ptsDiff * delta;
                const profAmt = expectedPremiumPts * (ext.qty || 1);
                const profText = `Exp: + ₹${profAmt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;

                return [
                    { type: 'line', attrs: { coordinates: [{x: 0, y}, {x: startX, y}] }, styles: { style: 'solid', color: '#00b0ff', size: 1 } },
                    { type: 'text', 
                        attrs: { x: startX, y: y, text: `𝐓𝐏  ${ptsText}  |  ${profText}  |  ✖ ` }, 
                        styles: { 
                            style: 'fill', color: '#ffffff', backgroundColor: '#00b0ff', 
                            paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, 
                            borderRadius: 4, size: 12, weight: 'bold', align: 'start', baseline: 'middle'
                        } 
                    },
                    { type: 'line', attrs: { coordinates: [{x: startX, y: Math.min(y, entryY)}, {x: startX, y: Math.max(y, entryY)}] }, styles: { style: 'dashed', color: '#787b86', size: 1 } }
                ];
            }
        });
        window.tpLineOverlayRegistered = true;
    }

    console.log("✅ All KLine Custom Overlays Registered Successfully!");
};