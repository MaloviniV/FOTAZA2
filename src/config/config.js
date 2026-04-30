import dotenv from "dotenv";

//Cargar variables de entorno
dotenv.config();

export const server = {
        port: process.env.PORT || 3000
    }

export const database = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME
    }