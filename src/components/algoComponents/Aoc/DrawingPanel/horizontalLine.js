// export const horizontalLineOverlay = {
//     name: 'horizontalLine',
//     totalStep: 2, // 🎯 1 क्लिक में लाइन बन जाएगी
//     needDefaultPointFigure: true,
//     needDefaultXAxisFigure: false, 
//     needDefaultYAxisFigure: true, // 🌟 Y-Axis पर प्राइस टैग दिखाएगा
//     createPointFigures: ({ coordinates, bounding, overlay }) => {
//         if (coordinates.length === 0) return [];

//         const data = overlay.extendData || {};
        
//         // Settings से कलर और साइज़ लेगा, वरना डिफ़ॉल्ट ब्लू रहेगा
//         const lineColor = data.borderColor || data.borderHex || '#2962FF';
//         const lineWidth = data.lineWidth !== undefined ? Number(data.lineWidth) : 2;

//         return [
//             {
//                 type: 'line',
//                 attrs: {
//                     // 🎯 x: 0 से लेकर चार्ट की पूरी चौड़ाई (bounding.width) तक लाइन बनाएगा
//                     coordinates: [
//                         { x: 0, y: coordinates[0].y },
//                         { x: bounding.width, y: coordinates[0].y }
//                     ]
//                 },
//                 styles: {
//                     style: 'solid',
//                     color: lineColor,
//                     size: lineWidth
//                 }
//             }
//         ];
//     }
// };


export const horizontalLineOverlay = {
    name: 'horizontalLine',
    totalStep: 2, 
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: false, 
    needDefaultYAxisFigure: true, 
    createPointFigures: ({ coordinates, bounding, overlay }) => {
        if (coordinates.length === 0) return [];

        // 🌟 MAGIC FIX: जब लाइन ड्रॉ हो रही हो, तभी उसका प्राइस ब्राउज़र की मेमोरी में छुपा दो!
        if (overlay.points && overlay.points.length > 0 && overlay.points[0].value !== undefined) {
            if (!window.alertPrices) window.alertPrices = {}; // मेमोरी डब्बा बनाएँ
            window.alertPrices[overlay.id] = overlay.points[0].value; // ID के साथ प्राइस सेव कर दें
        }

        const data = overlay.extendData || {};
        const lineColor = data.borderColor || data.borderHex || '#2962FF';
        const lineWidth = data.lineWidth !== undefined ? Number(data.lineWidth) : 2;

        return [
            {
                type: 'line',
                attrs: {
                    coordinates: [
                        { x: 0, y: coordinates[0].y },
                        { x: bounding.width, y: coordinates[0].y }
                    ]
                },
                styles: {
                    style: 'solid',
                    color: lineColor,
                    size: lineWidth
                }
            }
        ];
    }
};