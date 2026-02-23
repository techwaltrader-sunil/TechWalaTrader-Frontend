import React, { useState, useMemo, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LabelList 
} from 'recharts';
import { Brain, AlertTriangle, Printer, Loader2, Smile } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 🔥 SAFE STYLES FOR PRINTING
const SAFE_STYLES = {
    container: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
    textTitle: { color: '#334155' },
    subText: { color: '#64748b' },
};

const PsychologyAnalytics = ({ trades }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);

  // --- 1. DATA PROCESSING ENGINE ---
  const analyticsData = useMemo(() => {
    const mistakeMap = {};
    const emotionMap = {};
    let totalLossDueToMistakes = 0;

    trades.forEach(trade => {
        const pnl = parseFloat(trade.netPnL) || 0;
        
        // A. MISTAKE ANALYSIS
        const mistakes = Array.isArray(trade.mistakes) ? trade.mistakes : (trade.mistake ? [trade.mistake] : []);
        
        mistakes.forEach(m => {
            if (m === "NO MISTAKE" || m === "No Mistake" || !m) return;
            
            if (!mistakeMap[m]) mistakeMap[m] = { name: m, loss: 0, count: 0 };
            
            // Only count LOSSES for "Cost of Mistake"
            if (pnl < 0) {
                mistakeMap[m].loss += Math.abs(pnl); 
                totalLossDueToMistakes += Math.abs(pnl);
            }
            // Count every time this mistake was logged in a losing trade
            if (pnl < 0) mistakeMap[m].count += 1;
        });

        // B. EMOTION ANALYSIS
        const emo = trade.emotion || trade.emotions || "Neutral";
        if (!emotionMap[emo]) emotionMap[emo] = { name: emo, value: 0 };
        emotionMap[emo].value += 1;
    });

    // Convert to Arrays & Sort
    const mistakeChartData = Object.values(mistakeMap).sort((a, b) => b.loss - a.loss).slice(0, 6); 
    const emotionChartData = Object.values(emotionMap);

    return { mistakeChartData, emotionChartData, totalLossDueToMistakes };
  }, [trades]);

  // --- 2. COLORS & FORMATTING ---
  const EMOTION_COLORS = {
      "Neutral": "#94a3b8",
      "Confident": "#3b82f6",
      "Anxious": "#eab308",
      "FOMO": "#f97316",
      "Greedy": "#22c55e",
      "Revenge": "#ef4444",
      "Hopeful": "#a855f7"
  };

  const formatCurrency = (val) => {
      if (Math.abs(val) >= 1000) return (val / 1000).toFixed(1) + 'k';
      return val.toFixed(0);
  };

  // 🔥 CUSTOM LABEL RENDERER (Centered Inside Bar)
  const renderCustomBarLabel = (props) => {
      const { x, y, width, height, value, payload } = props;
      
      // ✅ SAFETY CHECK: Prevent Crash if data is loading
      if (!value || !payload) return null;

      // Logic: If bar is wide enough (> 80px), show inside center. Else show outside.
      const isWideEnough = width > 80;
      
      const xPos = isWideEnough ? x + width / 2 : x + width + 5;
      const textAnchor = isWideEnough ? "middle" : "start";
      const fill = isWideEnough ? "#ffffff" : "#ef4444"; // White inside, Red outside

      return (
        <text 
            x={xPos} 
            y={y + height / 2 + 4} // Vertically centered
            fill={fill} 
            textAnchor={textAnchor} 
            fontSize={11} 
            fontWeight="bold"
            style={{ 
                textShadow: isWideEnough ? '0px 1px 3px rgba(0,0,0,0.5)' : 'none', // Shadow for readability
                pointerEvents: 'none'
            }}
        >
            ₹{formatCurrency(value)} ({payload.count} T)
        </text>
      );
  };

  // --- 3. PRINT HANDLER ---
  const handlePrint = async () => {
      if (!printRef.current) return;
      setIsPrinting(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
          const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          
          pdf.setFontSize(16); pdf.setTextColor(40);
          pdf.text('Trading Psychology Report', 14, 15);
          pdf.setFontSize(10); pdf.setTextColor(100);
          pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

          const imgProps = pdf.getImageProperties(imgData);
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, imgHeight);
          pdf.save(`Psychology_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      } catch (err) {
          console.error("Print Failed", err);
          alert("Print Failed");
      } finally {
          setIsPrinting(false);
      }
  };

  if (!trades || trades.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-slate-100 mb-8" style={SAFE_STYLES.container}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Brain className="text-purple-600" size={20}/> Psychology & Mistake Analytics
                </h3>
                <p className="text-xs text-slate-400">Analyze the hidden cost of your emotions.</p>
            </div>
            <button 
                onClick={handlePrint} 
                disabled={isPrinting}
                className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded text-xs font-bold transition border border-purple-200"
            >
                {isPrinting ? <Loader2 className="animate-spin" size={14}/> : <Printer size={14}/>} Print
            </button>
        </div>

        {/* PRINTABLE AREA */}
        <div ref={printRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-2">
            
            {/* 1. COST OF MISTAKES (BAR CHART) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500"/> Cost of Mistakes
                    </h4>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Total Loss due to Mistakes</p>
                        <p className="text-lg font-bold text-red-600">-₹{analyticsData.totalLossDueToMistakes.toFixed(0)}</p>
                    </div>
                </div>

                <div className="h-[300px] w-full"> 
                    {analyticsData.mistakeChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={analyticsData.mistakeChartData} margin={{ top: 5, right: 60, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    tick={{fontSize: 11, fill: '#475569', fontWeight: '600'}} 
                                    width={100}
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}}
                                    formatter={(val, name, props) => [`₹${val} (${props.payload.count} trades)`, 'Loss Impact']}
                                />
                                <Bar dataKey="loss" radius={[0, 6, 6, 0]} barSize={32} isAnimationActive={false}>
                                    {analyticsData.mistakeChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#ef4444" />
                                    ))}
                                    {/* 🔥 Custom Label List showing Amount & Count */}
                                    <LabelList dataKey="loss" content={renderCustomBarLabel} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                            <Smile size={40} className="mb-2"/>
                            <p className="text-xs">No mistakes recorded in losing trades yet!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. EMOTIONAL STATE (PIE CHART) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                    <Brain size={16} className="text-blue-500"/> Emotional State Distribution
                </h4>
                
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={analyticsData.emotionChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                isAnimationActive={false}
                            >
                                {analyticsData.emotionChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name] || '#cbd5e1'} stroke="none"/>
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}}/>
                            <Legend 
                                verticalAlign="middle" 
                                align="right" 
                                layout="vertical"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{fontSize: '11px', fontWeight: '600', color: '#475569'}}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    </div>
  );
};

export default PsychologyAnalytics;