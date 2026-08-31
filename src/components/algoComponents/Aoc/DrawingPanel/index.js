import { registerOverlay } from 'klinecharts';
import { customFibOverlay } from './customFib';
import { rectangleOverlay } from './rectangle';
import { circleOverlay } from './circle';
import { textOverlay } from './text';
import { horizontalLineOverlay } from './horizontalLine';


export const registerAllDrawingTools = () => {
    registerOverlay(customFibOverlay);
    registerOverlay(rectangleOverlay);
    registerOverlay(circleOverlay);
    registerOverlay(textOverlay);
    registerOverlay(horizontalLineOverlay);
    // भविष्य में कोई भी नया टूल बने, बस उसे यहाँ import करके रजिस्टर कर देना!
};