import User from "../models/User.js";
import Post from "../models/Post.js";
import File from "../models/File.js";
import Follow from "../models/Follow.js";

export const showUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const visitedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!visitedUser) {
      return res.status(404).render("error.pug", {
        title: "Usuario no encontrado",
        message: "El usuario que estás buscando no existe o ha sido eliminado.",
      });
    }

    const numberOfPosts = await Post.count({ where: { idUser: id } });

    const numberOfFollowers = await Follow.count({
      where: { followingId: id },
    });
    const numberOfFollowings = await Follow.count({
      where: { followerId: id },
    });

    let isFollowing = false;
    if (req.user) {
      const follow = await Follow.findOne({
        where: { followerId: req.user.id, followingId: id },
      });
      if (follow) isFollowing = true;
    }

    const files = await File.findAll({
      include: [
        {
          model: Post,
          where: { idUser: id },
          attributes: ["id", "title"],
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

    res.render("user/profile.pug", {
      visitedUser: visitedUser.toJSON(),
      files: files.map((file) => file.toJSON()),
      numberOfPosts,
      numberOfFiles: files.length,
      numberOfFollowers,
      numberOfFollowings,
      isFollowing,
    });
  } catch (error) {
    console.error("❌ Error al cargar el perfil del usuario:", error);
    res.status(500).send("Ocurrió un error al cargar el perfil.");
  }
};

// SEGUIR / DEJAR DE SEGUIR A UN USUARIO
export const toggleFollow = async (req, res) => {
  const followingId = req.params.id; // ID del perfil visitado
  const followerId = req.user.id; // ID del usuario logueado

  if (followingId == followerId) {
    return res
      .status(400)
      .json({ success: false, error: "No puedes seguirte a ti mismo" });
  }

  try {
    const follow = await Follow.findOne({ where: { followerId, followingId } });

    if (follow) {
      await follow.destroy();
      return res.json({ success: true, isFollowing: false });
    } else {
      await Follow.create({ followerId, followingId });
      return res.json({ success: true, isFollowing: true });
    }
  } catch (error) {
    console.error("❌ Error al seguir/dejar de seguir:", error);
    return res.status(500).json({
      success: false,
      error: "Ocurrió un error al procesar la solicitud.",
    });
  }
};
