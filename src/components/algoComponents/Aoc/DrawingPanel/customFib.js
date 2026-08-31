import { hexToRgba } from './utils';

export const customFibOverlay = {
    name: 'customFib',
    totalStep: 3,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: ({ coordinates, bounding, yAxis, overlay }) => {
        if (coordinates.length < 2) return [];

        const startX = coordinates[0].x;
        const startY = coordinates[0].y; 
        const endX = coordinates[1].x;
        const endY = coordinates[1].y;   

        // सेटिंग्स रीड करें
        const settings = overlay.extendData?.fibSettings;
        if (!settings) return [];

        const figures = [];

        // बाउंड्री फिक्स
        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);

        // 1. ट्रेंड लाइन
        if (settings.trendLine?.checked) {
            figures.push({
                type: 'line',
                attrs: { coordinates: [coordinates[0], coordinates[1]] },
                styles: { style: 'dashed', color: settings.trendLine.color, size: 1, dashedValue: [4, 4] }
            });
        }

        // 2. लेवल्स का डेटा तैयार करें
        let levelData = settings.levels
            .filter(l => l.checked)
            .map(level => {
                const val = settings.reverse ? 1 - level.value : level.value;
                const y = endY + (startY - endY) * val;
                const price = yAxis ? yAxis.convertFromPixel(y).toFixed(2) : '';
                return { ...level, y, price, val };
            });

        // Y-axis के हिसाब से सॉर्ट करें
        levelData.sort((a, b) => a.y - b.y);

        // 3. बैकग्राउंड कलर भरें
        if (settings.showBackground) {
            for (let i = 0; i < levelData.length - 1; i++) {
                const current = levelData[i];
                const next = levelData[i + 1];
                const bgColor = settings.useOneColor ? settings.oneColor : next.color;
                
                figures.push({
                    type: 'polygon',
                    attrs: {
                        coordinates: [
                            { x: minX, y: current.y },
                            { x: maxX, y: current.y },
                            { x: maxX, y: next.y },
                            { x: minX, y: next.y }
                        ]
                    },
                    styles: { 
                        style: 'fill', 
                        color: hexToRgba(bgColor, settings.backgroundOpacity !== undefined ? settings.backgroundOpacity : 0.2) 
                    }
                });
            }
        }

        // 4. लाइन्स और लेबल्स ड्रॉ करें
        levelData.forEach(level => {
            const lineColor = settings.useOneColor ? settings.oneColor : level.color;
            
            figures.push({
                type: 'line',
                attrs: { coordinates: [{ x: minX, y: level.y }, { x: maxX, y: level.y }] },
                styles: { style: 'solid', color: lineColor, size: 1 }
            });

            // लेबल्स सेट करें
            let textArr = [];
            if (settings.showLevels) textArr.push(level.id);
            if (settings.showPrices) textArr.push(`(${level.price})`);
            
            if (textArr.length > 0) {
                let textX;
                let align;

                // 🌟 HORIZONTAL ALIGNMENT (मैजिक यहाँ है)
                if (settings.textAlign === 'center') {
                    textX = (minX + maxX) / 2; // बॉक्स के बीचों-बीच
                    align = 'center';
                } else if (settings.textAlign === 'right') {
                    // 🎯 नया फिक्स: Right अलाइनमेंट को बॉक्स के बिल्कुल बाहर कर दिया!
                    textX = maxX + 4; // बॉक्स से 4 पिक्सल बाहर (Right साइड में)
                    align = 'left';   // ताकि टेक्स्ट बाहर की दिशा में फैले
                } else {
                    // 🎯 Left अलाइनमेंट (बॉक्स के बिल्कुल बाहर)
                    textX = minX - 4;  // बॉक्स से 4 पिक्सल बाहर (Left साइड में)
                    align = 'right';   // ताकि टेक्स्ट बाहर की दिशा में फैले
                }

                // 🌟 VERTICAL ALIGNMENT (Top / Middle / Bottom)
                let textY = level.y;
                let baseline = 'middle';

                if (settings.textBaseline === 'bottom') { // UI में 'Top'
                    textY = level.y - 4; // लाइन के ऊपर
                    baseline = 'bottom';
                } else if (settings.textBaseline === 'top') { // UI में 'Bottom'
                    textY = level.y + 4; // लाइन के नीचे
                    baseline = 'top';
                }

                figures.push({
                    type: 'text',
                    attrs: { 
                        x: textX, 
                        y: textY, 
                        text: textArr.join(' '), 
                        align: align, 
                        baseline: baseline 
                    },
                    styles: { 
                        color: lineColor, 
                        backgroundColor: 'transparent', 
                        size: settings.fontSize || 12 
                    }
                });
            }
        });

        return figures;
    }
};