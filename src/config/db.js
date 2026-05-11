import { Sequelize } from "sequelize";
import { database, server } from "./config.js"

const sequelize = new Sequelize(database.name, database.user, database.password, {
  host: database.host,
  dialect: database.dialect,
  logging: server.debug? console.log : false
});

export default sequelize;