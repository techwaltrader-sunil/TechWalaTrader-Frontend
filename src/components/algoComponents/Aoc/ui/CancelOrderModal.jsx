import React from 'react';
import { X } from 'lucide-react';

export const CancelOrderModal = ({
    cancelOrderModal,
    setCancelOrderModal,
    chartRef,
    setOpenPositions,
    setToastData
}) => {
    // अगर मोडल visible नहीं है, तो कुछ रेंडर मत करो
    if (!cancelOrderModal.visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl w-[400px] max-w-[90vw] flex flex-col animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {cancelOrderModal.type === 'ENTRY' ? 'Square Off Position?' : `Remove ${cancelOrderModal.type}?`}
                    </h3>
                    <button 
                        onClick={() => setCancelOrderModal({ ...cancelOrderModal, visible: false })}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* Body (Dynamic Text) */}
                <div className="px-6 pb-6 text-[15px] text-gray-700">
                    {cancelOrderModal.type === 'ENTRY' 
                        ? "Are you sure you want to close this entire trade? This will remove your Entry, SL, and TP." 
                        : `Are you sure you want to permanently remove the ${cancelOrderModal.type === 'SL' ? 'Stop Loss' : 'Take Profit'}? Your position will remain open without it.`
                    }
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                    <button 
                        onClick={() => setCancelOrderModal({ ...cancelOrderModal, visible: false })}
                        className="px-4 py-2 rounded text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                    >
                        No, Keep it
                    </button>
                    <button 
                        onClick={() => {
                            const { type, posId } = cancelOrderModal;
                            const currentChart = chartRef.current;
                            if (!currentChart) return;

                            // 🎯 1. अगर ENTRY काटी जा रही है (Square-Off)
                            if (type === 'ENTRY') {
                                const dataList = currentChart.getDataList();
                                const latestSpot = dataList[dataList.length - 1]?.close || 0;
                                
                                currentChart.removeOverlay({ groupId: posId }); // तीनों लाइनें साफ़
                                setOpenPositions(prev => prev.map(p => p.id === posId ? { ...p, status: 'CLOSED', exitSpot: latestSpot } : p));
                                if (setToastData) setToastData({ title: "🚫 Order Exited", message: "Position manually closed from chart.", type: 'info' });
                            } 
                            // 🎯 2. अगर सिर्फ SL हटाया जा रहा है
                            else if (type === 'SL') {
                                currentChart.removeOverlay({ id: `${posId}_sl` });
                                setOpenPositions(prev => prev.map(p => p.id === posId ? { ...p, slSpot: 0 } : p));
                                if (setToastData) setToastData({ title: "SL Removed", message: "Stop Loss cancelled manually.", type: 'info' });
                            } 
                            // 🎯 3. अगर सिर्फ TP हटाया जा रहा है
                            else if (type === 'TP') {
                                currentChart.removeOverlay({ id: `${posId}_tp` });
                                setOpenPositions(prev => prev.map(p => p.id === posId ? { ...p, tpSpot: 0 } : p));
                                if (setToastData) setToastData({ title: "TP Removed", message: "Take Profit cancelled manually.", type: 'info' });
                            }

                            // मोडल बंद करें
                            setCancelOrderModal({ visible: false, type: '', posId: '' });
                        }}
                        className="px-5 py-2 rounded bg-[#f23645] hover:bg-[#d62837] text-white text-sm font-medium shadow-sm transition-colors"
                    >
                        {cancelOrderModal.type === 'ENTRY' ? 'Yes, Square Off' : 'Yes, Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
};