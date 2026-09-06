import React from 'react';
import { X } from 'lucide-react';

export const DeleteAlertModal = ({
    deleteAlertModal,
    setDeleteAlertModal,
    chartRef,
    chartContainerRef,
    setPriceAlerts
}) => {
    if (!deleteAlertModal.visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl w-[400px] max-w-[90vw] flex flex-col animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Delete this alert?</h3>
                    <button 
                        onClick={() => setDeleteAlertModal({ ...deleteAlertModal, visible: false })}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-6 text-[15px] text-gray-700">
                    Doing this will permanently delete your <span className="font-bold">"{deleteAlertModal.symbol} Crossing {parseFloat(deleteAlertModal.price).toFixed(2)}"</span> alert.
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                    <button 
                        onClick={() => setDeleteAlertModal({ ...deleteAlertModal, visible: false })}
                        className="px-4 py-2 rounded text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                    >
                        No
                    </button>
                    <button 
                        onClick={() => {
                            // 🎯 1. चार्ट से लाइन हटाएँ
                            if (chartRef.current) {
                                chartRef.current.removeOverlay({ id: deleteAlertModal.alertId });
                                if (chartContainerRef?.current) chartContainerRef.current.style.removeProperty('cursor');
                            }
                            // 🎯 2. बैकग्राउंड स्टेट से हटाएँ
                            setPriceAlerts(prev => prev.filter(a => a.id !== deleteAlertModal.alertId));
                            
                            // 🎯 3. मोडल बंद करें
                            setDeleteAlertModal({ ...deleteAlertModal, visible: false });
                        }}
                        className="px-5 py-2 rounded bg-[#f23645] hover:bg-[#d62837] text-white text-sm font-medium shadow-sm transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};