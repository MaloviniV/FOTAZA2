import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class Image extends Model {};

Image.init(
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idPost:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "id"
      }
    },
    title:{
      type: DataTypes.STRING(30),
      allowNull: false 
    },
    file_path:{
      type: DataTypes.STRING(200),
      allowNull: false
    },
    copyrigth: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Image",
    tableName: "images",
    timestamps: true
  }
);

export default Image;