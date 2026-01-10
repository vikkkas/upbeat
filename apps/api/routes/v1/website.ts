import { authMiddleware } from "./../../middleware";
import { Router } from "express";
import { prismaClient } from "store/client";
import { config } from "../../config";

const websiteRouter = Router();

// Helper function to parse time range
function parseTimeRange(range: string): { hours: number; interval: string } {
  const ranges = {
    "1h": { hours: 1, interval: "1 hour" },
    "24h": { hours: 24, interval: "24 hours" },
    "7d": { hours: 168, interval: "7 days" },
    "30d": { hours: 720, interval: "30 days" },
  } as const;
  
  return (ranges as any)[range] ?? ranges["24h"];
}

websiteRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const website = await prismaClient.website.create({
      data: {
        url: req.body.url,
        user_id: req.userId!,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        id: website.id,
        url: website.url,
        userId: req.userId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message:
        config.server.environment === "PRODUCTION"
          ? "Internal Server Error"
          : error,
    });
  }
});

websiteRouter.get("/:websiteId", authMiddleware, async (req, res) => {
  try {
    const website = await prismaClient.website.findFirst({
      where: {
        user_id: req.userId!,
        id: req.params.websiteId,
      },
      include: {
        websiteTicks: {
          orderBy: [{ createdAt: "desc" }],
          take: 50,
        },
      },
    });

    if (!website) {
      return res.status(404).json({
        status: "error",
        message: "Website not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        website,
      },
    });
  } catch (error) {
     console.log(error);
     res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// NEW: Get metrics for time-series charts
websiteRouter.get("/:websiteId/metrics", authMiddleware, async (req, res) => {
  try {
    const { websiteId } = req.params;
    const range = (req.query.range as string) || "24h";
    const timeRange = parseTimeRange(range);

    // Verify ownership
    const website = await prismaClient.website.findFirst({
      where: {
        user_id: req.userId!,
        id: websiteId,
      },
    });

    if (!website) {
      return res.status(404).json({
        status: "error",
        message: "Website not found",
      });
    }

    // Calculate time threshold
    const since = new Date(Date.now() - timeRange.hours * 60 * 60 * 1000);

    // Fetch raw data
    const ticks = await prismaClient.websiteTick.findMany({
      where: {
        website_id: websiteId,
        createdAt: {
          gte: since,
        },
      },
      select: {
        createdAt: true,
        response_time_ms: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // For longer ranges, aggregate data client-side to reduce data points
    let metrics = ticks;
    if (timeRange.hours > 24 && ticks.length > 100) {
      // Group by hour for better performance
      const hourlyGroups = new Map<string, typeof ticks>();
      
      ticks.forEach(tick => {
        const hour = new Date(tick.createdAt).setMinutes(0, 0, 0);
        const key = hour.toString();
        if (!hourlyGroups.has(key)) {
          hourlyGroups.set(key, []);
        }
        hourlyGroups.get(key)!.push(tick);
      });

      // Calculate averages for each hour
      metrics = Array.from(hourlyGroups.entries()).map(([hour, groupTicks]) => {
        const avgResponseTime = Math.round(
          groupTicks.reduce((sum, t) => sum + t.response_time_ms, 0) / groupTicks.length
        );
        const upCount = groupTicks.filter(t => t.status === 'Up').length;
        
        return {
          createdAt: new Date(parseInt(hour)),
          response_time_ms: avgResponseTime,
          avg_response_time: avgResponseTime,
          status: upCount > groupTicks.length / 2 ? 'Up' : 'Down',
          up_count: upCount,
          down_count: groupTicks.length - upCount,
          total_checks: groupTicks.length,
          uptime_percentage: ((upCount / groupTicks.length) * 100).toFixed(2)
        };
      });
    }

    res.json({
      status: "success",
      data: {
        range,
        dataPoints: metrics.length,
        metrics: metrics.map(t => ({
          timestamp: t.createdAt,
          response_time_ms: t.response_time_ms,
          avg_response_time: (t as any).avg_response_time || t.response_time_ms,
          status: t.status,
          up_count: (t as any).up_count,
          down_count: (t as any).down_count,
          total_checks: (t as any).total_checks,
          uptime_percentage: (t as any).uptime_percentage
        })),
      },
    });
  } catch (error) {
    console.error("Metrics error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch metrics",
    });
  }
});

websiteRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const websites = await prismaClient.website.findMany({
      where: {
        user_id: req.userId!,
      },
      include: {
        websiteTicks: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        websites,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

export default websiteRouter;
