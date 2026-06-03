import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    idFile: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "files",
        key: "id",
      },
    },
    text: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
    timestamps: true,
  },
);

export default Comment;
