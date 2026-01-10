import { prismaClient } from "store/client";
import { xAddBulk } from "redisstream/client";

async function main() {
  let websites = await prismaClient.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });
  console.log("Fetched websites:", websites.length);
  await xAddBulk(websites.map((w) => ({ url: w.url, id: w.id })));
}

setInterval(
  () => {
    main();
  },
  3 * 1000 
); 

main();
