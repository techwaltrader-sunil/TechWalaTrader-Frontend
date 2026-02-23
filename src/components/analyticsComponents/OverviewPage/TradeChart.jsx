// components/TradeChart.jsx
import React from 'react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const TradeChart = ({ data, selectedYear }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-[400px] w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Trade Overview Graph</h3>
          <p className="text-sm text-gray-500">{selectedYear}, {selectedYear - 1}</p>
        </div>
        <button className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-50">
          Details
        </button>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[300px] text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            
            <CartesianGrid stroke="#f5f5f5" vertical={false} />
            
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
            
            {/* Left Axis: Values */}
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `${value/1000}k`} />
            
            {/* Right Axis: Percentage */}
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `${value}%`} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'transparent' }}
            />
            
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

            {/* Bars: Current Year (Yellow) */}
            <Bar yAxisId="left" dataKey="current" name={`Current Year (${selectedYear})`} fill="#FACC15" barSize={20} radius={[4, 4, 0, 0]} />
            
            {/* Bars: Previous Year (Black) */}
            <Bar yAxisId="left" dataKey="previous" name={`Previous Year (${selectedYear - 1})`} fill="#000000" barSize={20} radius={[4, 4, 0, 0]} />

            {/* Line: Growth (Orange) */}
            <Line yAxisId="right" type="monotone" dataKey="growth" name="Growth %" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316' }} />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradeChart;