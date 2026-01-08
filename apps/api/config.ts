import "dotenv/config";

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.ENVIRONMENT || "DEVELOPMENT",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
  },
} as const;
