import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

const TradeMixChart = ({ data }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition col-span-1 md:col-span-2 flex flex-col md:flex-row items-center">
      <div className="flex-1 p-4">
        <h3 className="text-slate-700 font-bold mb-2">Trade Type Mix</h3>
        <ul className="space-y-3 mt-4">
          {data.map((entry, index) => (
            <li key={index} className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>{entry.name}</div>
              <span className="font-bold bg-slate-50 px-2 py-0.5 rounded">{entry.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-64 w-full md:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
              {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradeMixChart;