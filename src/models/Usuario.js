import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db.js";
import { ROLES, LIST_ROLES } from "../utils/constants.js";

class User extends Model {}

User.init(
  {    
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,      
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(...LIST_ROLES),
      allowNull: false,
      defaultValue: ROLES.USER
    },
    suspendedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true
  }
);

export default User;