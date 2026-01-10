import { xAck, xAckBulk, xReadGroup } from "redisstream/client";
import axios from "axios";
import { prismaClient } from "store/client";
import { initializeEmailService, getEmailService } from "communication";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;
if (!REGION_ID) throw new Error("REGION_ID is not defined");
if (!WORKER_ID) throw new Error("WORKER_ID is not defined");

// Initialize email service
const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

if (resendApiKey) {
  initializeEmailService(resendApiKey, emailFrom);
  console.log("Email service initialized with Resend");
} else {
  console.warn("RESEND_API_KEY not configured - email notifications will be skipped");
}

function ensureProtocol(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

async function sendNotificationIfNeeded(
  websiteId: string,
  newStatus: "Up" | "Down",
  url: string
) {
  console.log(`[NOTIFICATION] Checking notification for ${url}, status: ${newStatus}`);
  
  try {
    // Get website with user info
    const website = await prismaClient.website.findUnique({
      where: { id: websiteId },
      include: {
        user: true,
      },
    });

    console.log(`[NOTIFICATION] Website found:`, {
      id: website?.id,
      url: website?.url,
      lastStatus: website?.lastStatus,
      userEmail: website?.user?.email,
      hasEmail: !!website?.user?.email
    });

    if (!website || !website.user.email) {
      console.log(`[NOTIFICATION] Skipping - No website or email configured`);
      return; // No email configured
    }

    // Check if email service is initialized
    try {
      const emailService = getEmailService();
      console.log(`[NOTIFICATION] Email service retrieved successfully`);
    } catch (error) {
      console.error(`[NOTIFICATION] Email service not initialized:`, error);
      return;
    }

    const emailService = getEmailService();
    const now = new Date();

    console.log(`[NOTIFICATION] Status comparison - Last: ${website.lastStatus}, New: ${newStatus}`);

    // Check if status changed
    if (website.lastStatus !== newStatus) {
      console.log(`[NOTIFICATION] Status changed! Preparing to send email...`);
      
      // Prevent notification spam - wait at least 5 minutes between notifications
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      if (
        website.lastNotificationSent &&
        website.lastNotificationSent > fiveMinutesAgo
      ) {
        console.log(`[NOTIFICATION] Skipping - Too soon since last notification (${website.lastNotificationSent})`);
        return;
      }

      if (newStatus === "Down") {
        // Website went down
        console.log(`[NOTIFICATION] Sending DOWNTIME alert to ${website.user.email}...`);
        await emailService.sendDowntimeAlert(
          website.user.email,
          url,
          now
        );
        console.log(`[NOTIFICATION] ✅ Sent downtime alert for ${url} to ${website.user.email}`);
      } else if (newStatus === "Up" && website.lastStatus === "Down") {
        // Website came back up
        const downtimeDuration = website.lastNotificationSent
          ? `${Math.round((now.getTime() - website.lastNotificationSent.getTime()) / 60000)} minutes`
          : "Unknown";
        
        console.log(`[NOTIFICATION] Sending UPTIME RESTORED alert to ${website.user.email}...`);
        await emailService.sendUptimeRestoredAlert(
          website.user.email,
          url,
          now,
          downtimeDuration
        );
        console.log(`[NOTIFICATION] ✅ Sent uptime restored alert for ${url} to ${website.user.email}`);
      }

      // Update last notification time and status
      console.log(`[NOTIFICATION] Updating website status in database...`);
      await prismaClient.website.update({
        where: { id: websiteId },
        data: {
          lastNotificationSent: now,
          lastStatus: newStatus,
        },
      });
      console.log(`[NOTIFICATION] Database updated successfully`);
    } else {
      console.log(`[NOTIFICATION] No status change - skipping notification`);
    }
  } catch (error) {
    console.error(`[NOTIFICATION] ❌ Failed to send notification for ${url}:`, error);
  }
}

async function fetchWebsite(url: string, websiteId: string) {
  return new Promise<void>(async (resolve, reject) => {
    const fullUrl = ensureProtocol(url);
    const startTime = Date.now();
    axios
      .get(fullUrl)
      .then(async () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        await prismaClient.websiteTick.create({
          data: {
            response_time_ms: responseTime,
            website_id: websiteId,
            status: "Up",
            region_id: REGION_ID,
          },
        });
        
        // Send notification if status changed
        await sendNotificationIfNeeded(websiteId, "Up", url);
        
        resolve();
      })
      .catch(async () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        await prismaClient.websiteTick.create({
          data: {
            response_time_ms: responseTime,
            website_id: websiteId,
            status: "Down",
            region_id: REGION_ID,
          },
        });
        
        // Send notification if status changed
        await sendNotificationIfNeeded(websiteId, "Down", url);
        
        resolve();
      });
  });
}

async function main() {
  while (true) {
    const response = await xReadGroup(REGION_ID, WORKER_ID);
    if (!response || response.length === 0) {
      continue;
    }
    console.log("Fetched", response.length, "messages");
    let promises = response.map(({ id, message }) =>
      fetchWebsite(message.url, message.id)
    );
    await Promise.all(promises);
    xAckBulk(
      REGION_ID,
      response.map(({ id }) => id)
    );
  }
}

main();
