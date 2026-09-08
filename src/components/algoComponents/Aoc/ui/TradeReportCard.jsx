// import React from 'react';

// // 🎯 onClose प्रॉप जोड़ दिया है ताकि पैरेंट को पता चले कि कार्ड बंद करना है
// export const TradeReportCard = ({ positions, onClose }) => {
//     const historyTrades = positions.filter(p => p.status === 'OPEN' || p.status === 'CLOSED');

//     const formatTime = (ts) => {
//         if (!ts) return '--:--';
//         const d = new Date(ts);
//         let hours = d.getHours();
//         let minutes = d.getMinutes();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12 || 12;
//         minutes = minutes < 10 ? '0' + minutes : minutes;
//         return `${hours}:${minutes} ${ampm}`;
//     };

//     // 📅 टाइम को 08 Sep 2026 फॉर्मेट में बदलने का फंक्शन
//     const formatDate = (ts) => {
//         if (!ts) return '--';
//         const d = new Date(ts);
//         const day = String(d.getDate()).padStart(2, '0');
//         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         const month = monthNames[d.getMonth()];
//         const year = d.getFullYear();
//         return `${day} ${month} ${year}`;
//     };

//     // 🧠 सिग्नल के टेक्स्ट को पढ़कर उसका सही रंग तय करने वाला स्मार्ट फंक्शन
//     const getSignalColor = (text) => {
//         if (!text) return 'bg-gray-100 text-gray-600 border-gray-200';
//         const lower = text.toLowerCase();
        
//         if (lower.includes('bear') || lower.includes('blood') || lower.includes('sell')) {
//             return 'bg-red-50 text-red-700 border-red-200';
//         }
//         if (lower.includes('bull') || lower.includes('buy') || lower.includes('rocket')) {
//             return 'bg-green-50 text-green-700 border-green-200';
//         }
//         if (lower.includes('trap') || lower.includes('squeez') || lower.includes('volatil')) {
//             return 'bg-orange-50 text-orange-700 border-orange-200';
//         }
//         return 'bg-blue-50 text-blue-700 border-blue-200'; // Default
//     };

//     return (
//         // 🌌 THE MODAL OVERLAY: फुल स्क्रीन डार्क बैकग्राउंड
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            
//             {/* 📦 THE REPORT BOX */}
//             <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh]">
                
//                 {/* 🏷️ HEADER & CLOSE BUTTON */}
//                 <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center shrink-0">
//                     <h2 className="font-bold text-lg">📊 Backtest Trade Report</h2>
//                     <button 
//                         onClick={onClose} 
//                         className="text-white hover:text-red-300 font-bold text-2xl leading-none"
//                     >
//                         &times;
//                     </button>
//                 </div>

//                 {/* 📊 TABLE AREA */}
//                 <div className="overflow-y-auto w-full">
//                     {historyTrades.length === 0 ? (
//                         <div className="p-10 text-center text-gray-500 font-medium">
//                             No trades taken yet. Run the simulator to see your report!
//                         </div>
//                     ) : (
//                         <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
//                             <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 sticky top-0 shadow-sm">
//                                 <tr>
//                                     <th className="px-4 py-3">Date</th>
//                                     <th className="px-4 py-3">Symbol</th>
//                                     <th className="px-4 py-3">Trans.</th>
//                                     <th className="px-4 py-3 text-center">Qty</th>
//                                     <th className="px-4 py-3 text-center">AOC Signal</th>
//                                     <th className="px-4 py-3">Entry Price</th>
//                                     <th className="px-4 py-3">Exit Price</th>
//                                     <th className="px-4 py-3 text-right">P&L</th>
//                                     <th className="px-4 py-3 text-center">Status / Exit</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                                 {historyTrades.map((trade, idx) => {
//                                     const isProfit = trade.pnl >= 0;
//                                     const pnlColor = isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
//                                     const sideColor = trade.side === 'BUY' ? 'text-blue-600' : 'text-orange-500';

//                                     return (
//                                         <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
//                                             <td className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
//                                                 {formatDate(trade.entryTime || Date.now())}
//                                             </td>
//                                             <td className="px-4 py-3 font-medium">{`${trade.symbol || 'NIFTY'} ${trade.strike} ${trade.optionType}`}</td>
//                                             <td className={`px-4 py-3 font-bold ${sideColor}`}>{trade.side}</td>
//                                             <td className="px-4 py-3 text-center">{trade.qty}</td>

//                                             <td className="px-4 py-3 text-center">
//                                                 {trade.aocConfirmation && trade.aocConfirmation !== 'N/A' ? (
//                                                     <div 
//                                                         className={`px-3 py-1 border rounded text-[10px] font-extrabold truncate max-w-[160px] mx-auto shadow-sm transition-colors cursor-help ${getSignalColor(trade.aocConfirmation)}`} 
//                                                         title={trade.aocConfirmation}
//                                                     >
//                                                         {/* ✂️ जादू यहाँ है: '-' से टेक्स्ट को काटा और सिर्फ पहला हिस्सा लिया */}
//                                                         {trade.aocConfirmation.split('-')[0].trim()}
//                                                     </div>
//                                                 ) : (
//                                                     <span className="text-gray-400 font-bold">-</span>
//                                                 )}
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 ₹{Number(trade.entryPremium).toFixed(2)} <br/>
//                                                 <span className="text-xs text-gray-400">({formatTime(trade.entryTime || Date.now())})</span>
//                                             </td>
                                            
//                                             <td className="px-4 py-3">
//                                                 {trade.status === 'CLOSED' ? (
//                                                     <>
//                                                         ₹{Number(trade.exitPremium).toFixed(2)} <br/>
//                                                         <span className="text-xs text-gray-400">({formatTime(trade.exitTime)})</span>
//                                                     </>
//                                                 ) : (
//                                                     <span className="text-yellow-500 font-medium">Live...</span>
//                                                 )}
//                                             </td>
                                            
//                                             <td className={`px-4 py-3 text-right font-bold text-base ${pnlColor}`}>
//                                                 {isProfit ? '+' : '-'} ₹{Math.abs(trade.pnl || 0)}
//                                             </td>
                                            
//                                             <td className="px-4 py-3 text-center">
//                                                 {trade.status === 'CLOSED' ? (
//                                                     <span className={`px-3 py-1 rounded text-xs font-bold ${trade.exitReason === 'TP Hit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                                                         {trade.exitReason}
//                                                     </span>
//                                                 ) : (
//                                                     <span className="px-3 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700 animate-pulse">OPEN</span>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };



import React from 'react';

export const TradeReportCard = ({ positions, onClose }) => {
    const historyTrades = positions.filter(p => p.status === 'OPEN' || p.status === 'CLOSED');

    // 🧮 1. THE BRAIN: Summary Calculations
    const totalTrades = historyTrades.length;
    const closedTrades = historyTrades.filter(t => t.status === 'CLOSED');
    const winningTrades = closedTrades.filter(t => t.pnl > 0).length;
    const winRate = closedTrades.length > 0 ? ((winningTrades / closedTrades.length) * 100).toFixed(1) : 0;
    const totalPnl = historyTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const isTotalProfit = totalPnl >= 0;

    const formatTime = (ts) => {
        if (!ts) return '--:--';
        const d = new Date(ts);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    };

    const formatDate = (ts) => {
        if (!ts) return '--';
        const d = new Date(ts);
        const day = String(d.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${day} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    };

    const getSignalColor = (text) => {
        if (!text) return 'bg-gray-100 text-gray-600 border-gray-200';
        const lower = text.toLowerCase();
        if (lower.includes('bear') || lower.includes('blood') || lower.includes('sell')) return 'bg-red-50 text-red-700 border-red-200';
        if (lower.includes('bull') || lower.includes('buy') || lower.includes('rocket')) return 'bg-green-50 text-green-700 border-green-200';
        if (lower.includes('trap') || lower.includes('squeez') || lower.includes('volatil')) return 'bg-orange-50 text-orange-700 border-orange-200';
        return 'bg-blue-50 text-blue-700 border-blue-200';
    };

    // 📥 EXPORT TO CSV (With Summary)
    const handleExportCSV = () => {
        const headers = ["Date", "Time", "Symbol", "Trans.", "Qty", "AOC Signal", "Entry Price", "Exit Price", "P&L", "Status"];
        const rows = historyTrades.map(trade => {
            const date = formatDate(trade.entryTime || Date.now());
            const time = formatTime(trade.entryTime || Date.now());
            const symbol = `${trade.symbol || 'NIFTY'} ${trade.strike} ${trade.optionType}`;
            const aoc = trade.aocConfirmation ? `"${trade.aocConfirmation}"` : '-';
            const pnl = trade.pnl || 0;
            const exit = trade.status === 'CLOSED' ? trade.exitPremium : 'Live';
            const status = trade.status === 'CLOSED' ? trade.exitReason : 'OPEN';
            return `${date},${time},${symbol},${trade.side},${trade.qty},${aoc},${trade.entryPremium},${exit},${pnl},${status}`;
        });

        // Add Summary to CSV
        rows.push(""); 
        rows.push(`"","","","","","","SUMMARY:","Total Trades: ${totalTrades} | Win Rate: ${winRate}%","${isTotalProfit ? '+' : '-'}₹${Math.abs(totalPnl)}",""`);

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `TradeMaster_Report_${formatDate(Date.now()).replace(/ /g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 🖨️ EXPORT TO PDF (Now grabs the ENTIRE table including Summary)
    const handlePrintPDF = () => {
        // 🎯 THE FIX: Now targeting the whole 'report-table' via outerHTML
        const printContent = document.getElementById('report-table').outerHTML; 
        const win = window.open('', '', 'width=1000,height=700');
        win.document.write(`
            <html>
                <head>
                    <title>Trade Report - ${formatDate(Date.now())}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                        h1 { color: #2563eb; margin: 0; font-size: 24px; }
                        .date-stamp { color: #666; font-size: 14px; margin-top: 5px; }
                        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px 8px; text-align: center; }
                        th { background-color: #f8fafc; color: #1e293b; font-weight: bold; text-transform: uppercase; font-size: 11px; }
                        .profit { color: #16a34a; font-weight: bold; }
                        .loss { color: #dc2626; font-weight: bold; }
                        .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; border: 1px solid #ddd; display: inline-block; }
                        tfoot td { background-color: #e2e8f0; font-weight: bold; font-size: 14px; color: #0f172a; } /* Summary Row Style for PDF */
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📊 TradeMaster Backtest Report</h1>
                        <div class="date-stamp">Generated on: ${formatDate(Date.now())} | ${formatTime(Date.now())}</div>
                    </div>
                    ${printContent}
                    <script>
                        window.onload = () => { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        win.document.close();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh]">
                
                <div className="bg-blue-600 text-white px-5 py-3 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-lg">📊 Backtest Trade Report</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors border border-blue-500 shadow-sm">📥 CSV</button>
                        <button onClick={handlePrintPDF} className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors border border-blue-500 shadow-sm">🖨️ PDF</button>
                        <div className="h-5 w-px bg-blue-500 mx-1"></div>
                        <button onClick={onClose} className="text-white hover:text-red-300 font-bold text-2xl leading-none ml-1">&times;</button>
                    </div>
                </div>

                <div className="overflow-y-auto w-full relative">
                    {historyTrades.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 font-medium">
                            No trades taken yet. Run the simulator to see your report!
                        </div>
                    ) : (
                        // 🎯 THE FIX: ID is now on the TABLE tag, so PDF grabs thead, tbody AND tfoot!
                        <table id="report-table" className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 sticky top-0 shadow-sm z-10">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Symbol</th>
                                    <th className="px-4 py-3">Trans.</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-center">AOC Signal</th>
                                    <th className="px-4 py-3">Entry Price</th>
                                    <th className="px-4 py-3">Exit Price</th>
                                    <th className="px-4 py-3 text-right">P&L</th>
                                    <th className="px-4 py-3 text-center">Status / Exit</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {historyTrades.map((trade, idx) => {
                                    const isProfit = trade.pnl >= 0;
                                    const pnlClass = isProfit ? 'profit text-green-600 dark:text-green-400' : 'loss text-red-600 dark:text-red-400';
                                    const sideColor = trade.side === 'BUY' ? 'text-blue-600' : 'text-orange-500';

                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDate(trade.entryTime || Date.now())}</td>
                                            <td className="px-4 py-3 font-medium">{`${trade.symbol || 'NIFTY'} ${trade.strike} ${trade.optionType}`}</td>
                                            <td className={`px-4 py-3 font-bold ${sideColor}`}>{trade.side}</td>
                                            <td className="px-4 py-3 text-center">{trade.qty}</td>
                                            <td className="px-4 py-3 text-center">
                                                {trade.aocConfirmation && trade.aocConfirmation !== 'N/A' ? (
                                                    <div className={`badge px-3 py-1 border rounded text-[10px] font-extrabold truncate max-w-[160px] mx-auto shadow-sm transition-colors cursor-help ${getSignalColor(trade.aocConfirmation)}`} title={trade.aocConfirmation}>
                                                        {trade.aocConfirmation.split('-')[0].trim()}
                                                    </div>
                                                ) : <span className="text-gray-400 font-bold">-</span>}
                                            </td>
                                            <td className="px-4 py-3">₹{Number(trade.entryPremium).toFixed(2)} <br/><span className="text-xs text-gray-400">({formatTime(trade.entryTime || Date.now())})</span></td>
                                            <td className="px-4 py-3">{trade.status === 'CLOSED' ? <>₹{Number(trade.exitPremium).toFixed(2)} <br/><span className="text-xs text-gray-400">({formatTime(trade.exitTime)})</span></> : <span className="text-yellow-500 font-medium">Live...</span>}</td>
                                            <td className={`px-4 py-3 text-right font-bold text-base whitespace-nowrap ${pnlClass}`}>{isProfit ? '+' : '-'} ₹{Math.abs(trade.pnl || 0)}</td>
                                            <td className="px-4 py-3 text-center">{trade.status === 'CLOSED' ? <span className={`px-3 py-1 rounded text-xs font-bold ${trade.exitReason === 'TP Hit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trade.exitReason}</span> : <span className="px-3 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700 animate-pulse">OPEN</span>}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            {/* 📊 2. THE UI: Sticky Summary Row (tfoot) */}
                            <tfoot className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 sticky bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 border-t-2 border-gray-300 dark:border-gray-600">
                                <tr>
                                    <td colSpan="3" className="px-4 py-3 text-right font-extrabold tracking-wide uppercase text-xs text-gray-500">📊 Summary Stats:</td>
                                    <td colSpan="2" className="px-4 py-3 text-center font-bold text-blue-700 dark:text-blue-400">Total Trades: {totalTrades}</td>
                                    <td colSpan="2" className="px-4 py-3 text-center font-bold text-purple-700 dark:text-purple-400">Win Rate: {winRate}%</td>
                                    <td className={`px-4 py-3 text-right font-black text-lg whitespace-nowrap ${isTotalProfit ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                        {isTotalProfit ? '+' : '-'} ₹{Math.abs(totalPnl)}
                                    </td>
                                    <td className="px-4 py-3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};