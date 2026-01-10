"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from 'recharts';

interface StatusDistributionChartProps {
  upCount: number;
  downCount: number;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-semibold" style={{ color: data.payload.color }}>
          {data.name}: {data.value}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          {((data.value / (payload[0].payload.total || 1)) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
}

export function StatusDistributionChart({ upCount, downCount }: StatusDistributionChartProps) {
  const total = upCount + downCount;
  
  const data = [
    { name: 'Up', value: upCount, color: '#10b981', total },
    { name: 'Down', value: downCount, color: '#ef4444', total }
  ];

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-zinc-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          formatter={(value, entry: any) => (
            <span style={{ color: '#a1a1aa' }}>
              {value}: {entry.payload.value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
