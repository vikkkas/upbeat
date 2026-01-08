import Router from "express";

const websiteRouter = Router();

websiteRouter.post("/website", (req, res) => {});

websiteRouter.get("/status/:websiteId", (req, res) => {});

websiteRouter.get("/", (req, res) => {
    res.send("Hello i am here")
});

export default websiteRouter;
