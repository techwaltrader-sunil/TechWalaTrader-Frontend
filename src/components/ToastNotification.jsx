import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, BellRing } from 'lucide-react';

const ToastNotification = ({ title, message, type, onClose, autoClose = true, duration = 4000 }) => {
  // Animation State
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const entryTimer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    let exitTimer;
    
    // 🌟 2. कंडीशन लगाएँ: अगर autoClose चालू है (True), तभी टाइमर स्टार्ट करें!
    if (autoClose) {
      exitTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    // Cleanup function
    return () => {
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 400); 
  };

 // 🌟 3 प्रकार के Toast Types: 'success', 'alarm', 'error'
  const isAlarm = type === 'alarm';
  const isSuccess = type === 'success';

  return (
    <div 
        role="alert"
        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border cursor-pointer
            transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
            ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[120%] opacity-0 scale-90'}
            
            /* ✅ DYNAMIC COLORS BASED ON TYPE */
            ${isAlarm 
                ? 'bg-white dark:bg-slate-900 border-blue-500/30 dark:border-blue-500/50 shadow-[0_5px_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' 
                : isSuccess 
                    ? 'bg-white dark:bg-slate-900 border-green-500/30 dark:border-green-500/50 shadow-[0_5px_15px_rgba(34,197,94,0.15)] dark:shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]' 
                    : 'bg-white dark:bg-slate-900 border-red-500/30 dark:border-red-500/50 shadow-[0_5px_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]'
            }
        `}
        onClick={handleClose}
    >
        {/* 🔔 Dynamic Icon with Pulse Effect */}
        <div className={`p-1.5 rounded-full shrink-0 relative 
            ${isAlarm ? 'bg-blue-100 dark:bg-blue-500/10' : (isSuccess ? 'bg-green-100 dark:bg-green-500/10' : 'bg-red-100 dark:bg-red-500/10')}
        `}>
            {isAlarm ? <BellRing size={22} className="text-blue-600 dark:text-blue-500" /> 
                     : isSuccess ? <CheckCircle size={22} className="text-green-600 dark:text-green-500" /> 
                     : <XCircle size={22} className="text-red-600 dark:text-red-500" />}
            
            <span className={`absolute inset-0 rounded-full animate-ping opacity-30 dark:opacity-20 
                ${isAlarm ? 'bg-blue-500' : (isSuccess ? 'bg-green-500' : 'bg-red-500')}
            `}></span>
        </div>

        {/* 📝 Message & Title */}
        <div className="pr-4">
            <h4 className={`text-sm font-bold leading-tight 
                ${isAlarm ? 'text-blue-600 dark:text-blue-400' : (isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}
            `}>
                {/* अगर कस्टम title भेजा है तो वो दिखेगा, वरना डिफ़ॉल्ट (Success/Alarm/Failed) */}
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