import "./config";
import express from "express";
import v1Router from "./routes/v1";
import { config } from "./config";
import cors from "cors";

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

app.use(cors({
  origin: ["https://upbeat.vikasworks.tech", "https://upbeat-api.vikasworks.tech"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});
app.use("/api/v1", v1Router);

app.listen(config.server.port, () => {
  console.log(`Backend is running on port ${config.server.port}`);
});
