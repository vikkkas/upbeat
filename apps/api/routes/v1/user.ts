import { Router } from "express";
import { AuthInput, SignInInput } from "../../types";
import { prismaClient } from "store/client";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import bcrypt from "bcryptjs";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const data = AuthInput.safeParse(req.body.data);
  if (!data.success) {
    return res.status(403).json({
      status: "error",
      message: "Invalid input",
      errors: data.error.errors,
    });
  }
  try {
    const userFind = await prismaClient.user.findFirst({
      where: { email: data.data.email },
    });
    if (userFind) {
      return res.status(403).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.data.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: data.data.name,
        email: data.data.email,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
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
  const data = SignInInput.safeParse(req.body.data);
  if (!data.success) {
    return res.status(403).json({
      status: "error",
      message: "Invalid input",
      errors: data.error.errors,
    });
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: data.data.email,
      },
    });

    if (!user) {
      return res.status(403).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      data.data.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        sub: user.id,
      },
      config.auth.jwtSecret
    );

    res.status(200).json({
      status: "success",
      data: {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
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
