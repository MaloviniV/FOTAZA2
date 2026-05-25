import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { LIST_TAGS } from "../utils/constants.js";

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
    path: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        is: {
          args: /^(image|video)\/.+$/i,
          msg: "El tipo de archivo debe ser un formato de imagen o video válido."
        }
      }
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
      defaultValue: [],
      validate: {
        validationTags(value){
          if(!Array.isArray(value)) throw new Error("Los tags debe ser un Array");
          value.forEach(tag => {
            if(!LIST_TAGS.includes(tag)) throw new Error(`El Tag ${tag} no es válido`);            
          });          
        }
      }
    },
    openComments: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    textCopyright: {
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
