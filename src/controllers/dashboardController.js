import Post from "../models/Post.js";
import File from "../models/File.js";
  //REEMPLAZAR CON CONSULTA A LA BD
  
  const estatistics = {
    numberOfFiles: 5,
    numberOfPosts: 1,
    numberOfFollowings: 12,
    numberOfFollowers: 3
  };
  
export const showHome = (req, res) => {
  res.render("dashboard/home.pug", estatistics);
}

export const showPosts = async (req, res) => {
  const userId = req.user.id;
  //BUSCAR LOS POSTS EN LA BD
  try {    
    const response = await Post.findAll({
      where: {idUser: userId},
      include:[{model:File}]
    });
    const posts = response.map(post => post.toJSON());
    //console.log(JSON.stringify(posts, null, 2));
    
    res.render("dashboard/posts.pug", { posts });
  } catch (error) {
    console.error("Error al buscar posts del usuario:", error);
    res.render("dashboard/posts.pug", { posts: [], error: "No se pudieron cargar los posts" });
  }
}