import * as dotenv from "dotenv";
import * as process from "process";

dotenv.config();

const env = {
  APP_ENV: process.env.APP_ENV || "dev",
  AKENEO_APP_CLIENT_ID: process.env.AKENEO_APP_CLIENT_ID || "xxx",
  AKENEO_APP_CLIENT_SECRET: process.env.AKENEO_APP_CLIENT_SECRET || "xxx",
};

export { env };
