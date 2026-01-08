import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization!;
  try {
    let data = jwt.verify(header, config.auth.jwtSecret);
    req.userId = data.sub as string;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};
