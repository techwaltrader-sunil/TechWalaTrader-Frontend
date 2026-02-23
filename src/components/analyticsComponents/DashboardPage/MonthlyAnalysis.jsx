import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Filter, ArrowUpDown, X, ExternalLink, Printer, Loader2, Eye, Edit3 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TradeForm from '../../forms/TradeForm';
import { useTradeContext } from '../../../context/TradeContext'; 

// 🔥 CUSTOM HOOK FOR PERSISTENCE (Local Storage)
const usePersistState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error("Error reading localStorage:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, [key, state]);

    return [state, setState];
};

// 🔥 SAFE COLORS FOR PDF (HEX Only)
const SAFE_STYLES = {
    bgWhite: { backgroundColor: '#ffffff' },
    bgSlate50: { backgroundColor: '#f8fafc' },
    borderSlate200: { borderColor: '#e2e8f0' },
    textSlate800: { color: '#1e293b' },
    textSlate700: { color: '#334155' },
    textSlate500: { color: '#64748b' },
    textSlate400: { color: '#94a3b8' },
    bgExact: { backgroundColor: '#22c55e', color: '#ffffff' },
    bgCounter: { backgroundColor: '#3b82f6', color: '#ffffff' },
    bgProtected: { backgroundColor: '#f59e0b', color: '#ffffff' },
    bgOnlyProtected: { backgroundColor: '#d946ef', color: '#ffffff' },
    tagExact: { color: '#15803d', backgroundColor: '#dcfce7', borderColor: '#bbf7d0' },
    tagCounter: { color: '#1d4ed8', backgroundColor: '#dbeafe', borderColor: '#bfdbfe' },
    tagProtected: { color: '#b45309', backgroundColor: '#fef3c7', borderColor: '#fde68a' },
    tagOnlyProtected: { color: '#a21caf', backgroundColor: '#fae8ff', borderColor: '#f5d0fe' },
    textGreen600: { color: '#16a34a' },
    bgGreen50: { backgroundColor: '#f0fdf4' },
    borderGreen100: { borderColor: '#dcfce7' },
    textRed600: { color: '#dc2626' },
    bgRed50: { backgroundColor: '#fef2f2' },
    borderRed100: { borderColor: '#fee2e2' },
    textBlue600: { color: '#2563eb' }
};

const MonthlyAnalysis = ({ trades }) => {
    const { fetchTrades } = useTradeContext(); 

    // --- STATE WITH PERSISTENCE ---
    // ✅ Persisting Trade Type Filter
    const [tradeTypeFilter, setTradeTypeFilter] = usePersistState('monthly_trade_type_filter', 'All Trade'); 
    
    // ✅ Persisting Monthly Filters (Period, Pair, Timeframe, Sort)
    const [monthlyFilters, setMonthlyFilters] = usePersistState('monthly_analysis_filters', {
        period: 'All', 
        pair: 'All',
        timeframe: 'All',
        sortBy: 'Date (Newest)'
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalTrades, setModalTrades] = useState([]);

    // Detail Modal State
    const [detailTrade, setDetailTrade] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [isDownloading, setIsDownloading] = useState(false);
    const analysisRef = useRef(null);

    // --- AUTO-SYNC EFFECT ---
    useEffect(() => {
        if (detailTrade) {
            const updatedVersion = trades.find(t => t._id === detailTrade._id);
            if (updatedVersion) {
                setDetailTrade(updatedVersion); 
            }
        }
    }, [trades]); 

    useEffect(() => {
        if (detailTrade) {
            setIsEditMode(false);
        }
    }, [detailTrade?._id]); 

    // --- HELPERS ---
    const years = useMemo(() => [...new Set(trades.map(t => new Date(t.date).getFullYear()))].sort(), [trades]);
    const pairs = useMemo(() => [...new Set(trades.map(t => t.pair))].sort(), [trades]);
    const timeframes = useMemo(() => [...new Set(trades.map(t => t.timeframe))].sort(), [trades]);

    // --- HANDLERS ---
    const handleMonthlyFilterChange = (e) => {
        setMonthlyFilters({ ...monthlyFilters, [e.target.name]: e.target.value });
    };

    const handleSetupClick = (title, tradesList) => {
        setModalTitle(title);
        setModalTrades(tradesList);
        setIsModalOpen(true);
    };

    // --- PDF HANDLER (Smart Grid) ---
    const handleDownloadPDF = async () => {
        if (!analysisRef.current) return;
        setIsDownloading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const gap = 5; 
            const colWidth = (pageWidth - (margin * 2) - (gap * 2)) / 3;
            let currentY = 30;

            const addHeader = (doc) => {
                doc.setFontSize(16);
                doc.setTextColor(40);
                const safeFilterName = tradeTypeFilter.replace(/[^a-zA-Z0-9 ]/g, ""); 
                doc.text(`Monthly Analysis Report (${safeFilterName})`, margin, 15);
                
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 22);

                // Add Filters to Header
                doc.setTextColor(60);
                const filterText = `Filters: Period [${monthlyFilters.period}] • Pair [${monthlyFilters.pair}] • TF [${monthlyFilters.timeframe}]`;
                doc.text(filterText, margin, 27);
            };

            addHeader(pdf);
            
            // Adjust Start Y for first page due to extra header line
            currentY = 35;

            const cards = Array.from(analysisRef.current.children);

            for (let i = 0; i < cards.length; i += 3) {
                const rowCards = cards.slice(i, i + 3);
                const cardImages = [];
                let maxRowHeight = 0;

                for (const card of rowCards) {
                    const canvas = await html2canvas(card, {
                        scale: 2, 
                        backgroundColor: '#ffffff',
                        useCORS: true, 
                        logging: false,
                        allowTaint: true,
                        ignoreElements: (element) => element.classList.contains('no-print')
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const imgProps = pdf.getImageProperties(imgData);
                    const imgHeight = (imgProps.height * colWidth) / imgProps.width;
                    cardImages.push({ data: imgData, height: imgHeight });
                    if (imgHeight > maxRowHeight) maxRowHeight = imgHeight;
                }

                if (currentY + maxRowHeight > pageHeight - margin) {
                    pdf.addPage();
                    addHeader(pdf);
                    currentY = 35;
                }

                cardImages.forEach((img, index) => {
                    const xPos = margin + (index * (colWidth + gap));
                    pdf.addImage(img.data, 'PNG', xPos, currentY, colWidth, img.height);
                });
                currentY += maxRowHeight + gap;
            }

            const fileName = `MonthlyAnalysis_${tradeTypeFilter.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error("PDF Export Error:", error);
            alert("Failed to download PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

    // --- FILTER LOGIC ---
    const monthlyCardData = useMemo(() => {
        return trades.filter(t => {
            const tDate = new Date(t.date);
            const d = new Date();
            d.setDate(1); d.setHours(0, 0, 0, 0);

            if (monthlyFilters.pair !== 'All' && t.pair !== monthlyFilters.pair) return false;
            if (monthlyFilters.timeframe !== 'All' && t.timeframe !== monthlyFilters.timeframe) return false;

            if (monthlyFilters.period !== 'All') {
                if (monthlyFilters.period === 'Last 1 Month') { d.setMonth(d.getMonth() - 1); if (tDate < d) return false; }
                else if (monthlyFilters.period === 'Last 3 Months') { d.setMonth(d.getMonth() - 3); if (tDate < d) return false; }
                else if (monthlyFilters.period === 'Last 6 Months') { d.setMonth(d.getMonth() - 6); if (tDate < d) return false; }
                else if (monthlyFilters.period === 'Last 9 Months') { d.setMonth(d.getMonth() - 9); if (tDate < d) return false; }
                else if (!isNaN(monthlyFilters.period)) { if (tDate.getFullYear().toString() !== monthlyFilters.period) return false; }
            }
            return true;
        });
    }, [trades, monthlyFilters]);

    const tradeTypes = ['All Trade', 'Exact Trade', 'Protected Trade', 'Counter Trade', 'Only Protected Trade'];

    return (
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100 mb-8" style={SAFE_STYLES.bgWhite}>
            
            {/* HEADER & FILTERS */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2" style={SAFE_STYLES.textSlate800}>📅 Monthly Analysis</h3>
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading}
                        className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                    >
                        {isDownloading ? <Loader2 className="animate-spin" size={14}/> : <Printer size={14} />}
                        <span>Print</span>
                    </button>
                </div>

                <div className="flex flex-wrap bg-slate-100 p-1 rounded-lg" style={SAFE_STYLES.bgSlate50}>
                    {tradeTypes.map((type) => (
                        <button 
                            key={type} 
                            onClick={() => setTradeTypeFilter(type)} 
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap ${tradeTypeFilter === type ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                            style={tradeTypeFilter === type ? { ...SAFE_STYLES.bgWhite, ...SAFE_STYLES.textBlue600, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' } : SAFE_STYLES.textSlate500}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* FILTERS TOOLBAR */}
            <div className="flex flex-wrap gap-3 items-center mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100" style={{...SAFE_STYLES.bgSlate50, ...SAFE_STYLES.borderSlate200}}>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mr-2" style={SAFE_STYLES.textSlate500}><Filter size={14} /> Filters:</div>
                
                <select name="period" value={monthlyFilters.period} onChange={handleMonthlyFilterChange} className="text-xs border p-1.5 rounded bg-white focus:outline-none cursor-pointer" style={SAFE_STYLES.bgWhite}>
                    <option value="All">All Time</option>
                    <option value="Last 1 Month">Last 1 Month</option>
                    <option value="Last 3 Months">Last 3 Months</option>
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="Last 9 Months">Last 9 Months</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    {years.filter(y => !['2024','2025','2026'].includes(y.toString())).map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <select name="pair" value={monthlyFilters.pair} onChange={handleMonthlyFilterChange} className="text-xs border p-1.5 rounded bg-white" style={SAFE_STYLES.bgWhite}>
                    <option value="All">All Pairs</option>
                    {pairs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select name="timeframe" value={monthlyFilters.timeframe} onChange={handleMonthlyFilterChange} className="text-xs border p-1.5 rounded bg-white" style={SAFE_STYLES.bgWhite}>
                    <option value="All">All TFs</option>
                    {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                </select>
                <div className="h-4 w-[1px] bg-slate-300 mx-2" style={{backgroundColor: '#cbd5e1'}}></div>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-bold" style={SAFE_STYLES.textSlate500}><ArrowUpDown size={14} /> Sort:</div>
                <select name="sortBy" value={monthlyFilters.sortBy} onChange={handleMonthlyFilterChange} className="text-xs border p-1.5 rounded bg-white font-medium" style={{...SAFE_STYLES.bgWhite, ...SAFE_STYLES.textBlue600}}>
                    <option>Date (Newest)</option>
                    <option>Date (Oldest)</option>
                    <option>Win Rate (High ➝ Low)</option>
                    <option>Win Rate (Low ➝ High)</option>
                </select>
            </div>

            {/* CARDS GRID */}
            <div ref={analysisRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-2 rounded" style={SAFE_STYLES.bgWhite}>
                <MonthlyCards trades={monthlyCardData} typeFilter={tradeTypeFilter} onSetupClick={handleSetupClick} sortBy={monthlyFilters.sortBy} />
            </div>

            {/* LIST MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm p-4 no-print">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">{modalTitle}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-3 bg-gray-50/50">
                            {modalTrades.map(trade => (
                                <div key={trade._id} onClick={() => setDetailTrade(trade)} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex gap-4 hover:shadow-md hover:border-blue-300 transition cursor-pointer relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><Eye size={16} className="text-blue-500"/></div>
                                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border">
                                        {trade.imageUrl ? <img src={trade.imageUrl} className="w-full h-full object-cover" alt="chart" /> : <span className="text-xs flex items-center justify-center h-full text-gray-400">No Img</span>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1 pr-6">
                                            <div className="flex items-center gap-2"><span className="font-bold text-slate-700">{trade.pair}</span><TypeTag type={trade.tradeType} /></div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${trade.result.includes('TARGET') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trade.result}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">{new Date(trade.date).toDateString()} • {trade.timeframe}</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className={(trade.netPnL > 0 || trade.result.includes('TARGET')) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>P&L: {trade.netPnL ? trade.netPnL : (trade.direction?.includes('Short') ? trade.entryPrice - trade.exitPrice : trade.exitPrice - trade.entryPrice).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {detailTrade && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[60] backdrop-blur-sm p-4 animate-in fade-in duration-200 no-print">
                    <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 rounded-t-xl">
                            <div className="flex items-center gap-4">
                                <span className="text-base font-bold text-slate-700">Trade Details</span>
                                <div className="flex bg-slate-200 p-1 rounded-lg">
                                    <button onClick={() => setIsEditMode(false)} className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${!isEditMode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Eye size={14} /> Read</button>
                                    <button onClick={() => setIsEditMode(true)} className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all ${isEditMode ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Edit3 size={14} /> Edit</button>
                                </div>
                            </div>
                            <button onClick={() => setDetailTrade(null)} className="bg-gray-200 hover:bg-red-500 hover:text-white rounded-full p-2 transition"><X size={20} /></button>
                        </div>
                        <div className="p-1">
                            <TradeForm key={detailTrade._id} initialData={detailTrade} isReadOnly={!isEditMode} mode={detailTrade.mode || 'LIVE'} onSuccess={async (updatedLocalData) => { if (updatedLocalData) { setDetailTrade(updatedLocalData); setModalTrades(prevTrades => prevTrades.map(t => t._id === updatedLocalData._id ? updatedLocalData : t)); } await fetchTrades(); setIsEditMode(false); }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... (Sub-Components MonthlyCards, Badge, TypeTag are same as previous) ...
const MonthlyCards = ({ trades, typeFilter, onSetupClick, sortBy }) => {
    const filtered = typeFilter === 'All Trade' ? trades : trades.filter(t => t.tradeType === typeFilter);
    if (filtered.length === 0) return <div className="col-span-full text-center py-10 text-gray-400 text-sm" style={SAFE_STYLES.textSlate400}>No {typeFilter}s found matching filters.</div>;
    const grouped = {};
    filtered.forEach(t => {
        const date = new Date(t.date);
        const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        if (!grouped[key]) grouped[key] = { name: key, trades: [], dateObj: new Date(date.getFullYear(), date.getMonth(), 1) };
        grouped[key].trades.push(t);
    });
    let groupedArray = Object.values(grouped).map(g => {
        const total = g.trades.length;
        const wins = g.trades.filter(t => t.result.includes('TARGET') || t.result === 'Win').length;
        const winRate = total ? (wins / total) * 100 : 0;
        const counts = { Exact: 0, Counter: 0, Protected: 0, OnlyProtected: 0 };
        g.trades.forEach(t => {
            const type = t.tradeType || '';
            if (type === 'Exact Trade') counts.Exact++;
            else if (type === 'Counter Trade') counts.Counter++;
            else if (type === 'Protected Trade') counts.Protected++;
            else if (type === 'Only Protected Trade') counts.OnlyProtected++;
        });
        return { ...g, winRate, total, wins, counts };
    });
    groupedArray.sort((a, b) => {
        if (sortBy === 'Date (Newest)') return b.dateObj - a.dateObj;
        if (sortBy === 'Date (Oldest)') return a.dateObj - b.dateObj;
        if (sortBy === 'Win Rate (High ➝ Low)') return b.winRate - a.winRate;
        if (sortBy === 'Win Rate (Low ➝ High)') return a.winRate - b.winRate;
        return 0;
    });
    return groupedArray.map((monthData, index) => {
        const { winRate, total, counts } = monthData;
        const setupStats = {};
        monthData.trades.forEach(t => {
            const setupName = t.setup || 'Unknown';
            const typeKey = t.tradeType || 'UnknownType';
            const uniqueKey = `${setupName}__${typeKey}`;
            if (!setupStats[uniqueKey]) { setupStats[uniqueKey] = { name: setupName, type: typeKey, wins: 0, loss: 0, all: [] }; }
            setupStats[uniqueKey].all.push(t);
            if (t.result.includes('TARGET') || t.result === 'Win') setupStats[uniqueKey].wins++;
            else setupStats[uniqueKey].loss++;
        });
        return (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition flex flex-col h-full" style={{...SAFE_STYLES.bgSlate50, ...SAFE_STYLES.borderSlate200}}>
                <div className="flex flex-col mb-3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg" style={SAFE_STYLES.textSlate700}>{monthData.name}</h4>
                        <span className="text-xs font-semibold border px-2 py-1 rounded" style={{...SAFE_STYLES.bgWhite, ...SAFE_STYLES.textSlate500, borderColor: '#e2e8f0'}}>{total} Trades</span>
                    </div>
                    {typeFilter === 'All Trade' && (
                        <div className="flex gap-2 flex-wrap">
                            {counts.Exact > 0 && <Badge count={counts.Exact} label="E" style={SAFE_STYLES.bgExact} />}
                            {counts.Counter > 0 && <Badge count={counts.Counter} label="C" style={SAFE_STYLES.bgCounter} />}
                            {counts.Protected > 0 && <Badge count={counts.Protected} label="P" style={SAFE_STYLES.bgProtected} />}
                            {counts.OnlyProtected > 0 && <Badge count={counts.OnlyProtected} label="O" style={SAFE_STYLES.bgOnlyProtected} />}
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span style={SAFE_STYLES.textSlate500}>Win Rate</span>
                        <span className="font-bold" style={winRate >= 50 ? SAFE_STYLES.textGreen600 : SAFE_STYLES.textRed600}>{winRate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{backgroundColor: '#e5e7eb'}}>
                        <div className="h-2 rounded-full" style={{ width: `${winRate}%`, backgroundColor: winRate >= 50 ? '#22c55e' : '#ef4444' }}></div>
                    </div>
                </div>
                <div className="mt-auto space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={SAFE_STYLES.textSlate400}>Setup Breakdown</p>
                    {Object.values(setupStats).map((stats, i) => (
                        <div key={i} onClick={() => onSetupClick(`${monthData.name} - ${stats.name}`, stats.all)} className="flex justify-between items-center p-2 rounded cursor-pointer transition group" style={{...SAFE_STYLES.bgWhite, ...SAFE_STYLES.borderSlate200, border: '1px solid #e2e8f0'}}>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold group-hover:text-blue-600" style={SAFE_STYLES.textSlate700}>{stats.name}</span>
                                {typeFilter === 'All Trade' && <TypeTag type={stats.type} />}
                            </div>
                            <div className="flex gap-2 text-xs">
                                {stats.wins > 0 && <span className="px-1.5 py-0.5 rounded border flex items-center justify-center min-w-[28px]" style={{...SAFE_STYLES.textGreen600, ...SAFE_STYLES.bgGreen50, ...SAFE_STYLES.borderGreen100, textAlign: 'center'}}>{stats.wins}W</span>}
                                {stats.loss > 0 && <span className="px-1.5 py-0.5 rounded border flex items-center justify-center min-w-[28px]" style={{...SAFE_STYLES.textRed600, ...SAFE_STYLES.bgRed50, ...SAFE_STYLES.borderRed100, textAlign: 'center'}}>{stats.loss}L</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    });
};

const Badge = ({ count, label, style }) => ( <span className="text-[10px] font-bold rounded-full shadow-sm" style={{...style, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minWidth: '24px', height: '22px', padding: '0 5px', lineHeight: 'normal', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold'}}>{count}{label}</span> );
const TypeTag = ({ type }) => {
    let style = {}; let label = 'U';
    if (type === 'Exact Trade') { style = SAFE_STYLES.tagExact; label = 'EXACT'; }
    else if (type === 'Counter Trade') { style = SAFE_STYLES.tagCounter; label = 'COUNTER'; }
    else if (type === 'Protected Trade') { style = SAFE_STYLES.tagProtected; label = 'PROTECTED'; }
    else if (type === 'Only Protected Trade') { style = SAFE_STYLES.tagOnlyProtected; label = 'ONLY-P'; }
    else return null;
    return ( <span className="text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase flex items-center justify-center" style={{...style, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 'normal', minWidth: '50px'}}>{label}</span> );
};

export default MonthlyAnalysis;