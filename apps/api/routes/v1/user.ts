import { Router } from "express";
import { AuthInput } from "../../types";
import { prismaClient } from "store/client";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const data = AuthInput.safeParse(req.body.data);
  if (!data.success) {
    return res.status(403).json({
      status: "error",
      message: "Invalid input",
    });
  }
  try {
    const userFind = await prismaClient.User.findFirst({
      where: { username: data.data.username },
    });
    if (userFind) {
      return res.status(403).json({
        status: "error",
        message: "Username already exists",
      });
    }

    const user = await prismaClient.User.create({
      data: {
        username: data.data.username,
        password: data.data.password,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message:
        process.env.ENVIROMENT === "PRODUCTION"
          ? "Internal Server Error"
          : error,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const data = AuthInput.safeParse(req.body.data);

  if (!data.success) {
    return res.status(403).json({
      status: "error",
      message: "Invalid input",
    });
  }
  try {
    const user = await prismaClient.User.findFirst({
      where: { username: data.data.username, password: data.data.password },
    });
    const token = jwt.sign(
      { sub: user?.id, username: user?.username },
      config.auth.jwtSecret
    );
    res.status(200).json({
      status: "success",
      data: {
        token,
        id: user.id,
        username: user.username,
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

userRouter.get("/", (req, res) => {
  res.send("Hello i am here");
});

export default userRouter;
