import {Model, DataTypes} from "sequelize";
import { sequelize } from "../config/db.js";

class Post extends Model {}

Post.init(
  {    
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,      
      primaryKey: true
    },
    idUser: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model:"users",
        key: "id"
      }
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    comments_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
    paranoid: true
  }
);

export default Post;