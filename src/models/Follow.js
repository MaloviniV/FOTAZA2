import {Model, DataTypes} from "sequelize";
import { sequelize } from "../config/db.js";
import { STATUS_FOLLOW, LIST_STATUS_FOLLOW } from "../utils/constants.js";

class Follow extends Model {}

Follow.init(
  {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,      
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      }
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,      
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      }
    },
    status: {
      type: DataTypes.ENUM(...LIST_STATUS_FOLLOW),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Follow",
    tableName: "follows",
    timestamps: true,
    paranoid: true,
    validate: {
      seguirse() {
        if(this.followerId===this.followingId) {
          throw new Error("Un usuario no puede seguirse a sí mismo.");          
        }
      }
    }
  }
);

export default Follow;