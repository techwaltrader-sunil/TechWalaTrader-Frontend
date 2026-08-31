// import { hexToRgba } from './utils';

// export const textOverlay = {
//     name: 'text',
//     totalStep: 2, // 🎯 सिर्फ 1 क्लिक में टेक्स्ट छप जाएगा
//     needDefaultPointFigure: true,
//     needDefaultXAxisFigure: true,
//     needDefaultYAxisFigure: true,
//     createPointFigures: ({ coordinates, overlay }) => {
//         if (coordinates.length === 0) return [];

//         const data = overlay.extendData || {};
//         const textContent = data.text || 'Add text';
//         const textColor = data.textColor || '#2962FF';
//         const textSize = data.textSize || 14;

//         // 🌟 Background & Border Logic
//         const showBackground = data.showBackground || false;
//         const backgroundColor = showBackground ? hexToRgba(data.fillColor || '#2962FF', data.fillOpacity !== undefined ? data.fillOpacity : 0.2) : 'transparent';

//         const showBorder = data.showBorder || false;
//         const borderColor = showBorder ? hexToRgba(data.borderColor || '#2962FF', data.borderOpacity !== undefined ? data.borderOpacity : 1) : 'transparent';

//         return [
//             {
//                 type: 'text',
//                 attrs: {
//                     x: coordinates[0].x,
//                     y: coordinates[0].y,
//                     text: textContent,
//                     align: 'center',
//                     baseline: 'middle'
//                 },
//                 styles: {
//                     color: textColor,
//                     size: textSize,
//                     backgroundColor: backgroundColor,
//                     borderColor: borderColor,
//                     borderSize: showBorder ? 1 : 0,
//                     borderStyle: 'solid',
//                     paddingLeft: 6,
//                     paddingRight: 6,
//                     paddingTop: 6,
//                     paddingBottom: 6,
//                     borderRadius: 4
//                 }
//             }
//         ];
//     }
// };


import { hexToRgba } from './utils';

export const textOverlay = {
    name: 'text',
    totalStep: 2, 
    needDefaultPointFigure: false, 
    needDefaultXAxisFigure: false, 
    needDefaultYAxisFigure: false,
    createPointFigures: ({ coordinates, overlay }) => {
        if (coordinates.length === 0) return [];

        const data = overlay.extendData || {};
        
        const textContent = (data.text !== undefined && data.text !== '') ? data.text : 'Text';
        const textColor = data.textColor || data.color || '#2962FF';
        const textSize = data.textSize || 14;

        const fOpacity = (data.fillOpacity !== undefined && !isNaN(data.fillOpacity)) ? data.fillOpacity : 0.1;

        const activeFillColor = data.fillHex || data.fillColor || '#2962FF';
        const activeBorderColor = data.borderHex || data.borderColor || '#2962FF';

        const showBackground = data.showBackground !== false; 
        const backgroundColor = showBackground ? hexToRgba(activeFillColor, fOpacity) : 'rgba(0, 0, 0, 0)';

        const showBorder = data.showBorder !== false;
        const borderColor = showBorder ? activeBorderColor : 'rgba(0, 0, 0, 0)';
        const borderThickness = showBorder ? 1 : 0;

        return [
            {
                type: 'text',
                attrs: {
                    x: coordinates[0].x,
                    y: coordinates[0].y,
                    text: textContent,
                    align: 'center',
                    baseline: 'middle'
                },
                styles: {
                    style: 'stroke_fill',  // 🎯 BINGO! यही वो लाइन है जो बॉर्डर को ज़िंदा करेगी!
                    color: textColor,
                    size: textSize,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor, 
                    borderSize: borderThickness,   
                    borderStyle: 'solid',
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 6,
                    paddingBottom: 6,
                    borderRadius: 4
                }
            }
        ];
    }
};