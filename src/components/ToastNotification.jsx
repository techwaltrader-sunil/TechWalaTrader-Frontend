

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ToastNotification = ({ message, type, onClose }) => {
  // Animation State
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Entry Animation
    const entryTimer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // 2. Auto Close Timer (4 seconds)
    const exitTimer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(exitTimer);
  }, []);

  const handleClose = () => {
    // 3. Pehle Animation band karo (Slide Out)
    setIsVisible(false);

    // 4. Phir Component Unmount karo
    setTimeout(() => {
      onClose();
    }, 400); 
  };

  const isSuccess = type === 'success';

  return (
    <div 
        role="alert"
        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border cursor-pointer
            
            /* 🔥 THE MAGIC ANIMATION CLASS */
            transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
            
            /* Toggle Classes based on isVisible */
            ${isVisible 
                ? 'translate-x-0 opacity-100 scale-100'   // Screen par (Aa gaya)
                : 'translate-x-[120%] opacity-0 scale-90' // Screen ke bahar (Chala gaya)
            }

            /* ✅ LIGHT & DARK MODE LOGIC */
            ${isSuccess 
                ? 'bg-white dark:bg-slate-900 border-green-500/30 dark:border-green-500/50 shadow-[0_5px_15px_rgba(34,197,94,0.15)] dark:shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]' 
                : 'bg-white dark:bg-slate-900 border-red-500/30 dark:border-red-500/50 shadow-[0_5px_15px_rgba(239,68,68,0.15)] dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]'
            }
        `}
        onClick={handleClose} // User click karke bhi hata sake
    >
        {/* Icon with Pulse Effect */}
        <div className={`p-1.5 rounded-full shrink-0 relative ${isSuccess ? 'bg-green-100 dark:bg-green-500/10' : 'bg-red-100 dark:bg-red-500/10'}`}>
            {isSuccess ? <CheckCircle size={22} className="text-green-600 dark:text-green-500" /> : <XCircle size={22} className="text-red-600 dark:text-red-500" />}
            
            {/* Ping Animation behind Icon */}
            <span className={`absolute inset-0 rounded-full animate-ping opacity-30 dark:opacity-20 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </div>

        {/* Message */}
        <div className="pr-4">
            <h4 className={`text-sm font-bold leading-tight ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isSuccess ? 'Success' : 'Failed'}
            </h4>
            {/* Description Text Color updated for modes */}
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-tight mt-0.5">{message}</p>
        </div>

        {/* Close Button */}
        <button onClick={(e) => { e.stopPropagation(); handleClose(); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors pl-2 border-l border-gray-200 dark:border-slate-800 ml-2">
            <X size={16} />
        </button>
    </div>
  );
};

export default ToastNotification;