import { Router } from "express";
import { prismaClient } from "store/client";

const websiteRouter = Router();

websiteRouter.post("/", async (req, res) => {
  try {
    const website = await prismaClient.website.create({
      data: {
        url: req.body.url,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        id: website.id,
        url: website.url,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: "error",
      message:
        process.env.ENVIROMENT === "PRODUCTION"
          ? "Internal Server Error"
          : error,
    });
  }
  finally{
    // Log the request
  }
});

websiteRouter.get("/status/:websiteId", (req, res) => {});

websiteRouter.get("/", (req, res) => {
  res.send("Hello i am here");
});

export default websiteRouter;
