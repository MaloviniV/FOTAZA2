import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

class Rating extends Model {}

Rating.init(
  {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    idFile: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "files",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "La calificación debe ser al menos 1",
        },
        max: {
          args: [5],
          msg: "La calificación no puede ser mayor a 5",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Rating",
    tableName: "ratings",
    timestamps: true,
    validate: {
      async notSelfRating() {
        const file = await sequelize.models.File.findByPk(this.idFile, {
          include: [
            {
              model: sequelize.models.Post,
              attributes: ["idUser"],
            },
          ],
        });
        if (file && file.Post && file.Post.idUser === this.idUser) {
          throw new Error("No puedes calificar tu propio archivo.");
        }
      },
    },
  },
);

export default Rating;
