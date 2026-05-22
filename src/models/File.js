import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class File extends Model {}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idPost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        is: {
          args: /^(image|video)\/.+$/i,
          msg: "El tipo de archivo debe ser un formato de imagen o video válido."
        }
      }
    },
    mime_file: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    copyrigth: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "File",
    tableName: "files",
    timestamps: true,
  },
);

export default File;
