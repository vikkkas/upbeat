import { authMiddleware } from "./../../middleware";
import { Router } from "express";
import { prismaClient } from "store/client";
import { config } from "../../config";

const websiteRouter = Router();

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
  } finally {
    // Log the request
  }
});

websiteRouter.get("/status/:websiteId", authMiddleware, async (req, res) => {
  const website = await prismaClient.website.findFirst({
    where: {
      user_id: req.userId!,
      id: req.params.websiteId,
    },
    include: {
      websiteTicks: {
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
    },
  });

  if (!website) {
    res.status(411).json({
      status: "error",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      website,
    },
  });
});

websiteRouter.get("/", (req, res) => {
  console.log(config.server.environment);
  res.send("Hello i am here");
});

export default websiteRouter;
