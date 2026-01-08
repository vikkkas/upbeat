import "./config";
import express from "express";
import v1Router from "./routes/v1";
import { config } from "./config";

const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

app.listen(config.server.port, () => {
  console.log(`Backend is running on port ${config.server.port}`);
});
