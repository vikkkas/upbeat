import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  
  if (!header) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  const token = header.split(" ")[1];

  if (!token) {
     return res.status(401).json({
      status: "error",
      message: "Unauthorized - Token missing",
    });
  }
  
  try {
    const data = jwt.verify(token, config.auth.jwtSecret) as { sub: string };
    req.userId = data.sub;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};
