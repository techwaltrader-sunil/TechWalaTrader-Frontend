// import React, { useState, useEffect } from 'react';

// const InsightData = () => {
//     // 🎯 1. Filter States Add Kiye Gaye Hain
//     const [filters, setFilters] = useState({
//         symbol: 'NIFTY',
//         fromDate: '2026-08-01',
//         toDate: '2026-08-31',
//         gapType: 'ALL' // ALL, GAP_UP, GAP_DOWN, FLAT
//     });

//     // 🎯 2. Dummy Data
//     const [insights, setInsights] = useState({
//         summary: {
//             totalDays: 22,
//             gapUpPercent: "45.45",
//             gapDownPercent: "36.36",
//             gapFillProb: "68.50"
//         },
//         tableData: [
//             { id: 1, date: "2026-08-05", prevClose: 24550.00, open: 24610.50, gapPoints: 60.50, gapType: "GAP_UP", isFilled: true },
//             { id: 2, date: "2026-08-04", prevClose: 24400.00, open: 24320.00, gapPoints: -80.00, gapType: "GAP_DOWN", isFilled: false },
//             { id: 3, date: "2026-08-03", prevClose: 24350.00, open: 24350.00, gapPoints: 0.00, gapType: "FLAT", isFilled: true },
//             { id: 4, date: "2026-08-02", prevClose: 24200.00, open: 24250.00, gapPoints: 50.00, gapType: "GAP_UP", isFilled: true },
//         ]
//     });

//     // Filter Change Handler
//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prev => ({ ...prev, [name]: value }));
//     };

//     // Apply Filter Button Handler (Backend API call yahan hogi)
//     const handleApplyFilters = () => {
//         console.log("Fetching data for filters:", filters);
//         // TODO: Call backend API with these filters
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             {/* Header Section */}
//             <div className="mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Market Insights & Data</h1>
//                 <p className="text-gray-500">Analyze historical gap probabilities and market behavior</p>
//             </div>

//             {/* 🎯 3. NEW: Filter Bar Section */}
//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-end w-full">
//                 <div className="flex flex-col">
//                     <label className="text-xs font-semibold text-gray-500 mb-1">Symbol</label>
//                     <select 
//                         name="symbol" 
//                         value={filters.symbol} 
//                         onChange={handleFilterChange}
//                         className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white min-w-[120px]"
//                     >
//                         <option value="NIFTY">NIFTY</option>
//                         <option value="BANKNIFTY">BANKNIFTY</option>
//                         <option value="FINNIFTY">FINNIFTY</option>
//                     </select>
//                 </div>

//                 <div className="flex flex-col">
//                     <label className="text-xs font-semibold text-gray-500 mb-1">From Date</label>
//                     <input 
//                         type="date" 
//                         name="fromDate" 
//                         value={filters.fromDate} 
//                         onChange={handleFilterChange}
//                         className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white"
//                     />
//                 </div>

//                 <div className="flex flex-col">
//                     <label className="text-xs font-semibold text-gray-500 mb-1">To Date</label>
//                     <input 
//                         type="date" 
//                         name="toDate" 
//                         value={filters.toDate} 
//                         onChange={handleFilterChange}
//                         className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white"
//                     />
//                 </div>

//                 <div className="flex flex-col">
//                     <label className="text-xs font-semibold text-gray-500 mb-1">Gap Type</label>
//                     <select 
//                         name="gapType" 
//                         value={filters.gapType} 
//                         onChange={handleFilterChange}
//                         className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white min-w-[140px]"
//                     >
//                         <option value="ALL">All Gaps</option>
//                         <option value="GAP_UP">Gap Up Only</option>
//                         <option value="GAP_DOWN">Gap Down Only</option>
//                         <option value="FLAT">Flat Only</option>
//                     </select>
//                 </div>

//                 {/* 🎯 ml-auto class button ko right side dhakel degi */}
//                 <button 
//                     onClick={handleApplyFilters}
//                     className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded text-sm transition-colors shadow-sm"
//                 >
//                     Get Insights
//                 </button>
//             </div>

//             {/* 1. Summary Cards Section */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
//                     <h3 className="text-gray-500 text-sm font-semibold">Total Trading Days</h3>
//                     <p className="text-3xl font-bold text-gray-800 mt-2">{insights.summary.totalDays}</p>
//                 </div>
                
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-green-500">
//                     <h3 className="text-gray-500 text-sm font-semibold">Gap-Up Frequency</h3>
//                     <p className="text-3xl font-bold text-green-600 mt-2">{insights.summary.gapUpPercent}%</p>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-red-500">
//                     <h3 className="text-gray-500 text-sm font-semibold">Gap-Down Frequency</h3>
//                     <p className="text-3xl font-bold text-red-600 mt-2">{insights.summary.gapDownPercent}%</p>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
//                     <h3 className="text-gray-500 text-sm font-semibold">Gap Fill Probability</h3>
//                     <p className="text-3xl font-bold text-purple-600 mt-2">{insights.summary.gapFillProb}%</p>
//                     <p className="text-xs text-gray-400 mt-1">Chances of market filling the gap</p>
//                 </div>
//             </div>

//             {/* 2. Detailed Data Table Section */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
//                     <h2 className="text-lg font-bold text-gray-700">Daily Gap Analysis Report</h2>
//                     <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Showing {insights.tableData.length} records</span>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-gray-50 text-gray-500 text-sm border-b">
//                                 <th className="px-6 py-3 font-semibold">Date</th>
//                                 <th className="px-6 py-3 font-semibold">Prev Close</th>
//                                 <th className="px-6 py-3 font-semibold">Today Open</th>
//                                 <th className="px-6 py-3 font-semibold">Gap Points</th>
//                                 <th className="px-6 py-3 font-semibold">Gap Type</th>
//                                 <th className="px-6 py-3 font-semibold">Gap Filled?</th>
//                             </tr>
//                         </thead>
//                         <tbody className="text-sm">
//                             {insights.tableData.map((row) => (
//                                 <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
//                                     <td className="px-6 py-4 font-medium text-gray-700">{row.date}</td>
//                                     <td className="px-6 py-4 text-gray-600">{row.prevClose}</td>
//                                     <td className="px-6 py-4 font-medium">{row.open}</td>
//                                     <td className="px-6 py-4">
//                                         <span className={`font-bold ${row.gapPoints > 0 ? 'text-green-600' : row.gapPoints < 0 ? 'text-red-600' : 'text-gray-600'}`}>
//                                             {row.gapPoints > 0 ? '+' : ''}{row.gapPoints}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-2 py-1 rounded text-xs font-bold ${
//                                             row.gapType === 'GAP_UP' ? 'bg-green-100 text-green-700' : 
//                                             row.gapType === 'GAP_DOWN' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
//                                         }`}>
//                                             {row.gapType}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         {row.isFilled ? (
//                                             <span className="flex items-center text-green-600 font-semibold">
//                                                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
//                                                 Yes
//                                             </span>
//                                         ) : (
//                                             <span className="flex items-center text-red-500 font-semibold">
//                                                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
//                                                 No
//                                             </span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InsightData;




import React, { useState, useEffect } from 'react';

const InsightData = () => {
    // 🎯 1. आज की तारीख और महीने की पहली तारीख निकालने का ऑटोमैटिक लॉजिक
    const getTodayDate = () => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const getFirstDayOfMonth = () => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return `${yyyy}-${mm}-01`;
    };

    // 🎯 2. Filters स्टेट में हार्डकोडेड डेट्स हटाकर डायनामिक फंक्शन्स डाल दिए गए हैं
    const [filters, setFilters] = useState({
        symbol: 'NIFTY',
        fromDate: getFirstDayOfMonth(), // ऑटोमैटिक महीने का पहला दिन (उदा. 2026-09-01)
        toDate: getTodayDate(),         // ऑटोमैटिक आज का दिन (उदा. 2026-09-20)
        dayOfWeek: 'ALL',
        gapType: 'ALL', 
        streakCount: '1',
        reversalTF: 'NONE',
        movementRange: 'ALL' 
    });

    const [insights, setInsights] = useState({
        summary: {
            totalDays: 0,
            gapUpPercent: "0.00",
            gapDownPercent: "0.00",
            gapFillProb: "0.00",
            reversalProb: "0.00",
            timeBuckets: {
                morningAvg: "0.0",
                middayAvg: "0.0",
                closingAvg: "0.0"
            }
        },
        tableData: [] 
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = async () => {
        try {
            console.log("Fetching real data for filters:", filters);
            
            // अपने असल बैकएंड का पोर्ट डालें (तुम्हारे केस में 5500 है)
            const response = await fetch('http://localhost:5500/api/insights', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(filters) // फ़िल्टर्स को JSON बनाकर भेज रहे हैं
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 🎯 यह लाइन तुम्हारे डमी डेटा को हटाकर असली डेटा सेट कर देगी
                setInsights(result.data); 
                console.log("Real Data Loaded:", result.data);
            } else {
                console.error("Backend Error:", result.message);
            }
        } catch (error) {
            console.error("API Fetch Error (CORS या Server बंद हो सकता है):", error);
        }
    };

    // (Optional) अगर तुम चाहते हो कि पेज लोड होते ही असली डेटा आ जाए, तो इसे भी ऐड कर सकते हो:
    useEffect(() => {
        handleApplyFilters();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Market Insights & Data</h1>
                <p className="text-gray-500">Analyze historical gap probabilities, fills, reversal setups, and daily moves</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end w-full">
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Symbol</label>
                    <select name="symbol" value={filters.symbol} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white min-w-[100px]">
                        <option value="NIFTY">NIFTY</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">From Date</label>
                    <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white"/>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">To Date</label>
                    <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white"/>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Day of Week</label>
                    <select name="dayOfWeek" value={filters.dayOfWeek} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white min-w-[120px]">
                        <option value="ALL">All Days</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Gap Type</label>
                    <select name="gapType" value={filters.gapType} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white min-w-[120px]">
                        <option value="ALL">All Gaps</option>
                        <option value="GAP_UP">Gap Up Only</option>
                        <option value="GAP_DOWN">Gap Down Only</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Consecutive Days</label>
                    <input type="number" name="streakCount" value={filters.streakCount} onChange={handleFilterChange} placeholder="e.g. 1" min="1" className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white w-[100px]"/>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Reversal Check</label>
                    <select name="reversalTF" value={filters.reversalTF} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white min-w-[130px]">
                        <option value="NONE">Don't Check</option>
                        <option value="5m">5 Min Reversal</option>
                        <option value="15m">15 Min Reversal</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Daily Move</label>
                    <select name="movementRange" value={filters.movementRange} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-blue-500 bg-white min-w-[120px]">
                        <option value="ALL">All Moves</option>
                        <option value="0-0.5">0% - 0.5%</option>
                        <option value="0.5-1.0">0.5% - 1.0%</option>
                        <option value="1.0-1.5">1.0% - 1.5%</option>
                        <option value="1.5-2.0">1.5% - 2.0%</option>
                        <option value="2.0-2.5">2.0% - 2.5%</option>
                        <option value="2.5-3.0">2.5% - 3.0%</option>
                        <option value="3.0-4.0">3.0% - 4.0%</option>
                        <option value="4.0-5.0">4.0% - 5.0%</option>
                        <option value="ABOVE-5.0">Above 5.0%</option>
                    </select>
                </div>
                <button onClick={handleApplyFilters} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded text-sm transition-colors shadow-sm">
                    Get Insights
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                    <h3 className="text-gray-500 text-xs font-semibold uppercase">Trading Days</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{insights.summary.totalDays}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                    <h3 className="text-gray-500 text-xs font-semibold uppercase">Gap-Up Freq</h3>
                    <p className="text-2xl font-bold text-green-600 mt-1">{insights.summary.gapUpPercent}%</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-red-500">
                    <h3 className="text-gray-500 text-xs font-semibold uppercase">Gap-Down Freq</h3>
                    <p className="text-2xl font-bold text-red-600 mt-1">{insights.summary.gapDownPercent}%</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
                    <h3 className="text-gray-500 text-xs font-semibold uppercase">Gap Fill Prob</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{insights.summary.gapFillProb}%</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
                    <h3 className="text-gray-500 text-xs font-semibold uppercase">Reversal Prob</h3>
                    <p className="text-2xl font-bold text-orange-500 mt-1">{insights.summary.reversalProb}%</p>
                    <p className="text-[10px] text-gray-400 mt-1">Reversal after Gap Fill</p>
                </div>
            </div>

            {/* 🎯 2. Naya Section: Intraday Time-Slot Volatility (Averages) */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Intraday Time-Slot Volatility (Average Point Range)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div>
                            <p className="text-xs font-bold text-indigo-700 uppercase">Morning Opening</p>
                            <p className="text-[11px] font-medium text-indigo-500 mt-0.5">09:15 AM - 10:30 AM</p>
                        </div>
                        <p className="text-2xl font-black text-indigo-900">{insights.summary.timeBuckets.morningAvg}</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div>
                            <p className="text-xs font-bold text-amber-700 uppercase">Lunch Sideways</p>
                            <p className="text-[11px] font-medium text-amber-500 mt-0.5">10:30 AM - 01:30 PM</p>
                        </div>
                        <p className="text-2xl font-black text-amber-900">{insights.summary.timeBuckets.middayAvg}</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-100">
                        <div>
                            <p className="text-xs font-bold text-teal-700 uppercase">Closing Move</p>
                            <p className="text-[11px] font-medium text-teal-500 mt-0.5">01:30 PM - 03:30 PM</p>
                        </div>
                        <p className="text-2xl font-black text-teal-900">{insights.summary.timeBuckets.closingAvg}</p>
                    </div>
                </div>
            </div>

            {/* Detailed Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-700">Daily Gap & Range Analysis Report</h2>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Showing {insights.tableData.length} records</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase border-b">
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Day</th>
                                <th className="px-4 py-3">Prev Close</th>
                                <th className="px-4 py-3">Today Open</th>
                                <th className="px-4 py-3">Gap Points</th>
                                <th className="px-4 py-3">Today's Move</th>
                                <th className="px-4 py-3">Gap Type</th>
                                <th className="px-4 py-3">Gap Filled?</th>
                                <th className="px-4 py-3">Reversal?</th>

                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">REV. STATUS</th>
                                {/* 🎯 3. Naye Columns Header */}
                                <th className="px-4 py-3 text-indigo-600 bg-indigo-50 border-l border-white">Morning<br/><span className="text-[9px] font-normal lowercase">9:15-10:30</span></th>
                                <th className="px-4 py-3 text-amber-600 bg-amber-50 border-l border-white">Midday<br/><span className="text-[9px] font-normal lowercase">10:30-1:30</span></th>
                                <th className="px-4 py-3 text-teal-600 bg-teal-50 border-l border-white">Closing<br/><span className="text-[9px] font-normal lowercase">1:30-3:30</span></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {insights.tableData.map((row) => (
                                <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-700">{row.date}</td>
                                    <td className="px-4 py-4 text-blue-600 font-semibold uppercase text-xs">
                                        {new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{row.prevClose}</td>

                                    {/* 🎯 Yahan par galti se variable miss ho gaya hoga, is line ko aise likho: */}
                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {row.open || row.daily_open} 
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className={`font-bold ${row.gapPoints > 0 ? 'text-green-600' : row.gapPoints < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                            {row.gapPoints > 0 ? '+' : ''}{row.gapPoints} ({row.gapPercent}%)
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`font-bold ${row.movePoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {row.movePoints > 0 ? '+' : ''}{row.movePoints} ({row.movePercent}%)
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            row.gapType === 'GAP_UP' ? 'bg-green-100 text-green-700' : 
                                            row.gapType === 'GAP_DOWN' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {row.gapType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        {row.isFilled ? <span className="text-green-600 font-semibold">Yes</span> : <span className="text-red-500 font-semibold">No</span>}
                                    </td>
                                    <td className="px-4 py-4">
                                        {row.isFilled ? (
                                            row.isReversed ? <span className="text-orange-500 font-semibold">🔥 Yes (Reversed)</span> : <span className="text-gray-500">No (Continued)</span>
                                        ) : <span className="text-gray-400 italic">N/A</span>}
                                    </td>

                                    <td className="px-4 py-4">
                                        {row.isFilled ? (
                                            <span className={`font-semibold text-sm ${
                                                row.reversalStatus === '🔥 PASS' ? 'text-green-600' : 
                                                row.reversalStatus.includes('Failed after') ? 'text-orange-500' : 'text-gray-500'
                                            }`}>
                                                {row.reversalStatus}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">N/A</span>
                                        )}
                                    </td>
                                    {/* 🎯 4. Naye Columns Data */}
                                    <td className="px-4 py-4 font-medium text-indigo-700 bg-indigo-50/30 border-l border-gray-100">{row.morningMove} pts</td>
                                    <td className="px-4 py-4 font-medium text-amber-700 bg-amber-50/30 border-l border-gray-100">{row.middayMove} pts</td>
                                    <td className="px-4 py-4 font-medium text-teal-700 bg-teal-50/30 border-l border-gray-100">{row.closingMove} pts</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InsightData;