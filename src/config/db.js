import { Sequelize } from "sequelize";
import { database, server } from "./config.js";

export const sequelize = new Sequelize(database.name, database.user, database.password, {
  host: database.host,
  dialect: database.dialect,
  logging: server.debug? console.log : false
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida con éxito.");

    await sequelize.sync({alter: true});
    console.log("✅ BD sincronizada con exito");
  } catch (error) {
    throw error
  }
} 