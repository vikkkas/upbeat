import { Router } from "express";
import userRouter from "./user";
import websiteRouter from "./website";

const router = Router();

router.use("/user", userRouter);
router.use("/website", websiteRouter);

export default router;
