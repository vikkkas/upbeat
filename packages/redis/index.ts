import { createClient } from "redis";

const client = await createClient({
  url: "redis://localhost:6379",
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {
  url: string;
  id: string;
};
type MessageType = {
  id: string;
  message: {
    url: string;
    id: string;
  };
};
const STREAM_NAME = "sitebeat:website";

async function xAdd({ url, id }: WebsiteEvent) {
  await client.xAdd(STREAM_NAME, "*", {
    url,
    id,
  });
}

export async function xAddBulk(websites: WebsiteEvent[]) {
  for (let i = 0; i < websites.length; i++) {
    const website = websites[i];
    if (website) {
      await xAdd({ url: website.url, id: website.id });
    }
  }
}

export async function xReadGroup(
  consumerGroup: string,
  workerId: string
): Promise<MessageType[] | undefined> {
  const res = await client.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_NAME,
      id: ">",
    },
    {
      COUNT: 5,
      BLOCK: 0,
    }
  );

  // @ts-ignore
  let messages: MessageType[] | undefined = res?.[0]?.messages;
  return messages;
}

export async function xAck(consumerGroup: string, streamId: string) {
  await client.xAck(STREAM_NAME, consumerGroup, streamId);
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  eventIds.map((eventId) => xAck(consumerGroup, eventId));
}
