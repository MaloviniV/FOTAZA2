import File from "../models/File.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { sequelize } from "../config/db/db.js";
import { Op } from "sequelize";

const LIMIT = 10;

const getWallPublicFiles = async (currentUserId, offset = 0) => {
  const postInclude = {
    model: Post,
    include: [
      {
        model: User,
        attributes: ["id", "nickname", "avatarUrl"],
      },
    ],
  };

  if (currentUserId) {
    postInclude.where = { idUser: { [Op.ne]: currentUserId } };
  }

  return await File.findAll({
    order: [
      [
        sequelize.literal(
          '(SELECT AVG(score) FROM "ratings" WHERE "ratings"."idFile" = "File"."id")',
        ),
        "DESC NULLS LAST",
      ],
    ],
    limit: LIMIT,
    offset,
    include: [postInclude],
  });
};

//Muestra el muro Publico
export const showWallPublic = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    const files = await getWallPublicFiles(currentUserId);

    if (files.length === 0)
      return res.render("home/index.pug", {
        success: true,
        message: "No se encontraron archivos",
      });

    return res.render("home/index.pug", { success: true, files });
  } catch (error) {
    console.error("Error en la base de datos:", error.message);
    return res.status(500).render("home/index.pug", {
      success: false,
      error: "Error al intentar recuperar los datos",
    });
  }
};
//Paginacion de archivos
export const loadMoreFiles = async (req, res) => {
  const offset = req.body?.offset || 0;
  try {
    const currentUserId = req.user?.id;

    const files = await getWallPublicFiles(currentUserId, offset);

    if (files.length === 0) res.json({ success: true, files });

    return res.render("partials/_card.pug", { success: true, files });
  } catch (error) {
    console.error("Error en la base de datos:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Error al intentar recuperar los datos" });
  }
};
