"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { AddSiteDialog } from "@/app/dashboard/components/add-site-dialog";
import { SiteCard } from "@/app/dashboard/components/site-card";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface Website {
  id: string;
  url: string;
  websiteTicks: {
    id: string;
    status: "Up" | "Down" | "Unknown";
    response_time_ms: number;
    createdAt: string;
  }[];
}

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWebsites = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setIsRefreshing(true);
    try {
      const res = await api.get("/website");
      if (res.data.status === "success") {
        setWebsites(res.data.data.websites);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWebsites();

    // Poll every 3 minutes
    const interval = setInterval(() => {
        fetchWebsites(false); // Silent update
    }, 3 * 60 * 1000); 

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
      fetchWebsites(true);
  }

  const filteredWebsites = websites.filter((site) =>
    site.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Monitors</h1>
          <p className="text-zinc-400 mt-1">
            Manage and track your uptime monitors.
          </p>
        </div>
        <div className="flex items-center gap-3">
             <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="h-9 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                disabled={isRefreshing}
            >
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Refresh
            </Button>
            <AddSiteDialog onSiteAdded={() => fetchWebsites(true)} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search monitors..."
            className="pl-9 bg-zinc-900 border-zinc-800 focus:ring-emerald-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px] bg-zinc-800" />
                        <Skeleton className="h-4 w-[100px] bg-zinc-800" />
                    </div>
                    <div className="flex items-center space-x-4 pt-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px] bg-zinc-800" />
                             <Skeleton className="h-4 w-[150px] bg-zinc-800" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : filteredWebsites.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/50">
          <h3 className="text-lg font-medium text-white mb-2">No monitors yet</h3>
          <p className="text-zinc-500 mb-6">Start monitoring your first website.</p>
          <AddSiteDialog onSiteAdded={() => fetchWebsites(true)} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWebsites.map((site) => (
            <SiteCard key={site.id} website={site} />
          ))}
        </div>
      )}
    </div>
  );
}
