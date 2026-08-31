import { hexToRgba } from './utils';

export const rectangleOverlay = {
    name: 'rect',
    totalStep: 3,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: ({ coordinates, overlay }) => {
        if (coordinates.length < 2) return [];

        const startX = coordinates[0].x;
        const startY = coordinates[0].y;
        const endX = coordinates[1].x;
        const endY = coordinates[1].y;

        // Rectangle की सेटिंग्स लें (Order Block वाले कलर्स और टेक्स्ट)
        const data = overlay.extendData || {};
        
        const fillHex = data.fillHex || '#2962FF';
        const fillOpacity = data.fillOpacity !== undefined ? data.fillOpacity : 0.2;
        const borderHex = data.borderHex || '#2962FF';
        const borderOpacity = data.borderOpacity !== undefined ? data.borderOpacity : 1;
        const lineWidth = data.lineWidth || 2;
        
        const figures = [];

        // 🎯 1. Rectangle (Polygon) ड्रा करें
        figures.push({
            type: 'polygon',
            attrs: {
                coordinates: [
                    { x: startX, y: startY },
                    { x: endX, y: startY },
                    { x: endX, y: endY },
                    { x: startX, y: endY }
                ]
            },
            styles: {
                style: 'stroke_fill',
                color: hexToRgba(fillHex, fillOpacity),
                borderColor: hexToRgba(borderHex, borderOpacity),
                borderSize: lineWidth,
                borderStyle: 'solid'
            }
        });

       // 🎯 2. टेक्स्ट (अगर यूजर ने कुछ टाइप किया है)
        if (data.text) {
            figures.push({
                type: 'text',
                attrs: {
                    // 🌟 X और Y को बॉक्स के बिल्कुल बीचों-बीच (Center) का फॉर्मूला दे दिया
                    x: (startX + endX) / 2, 
                    y: (startY + endY) / 2, 
                    text: data.text,
                    align: 'center',   // हॉरिजॉन्टल सेंटर के लिए
                    baseline: 'middle' // वर्टिकल सेंटर के लिए
                },
                styles: {
                    color: data.textColor || borderHex,
                    backgroundColor: 'transparent',
                    size: data.textSize || 14
                }
            });
        }

        return figures;
    }
};