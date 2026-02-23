
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Wallet, FileSpreadsheet, FileText, Filter, BarChart2, Printer, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas'; 
import * as XLSX from 'xlsx';

// 🔥 SAFE STYLES FOR VISUAL PRINT
const SAFE_STYLES = {
    container: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    headerText: { color: '#334155' }, 
    subText: { color: '#94a3b8' }, 
    
    // Status Colors
    success: { backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }, 
    danger: { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }, 
    neutral: { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb' }, 
    info: { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }, 
    
    textGreen: { color: '#16a34a' },
    textRed: { color: '#dc2626' },
    
    cellBase: { backgroundColor: '#ffffff', border: '1px solid #f1f5f9' },
    cellInactive: { backgroundColor: '#f8fafc', opacity: 0.6, border: '1px solid #f1f5f9' }
};

// 🔥 CUSTOM HOOK FOR PERSISTENCE
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

const PnLCalendar = ({ trades, onDateClick, isOptionMode = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPair, setSelectedPair] = usePersistState('pnl_calendar_pair', 'All'); 
  const [isPrinting, setIsPrinting] = useState(false);
  const calendarRef = useRef(null);

  // 🎨 Helper: Color Coding Logic
  const getDirectionStyle = (dir) => {
    const greenTypes = ['Call', 'Put Write', 'Fut Buy'];
    const redTypes = ['Put', 'Call Write', 'Fut Sell', 'But Sell']; 

    if (greenTypes.includes(dir)) return SAFE_STYLES.success;
    if (redTypes.includes(dir)) return SAFE_STYLES.danger;
    return SAFE_STYLES.neutral;
  };

  // 📅 Helper: Format Date
  const formatDateSimple = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  // --- FILTER LOGIC ---
  const filteredTrades = useMemo(() => {
      if (selectedPair === 'All') return trades;
      return trades.filter(t => t.pair === selectedPair);
  }, [trades, selectedPair]);

  const availablePairs = useMemo(() => {
      const pairs = new Set(trades.map(t => t.pair).filter(Boolean));
      return ['All', ...Array.from(pairs)];
  }, [trades]);

  // --- CALENDAR DATA GENERATION ---
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startingDayIndex = firstDay.getDay() - 1; 
    if (startingDayIndex === -1) startingDayIndex = 6; 

    const totalDays = lastDay.getDate();
    const daysArray = [];

    for (let i = 0; i < startingDayIndex; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      const daysTrades = filteredTrades.filter(t => {
          if(!t.date) return false;
          const tDate = new Date(t.date); 
          return tDate.getFullYear() === year && 
                 tDate.getMonth() === month && 
                 tDate.getDate() === i;
      });
      
      let dailyPnL = 0;
      daysTrades.forEach(t => {
        let val = parseFloat(t.netPnL);
        if (isNaN(val)) {
            const entry = parseFloat(t.entryPrice) || 0;
            const exit = parseFloat(t.exitPrice) || 0;
            const qty = parseFloat(t.quantity) || 1;
            if(t.direction === 'Short' || t.direction === 'Put') val = (entry - exit) * qty;
            else val = (exit - entry) * qty;
        }

        if (isOptionMode) {
            const dir = t.direction ? t.direction.toLowerCase() : "";
            const isFutureTrade = dir.includes("fut") || dir.includes("but");
            if (!isFutureTrade) val = val * 0.5;
        }
        dailyPnL += val;
      });

      const uniqueDirections = [...new Set(daysTrades.map(t => t.direction).filter(Boolean))];

      daysArray.push({
        day: i,
        date: `${year}-${month+1}-${i}`,
        pnl: dailyPnL,
        count: daysTrades.length,
        trades: daysTrades,
        directions: uniqueDirections
      });
    }

    return daysArray;
  }, [currentDate, filteredTrades, isOptionMode]); 

  // --- KPI CALCULATIONS ---
  const totalMonthPnL = useMemo(() => {
      return calendarData.reduce((acc, item) => acc + (item ? item.pnl : 0), 0);
  }, [calendarData]);

  const totalMonthTrades = useMemo(() => {
      return calendarData.reduce((acc, item) => acc + (item ? item.count : 0), 0);
  }, [calendarData]);


  // --- EXPORT & PRINT HANDLERS (Unchanged Logic) ---
  const getCurrentMonthTradesForExport = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return filteredTrades.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
    }).map(t => {
        let val = parseFloat(t.netPnL);
        if (isNaN(val)) {
             const entry = parseFloat(t.entryPrice) || 0;
             const exit = parseFloat(t.exitPrice) || 0;
             const qty = parseFloat(t.quantity) || 1;
             if(t.direction === 'Short' || t.direction === 'Put') val = (entry - exit) * qty;
             else val = (exit - entry) * qty;
        }
        if (isOptionMode) {
            const dir = t.direction ? t.direction.toLowerCase() : "";
            const isFutureTrade = dir.includes("fut") || dir.includes("but");
            if (!isFutureTrade) val = val * 0.5;
        }
        return { ...t, calculatedPnL: val.toFixed(2) };
    });
  };

  const handleDownloadExcel = () => {
    const tradesToExport = getCurrentMonthTradesForExport();
    const data = tradesToExport.map(t => ({
        "Date": formatDateSimple(t.date),
        "Pair": t.pair,
        "Direction": t.direction,
        "Trade Type": t.tradeType,
        "Setup": t.setup,
        "Entry": t.entryType,
        "Exit": t.exitReason,
        "Result": t.result,
        "PnL": t.calculatedPnL,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trade Log");
    XLSX.writeFile(workbook, `TradeLog_${selectedPair}_${monthNames[currentDate.getMonth()]}.xlsx`);
  };

  const handleDownloadReport = () => {
    try {
        const doc = new jsPDF('l', 'mm', 'a4'); 
        const monthName = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const exportData = getCurrentMonthTradesForExport();

        doc.setFontSize(16); doc.setTextColor(40);
        doc.text(`Monthly Trade Report (${selectedPair}) - ${monthName} ${year}`, 14, 15);
        
        doc.setFontSize(12);
        const pnlColor = totalMonthPnL >= 0 ? [0, 128, 0] : [200, 0, 0];
        doc.setTextColor(...pnlColor);
        doc.text(`Net PnL: ${totalMonthPnL.toFixed(2)}`, 250, 15); 

        const tableColumn = ["Date", "Pair", "Dir", "Trade Type", "Setup", "Entry", "Exit Rsn", "Result", "PnL"];
        const tableRows = [];
        exportData.forEach(t => {
            tableRows.push([formatDateSimple(t.date), t.pair, t.direction, t.tradeType, t.setup, t.entryType, t.exitReason, t.result, t.calculatedPnL]);
        });

        autoTable(doc, {
            head: [tableColumn], body: tableRows, startY: 25, theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9, halign: 'center' },
            styles: { fontSize: 8, cellPadding: 2, valign: 'middle', halign: 'center' },
            columnStyles: { 0: { cellWidth: 22 }, 8: { fontStyle: 'bold' } },
            didParseCell: function(data) {
                if (data.section === 'body' && data.column.index === 8) {
                    const val = parseFloat(data.cell.raw);
                    if (val >= 0) data.cell.styles.textColor = [0, 128, 0]; else data.cell.styles.textColor = [200, 0, 0]; 
                }
            }
        });
        doc.save(`TradeReport_${selectedPair}_${monthName}.pdf`);
    } catch (error) { console.error("PDF Error:", error); alert("PDF failed."); }
  };

  const handlePrintView = async () => {
      if (!calendarRef.current) return;
      setIsPrinting(true);
      const monthTrades = getCurrentMonthTradesForExport();
      const wins = monthTrades.filter(t => parseFloat(t.calculatedPnL) > 0).length;
      const losses = monthTrades.filter(t => parseFloat(t.calculatedPnL) <= 0).length;
      const totalPnL = monthTrades.reduce((acc, t) => acc + parseFloat(t.calculatedPnL), 0);

      await new Promise(resolve => setTimeout(resolve, 800));

      try {
          const canvas = await html2canvas(calendarRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, allowTaint: true });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4'); 
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const rightX = pdfWidth - 15; 

          pdf.setFontSize(16); pdf.setTextColor(40);
          pdf.text(`PnL Calendar View`, 14, 15);
          pdf.setFontSize(10); pdf.setTextColor(100);
          pdf.text(`Period: ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`, 14, 22);
          pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 27);

          pdf.setFontSize(11); pdf.setTextColor(60); 
          pdf.text(`Pair: ${selectedPair}`, rightX, 15, { align: 'right' });
          pdf.text(`Trades: ${monthTrades.length}  ( Wins: ${wins} | Loss: ${losses} )`, rightX, 21, { align: 'right' });
          pdf.setFontSize(12);
          if (totalPnL >= 0) pdf.setTextColor(22, 163, 74); else pdf.setTextColor(220, 38, 38); 
          pdf.text(`Net PnL: ${totalPnL.toFixed(2)}`, rightX, 28, { align: 'right' });

          const imgProps = pdf.getImageProperties(imgData);
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 35, pdfWidth, Math.min(imgHeight, pdfHeight - 40));
          pdf.save(`PnL_Calendar_View_${selectedPair}_${monthNames[currentDate.getMonth()]}.pdf`);
      } catch(error) { console.error("Print Error:", error); alert("Failed to print calendar view."); } finally { setIsPrinting(false); }
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    // 🔥 1. REDUCED PADDING ON MOBILE (p-4 instead of p-6)
    <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-slate-100" style={SAFE_STYLES.container}>
      
      {/* HEADER SECTION - Stacked on Mobile */}
      <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
        
        {/* LEFT: Title, Filter & Export */}
        <div className="flex flex-col gap-3 w-full xl:w-auto">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2" style={SAFE_STYLES.headerText}>
                📅 P&L Calendar 
                {isOptionMode && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">Option (0.5x)</span>}
            </h3>
            
            <div className="flex flex-wrap gap-2 items-center">
                {/* PAIR FILTER */}
                <div className="relative">
                    <select 
                        value={selectedPair} 
                        onChange={(e) => setSelectedPair(e.target.value)}
                        className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded py-1 pl-8 pr-8 focus:outline-none focus:border-blue-500 cursor-pointer"
                        style={{...SAFE_STYLES.neutral, borderColor: '#e2e8f0'}}
                    >
                        {availablePairs.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <Filter className="absolute left-2 top-1.5 text-slate-400" size={14} />
                </div>

                <div className="hidden md:block h-6 w-[1px] bg-slate-200 mx-1"></div>

                {/* BUTTONS */}
                <button onClick={handleDownloadExcel} className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded hover:opacity-80 transition shadow-sm" style={{...SAFE_STYLES.success, border: '1px solid #bbf7d0'}}>
                    <FileSpreadsheet size={14} /> <span className="hidden sm:inline">Excel</span>
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded hover:opacity-80 transition shadow-sm" style={{...SAFE_STYLES.danger, border: '1px solid #fecaca'}}>
                    <FileText size={14} /> <span className="hidden sm:inline">Report</span>
                </button>
                <button onClick={handlePrintView} disabled={isPrinting} className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded hover:opacity-80 transition shadow-sm disabled:opacity-70" style={{...SAFE_STYLES.info, border: '1px solid #bfdbfe'}}>
                    {isPrinting ? <Loader2 className="animate-spin" size={14}/> : <Printer size={14} />} 
                    <span className="hidden sm:inline">Print View</span>
                </button>
            </div>
        </div>

        {/* CENTER: KPI CARDS */}
        <div className="flex gap-4 w-full md:w-auto justify-center md:justify-start">
            <div className="flex flex-col items-center justify-center px-6 py-2 rounded-xl shadow-sm min-w-[100px] md:min-w-[120px]" style={{...SAFE_STYLES.info, border: '1px solid #bfdbfe'}}>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={{color: '#60a5fa'}}>
                    <BarChart2 size={12}/> Trades
                </span>
                <span className="text-xl font-extrabold" style={{color: '#1d4ed8'}}>
                    {totalMonthTrades}
                </span>
            </div>

            <div className="flex flex-col items-center justify-center px-8 py-2 rounded-xl shadow-sm min-w-[140px] md:min-w-[160px]" style={{...SAFE_STYLES.neutral, border: '1px solid #e2e8f0'}}>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1" style={SAFE_STYLES.subText}>
                    <Wallet size={12}/> Net P&L
                </span>
                <span className="text-2xl font-extrabold" style={totalMonthPnL >= 0 ? SAFE_STYLES.textGreen : SAFE_STYLES.textRed}>
                    {totalMonthPnL > 0 ? '+' : ''}{totalMonthPnL.toFixed(2)}
                </span>
            </div>
        </div>

        {/* RIGHT: Navigation */}
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition shadow-sm border border-transparent hover:border-gray-200"><ChevronLeft size={20}/></button>
          <span className="font-bold text-lg min-w-[140px] text-center" style={SAFE_STYLES.headerText}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition shadow-sm border border-transparent hover:border-gray-200"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* 🔥 WRAPPER REF FOR PRINTING */}
      <div ref={calendarRef} className="p-2 rounded-lg bg-white" style={{ backgroundColor: '#ffffff' }}>
          
          {/* 🔥 2. HORIZONTAL SCROLL WRAPPER FOR MOBILE */}
          <div className="overflow-x-auto pb-2">
            
            {/* 🔥 3. MIN-WIDTH CONTAINER TO PREVENT SQUISHING */}
            <div className="min-w-[800px]">
                
                {/* CALENDAR HEADER */}
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                    <div key={d} className="text-xs font-bold tracking-wider" style={SAFE_STYLES.subText}>{d}</div>
                    ))}
                </div>

                {/* CALENDAR GRID */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarData.map((item, index) => {
                    if (!item) return <div key={`empty-${index}`} className="h-28 bg-transparent"></div>;

                    const isProfit = item.pnl >= 0;
                    const hasTrades = item.count > 0;
                    const showMaxBadges = 2; 

                    let cellStyle = { ...SAFE_STYLES.cellBase };
                    if (hasTrades) {
                        cellStyle = isProfit ? 
                            { ...SAFE_STYLES.success, border: '1px solid #bbf7d0' } : 
                            { ...SAFE_STYLES.danger, border: '1px solid #fecaca' };
                    } else {
                        cellStyle = SAFE_STYLES.cellInactive;
                    }

                    return (
                        <div 
                        key={item.date}
                        onClick={() => hasTrades && onDateClick(item.trades)}
                        className={`h-28 rounded-lg p-2 relative group transition-all ${hasTrades ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}`}
                        style={cellStyle}
                        >
                        <span className="text-xs font-bold absolute top-2 left-2" style={{ color: hasTrades ? '#000000' : '#94a3b8' }}>{item.day}</span>
                        
                        <div className="flex flex-col gap-1 items-end absolute top-2 right-2 z-10">
                            {item.directions.slice(0, showMaxBadges).map((dir, i) => (
                                <span key={i} className="text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap uppercase tracking-tighter" style={getDirectionStyle(dir)}>
                                    {dir}
                                </span>
                            ))}
                            
                            {item.count > showMaxBadges && (
                                <span className="text-[9px] font-bold px-1.5 rounded-full shadow-sm" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                    +{item.count - showMaxBadges}
                                </span>
                            )}
                        </div>
                        
                        {hasTrades && (
                            <div className="absolute bottom-2 left-0 right-0 text-center">
                            <p className="text-sm font-extrabold" style={isProfit ? SAFE_STYLES.textGreen : SAFE_STYLES.textRed}>
                                {item.pnl > 0 ? '+' : ''}{item.pnl.toFixed(2)}
                            </p>
                            <span className="text-[10px] font-medium" style={SAFE_STYLES.subText}>{item.count} Trade{item.count > 1 ? 's' : ''}</span>
                            </div>
                        )}
                        </div>
                    );
                    })}
                </div>
            </div> {/* End of min-w container */}
          </div> {/* End of overflow-x container */}
      </div>
    </div>
  );
};

export default PnLCalendar;