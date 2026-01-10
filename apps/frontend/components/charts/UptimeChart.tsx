"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

interface UptimeChartProps {
  data: Array<{
    timestamp: string | Date;
    uptime_percentage?: string | number;
    up_count?: number;
    down_count?: number;
    total_checks?: number;
    status?: 'Up' | 'Down' | 'Unknown';
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
          {Number(payload[0].value).toFixed(2)}% Uptime
        </p>
        {data.up_count !== undefined && (
          <p className="text-xs text-zinc-500 mt-1">
            {data.up_count} up / {data.down_count} down
          </p>
        )}
      </div>
    );
  }
  return null;
}

export function UptimeChart({ data }: UptimeChartProps) {
  // If we have raw tick data (with status field), calculate uptime percentage
  const hasStatusField = data.length > 0 && 'status' in data[0];
  
  const chartData = data.map((d, index, array) => {
    let uptimeValue = 100; // Default to 100% if we can't calculate
    
    if (d.uptime_percentage !== undefined) {
      // Use provided uptime percentage
      uptimeValue = typeof d.uptime_percentage === 'string' 
        ? parseFloat(d.uptime_percentage) 
        : d.uptime_percentage;
    } else if (d.up_count !== undefined && d.total_checks !== undefined && d.total_checks > 0) {
      // Calculate from aggregated counts
      uptimeValue = (d.up_count / d.total_checks) * 100;
    } else if (hasStatusField) {
      // For raw data, calculate rolling uptime from status
      const windowSize = Math.min(10, index + 1); // Look at last 10 ticks
      const recentTicks = array.slice(Math.max(0, index - windowSize + 1), index + 1);
      const upCount = recentTicks.filter((t: any) => t.status === 'Up').length;
      uptimeValue = (upCount / recentTicks.length) * 100;
    }

    return {
      timestamp: new Date(d.timestamp).getTime(),
      value: uptimeValue,
      displayTime: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      up_count: d.up_count,
      down_count: d.down_count
    };
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
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
          domain={[0, 100]}
          label={{ 
            value: 'Uptime %', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#71717a', fontSize: 12 }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#10b981" 
          strokeWidth={2}
          fill="url(#uptimeGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
