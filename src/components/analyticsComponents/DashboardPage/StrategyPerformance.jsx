import React, { useMemo, useState, useRef, useEffect } from 'react'; // ✅ Added useEffect
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList 
} from 'recharts';
import { Filter, Activity, Target, TrendingUp, TrendingDown, Wallet, Printer, Loader2, Trophy } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 🔥 SAFE STYLES FOR PDF
const SAFE_STYLES = {
    container: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    card: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
    iconBg: { backgroundColor: '#ffffff' },
    textTitle: { color: '#64748b' },
    textValue: { color: '#1e293b' },
    textGreen: { color: '#16a34a' },
    textRed: { color: '#dc2626' },
    textBlue: { color: '#2563eb' },
    textPurple: { color: '#9333ea' },
    chartAxis: { color: '#64748b', stroke: '#e2e8f0' }
};

// 🔥 CUSTOM HOOK FOR PERSISTENT STATE
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

// 🔥 IMPROVED LABEL COMPONENT FOR PDF COMPATIBILITY
const CustomBarLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value || value === 0) return null;
  
  return (
    <text 
      x={x + width / 2} 
      y={y - 8} 
      fill="#000000" 
      fontSize="11"
      fontWeight="bold"
      textAnchor="middle" 
      style={{ pointerEvents: 'none' }} 
    >
      {value}
    </text>
  );
};

// Helper to truncate long names
const formatXAxis = (tickItem) => {
    if (typeof tickItem === 'string' && tickItem.length > 15) {
        return tickItem.substring(0, 15) + '...';
    }
    return tickItem;
};

// --- KPI STAT CARD ---
const StatCard = ({ title, value, icon, colorStyle }) => (
    <div className="p-3 rounded-lg border flex flex-col justify-between h-full" style={{ ...SAFE_STYLES.card, border: '1px solid #e2e8f0' }}>
        <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={SAFE_STYLES.textTitle}>{title}</p>
            <div className="p-1.5 rounded-md shadow-sm" style={SAFE_STYLES.iconBg}>{icon}</div>
        </div>
        <h3 className="text-lg font-extrabold" style={colorStyle || SAFE_STYLES.textValue}>
            {value}
        </h3>
    </div>
);

const StrategyPerformance = ({ trades, isBacktest, isOptionMode }) => {
  
  // --- STATE WITH PERSISTENCE ---
  // ✅ Using usePersistState instead of simple useState
  const [filters, setFilters] = usePersistState('strategy_filters', {
      pair: 'All',
      period: 'All',
      timeframe: 'All'
  });
  
  const [isDownloading, setIsDownloading] = useState(false);
  const strategyRef = useRef(null);

  // --- HELPERS ---
  const pairs = useMemo(() => [...new Set(trades.map(t => t.pair))].sort(), [trades]);
  const timeframes = useMemo(() => [...new Set(trades.map(t => t.timeframe))].sort(), [trades]);

  const handleFilterChange = (e) => {
      setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- PDF DOWNLOAD HANDLER ---
  const handleDownloadPDF = async () => {
      if (!strategyRef.current) return;
      setIsDownloading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
          const canvas = await html2canvas(strategyRef.current, {
              scale: 3, 
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
          
          // Header
          pdf.setFontSize(16); pdf.setTextColor(40);
          pdf.text("Strategy Performance Report", 10, 15);
          
          pdf.setFontSize(10); pdf.setTextColor(100);
          pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 22);

          pdf.setFontSize(10); pdf.setTextColor(60);
          const filterText = `Filters Applied: Period [ ${filters.period} ]  •  Pair [ ${filters.pair} ]  •  Timeframe [ ${filters.timeframe} ]`;
          pdf.text(filterText, 10, 28);

          const imgProps = pdf.getImageProperties(imgData);
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          const startY = 35;
          const finalHeight = imgHeight > (pdf.internal.pageSize.getHeight() - startY) ? (pdf.internal.pageSize.getHeight() - startY) : imgHeight;
          
          pdf.addImage(imgData, 'PNG', 0, startY, pdfWidth, finalHeight);
          pdf.save(`StrategyPerformance_${filters.period.replace(/\s/g, '')}_${new Date().toISOString().slice(0,10)}.pdf`);

      } catch (error) {
          console.error("PDF Export Error:", error);
          alert("Failed to print PDF.");
      } finally {
          setIsDownloading(false);
      }
  };

  // --- FILTERING LOGIC ---
  const filteredTrades = useMemo(() => {
      return trades.filter(t => {
          const tDate = new Date(t.date);
          const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); 

          if (filters.pair !== 'All' && t.pair !== filters.pair) return false;
          if (filters.timeframe !== 'All' && t.timeframe !== filters.timeframe) return false;

          if (filters.period !== 'All') {
              if (filters.period === 'Last 1 Month') { d.setMonth(d.getMonth() - 1); if (tDate < d) return false; }
              else if (filters.period === 'Last 3 Months') { d.setMonth(d.getMonth() - 3); if (tDate < d) return false; }
              else if (filters.period === 'Last 6 Months') { d.setMonth(d.getMonth() - 6); if (tDate < d) return false; }
              else if (filters.period === 'Last 9 Months') { d.setMonth(d.getMonth() - 9); if (tDate < d) return false; }
              else if (['2026', '2025', '2024'].includes(filters.period)) {
                  if (tDate.getFullYear().toString() !== filters.period) return false;
              }
          }
          return true;
      });
  }, [trades, filters]);

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
      let total = filteredTrades.length;
      let wins = 0; let pnl = 0; let points = 0;
      const setupPerformance = {}; 
      
      filteredTrades.forEach(trade => {
          let netPnlValue = parseFloat(trade.netPnL) || 0;
          let pointsValue = parseFloat(trade.pointsCaptured) || 0;

          if (!trade.netPnL) {
             netPnlValue = (trade.direction?.includes('Short') || trade.direction === 'Put') ? trade.entryPrice - trade.exitPrice : trade.exitPrice - trade.entryPrice;
          }
          if (!trade.pointsCaptured) {
             pointsValue = (trade.direction?.includes('Short') || trade.direction === 'Put') ? trade.entryPrice - trade.exitPrice : trade.exitPrice - trade.entryPrice;
          }

          if (isBacktest && isOptionMode) {
              const isFutureTrade = trade.direction && trade.direction.includes("Fut");
              if (!isFutureTrade) { pointsValue = pointsValue * 0.5; netPnlValue = netPnlValue * 0.5; }
          }

          pnl += netPnlValue; points += pointsValue;

          if (trade.result.includes('TARGET') || trade.result === 'Win' || netPnlValue > 0) {
              wins++;
              const setup = trade.setup || 'Unknown';
              if (!setupPerformance[setup]) setupPerformance[setup] = 0;
              setupPerformance[setup]++;
          }
      });

      const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
      const bestSetup = Object.keys(setupPerformance).sort((a, b) => setupPerformance[b] - setupPerformance[a])[0] || 'N/A';

      return { total, winRate, pnl, points, bestSetup };
  }, [filteredTrades, isBacktest, isOptionMode]);

  const formatCurrency = (val) => {
      if (Math.abs(val) >= 1000) return (val / 1000).toFixed(1) + 'k';
      return val.toFixed(0);
  };

  // --- CHART DATA ---
  const strategyData = useMemo(() => {
      const setupMap = {};
      filteredTrades.forEach(t => {
          const setupName = t.setup || 'Unknown';
          if(!setupMap[setupName]) setupMap[setupName] = { name: setupName, wins: 0, loss: 0 };
          
          if(t.result.includes('TARGET') || t.result === 'Win') {
              setupMap[setupName].wins += 1; 
          } else {
              setupMap[setupName].loss += 1;
          }
      });
      return Object.values(setupMap).sort((a, b) => (b.wins + b.loss) - (a.wins + a.loss));
  }, [filteredTrades]);

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col gap-6" style={SAFE_STYLES.container}>
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
                <h3 className="font-bold flex items-center gap-2 text-lg" style={SAFE_STYLES.textValue}>🔥 Strategy Performance</h3>
                <button onClick={handleDownloadPDF} disabled={isDownloading} className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50">
                    {isDownloading ? <Loader2 className="animate-spin" size={14}/> : <Printer size={14} />} <span>Print</span>
                </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mr-1"><Filter size={14}/></div>
                <select name="period" value={filters.period} onChange={handleFilterChange} className="text-xs border border-slate-200 bg-slate-50 rounded px-2 py-1.5 focus:outline-none cursor-pointer" style={{...SAFE_STYLES.iconBg, color: '#334155'}}>
                    <option value="All">All Time</option><option value="Last 1 Month">Last 1 Month</option><option value="Last 3 Months">Last 3 Months</option><option value="Last 6 Months">Last 6 Months</option><option value="Last 9 Months">Last 9 Months</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option>
                </select>
                <select name="pair" value={filters.pair} onChange={handleFilterChange} className="text-xs border border-slate-200 bg-slate-50 rounded px-2 py-1.5 focus:outline-none cursor-pointer" style={{...SAFE_STYLES.iconBg, color: '#334155'}}>
                    <option value="All">All Pairs</option>{pairs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select name="timeframe" value={filters.timeframe} onChange={handleFilterChange} className="text-xs border border-slate-200 bg-slate-50 rounded px-2 py-1.5 focus:outline-none cursor-pointer" style={{...SAFE_STYLES.iconBg, color: '#334155'}}>
                    <option value="All">All TFs</option>{timeframes.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                </select>
            </div>
        </div>

        {/* 🔥 MAIN CONTENT WRAPPER FOR PDF CAPTURE 🔥 */}
        <div ref={strategyRef} className="flex flex-col gap-6 p-4 rounded" style={SAFE_STYLES.container}>
            
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard title="Total Trades" value={stats.total} icon={<Activity size={16} color="#3b82f6"/>} colorStyle={SAFE_STYLES.textValue} />
                <StatCard title="Win Rate" value={`${stats.winRate}%`} icon={<Target size={16} color={parseFloat(stats.winRate) > 50 ? "#22c55e" : "#ef4444"}/>} colorStyle={parseFloat(stats.winRate) > 50 ? SAFE_STYLES.textGreen : SAFE_STYLES.textBlue} />
                <StatCard title="Total Points" value={stats.points.toFixed(2)} icon={stats.points > 0 ? <TrendingUp size={16} color="#22c55e"/> : <TrendingDown size={16} color="#ef4444"/>} colorStyle={stats.points > 0 ? SAFE_STYLES.textGreen : SAFE_STYLES.textRed} />
                <StatCard title="Total PnL" value={`₹${formatCurrency(stats.pnl)}`} icon={<Wallet size={16} color={stats.pnl > 0 ? "#22c55e" : "#ef4444"}/>} colorStyle={stats.pnl > 0 ? SAFE_STYLES.textGreen : SAFE_STYLES.textRed} />
                <StatCard title="Top Strategy" value={stats.bestSetup} icon={<Trophy size={16} color="#a855f7"/>} colorStyle={SAFE_STYLES.textPurple} />
            </div>

            {/* CHART */}
            <div className="w-full h-[350px]" style={{ backgroundColor: '#ffffff' }}>
                {strategyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strategyData} margin={{ top: 20, right: 10, left: -20, bottom: 60 }}>
                        <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} interval={0} angle={-45} textAnchor="end" tickFormatter={formatXAxis} />
                        <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Bar dataKey="wins" fill="#22c55e" radius={[4,4,0,0]} name="Wins" barSize={30}>
                            {/* 🔥 Explicit LabelList Component to force render in PDF */}
                            <LabelList dataKey="wins" content={<CustomBarLabel />} />
                        </Bar>
                        <Bar dataKey="loss" fill="#ef4444" radius={[4,4,0,0]} name="Losses" barSize={30}>
                            {/* 🔥 Explicit LabelList Component to force render in PDF */}
                            <LabelList dataKey="loss" content={<CustomBarLabel />} />
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                        <p className="text-sm font-medium">No trades match these filters.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default StrategyPerformance;