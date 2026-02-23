import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Hash, Layers } from "lucide-react";

// Helper for Colors
const BAR_COLORS = { COUNT: "#8b5cf6", BROKERAGE: "#f97316", POS: "#3b82f6", NEG: "#ef4444" };

const CustomTooltip = ({ active, payload, metricMode, resultFilter }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-slate-200 shadow-md rounded-lg text-xs z-50">
          <p className="font-bold text-slate-700 mb-1">{data.name}</p>
          <p className={`font-bold ${metricMode === "COUNT" ? "text-purple-600" : resultFilter === "Brokerage" ? "text-orange-600" : data.realValue >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {metricMode === "VALUE" && resultFilter !== "Brokerage" && data.realValue >= 0 ? "+" : ""}
            {metricMode === "VALUE" && resultFilter === "Brokerage" ? "₹" : ""}
            {data.realValue.toLocaleString()}
            {metricMode === "VALUE" && resultFilter !== "Brokerage" ? " ₹" : ""}
            {metricMode === "COUNT" ? " Trades" : ""}
          </p>
        </div>
      );
    }
    return null;
};

const SetupChart = ({ data, metricMode, resultFilter }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2">
        {metricMode === "COUNT" ? <Hash size={18} className="text-purple-500" /> : <Layers size={18} className="text-blue-500" />}
        {metricMode === "COUNT" ? "Most Used Setups (by Count)" : resultFilter === "Brokerage" ? "Highest Paying Setups" : "Top Setups (by Value)"}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={70} tickMargin={2} interval={0} tick={{ fill: "#64748b", fontSize: 10, fontWeight: "800", textAnchor: "end" }} />
            <Tooltip content={<CustomTooltip metricMode={metricMode} resultFilter={resultFilter} />} cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="plotValue" radius={[0, 4, 4, 0]} barSize={25} minPointSize={60}>
              {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={metricMode === "COUNT" ? BAR_COLORS.COUNT : resultFilter === "Brokerage" ? BAR_COLORS.BROKERAGE : entry.realValue >= 0 ? BAR_COLORS.POS : BAR_COLORS.NEG} />))}
              <LabelList dataKey="realValue" position="inside" fill="#ffffff" style={{ fontWeight: "bold", fontSize: "10px" }} formatter={(val) => metricMode === "COUNT" ? `${val}` : `${val.toLocaleString()} ₹`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SetupChart;