

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LabelList
} from 'recharts';
import {
  TrendingUp, Filter, RefreshCcw, BarChart2, Printer, Loader2, Calendar
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 🔥 SAFE STYLES FOR PDF
const SAFE_STYLES = {
    container: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    textTitle: { color: '#334155' },
    textValue: { color: '#1e293b' },
    textGreen: { color: '#16a34a' },
    textRed: { color: '#dc2626' },
    chartGrid: { stroke: '#f1f5f9' },
    chartAxis: { fill: '#94a3b8' }
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

const EquityCurve = ({ trades, isBacktest, isOptionMode }) => {

  // --- STATE WITH PERSISTENCE ---
  const [filters, setFilters] = usePersistState('equity_curve_filters', {
      period: 'All',
      startDate: '', 
      endDate: '',   
      pair: 'All',
      timeframe: 'All'
  });

  const [axisView, setAxisView] = usePersistState('equity_curve_axis_view', 'All'); 
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 🔥 MOBILE DETECTION STATE
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const chartRef = useRef(null);

  // --- RESIZE LISTENER ---
  useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Helper: Extract Unique Values ---
  const pairs = useMemo(() => [...new Set(trades.map(t => t.pair))].sort(), [trades]);
  const timeframes = useMemo(() => [...new Set(trades.map(t => t.timeframe))].sort(), [trades]);

  // --- HANDLERS ---
  const handleFilterChange = (e) => {
      const { name, value } = e.target;
      
      if (name === 'period') {
          const now = new Date();
          let newStart = '';
          let newEnd = new Date().toISOString().slice(0, 10); 

          if (value === 'This Month') {
              newStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
          } else if (value === 'Last Month') {
              const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
              newStart = firstDayLastMonth.toISOString().slice(0, 10);
              newEnd = lastDayLastMonth.toISOString().slice(0, 10);
          } else if (value === 'Last 3 Months') {
              const d = new Date(); d.setMonth(d.getMonth() - 3);
              newStart = d.toISOString().slice(0, 10);
          } else if (value === 'Last 6 Months') {
              const d = new Date(); d.setMonth(d.getMonth() - 6);
              newStart = d.toISOString().slice(0, 10);
          } else if (value === 'Last 9 Months') {
              const d = new Date(); d.setMonth(d.getMonth() - 9);
              newStart = d.toISOString().slice(0, 10);
          } else if (value === 'Last 12 Months') {
              const d = new Date(); d.setFullYear(d.getFullYear() - 1);
              newStart = d.toISOString().slice(0, 10);
          } else if (value === 'All') {
              newStart = '';
              newEnd = '';
          }

          setFilters(prev => ({ ...prev, period: value, startDate: newStart, endDate: newEnd }));
      } 
      else if (name === 'startDate' || name === 'endDate') {
          setFilters(prev => ({ ...prev, [name]: value, period: 'Custom' }));
      } 
      else {
          setFilters(prev => ({ ...prev, [name]: value }));
      }
  };

  const resetFilters = () => {
      setFilters({
          period: 'All', startDate: '', endDate: '', pair: 'All', timeframe: 'All'
      });
      setAxisView('All');
  };

  const formatCurrency = (val) => {
      if (Math.abs(val) >= 1000) return (val / 1000).toFixed(1) + 'k';
      return val.toFixed(0);
  };

  // --- CORE LOGIC: Calculation ---
  const chartData = useMemo(() => {
    let filtered = trades.filter(t => {
        const tDate = new Date(t.date);
        
        if (filters.pair !== 'All' && t.pair !== filters.pair) return false;
        if (filters.timeframe !== 'All' && t.timeframe !== filters.timeframe) return false;

        const tTime = tDate.getTime();
        const start = filters.startDate ? new Date(filters.startDate).getTime() : null;
        const end = filters.endDate ? new Date(filters.endDate).setHours(23, 59, 59, 999) : null;

        if (start && tTime < start) return false;
        if (end && tTime > end) return false;

        return true;
    });

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    let processedPoints = [];
    let runningBalance = 0;
    let maxEquity = -Infinity;

    const processTrade = (t) => {
        let pnl = parseFloat(t.netPnL || 0);
        if (isBacktest && isOptionMode) {
            const isFutureTrade = t.direction && t.direction.includes("Fut");
            if (!isFutureTrade) pnl = pnl * 0.5;
        }
        runningBalance += pnl;
        if (runningBalance > maxEquity) maxEquity = runningBalance;
        return { runningBalance, maxEquity };
    };

    if (axisView === 'All') {
        processedPoints = filtered.map(t => {
            const { runningBalance, maxEquity } = processTrade(t);
            return {
                dateStr: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
                equity: runningBalance,
                highWatermark: maxEquity
            };
        });

    } else {
        const aggregatedMap = new Map();
        filtered.forEach(t => {
            const { runningBalance, maxEquity } = processTrade(t);
            const tDate = new Date(t.date);
            let key = "";
            let label = "";

            if (axisView === 'Month') {
                const monthName = tDate.toLocaleString('default', { month: 'short' });
                const yy = tDate.getFullYear().toString().slice(-2);
                key = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
                label = `${monthName} ${yy}`;
            }
            else if (axisView === 'Quarter') {
                const month = tDate.getMonth();
                const q = Math.floor(month / 3) + 1;
                const yy = tDate.getFullYear().toString().slice(-2);
                key = `${tDate.getFullYear()}-Q${q}`;
                label = `Q${q} ${yy}`;
            }
            else if (axisView === 'Year') {
                key = `${tDate.getFullYear()}`;
                label = key;
            }

            aggregatedMap.set(key, {
                dateStr: label,
                equity: runningBalance,
                highWatermark: maxEquity
            });
        });
        processedPoints = Array.from(aggregatedMap.values());
    }

    const totalPoints = processedPoints.length;
    
    // 🔥 SMART LABEL DENSITY (Fixes Overlapping)
    // Mobile: Show only ~5 labels | Desktop: Show ~13 labels
    const targetLabels = isMobile ? 5 : 13; 
    const interval = Math.ceil(totalPoints / targetLabels);

    return processedPoints.map((item, index) => {
        const showLabel = (index % interval === 0) || (index === totalPoints - 1);
        return {
            ...item,
            date: item.dateStr,
            showLabel: showLabel
        };
    });

  }, [trades, filters, isBacktest, isOptionMode, axisView, isMobile]);

  // --- 📥 PDF DOWNLOAD HANDLER ---
  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;
    setIsDownloading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, 
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: true,
        ignoreElements: (element) => element.classList.contains('no-print')
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.setFontSize(16); pdf.setTextColor(40);
      pdf.text('Equity Curve Analysis', 14, 15);

      pdf.setFontSize(10); pdf.setTextColor(100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      
      pdf.setTextColor(60);
      const dateRangeText = filters.startDate && filters.endDate ? `[${filters.startDate} to ${filters.endDate}]` : `[${filters.period}]`;
      const filterInfo = `Filters: Pair [${filters.pair}] • Range ${dateRangeText} • View [${axisView}]`;
      pdf.text(filterInfo, 14, 28);
      
      const currentEquity = chartData.length > 0 ? chartData[chartData.length - 1].equity : 0;
      pdf.setFontSize(12);
      if (currentEquity >= 0) pdf.setTextColor(22, 163, 74); 
      else pdf.setTextColor(220, 38, 38); 
      
      const textStr = `Net Equity: Rs. ${currentEquity.toFixed(2)}`;
      pdf.text(textStr, pdfWidth - 14, 15, { align: 'right' });

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 35, pdfWidth, Math.min(imgHeight, pdfHeight - 45));
      pdf.save(`EquityCurve_${filters.pair}_${new Date().toISOString().slice(0,10)}.pdf`);

    } catch (error) {
      console.error("Export Error:", error);
      alert(`Failed to print PDF.`);
    } finally {
      setIsDownloading(false);
    }
  };

  // 🔥 CUSTOM LABEL COMPONENT (With Responsive Font)
  const CustomLabel = (props) => {
    const { x, y, value, index } = props;
    if (!chartData[index] || !chartData[index].showLabel) return null;
    const labelColor = value >= 0 ? "#059669" : "#ef4444";
    
    return (
        <text 
            x={x} 
            y={y} 
            dy={isMobile ? -8 : -10} // Closer to point on mobile
            fill={labelColor} 
            fontSize={isMobile ? 9 : 11} // Smaller font on mobile
            fontWeight="bold" 
            textAnchor="middle"
        >
            ₹{formatCurrency(value)}
        </text>
    );
  };

  return (
    // 🔥 1. REDUCED PADDING ON MOBILE
    <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-slate-100 mb-8" style={SAFE_STYLES.container}>

        {/* HEADER & TOOLBAR */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
             <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <TrendingUp className="text-green-500" size={20}/> Equity Curve
                </h3>
                <p className="text-xs text-slate-400">Green Area: PnL | Grey Line: High Watermark (Peak)</p>
             </div>

             {/* 🔥 2. SCROLLABLE FILTERS CONTAINER FOR MOBILE */}
             <div className="w-full xl:w-auto overflow-x-auto pb-1 no-scrollbar">
                 <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 min-w-max">

                    <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-1">
                        <BarChart2 size={14} className="text-slate-400"/>
                        <select
                            value={axisView}
                            onChange={(e) => setAxisView(e.target.value)}
                            className="text-xs font-bold text-blue-700 bg-transparent focus:outline-none cursor-pointer"
                        >
                            <option value="All">View: All Trades</option>
                            <option value="Month">View: Monthly</option>
                            <option value="Quarter">View: Quarterly</option>
                            <option value="Year">View: Yearly</option>
                        </select>
                    </div>

                    <select name="period" value={filters.period} onChange={handleFilterChange} className="text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none cursor-pointer">
                       <option value="All">All Periods</option>
                       <option value="Custom">Custom Range</option>
                       <option value="This Month">This Month</option>
                       <option value="Last Month">Last Month</option>
                       <option value="Last 3 Months">Last 3 Months</option>
                       <option value="Last 6 Months">Last 6 Months</option>
                       <option value="Last 12 Months">Last 12 Months</option>
                    </select>

                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1">
                        <Calendar size={12} className="text-slate-400"/>
                        <input 
                            type="date" 
                            name="startDate" 
                            value={filters.startDate} 
                            onChange={handleFilterChange} 
                            className="text-xs outline-none text-slate-600 bg-transparent w-20 md:w-24"
                            placeholder="Start"
                        />
                        <span className="text-slate-300 text-xs">-</span>
                        <input 
                            type="date" 
                            name="endDate" 
                            value={filters.endDate} 
                            onChange={handleFilterChange} 
                            className="text-xs outline-none text-slate-600 bg-transparent w-20 md:w-24"
                            placeholder="End"
                        />
                    </div>

                    <div className="h-4 w-[1px] bg-slate-300"></div>
                    <select name="pair" value={filters.pair} onChange={handleFilterChange} className="text-xs bg-white border border-slate-200 rounded px-2 py-1.5 cursor-pointer max-w-[100px]">
                        <option value="All">All Pairs</option>
                        {pairs.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select name="timeframe" value={filters.timeframe} onChange={handleFilterChange} className="text-xs bg-white border border-slate-200 rounded px-2 py-1.5 cursor-pointer">
                        <option value="All">All TFs</option>
                        {timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                    </select>

                    <button onClick={resetFilters} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded transition" title="Reset Filters">
                        <RefreshCcw size={14} />
                    </button>
                    
                    <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition shadow-sm disabled:opacity-70"
                        title="Download Chart PDF"
                    >
                        {isDownloading ? <Loader2 className="animate-spin" size={14}/> : <Printer size={14} />}
                        <span className="hidden md:inline">Print</span>
                    </button>

                 </div>
             </div>
        </div>

        {/* CHART AREA */}
        <div ref={chartRef} className="h-[300px] w-full bg-white p-2 rounded-lg" style={{ backgroundColor: '#ffffff' }}>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={SAFE_STYLES.chartGrid.stroke}/>
                    <XAxis
                        dataKey="date"
                        tick={{fontSize: isMobile ? 9 : 10, fill: SAFE_STYLES.chartAxis.fill}}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        minTickGap={isMobile ? 50 : 30} // 🔥 3. INCREASED TICK GAP FOR MOBILE
                    />
                    <YAxis
                        tick={{fontSize: isMobile ? 9 : 10, fill: SAFE_STYLES.chartAxis.fill}}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `₹${formatCurrency(val)}`}
                        width={isMobile ? 35 : 40}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}
                        formatter={(value, name) => [
                            `₹${value.toFixed(2)}`,
                            name === 'equity' ? 'Equity' : 'High Watermark'
                        ]}
                    />

                    <Area
                        type="monotone"
                        dataKey="equity"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEquity)"
                        name="equity"
                        isAnimationActive={false} 
                    >
                        {/* 🔥 CUSTOM LABEL COMPONENT */}
                        <LabelList dataKey="equity" content={<CustomLabel />} />
                    </Area>

                    <Line
                        type="monotone"
                        dataKey="highWatermark"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                        name="highWatermark"
                        isAnimationActive={false} 
                    />

                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <Filter size={48} className="mb-2 opacity-50"/>
                    <p className="text-sm font-medium">No trades match the selected filters.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default EquityCurve;