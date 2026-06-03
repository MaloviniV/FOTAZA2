import File from "../models/File.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { Op } from "sequelize";

const LIMIT = 10;
export const loadMoreFiles = async (req, res) => {
  const offset = req.body?.offset || 0;
  try {
    const currentUserId = req.user?.id;

    const postInclude = {
      model: Post,
      include: [
        {
          model: User,
          attributes: ["id", "nickname", "avatarUrl"],
        },
      ],
    };

    // Si hay un usuario logueado, excluimos sus publicaciones
    if (currentUserId) {
      postInclude.where = { idUser: { [Op.ne]: currentUserId } };
    }

    const response = await File.findAll({
      order: [],
      limit: LIMIT,
      offset: offset,
      include: [postInclude],
    });

    return res.render("partials/_card.pug", { success: true, files: response });
  } catch (error) {
    console.error("Error en la base de datos:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Error al intentar recuperar los datos" });
  }
};
