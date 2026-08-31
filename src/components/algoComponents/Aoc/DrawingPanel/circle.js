// import { hexToRgba } from './utils';

// export const circleOverlay = {
//     name: 'circle',
//     totalStep: 3,
//     needDefaultPointFigure: true,
//     needDefaultXAxisFigure: true,
//     needDefaultYAxisFigure: true,
//     createPointFigures: ({ coordinates, overlay }) => {
//         const data = overlay.extendData || { fillHex: '#2962FF', borderHex: '#2962FF', lineWidth: 2, fillOpacity: 0.2, borderOpacity: 1 };

//         if (coordinates.length > 1) {
//             const radius = Math.sqrt(Math.pow(coordinates[1].x - coordinates[0].x, 2) + Math.pow(coordinates[1].y - coordinates[0].y, 2));
//             return [{
//                 type: 'circle',
//                 attrs: { x: coordinates[0].x, y: coordinates[0].y, r: radius },
//                 styles: { style: 'stroke_fill', color: hexToRgba(data.fillHex, data.fillOpacity), borderColor: hexToRgba(data.borderHex, data.borderOpacity), borderSize: data.lineWidth, borderStyle: 'solid' }
//             }];
//         }
//         return [];
//     }
// };



import { hexToRgba } from './utils';

export const circleOverlay = {
    name: 'circle',
    totalStep: 3,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: ({ coordinates, overlay }) => {
        // अगर 2 पॉइंट्स नहीं हैं तो कुछ मत बनाओ
        if (coordinates.length < 2) return [];

        // 🌟 Rectangle की तरह सेटिंग्स और डेटा लें
        const data = overlay.extendData || {};
        const fillHex = data.fillHex || '#2962FF';
        const fillOpacity = data.fillOpacity !== undefined ? data.fillOpacity : 0.2;
        const borderHex = data.borderHex || '#2962FF';
        const borderOpacity = data.borderOpacity !== undefined ? data.borderOpacity : 1;
        const lineWidth = data.lineWidth || 2;

        const radius = Math.sqrt(Math.pow(coordinates[1].x - coordinates[0].x, 2) + Math.pow(coordinates[1].y - coordinates[0].y, 2));
        
        const figures = [];

        // 🎯 1. Circle ड्रा करें
        figures.push({
            type: 'circle',
            attrs: { x: coordinates[0].x, y: coordinates[0].y, r: radius },
            styles: { 
                style: 'stroke_fill', 
                color: hexToRgba(fillHex, fillOpacity), 
                borderColor: hexToRgba(borderHex, borderOpacity), 
                borderSize: lineWidth, 
                borderStyle: 'solid' 
            }
        });

        // 🎯 2. Text ड्रा करें (अगर यूजर ने सेटिंग्स से कुछ टाइप किया है)
        if (data.text) {
            figures.push({
                type: 'text',
                attrs: { 
                    x: coordinates[0].x, 
                    y: coordinates[0].y, 
                    text: data.text, 
                    align: 'center',    // हॉरिजॉन्टल सेंटर
                    baseline: 'middle'  // वर्टिकल सेंटर
                },
                styles: { 
                    color: data.textColor || borderHex, 
                    backgroundColor: 'transparent', 
                    size: data.textSize || 14 
                }
            });
        }

        // 🌟 दोनों (सर्कल और टेक्स्ट) को एक साथ रिटर्न करें
        return figures;
    }
};