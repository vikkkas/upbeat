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
