// import React, { useEffect, useRef, useState } from 'react';

// const BlinkingCell = ({ value }) => {
//     // डिफ़ॉल्ट बैकग्राउंड पारदर्शी (transparent) रहेगा
//     const [bgColor, setBgColor] = useState('bg-transparent');
//     const prevValue = useRef(value);

//     useEffect(() => {
//         // अगर प्राइस में कोई बदलाव नहीं हुआ है, तो कुछ मत करो
//         if (value === prevValue.current) return;

//         // 🎯 कंडीशन: नया प्राइस > पुराना प्राइस = Green, वरना Red
//         if (value > prevValue.current) {
//             setBgColor('bg-green-500/60 text-green-900 transition-none'); 
//         } else {
//             setBgColor('bg-red-500/60 text-white transition-none'); 
//         }
        
//         prevValue.current = value;

//         // 🎯 300 मिलीसेकंड बाद वापस नॉर्मल कलर (Smooth Fade-out इफ़ेक्ट)
//         const timer = setTimeout(() => {
//             setBgColor('bg-transparent transition-colors duration-500');
//         }, 300);

//         return () => clearTimeout(timer);
//     }, [value]);

//     return (
//         <div className={`px-2 py-1 rounded font-semibold w-full text-center ${bgColor}`}>
//             {value !== undefined && value !== 0 ? value : '-'}
//         </div>
//     );
// };

// export default BlinkingCell;


import React, { useEffect, useRef, useState } from 'react';

const BlinkingCell = ({ value }) => {
    // डिफ़ॉल्ट रूप से नॉर्मल टेक्स्ट कलर (gray-800) और कोई बैकग्राउंड नहीं
    const [colorClass, setColorClass] = useState('bg-transparent text-gray-800');
    const prevValue = useRef(value);

    useEffect(() => {
        if (value === prevValue.current) return;

        // 🎯 THE FIX: डार्क 500 की जगह लाइट 100 शेड का इस्तेमाल (Soft & Premium Look)
        if (value > prevValue.current) {
            // ग्रीन कलर (सॉफ्ट बैकग्राउंड और डार्क ग्रीन टेक्स्ट)
            setColorClass('bg-green-100 text-green-700 transition-none'); 
        } else {
            // रेड कलर (सॉफ्ट बैकग्राउंड और डार्क रेड टेक्स्ट)
            setColorClass('bg-red-100 text-red-700 transition-none'); 
        }
        
        prevValue.current = value;

        // 300ms बाद वापस नॉर्मल ग्रे टेक्स्ट और ट्रांसपेरेंट बैकग्राउंड
        const timer = setTimeout(() => {
            setColorClass('bg-transparent text-gray-800 transition-colors duration-500');
        }, 300);

        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className={`px-2 py-1 rounded w-full text-center ${colorClass}`}>
            {value !== undefined && value !== 0 ? value : '-'}
        </div>
    );
};

export default BlinkingCell;