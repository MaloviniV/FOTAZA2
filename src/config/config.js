import dotenv from "dotenv";

//Cargar variables de entorno
dotenv.config();

export const server = {
  port: process.env.APP_PORT || 3000,
  debug: process.env.APP_DEBUG === "true",
};

export const database = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
};
