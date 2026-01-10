"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

interface ResponseTimeChartProps {
  data: Array<{
    timestamp: string | Date;
    response_time_ms?: number;
    avg_response_time?: number;
  }>;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-zinc-400 mb-1">
          {new Date(data.timestamp).toLocaleString()}
        </p>
        <p className="text-sm font-semibold text-emerald-500">
          {Math.round(payload[0].value || 0)}ms
        </p>
      </div>
    );
  }
  return null;
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const chartData = data.map(d => ({
    timestamp: new Date(d.timestamp).getTime(),
    value: d.response_time_ms || d.avg_response_time || 0,
    displayTime: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis 
          dataKey="displayTime" 
          stroke="#71717a"
          tick={{ fill: '#71717a', fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis 
          stroke="#71717a"
          tick={{ fill: '#71717a', fontSize: 12 }}
          label={{ 
            value: 'Response Time (ms)', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#71717a', fontSize: 12 }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#10b981' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
