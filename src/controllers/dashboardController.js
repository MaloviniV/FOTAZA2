import Post from "../models/Post.js";
import File from "../models/File.js";
import Follow from "../models/Follow.js";

export const showHome = async (req, res) => {
  const userId = req.user.id;
  try {
    const numberOfPosts = await Post.count({ where: { idUser: userId } });
    const numberOfFiles = await File.count({
      include: [{ model: Post, where: { idUser: userId } }],
    });
    const numberOfFollowers = await Follow.count({
      where: { followingId: userId },
    });
    const numberOfFollowings = await Follow.count({
      where: { followerId: userId },
    });

    res.render("dashboard/index.pug", {
      numberOfPosts,
      numberOfFiles,
      numberOfFollowers,
      numberOfFollowings,
    });
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    res.render("dashboard/index.pug", {
      error: "No se pudieron cargar las estadísticas.",
    });
  }
};

export const showPosts = async (req, res) => {
  const userId = req.user.id;
  //BUSCAR LOS POSTS EN LA BD
  try {
    const response = await Post.findAll({
      where: { idUser: userId },
      include: [{ model: File }],
      raw: true
    });
    const posts = response;

    res.render("dashboard/posts.pug", { posts });
  } catch (error) {
    console.error("Error al buscar posts del usuario:", error);
    res.render("dashboard/posts.pug", {
      posts: [],
      error: "No se pudieron cargar los posts",
    });
  }
};
