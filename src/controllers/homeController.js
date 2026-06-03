import File from "../models/File.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import fs from "fs";

const LIMIT = 10;

export const showWallPublic = async (req, res) => {
  try {
    const response = await File.findAll({
      order: [],
      limit: LIMIT,
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
      ],
    });

    if (response.length === 0)
      return res.render("home/wallPublic.pug", {
        success: true,
        message: "No se encontraron archivos",
      });

    return res.render("home/wallPublic.pug", {
      success: true,
      files: response,
    });
  } catch (error) {
    console.error("Error en la base de datos:", error.message);
    return res
      .status(500)
      .render("home/wallPublic.pug", {
        success: false,
        error: "Error al intentar recuperar los datos",
      });
  }
};
/* 
export const contact = (req, res) => {
  res.send("Formulario de contacto");
} */
