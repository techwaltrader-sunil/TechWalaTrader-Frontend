// import React, { useEffect, useState } from 'react';
// import { CheckCircle, XCircle, X, BellRing } from 'lucide-react';

// const ToastNotification = ({ title, message, type, onClose, autoClose = true, duration = 4000 }) => {
//   // Animation State
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const entryTimer = requestAnimationFrame(() => {
//       setIsVisible(true);
//     });

//     let exitTimer;
    
//     // 🌟 2. कंडीशन लगाएँ: अगर autoClose चालू है (True), तभी टाइमर स्टार्ट करें!
//     if (autoClose) {
//       exitTimer = setTimeout(() => {
//         handleClose();
//       }, duration);
//     }

//     // Cleanup function
//     return () => {
//       if (exitTimer) clearTimeout(exitTimer);
//     };
//   }, [autoClose, duration]);

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(() => {
//       onClose();
//     }, 400); 
//   };

//  // 🌟 3 प्रकार के Toast Types: 'success', 'alarm', 'error'
//   const isAlarm = type === 'alarm';
//   const isSuccess = type === 'success';

//   return (
//     <div 
//         role="alert"
//         className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border cursor-pointer
//             transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
//             ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[120%] opacity-0 scale-90'}
            
//             /* ✅ DYNAMIC COLORS BASED ON TYPE */
//             ${isAlarm 
//                 ? 'bg-white dark:bg-slate-900 border-blue-500/30 dark:border-blue-500/50 shadow-[0_5px_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' 
//                 : isSuccess 
//                     ? 'bg-white dark:bg-slate-900 border-green-500/30 dark:border-green-500/50 shadow-[0_5px_15px_rgba(34,197,94,0.15)] dark:shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]' 
//                     : 'bg-white dark:bg-slate-900 border-red-500/30 dark:border-red-500/50 shadow-[0_5px_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]'
//             }
//         `}
//         onClick={handleClose}
//     >
//         {/* 🔔 Dynamic Icon with Pulse Effect */}
//         <div className={`p-1.5 rounded-full shrink-0 relative 
//             ${isAlarm ? 'bg-blue-100 dark:bg-blue-500/10' : (isSuccess ? 'bg-green-100 dark:bg-green-500/10' : 'bg-red-100 dark:bg-red-500/10')}
//         `}>
//             {isAlarm ? <BellRing size={22} className="text-blue-600 dark:text-blue-500" /> 
//                      : isSuccess ? <CheckCircle size={22} className="text-green-600 dark:text-green-500" /> 
//                      : <XCircle size={22} className="text-red-600 dark:text-red-500" />}
            
//             <span className={`absolute inset-0 rounded-full animate-ping opacity-30 dark:opacity-20 
//                 ${isAlarm ? 'bg-blue-500' : (isSuccess ? 'bg-green-500' : 'bg-red-500')}
//             `}></span>
//         </div>

//         {/* 📝 Message & Title */}
//         <div className="pr-4">
//             <h4 className={`text-sm font-bold leading-tight 
//                 ${isAlarm ? 'text-blue-600 dark:text-blue-400' : (isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}
//             `}>
//                 {/* अगर कस्टम title भेजा है तो वो दिखेगा, वरना डिफ़ॉल्ट (Success/Alarm/Failed) */}
//                 {title ? title : (isAlarm ? 'Alarm' : (isSuccess ? 'Success' : 'Failed'))}
//             </h4>
//             <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-tight mt-0.5">{message}</p>
//         </div>

//         {/* ❌ Close Button */}
//         <button onClick={(e) => { e.stopPropagation(); handleClose(); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors pl-2 border-l border-gray-200 dark:border-slate-800 ml-2">
//             <X size={16} />
//         </button>
//     </div>
//   );
// };

// export default ToastNotification;


// import React, { useEffect, useState, useRef } from 'react';
// import { CheckCircle, XCircle, X, BellRing } from 'lucide-react';

// const ToastNotification = ({ title, message, type, onClose, autoClose = true, duration = 4000 }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const onCloseRef = useRef(onClose);

//   // 1. हमेशा लेटेस्ट onClose फंक्शन को सुरक्षित रखें
//   useEffect(() => {
//     onCloseRef.current = onClose;
//   }, [onClose]);

//   // 2. एंट्री एनीमेशन (सिर्फ एक बार चलेगा)
//   useEffect(() => {
//     const entryTimer = setTimeout(() => setIsVisible(true), 50);
//     return () => clearTimeout(entryTimer);
//   }, []); // 👈 Empty Array: री-रेंडर होने पर भी यह दोबारा नहीं चलेगा

//   // 3. ⏳ THE MASTER FIX: बुलेटप्रूफ एग्जिट टाइमर
//   useEffect(() => {
//     if (!autoClose) return;

//     const exitTimer = setTimeout(() => {
//       handleManualClose();
//     }, duration);

//     return () => clearTimeout(exitTimer);
    
//   // 🎯 THE FIX: यहाँ [] (empty array) है! 
//   // अब बैकग्राउंड का कोई भी चार्ट या डेटा अपडेट इस टाइमर को रोक या रीसेट नहीं कर पाएगा।
//   }, []); 

//   // 🚪 क्लोज़ करने का फंक्शन (मैनुअल और ऑटो दोनों के लिए)
//   const handleManualClose = () => {
//     setIsVisible(false); // 🌟 पहले Fade-out और Slide-down एनीमेशन चलाएं
    
//     setTimeout(() => {
//       if (onCloseRef.current) onCloseRef.current(); // 🌟 500ms बाद असल में स्क्रीन से हटा दें
//     }, 500); 
//   };

//   const isAlarm = type === 'alarm';
//   const isSuccess = type === 'success';

//   return (
//     <div 
//         role="alert"
//         className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border cursor-pointer
//             transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
//             ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[120%] opacity-0 scale-90'}
            
//             /* ✅ DYNAMIC COLORS */
//             ${isAlarm 
//                 ? 'bg-white dark:bg-slate-900 border-blue-500/30 dark:border-blue-500/50 shadow-[0_5px_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' 
//                 : isSuccess 
//                     ? 'bg-white dark:bg-slate-900 border-green-500/30 dark:border-green-500/50 shadow-[0_5px_15px_rgba(34,197,94,0.15)] dark:shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]' 
//                     : 'bg-white dark:bg-slate-900 border-red-500/30 dark:border-red-500/50 shadow-[0_5px_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]'
//             }
//         `}
//         onClick={handleManualClose}
//     >
//         {/* 🔔 Icon with Pulse Effect */}
//         <div className={`p-1.5 rounded-full shrink-0 relative 
//             ${isAlarm ? 'bg-blue-100 dark:bg-blue-500/10' : (isSuccess ? 'bg-green-100 dark:bg-green-500/10' : 'bg-red-100 dark:bg-red-500/10')}
//         `}>
//             {isAlarm ? <BellRing size={22} className="text-blue-600 dark:text-blue-500" /> 
//                      : isSuccess ? <CheckCircle size={22} className="text-green-600 dark:text-green-500" /> 
//                      : <XCircle size={22} className="text-red-600 dark:text-red-500" />}
            
//             <span className={`absolute inset-0 rounded-full animate-ping opacity-30 dark:opacity-20 
//                 ${isAlarm ? 'bg-blue-500' : (isSuccess ? 'bg-green-500' : 'bg-red-500')}
//             `}></span>
//         </div>

//         {/* 📝 Message & Title */}
//         <div className="pr-4">
//             <h4 className={`text-sm font-bold leading-tight 
//                 ${isAlarm ? 'text-blue-600 dark:text-blue-400' : (isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}
//             `}>
//                 {title ? title : (isAlarm ? 'Alarm' : (isSuccess ? 'Success' : 'Failed'))}
//             </h4>
//             <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-tight mt-0.5">{message}</p>
//         </div>

//         {/* ❌ Close Button */}
//         <button onClick={(e) => { e.stopPropagation(); handleManualClose(); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors pl-2 border-l border-gray-200 dark:border-slate-800 ml-2">
//             <X size={16} />
//         </button>
//     </div>
//   );
// };

// export default ToastNotification;





import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, BellRing } from 'lucide-react'; // 🌟 BellRing इम्पोर्ट किया

const ToastNotification = ({ title, message, type, onClose }) => {
  // Animation State
  const [isVisible, setIsVisible] = useState(false);

  // 🌟 Types Define किए
  const isAlarm = type === 'alarm';
  const isSuccess = type === 'success';

  useEffect(() => {
    // 1. Entry Animation
    const entryTimer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    let exitTimer;

    // 2. ⏳ THE MAGIC LOGIC: ऑटो-क्लोज़ सिर्फ तब चलेगा जब यह अलार्म 'ना' हो!
    if (!isAlarm) {
      exitTimer = setTimeout(() => {
        handleClose();
      }, 4000); // 4 सेकंड बाद गायब
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(entryTimer);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [isAlarm]); // 👈 Dependency में isAlarm डाल दिया

  const handleClose = () => {
    // 3. पहले एनीमेशन बंद करो (Slide Out)
    setIsVisible(false);

    // 4. फिर Component Unmount करो (ताकि 500ms वाला एनीमेशन पूरा हो सके)
    setTimeout(() => {
      onClose();
    }, 500); // 🌟 इसे 500ms कर दिया है ताकि transition-all duration-500 पूरा चले
  };

  return (
    <div 
        role="alert"
        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border cursor-pointer
            
            /* 🔥 THE MAGIC ANIMATION CLASS */
            transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
            
            /* Toggle Classes based on isVisible */
            ${isVisible 
                ? 'translate-x-0 opacity-100 scale-100'   // Screen पर (आ गया)
                : 'translate-x-[120%] opacity-0 scale-90' // Screen के बाहर (चला गया)
            }

            /* ✅ LIGHT & DARK MODE LOGIC WITH ALARM (BLUE) */
            ${isAlarm 
                ? 'bg-white dark:bg-slate-900 border-blue-500/30 dark:border-blue-500/50 shadow-[0_5px_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' 
                : isSuccess 
                    ? 'bg-white dark:bg-slate-900 border-green-500/30 dark:border-green-500/50 shadow-[0_5px_15px_rgba(34,197,94,0.15)] dark:shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]' 
                    : 'bg-white dark:bg-slate-900 border-red-500/30 dark:border-red-500/50 shadow-[0_5px_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]'
            }
        `}
        onClick={handleClose} // User क्लिक करके भी हटा सके
    >
        {/* 🔔 Icon with Pulse Effect */}
        <div className={`p-1.5 rounded-full shrink-0 relative 
            ${isAlarm ? 'bg-blue-100 dark:bg-blue-500/10' : (isSuccess ? 'bg-green-100 dark:bg-green-500/10' : 'bg-red-100 dark:bg-red-500/10')}
        `}>
            {isAlarm ? <BellRing size={22} className="text-blue-600 dark:text-blue-500" /> 
                     : isSuccess ? <CheckCircle size={22} className="text-green-600 dark:text-green-500" /> 
                     : <XCircle size={22} className="text-red-600 dark:text-red-500" />}
            
            {/* Ping Animation behind Icon */}
            <span className={`absolute inset-0 rounded-full animate-ping opacity-30 dark:opacity-20 
                ${isAlarm ? 'bg-blue-500' : (isSuccess ? 'bg-green-500' : 'bg-red-500')}
            `}></span>
        </div>

        {/* 📝 Message & Title */}
        <div className="pr-4">
            <h4 className={`text-sm font-bold leading-tight 
                ${isAlarm ? 'text-blue-600 dark:text-blue-400' : (isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}
            `}>
                {title ? title : (isAlarm ? 'Alarm' : (isSuccess ? 'Success' : 'Failed'))}
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-tight mt-0.5">{message}</p>
        </div>

        {/* ❌ Close Button */}
        <button onClick={(e) => { e.stopPropagation(); handleClose(); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors pl-2 border-l border-gray-200 dark:border-slate-800 ml-2">
            <X size={16} />
        </button>
    </div>
  );
};

export default ToastNotification;