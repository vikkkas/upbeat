import Link from "next/link";
import { Website } from "@/app/dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteCard({ website }: { website: Website }) {
  const lastTick = website.websiteTicks?.[0];
  const hasTicks = website.websiteTicks && website.websiteTicks.length > 0;
  
  // Status logic
  const isChecking = !hasTicks;
  const status = isChecking ? "Checking" : (lastTick?.status || "Unknown");
  
  const isUp = status === "Up";
  const isDown = status === "Down";
  const isUnknown = status === "Unknown";

  return (
    <Link href={`/dashboard/monitor/${website.id}`}>
        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 truncate max-w-[200px] group-hover:text-white transition-colors">
            {website.url}
            </CardTitle>
            <div 
                className={cn(
                    "flex text-xs px-2 py-0.5 rounded-full items-center gap-1.5 border",
                    isUp && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    isDown && "bg-red-500/10 text-red-500 border-red-500/20",
                    isUnknown && "bg-zinc-500/10 text-zinc-400 border-zinc-800",
                    isChecking && "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}
            >
                {isChecking ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isUp && "bg-emerald-500 animate-pulse",
                        isDown && "bg-red-500",
                        isUnknown && "bg-zinc-500"
                    )}></span>
                )}
                {status}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="p-2 rounded-md bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors">
                    <Globe className="h-5 w-5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <span className="truncate text-lg">{new URL(website.url).hostname}</span>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-600">Last Checked</span>
                    <span className="text-zinc-300">{lastTick ? new Date(lastTick.createdAt).toLocaleTimeString() : "Pending..."}</span>
            </div>
            <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-600">Response</span>
                    <span className={cn("text-zinc-300 font-mono", isChecking && "animate-pulse")}>
                        {lastTick ? `${lastTick.response_time_ms}ms` : "--"}
                    </span>
            </div>
            </div>
        </CardContent>
        </Card>
    </Link>
  );
}
