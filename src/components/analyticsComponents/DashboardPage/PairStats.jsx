import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine, LabelList 
} from 'recharts';
import { Layers, HelpCircle, Filter, RefreshCcw, Printer, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 🔥 SAFE STYLES FOR PDF
const SAFE_STYLES = {
    container: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    textTitle: { color: '#334155' },
    textValue: { color: '#1e293b' },
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

const PairStats = ({ trades, isBacktest, isOptionMode }) => {

  // --- STATE ---
  const [filters, setFilters] = usePersistState('pair_stats_filters', {
      year: 'All',
      period: 'All',
      timeframe: 'All'
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const chartRef = useRef(null);

  // --- HELPER ---
  const years = useMemo(() => [...new Set(trades.map(t => new Date(t.date).getFullYear()))].sort(), [trades]);
  const timeframes = useMemo(() => [...new Set(trades.map(t => t.timeframe))].sort(), [trades]);

  const handleFilterChange = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
      setFilters({ year: 'All', period: 'All', timeframe: 'All' });
  };

  const formatCurrency = (val) => {
      if (Math.abs(val) >= 1000) return (val / 1000).toFixed(1) + 'k';
      return val.toFixed(0);
  };

  // --- FILTERING LOGIC ---
  const filteredTrades = useMemo(() => {
      return trades.filter(t => {
          const tDate = new Date(t.date);
          const now = new Date();
          const d = new Date(); d.setDate(1); d.setHours(0,0,0,0);

          if (filters.timeframe !== 'All' && t.timeframe !== filters.timeframe) return false;

          if (filters.year !== 'All') {
              if (tDate.getFullYear().toString() !== filters.year) return false;
          }

          if (filters.period !== 'All') {
              if (filters.period === 'This Month') {
                  if (tDate.getMonth() !== now.getMonth() || tDate.getFullYear() !== now.getFullYear()) return false;
              }
              else if (filters.period === 'Last Month') {
                  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                  if (tDate.getMonth() !== lastMonth.getMonth() || tDate.getFullYear() !== lastMonth.getFullYear()) return false;
              }
              else if (filters.period === 'Last 3 Months') {
                  d.setMonth(d.getMonth() - 3);
                  if (tDate < d) return false;
              }
              else if (filters.period === 'Last 6 Months') {
                  d.setMonth(d.getMonth() - 6);
                  if (tDate < d) return false;
              }
              else if (filters.period === 'Last 9 Months') {
                  d.setMonth(d.getMonth() - 9);
                  if (tDate < d) return false;
              }
          }
          return true;
      });
  }, [trades, filters]);

  // --- DATA PROCESSING ---
  const chartData = useMemo(() => {
    const pairMap = {};

    filteredTrades.forEach(t => {
      const pairName = t.pair ? t.pair.trim().toUpperCase() : 'UNKNOWN';
      let pnl = parseFloat(t.netPnL || 0);

      if (isBacktest && isOptionMode) {
         const isFutureTrade = t.direction && t.direction.includes("Fut");
         if (!isFutureTrade) pnl = pnl * 0.5;
      }

      const isWin = pnl > 0;

      if (!pairMap[pairName]) {
        pairMap[pairName] = { name: pairName, pnl: 0, totalTrades: 0, wins: 0 };
      }

      pairMap[pairName].pnl += pnl;
      pairMap[pairName].totalTrades += 1;
      if (isWin) pairMap[pairName].wins += 1;
    });

    const dataArray = Object.values(pairMap);
    dataArray.sort((a, b) => b.pnl - a.pnl);

    return dataArray;
  }, [filteredTrades, isBacktest, isOptionMode]);


  // --- 📥 PDF DOWNLOAD HANDLER ---
  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;
    setIsDownloading(true);
    
    // Increased wait time for complete render
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
      if (imgData === 'data:,') throw new Error("Canvas generation failed.");

      const pdf = new jsPDF('l', 'mm', 'a4'); 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 1. Title
      pdf.setFontSize(16);
      pdf.setTextColor(40);
      pdf.text('Pair Performance Analysis', 14, 15);

      // 2. Metadata
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      
      pdf.setTextColor(60);
      const filterInfo = `Filters: Period [${filters.period}] • Year [${filters.year}] • TF [${filters.timeframe}]`;
      pdf.text(filterInfo, 14, 28);

      // 3. Image
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 35, pdfWidth, Math.min(imgHeight, pdfHeight - 45));

      pdf.save(`PairStats_${filters.period}_${new Date().toISOString().slice(0,10)}.pdf`);

    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to print PDF. Please ensure charts are fully visible.");
    } finally {
      setIsDownloading(false);
    }
  };

  // --- CUSTOM LABELS (Visible & Safe) ---
  
  // 1. PnL Label (Outside Bar)
  const renderCustomBarLabel = (props) => {
    const { x, y, width, height, value } = props;
    const isPositive = value >= 0;
    const yPos = isPositive ? y - 12 : y + height + 12; 
    
    return (
      <text 
        x={x + width / 2} 
        y={yPos} 
        fill={isPositive ? '#10b981' : '#00000'} 
        textAnchor="middle" 
        fontSize="11" 
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        {value >= 0 ? '+' : ''}{formatCurrency(value)}
      </text>
    );
  };

  // 2. Inner Stats (Inside Bar) - 🔥 FIXED VISIBILITY & SAFETY
  const renderInnerStats = (props) => {
    const { x, y, width, height, index } = props;
    
    // ✅ Safety Check: Prevent accessing undefined index
    if (!chartData || !chartData[index]) return null;

    const data = chartData[index];
    const winRate = ((data.wins / data.totalTrades) * 100).toFixed(0);
    
    // Hide if bar is too small (prevent overflow)
    if (height < 35) return null; 

    return (
      <g>
        {/* Trades Count */}
        <text 
            x={x + width / 2} 
            y={y + height / 2 - 8} 
            fill="#ffffff" 
            textAnchor="middle" 
            fontSize="10" 
            fontWeight="bold"
            fontFamily="sans-serif"
            style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }} // Soft shadow for visibility
        >
          {data.totalTrades} T
        </text>
        
        {/* Win Rate */}
        <text 
            x={x + width / 2} 
            y={y + height / 2 + 8} 
            fill="#ffffff" 
            textAnchor="middle" 
            fontSize="10"
            fontFamily="sans-serif"
            style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
        >
          {winRate}%
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const winRate = data.totalTrades ? ((data.wins / data.totalTrades) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 z-50">
          <p className="text-sm font-bold text-slate-800 mb-1">{label}</p>
          <div className="text-xs space-y-1">
            <p className="flex justify-between gap-4 text-slate-500"><span>Net PnL:</span><span className={`font-bold ${data.pnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>₹{data.pnl.toFixed(2)}</span></p>
            <p className="flex justify-between gap-4 text-slate-500"><span>Trades:</span><span className="font-medium text-slate-700">{data.totalTrades}</span></p>
            <p className="flex justify-between gap-4 text-slate-500"><span>Win Rate:</span><span className="font-medium text-blue-600">{winRate}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-slate-100 h-full flex flex-col" style={SAFE_STYLES.container}>
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
            
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Layers className="text-blue-500" size={20}/> Pair Performance
                    </h3>
                    {isBacktest ? (
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">BACKTEST</span>
                    ) : (
                        <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-100">LIVE</span>
                    )}
                    {isBacktest && isOptionMode && (
                        <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">0.5x</span>
                    )}
                </div>
                <p className="text-xs text-slate-400">Net PnL & Stats by Instrument</p>
            </div>

            {/* FILTER TOOLBAR */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mr-1">
                    <Filter size={14}/>
                </div>

                <select name="year" value={filters.year} onChange={handleFilterChange} className="text-xs bg-white border border-slate-200 rounded px-2 py-1.5 cursor-pointer">
                    <option value="All">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    {years.filter(y => !['2024','2025','2026'].includes(y.toString())).map(y => <option key={y} value={y}>{y}</option>)}
                </select>

                <select name="period" value={filters.period} onChange={handleFilterChange} className="text-xs font-medium bg-white border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none cursor-pointer">
                   <option value="All">All Time</option>
                   <option value="This Month">This Month</option>
                   <option value="Last Month">Last Month</option>
                   <option value="Last 3 Months">Last 3 Months</option>
                   <option value="Last 6 Months">Last 6 Months</option>
                   <option value="Last 9 Months">Last 9 Months</option>
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
                    <span>Print</span>
                </button>
            </div>
        </div>

        {/* CHART AREA (Target for Print) */}
        <div ref={chartRef} className="flex-1 w-full min-h-[250px]" style={{ backgroundColor: '#ffffff' }}>
           {chartData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={chartData} 
                    margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} 
                        axisLine={false} 
                        tickLine={false}
                        interval={0} 
                    />
                    
                    <YAxis 
                        tick={{fontSize: 10, fill: '#94a3b8'}} 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(val) => `₹${formatCurrency(val)}`}
                    />
                    
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                    
                    <ReferenceLine y={0} stroke="#cbd5e1" />

                    {/* 🔥 ANIMATION DISABLED for PDF Capture Stability */}
                    <Bar 
                        dataKey="pnl" 
                        radius={[4, 4, 4, 4]} 
                        isAnimationActive={false} 
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                        ))}
                        
                        <LabelList dataKey="pnl" content={renderCustomBarLabel} />
                        
                        {/* 🔥 FIX: USING INDEX WITH SAFE CHECK */}
                        <LabelList dataKey="totalTrades" content={renderInnerStats} />
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <HelpCircle size={40} className="mb-2 opacity-50"/>
                <p className="text-xs">No pair data available for selected filters</p>
             </div>
           )}
        </div>
    </div>
  );
};

export default PairStats;