import React from 'react';
import { X } from 'lucide-react';

export const TradePanel = ({
    showTradePanel,
    setShowTradePanel,
    tradeConfig,
    setTradeConfig,
    baseLotSize,
    symbol,
    chartRef,
    setOpenPositions,
    setToastData,
    setCancelOrderModal // 👈 लाइन के क्लिक पर कैंसिल मोडल खोलने के लिए
}) => {
    // अगर पैनल visible नहीं है, तो कुछ रेंडर मत करो
    if (!showTradePanel) return null;

    // 🚀 DROPDOWN RENDER HELPER (CustomChart से यहाँ शिफ्ट कर दिया)
    const renderStrikeTypeInput = () => {
        const criteria = tradeConfig.strikeCriteria;
        const stepPt = symbol === 'NIFTY BANK' ? 100 : 50; 
        const stepPct = symbol === 'NIFTY BANK' ? 1.0 : 0.5;

        const generateOptions = (step, max, suffix) => {
            let opts = [];
            for (let i = max; i >= step; i -= step) opts.push(`ITM ${suffix ? i.toFixed(1) + '%' : i}`);
            opts.push("ATM");
            for (let i = step; i <= max; i += step) opts.push(`OTM ${suffix ? i.toFixed(1) + '%' : i}`);
            return opts;
        };

        const inputClass = "w-full border border-gray-300 rounded px-2 py-1.5 text-[12px] outline-none focus:border-blue-500 bg-white font-medium text-gray-700";

        if (criteria === "ATM pt" || criteria === "ATM %") {
            const options = criteria === "ATM pt" ? generateOptions(stepPt, 1000, false) : generateOptions(stepPct, 10.0, true);
            return (
                <select className={inputClass} value={tradeConfig.strikeType} onChange={(e) => setTradeConfig({...tradeConfig, strikeType: e.target.value})}>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        }
        if (criteria === "Delta") return <input type="number" step="0.1" min="0" max="1" placeholder="0.5" value={tradeConfig.strikeType} onChange={(e) => setTradeConfig({...tradeConfig, strikeType: e.target.value})} className={inputClass} />;
        if (criteria.includes("CP")) return <input type="number" placeholder="Premium Value" value={tradeConfig.strikeType} onChange={(e) => setTradeConfig({...tradeConfig, strikeType: e.target.value})} className={inputClass} />;
        return null;
    };

    return (
        <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] animate-in slide-in-from-right duration-200 h-full">
            
            {/* Header: BUY / SELL */}
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 shrink-0">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-sm">Order Panel</span>
                    <button onClick={() => setShowTradePanel(false)} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-100">
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-md">
                    <button onClick={() => setTradeConfig({...tradeConfig, side: 'BUY'})} className={`flex-1 py-1.5 text-[13px] font-bold rounded ${tradeConfig.side === 'BUY' ? 'bg-white shadow text-[#26a69a]' : 'text-gray-500 hover:text-gray-700'}`}>BUY (Long)</button>
                    <button onClick={() => setTradeConfig({...tradeConfig, side: 'SELL'})} className={`flex-1 py-1.5 text-[13px] font-bold rounded ${tradeConfig.side === 'SELL' ? 'bg-white shadow text-[#ef5350]' : 'text-gray-500 hover:text-gray-700'}`}>SELL (Short)</button>
                </div>
            </div>

            {/* Body: Inputs & Configuration (Scrollable Area) */}
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* 🌟 THE DYNAMIC PRICE DISPLAY 🌟 */}
                <div className="flex justify-between items-center bg-gray-50 px-3 py-2.5 rounded border border-gray-200 shadow-inner shrink-0">
                    {tradeConfig.instrument === 'Options' ? (
                        <>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Strike Selected</span>
                                <span className="text-[15px] font-extrabold text-blue-700">{tradeConfig.nearestStrike} {tradeConfig.optionType}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Premium (LTP)</span>
                                <span className={`text-[15px] font-extrabold ${tradeConfig.premium > 0 ? 'text-gray-800' : 'text-orange-500 animate-pulse'}`}>
                                    {tradeConfig.premium > 0 ? `₹${tradeConfig.premium.toFixed(2)}` : 'Fetching... ⏳'}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-xs font-semibold text-gray-500">Future Limit Price</span>
                            <span className="text-[15px] font-bold text-gray-800">{tradeConfig.clickedPrice.toFixed(2)}</span>
                        </>
                    )}
                </div>

                {/* Instrument Type */}
                <div className="shrink-0">
                    <div className="flex bg-gray-50 border border-gray-200 rounded text-[13px]">
                        <button onClick={() => setTradeConfig({...tradeConfig, instrument: 'Options'})} className={`flex-1 py-1.5 font-medium ${tradeConfig.instrument === 'Options' ? 'bg-blue-600 text-white rounded shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>Options</button>
                        <button onClick={() => setTradeConfig({...tradeConfig, instrument: 'Futures'})} className={`flex-1 py-1.5 font-medium ${tradeConfig.instrument === 'Futures' ? 'bg-blue-600 text-white rounded shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>Futures</button>
                    </div>
                </div>

                {/* Conditional: Option Type (Call / Put) & Strike Criteria */}
                {tradeConfig.instrument === 'Options' && (
                    <div className="flex flex-col gap-3 shrink-0">
                        {/* Option Type Toggle */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Option Type</label>
                            <div className="flex gap-2">
                                <button onClick={() => setTradeConfig({...tradeConfig, optionType: 'CE'})} className={`flex-1 py-1.5 border rounded text-[13px] font-bold transition-colors ${tradeConfig.optionType === 'CE' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>CALL (CE)</button>
                                <button onClick={() => setTradeConfig({...tradeConfig, optionType: 'PE'})} className={`flex-1 py-1.5 border rounded text-[13px] font-bold transition-colors ${tradeConfig.optionType === 'PE' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>PUT (PE)</button>
                            </div>
                        </div>

                        {/* STRIKE CRITERIA DROPDOWNS */}
                        <div className="grid grid-cols-2 gap-3 bg-blue-50/30 p-2.5 rounded-lg border border-blue-100">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Strike Criteria</label>
                                <select 
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-[12px] font-medium text-gray-700 outline-none focus:border-blue-500 bg-white"
                                    value={tradeConfig.strikeCriteria}
                                    onChange={(e) => {
                                        const newCri = e.target.value;
                                        let newInitial = "ATM";
                                        if(newCri === 'Delta') newInitial = 0.5;
                                        else if(newCri.includes('CP')) newInitial = "";
                                        setTradeConfig({...tradeConfig, strikeCriteria: newCri, strikeType: newInitial});
                                    }}
                                >
                                    {["ATM pt", "ATM %", "Delta", "CP", "CP >=", "CP <="].map(cri => <option key={cri} value={cri}>{cri}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Strike Selection</label>
                                {renderStrikeTypeInput()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Expiry Dropdown */}
                <div className="shrink-0">
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Expiry</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] font-medium text-gray-700 outline-none focus:border-blue-500 bg-white" value={tradeConfig.expiry} onChange={(e) => setTradeConfig({...tradeConfig, expiry: e.target.value})}>
                        <option value="Current Week">Current Weekly</option>
                        <option value="Next Week">Next Weekly</option>
                    </select>
                </div>

                {/* Quantity Selector */}
                <div className="shrink-0">
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 flex justify-between">
                        <span>Quantity (Lots)</span>
                        <span className="text-gray-400 font-normal">Lot Size: {baseLotSize}</span>
                    </label>
                    <div className="flex border border-gray-300 rounded bg-white overflow-hidden">
                        <button 
                            onClick={() => setTradeConfig(p => ({...p, qty: Math.max(baseLotSize, p.qty - baseLotSize)}))} 
                            className="px-4 py-1.5 bg-gray-50 text-gray-600 font-bold border-r border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            −
                        </button>
                        <input 
                            type="number" 
                            value={tradeConfig.qty} 
                            onChange={(e) => setTradeConfig({...tradeConfig, qty: Number(e.target.value)})} 
                            className="w-full text-center outline-none text-[14px] font-semibold" 
                        />
                        <button 
                            onClick={() => setTradeConfig(p => ({...p, qty: p.qty + baseLotSize}))} 
                            className="px-4 py-1.5 bg-gray-50 text-gray-600 font-bold border-l border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* SL & TP BLOCK */}
                <div className="grid grid-cols-2 gap-3 mt-1 shrink-0 pb-4">
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Stop Loss (Pts)</label>
                        <input 
                            type="number" placeholder="e.g. 20"
                            value={tradeConfig.slValue || ''}
                            onChange={(e) => setTradeConfig({...tradeConfig, slValue: Number(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-red-400 font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Take Profit (Pts)</label>
                        <input 
                            type="number" placeholder="e.g. 40"
                            value={tradeConfig.tpValue || ''}
                            onChange={(e) => setTradeConfig({...tradeConfig, tpValue: Number(e.target.value)})}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] outline-none focus:border-green-400 font-medium"
                        />
                    </div>
                </div>

            </div>

            {/* Footer: Dynamic Margin & Button */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex justify-between text-[11px] text-gray-500 mb-3 px-1">
                    <span>Margin Required</span>
                    <span className="font-bold text-gray-800">
                        {tradeConfig.instrument === 'Options' 
                            ? (tradeConfig.side === 'BUY'
                                ? (tradeConfig.premium > 0 ? `~ ₹${(tradeConfig.qty * tradeConfig.premium).toLocaleString(undefined, {maximumFractionDigits: 2})}` : 'Calculating...')
                                : (tradeConfig.nearestStrike > 0 ? `~ ₹${(tradeConfig.qty * tradeConfig.nearestStrike * 0.1).toLocaleString(undefined, {maximumFractionDigits: 0})} (Short Margin)` : 'Calculating...')
                            )
                            : `~ ₹${(tradeConfig.qty * tradeConfig.clickedPrice * 0.1).toLocaleString(undefined, {maximumFractionDigits: 0})} (10%)`
                        }
                    </span>
                </div>
                <button 
                    className={`w-full py-3 rounded-md text-white font-bold text-[14px] shadow-sm transition-transform active:scale-[0.98] ${tradeConfig.side === 'BUY' ? 'bg-[#26a69a] hover:bg-[#208b81]' : 'bg-[#ef5350] hover:bg-[#d84a48]'}`}
                    onClick={() => {
                        if (!chartRef.current) return;

                        const posId = `trade_${Date.now()}`;
                        const spotEntry = tradeConfig.clickedPrice;

                        const isBullish = (tradeConfig.side === 'BUY' && tradeConfig.optionType === 'CE') || 
                                          (tradeConfig.side === 'SELL' && tradeConfig.optionType === 'PE');

                        let slSpot = 0; let tpSpot = 0;
                        if (isBullish) {
                            slSpot = tradeConfig.slValue > 0 ? spotEntry - tradeConfig.slValue : 0;
                            tpSpot = tradeConfig.tpValue > 0 ? spotEntry + tradeConfig.tpValue : 0;
                        } else {
                            slSpot = tradeConfig.slValue > 0 ? spotEntry + tradeConfig.slValue : 0;
                            tpSpot = tradeConfig.tpValue > 0 ? spotEntry - tradeConfig.tpValue : 0;
                        }

                        // 💾 State में सेव करें
                        setOpenPositions(prev => [...prev, {
                            id: posId, instrument: tradeConfig.instrument, side: tradeConfig.side,
                            optionType: tradeConfig.optionType, strike: tradeConfig.nearestStrike,
                            qty: tradeConfig.qty, entryPremium: tradeConfig.premium, entrySpot: spotEntry,
                            slSpot: slSpot, tpSpot: tpSpot, pnl: 0, 
                            status: 'PENDING',
                            isBullish: isBullish, 
                            isAocPending: false
                        }]);

                        const chart = chartRef.current;

                        // 🔵 1. CREATE ENTRY LINE
                        chart.createOverlay({
                            name: 'customEntryLine',
                            id: `${posId}_entry`,
                            groupId: posId,
                            extendData: { qty: tradeConfig.qty, pnl: '⏳ PENDING' },
                            points: [{ value: spotEntry }],
                            onClick: function() {
                                setCancelOrderModal({ visible: true, type: 'ENTRY', posId: posId });
                                return true; 
                            }
                        });

                        // 🟡 2. CREATE SL LINE
                        if (slSpot > 0) {
                            chart.createOverlay({
                                name: 'customSlLine',
                                id: `${posId}_sl`,
                                groupId: posId,
                                extendData: { qty: tradeConfig.qty, spotEntry: spotEntry, isBullish: isBullish },
                                points: [{ value: slSpot }],
                                onClick: function() {
                                    setCancelOrderModal({ visible: true, type: 'SL', posId: posId });
                                    return true;
                                }
                            });
                        }

                        // 🟢 3. CREATE TP LINE
                        if (tpSpot > 0) {
                            chart.createOverlay({
                                name: 'customTpLine',
                                id: `${posId}_tp`,
                                groupId: posId,
                                extendData: { qty: tradeConfig.qty, spotEntry: spotEntry, isBullish: isBullish },
                                points: [{ value: tpSpot }],
                                onClick: function() {
                                    setCancelOrderModal({ visible: true, type: 'TP', posId: posId });
                                    return true;
                                }
                            });
                        }

                        // ✨ Clean UI
                        setShowTradePanel(false);
                        if (setToastData) setToastData({ title: "Order Placed", message: `Bracket Order Active @ ${spotEntry.toFixed(2)}`, type: 'success' });
                    }}
                >
                    {tradeConfig.side} {tradeConfig.qty} {tradeConfig.instrument === 'Options' ? `${tradeConfig.nearestStrike} ${tradeConfig.optionType}` : 'FUT'}
                </button>
            </div>
        </div>
    );
};