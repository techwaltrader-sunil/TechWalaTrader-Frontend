import React from 'react';
import { X } from 'lucide-react';

export const AlertConfigModal = ({
    alertConfigModal,
    setAlertConfigModal,
    handleAddAlert,
    setPriceAlerts,
    chartRef,
    baseLotSize,
    symbol
}) => {
    // अगर मोडल visible नहीं है, तो कुछ भी रेंडर मत करो
    if (!alertConfigModal.visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl w-[500px] max-w-[95vw] flex flex-col animate-in fade-in zoom-in duration-200 font-sans">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">
                        {alertConfigModal.mode === 'create' ? 'Create Alert' : 'Edit Alert'} on {alertConfigModal.symbol}
                    </h3>
                    <button onClick={() => setAlertConfigModal({ ...alertConfigModal, visible: false })} className="text-gray-400 hover:text-gray-700">
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* Body (Forms) */}
                <div className="px-6 py-5 flex flex-col gap-4 text-sm text-gray-700">
                    
                    {/* Condition Row */}
                    <div className="flex items-center gap-4">
                        <label className="w-24 text-gray-500">Condition</label>
                        <div className="flex-1 flex gap-2">
                            <select className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 bg-gray-50 flex-1">
                                <option>{alertConfigModal.symbol}</option>
                            </select>
                            <select 
                                className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 bg-white flex-1"
                                value={alertConfigModal.condition}
                                onChange={(e) => setAlertConfigModal({...alertConfigModal, condition: e.target.value})}
                            >
                                <option value="Crossing">Crossing</option>
                                <option value="Crossing Up">Crossing Up</option>
                                <option value="Crossing Down">Crossing Down</option>
                                <option value="Greater Than">Greater Than</option>
                                <option value="Less Than">Less Than</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Price Value Row */}
                    <div className="flex items-center gap-4">
                        <div className="w-24"></div>
                        <div className="flex-1 flex gap-2">
                            <select className="border border-gray-300 rounded px-3 py-1.5 outline-none bg-gray-50 w-24">
                                <option>Value</option>
                            </select>
                            <input 
                                type="number" 
                                value={alertConfigModal.price}
                                onChange={(e) => setAlertConfigModal({...alertConfigModal, price: parseFloat(e.target.value)})}
                                className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 flex-1 font-semibold"
                            />
                        </div>
                    </div>

                    {/* Trigger Row */}
                    <div className="flex items-center gap-4 mt-2">
                        <label className="w-24 text-gray-500">Trigger</label>
                        <select 
                            className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 bg-white flex-1"
                            value={alertConfigModal.trigger}
                            onChange={(e) => setAlertConfigModal({...alertConfigModal, trigger: e.target.value})}
                        >
                            <option>Only Once</option>
                            <option>Once Per Bar</option>
                            <option>Once Per Bar Close</option>
                        </select>
                    </div>

                    <hr className="border-gray-100 my-2" />

                    {/* 👻 1. THE GHOST TRADE TOGGLE */}
                    <div className="flex items-center justify-between bg-blue-50/50 px-3 py-2 rounded border border-blue-100">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-blue-800">Enable Auto-Trade ⚡</span>
                            <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">GHOST ORDER</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={alertConfigModal.isAutoTrade}
                                onChange={(e) => setAlertConfigModal({...alertConfigModal, isAutoTrade: e.target.checked})}
                            />
                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* 🎯 2. DYNAMIC AUTO-TRADE CONFIG BOX */}
                    {alertConfigModal.isAutoTrade && (
                        <div className="flex flex-col gap-3 bg-gray-50 p-3 rounded border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                            
                            {/* Dropdowns Row */}
                            <div className="flex gap-2 w-full">
                                <select 
                                    className={`flex-1 border rounded px-2 py-1.5 outline-none font-bold text-sm min-w-0 ${alertConfigModal.tradeSide === 'SELL' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}
                                    value={alertConfigModal.tradeSide || 'BUY'}
                                    onChange={(e) => setAlertConfigModal({...alertConfigModal, tradeSide: e.target.value})}
                                >
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                                <select 
                                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 outline-none bg-white font-bold text-sm min-w-0"
                                    value={alertConfigModal.tradeOptionType || 'CE'}
                                    onChange={(e) => setAlertConfigModal({...alertConfigModal, tradeOptionType: e.target.value})}
                                >
                                    <option value="CE">CE (Call)</option>
                                    <option value="PE">PE (Put)</option>
                                </select>
                            </div>
                            
                            {/* Inputs Row */}
                            <div className="flex gap-2 w-full">
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase truncate">Quantity</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 bg-white rounded px-2 py-1.5 outline-none text-sm font-semibold focus:border-blue-400 transition-colors" 
                                        value={alertConfigModal.tradeQty !== undefined ? alertConfigModal.tradeQty : baseLotSize}
                                        onChange={(e) => setAlertConfigModal({...alertConfigModal, tradeQty: Number(e.target.value)})} 
                                    />
                                </div>
                                
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase truncate">SL (Pts)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-red-200 bg-red-50 text-red-700 rounded px-2 py-1.5 outline-none text-sm font-semibold focus:border-red-400 transition-colors" 
                                        value={alertConfigModal.tradeSl !== undefined ? alertConfigModal.tradeSl : 20}
                                        onChange={(e) => setAlertConfigModal({...alertConfigModal, tradeSl: Number(e.target.value)})} 
                                    />
                                </div>
                                
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase truncate">TP (Pts)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-green-200 bg-green-50 text-green-700 rounded px-2 py-1.5 outline-none text-sm font-semibold focus:border-green-400 transition-colors" 
                                        value={alertConfigModal.tradeTp !== undefined ? alertConfigModal.tradeTp : 50}
                                        onChange={(e) => setAlertConfigModal({...alertConfigModal, tradeTp: Number(e.target.value)})} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Alert Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500">Alert name</label>
                        <input 
                            type="text" 
                            value={alertConfigModal.alertName}
                            onChange={(e) => setAlertConfigModal({...alertConfigModal, alertName: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Optional"
                        />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-500">Message</label>
                        <textarea 
                            rows="3"
                            value={alertConfigModal.message}
                            onChange={(e) => setAlertConfigModal({...alertConfigModal, message: e.target.value})}
                            className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                    <button 
                        onClick={() => setAlertConfigModal({ ...alertConfigModal, visible: false })}
                        className="px-4 py-2 rounded text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            const targetPrice = alertConfigModal.price;
                            const alertId = alertConfigModal.id;

                            const tradePayload = {
                                id: alertId,
                                price: targetPrice,
                                
                                alertName: alertConfigModal.alertName,
                                message: alertConfigModal.message,

                                isAutoTrade: alertConfigModal.isAutoTrade,
                                tradeConfig: alertConfigModal.isAutoTrade ? {
                                    side: alertConfigModal.tradeSide || 'BUY',
                                    optionType: alertConfigModal.tradeOptionType || 'CE',
                                    qty: alertConfigModal.tradeQty !== undefined ? alertConfigModal.tradeQty : baseLotSize, 
                                    sl: alertConfigModal.tradeSl !== undefined ? alertConfigModal.tradeSl : 20,
                                    tp: alertConfigModal.tradeTp !== undefined ? alertConfigModal.tradeTp : 50
                                } : null
                            };

                            if (alertConfigModal.mode === 'create') {
                                handleAddAlert(tradePayload);
                            } else {
                                setPriceAlerts(prev => prev.map(a => a.id === alertId ? { 
                                    ...a, 
                                    price: targetPrice, 
                                    isAutoTrade: alertConfigModal.isAutoTrade,
                                    tradeConfig: tradePayload.tradeConfig 
                                } : a));

                                chartRef.current.overrideOverlay({
                                    id: alertId,
                                    points: [{ value: targetPrice }],
                                    extendData: { isHovered: false, price: targetPrice, symbol: alertConfigModal.symbol || 'NIFTY' }
                                });
                            }

                            setAlertConfigModal({ ...alertConfigModal, visible: false });
                        }}
                        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors"
                    >
                        {alertConfigModal.mode === 'create' ? 'Create' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};