import { xAck, xAckBulk, xReadGroup } from "redisstream/client";
import axios from "axios";
import { prismaClient } from "store/client";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;
if (!REGION_ID) throw new Error("REGION_ID is not defined");
if (!WORKER_ID) throw new Error("WORKER_ID is not defined");

function ensureProtocol(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
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
