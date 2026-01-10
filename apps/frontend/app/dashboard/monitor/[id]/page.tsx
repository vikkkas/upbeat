"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Website } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  RefreshCw, 
  Globe, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MonitorPageProps {
    params: Promise<{ id: string }>;
}

export default function MonitorPage({ params }: MonitorPageProps) {
  // Unwrap params using React.use() for Next.js 15+ (as implied by recent versions)
  // or standard unwrap if older. Assuming Next.js 14/15 based on "use client".
  // Note: params is a Promise in newer Next.js versions for server components, 
  // but this is a client component which receives it as a prop.
  // Actually in Next.js 15 client components, params is a Promise. Let's handle it safely.
  
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchWebsite = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.get(`/website/${id}`);
      if (res.data.status === "success") {
        setWebsite(res.data.data.website);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load monitor data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWebsite();
    const interval = setInterval(() => fetchWebsite(false), 60000); // 1 min poll
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <MonitorSkeleton />;
  }

  if (error || !website) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-xl font-semibold text-zinc-400">Monitor Not Found</h2>
            <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
            </Link>
        </div>
    )
  }

  const ticks = website.websiteTicks || [];
  const lastTick = ticks[0];
  const isUp = lastTick?.status === "Up";
  const isDown = lastTick?.status === "Down";
  const statusColor = isUp ? "emerald" : isDown ? "red" : "zinc";
  
  // Calculations
  const totalTicks = ticks.length;
  const upTicks = ticks.filter(t => t.status === "Up").length;
  const downTicks = ticks.filter(t => t.status === "Down").length;
  const uptime = totalTicks > 0 ? ((upTicks / totalTicks) * 100).toFixed(2) : "0.00";
  
  const validResponseTimes = ticks
    .filter(t => t.response_time_ms > 0)
    .map(t => t.response_time_ms);
    
  const avgResponseTime = validResponseTimes.length > 0
    ? Math.round(validResponseTimes.reduce((a, b) => a + b, 0) / validResponseTimes.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
            href="/dashboard" 
            className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchWebsite(true)}
            disabled={refreshing}
            className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <RefreshCw className={cn("mr-2 h-3.5 w-3.5", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Main Status Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    {isUp && <CheckCircle2 className="h-8 w-8 text-emerald-500" />}
                    {isDown && <XCircle className="h-8 w-8 text-red-500" />}
                    {!isUp && !isDown && <AlertCircle className="h-8 w-8 text-zinc-500" />}
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {new URL(website.url).hostname}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                    <Globe className="h-4 w-4" />
                    <a href={website.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                        {website.url}
                    </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Clock className="h-4 w-4" />
                    <span>Last checked: {lastTick ? new Date(lastTick.createdAt).toLocaleTimeString() : "Never"}</span>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-t md:border-t-0 border-zinc-800 pt-6 md:pt-0">
                <StatBox label="Uptime" value={`${uptime}%`} color="text-emerald-500" />
                <StatBox label="Response Time" value={`${avgResponseTime}ms`} color="text-white" />
                <StatBox label="Up (Last 50)" value={upTicks.toString()} color="text-emerald-500" />
                <StatBox label="Down (Last 50)" value={downTicks.toString()} color="text-red-500" />
            </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Status Checks</h2>
            <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-zinc-400">Up</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-zinc-400">Down</span>
                </div>
            </div>
        </div>
        
        {/* Timeline Visual */}
        <div className="flex flex-wrap gap-1 mb-8 overflow-hidden">
            {ticks.slice().reverse().map((tick) => (
                <div 
                    key={tick.id}
                    className={cn(
                        "h-8 w-2 rounded-full transition-all hover:scale-110 cursor-help",
                        tick.status === "Up" ? "bg-emerald-500/50 hover:bg-emerald-500" : 
                        tick.status === "Down" ? "bg-red-500/50 hover:bg-red-500" : "bg-zinc-700/50 hover:bg-zinc-700"
                    )}
                    title={`${new Date(tick.createdAt).toLocaleString()} - ${tick.status} (${tick.response_time_ms}ms)`}
                ></div>
            ))}
            {/* Fill empty if less than 50 */}
            {[...Array(Math.max(0, 50 - ticks.length))].map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-2 rounded-full bg-zinc-800/30"></div>
            ))}
        </div>

        {/* Detailed List */}
        <div className="overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full text-sm text-left">
                <thead className="bg-zinc-900 text-zinc-400 font-medium">
                    <tr>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Timestamp</th>
                        <th className="px-4 py-3">Response Time</th>
                        <th className="px-4 py-3">Region</th>
                     </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-950/20">
                    {ticks.map((tick) => (
                        <tr key={tick.id} className="hover:bg-zinc-900/50 transition-colors">
                            <td className="px-4 py-3">
                                {tick.status === "Up" ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Up
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-500">
                                        <XCircle className="w-3 h-3 mr-1" /> Down
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-zinc-300">
                                {new Date(tick.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono text-zinc-400">
                                {tick.response_time_ms}ms
                            </td>
                            <td className="px-4 py-3 text-zinc-500">
                                Global
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="flex flex-col">
            <span className={cn("text-2xl font-bold tracking-tight", color)}>{value}</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mt-1">{label}</span>
        </div>
    )
}

function MonitorSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 w-32 bg-zinc-800 rounded" />
            <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-xl" />
            <div className="h-96 bg-zinc-900 border border-zinc-800 rounded-xl" />
        </div>
    )
}
