import { Op } from "sequelize";
import File from "../models/File.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { LIST_TAGS } from "../utils/constants.js";

export const searchFiles = async (req, res) => {
  try {
    const { q, tag, type } = req.query;

    const whereFileClause = {};
    const wherePostClause = {};

    // Buscar en textos
    if (q) {
      whereFileClause[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { "$Post.title$": { [Op.iLike]: `%${q}%` } },
      ];
    }

    // Buscar etiquetas
    if (tag) {
      whereFileClause.selectedTags = { [Op.contains]: [tag] };
    }

    // Buscar tipo (imagen/video)
    if (type) {
      whereFileClause.mimetype = { [Op.iLike]: `${type}%` };
    }

    const files = await File.findAll({
      where: whereFileClause,
      include: [
        {
          model: Post,
          where: wherePostClause,
          include: [
            {
              model: User,
              attributes: ["id", "nickname", "avatarUrl"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.render("home/search.pug", {
      files: files.map((f) => f.toJSON()),
      q: q || "",
      tag: tag || "",
      type: type || "",
      listTags: LIST_TAGS,
    });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).render("home/search.pug", {
      error: "Error al realizar la búsqueda.",
      q: req.query.q || "",
    });
  }
};
