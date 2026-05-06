import { Sequelize } from "sequelize";
import { database } from "./config.js"

const sequelize = new Sequelize(database.name, database.user, database.password, {
  host: database.host,
  dialect: database.dialect,
  logging: console.log
});

export default sequelize;