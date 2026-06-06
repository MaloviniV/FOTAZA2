import dotenv from "dotenv";

dotenv.config();

export const server = {
  port: process.env.APP_PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || "secreto_por_defecto_123",
  isProduction: !!process.env.VERCEL  //VERIFICA SI ESTA DESPLEGADO EN VERCEL
};

export const database = {
  dialect: process.env.DB_DIALECT || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  name: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  sync: process.env.DB_SYNC === "true"
};

export const serviceBlob = {
  vercelBlobToken: process.env.BLOB_READ_WRITE_TOKEN
};
